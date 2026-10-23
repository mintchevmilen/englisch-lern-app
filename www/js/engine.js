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
  /* Platzhalter-Eintraege ("a piece of ...", "I'd like ...") lassen sich
     nicht sinnvoll eintippen; dafuer gibt es nur Auswahlaufgaben. */
  function hasPlaceholder(it) { return /\.\.\.|…/.test(it.en + ' ' + it.de); }
  function stripTo(en) { return String(en).replace(/^to\s+/i, ''); }

  /* Alle englischen Woerter, die dieselbe deutsche Bedeutung haben
     (danke -> thank you / thanks). So ist jede richtige Antwort richtig. */
  function sameMeaningEn(it) {
    var all = SRS.all(), out = [], i;
    for (i = 0; i < all.length; i++) {
      if (all[i].id !== it.id && SRS.same(it, all[i]) && all[i].key !== it.key) out.push(all[i].en);
    }
    return out;
  }

  function typeFromWord(it) {
    if (hasPlaceholder(it)) return null;
    var alt = [stripTo(it.en)].concat(sameMeaningEn(it));
    alt = alt.concat(alt.map(stripTo));
    return {
      kind: 'input',
      prompt: 'Schreibe das englische Wort:',
      question: it.de,
      a: it.en, alt: alt, strict: true,
      why: it.de + ' = ' + it.en + (it.tip ? ' – ' + it.tip : ''),
      speak: it.en, wordId: it.id, ph: 'English ...'
    };
  }
  function transFromWord(it) {
    if (hasPlaceholder(it)) return null;
    return {
      kind: 'input',
      prompt: 'Übersetze ins Deutsche:',
      question: it.en,
      a: it.de, alt: it.parts.slice(),
      why: it.en + ' = ' + it.de,
      speak: it.en, wordId: it.id, ph: 'Deutsch ...', de: true
    };
  }

  /* Lueckensatz: das Wort kann im Beispielsatz gebeugt vorkommen
     (smile -> smiles, finish -> finishes). Beide Formen zaehlen als richtig. */
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function formsOf(b) {
    var f = [b, b + 's', b + 'es', b + 'ed', b + 'd', b + 'ing'];
    if (/[^aeiou]y$/.test(b)) f.push(b.slice(0, -1) + 'ies', b.slice(0, -1) + 'ied');
    if (/e$/.test(b)) f.push(b.slice(0, -1) + 'ing');
    if (/[^aeiou][aeiou][^aeiouwxy]$/.test(b)) f.push(b + b.slice(-1) + 'ed', b + b.slice(-1) + 'ing');
    return f;
  }
  function findGap(it) {
    if (!it.ex || hasPlaceholder(it) || /[\/()]|\b(sb|sth)\b/.test(it.en)) return null;
    var base = stripTo(it.en).trim();
    if (base.split(/\s+/).length > 3) return null;
    var words = base.split(/\s+/), cands = [base];
    if (words.length === 1) cands = formsOf(base.toLowerCase());
    else if (/^[a-z]+$/i.test(words[0])) {
      cands = [base].concat(formsOf(words[0].toLowerCase()).slice(1).map(function (f) {
        return f + ' ' + words.slice(1).join(' ');
      }));
    }
    cands.sort(function (x, y) { return y.length - x.length; });
    var re = new RegExp('\\b(' + cands.map(esc).join('|') + ')\\b', 'i');
    var m = re.exec(it.ex);
    if (!m) return null;
    /* Steht das Wort mehrfach im Satz ("Step by step"), bliebe die Loesung
       sichtbar oder es gaebe zwei Luecken; dann lieber eine andere Aufgabe. */
    if (it.ex.match(new RegExp(re.source, 'gi')).length > 1) return null;
    return { re: re, form: m[1], base: base };
  }
  function gapFromWord(it) {
    var g = findGap(it);
    if (!g) return null;
    return {
      kind: 'input',
      prompt: 'Setze das fehlende Wort ein (' + it.de + '):',
      question: it.ex.replace(g.re, '_____'),
      a: g.form, alt: g.form.toLowerCase() === g.base.toLowerCase() ? [] : [g.base], strict: true,
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

  /* Nur Eintraege, die man so aussprechen kann, wie sie dastehen
     (keine Platzhalter wie "sb", "sth" oder "..."). */
  E.speakable = function (items) {
    return items.filter(function (it) { return !/\.\.\.|…|\/|\b(sb|sth)\b/.test(it.en); });
  };

  E.speakingTasks = function (items) {
    var out = [], list = E.speakable(items);
    for (var i = 0; i < list.length; i++) {
      out.push({ kind: 'repeat', prompt: 'Hör zu und sprich nach:',
                 question: list[i].en, sub: list[i].de, ex: list[i].ex,
                 say: list[i].en.replace(/[()]/g, ''),
                 speak: list[i].en, autoSpeak: true, wordId: list[i].id });
    }
    return out;
  };

  /* ---------------------------------------------------------
     Sprachbewertung (Nachsprechen)
     heard: Liste der Erkennungs-Ergebnisse (beste zuerst)
     Rueckgabe: { level: 2 perfekt | 1 gut genug | 0 nicht erkannt,
                  heard: bester Treffer als Text }
     Kinder werden vom Erkenner oft ungenau verstanden; deshalb zaehlen
     alle Alternativen, kleine Abweichungen und Zahlen als Woerter.
     --------------------------------------------------------- */
  var NUMW = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
               '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten', '11': 'eleven',
               '12': 'twelve', '13': 'thirteen', '14': 'fourteen', '15': 'fifteen',
               '16': 'sixteen', '17': 'seventeen', '18': 'eighteen', '19': 'nineteen', '20': 'twenty' };
  function spCanon(s) {
    var t = String(s == null ? '' : s).replace(/[‘’´`]/g, "'").toLowerCase()
      .replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
    t = t.split(' ').map(function (x) { return NUMW[x] || x; }).join(' ');
    return canon(stripTo(t));
  }
  function wordMatch(t, h) {
    if (t === h) return true;
    if (t.length <= 3 || h.length <= 3) return false;
    return lev(t, h) <= (t.length > 6 ? 2 : 1);
  }
  E.speechScore = function (heard, target) {
    var tg = spCanon(target), best = { level: 0, heard: (heard && heard[0]) || '' };
    if (!tg) return best;
    var tw = tg.split(' '), bestScore = -1, i, k, j;
    for (i = 0; i < (heard || []).length; i++) {
      var hg = spCanon(heard[i]);
      if (!hg) continue;
      if (hg === tg) return { level: 2, heard: heard[i] };
      var hw = hg.split(' '), used = [], hit = 0;
      for (k = 0; k < tw.length; k++) {
        for (j = 0; j < hw.length; j++) {
          if (!used[j] && wordMatch(tw[k], hw[j])) { used[j] = 1; hit++; break; }
        }
      }
      var score = hit / tw.length;
      if (score >= 0.8 && hw.length <= tw.length + 1 && score > bestScore) {
        bestScore = score; best = { level: 1, heard: heard[i] };
      } else if (best.level === 0 && bestScore < 0 && i === 0) {
        best = { level: 0, heard: heard[i] };
      }
    }
    return best;
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
        return E.speakingTasks(E.speakable(shuffle(words.slice())).slice(0, 8));
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
