/* =============================================================
   js/storage.js – Fortschritt speichern (localStorage)
   Ein einziger JSON-Schluessel, gebuendeltes Schreiben (debounce),
   damit das Geraet nicht bei jeder Antwort auf die Platte schreibt.
   ============================================================= */
(function (w) {
  var KEY = 'englishAdventure.v1';
  var S = w.Store = {};
  var saveTimer = null;
  var mem = null;               // Fallback, falls localStorage blockiert ist
  var storageOk = true;

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dayDiff(a, b) {   // b - a in Tagen
    if (!a || !b) return 999;
    var pa = a.split('-'), pb = b.split('-');
    var da = Date.UTC(+pa[0], +pa[1] - 1, +pa[2]);
    var db = Date.UTC(+pb[0], +pb[1] - 1, +pb[2]);
    return Math.round((db - da) / 86400000);
  }
  S.today = today; S.dayDiff = dayDiff;

  function blank() {
    return {
      v: 1, xp: 0, correct: 0, wrong: 0, timeSec: 0,
      streak: { count: 0, best: 0, lastDay: '' },
      days: {},                 // 'YYYY-MM-DD' -> {xp, sec, tasks}
      words: {},                // 'u1:school' -> {c,w,box,last,due}
      lessons: {},              // 'u1:vocab-1' -> {done,best,ts}
      units: {},                // 'u1' -> {done:true}
      ach: {},                  // id -> timestamp
      mission: null,            // {day, need:{}, have:{}, claimed:false}
      tests: [],                // {ts,label,pct}
      games: {},                // id -> {plays,best}
      settings: { sound: true, rate: 0.85 }
    };
  }

  S.load = function () {
    var raw = null;
    try { raw = w.localStorage.getItem(KEY); }
    catch (e) { storageOk = false; }
    var d = null;
    if (raw) { try { d = JSON.parse(raw); } catch (e) { d = null; } }
    if (!d || typeof d !== 'object') d = blank();
    var b = blank(), k;
    for (k in b) if (!(k in d)) d[k] = b[k];          // sanfte Migration
    for (k in b.settings) if (!(k in d.settings)) d.settings[k] = b.settings[k];
    mem = d;
    return d;
  };

  S.data = function () { return mem || S.load(); };
  S.storageOk = function () { return storageOk; };

  S.save = function () {
    if (saveTimer) return;
    saveTimer = setTimeout(function () {
      saveTimer = null;
      try { w.localStorage.setItem(KEY, JSON.stringify(mem)); }
      catch (e) { storageOk = false; }
    }, 400);
  };
  S.saveNow = function () {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    try { w.localStorage.setItem(KEY, JSON.stringify(mem)); }
    catch (e) { storageOk = false; }
  };

  S.reset = function () {
    mem = blank();
    S.saveNow();
  };

  /* ---------- Tages-Statistik ---------- */
  S.day = function (d) {
    var s = S.data(), k = d || today();
    if (!s.days[k]) s.days[k] = { xp: 0, sec: 0, tasks: 0 };
    // alte Tage aufraeumen (max 120 behalten)
    var keys = Object.keys(s.days);
    if (keys.length > 120) {
      keys.sort();
      for (var i = 0; i < keys.length - 120; i++) delete s.days[keys[i]];
    }
    return s.days[k];
  };

  S.addTime = function (sec) {
    var s = S.data();
    s.timeSec += sec; S.day().sec += sec; S.save();
  };

  /* ---------- XP & Level ---------- */
  S.addXp = function (n) {
    if (!n) return 0;
    var s = S.data();
    s.xp += n; S.day().xp += n;
    S.save();
    return n;
  };

  S.levelInfo = function () {
    var xp = S.data().xp, L = w.DATA.levels, i = 0;
    for (var k = 0; k < L.length; k++) if (xp >= L[k].xp) i = k;
    var cur = L[i], nxt = L[i + 1] || null;
    var pct = nxt ? Math.round((xp - cur.xp) / (nxt.xp - cur.xp) * 100) : 100;
    return {
      lvl: cur.lvl, name: cur.name, xp: xp, pct: Math.max(0, Math.min(100, pct)),
      next: nxt ? nxt.xp : null, need: nxt ? nxt.xp - xp : 0
    };
  };

  /* ---------- Streak ---------- */
  S.touchStreak = function () {
    var s = S.data(), t = today(), st = s.streak;
    if (st.lastDay === t) return st;
    var diff = st.lastDay ? dayDiff(st.lastDay, t) : 999;
    if (diff === 1) st.count += 1;
    else st.count = 1;
    st.lastDay = t;
    if (st.count > st.best) st.best = st.count;
    S.save();
    return st;
  };
  /* Streak nur anzeigen, wenn sie noch gueltig ist (heute oder gestern). */
  S.streakView = function () {
    var st = S.data().streak;
    if (!st.lastDay) return 0;
    var d = dayDiff(st.lastDay, today());
    return (d === 0 || d === 1) ? st.count : 0;
  };

  /* ---------- Tagesmission ---------- */
  S.mission = function () {
    var s = S.data(), t = today();
    if (!s.mission || s.mission.day !== t) {
      s.mission = {
        day: t,
        need: { words: 10, grammar: 1, quiz: 1 },
        have: { words: 0, grammar: 0, quiz: 0 },
        claimed: false
      };
      S.save();
    }
    return s.mission;
  };
  S.missionAdd = function (key, n) {
    var m = S.mission();
    m.have[key] = Math.min(m.need[key], (m.have[key] || 0) + (n || 1));
    S.save();
    return m;
  };
  S.missionDone = function () {
    var m = S.mission();
    return m.have.words >= m.need.words && m.have.grammar >= m.need.grammar && m.have.quiz >= m.need.quiz;
  };
  S.missionClaim = function () {
    var m = S.mission();
    if (m.claimed || !S.missionDone()) return 0;
    m.claimed = true;
    var s = S.data();
    s._missions = (s._missions || 0) + 1;
    S.addXp(w.DATA.xp.dailyMission);
    return w.DATA.xp.dailyMission;
  };

  /* ---------- Lektionen & Units ---------- */
  S.lesson = function (id) {
    var s = S.data();
    return s.lessons[id] || null;
  };
  S.finishLesson = function (id, pct) {
    var s = S.data();
    var e = s.lessons[id] || { done: false, best: 0, ts: 0, plays: 0 };
    e.plays = (e.plays || 0) + 1;
    e.ts = Date.now();
    if (pct > e.best) e.best = pct;
    if (pct >= 0.7) e.done = true;
    s.lessons[id] = e;
    S.save();
    return e;
  };

  /* ---------- Achievements ---------- */
  S.unlock = function (id) {
    var s = S.data();
    if (s.ach[id]) return false;
    s.ach[id] = Date.now();
    S.save();
    return true;
  };
  S.hasAch = function (id) { return !!S.data().ach[id]; };

  S.load();
  w.addEventListener('pagehide', function () { S.saveNow(); });
  w.addEventListener('beforeunload', function () { S.saveNow(); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') S.saveNow();
  });
})(window);
