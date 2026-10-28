/* Alle Mini-Spiele. Jede Funktion rendert in `container` und ruft am Ende
   onComplete({correct, total}) auf. Gemeinsames Muster: Frage -> Antwort ->
   kurzes Feedback -> nächste Frage. */
(function () {
  var U = window.Utils;

  function playSound(text) { window.Speaker.speak(text); }

  function flash(el, ok) {
    el.classList.add(ok ? "correct" : "wrong");
  }

  // ---------------------------------------------------------------
  // Bilderquiz: Bild/Emoji sehen -> richtiges bulgarisches Wort tippen
  // ---------------------------------------------------------------
  function bilderquiz(container, opts) {
    runPickGame(container, opts, {
      questionKind: "image",
      buildQuestion: function (item) { return { emoji: item.emoji }; },
      buildOptionLabel: function (item) { return U.resolveGenderText(item, opts.gender).bg; },
      onShowQuestion: function () {}
    });
  }

  // ---------------------------------------------------------------
  // Hörquiz: Wort hören -> richtiges Bild/Emoji tippen
  // ---------------------------------------------------------------
  function hoerquiz(container, opts) {
    runPickGame(container, opts, {
      questionKind: "audio",
      buildQuestion: function (item) { return { spoken: U.resolveGenderText(item, opts.gender).bg }; },
      buildOptionLabel: function (item) { return item.emoji; },
      onShowQuestion: function (item) { playSound(U.resolveGenderText(item, opts.gender).bg); }
    });
  }

  function runPickGame(container, opts, cfg) {
    var items = U.shuffle(opts.items);
    var pool = opts.pool || opts.items;
    var idx = 0, correctCount = 0;
    var total = items.length;

    function render() {
      container.innerHTML = "";
      if (idx >= total) {
        return finish();
      }
      var item = items[idx];
      var q = cfg.buildQuestion(item);

      var header = U.el("div", { class: "game-header" });
      header.appendChild(U.el("div", { class: "score", text: "Frage " + (idx + 1) + " / " + total }));

      var promptWrap = U.el("div", { class: "center mt-16" });
      if (cfg.questionKind === "image") {
        promptWrap.appendChild(U.el("div", { class: "big-emoji", html: q.emoji, style: "font-size:90px" }));
        promptWrap.appendChild(U.el("div", { class: "prompt mt-8", text: "Was ist das?" }));
      } else {
        promptWrap.appendChild(U.el("div", { class: "prompt", text: "🔊 Hör zu!" }));
        var replay = U.el("button", { class: "speak-btn mt-16", text: "🔊 Nochmal hören" });
        replay.addEventListener("click", function () { playSound(q.spoken); });
        promptWrap.appendChild(replay);
      }

      var distractPool = pool.filter(function (p) { return p.id !== item.id; });
      var distractors = U.sample(distractPool, Math.min(2, distractPool.length));
      var options = U.shuffle([item].concat(distractors));

      var grid = U.el("div", { class: "option-grid" });
      var answered = false;
      options.forEach(function (opt) {
        var isImage = cfg.questionKind === "audio";
        var card = U.el("div", { class: "option-card" }, [
          isImage
            ? U.el("span", { class: "opt-emoji", html: opt.emoji })
            : U.el("span", { class: "opt-text", text: cfg.buildOptionLabel(opt) })
        ]);
        card.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var isCorrect = opt.id === item.id;
          flash(card, isCorrect);
          if (!isCorrect) {
            grid.querySelectorAll(".option-card").forEach(function (c, i) {
              if (options[i].id === item.id) flash(c, true);
            });
          } else {
            correctCount++;
          }
          window.Gamification.recordItemResult(opts.profileId, opts.kind || "word", item.id, isCorrect);
          window.App.showXpToast(isCorrect ? "+5 XP" : "Weiter üben!");
          if (isCorrect) window.Gamification.addXp(opts.profileId, 5);
          setTimeout(function () { idx++; render(); }, 1000);
        });
        grid.appendChild(card);
      });

      container.appendChild(header);
      container.appendChild(promptWrap);
      container.appendChild(grid);

      cfg.onShowQuestion(item);
    }

    function finish() {
      window.Gamification.bumpMission(opts.profileId, "game");
      if (typeof opts.onComplete === "function") {
        opts.onComplete({ correct: correctCount, total: total });
      }
    }

    render();
  }

  // ---------------------------------------------------------------
  // Buchstaben-Jagd: Buchstabe hören/lesen -> unter mehreren Buchstaben finden
  // ---------------------------------------------------------------
  function buchstabenjagd(container, opts) {
    var letters = U.shuffle(opts.letters);
    var pool = opts.pool || window.BG_ALPHABET;
    var idx = 0, correctCount = 0;
    var total = letters.length;

    function render() {
      container.innerHTML = "";
      if (idx >= total) return finish();
      var letter = letters[idx];

      var header = U.el("div", { class: "game-header" });
      header.appendChild(U.el("div", { class: "score", text: "Runde " + (idx + 1) + " / " + total }));
      header.appendChild(U.el("div", { class: "prompt mt-8", text: "Finde " + letter.upper + " " + letter.lower }));

      var replay = U.el("button", { class: "speak-btn", text: "🔊 " + letter.sound });
      replay.style.margin = "14px auto 0"; replay.style.display = "flex";
      replay.addEventListener("click", function () { playSound(letter.example.bg); });

      var distractPool = pool.filter(function (p) { return p.id !== letter.id; });
      var distractors = U.sample(distractPool, Math.min(5, distractPool.length));
      var options = U.shuffle([letter].concat(distractors));

      var row = U.el("div", { class: "letters-row" });
      var answered = false;
      options.forEach(function (opt) {
        var tile = U.el("div", { class: "letter-tile", text: opt.upper + opt.lower });
        tile.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var isCorrect = opt.id === letter.id;
          flash(tile, isCorrect);
          if (!isCorrect) {
            row.querySelectorAll(".letter-tile").forEach(function (t, i) {
              if (options[i].id === letter.id) flash(t, true);
            });
          } else {
            correctCount++;
          }
          window.Gamification.recordItemResult(opts.profileId, "letter", letter.id, isCorrect);
          window.App.showXpToast(isCorrect ? "+5 XP" : "Fast!");
          if (isCorrect) window.Gamification.addXp(opts.profileId, 5);
          setTimeout(function () { idx++; render(); }, 1000);
        });
        row.appendChild(tile);
      });

      container.appendChild(header);
      container.appendChild(replay);
      container.appendChild(row);
    }

    function finish() {
      window.Gamification.bumpMission(opts.profileId, "game");
      if (typeof opts.onComplete === "function") {
        opts.onComplete({ correct: correctCount, total: total });
      }
    }

    render();
  }

  // ---------------------------------------------------------------
  // Memory: Wort <-> Bild Paare finden
  // ---------------------------------------------------------------
  function memory(container, opts) {
    var items = U.sample(opts.items, Math.min(6, opts.items.length));
    var cards = [];
    items.forEach(function (item) {
      cards.push({ pairId: item.id, type: "emoji", display: item.emoji, item: item });
      cards.push({ pairId: item.id, type: "word", display: U.resolveGenderText(item, opts.gender).bg, item: item });
    });
    cards = U.shuffle(cards);

    var flipped = [];
    var matchedCount = 0;
    var moves = 0;

    container.innerHTML = "";
    var header = U.el("div", { class: "game-header" });
    header.appendChild(U.el("div", { class: "prompt", text: "🧠 Memory: Finde die Paare!" }));
    var scoreEl = U.el("div", { class: "score", text: "Paare: 0 / " + items.length });
    header.appendChild(scoreEl);
    container.appendChild(header);

    var grid = U.el("div", { class: "memory-grid" });
    container.appendChild(grid);

    var cardEls = cards.map(function (card, i) {
      var content = card.type === "emoji"
        ? U.el("span", { html: card.display, style: "font-size:34px" })
        : U.el("span", { class: "mc-bg", text: card.display });
      var cardEl = U.el("div", { class: "memory-card" }, [content]);
      cardEl.dataset.index = i;
      cardEl.addEventListener("click", function () { onFlip(i, cardEl); });
      grid.appendChild(cardEl);
      return cardEl;
    });

    function onFlip(i, cardEl) {
      if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;
      if (flipped.length === 2) return;
      cardEl.classList.add("flipped");
      flipped.push({ i: i, el: cardEl });
      if (cards[i].type === "word") playSound(cards[i].display);

      if (flipped.length === 2) {
        var a = cards[flipped[0].i], b = cards[flipped[1].i];
        moves++;
        if (a.pairId === b.pairId) {
          setTimeout(function () {
            flipped.forEach(function (f) { f.el.classList.add("matched"); });
            flipped = [];
            matchedCount++;
            scoreEl.textContent = "Paare: " + matchedCount + " / " + items.length;
            window.Gamification.recordItemResult(opts.profileId, opts.kind || "word", a.pairId, true);
            window.App.showXpToast("+10 XP");
            window.Gamification.addXp(opts.profileId, 10);
            if (matchedCount === items.length) {
              window.Gamification.bumpMission(opts.profileId, "game");
              setTimeout(function () {
                if (typeof opts.onComplete === "function") {
                  opts.onComplete({ correct: items.length, total: items.length, moves: moves });
                }
              }, 500);
            }
          }, 500);
        } else {
          setTimeout(function () {
            flipped.forEach(function (f) { f.el.classList.remove("flipped"); });
            flipped = [];
          }, 800);
        }
      }
    }
  }

  // ---------------------------------------------------------------
  // Satzbau: Wort-Karten in der richtigen Reihenfolge antippen (kein Tippen!)
  // ---------------------------------------------------------------
  function satzbau(container, opts) {
    var sentences = U.shuffle(opts.sentences);
    var idx = 0, correctCount = 0;
    var total = sentences.length;

    function render() {
      container.innerHTML = "";
      if (idx >= total) return finish();
      var sentence = sentences[idx];
      var resolved = U.resolveGenderText(sentence, opts.gender);
      var correctWords = resolved.bg.trim().split(/\s+/);
      var chips = U.shuffle(correctWords.map(function (w, i) { return { word: w, uid: i + "-" + w }; }));

      var header = U.el("div", { class: "game-header" });
      header.appendChild(U.el("div", { class: "score", text: "Satz " + (idx + 1) + " / " + total }));
      header.appendChild(U.el("div", { class: "prompt mt-8", text: sentence.de }));

      var replay = U.el("button", { class: "speak-btn", text: "🔊 Anhören" });
      replay.style.margin = "14px auto 0"; replay.style.display = "flex";
      replay.addEventListener("click", function () { playSound(resolved.bg); });

      var answerRow = U.el("div", { class: "answer-row" });
      var chipRow = U.el("div", { class: "chip-row" });

      var placed = [];
      var answered = false;

      function checkComplete() {
        if (placed.length !== correctWords.length) return;
        answered = true;
        var isCorrect = placed.join(" ") === correctWords.join(" ");
        var banner = U.el("div", { class: "feedback-banner show " + (isCorrect ? "ok" : "no"), text: isCorrect ? "🎉 Richtig!" : "Fast! Richtig wäre: " + resolved.bg });
        container.appendChild(banner);
        if (isCorrect) correctCount++;
        window.Gamification.recordItemResult(opts.profileId, "sentence", sentence.id, isCorrect);
        window.Gamification.bumpMission(opts.profileId, "sentence");
        window.App.showXpToast(isCorrect ? "+10 XP" : "Weiter üben!");
        if (isCorrect) window.Gamification.addXp(opts.profileId, 10);
        setTimeout(function () { idx++; render(); }, 1400);
      }

      chips.forEach(function (chip) {
        var btn = U.el("button", { class: "word-chip", text: chip.word });
        btn.addEventListener("click", function () {
          if (answered || btn.classList.contains("used")) return;
          btn.classList.add("used");
          placed.push(chip.word);
          answerRow.appendChild(U.el("span", { class: "word-chip", text: chip.word }));
          checkComplete();
        });
        chipRow.appendChild(btn);
      });

      container.appendChild(header);
      container.appendChild(replay);
      container.appendChild(U.el("div", { class: "mt-16" }, [answerRow]));
      container.appendChild(chipRow);
    }

    function finish() {
      window.Gamification.bumpMission(opts.profileId, "game");
      if (typeof opts.onComplete === "function") {
        opts.onComplete({ correct: correctCount, total: total });
      }
    }

    render();
  }

  // ---------------------------------------------------------------
  // Nachsprechen: Wort/Satz hören, ins Mikrofon nachsprechen
  // opts.items: [{kind:"word"|"sentence", item}]
  // ---------------------------------------------------------------
  function nachsprechen(container, opts) {
    var entries = opts.items.slice();
    var idx = 0, okCount = 0, total = entries.length;

    function render() {
      container.innerHTML = "";
      if (idx >= total) return finish();
      var entry = entries[idx], item = entry.item;
      var resolved = U.resolveGenderText(item, opts.gender);

      var header = U.el("div", { class: "game-header" });
      header.appendChild(U.el("div", { class: "score", text: "Nachsprechen " + (idx + 1) + " / " + total }));
      container.appendChild(header);

      var card = U.el("div", { class: "card word-card" });
      if (item.emoji) card.appendChild(U.el("div", { class: "big-emoji", html: item.emoji }));
      card.appendChild(U.el("div", { class: "bg-word", text: resolved.bg, style: entry.kind === "sentence" ? "font-size:30px" : "" }));
      card.appendChild(U.el("div", { class: "latin", text: resolved.latin }));
      card.appendChild(U.el("div", { class: "de-word", text: item.de }));
      var replay = U.el("button", { class: "speak-btn", text: "🔊 Anhören" });
      replay.style.margin = "14px auto 0"; replay.style.display = "flex";
      replay.addEventListener("click", function () { playSound(resolved.bg); });
      card.appendChild(replay);
      container.appendChild(card);

      var next = U.el("button", { class: "btn block big mt-16", text: "Weiter ➜", style: "display:none" });
      next.addEventListener("click", function () { w_stop(); idx++; render(); });

      var mic = window.Mic.create({
        target: resolved.bg,
        maxTries: 2,
        onResult: function (r) {
          if (r.unavailable) { next.style.display = ""; next.textContent = "Weiter ➜"; return; }
          if (r.success) {
            okCount++;
            window.Gamification.recordItemResult(opts.profileId, entry.kind, item.id, true);
            var xp = r.level === 2 ? 10 : 7;
            window.Gamification.addXp(opts.profileId, xp);
            window.App.showXpToast("+" + xp + " XP");
            if (entry.kind === "sentence") window.Gamification.bumpMission(opts.profileId, "sentence");
            next.style.display = "";
          } else if (r.final) {
            window.Gamification.recordItemResult(opts.profileId, entry.kind, item.id, false);
            next.style.display = "";
            next.textContent = "Weiter ➜ (das üben wir später)";
          }
        }
      });
      container.appendChild(mic);
      container.appendChild(next);
      setTimeout(function () { playSound(resolved.bg); }, 250);
    }

    function w_stop() { window.Speaker.stopListening(); }

    function finish() {
      w_stop();
      window.Gamification.bumpMission(opts.profileId, "game");
      if (typeof opts.onComplete === "function") opts.onComplete({ correct: okCount, total: total });
    }

    render();
  }

  window.Games = {
    bilderquiz: bilderquiz,
    hoerquiz: hoerquiz,
    buchstabenjagd: buchstabenjagd,
    memory: memory,
    satzbau: satzbau,
    nachsprechen: nachsprechen
  };
})();
