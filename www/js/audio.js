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
   ============================================================= */
(function (w) {
  var A = w.Speech = {};

  /* ---------- Native (Capacitor / Android-APK) ---------- */
  function nativeTTS() {
    try {
      var c = w.Capacitor;
      if (c && c.isNativePlatform && c.isNativePlatform() && c.Plugins && c.Plugins.TextToSpeech) {
        return c.Plugins.TextToSpeech;
      }
    } catch (e) {}
    return null;
  }

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
})(window);
