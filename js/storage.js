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
      settings: { sound: true, rate: 0.85, mic: true, live: false },
      lastBackup: 0             // Zeitstempel des letzten manuellen Backups
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

  /* ---------- Backup, Wiederherstellung, automatische Sicherungen ----------
     Vollbackup = Englisch-Fortschritt + (falls vorhanden) Mathe-Fortschritt als JSON-Text.
     Aeltere Kurz-Backups ({xp, streak, words, lessons, time}) enthalten nur Zahlen und
     koennen nur XP, Serie und Lernzeit zurueckbringen, keine einzelnen Woerter. */
  var MKEY = 'mathe-mission-5', SNAPKEY = 'englishAdventure.snapshots';

  function lsGet(k) { try { return w.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { w.localStorage.setItem(k, v); return true; } catch (e) { return false; } }

  S.backupText = function () {
    var m = null, raw = lsGet(MKEY);
    if (raw) { try { m = JSON.parse(raw); } catch (e) { m = null; } }
    return JSON.stringify({
      app: 'english-adventure', format: 2, version: w.APP_VERSION || '',
      created: new Date().toISOString(), englisch: S.data(), mathe: m
    });
  };

  S.markBackup = function () { S.data().lastBackup = Date.now(); S.saveNow(); };

  /* Text -> {kind:'full'|'legacy', ...} oder null */
  S.parseBackup = function (text) {
    var t = String(text == null ? '' : text).replace(/^\uFEFF/, '').trim();
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    var o = null;
    try { o = JSON.parse(t); } catch (e) { return null; }
    if (typeof o === 'string') { try { o = JSON.parse(o); } catch (e2) { return null; } }
    if (!o || typeof o !== 'object') return null;
    if (o.app === 'english-adventure' && o.englisch && typeof o.englisch === 'object') {
      var e1 = o.englisch;
      if (typeof e1.xp !== 'number' || typeof e1.words !== 'object' || !e1.words) return null;
      return { kind: 'full', data: e1, mathe: (o.mathe && typeof o.mathe === 'object') ? o.mathe : null, created: o.created || '' };
    }
    if (typeof o.xp === 'number' && ('words' in o || 'lessons' in o || 'streak' in o)) {
      return { kind: 'legacy', xp: o.xp, streak: o.streak, words: +o.words || 0, lessons: +o.lessons || 0, time: +o.time || 0 };
    }
    return null;
  };

  S.describeBackup = function (b) {
    if (b.kind === 'full') {
      var d = b.data;
      return 'Vollbackup' + (b.created ? ' vom ' + b.created.slice(0, 10) : '') + ': ' + d.xp + ' XP, ' +
        Object.keys(d.words || {}).length + ' Wörter, ' + Object.keys(d.lessons || {}).length + ' Lektionen' +
        (b.mathe ? ', plus Mathe-Fortschritt' : '') + '.\nDer jetzige Stand wird dadurch ersetzt (vorher wird eine Sicherung angelegt).';
    }
    var st = b.streak && typeof b.streak === 'object' ? b.streak.count : b.streak;
    return 'Altes Kurz-Backup: ' + b.xp + ' XP, Serie ' + (st || 0) + ', ' + b.words + ' Wörter, ' + b.lessons + ' Lektionen.\n' +
      'Darin stehen nur Zahlen. Übernommen werden XP, Serie und Lernzeit, wenn sie höher sind als jetzt. Einzelne Wörter und Lektionen lassen sich daraus nicht zurückholen.';
  };

  S.applyBackup = function (b) {
    S.snapshot('vor Import');
    if (b.kind === 'full') {
      var base = blank(), d = b.data, k;
      for (k in base) if (!(k in d)) d[k] = base[k];
      for (k in base.settings) if (!d.settings || !(k in d.settings)) { d.settings = d.settings || {}; d.settings[k] = base.settings[k]; }
      mem = d;
      if (b.mathe) lsSet(MKEY, JSON.stringify(b.mathe));
    } else {
      var cur = S.data();
      if (b.xp > cur.xp) cur.xp = b.xp;
      if (b.time > cur.timeSec) cur.timeSec = b.time;
      if (b.streak && typeof b.streak === 'object') {
        if ((b.streak.best || 0) > cur.streak.best) cur.streak.best = b.streak.best;
        if ((b.streak.count || 0) > cur.streak.count) { cur.streak.count = b.streak.count; cur.streak.lastDay = b.streak.lastDay || cur.streak.lastDay; }
      }
    }
    S.saveNow();
    return mem;
  };

  /* Sicherungen auf dem Geraet (max. 5). Schuetzen vor Fehlern, nicht vor Deinstallation. */
  S.snapshots = function () {
    var raw = lsGet(SNAPKEY), a = [];
    if (raw) { try { a = JSON.parse(raw); } catch (e) { a = []; } }
    return Array.isArray(a) ? a : [];
  };
  S.snapshot = function (label) {
    var a = S.snapshots();
    a.unshift({ ts: Date.now(), label: label || '', text: S.backupText() });
    while (a.length > 5) a.pop();
    var ok = lsSet(SNAPKEY, JSON.stringify(a));
    if (!ok && a.length > 1) { a.length = 1; lsSet(SNAPKEY, JSON.stringify(a)); }
  };
  /* Hoechstens eine automatische Sicherung pro Tag, nur wenn es schon Fortschritt gibt. */
  S.autoSnapshot = function () {
    var d = S.data();
    if (!(d.xp > 0)) return;
    var a = S.snapshots(), last = a.length ? a[0].ts : 0;
    if (a.length && a[0].label === 'automatisch' && new Date(last).toDateString() === new Date().toDateString()) return;
    S.snapshot('automatisch');
  };
  S.restoreSnapshot = function (i) {
    var a = S.snapshots(), it = a[i]; if (!it) return false;
    var b = S.parseBackup(it.text); if (!b) return false;
    S.applyBackup(b);
    return true;
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
