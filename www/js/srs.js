/* =============================================================
   js/srs.js – Wortindex + smartes Wiederholungssystem (Leitner)
   Woerter, die oft falsch sind, kommen frueher und oefter dran.
   ============================================================= */
(function (w) {
  var SRS = w.SRS = {};
  var D = w.DATA;
  var ALL = [];
  var BY_ID = {};
  var BY_UNIT = {};
  var DAY = 86400000;

  /* Lernstufen: 0 Neu, 1 Unsicher, 2 In Arbeit, 3 Gut gelernt, 4 Gemeistert */
  SRS.STATUS = [
    { key: 'new',      icon: '🔴', label: 'Neu',          col: '#DC2626' },
    { key: 'unsure',   icon: '🟠', label: 'Unsicher',     col: '#EA580C' },
    { key: 'learning', icon: '🟡', label: 'In Arbeit',    col: '#F59E0B' },
    { key: 'good',     icon: '🟢', label: 'Gut gelernt',  col: '#16A34A' },
    { key: 'mastered', icon: '⭐', label: 'Gemeistert',   col: '#7C3AED' }
  ];
  var INTERVAL = [0, 1, 2, 5, 12];   // Tage bis zur naechsten Wiederholung

  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  /* ---------- Bedeutungs-Helfer ----------
     Dieselbe Bedeutung kommt oft unter mehreren Woertern vor
     (danke = thank you / thanks, gross = big / large). Damit Quizfragen
     nicht mehrdeutig werden und tippbare Antworten fair bewertet
     werden, zerlegen wir die deutsche Uebersetzung in ihre
     gleichwertigen Teile. */
  function enKey(en) {
    return String(en).toLowerCase().replace(/^to\s+/, '').replace(/[.!?]+$/, '').replace(/\s+/g, ' ').trim();
  }
  function wordCount(en) { return enKey(en).split(' ').length; }

  /* "Stadt (kleiner)" -> ["Stadt"], "schwer, schwierig; hart" -> 3 Teile,
     bei laengeren Phrasen ("mir geht es gut, danke") wird NICHT an jedem
     Komma getrennt, sonst wuerde ein Einzelwort wie "danke" als
     Uebersetzung der ganzen Phrase durchgehen. */
  SRS.deParts = function (de, en) {
    var full = String(de).replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    var out = [], seen = {}, short = !en || wordCount(en) <= 2;
    function add(x) {
      x = x.replace(/[.!?]+$/, '').trim();
      var k = x.toLowerCase();
      if (x && !seen[k]) { seen[k] = 1; out.push(x); }
    }
    full.split(/\s+\/\s+|\s*;\s*/).forEach(function (part) {
      var segs = part.split(/\s*,\s*/);
      if (short) { segs.forEach(add); }
      else {
        add(part);
        segs.forEach(function (sg) { if (sg.split(' ').length >= 2) add(sg); });
      }
    });
    return out;
  };
  SRS.enKey = enKey;

  /* Gleiche Bedeutung? (wird fuer falsche Antwortmoeglichkeiten genutzt) */
  SRS.same = function (a, b) {
    if (a.id === b.id || a.key === b.key) return true;
    for (var i = 0; i < a.parts.length; i++) {
      if (b.parts.indexOf(a.parts[i]) >= 0) return true;
      for (var j = 0; j < b.parts.length; j++) {
        if (a.parts[i].toLowerCase() === b.parts[j].toLowerCase()) return true;
      }
    }
    return false;
  };

  /* Wortart grob: Verb ("to ..."), Phrase (mehrere Woerter), Einzelwort. */
  function shape(it) {
    if (/^to\s/i.test(it.en)) return 'v';
    return /\s/.test(it.en.trim()) ? 'p' : 'w';
  }

  (function build() {
    for (var u = 0; u < D.units.length; u++) {
      var uid = D.units[u].id, list = D.vocab[uid] || [];
      BY_UNIT[uid] = [];
      for (var i = 0; i < list.length; i++) {
        var v = list[i];
        var item = {
          id: uid + ':' + slug(v.en), unit: uid, i: i,
          en: v.en, de: v.de, ex: v.ex || '', exDe: v.exDe || '', tip: v.tip || ''
        };
        item.key = enKey(v.en);
        item.parts = SRS.deParts(v.de, v.en);
        ALL.push(item); BY_ID[item.id] = item; BY_UNIT[uid].push(item);
      }
    }
  })();

  SRS.all = function () { return ALL; };
  SRS.byId = function (id) { return BY_ID[id]; };
  SRS.ofUnit = function (uid) { return BY_UNIT[uid] || []; };
  SRS.count = function (uid) { return uid ? (BY_UNIT[uid] || []).length : ALL.length; };

  SRS.rec = function (id) {
    var ws = w.Store.data().words;
    if (!ws[id]) ws[id] = { c: 0, w: 0, box: 0, last: 0, due: 0 };
    return ws[id];
  };
  SRS.recRaw = function (id) { return w.Store.data().words[id] || null; };

  SRS.status = function (id) {
    var r = SRS.recRaw(id);
    if (!r || (r.c + r.w) === 0) return 0;
    if (r.w >= 2 && r.w >= r.c) return 1;               // deutlich unsicher
    if (r.box >= 4) return 4;
    if (r.box === 3) return 3;
    return 2;
  };

  /* Antwort verbuchen. ok = true/false. Gibt den Datensatz zurueck. */
  SRS.answer = function (id, ok) {
    var r = SRS.rec(id), now = Date.now();
    if (ok) { r.c++; r.box = Math.min(4, r.box + 1); }
    else { r.w++; r.box = Math.max(0, r.box - 2); }
    r.last = now;
    r.due = now + INTERVAL[r.box] * DAY;
    w.Store.save();
    return r;
  };

  /* Faelligkeitswert: je kleiner, desto dringender. */
  function urgency(it, now) {
    var r = SRS.recRaw(it.id);
    if (!r || (r.c + r.w) === 0) return 1000;            // neu -> mittlere Prioritaet
    var over = now - (r.due || 0);
    var errBoost = r.w * 1.5 * DAY;
    return -(over + errBoost);                           // ueberfaellig + fehlerhaft = klein
  }

  /* Auswahl fuer eine Lerneinheit.
     opts: {unit, n, mode:'mix'|'due'|'weak'|'new', ids:[...]}          */
  SRS.pick = function (opts) {
    opts = opts || {};
    var pool = opts.ids ? opts.ids.map(SRS.byId).filter(Boolean)
             : (opts.unit ? SRS.ofUnit(opts.unit).slice() : ALL.slice());
    var n = opts.n || 10, now = Date.now(), i;
    pool = SRS.unique(pool);

    if (opts.mode === 'weak') {
      pool = pool.filter(function (it) { var r = SRS.recRaw(it.id); return r && r.w > 0; });
      pool.sort(function (a, b) {
        var ra = SRS.recRaw(a.id), rb = SRS.recRaw(b.id);
        return (rb.w - rb.c) - (ra.w - ra.c);
      });
      return pool.slice(0, n);
    }
    if (opts.mode === 'new') {
      pool = pool.filter(function (it) { var r = SRS.recRaw(it.id); return !r || (r.c + r.w) === 0; });
      return pool.slice(0, n);
    }
    if (opts.mode === 'due') {
      pool = pool.filter(function (it) {
        var r = SRS.recRaw(it.id);
        return r && (r.c + r.w) > 0 && (r.due || 0) <= now;
      });
    }
    pool.sort(function (a, b) { return urgency(a, now) - urgency(b, now); });
    /* Sanft mischen, damit die Reihenfolge nicht jedes Mal identisch ist. */
    var head = pool.slice(0, Math.min(pool.length, n * 2));
    for (i = head.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = head[i]; head[i] = head[j]; head[j] = t;
    }
    return head.slice(0, n);
  };

  /* Dasselbe englische Wort steht in mehreren Units (z. B. "town" in
     Welcome und Unit 5). In gemischten Auswahlen soll es nur einmal
     vorkommen; behalten wird der Eintrag mit dem meisten Lernfortschritt. */
  SRS.unique = function (list) {
    var best = {}, order = [], i, it, k, r, cnt;
    for (i = 0; i < list.length; i++) {
      it = list[i]; k = it.key;
      r = SRS.recRaw(it.id); cnt = r ? r.c + r.w : 0;
      if (!(k in best)) { best[k] = { it: it, cnt: cnt }; order.push(k); }
      else if (cnt > best[k].cnt) best[k] = { it: it, cnt: cnt };
    }
    return order.map(function (kk) { return best[kk].it; });
  };

  SRS.weak = function (n) { return SRS.pick({ mode: 'weak', n: n || 5 }); };

  SRS.dueCount = function (uid) {
    var now = Date.now(), c = 0, list = uid ? SRS.ofUnit(uid) : ALL;
    for (var i = 0; i < list.length; i++) {
      var r = SRS.recRaw(list[i].id);
      if (r && (r.c + r.w) > 0 && (r.due || 0) <= now) c++;
    }
    return c;
  };

  SRS.stats = function (uid) {
    var list = uid ? SRS.ofUnit(uid) : ALL;
    var st = [0, 0, 0, 0, 0], seen = 0, mastered = 0;
    for (var i = 0; i < list.length; i++) {
      var s = SRS.status(list[i].id);
      st[s]++;
      if (s > 0) seen++;
      if (s === 4) mastered++;
    }
    return { total: list.length, buckets: st, seen: seen, mastered: mastered,
             pct: list.length ? Math.round((st[2] * 0.5 + st[3] * 0.8 + st[4]) / list.length * 100) : 0 };
  };

  /* Falsche Antwortmoeglichkeiten finden.
     Regeln: nie ein Wort mit gleicher Bedeutung (sonst waeren zwei
     Antworten richtig), moeglichst aus derselben Unit und moeglichst
     mit gleicher Wortart (Verb zu Verb, Phrase zu Phrase). */
  SRS.distractors = function (item, n, field) {
    field = field || 'de';
    var sh = shape(item), tiers = [[], [], [], []], seenVal = {}, i, x;
    function ok(c) { return !SRS.same(item, c) && c[field] !== item[field]; }
    for (i = 0; i < ALL.length; i++) {
      x = ALL[i];
      if (!ok(x)) continue;
      var sameUnit = x.unit === item.unit, sameShape = shape(x) === sh;
      tiers[(sameUnit ? 0 : 2) + (sameShape ? 0 : 1)].push(x);
    }
    var out = [], t, pool, k, c, guard;
    for (t = 0; t < tiers.length && out.length < n; t++) {
      pool = tiers[t]; guard = 0;
      while (out.length < n && pool.length && guard++ < 600) {
        k = Math.floor(Math.random() * pool.length); c = pool[k]; pool.splice(k, 1);
        if (seenVal[c[field].toLowerCase()]) continue;
        seenVal[c[field].toLowerCase()] = 1;
        out.push(c);
      }
    }
    return out;
  };
})(window);
