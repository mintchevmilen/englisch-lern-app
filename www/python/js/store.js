/* Fortschritt, Eigene Programme, Sicherung. Alles liegt im localStorage dieses Geraets. */
(function (w) {
  var KEY = 'pyapp_v1';
  var LEVELS = [
    { xp: 0, ico: '🥚', t: 'Python-Neuling' },
    { xp: 40, ico: '🐍', t: 'Code-Lehrling' },
    { xp: 120, ico: '💻', t: 'Programmierer' },
    { xp: 250, ico: '🚀', t: 'Python-Profi' },
    { xp: 400, ico: '🏆', t: 'Code-Meister' }
  ];
  var data = null;

  function fresh() { return { v: 1, xp: 0, done: {}, code: {}, programs: [], created: Date.now() }; }
  function load() {
    if (data) return data;
    try { var raw = w.localStorage.getItem(KEY); data = raw ? JSON.parse(raw) : fresh(); } catch (e) { data = fresh(); }
    if (!data || typeof data !== 'object') data = fresh();
    data.done = data.done || {}; data.code = data.code || {}; data.programs = data.programs || []; data.xp = data.xp || 0;
    return data;
  }
  function save() { try { w.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* voll oder gesperrt */ } }

  var Store = {
    get: load,
    level: function () {
      var d = load(), L = LEVELS[0], next = null;
      for (var i = 0; i < LEVELS.length; i++) { if (d.xp >= LEVELS[i].xp) { L = LEVELS[i]; next = LEVELS[i + 1] || null; } }
      return { cur: L, next: next };
    },
    isDone: function (id) { return !!load().done[id]; },
    markDone: function (id, xp) { var d = load(); if (d.done[id]) return 0; d.done[id] = Date.now(); d.xp += xp; save(); return xp; },
    getCode: function (id) { return load().code[id]; },
    setCode: function (id, code) { load().code[id] = code; save(); },
    programs: function () { return load().programs; },
    saveProgram: function (p) {
      var d = load(), i;
      if (!p.id) { p.id = 'p' + Date.now().toString(36); d.programs.unshift(p); }
      else { for (i = 0; i < d.programs.length; i++) if (d.programs[i].id === p.id) { d.programs[i] = p; break; } if (i === d.programs.length) d.programs.unshift(p); }
      p.t = Date.now(); save(); return p;
    },
    deleteProgram: function (id) { var d = load(); d.programs = d.programs.filter(function (p) { return p.id !== id; }); save(); },
    backupText: function () { return JSON.stringify({ app: 'python-kurs', exported: new Date().toISOString(), data: load() }); },
    parseBackup: function (text) {
      var o; try { o = JSON.parse(String(text).trim()); } catch (e) { return { ok: false, msg: 'Das ist keine gültige Sicherung.' }; }
      if (!o || o.app !== 'python-kurs' || !o.data || typeof o.data !== 'object') return { ok: false, msg: 'Das ist keine Sicherung aus dem Python Kurs.' };
      return { ok: true, data: o.data };
    },
    applyBackup: function (d) { data = fresh(); Object.keys(d).forEach(function (k) { data[k] = d[k]; }); load(); save(); }
  };
  w.PyStore = Store;
})(window);
