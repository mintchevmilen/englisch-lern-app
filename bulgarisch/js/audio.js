/* Sprachausgabe (TTS) und Spracherkennung fuer Bulgarisch.

   Zwei Backends, automatisch gewaehlt:
   1) Android-App (Capacitor): Die System-WebView hat KEINE Web-Speech-API.
      Deshalb nutzt die App die nativen Plugins
      @capacitor-community/text-to-speech (Vorlesen) und
      @capacitor-community/speech-recognition (Nachsprechen).
   2) Browser/PWA (Chrome): speechSynthesis und SpeechRecognition.

   Ohne Stimme oder Erkennung bleibt die App voll benutzbar. Die Sprache wird
   immer ausdruecklich gesetzt (bg-BG), unabhaengig von der Handy-Sprache. */
(function (w) {
  var LANG = "bg-BG";
  var Speaker = (w.Speaker = {});

  /* Capacitor liegt nur im Hauptfenster. Laeuft die App als Kurs in einem iframe
     (Sammel-App), wird das Capacitor-Objekt des uebergeordneten Fensters genutzt. */
  function capOf(win) {
    try { if (win.Capacitor) return win.Capacitor; if (win.parent && win.parent !== win) return win.parent.Capacitor; } catch (e) {}
    return undefined;
  }

  /* ---------- Native (Capacitor) ---------- */
  function nativePlugin(name) {
    try {
      var c = capOf(w);
      if (!(c && c.isNativePlatform && c.isNativePlatform())) return null;
      if (c.Plugins && c.Plugins[name]) return c.Plugins[name];
      if (c.registerPlugin) return c.registerPlugin(name);
    } catch (e) {}
    return null;
  }
  function nativeTTS() { return nativePlugin("TextToSpeech"); }
  function nativeSR() { return nativePlugin("SpeechRecognition"); }
  function webSR() { return w.SpeechRecognition || w.webkitSpeechRecognition || null; }
  function msgOf(e) { return String((e && (e.message || e.errorMessage || e.code)) || e || ""); }

  /* Erkennungs-Modi. Manche Geraete verstehen "bg-BG" nicht, aber "bg", oder
     brauchen das Google-Sprachfenster. Der aktive Modus wird gespeichert. */
  var STRATS = [
    { name: "Standard (bg-BG)", lang: "bg-BG", popup: false },
    { name: "Kurzer Code (bg)", lang: "bg", popup: false },
    { name: "Google-Sprachfenster (bg-BG)", lang: "bg-BG", popup: true },
    { name: "Google-Sprachfenster (bg)", lang: "bg", popup: true }
  ];
  Speaker.STRATEGIES = STRATS;
  Speaker.getStrategy = function () {
    var i = 0;
    try { i = parseInt(settings().micStrategy, 10) || 0; } catch (e) {}
    return i >= 0 && i < STRATS.length ? i : 0;
  };
  Speaker.setStrategy = function (i) {
    try { w.Storage.updateSettings(function (c) { c.micStrategy = ((i % STRATS.length) + STRATS.length) % STRATS.length; }); } catch (e) {}
  };
  Speaker.nextStrategy = function () { var n = (Speaker.getStrategy() + 1) % STRATS.length; Speaker.setStrategy(n); return n; };

  function settings() {
    try { return w.Storage.getSettings(); } catch (e) { return { sound: true, mic: true, rate: 0.85 }; }
  }

  /* ---------- Web (Browser) ---------- */
  var synth = w.speechSynthesis || null;
  var bgVoice = null;
  function refreshVoices() {
    if (!synth) return;
    var vs = [];
    try { vs = synth.getVoices() || []; } catch (e) {}
    bgVoice = null;
    for (var i = 0; i < vs.length; i++) if (/^bg([-_]|$)/i.test(vs[i].lang)) { bgVoice = vs[i]; break; }
  }
  if (synth) {
    refreshVoices();
    if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", refreshVoices);
    else synth.onvoiceschanged = refreshVoices;
  }

  /* Native Stimme vorhanden? Wird beim ersten Start geprueft. */
  var nativeVoice = null;   // null = unbekannt, true/false = Ergebnis
  function checkNativeVoice() {
    var tts = nativeTTS();
    if (!tts || nativeVoice !== null) return;
    try {
      tts.isLanguageSupported({ lang: LANG }).then(function (r) { nativeVoice = !!(r && r.supported); }, function () { nativeVoice = false; });
    } catch (e) { nativeVoice = false; }
  }
  checkNativeVoice();

  Object.defineProperty(Speaker, "isSupported", {
    get: function () { return !!nativeTTS() || (!!synth && typeof w.SpeechSynthesisUtterance === "function"); }
  });
  Object.defineProperty(Speaker, "hasBulgarianVoice", {
    get: function () { return nativeTTS() ? nativeVoice !== false : !!bgVoice; }
  });
  Speaker.lastError = "";

  Speaker.speak = function (text, opts) {
    if (!text || !Speaker.isSupported) return false;
    var st = settings();
    if (st.sound === false) return false;
    opts = opts || {};
    var rate = opts.rate || st.rate || 0.85;
    var tts = nativeTTS();
    if (tts) {
      try {
        tts.speak({ text: String(text), lang: LANG, rate: rate, pitch: 1, volume: 1 })["catch"](function (e) {
          Speaker.lastError = msgOf(e);
        });
        return true;
      } catch (e) { return false; }
    }
    try {
      synth.cancel();
      var u = new w.SpeechSynthesisUtterance(String(text));
      u.lang = LANG;
      if (bgVoice) u.voice = bgVoice;
      u.rate = rate; u.pitch = 1; u.volume = 1;
      synth.speak(u);
      return true;
    } catch (e) { return false; }
  };

  Speaker.stop = function () {
    var tts = nativeTTS();
    if (tts) { try { tts.stop(); } catch (e) {} return; }
    try { if (synth) synth.cancel(); } catch (e) {}
  };

  /* ---------- Spracherkennung ---------- */
  var session = null, webRec = null;

  Speaker.recogSupported = function () { return !!nativeSR() || !!webSR(); };

  function abortAll(nativeToo) {
    if (nativeToo) {
      try { var sr = nativeSR(); if (sr && sr.stop) { var p = sr.stop(); if (p && p["catch"]) p["catch"](function () {}); } } catch (e) {}
    }
    try { if (webRec) webRec.abort(); } catch (e) {}
    webRec = null;
  }

  /* Nimmt einmal auf. opts.onState('waiting'|'processing'), opts.log(msg).
     cb(r) genau einmal: {ok:true, matches:[...]} oder
     {ok:false, error:'denied'|'unavailable'|'none'}  */
  Speaker.listen = function (opts, cb) {
    opts = opts || {};
    Speaker.stopListening();
    Speaker.stop();                       // eigene Sprachausgabe nicht mit aufnehmen
    var s = { done: false, timers: [] };
    session = s;
    function dbg(m) { if (opts.log) { try { opts.log(m); } catch (e) {} } }
    function state(x) { if (!s.done && opts.onState) { try { opts.onState(x); } catch (e) {} } }
    function later(fn, ms) { var id = setTimeout(fn, ms); s.timers.push(id); return id; }
    function finish(r) {
      if (s.done) return;
      s.done = true; s.timers.forEach(clearTimeout); s.timers = [];
      if (session === s) session = null;
      dbg("Ergebnis: " + JSON.stringify(r));
      try { cb(r); } catch (e) {}
    }
    later(function () { dbg("Zeitlimit erreicht"); finish({ ok: false, error: "none" }); abortAll(true); }, opts.timeout || 14000);

    function errKind(e) {
      var m = msgOf(e);
      if (/denied|permission|not allowed|missing/i.test(m)) return "denied";
      if (/not available|unavailable|not implemented|not supported|not found/i.test(m)) return "unavailable";
      return "none";
    }

    var strat = STRATS[opts.strategy !== undefined ? opts.strategy : Speaker.getStrategy()];
    var sr = nativeSR();
    if (sr) {
      dbg("natives Plugin, Modus: " + strat.name);
      try {
        sr.available().then(function (r) {
          dbg("available: " + JSON.stringify(r));
          if (!(r && r.available)) { finish({ ok: false, error: "unavailable" }); return; }
          return sr.checkPermissions().then(function (p) {
            if (p && p.speechRecognition === "granted") return true;
            return sr.requestPermissions().then(function (p2) { return !!p2 && p2.speechRecognition === "granted"; });
          }).then(function (granted) {
            if (s.done) return;
            if (!granted) { finish({ ok: false, error: "denied" }); return; }
            state("waiting");
            return sr.start({ language: strat.lang, maxResults: 5, prompt: strat.popup ? "Sprich auf Bulgarisch" : "", partialResults: false, popup: strat.popup }).then(function (res) {
              dbg("start() fertig: " + JSON.stringify(res));
              var m = (res && res.matches) || [];
              finish(m.length ? { ok: true, matches: m } : { ok: false, error: "none", detail: "keine Treffer" });
            });
          });
        })["catch"](function (e) { dbg("Fehler: " + msgOf(e)); finish({ ok: false, error: errKind(e), detail: msgOf(e) }); });
      } catch (e) { dbg("Ausnahme: " + msgOf(e)); finish({ ok: false, error: "unavailable" }); }
      return;
    }

    var R = webSR();
    if (!R) { finish({ ok: false, error: "unavailable" }); return; }
    try {
      var rec = (webRec = new R()), last = [];
      rec.lang = LANG; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 5;
      rec.onaudiostart = function () { state("waiting"); };
      rec.onspeechend = function () { state("processing"); };
      rec.onresult = function (ev) {
        var res = ev.results && ev.results[ev.results.length - 1], m = [], i;
        if (!res) return;
        for (i = 0; i < res.length; i++) m.push(res[i].transcript);
        if (m.length) last = m;
        if (res.isFinal) finish(m.length ? { ok: true, matches: m } : { ok: false, error: "none" });
      };
      rec.onerror = function (ev) {
        var er = ev && ev.error;
        finish({ ok: false, error: (er === "not-allowed" || er === "service-not-allowed") ? "denied"
          : (er === "no-speech" || er === "aborted") ? "none" : "unavailable" });
      };
      rec.onend = function () { finish(last.length ? { ok: true, matches: last } : { ok: false, error: "none" }); };
      rec.start();
    } catch (e) { dbg("Ausnahme: " + msgOf(e)); finish({ ok: false, error: "unavailable" }); }
  };

  Speaker.stopListening = function () {
    var s = session; session = null;
    if (s) { s.done = true; s.timers.forEach(clearTimeout); }
    abortAll(!!s);
  };

  /* ---------- Diagnose (Elternbereich) ---------- */
  Speaker.diagnose = function (kind, log) {
    var c = capOf(w), t0 = Date.now();
    function L(m) { log(((Date.now() - t0) / 1000).toFixed(1) + " s  " + m); }
    if (kind === "info") {
      var native = !!(c && c.isNativePlatform && c.isNativePlatform());
      L("App-Version: " + (w.APP_VERSION || "?"));
      L("Native App: " + (native ? "ja" : "nein (Browser)"));
      L("Vorlese-Plugin: " + (nativeTTS() ? "ja" : "nein") + " | Erkennungs-Plugin: " + (nativeSR() ? "ja" : "nein"));
      L("Browser-Sprachausgabe: " + (synth ? "ja" : "nein") + " | Browser-Erkennung: " + (webSR() ? "ja" : "nein"));
      L("Bulgarische Stimme: " + (Speaker.hasBulgarianVoice ? "ja oder noch unbekannt" : "nein"));
      L("Einstellungen: " + JSON.stringify(settings()));
      L("Erkennungs-Modus: " + STRATS[Speaker.getStrategy()].name);
      L("Letzter Fehler beim Vorlesen: " + (Speaker.lastError || "keiner"));
      return;
    }
    if (kind === "tts") {
      var tts = nativeTTS();
      if (!tts) {
        L("Kein natives Vorlese-Plugin. Browser-Stimme: " + (synth ? "ja, sage Test" : "nein"));
        if (synth) { try { synth.cancel(); var u = new w.SpeechSynthesisUtterance("Здравей!"); u.lang = LANG; u.onend = function () { L("Fertig gesprochen"); }; u.onerror = function (e) { L("Fehler: " + (e && e.error)); }; synth.speak(u); } catch (e) { L("Ausnahme: " + msgOf(e)); } }
        return;
      }
      tts.isLanguageSupported({ lang: LANG }).then(function (r) { L("bg-BG unterstützt: " + JSON.stringify(r)); }, function (e) { L("Sprachprüfung Fehler: " + msgOf(e)); });
      L("Sage „Здравей!“ ...");
      tts.speak({ text: "Здравей!", lang: LANG, rate: 0.85, pitch: 1, volume: 1 })
        .then(function () { L("Fertig gesprochen (ok)"); }, function (e) { L("Fehler beim Sprechen: " + msgOf(e)); });
      return;
    }
    if (kind === "mic") {
      if (!Speaker.recogSupported()) { L("Keine Spracherkennung verfügbar."); return; }
      var sr0 = nativeSR();
      L("Aktueller Modus: " + STRATS[Speaker.getStrategy()].name);
      if (sr0 && sr0.getSupportedLanguages) {
        sr0.getSupportedLanguages().then(function (r) {
          var l = (r && r.languages) || [];
          var bg = l.filter(function (x) { return /^bg/i.test(x); });
          L("Sprachen vom Gerät: " + l.length + ", bulgarisch darunter: " + (bg.length ? bg.join(", ") : "keine"));
        }, function (e) { L("Sprachliste nicht lesbar: " + msgOf(e)); });
      }
      L("Sprich jetzt „мама“ ...");
      Speaker.listen({ log: L, onState: function (st) { L("Status: " + st); } }, function (r) {
        L(r.ok ? "Verstanden: " + r.matches.join(" | ") : "Nichts erkannt (" + r.error + (r.detail ? ": " + r.detail : "") + ")");
      });
    }
  };
})(window);
