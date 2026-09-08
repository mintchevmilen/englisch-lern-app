/* =============================================================
   js/audio.js – Aussprache ueber die Web Speech API
   Warum diese Loesung: keine Audiodateien noetig (kein Download,
   kein Speicherplatz, funktioniert offline), Chrome auf Android
   bringt englische Stimmen mit. Wenn keine Stimme da ist, bleibt
   die App voll benutzbar – die Hoer-Aufgaben werden dann
   automatisch uebersprungen.
   ============================================================= */
(function (w) {
  var A = w.Speech = {};
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

  A.supported = function () { return !!synth && typeof w.SpeechSynthesisUtterance === 'function'; };
  A.ready = function () { return A.supported() && (ready || !!pickVoice()); };

  /* Manche Android-Versionen brauchen einen ersten Aufruf innerhalb
     einer echten Nutzer-Aktion. Das erledigt warmup(). */
  A.warmup = function () {
    if (warmed || !A.supported()) return;
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

  A.stop = function () { try { if (synth) synth.cancel(); } catch (e) {} };
})(window);
