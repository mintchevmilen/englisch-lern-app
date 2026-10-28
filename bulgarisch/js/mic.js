/* Mikrofon-Baustein zum Nachsprechen. Mic.create({target, onResult, maxTries})
   liefert ein Element mit Knopf, Statusanzeige und Rueckmeldung.
   onResult(r) wird nach jedem Versuch gerufen:
   r = { level 0|1|2, heard, tries, success, final, unavailable } */
(function (w) {
  function enabled() {
    var st = w.Storage.getSettings();
    return st.mic !== false && w.Speaker.recogSupported();
  }

  function create(opts) {
    var U = w.Utils;
    var maxTries = opts.maxTries || 2;
    var tries = 0, busy = false, dead = false;

    var btn = U.el("button", { class: "mic-btn is-idle", type: "button", "aria-label": "Nachsprechen" }, [
      U.el("span", { class: "mic-ico", text: "🎤" })
    ]);
    var label = U.el("div", { class: "mic-label", text: "Tippe und sprich nach" });
    var msg = U.el("div", { class: "mic-msg" });
    var box = U.el("div", { class: "mic-box" }, [btn, label, msg]);

    function setState(st, text) {
      btn.className = "mic-btn is-" + st;
      label.textContent = text;
    }
    function say(cls, html) { msg.className = "mic-msg " + cls; msg.innerHTML = html; }
    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    function report(r) { if (opts.onResult) { try { opts.onResult(r); } catch (e) {} } }

    function run() {
      if (dead) return;
      if (busy) { w.Speaker.stopListening(); busy = false; setState("idle", "Tippe und sprich nach"); return; }
      busy = true; msg.textContent = ""; msg.className = "mic-msg";
      setState("waiting", "Ich höre zu … sprich jetzt!");
      w.Speaker.listen({
        onState: function (st) { if (st === "processing") setState("processing", "Einen Moment …"); else setState("waiting", "Ich höre zu … sprich jetzt!"); }
      }, function (res) {
        busy = false;
        if (!res.ok) {
          if (res.error === "denied") {
            setState("idle", "Mikrofon nicht erlaubt");
            say("bad", "Das Mikrofon ist nicht erlaubt. Eltern können das in den Handy-Einstellungen unter Apps freigeben.");
            dead = true; report({ level: 0, heard: "", tries: tries, success: false, final: true, unavailable: true });
            return;
          }
          if (res.error === "unavailable") {
            setState("idle", "Nicht möglich");
            say("bad", "Die Spracherkennung geht auf diesem Gerät leider nicht. Sprich es einfach laut nach. 😊");
            dead = true; report({ level: 0, heard: "", tries: tries, success: false, final: true, unavailable: true });
            return;
          }
          tries++;
          setState("idle", "Nochmal versuchen");
          say("soft", "Ich habe nichts gehört. Tippe auf das Mikrofon und sprich laut und deutlich.");
          report({ level: 0, heard: "", tries: tries, success: false, final: tries >= maxTries });
          return;
        }
        var sc = w.BgScore.score(res.matches, opts.target);
        tries++;
        if (sc.level === 2) {
          setState("done", "Super!");
          say("ok", "🎉 Genau richtig! Ich habe <b>" + esc(sc.heard) + "</b> verstanden.");
          report({ level: 2, heard: sc.heard, tries: tries, success: true, final: true });
        } else if (sc.level === 1) {
          setState("done", "Gut!");
          say("ok", "👍 Fast perfekt! Ich habe <b>" + esc(sc.heard) + "</b> verstanden. Gesucht war <b>" + esc(opts.target) + "</b>.");
          report({ level: 1, heard: sc.heard, tries: tries, success: true, final: true });
        } else {
          var fin = tries >= maxTries;
          setState("idle", fin ? "Weiter geht's" : "Nochmal versuchen");
          say("soft", "Ich habe <b>" + esc(sc.heard || "…") + "</b> verstanden." +
            (sc.alts.length ? " <span class=\"mic-alt\">(auch: " + sc.alts.map(esc).join(", ") + ")</span>" : "") +
            "<br>Gesucht war <b>" + esc(opts.target) + "</b>." + (fin ? " Das üben wir später nochmal." : " Hör nochmal zu und versuch es noch einmal."));
          report({ level: 0, heard: sc.heard, tries: tries, success: false, final: fin });
        }
      });
    }

    btn.addEventListener("click", run);
    box.stop = function () { dead = true; w.Speaker.stopListening(); };
    return box;
  }

  w.Mic = { create: create, enabled: enabled };
})(window);
