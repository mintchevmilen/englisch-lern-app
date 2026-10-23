/* =============================================================
   js/engine.js – Aufgaben erzeugen (Engine) + Uebungs-Player
   ============================================================= */
(function (w) {
  var D = w.DATA, S = w.Store, SRS = w.SRS;
  var E = w.Engine = {};

  /* ---------------------------------------------------------
     1. Antwortpruefung
     --------------------------------------------------------- */
  var CONTR = [
    ["i'm", "i am"], ["you're", "you are"], ["we're", "we are"], ["they're", "they are"],
    ["he's", "he is"], ["she's", "she is"], ["it's", "it is"], ["that's", "that is"],
    ["there's", "there is"], ["what's", "what is"], ["who's", "who is"],
    ["isn't", "is not"], ["aren't", "are not"], ["wasn't", "was not"], ["weren't", "were not"],
    ["don't", "do not"], ["doesn't", "does not"], ["didn't", "did not"],
    ["haven't", "have not"], ["hasn't", "has not"], ["hadn't", "had not"],
    ["can't", "can not"], ["cannot", "can not"], ["won't", "will not"],
    ["i've", "i have"], ["we've", "we have"], ["you've", "you have"], ["they've", "they have"],
    ["i'll", "i will"], ["let's", "let us"]
  ];
  var BRIT = [["favorite", "favourite"], ["color", "colour"], ["colors", "colours"],
              ["neighbor", "neighbour"], ["traveled", "travelled"], ["practice the", "practise the"]];

  function norm(s) {
    return String(s == null ? '' : s)
      .replace(/[‘’´`]/g, "'")
      .toLowerCase()
      .replace(/[.!?,;:]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function canon(s) {
    var t = ' ' + norm(s) + ' ', i;
    for (i = 0; i < CONTR.length; i++) {
      t = t.split(' ' + CONTR[i][0] + ' ').join(' ' + CONTR[i][1] + ' ');
    }
    for (i = 0; i < BRIT.length; i++) {
      t = t.split(' ' + BRIT[i][0] + ' ').join(' ' + BRIT[i][1] + ' ');
    }
    return t.replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    if (Math.abs(m - n) > 2) return 3;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
      }
      for (j = 0; j <= n; j++) prev[j] = cur[j];
    }
    return prev[n];
  }
  /* Rueckgabe: 2 = richtig, 1 = fast richtig (Tippfehler), 0 = falsch */
  E.check = function (given, task) {
    var list = [task.a].concat(task.alt || []);
    var g = canon(given), i;
    if (!g) return 0;
    for (i = 0; i < list.length; i++) if (canon(list[i]) === g) return 2;
    if (task.strict) return 0;
    for (i = 0; i < list.length; i++) {
      var t = canon(list[i]);
      if (t.length > 4 && lev(t, g) <= 1) return 1;
    }
    return 0;
  };
  E.norm = norm;

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  E.shuffle = shuffle;

  /* ---------------------------------------------------------
     2. Aufgaben-Generatoren
     --------------------------------------------------------- */
  function mcFromWord(it, dir) {           // dir: 'en2de' | 'de2en'
    var from = dir === 'en2de' ? 'en' : 'de';
    var to   = dir === 'en2de' ? 'de' : 'en';
    var wrong = SRS.distractors(it, 3, to);
    if (wrong.length < 3) return null;
    var opts = shuffle([it[to]].concat(wrong.map(function (x) { return x[to]; })));
    return {
      kind: 'mc',
      prompt: dir === 'en2de' ? 'Was heißt das auf Deutsch?' : 'Wie heißt das auf Englisch?',
      question: it[from],
      opts: opts, a: opts.indexOf(it[to]),
      why: it.en + ' = ' + it.de + (it.tip ? ' – ' + it.tip : ''),
      speak: it.en, wordId: it.id
    };
  }
  function typeFromWord(it) {
    return {
      kind: 'input',
      prompt: 'Schreibe das englische Wort:',
      question: it.de,
      a: it.en, strict: true,
      why: it.de + ' = ' + it.en + (it.tip ? ' – ' + it.tip : ''),
      speak: it.en, wordId: it.id, ph: 'English ...'
    };
  }
  function transFromWord(it) {
    return {
      kind: 'input',
      prompt: 'Übersetze ins Deutsche:',
      question: it.en,
      a: it.de, alt: it.de.split(/\s*,\s*/),
      why: it.en + ' = ' + it.de,
      speak: it.en, wordId: it.id, ph: 'Deutsch ...', de: true
    };
  }
  function gapFromWord(it) {
    if (!it.ex) return null;
    var re = new RegExp('\\b' + it.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (!re.test(it.ex)) return null;
    return {
      kind: 'input',
      prompt: 'Setze das fehlende Wort ein (' + it.de + '):',
      question: it.ex.replace(re, '_____'),
      a: it.en, strict: true,
      why: 'Richtig: ' + it.ex + ' (' + it.en + ' = ' + it.de + ')',
      speak: it.ex, wordId: it.id, ph: 'Wort ...'
    };
  }
  function listenFromWord(it) {
    var wrong = SRS.distractors(it, 3, 'de');
    if (wrong.length < 3) return null;
    var opts = shuffle([it.de].concat(wrong.map(function (x) { return x.de; })));
    return {
      kind: 'mc', listen: true,
      prompt: 'Hör zu und wähle die richtige Bedeutung:',
      question: '🔊', opts: opts, a: opts.indexOf(it.de),
      why: it.en + ' = ' + it.de,
      speak: it.en, autoSpeak: true, wordId: it.id
    };
  }

  var GEN = { mc1: function (it) { return mcFromWord(it, 'en2de'); },
              mc2: function (it) { return mcFromWord(it, 'de2en'); },
              type: typeFromWord, trans: transFromWord, gap: gapFromWord, listen: listenFromWord };

  /* Vokabel-Aufgaben aus einer Wortliste bauen. */
  E.vocabTasks = function (items, modes, perWord) {
    modes = modes || ['mc1', 'mc2', 'type', 'gap'];
    perWord = perWord || 1;
    var out = [], i, k, m, t, order;
    for (i = 0; i < items.length; i++) {
      order = shuffle(modes.slice());
      var made = 0;
      for (k = 0; k < order.length && made < perWord; k++) {
        m = order[k];
        t = GEN[m] ? GEN[m](items[i]) : null;
        if (t) { out.push(t); made++; }
      }
      if (!made) { t = mcFromWord(items[i], 'en2de'); if (t) out.push(t); }
    }
    return shuffle(out);
  };

  /* Lernkarten (erst sehen, dann testen) */
  E.introTasks = function (items) {
    var out = [];
    for (var i = 0; i < items.length; i++) {
      out.push({ kind: 'card', question: items[i].en, sub: items[i].de,
                 ex: items[i].ex, exDe: items[i].exDe, tip: items[i].tip,
                 speak: items[i].en, autoSpeak: true, wordId: items[i].id, intro: true });
    }
    return out;
  };

  /* Grammatik: rohe Datenobjekte in Player-Aufgaben umwandeln. */
  function fromRaw(r, gid) {
    var t;
    if (r.t === 'mc') {
      t = { kind: 'mc', prompt: 'Wähle die richtige Antwort:', question: r.q,
            opts: r.opts.slice(), a: r.a, why: r.why };
    } else if (r.t === 'gap') {
      t = { kind: 'input', prompt: 'Setze ein:', question: r.q, a: r.a, alt: r.alt || [],
            why: r.why, ph: '...' };
    } else if (r.t === 'order') {
      t = { kind: 'order', prompt: 'Bringe die Wörter in die richtige Reihenfolge:',
            words: shuffle(r.words.slice()), a: r.a, why: r.why, speak: r.a };
    } else if (r.t === 'trans') {
      t = { kind: 'input', prompt: 'Übersetze ins Englische:', question: r.de,
            a: r.a, alt: r.alt || [], why: r.why, ph: 'English ...', speak: r.a };
    } else { return null; }
    t.gid = gid;
    return t;
  }
  E.fromRaw = fromRaw;

  E.grammarTasks = function (gid, level) {
    var g = D.grammar[gid]; if (!g) return [];
    var raw = (level === 'challenge' ? g.challenge : g.practice) || [];
    var out = [];
    for (var i = 0; i < raw.length; i++) { var t = fromRaw(raw[i], gid); if (t) out.push(t); }
    return out;
  };

  E.readingTasks = function (uid) {
    var c = D.content[uid]; if (!c || !c.reading) return [];
    var out = [], qs = c.reading.qs || [];
    for (var i = 0; i < qs.length; i++) {
      var t = fromRaw({ t: qs[i].t, q: qs[i].q, opts: qs[i].opts, a: qs[i].a, why: qs[i].why, alt: qs[i].alt }, null);
      if (t) { t.prompt = 'Frage zum Text:'; out.push(t); }
    }
    return out;
  };

  E.writingTasks = function (uid) {
    var c = D.content[uid]; if (!c || !c.writing) return [];
    var out = [];
    for (var i = 0; i < c.writing.length; i++) { var t = fromRaw(c.writing[i], null); if (t) out.push(t); }
    return out;
  };

  E.everydayTasks = function (uid) {
    var c = D.content[uid]; if (!c || !c.everyday) return [];
    var ph = c.everyday, out = [], i;
    for (i = 0; i < ph.length; i++) {
      var others = ph.filter(function (x, k) { return k !== i; });
      shuffle(others);
      var opts = shuffle([ph[i].de].concat(others.slice(0, 3).map(function (x) { return x.de; })));
      out.push({ kind: 'mc', prompt: 'Was bedeutet dieser Satz?', question: ph[i].en,
                 opts: opts, a: opts.indexOf(ph[i].de),
                 why: ph[i].en + ' = ' + ph[i].de + (ph[i].note ? ' – ' + ph[i].note : ''),
                 speak: ph[i].en });
    }
    return shuffle(out);
  };

  E.speakingTasks = function (items) {
    var out = [];
    for (var i = 0; i < items.length; i++) {
      out.push({ kind: 'repeat', prompt: 'Hör zu und sprich nach:',
                 question: items[i].en, sub: items[i].de, ex: items[i].ex,
                 speak: items[i].en, autoSpeak: true, wordId: items[i].id });
    }
    return out;
  };

  E.listeningTasks = function (items) {
    var out = [], t;
    for (var i = 0; i < items.length; i++) { t = listenFromWord(items[i]); if (t) out.push(t); }
    return shuffle(out);
  };

  /* Gemischter Test.
     opts: {unit:'u1'|null, level:'easy'|'normal'|'hard', n:20, parts:['vocab','grammar','reading','writing','listening']} */
  E.mixedTest = function (opts) {
    opts = opts || {};
    var n = opts.n || 20, lvl = opts.level || 'normal';
    var parts = opts.parts || ['vocab', 'grammar', 'reading', 'writing'];
    var units = opts.unit ? [opts.unit] : D.units.map(function (u) { return u.id; });
    var pool = [], i, j;

    if (parts.indexOf('vocab') >= 0) {
      var wl = [];
      for (i = 0; i < units.length; i++) wl = wl.concat(SRS.ofUnit(units[i]));
      wl = SRS.pick({ ids: wl.map(function (x) { return x.id; }), n: Math.ceil(n * 0.8) });
      var modes = lvl === 'easy' ? ['mc1', 'mc2'] : (lvl === 'hard' ? ['type', 'gap', 'trans'] : ['mc1', 'mc2', 'type', 'gap']);
      pool = pool.concat(E.vocabTasks(wl, modes, 1));
    }
    if (parts.indexOf('grammar') >= 0) {
      for (i = 0; i < units.length; i++) {
        var u = E.unitById(units[i]); if (!u) continue;
        for (j = 0; j < u.grammar.length; j++) {
          pool = pool.concat(E.grammarTasks(u.grammar[j], lvl === 'hard' ? 'challenge' : 'practice'));
          if (lvl === 'normal') pool = pool.concat(E.grammarTasks(u.grammar[j], 'challenge').slice(0, 1));
        }
      }
    }
    if (parts.indexOf('reading') >= 0 && opts.unit) pool = pool.concat(E.readingTasks(opts.unit));
    if (parts.indexOf('writing') >= 0) for (i = 0; i < units.length; i++) pool = pool.concat(E.writingTasks(units[i]));
    if (parts.indexOf('listening') >= 0 && w.Speech.ready()) {
      var lw = [];
      for (i = 0; i < units.length; i++) lw = lw.concat(SRS.ofUnit(units[i]));
      pool = pool.concat(E.listeningTasks(shuffle(lw).slice(0, 4)));
    }
    if (parts.indexOf('everyday') >= 0) for (i = 0; i < units.length; i++) pool = pool.concat(E.everydayTasks(units[i]));

    shuffle(pool);
    return pool.slice(0, n);
  };

  E.unitById = function (id) {
    for (var i = 0; i < D.units.length; i++) if (D.units[i].id === id) return D.units[i];
    return null;
  };

  /* ---------------------------------------------------------
     3. Lektionen einer Unit (wird aus den Daten abgeleitet)
     --------------------------------------------------------- */
  var CHUNK = 8;   // Woerter pro Vokabel-Lektion

  E.lessonsOf = function (uid) {
    var u = E.unitById(uid); if (!u) return [];
    var out = [], i;
    var words = SRS.ofUnit(uid);

    for (i = 0; i < words.length; i += CHUNK) {
      var part = Math.floor(i / CHUNK) + 1;
      out.push({
        id: uid + ':voc' + part, type: 'vocabulary', unit: uid,
        title: 'Vocabulary ' + part,
        sub: words.slice(i, i + CHUNK).length + ' Wörter',
        icon: '📚', from: i, to: i + CHUNK, empty: false
      });
    }
    if (!words.length) out.push({ id: uid + ':voc0', type: 'vocabulary', unit: uid, title: 'Vocabulary', sub: 'Content to be added', icon: '📚', empty: true });

    for (i = 0; i < u.grammar.length; i++) {
      var g = D.grammar[u.grammar[i]];
      out.push({
        id: uid + ':gram:' + u.grammar[i], type: 'grammar', unit: uid, gid: u.grammar[i],
        title: g ? g.title : 'Grammar', sub: g ? g.titleDe : 'Content to be added',
        icon: '🧩', empty: !g
      });
    }
    var c = D.content[uid] || {};
    out.push({ id: uid + ':listen', type: 'listening', unit: uid, title: 'Listening',
               sub: w.Speech.supported() ? 'Hörverständnis' : 'Sprachausgabe nicht verfügbar',
               icon: '👂', empty: !words.length });
    out.push({ id: uid + ':read', type: 'reading', unit: uid, title: 'Reading',
               sub: c.reading ? c.reading.title : 'Content to be added', icon: '📖', empty: !c.reading });
    out.push({ id: uid + ':speak', type: 'speaking', unit: uid, title: 'Speaking',
               sub: 'Nachsprechen & Aussprache', icon: '💬', empty: !words.length });
    out.push({ id: uid + ':write', type: 'writing', unit: uid, title: 'Writing',
               sub: c.writing ? 'Eigene Sätze schreiben' : 'Content to be added', icon: '✍️', empty: !c.writing });
    out.push({ id: uid + ':every', type: 'everyday', unit: uid, title: 'Everyday English',
               sub: c.everyday ? 'Alltagsenglisch' : 'Content to be added', icon: '🌍', empty: !c.everyday });
    out.push({ id: uid + ':challenge', type: 'challenge', unit: uid, title: 'Unit Challenge',
               sub: 'Abschlusstest', icon: '🏆', empty: false, locked: true });
    return out;
  };

  /* Ist die Unit Challenge freigeschaltet?  (alle anderen Lektionen >= 1x geschafft) */
  E.challengeOpen = function (uid) {
    var ls = E.lessonsOf(uid), n = 0, done = 0;
    for (var i = 0; i < ls.length; i++) {
      if (ls[i].type === 'challenge' || ls[i].empty) continue;
      n++;
      var r = S.lesson(ls[i].id);
      if (r && r.done) done++;
    }
    return n === 0 ? true : (done >= Math.max(1, Math.ceil(n * 0.7)));
  };

  E.unitProgress = function (uid) {
    var ls = E.lessonsOf(uid), n = 0, done = 0;
    for (var i = 0; i < ls.length; i++) {
      if (ls[i].empty) continue;
      n++;
      var r = S.lesson(ls[i].id);
      if (r && r.done) done++;
    }
    return { done: done, total: n, pct: n ? Math.round(done / n * 100) : 0 };
  };

  /* Aufgabenliste fuer eine Lektion bauen. */
  E.buildLesson = function (ls) {
    var words = SRS.ofUnit(ls.unit), sel;
    switch (ls.type) {
      case 'vocabulary':
        sel = words.slice(ls.from || 0, ls.to || words.length);
        if (!sel.length) return [];
        return E.introTasks(sel).concat(E.vocabTasks(sel, ['mc1', 'mc2', 'type', 'gap'], 2));
      case 'grammar':
        return E.grammarTasks(ls.gid, 'practice').concat(E.grammarTasks(ls.gid, 'challenge'));
      case 'listening':
        return E.listeningTasks(shuffle(words.slice()).slice(0, 10));
      case 'reading':
        return E.readingTasks(ls.unit);
      case 'speaking':
        return E.speakingTasks(shuffle(words.slice()).slice(0, 8));
      case 'writing':
        return E.writingTasks(ls.unit);
      case 'everyday':
        return E.everydayTasks(ls.unit);
      case 'challenge':
        return E.mixedTest({ unit: ls.unit, level: 'normal', n: 20,
                             parts: ['vocab', 'grammar', 'reading', 'writing', 'listening'] });
    }
    return [];
  };
})(window);
