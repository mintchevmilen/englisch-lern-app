/* Rendert alle Bildschirme in #app. Jede Funktion bekommt den Container und
   greift auf window.App (Navigation), window.Storage, window.Gamification,
   window.Speaker und die Inhalts-Daten (window.BG_*) zu. */
(function () {
  var U = window.Utils;

  function speakBtn(text, opts) {
    opts = opts || {};
    var btn = U.el("button", { class: "speak-btn" + (opts.className ? " " + opts.className : ""), text: "🔊 " + (opts.label || "Anhören") });
    btn.addEventListener("click", function () { window.Speaker.speak(text); });
    return btn;
  }

  // ===================================================================
  // Splash
  // ===================================================================
  function renderSplash(container) {
    var wrap = U.el("div", { class: "screen splash" });
    wrap.appendChild(U.el("div", { class: "flag-emoji", text: "🇧🇬" }));
    wrap.appendChild(U.el("h1", { text: "Моето българско" }));
    wrap.appendChild(U.el("p", { class: "sub", text: "Mein Bulgarisch" }));
    wrap.appendChild(U.el("p", { class: "sub", text: "„Lerne Bulgarisch spielerisch!“" }));
    var startBtn = U.el("button", { class: "btn big mt-24", text: "Los geht's! 🚀" });
    startBtn.addEventListener("click", function () { window.App.navigate("profileSelect"); });
    wrap.appendChild(startBtn);
    container.appendChild(wrap);
  }

  // ===================================================================
  // Profil-Auswahl
  // ===================================================================
  function renderProfileSelect(container, params) {
    var wrap = U.el("div", { class: "screen" });
    if (params && params.fromMore) {
      var back = U.el("button", { class: "icon-btn small", text: "←" });
      back.addEventListener("click", function () { window.App.navigate("more"); });
      wrap.appendChild(U.el("div", { class: "back-row" }, [back, U.el("h2", { text: "Profil wechseln" })]));
    } else {
      wrap.appendChild(U.el("h1", { class: "center", text: "Wer lernt heute?", style: "font-size:24px" }));
    }

    var grid = U.el("div", { class: "profile-grid" });
    var options = [
      { id: "boy", emoji: "👦", label: "Junge", age: "11 Jahre" },
      { id: "girl", emoji: "👧", label: "Mädchen", age: "8 Jahre" }
    ];
    options.forEach(function (opt) {
      var card = U.el("div", { class: "profile-card" }, [
        U.el("span", { class: "emoji", text: opt.emoji }),
        U.el("div", { class: "name", text: opt.label }),
        U.el("div", { class: "age", text: opt.age })
      ]);
      card.addEventListener("click", function () {
        window.App.setProfile(opt.id);
        window.App.navigate("home");
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    container.appendChild(wrap);
  }

  // ===================================================================
  // Home / Lernpfad
  // ===================================================================
  function renderHome(container) {
    var profile = window.App.profile();
    var profileId = window.App.profileId;
    var level = window.Gamification.getLevel(profile.xp);
    var nextLevel = window.Gamification.getNextLevel(profile.xp);
    var streak = window.Gamification.touchStreak(profileId);
    var mission = window.Gamification.getDailyMission(profileId);

    var wrap = U.el("div", { class: "screen" });

    var chip = U.el("button", { class: "avatar-chip" }, [
      U.el("span", { class: "emoji", text: profile.avatar === "boy" ? "👦" : "👧" }),
      U.el("span", { text: profile.name })
    ]);
    chip.addEventListener("click", function () { window.App.navigate("profileSelect", { fromMore: true }); });

    var topBar = U.el("div", { class: "top-bar" }, [
      chip,
      U.el("div", { class: "row" }, [
        U.el("div", { class: "streak-badge" }, [U.el("span", { text: "🔥" }), U.el("span", { text: streak })]),
        U.el("div", { class: "xp-badge" }, [U.el("span", { text: "⭐" }), U.el("span", { text: profile.xp + " XP" })])
      ])
    ]);
    wrap.appendChild(topBar);

    var pct = nextLevel ? Math.round(((profile.xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100) : 100;
    var levelCard = U.el("div", { class: "level-card" }, [
      U.el("div", { class: "row" }, [
        U.el("span", { class: "lvl-icon", text: level.icon }),
        U.el("div", {}, [
          U.el("div", { class: "lvl-title", text: level.title }),
          U.el("div", { text: nextLevel ? ("Noch " + (nextLevel.minXp - profile.xp) + " XP bis " + nextLevel.title) : "Höchstes Level erreicht! 🏆", style: "font-size:13px;opacity:.9" })
        ])
      ]),
      U.el("div", { class: "progress-track" }, [U.el("div", { class: "progress-fill", style: "width:" + pct + "%" })])
    ]);
    wrap.appendChild(U.el("div", { class: "mt-16" }, [levelCard]));

    var t = window.Gamification.MISSION_TARGETS;
    var missionDone = window.Gamification.isMissionComplete(mission);
    var missionCard = U.el("div", { class: "mission-card" + (missionDone ? " done" : "") }, [
      U.el("h3", { text: "🇧🇬 Българска мисия — Tagesmission" }),
      missionRow("📚", "Lerne " + t.newWords + " neue Wörter", mission.newWords, t.newWords),
      missionRow("🗣️", "Sprich " + t.sentences + " Sätze nach", mission.sentences, t.sentences),
      missionRow("🎮", "Schließe ein Spiel ab", mission.games, t.games),
      U.el("div", { class: "mt-8", style: "font-weight:800;color:#6b4b00", text: missionDone ? "✅ Geschafft! +50 XP erhalten" : "⭐ Belohnung: +50 XP" })
    ]);
    wrap.appendChild(U.el("div", { class: "mt-16" }, [missionCard]));

    wrap.appendChild(U.el("div", { class: "section-title mt-24", text: "Dein Lernpfad" }));
    var pathWrap = U.el("div", { class: "path" });
    var lessons = window.BG_LESSONS;
    lessons.forEach(function (lesson, i) {
      var isDone = profile.completedLessons.indexOf(lesson.id) !== -1;
      var isLocked = i > 0 && profile.completedLessons.indexOf(lessons[i - 1].id) === -1 && !isDone;
      var node = U.el("button", { class: "path-node" + (isDone ? " done" : "") + (isLocked ? " locked" : "") }, [
        U.el("div", { class: "node-icon", text: lesson.icon }),
        U.el("div", { class: "grow" }, [
          U.el("div", { class: "node-title", text: lesson.title }),
          U.el("div", { class: "node-sub", text: lessonSubtitle(lesson) })
        ]),
        U.el("div", { class: "node-star", text: isDone ? "⭐" : (isLocked ? "🔒" : "▶️") })
      ]);
      if (!isLocked) {
        node.addEventListener("click", function () { window.App.navigate("lesson", { id: lesson.id }); });
      } else {
        node.disabled = true;
      }
      pathWrap.appendChild(node);
      if (i < lessons.length - 1) pathWrap.appendChild(U.el("div", { class: "path-connector" }));
    });
    wrap.appendChild(pathWrap);

    container.appendChild(wrap);
  }

  function missionRow(icon, label, done, target) {
    return U.el("div", { class: "mission-row" }, [
      U.el("span", { class: "check", text: done >= target ? "✅" : "⬜" }),
      U.el("span", { text: label + " (" + done + "/" + target + ")" })
    ]);
  }

  function lessonSubtitle(lesson) {
    if (lesson.type === "words" || lesson.type === "mixed") return lesson.wordIds.length + " Wörter";
    if (lesson.type === "alphabet") return lesson.letterIds.length + " Buchstaben";
    if (lesson.type === "sentences") return lesson.sentenceIds.length + " Sätze";
    if (lesson.type === "dialogue") return lesson.dialogueIds.length + " Gespräche";
    return "";
  }

  // ===================================================================
  // Lektion (Wörter / Buchstaben / Sätze / Dialoge -> Spiel -> Fertig)
  // ===================================================================
  function renderLesson(container, params) {
    var lesson = window.BG_LESSONS.find(function (l) { return l.id === params.id; });
    if (!lesson) { window.App.navigate("home"); return; }
    var profileId = window.App.profileId;
    var profile = window.App.profile();
    var gender = profile.gender;
    var startTime = Date.now();

    var items = [];
    if (lesson.type === "words" || lesson.type === "mixed") {
      items = lesson.wordIds.map(U.wordById).filter(Boolean);
    } else if (lesson.type === "alphabet") {
      items = lesson.letterIds.map(U.letterById).filter(Boolean);
    } else if (lesson.type === "sentences") {
      items = lesson.sentenceIds.map(U.sentenceById).filter(Boolean);
    } else if (lesson.type === "dialogue") {
      items = lesson.dialogueIds.map(U.dialogueById).filter(Boolean);
    }

    var totalSteps = items.length + (lesson.game ? 1 : 0) + 1;
    var cardIndex = 0;

    function progressDots(filled) {
      var track = U.el("div", { class: "lesson-progress" });
      for (var i = 0; i < totalSteps; i++) {
        track.appendChild(U.el("div", { class: "dot" + (i < filled ? " filled" : "") }));
      }
      return track;
    }

    function backRow() {
      var back = U.el("button", { class: "icon-btn small", text: "✕" });
      back.addEventListener("click", function () { window.App.navigate("home"); });
      return U.el("div", { class: "back-row" }, [back, U.el("div", { class: "grow" }, [progressDots(cardIndex)])]);
    }

    function attachMic(card, target, kind, itemId) {
      if (!window.Mic.enabled()) return;
      var rewarded = false;
      card.appendChild(window.Mic.create({
        target: target,
        maxTries: 3,
        onResult: function (r) {
          if (r.success && !rewarded) {
            rewarded = true;
            window.Gamification.recordItemResult(profileId, kind, itemId, true);
            window.Gamification.addXp(profileId, 2);
            window.App.showXpToast("+2 XP");
          }
        }
      }));
    }

    function renderCards() {
      container.innerHTML = "";
      var wrap = U.el("div", { class: "screen" });
      wrap.appendChild(backRow());

      var item = items[cardIndex];
      if (lesson.type === "alphabet") {
        wrap.appendChild(renderLetterCard(item));
        window.Gamification.bumpMission(profileId, "newWord");
      } else if (lesson.type === "sentences") {
        wrap.appendChild(renderSentenceCard(item));
        window.Gamification.bumpMission(profileId, "sentence");
      } else if (lesson.type === "dialogue") {
        wrap.appendChild(renderDialogueCard(item));
      } else {
        wrap.appendChild(renderWordCard(item));
        window.Gamification.bumpMission(profileId, "newWord");
      }

      var nextBtn = U.el("button", { class: "btn block big mt-24", text: cardIndex < items.length - 1 ? "Weiter ➜" : "Weiter zum Spiel 🎮" });
      if (lesson.type === "dialogue" && cardIndex === items.length - 1) nextBtn.textContent = "Fertig ➜";
      nextBtn.addEventListener("click", function () {
        cardIndex++;
        if (cardIndex < items.length) renderCards();
        else if (lesson.game) renderGame();
        else renderComplete({ correct: items.length, total: items.length });
      });
      wrap.appendChild(nextBtn);
      container.appendChild(wrap);
    }

    function renderWordCard(word) {
      var resolved = U.resolveGenderText(word, gender);
      window.Speaker.speak(resolved.bg);
      var card = U.el("div", { class: "card word-card" }, [
        U.el("div", { class: "big-emoji", html: word.emoji }),
        U.el("div", { class: "bg-word", text: resolved.bg }),
        U.el("div", { class: "latin", text: resolved.latin }),
        U.el("div", { class: "de-word", text: word.de })
      ]);
      if (word.genderVariant) {
        var other = gender === "male" ? word.genderVariant.female : word.genderVariant.male;
        var ownLabel = gender === "male" ? "👦 Als Junge sagst du:" : "👧 Als Mädchen sagst du:";
        card.appendChild(U.el("div", { class: "mt-8 muted", text: ownLabel + " " + resolved.bg }));
      }
      card.appendChild(U.el("div", { class: "row mt-16", style: "justify-content:center;gap:12px" }, [
        speakBtn(resolved.bg),
        window.Mic.enabled() ? null : U.el("span", { class: "muted", text: "🗣️ Sprich es nach!" })
      ]));
      attachMic(card, resolved.bg, "word", word.id);
      return card;
    }

    function renderLetterCard(letter) {
      window.Speaker.speak(letter.example.bg);
      var card = U.el("div", { class: "card letter-card" }, [
        U.el("div", { class: "letter-pair" }, [
          U.el("span", { class: "letter-big", text: letter.upper }),
          U.el("span", { class: "letter-big", text: letter.lower })
        ]),
        U.el("div", { class: "hint", text: letter.soundHint }),
        U.el("div", { class: "letter-example" }, [
          U.el("span", { class: "emoji", html: letter.example.emoji }),
          U.el("div", {}, [
            U.el("div", { style: "font-weight:800;color:var(--green);font-size:20px", text: letter.example.bg }),
            U.el("div", { class: "muted", text: letter.example.de })
          ])
        ])
      ]);
      card.appendChild(U.el("div", { class: "row mt-16", style: "justify-content:center" }, [speakBtn(letter.example.bg, { label: "Anhören" })]));
      return card;
    }

    function renderSentenceCard(sentence) {
      var resolved = U.resolveGenderText(sentence, gender);
      window.Speaker.speak(resolved.bg);
      var card = U.el("div", { class: "card word-card" }, [
        U.el("div", { class: "bg-word", text: resolved.bg, style: "font-size:30px" }),
        U.el("div", { class: "latin", text: resolved.latin }),
        U.el("div", { class: "de-word", text: sentence.de })
      ]);
      if (sentence.genderVariant) {
        var label = gender === "male" ? "👦 Als Junge sagst du:" : "👧 Als Mädchen sagst du:";
        card.appendChild(U.el("div", { class: "mt-8 muted", text: label + " " + resolved.bg }));
      }
      card.appendChild(U.el("div", { class: "row mt-16", style: "justify-content:center;gap:12px" }, [
        speakBtn(resolved.bg),
        window.Mic.enabled() ? null : U.el("span", { class: "muted", text: "🗣️ Sprich es nach!" })
      ]));
      attachMic(card, resolved.bg, "sentence", sentence.id);
      return card;
    }

    function renderDialogueCard(dialogue) {
      var card = U.el("div", { class: "card" }, [
        U.el("h3", { class: "center", text: dialogue.title + " — " + dialogue.subtitle })
      ]);
      var linesWrap = U.el("div", { class: "mt-16" });
      dialogue.lines.forEach(function (line) {
        var resolved = U.resolveGenderText(line, gender);
        var avatarEmoji = line.speaker === "kind" ? (profile.avatar === "boy" ? "👦" : "👧") : (line.speaker === "mama" ? "👩" : "👨");
        var lineEl = U.el("div", { class: "dialogue-line" + (line.speaker === "kind" ? " kind" : "") }, [
          U.el("span", { class: "avatar", text: avatarEmoji }),
          U.el("div", { class: "bubble grow" }, [
            U.el("div", { class: "bg", text: resolved.bg }),
            U.el("div", { class: "de", text: line.de })
          ])
        ]);
        var sBtn = U.el("button", { class: "icon-btn small", text: "🔊" });
        sBtn.addEventListener("click", function () { window.Speaker.speak(resolved.bg); });
        lineEl.appendChild(sBtn);
        linesWrap.appendChild(lineEl);
      });
      card.appendChild(linesWrap);
      return card;
    }

    function renderGame() {
      container.innerHTML = "";
      var wrap = U.el("div", { class: "screen" });
      wrap.appendChild(backRow());
      var gameContainer = U.el("div", { class: "mt-16" });
      wrap.appendChild(gameContainer);
      container.appendChild(wrap);

      var gameOpts = { profileId: profileId, gender: gender, kind: lesson.type === "sentences" ? "sentence" : "word", onComplete: renderComplete };
      if (lesson.game === "bilderquiz" || lesson.game === "hoerquiz" || lesson.game === "memory") {
        gameOpts.items = items;
        gameOpts.pool = items;
      } else if (lesson.game === "buchstabenjagd") {
        gameOpts.letters = items;
        gameOpts.pool = window.BG_ALPHABET;
      } else if (lesson.game === "satzbau") {
        gameOpts.sentences = items;
      }
      window.Games[lesson.game](gameContainer, gameOpts);
    }

    function renderComplete(result) {
      window.Gamification.markLessonComplete(profileId, lesson.id);
      var xpResult = window.Gamification.addXp(profileId, 20);
      window.Gamification.addLearningTime(profileId, Date.now() - startTime);

      container.innerHTML = "";
      var wrap = U.el("div", { class: "screen lesson-complete" });
      wrap.appendChild(U.el("div", { class: "big-check", text: "🎉" }));
      wrap.appendChild(U.el("h2", { text: "Super gemacht!" }));
      wrap.appendChild(U.el("p", { class: "muted", text: lesson.title + " abgeschlossen" }));
      if (result && result.total) {
        wrap.appendChild(U.el("p", { class: "mt-8", text: result.correct + " von " + result.total + " richtig" }));
      }
      wrap.appendChild(U.el("div", { class: "xp-gain", text: "+20 XP" }));
      if (xpResult.leveledUp) {
        wrap.appendChild(U.el("div", { class: "card mt-16", style: "background:linear-gradient(135deg,#8E5FE0,#6b46c1);color:white" }, [
          U.el("div", { style: "font-size:40px", text: xpResult.level.icon }),
          U.el("div", { style: "font-weight:800;font-size:18px", text: "Neues Level: " + xpResult.level.title + "!" })
        ]));
      }
      var homeBtn = U.el("button", { class: "btn block big mt-24", text: "Weiter zum Lernpfad" });
      homeBtn.addEventListener("click", function () { window.App.navigate("home"); });
      wrap.appendChild(homeBtn);
      container.appendChild(wrap);
    }

    if (items.length === 0 && lesson.game) renderGame();
    else if (items.length === 0) renderComplete({ correct: 0, total: 0 });
    else renderCards();
  }

  // ===================================================================
  // Spiele-Hub
  // ===================================================================
  function renderGamesHub(container) {
    var wrap = U.el("div", { class: "screen" });
    wrap.appendChild(U.el("h2", { text: "🎮 Spiele" }));
    wrap.appendChild(U.el("p", { class: "muted mt-8", text: "Übe frei, wann du willst." }));

    var weak = window.Gamification.getWeakItems(window.App.profileId, "word", 8)
      .map(function (e) { return U.wordById(e.id); }).filter(Boolean);

    var tiles = [
      { icon: "🔁", title: "Schwierige Wörter üben", disabled: weak.length < 3, action: function () { launchStandalone("bilderquiz", { items: weak.length >= 3 ? weak : window.BG_WORDS, pool: window.BG_WORDS, kind: "word" }); } },
      { icon: "🎯", title: "Bilderquiz", action: function () { launchStandalone("bilderquiz", { items: U.sample(window.BG_WORDS, 8), pool: window.BG_WORDS, kind: "word" }); } },
      { icon: "👂", title: "Hörquiz", action: function () { launchStandalone("hoerquiz", { items: U.sample(window.BG_WORDS, 8), pool: window.BG_WORDS, kind: "word" }); } },
      { icon: "🔤", title: "Buchstaben-Jagd", action: function () { launchStandalone("buchstabenjagd", { letters: window.BG_ALPHABET, pool: window.BG_ALPHABET }); } },
      { icon: "🧠", title: "Memory", action: function () { launchStandalone("memory", { items: U.sample(window.BG_WORDS, 6), kind: "word" }); } },
      { icon: "🧩", title: "Satzbau", action: function () { launchStandalone("satzbau", { sentences: U.sample(window.BG_SENTENCES, 5) }); } },
      { icon: "🎤", title: "Nachsprechen", action: function () {
          if (!window.Mic.enabled()) {
            window.App.showXpToast(window.Speaker.recogSupported() ? "Mikrofon ist im Elternbereich ausgeschaltet" : "Spracherkennung geht auf diesem Gerät nicht");
            return;
          }
          var words = U.sample(window.BG_WORDS, 5).map(function (x) { return { kind: "word", item: x }; });
          var sents = U.sample(window.BG_SENTENCES, 3).map(function (x) { return { kind: "sentence", item: x }; });
          launchStandalone("nachsprechen", { items: words.concat(sents) });
        } }
    ];

    var grid = U.el("div", { class: "option-grid mt-16" });
    tiles.forEach(function (t) {
      var card = U.el("div", { class: "option-card" + (t.disabled ? "" : "") }, [
        U.el("span", { class: "opt-emoji", text: t.icon }),
        U.el("span", { class: "opt-text", text: t.title, style: "font-size:15px" })
      ]);
      card.addEventListener("click", t.action);
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    container.appendChild(wrap);
  }

  function launchStandalone(gameName, extraOpts) {
    window.App.navigate("standaloneGame", { gameName: gameName, extraOpts: extraOpts });
  }

  function renderStandaloneGame(container, params) {
    var wrap = U.el("div", { class: "screen" });
    var back = U.el("button", { class: "icon-btn small", text: "✕" });
    back.addEventListener("click", function () { window.App.navigate("games"); });
    wrap.appendChild(U.el("div", { class: "back-row" }, [back]));
    var gameContainer = U.el("div", {});
    wrap.appendChild(gameContainer);
    container.appendChild(wrap);

    var profile = window.App.profile();
    var opts = Object.assign({ profileId: window.App.profileId, gender: profile.gender }, params.extraOpts, {
      onComplete: function (result) { renderStandaloneComplete(container, result, params); }
    });
    window.Games[params.gameName](gameContainer, opts);
  }

  function renderStandaloneComplete(container, result, params) {
    container.innerHTML = "";
    var wrap = U.el("div", { class: "screen lesson-complete" });
    wrap.appendChild(U.el("div", { class: "big-check", text: "🎉" }));
    wrap.appendChild(U.el("h2", { text: "Gut gemacht!" }));
    if (result && result.total) {
      wrap.appendChild(U.el("p", { text: result.correct + " von " + result.total + " richtig" }));
    }
    var again = U.el("button", { class: "btn block big mt-24", text: "Nochmal spielen 🔁" });
    again.addEventListener("click", function () { window.App.navigate("standaloneGame", params); });
    var back = U.el("button", { class: "btn outline block mt-16", text: "Zurück zu den Spielen" });
    back.addEventListener("click", function () { window.App.navigate("games"); });
    wrap.appendChild(again);
    wrap.appendChild(back);
    container.appendChild(wrap);
  }

  // ===================================================================
  // Wörterbuch
  // ===================================================================
  function renderWordbook(container, params) {
    var activeCat = (params && params.cat) || "alle";
    var profile = window.App.profile();
    var wrap = U.el("div", { class: "screen" });
    wrap.appendChild(U.el("h2", { text: "📖 Meine Wörter" }));

    var tabs = U.el("div", { class: "wb-tabs mt-16" });
    var allBtn = U.el("button", { class: "tab-alle" + (activeCat === "alle" ? " active" : ""), text: "Alle" });
    allBtn.addEventListener("click", function () { window.App.navigate("wordbook", { cat: "alle" }); });
    tabs.appendChild(allBtn);
    Object.keys(window.BG_CATEGORIES).forEach(function (key) {
      var cat = window.BG_CATEGORIES[key];
      var b = U.el("button", { class: activeCat === key ? "active" : "", text: cat.icon + " " + cat.title });
      b.addEventListener("click", function () { window.App.navigate("wordbook", { cat: key }); });
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs);

    var allWords = window.BG_WORDS.concat(window.Storage.getFamilyWords().map(function (w) {
      return Object.assign({ category: "familienwoerter" }, w);
    }));
    var list = activeCat === "alle" ? allWords : allWords.filter(function (w) { return w.category === activeCat; });

    var listWrap = U.el("div", { class: "wb-list mt-16" });
    if (list.length === 0) {
      listWrap.appendChild(U.el("div", { class: "empty-hint", text: "Noch keine Wörter hier." }));
    }
    list.forEach(function (word) {
      var status = profile.wordsStatus[word.id];
      var label = window.Gamification.boxLabel(status ? status.box : -1);
      if (!status) label = { icon: "⚪", label: "Neu" };
      var resolved = U.resolveGenderText(word, profile.gender);
      var item = U.el("div", { class: "wb-item" }, [
        U.el("span", { class: "wb-emoji", html: word.emoji || "❤️" }),
        U.el("div", { class: "grow" }, [
          U.el("div", { class: "wb-bg", text: resolved.bg }),
          U.el("div", { class: "wb-de", text: word.de })
        ]),
        U.el("span", { class: "wb-status", text: label.icon })
      ]);
      item.addEventListener("click", function () { window.Speaker.speak(resolved.bg); });
      listWrap.appendChild(item);
    });
    wrap.appendChild(listWrap);
    container.appendChild(wrap);
  }

  // ===================================================================
  // "Mehr" Menü
  // ===================================================================
  function renderMore(container) {
    var wrap = U.el("div", { class: "screen" });
    wrap.appendChild(U.el("h2", { text: "⭐ Mehr" }));
    var items = [
      { icon: "🔄", title: "Profil wechseln", action: function () { window.App.navigate("profileSelect", { fromMore: true }); } },
      { icon: "👪", title: "Unsere Familie", action: function () { window.App.navigate("family"); } },
      { icon: "📊", title: "Elternbereich", action: function () { window.App.navigate("parent"); } },
      { icon: "ℹ️", title: "Über die App", action: function () { window.App.navigate("about"); } }
    ];
    var stack = U.el("div", { class: "stack mt-16" });
    items.forEach(function (it) {
      var row = U.el("button", { class: "path-node" }, [
        U.el("div", { class: "node-icon", text: it.icon }),
        U.el("div", { class: "node-title grow", text: it.title }),
        U.el("div", { text: "▶️" })
      ]);
      row.addEventListener("click", it.action);
      stack.appendChild(row);
    });
    wrap.appendChild(stack);
    container.appendChild(wrap);
  }

  function renderAbout(container) {
    var wrap = U.el("div", { class: "screen" });
    var back = U.el("button", { class: "icon-btn small", text: "←" });
    back.addEventListener("click", function () { window.App.navigate("more"); });
    wrap.appendChild(U.el("div", { class: "back-row" }, [back, U.el("h2", { text: "Über die App" })]));
    var card = U.el("div", { class: "card stack" });
    card.appendChild(U.el("p", { text: "🇧🇬 Моето българско — Mein Bulgarisch hilft Kindern, spielerisch Bulgarisch zu lernen: hören, sehen, nachsprechen, erkennen und spielen." }));
    card.appendChild(U.el("p", { text: "Der Lernfortschritt wird nur auf diesem Gerät gespeichert." }));
    if (!window.Speaker.hasBulgarianVoice) {
      card.appendChild(U.el("p", { class: "muted", text: "Hinweis: Auf diesem Gerät wurde keine bulgarische Sprachstimme gefunden. Die Aussprache kann daher ungenau klingen." }));
    }
    wrap.appendChild(card);
    container.appendChild(wrap);
  }

  // ===================================================================
  // Elternbereich
  // ===================================================================
  function renderParent(container) {
    var profileId = window.App.profileId;
    var profile = window.App.profile();
    var wrap = U.el("div", { class: "screen" });
    var back = U.el("button", { class: "icon-btn small", text: "←" });
    back.addEventListener("click", function () { window.App.navigate("more"); });
    wrap.appendChild(U.el("div", { class: "back-row" }, [back, U.el("h2", { text: "📊 Elternbereich" })]));

    var switcher = U.el("div", { class: "row mt-8", style: "gap:8px" });
    ["boy", "girl"].forEach(function (pid) {
      var p = window.Storage.getProfile(pid);
      var b = U.el("button", { class: "btn " + (pid === profileId ? "" : "outline"), text: (pid === "boy" ? "👦 " : "👧 ") + p.name });
      b.style.flex = "1";
      b.addEventListener("click", function () { window.App.setProfile(pid); window.App.navigate("parent"); });
      switcher.appendChild(b);
    });
    wrap.appendChild(switcher);

    var learnedWords = Object.keys(profile.wordsStatus).length;
    var masteredWords = Object.values(profile.wordsStatus).filter(function (s) { return s.box >= 3; }).length;

    var statGrid = U.el("div", { class: "stat-grid mt-16" }, [
      statTile("⏱️", U.formatDuration(profile.learningTimeMs), "Lernzeit"),
      statTile("⭐", profile.xp + " XP", "Gesamt-XP"),
      statTile("🔥", profile.streak + " Tage", "Lernserie"),
      statTile("📚", learnedWords + " / " + window.BG_WORDS.length, "Wörter gelernt"),
      statTile("🏆", masteredWords, "Wörter gemeistert"),
      statTile("✅", profile.completedLessons.length + " / " + window.BG_LESSONS.length, "Themen fertig")
    ]);
    wrap.appendChild(statGrid);

    wrap.appendChild(U.el("div", { class: "section-title mt-24", text: "Fortschritt" }));
    var progressCard = U.el("div", { class: "card mt-8" });
    progressCard.appendChild(progressBar("Alphabet", pctOf(profile.lettersStatus, window.BG_ALPHABET.length), "color-green"));
    progressCard.appendChild(progressBar("Wörter", pctOf(profile.wordsStatus, window.BG_WORDS.length), "color-blue"));
    progressCard.appendChild(progressBar("Sätze", pctOf(profile.sentencesStatus, window.BG_SENTENCES.length), "color-pink"));
    var totalSeen = countSeen(profile.wordsStatus) + countSeen(profile.lettersStatus) + countSeen(profile.sentencesStatus);
    var totalAll = window.BG_WORDS.length + window.BG_ALPHABET.length + window.BG_SENTENCES.length;
    progressCard.appendChild(progressBar("Hören", Math.round((totalSeen / totalAll) * 100), "color-purple"));
    wrap.appendChild(progressCard);

    wrap.appendChild(U.el("div", { class: "section-title mt-24", text: "Schwierigste Wörter" }));
    var weak = window.Gamification.getWeakItems(profileId, "word", 5).filter(function (e) { return e.incorrect > 0; });
    var weakCard = U.el("div", { class: "card mt-8" });
    if (weak.length === 0) {
      weakCard.appendChild(U.el("div", { class: "empty-hint", text: "Noch keine Schwierigkeiten erkannt. 🎉" }));
    } else {
      weak.forEach(function (e) {
        var w = U.wordById(e.id);
        if (!w) return;
        weakCard.appendChild(U.el("div", { class: "hard-word-row" }, [
          U.el("span", { html: w.emoji, style: "font-size:22px" }),
          U.el("div", { class: "grow" }, [
            U.el("div", { style: "font-weight:700", text: w.bg + " — " + w.de })
          ]),
          U.el("span", { class: "muted", text: e.incorrect + "x falsch" })
        ]));
      });
    }
    wrap.appendChild(weakCard);

    wrap.appendChild(U.el("div", { class: "section-title mt-24", text: "Abgeschlossene Themen" }));
    var lessonCard = U.el("div", { class: "card mt-8" });
    if (profile.completedLessons.length === 0) {
      lessonCard.appendChild(U.el("div", { class: "empty-hint", text: "Noch keine Themen abgeschlossen." }));
    } else {
      profile.completedLessons.forEach(function (lid) {
        var l = window.BG_LESSONS.find(function (x) { return x.id === lid; });
        if (l) lessonCard.appendChild(U.el("div", { class: "hard-word-row" }, [U.el("span", { text: l.icon }), U.el("span", { text: l.title })]));
      });
    }
    wrap.appendChild(lessonCard);

    parentExtras(wrap);
    container.appendChild(wrap);
  }

  // ---------------------------------------------------------------
  // Elternbereich: Sprache & Mikrofon, Backup
  // ---------------------------------------------------------------
  function toggleRow(label, on, handler) {
    var b = U.el("button", { class: "btn " + (on ? "" : "outline"), text: on ? "An" : "Aus", style: "padding:8px 18px;min-width:84px" });
    b.addEventListener("click", handler);
    return U.el("div", { class: "row", style: "justify-content:space-between;margin-top:10px" }, [U.el("span", { text: label }), b]);
  }

  function bkName() { return "mein-bulgarisch-backup-" + window.Storage.todayStr() + ".json"; }

  function parentExtras(wrap) {
    var St = window.Storage, sp = window.Speaker;

    // ----- Sprache & Mikrofon
    wrap.appendChild(U.el("div", { class: "section-title mt-24", text: "Sprache & Mikrofon" }));
    var sc = U.el("div", { class: "card mt-8" });
    var cfg = St.getSettings();
    sc.appendChild(toggleRow("Sprachausgabe", cfg.sound !== false, function () {
      St.updateSettings(function (c) { c.sound = c.sound === false; }); window.App.navigate("parent");
    }));
    if (sp.recogSupported()) {
      sc.appendChild(toggleRow("Mikrofon beim Nachsprechen", cfg.mic !== false, function () {
        St.updateSettings(function (c) { c.mic = c.mic === false; }); window.App.navigate("parent");
      }));
    }
    sc.appendChild(U.el("div", { class: "muted mt-8", style: "font-size:13px", text:
      "Vorlesen: " + (sp.isSupported ? (sp.hasBulgarianVoice ? "verfügbar" : "keine bulgarische Stimme gefunden") : "auf diesem Gerät nicht verfügbar") +
      ". Spracherkennung: " + (sp.recogSupported() ? "verfügbar (Android fragt beim ersten Mal nach der Mikrofon-Erlaubnis)" : "auf diesem Gerät nicht verfügbar") + "." }));
    var out = U.el("pre", { class: "diag-out", text: "" });
    var diagRow = U.el("div", { class: "row mt-8", style: "flex-wrap:wrap;gap:8px" });
    [["Geräte-Info", "info"], ["🔊 Vorlesen testen", "tts"], ["🎤 Mikrofon testen", "mic"]].forEach(function (d) {
      var b = U.el("button", { class: "btn outline", text: d[0], style: "padding:8px 12px;font-size:14px" });
      b.addEventListener("click", function () {
        out.textContent = "";
        sp.diagnose(d[1], function (line) { out.textContent += line + "\n"; });
      });
      diagRow.appendChild(b);
    });
    if (sp.recogSupported()) {
      var stratBtn = U.el("button", { class: "btn outline", style: "padding:8px 12px;font-size:14px" });
      var showStrat = function () { stratBtn.textContent = "Erkennungs-Modus: " + sp.STRATEGIES[sp.getStrategy()].name; };
      showStrat();
      stratBtn.addEventListener("click", function () { sp.nextStrategy(); showStrat(); });
      diagRow.appendChild(stratBtn);
    }
    sc.appendChild(diagRow); sc.appendChild(out);
    wrap.appendChild(sc);

    // ----- Backup
    wrap.appendChild(U.el("div", { class: "section-title mt-24", text: "Backup & Wiederherstellung" }));
    var bc = U.el("div", { class: "card mt-8" });
    var lb = St.lastBackup();
    bc.appendChild(U.el("div", { class: "muted", style: "font-size:13px", text:
      "Das Backup enthält den Fortschritt beider Kinder und die Familienwörter als Text. Bewahre ihn an einem sicheren Ort auf (z. B. an dich selbst schicken). Letztes Backup: " +
      (lb ? new Date(lb).toLocaleDateString("de-DE") : "noch nie") }));
    var ta = U.el("textarea", { class: "bk-text", rows: "5", placeholder: "Backup-Text hier einfügen", hidden: "hidden" });

    function showText(t) { ta.hidden = false; ta.value = t; ta.focus(); ta.select(); }
    function importText(t) {
      var b = St.parseBackup(t);
      if (!b) { window.App.showXpToast("Das ist kein Backup dieser App"); return; }
      if (!window.confirm(St.describeBackup(b) + "\n\nJetzt einlesen?")) return;
      St.applyBackup(b);
      window.App.showXpToast("Backup eingelesen");
      setTimeout(function () { window.location.reload(); }, 400);
    }

    var copyBtn = U.el("button", { class: "btn block mt-8", text: "Backup kopieren" });
    copyBtn.addEventListener("click", function () {
      var text = St.backupText(); St.markBackup();
      var fb = function () { showText(text); window.App.showXpToast("Text markiert: lange drücken, Kopieren"); };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { window.App.showXpToast("Backup kopiert"); }, fb);
        else fb();
      } catch (e) { fb(); }
    });
    var fileBtn = U.el("button", { class: "btn outline block mt-8", text: "Backup als Datei speichern" });
    fileBtn.addEventListener("click", function () {
      var text = St.backupText(); St.markBackup();
      try {
        var f = new File([text], bkName(), { type: "application/json" });
        if (navigator.canShare && navigator.canShare({ files: [f] }) && navigator.share) {
          navigator.share({ files: [f], title: "Mein Bulgarisch Backup" })["catch"](function () {}); return;
        }
        var url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
        var a = document.createElement("a"); a.href = url; a.download = bkName();
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        window.App.showXpToast("Datei wird gespeichert (Downloads)");
      } catch (e) { showText(text); window.App.showXpToast("Als Datei klappt hier nicht: Text kopieren"); }
    });
    var openBtn = U.el("button", { class: "btn outline block mt-8", text: "Backup einfügen oder Datei laden" });
    var importRow = U.el("div", { class: "row mt-8", style: "gap:8px;flex-wrap:wrap", hidden: "hidden" });
    var impBtn = U.el("button", { class: "btn", text: "Einlesen", style: "padding:8px 16px" });
    impBtn.addEventListener("click", function () {
      if (!ta.value.trim()) { window.App.showXpToast("Bitte zuerst den Text einfügen"); return; }
      importText(ta.value);
    });
    var fileLabel = U.el("label", { class: "btn outline", style: "padding:8px 16px;cursor:pointer" }, ["Datei wählen"]);
    var fileIn = U.el("input", { type: "file", accept: ".json,application/json,text/plain", hidden: "hidden" });
    fileIn.addEventListener("change", function () {
      if (!fileIn.files || !fileIn.files[0]) return;
      var fr = new FileReader();
      fr.onload = function () { importText(String(fr.result || "")); };
      fr.onerror = function () { window.App.showXpToast("Datei nicht lesbar"); };
      fr.readAsText(fileIn.files[0]); fileIn.value = "";
    });
    fileLabel.appendChild(fileIn);
    importRow.appendChild(impBtn); importRow.appendChild(fileLabel);
    openBtn.addEventListener("click", function () { ta.hidden = !ta.hidden; importRow.hidden = ta.hidden; });
    bc.appendChild(copyBtn); bc.appendChild(fileBtn); bc.appendChild(openBtn);
    bc.appendChild(ta); bc.appendChild(importRow);

    var snaps = St.snapshots();
    if (snaps.length) {
      bc.appendChild(U.el("div", { class: "muted mt-16", style: "font-size:13px", text: "Automatische Sicherungen auf diesem Gerät (gehen bei Deinstallation verloren):" }));
      snaps.forEach(function (sn, i) {
        var rb = U.el("button", { class: "btn outline", text: "Zurückholen", style: "padding:6px 12px;font-size:13px" });
        rb.addEventListener("click", function () {
          if (!window.confirm("Sicherung vom " + new Date(sn.ts).toLocaleString("de-DE") + " zurückholen? Der jetzige Stand wird vorher gesichert.")) return;
          if (St.restoreSnapshot(i)) { window.App.showXpToast("Sicherung zurückgeholt"); setTimeout(function () { window.location.reload(); }, 400); }
          else window.App.showXpToast("Sicherung nicht lesbar");
        });
        bc.appendChild(U.el("div", { class: "row mt-8", style: "justify-content:space-between" }, [
          U.el("span", { style: "font-size:13px", text: new Date(sn.ts).toLocaleString("de-DE") + (sn.label ? " · " + sn.label : "") }), rb
        ]));
      });
    }
    wrap.appendChild(bc);
  }

  function statTile(icon, value, label) {
    return U.el("div", { class: "stat-tile" }, [
      U.el("div", { text: icon, style: "font-size:22px" }),
      U.el("div", { class: "stat-value", text: value }),
      U.el("div", { class: "stat-label", text: label })
    ]);
  }

  function progressBar(label, pct, colorClass) {
    return U.el("div", { class: "bar-row" }, [
      U.el("div", { class: "bar-label" }, [U.el("span", { text: label }), U.el("span", { text: pct + "%" })]),
      U.el("div", { class: "progress-track light" }, [U.el("div", { class: "progress-fill " + colorClass, style: "width:" + pct + "%" })])
    ]);
  }

  function pctOf(statusMap, total) {
    if (!total) return 0;
    var known = Object.values(statusMap).filter(function (s) { return s.box >= 1; }).length;
    return Math.min(100, Math.round((known / total) * 100));
  }

  function countSeen(statusMap) {
    return Object.values(statusMap).filter(function (s) { return s.seen > 0; }).length;
  }

  // ===================================================================
  // Familien-Modus
  // ===================================================================
  function renderFamily(container) {
    container.innerHTML = "";
    var wrap = U.el("div", { class: "screen" });
    var back = U.el("button", { class: "icon-btn small", text: "←" });
    back.addEventListener("click", function () { window.App.navigate("more"); });
    wrap.appendChild(U.el("div", { class: "back-row" }, [back, U.el("h2", { text: "👨‍👩‍👧‍👦 Нашето семейство" })]));
    wrap.appendChild(U.el("p", { class: "muted", text: "Füge eigene Wörter hinzu, die zu eurer Familie passen. Am besten von einem Erwachsenen ausfüllen." }));

    var form = U.el("div", { class: "card stack mt-16" });
    var bgInput = formField("Bulgarisch", "text", "z.B. лельо");
    var deInput = formField("Deutsch", "text", "z.B. Tante");
    var emojiInput = formField("Emoji (optional)", "text", "z.B. 👩");
    var catSelect = U.el("select", {});
    Object.keys(window.BG_CATEGORIES).forEach(function (key) {
      if (key === "familienwoerter") return;
      catSelect.appendChild(U.el("option", { value: key, text: window.BG_CATEGORIES[key].title }));
    });
    form.appendChild(bgInput.wrap);
    form.appendChild(deInput.wrap);
    form.appendChild(emojiInput.wrap);
    form.appendChild(U.el("div", { class: "form-field" }, [U.el("label", { text: "Kategorie" }), catSelect]));

    var addBtn = U.el("button", { class: "btn block", text: "➕ Wort hinzufügen" });
    addBtn.addEventListener("click", function () {
      var bg = bgInput.input.value.trim();
      var de = deInput.input.value.trim();
      if (!bg || !de) { window.App.showXpToast("Bitte Bulgarisch & Deutsch ausfüllen"); return; }
      window.Storage.addFamilyWord({ bg: bg, de: de, emoji: emojiInput.input.value.trim() || "❤️", category: catSelect.value });
      bgInput.input.value = ""; deInput.input.value = ""; emojiInput.input.value = "";
      renderFamily(container);
    });
    form.appendChild(addBtn);
    wrap.appendChild(form);

    wrap.appendChild(U.el("div", { class: "section-title mt-24", text: "Eure Familienwörter" }));
    var list = window.Storage.getFamilyWords();
    var listWrap = U.el("div", { class: "wb-list mt-8" });
    if (list.length === 0) {
      listWrap.appendChild(U.el("div", { class: "empty-hint", text: "Noch keine eigenen Wörter." }));
    }
    list.forEach(function (w) {
      var item = U.el("div", { class: "wb-item" }, [
        U.el("span", { class: "wb-emoji", html: w.emoji }),
        U.el("div", { class: "grow" }, [
          U.el("div", { class: "wb-bg", text: w.bg }),
          U.el("div", { class: "wb-de", text: w.de })
        ])
      ]);
      var actions = U.el("div", { class: "family-item-actions" });
      var playBtn = U.el("button", { class: "icon-btn small", text: "🔊" });
      playBtn.addEventListener("click", function () { window.Speaker.speak(w.bg); });
      var delBtn = U.el("button", { class: "icon-btn small", text: "🗑️" });
      delBtn.addEventListener("click", function () {
        window.Storage.removeFamilyWord(w.id);
        renderFamily(container);
      });
      actions.appendChild(playBtn);
      actions.appendChild(delBtn);
      item.appendChild(actions);
      listWrap.appendChild(item);
    });
    wrap.appendChild(listWrap);
    container.appendChild(wrap);
  }

  function formField(label, type, placeholder) {
    var input = U.el("input", { type: type, placeholder: placeholder });
    var wrapEl = U.el("div", { class: "form-field" }, [U.el("label", { text: label }), input]);
    return { wrap: wrapEl, input: input };
  }

  window.Screens = {
    splash: renderSplash,
    profileSelect: renderProfileSelect,
    home: renderHome,
    lesson: renderLesson,
    games: renderGamesHub,
    standaloneGame: renderStandaloneGame,
    wordbook: renderWordbook,
    more: renderMore,
    about: renderAbout,
    parent: renderParent,
    family: renderFamily
  };
})();
