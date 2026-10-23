/* =============================================================
   js/audio.js – Aussprache

   Zwei Backends, automatisch gewaehlt:
   1) Native Android-APK (Capacitor): window.speechSynthesis gibt es
      in der Android-System-WebView NICHT (seit Jahren eine bekannte
      Chromium-Einschraenkung) – deshalb nutzt die APK stattdessen
      das native Plugin @capacitor-community/text-to-speech, das die
      echte Android-TextToSpeech-Engine anspricht (lokal, offline,
      kein Download).
   2) Browser/PWA (Chrome): weiterhin die Web Speech API
      (speechSynthesis), wie bisher.
   Wenn gar keine Stimme verfuegbar ist, bleibt die App voll
   benutzbar – die Hoer-Aufgaben werden automatisch uebersprungen.

   Spracherkennung (Nachsprechen) funktioniert nach demselben Prinzip:
   - APK: natives Plugin @capacitor-community/speech-recognition
     (die Android-WebView hat keine Web-Speech-Erkennung),
   - Browser/PWA (Chrome): SpeechRecognition der Web Speech API.
   Ohne Erkennung bleibt das Nachsprechen wie bisher (Selbstkontrolle).
   ============================================================= */
(function (w) {
  var A = w.Speech = {};

  /* ---------- Native (Capacitor / Android-APK) ---------- */
  function nativePlugin(name) {
    try {
      var c = w.Capacitor;
      if (!(c && c.isNativePlatform && c.isNativePlatform())) return null;
      if (c.Plugins && c.Plugins[name]) return c.Plugins[name];
      if (c.registerPlugin) return c.registerPlugin(name);
    } catch (e) {}
    return null;
  }
  function nativeTTS() { return nativePlugin('TextToSpeech'); }

  var nativeLang = 'en-GB', nativeLangChecked = false;

  function pickNativeLang(tts) {
    if (nativeLangChecked) return;
    nativeLangChecked = true;
    try {
      tts.isLanguageSupported({ lang: 'en-GB' }).then(function (r) {
        if (r && r.supported) return;
        return tts.isLanguageSupported({ lang: 'en-US' }).then(function (r2) {
          if (r2 && r2.supported) nativeLang = 'en-US';
        });
      }).catch(function () { /* Default en-GB bleibt */ });
    } catch (e) {}
  }

  /* ---------- Web (Browser/PWA) ---------- */
  var synth = w.speechSynthesis || null;
  var voice = null, ready = false, warmed = false;

  function pickVoice() {
    if (!synth) return null;
    var vs = [];
    try { vs = synth.getVoices() || []; } catch (e) { return null; }
    if (!vs.length) return null;
    var i, v;
    for (i = 0; i < vs.length; i++) { v = vs[i]; if (/^en[-_]GB/i.test(v.lang)) return v; }
    for (i = 0; i < vs.length; i++) { v = vs[i]; if (/^en[-_]US/i.test(v.lang)) return v; }
    for (i = 0; i < vs.length; i++) { v = vs[i]; if (/^en/i.test(v.lang)) return v; }
    return null;
  }

  function init() {
    if (!synth) return;
    voice = pickVoice();
    ready = !!voice || (synth.getVoices && synth.getVoices().length > 0);
  }
  if (synth) {
    init();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = init;
    }
    setTimeout(init, 400);
    setTimeout(init, 1500);
  }

  /* ---------- Gemeinsame API ---------- */
  A.supported = function () {
    if (nativeTTS()) return true;
    return !!synth && typeof w.SpeechSynthesisUtterance === 'function';
  };
  A.ready = function () {
    if (nativeTTS()) return true;
    return A.supported() && (ready || !!pickVoice());
  };

  /* Manche Android-Browser-Versionen (PWA) brauchen einen ersten
     Aufruf innerhalb einer echten Nutzer-Aktion. In der nativen APK
     ist das nicht noetig. */
  A.warmup = function () {
    var tts = nativeTTS();
    if (tts) { pickNativeLang(tts); return; }
    if (warmed || !synth || typeof w.SpeechSynthesisUtterance !== 'function') return;
    warmed = true;
    try {
      var u = new w.SpeechSynthesisUtterance(' ');
      u.volume = 0; u.lang = 'en-GB';
      synth.speak(u);
    } catch (e) { /* egal */ }
  };

  A.speak = function (text, opts) {
    if (!text || !A.supported()) return false;
    if (!w.Store.data().settings.sound) return false;
    opts = opts || {};
    var tts = nativeTTS();
    if (tts) {
      try {
        pickNativeLang(tts);
        tts.speak({
          text: String(text),
          lang: nativeLang,
          rate: opts.rate || w.Store.data().settings.rate || 0.85,
          pitch: 1,
          volume: 1
        })['catch'](function () { /* z.B. keine TTS-Engine installiert */ });
        return true;
      } catch (e) { return false; }
    }
    try {
      synth.cancel();                       // haengende Ausgaben abbrechen
      if (!voice) voice = pickVoice();
      var u = new w.SpeechSynthesisUtterance(String(text));
      u.lang = (voice && voice.lang) || 'en-GB';
      if (voice) u.voice = voice;
      u.rate = opts.rate || w.Store.data().settings.rate || 0.85;
      u.pitch = 1;
      u.volume = 1;
      synth.speak(u);
      return true;
    } catch (e) { return false; }
  };

  A.stop = function () {
    var tts = nativeTTS();
    if (tts) { try { tts.stop(); } catch (e) {} return; }
    try { if (synth) synth.cancel(); } catch (e) {}
  };

  /* ---------- Spracherkennung ---------- */
  var session = null, webRec = null;

  function nativeSR() { return nativePlugin('SpeechRecognition'); }
  function webSR() { return w.SpeechRecognition || w.webkitSpeechRecognition || null; }

  A.recogSupported = function () { return !!nativeSR() || !!webSR(); };

  /* Nimmt einmal auf und ruft cb({ok:true, matches:[...]}) oder
     cb({ok:false, error:'denied'|'unavailable'|'none'}) genau einmal auf.
     'denied' = Mikrofon nicht erlaubt, 'unavailable' = keine Erkennung
     auf diesem Geraet, 'none' = nichts verstanden. */
  A.listen = function (opts, cb) {
    opts = opts || {};
    A.stopListening();
    A.stop();                                   // eigene Sprachausgabe nicht mit aufnehmen
    var lang = opts.lang || 'en-GB';
    var s = { done: false, timer: null };
    session = s;
    function finish(r) {
      if (s.done) return;
      s.done = true; clearTimeout(s.timer);
      if (session === s) session = null;
      try { cb(r); } catch (e) {}
    }
    s.timer = setTimeout(function () {
      if (s.done) return;
      A.stopListening(true);
      finish({ ok: false, error: 'none' });
    }, opts.timeout || 12000);

    var sr = nativeSR();
    if (sr) {
      try {
        sr.available().then(function (r) {
          if (!(r && r.available)) { finish({ ok: false, error: 'unavailable' }); return; }
          return sr.checkPermissions().then(function (p) {
            if (p && p.speechRecognition === 'granted') return true;
            return sr.requestPermissions().then(function (p2) { return !!p2 && p2.speechRecognition === 'granted'; });
          }).then(function (granted) {
            if (s.done) return;
            if (!granted) { finish({ ok: false, error: 'denied' }); return; }
            return sr.start({ language: lang, maxResults: 5, prompt: '', partialResults: false, popup: false })
              .then(function (res) {
                var m = (res && res.matches) || [];
                finish(m.length ? { ok: true, matches: m } : { ok: false, error: 'none' });
              });
          });
        })['catch'](function (e) {
          var msg = String((e && (e.message || e.errorMessage)) || e || '');
          finish({ ok: false, error: /denied|permission|not allowed/i.test(msg) ? 'denied' : 'none' });
        });
      } catch (e) { finish({ ok: false, error: 'unavailable' }); }
      return;
    }

    var R = webSR();
    if (!R) { finish({ ok: false, error: 'unavailable' }); return; }
    try {
      var rec = webRec = new R();
      rec.lang = lang; rec.interimResults = false; rec.continuous = false; rec.maxAlternatives = 5;
      rec.onresult = function (ev) {
        var m = [], res = ev.results && ev.results[0], i;
        if (res) for (i = 0; i < res.length; i++) m.push(res[i].transcript);
        finish(m.length ? { ok: true, matches: m } : { ok: false, error: 'none' });
      };
      rec.onerror = function (ev) {
        var er = ev && ev.error;
        finish({ ok: false, error: (er === 'not-allowed' || er === 'service-not-allowed') ? 'denied'
          : (er === 'no-speech' || er === 'aborted') ? 'none' : 'unavailable' });
      };
      rec.onend = function () { finish({ ok: false, error: 'none' }); };
      rec.start();
    } catch (e) { finish({ ok: false, error: 'unavailable' }); }
  };

  /* Aufnahme abbrechen. Ein noch ausstehender Rueckruf wird NICHT mehr
     aufgerufen (z. B. wenn der Nutzer zur naechsten Aufgabe weitergeht). */
  A.stopListening = function () {
    var s = session; session = null;
    if (s) {
      s.done = true; clearTimeout(s.timer);
      try { var sr = nativeSR(); if (sr && sr.stop) { var p = sr.stop(); if (p && p['catch']) p['catch'](function () {}); } } catch (e) {}
    }
    try { if (webRec) { webRec.abort(); } } catch (e) {}
    webRec = null;
  };
})(window);
