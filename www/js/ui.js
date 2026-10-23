/* =============================================================
   js/ui.js – Alle Bildschirme
   ============================================================= */
(function (w) {
  var D = w.DATA, S = w.Store, SRS = w.SRS, E = w.Engine;
  var UI = w.UI = {};
  var screen, topTitle, backBtn;

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function bar(pct, cls) { return '<div class="bar' + (cls ? ' ' + cls : '') + '"><div class="bar__fill" style="width:' + Math.max(0, Math.min(100, pct)) + '%"></div></div>'; }
  UI.esc = esc;

  var toastT = null;
  UI.toast = function (msg) {
    var el = document.getElementById('toast');
    el.textContent = msg; el.className = 'toast is-on';
    if (toastT) clearTimeout(toastT);
    toastT = setTimeout(function () { el.className = 'toast'; }, 2200);
  };

  UI.go = function (route) { w.location.hash = '#/' + route.replace(/^#?\/?/, ''); };

  /* ---------------- Achievements ---------------- */
  function achById(id) { for (var i = 0; i < D.achievements.length; i++) if (D.achievements[i].id === id) return D.achievements[i]; return null; }
  UI.checkAchievements = function (pct, scored, cfg) {
    var s = S.data(), out = [];
    function add(id) { if (S.unlock(id)) out.push(achById(id)); }
    if (s.xp >= 100) add('a_xp100');
    if (s.xp >= 1000) add('a_xp1000');
    var st = s.streak.count;
    if (st >= 3) add('a_streak3');
    if (st >= 7) add('a_streak7');
    if (st >= 30) add('a_streak30');
    if (pct >= 1 && scored >= 5) add('a_perfect');
    var stat = SRS.stats();
    if (stat.seen >= 50) add('a_words50');
    if (stat.seen >= 200) add('a_words200');
    if (stat.mastered >= 25) add('a_master25');
    var gc = 0, k;
    for (k in s.lessons) if (/:gram:/.test(k) && s.lessons[k].done) gc++;
    if (gc >= 5) add('a_grammar');
    var uc = 0;
    for (k in s.units) if (s.units[k].done) uc++;
    if (uc >= 1) add('a_unit1');
    for (var i = 0; i < s.tests.length; i++) if (s.tests[i].pct >= 80) { add('a_test'); break; }
    if (s.games.match && s.games.runner && s.games.builder) add('a_games');
    if ((s._missions || 0) >= 5) add('a_mission');
    return out;
  };

  /* ---------------- Fortschritt je Bereich ---------------- */
  function typeProgress(type) {
    var n = 0, done = 0;
    for (var u = 0; u < D.units.length; u++) {
      var ls = E.lessonsOf(D.units[u].id);
      for (var i = 0; i < ls.length; i++) {
        if (ls[i].type !== type || ls[i].empty) continue;
        n++; var r = S.lesson(ls[i].id); if (r && r.done) done++;
      }
    }
    return { n: n, done: done, pct: n ? Math.round(done / n * 100) : 0 };
  }
  UI.typeProgress = typeProgress;

  function nextLesson() {
    for (var u = 0; u < D.units.length; u++) {
      var uid = D.units[u].id, ls = E.lessonsOf(uid);
      for (var i = 0; i < ls.length; i++) {
        if (ls[i].empty) continue;
        if (ls[i].type === 'challenge' && !E.challengeOpen(uid)) continue;
        var r = S.lesson(ls[i].id);
        if (!r || !r.done) return ls[i];
      }
    }
    return null;
  }

  /* ---------------- Lektion starten ---------------- */
  UI.startLesson = function (ls) {
    if (ls.type === 'listening' && !w.Speech.ready()) {
      UI.toast('Die Sprachausgabe ist auf diesem Gerät (noch) nicht verfügbar.'); return;
    }
    if (ls.empty) { UI.toast('Content to be added – hier fehlen noch Inhalte.'); return; }
    if (ls.type === 'challenge' && !E.challengeOpen(ls.unit)) {
      UI.toast('🔒 Erst die anderen Lektionen dieser Unit schaffen.'); return;
    }
    if (ls.type === 'grammar') { UI.go('learn/' + ls.unit + '/' + ls.gid); return; }
    var build = function () { return E.buildLesson(ls); };
    var tasks = build();
    if (!tasks.length) { UI.toast('Content to be added – hier fehlen noch Inhalte.'); return; }
    var u = E.unitById(ls.unit);
    w.Player.start({
      title: (u ? 'Unit ' + u.no + ' · ' : '') + ls.title,
      tasks: tasks, lessonId: ls.id, kind: ls.type, unit: ls.unit,
      isTest: ls.type === 'challenge', rebuild: build,
      onExit: function () { UI.go('unit/' + ls.unit); }
    });
  };

  /* =========================================================
     SCREENS
     ========================================================= */
  var V = {};

  /* ---------- Start ---------- */
  V.home = function () {
    var li = S.levelInfo(), m = S.mission(), streak = S.streakView();
    var nx = nextLesson(), weak = SRS.weak(6);
    var h = '';

    h += '<div class="card card--hero">' +
      '<div class="row row--between"><div><div class="tiny" style="color:rgba(255,255,255,.8)">LEVEL ' + li.lvl + '</div>' +
      '<div class="h1">' + esc(li.name) + '</div></div>' +
      '<div class="center"><div class="h1">' + streak + '</div><div class="tiny" style="color:rgba(255,255,255,.8)">🔥 Tage</div></div></div>' +
      '<div class="mt">' + bar(li.pct) + '</div>' +
      '<div class="row row--between mt-s tiny" style="color:rgba(255,255,255,.85)">' +
        '<span>' + li.xp + ' XP</span><span>' + (li.next ? 'noch ' + li.need + ' XP bis Level ' + (li.lvl + 1) : 'Höchstes Level!') + '</span></div>' +
      '</div>';

    if (nx) {
      var un = E.unitById(nx.unit);
      h += '<button class="card card--tap" data-go="lesson:' + esc(nx.unit) + ':' + esc(nx.id) + '" type="button">' +
        '<div class="tiny">NÄCHSTE MISSION</div>' +
        '<div class="row mt-s"><div class="lesson__ico">' + nx.icon + '</div>' +
        '<div class="grow"><div class="lesson__t">' + esc(nx.title) + '</div>' +
        '<div class="lesson__s">Unit ' + (un ? un.no : '') + ' · ' + esc(nx.sub) + '</div></div>' +
        '<span style="font-size:22px">▶</span></div></button>';
    } else {
      h += '<div class="card"><b>🎉 Alles geschafft!</b><div class="muted mt-s">Wiederhole deine Wörter oder mache einen Test.</div></div>';
    }

    /* Tagesmission */
    var done = S.missionDone();
    h += '<div class="card">' +
      '<div class="row row--between"><b>🎯 Today’s Mission</b><span class="badge">+' + D.xp.dailyMission + ' XP</span></div>' +
      '<ul class="mt-s">' +
        missionRow('Lerne ' + m.need.words + ' Wörter', m.have.words, m.need.words) +
        missionRow('1 Grammatik-Übung', m.have.grammar, m.need.grammar) +
        missionRow('1 Quiz abschließen', m.have.quiz, m.need.quiz) +
      '</ul>' +
      (done && !m.claimed ? '<button class="btn btn--green mt" data-go="claim" type="button">Belohnung abholen (+' + D.xp.dailyMission + ' XP)</button>'
        : (m.claimed ? '<div class="badge badge--ok mt">✓ Heute erledigt</div>' : '')) +
      '</div>';

    if (weak.length) {
      h += '<div class="card">' +
        '<div class="row row--between"><b>🔥 Your weak words</b><span class="tiny">' + weak.length + '</span></div>' +
        '<div class="mt-s muted">' + weak.map(function (x) { return esc(x.en); }).join(' · ') + '</div>' +
        '<button class="btn btn--ghost mt" data-go="weak" type="button">Practice weak words</button></div>';
    }

    var due = SRS.dueCount();
    h += '<div class="grid2">' +
      '<button class="card card--tap center" data-go="review" type="button"><div style="font-size:24px">🔁</div><b>Wiederholen</b><div class="tiny">' + due + ' fällig</div></button>' +
      '<button class="card card--tap center" data-go="panic" type="button"><div style="font-size:24px">🚨</div><b>Test morgen?</b><div class="tiny">Schnell fit werden</div></button>' +
      '</div>';

    h += '<div class="sec">Deine Units</div>';
    for (var i = 0; i < D.units.length; i++) h += unitCard(D.units[i]);
    return h;
  };
  function missionRow(label, have, need) {
    var ok = have >= need;
    return '<li class="row mt-s"><span style="width:22px">' + (ok ? '✅' : '⬜') + '</span>' +
      '<span class="grow' + (ok ? '' : '') + '">' + esc(label) + '</span>' +
      '<span class="tiny">' + Math.min(have, need) + '/' + need + '</span></li>';
  }
  function unitCard(u) {
    var p = E.unitProgress(u.id), st = SRS.stats(u.id);
    var doneU = S.data().units[u.id] && S.data().units[u.id].done;
    return '<button class="unit" data-go="unit:' + u.id + '" type="button">' +
      '<div class="row"><div class="unit__n" style="background:' + u.color + '">' + u.no + '</div>' +
      '<div class="grow"><div class="lesson__t">' + esc(u.title) + (doneU ? ' ✅' : '') + '</div>' +
      '<div class="lesson__s">' + esc(u.intro) + '</div></div></div>' +
      '<div class="mt-s">' + bar(p.pct) + '</div>' +
      '<div class="row row--between tiny mt-s"><span>' + p.done + '/' + p.total + ' Lektionen</span>' +
      '<span>' + st.seen + '/' + st.total + ' Wörter</span></div></button>';
  }

  /* ---------- Units ---------- */
  V.units = function () {
    var h = '<div class="sec">Access 1 – Lernbereiche</div>';
    for (var i = 0; i < D.units.length; i++) h += unitCard(D.units[i]);
    h += '<p class="tiny mt">Die Unit-Titel sind vorläufig und lassen sich in <b>data/units.js</b> anpassen.</p>';
    return h;
  };

  /* ---------- Eine Unit ---------- */
  V.unit = function (uid) {
    var u = E.unitById(uid);
    if (!u) return '<div class="empty">Unit nicht gefunden.</div>';
    var ls = E.lessonsOf(uid), p = E.unitProgress(uid), open = E.challengeOpen(uid);
    var h = '<div class="card card--hero"><div class="tiny" style="color:rgba(255,255,255,.8)">UNIT ' + u.no + '</div>' +
      '<div class="h1">' + esc(u.title) + '</div><div class="muted">' + esc(u.titleDe) + '</div>' +
      '<div class="mt">' + bar(p.pct) + '</div>' +
      '<div class="tiny mt-s" style="color:rgba(255,255,255,.85)">' + p.done + ' von ' + p.total + ' Lektionen geschafft</div></div>';

    h += '<div class="card"><b>Themen</b><div class="muted mt-s">' + u.topics.map(esc).join(' · ') + '</div>' +
      '<button class="btn btn--ghost mt" data-go="vocab:' + uid + '" type="button">📖 Alle Wörter dieser Unit</button></div>';

    h += '<div class="sec">Lektionen</div>';
    for (var i = 0; i < ls.length; i++) {
      var l = ls[i], r = S.lesson(l.id);
      var locked = l.type === 'challenge' && !open;
      var dot = l.empty ? 'dot' : (r && r.done ? 'dot dot--done' : (r ? 'dot dot--part' : 'dot dot--new'));
      h += '<button class="lesson" data-go="lesson:' + uid + ':' + esc(l.id) + '" type="button"' + (l.empty ? ' disabled' : '') + '>' +
        '<span class="lesson__ico">' + (locked ? '🔒' : l.icon) + '</span>' +
        '<span class="grow"><span class="lesson__t">' + esc(l.title) + '</span><br>' +
        '<span class="lesson__s">' + (l.empty ? 'Content to be added' : esc(l.sub)) + (r && r.best ? ' · Best: ' + Math.round(r.best * 100) + '%' : '') + '</span></span>' +
        '<span class="' + dot + '"></span></button>';
    }
    return h;
  };

  /* ---------- Grammatik: Learn / Practice / Challenge ---------- */
  V.learn = function (uid, gid) {
    var g = D.grammar[gid];
    if (!g) return '<div class="empty">Content to be added</div>';
    var lid = uid + ':gram:' + gid, r = S.lesson(lid);
    var h = '<div class="card"><div class="tiny">GRAMMAR</div><div class="h1">' + esc(g.title) + '</div>' +
      '<div class="muted">' + esc(g.titleDe) + '</div></div>';
    h += '<div class="card"><b>1. Learn</b><p class="mt-s">' + esc(g.learn.intro) + '</p><ul class="mt">';
    for (var i = 0; i < g.learn.rules.length; i++) {
      h += '<li class="row mt-s" style="align-items:flex-start"><b style="min-width:44%">' + esc(g.learn.rules[i].en) + '</b>' +
        '<span class="muted grow">' + esc(g.learn.rules[i].de) + '</span></li>';
    }
    h += '</ul>' + (g.learn.note ? '<div class="fb fb--ok mt"><div class="fb__w">💡 ' + esc(g.learn.note) + '</div></div>' : '') +
      (w.Speech.supported() ? '<button class="btn btn--ghost mt" data-go="say:' + esc(gid) + '" type="button">🔊 Beispiele anhören</button>' : '') +
      '</div>';
    h += '<button class="card card--tap" data-go="gram:' + uid + ':' + gid + ':practice" type="button">' +
      '<div class="row"><div class="lesson__ico">✏️</div><div class="grow"><div class="lesson__t">2. Practice</div>' +
      '<div class="lesson__s">' + g.practice.length + ' einfache Aufgaben</div></div><span style="font-size:22px">▶</span></div></button>';
    h += '<button class="card card--tap" data-go="gram:' + uid + ':' + gid + ':challenge" type="button">' +
      '<div class="row"><div class="lesson__ico">🔥</div><div class="grow"><div class="lesson__t">3. Challenge</div>' +
      '<div class="lesson__s">' + g.challenge.length + ' schwierigere Aufgaben</div></div><span style="font-size:22px">▶</span></div></button>';
    if (r && r.best) h += '<p class="tiny center">Bestes Ergebnis: ' + Math.round(r.best * 100) + ' %</p>';
    return h;
  };

  /* ---------- Vokabelliste ---------- */
  var vocabFilter = 'all';
  V.vocab = function (uid) {
    var u = E.unitById(uid), items = SRS.ofUnit(uid), st = SRS.stats(uid);
    var h = '<div class="card"><div class="tiny">UNIT ' + (u ? u.no : '') + '</div><b>Wortschatz</b>' +
      '<div class="mt-s">' + bar(st.pct) + '</div>' +
      '<div class="tiny mt-s">' + st.seen + ' von ' + st.total + ' Wörtern geübt · ' + st.mastered + ' gemeistert</div>' +
      '<button class="btn mt" data-go="trainvoc:' + uid + '" type="button">▶ Diese Wörter trainieren</button></div>';
    h += '<div class="row wrap mb">';
    var f = [['all', 'Alle'], ['new', '🔴 Neu'], ['unsure', '🟠 Unsicher'], ['learning', '🟡 In Arbeit'], ['good', '🟢 Gut'], ['mastered', '⭐ Top']];
    for (var i = 0; i < f.length; i++) {
      h += '<button class="btn btn--sm ' + (vocabFilter === f[i][0] ? '' : 'btn--ghost') + '" data-go="vfilter:' + f[i][0] + ':' + uid + '" type="button">' + f[i][1] + '</button>';
    }
    h += '</div>';
    var shown = 0;
    for (i = 0; i < items.length; i++) {
      var s = SRS.status(items[i].id), meta = SRS.STATUS[s];
      if (vocabFilter !== 'all' && meta.key !== vocabFilter) continue;
      shown++;
      var rec = SRS.recRaw(items[i].id);
      h += '<div class="vcard"><div class="row row--between">' +
        '<div class="grow"><div class="vcard__en"><span class="stat" style="background:' + meta.col + '"></span>' + esc(items[i].en) + '</div>' +
        '<div class="vcard__de">' + esc(items[i].de) + '</div>' +
        (items[i].ex ? '<div class="vcard__ex">„' + esc(items[i].ex) + '“</div>' : '') +
        '<div class="tiny mt-s">' + meta.icon + ' ' + meta.label + (rec ? ' · ✓' + rec.c + ' ✗' + rec.w : '') + '</div></div>' +
        (w.Speech.supported() ? '<button class="btn btn--icon btn--ghost" data-go="sayw:' + esc(items[i].id) + '" type="button">🔊</button>' : '') +
        '</div></div>';
    }
    if (!shown) h += '<div class="empty"><span class="empty__ico">🔎</span>Keine Wörter in dieser Kategorie.</div>';
    return h;
  };

  /* ---------- Spiele ---------- */
  V.games = function () {
    var s = S.data(), h = '<div class="sec">Spiele</div>';
    for (var i = 0; i < Games.list.length; i++) {
      var g = Games.list[i], r = s.games[g.id];
      h += '<button class="card card--tap" data-go="game:' + g.id + '" type="button"><div class="row">' +
        '<div class="lesson__ico">' + g.icon + '</div><div class="grow"><div class="lesson__t">' + esc(g.name) + '</div>' +
        '<div class="lesson__s">' + esc(g.desc) + (r ? ' · Best: ' + r.best : '') + '</div></div>' +
        '<span style="font-size:22px">▶</span></div></button>';
    }
    h += '<div class="card"><b>Wörter aus welcher Unit?</b><div class="muted mt-s">Ohne Auswahl kommen Wörter aus allen Units.</div>' +
      '<div class="row wrap mt">';
    h += '<button class="btn btn--sm ' + (gameUnit ? 'btn--ghost' : '') + '" data-go="gunit:all" type="button">Alle</button>';
    for (i = 0; i < D.units.length; i++) {
      h += '<button class="btn btn--sm ' + (gameUnit === D.units[i].id ? '' : 'btn--ghost') + '" data-go="gunit:' + D.units[i].id + '" type="button">U' + D.units[i].no + '</button>';
    }
    return h + '</div></div>';
  };
  var Games = w.Games, gameUnit = null;

  /* ---------- Tests ---------- */
  var testUnit = null, testLevel = 'normal';
  V.tests = function () {
    var h = '<div class="card card--hero"><div class="h1">📝 Test Training</div>' +
      '<div class="muted">Übe gezielt für die nächste Klassenarbeit.</div></div>';

    h += '<div class="card"><b>1. Welche Unit?</b><div class="row wrap mt-s">';
    h += '<button class="btn btn--sm ' + (testUnit ? 'btn--ghost' : '') + '" data-go="tunit:all" type="button">Alle</button>';
    for (var i = 0; i < D.units.length; i++) {
      h += '<button class="btn btn--sm ' + (testUnit === D.units[i].id ? '' : 'btn--ghost') + '" data-go="tunit:' + D.units[i].id + '" type="button">Unit ' + D.units[i].no + '</button>';
    }
    h += '</div></div>';

    h += '<div class="card"><b>2. Schwierigkeit</b><div class="grid3 mt-s">';
    var lv = [['easy', 'Easy'], ['normal', 'Normal'], ['hard', 'Hard']];
    for (i = 0; i < lv.length; i++) {
      h += '<button class="btn btn--sm ' + (testLevel === lv[i][0] ? '' : 'btn--ghost') + '" data-go="tlevel:' + lv[i][0] + '" type="button">' + lv[i][1] + '</button>';
    }
    h += '</div></div>';

    h += '<div class="sec">3. Test starten</div>';
    var kinds = [
      ['voc', '📚', 'Vocabulary Test', '15 Fragen nur Wortschatz'],
      ['gram', '🧩', 'Grammar Test', '15 Fragen nur Grammatik'],
      ['mixed', '🎲', 'Mixed Test', '20 Fragen aus allen Bereichen'],
      ['ten', '⏱️', '10-Minute Test', '25 Fragen, kompakt'],
      ['full', '🏆', 'Full Unit Test', '30 Fragen wie eine Klassenarbeit']
    ];
    for (i = 0; i < kinds.length; i++) {
      h += '<button class="lesson" data-go="test:' + kinds[i][0] + '" type="button">' +
        '<span class="lesson__ico">' + kinds[i][1] + '</span><span class="grow">' +
        '<span class="lesson__t">' + kinds[i][2] + '</span><br><span class="lesson__s">' + kinds[i][3] + '</span></span>' +
        '<span style="font-size:20px">▶</span></button>';
    }

    h += '<button class="card card--tap card--hero mt" data-go="panic" type="button">' +
      '<div class="h2">🚨 Test Tomorrow?</div><div class="muted mt-s">Keine Panik. Wir machen dich fit – in ca. 15 Minuten.</div></button>';

    var t = S.data().tests;
    if (t.length) {
      h += '<div class="sec">Letzte Ergebnisse</div><div class="card">';
      for (i = 0; i < Math.min(8, t.length); i++) {
        var d = new Date(t[i].ts);
        h += '<div class="row row--between' + (i ? ' mt-s' : '') + '"><span class="grow">' + esc(t[i].label) + '<br><span class="tiny">' +
          d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + '</span></span>' +
          '<b style="color:' + (t[i].pct >= 60 ? '#16A34A' : '#DC2626') + '">' + t[i].pct + '%</b></div>';
      }
      h += '</div>';
    }
    return h;
  };

  /* ---------- Panik-Modus ---------- */
  V.panic = function () {
    var h = '<div class="card card--hero"><div class="h1">🚨 Test Tomorrow?</div>' +
      '<div class="muted">Keine Panik. Wir machen dich fit.</div></div>' +
      '<div class="card"><b>Für welche Unit schreibst du?</b><div class="mt-s muted">Das Training dauert etwa 10–20 Minuten:</div>' +
      '<ol class="mt-s muted"><li>1. Deine schwierigen Wörter</li><li>2. Typische Grammatikfehler</li>' +
      '<li>3. 10 Quizfragen</li><li>4. Eine kurze Schreibaufgabe</li><li>5. Abschlusstest</li></ol></div>';
    for (var i = 0; i < D.units.length; i++) {
      var u = D.units[i];
      h += '<button class="lesson" data-go="panicgo:' + u.id + '" type="button">' +
        '<span class="lesson__ico" style="background:' + u.color + ';color:#fff">' + u.no + '</span>' +
        '<span class="grow"><span class="lesson__t">Unit ' + u.no + ' – ' + esc(u.title) + '</span><br>' +
        '<span class="lesson__s">' + esc(u.intro) + '</span></span><span style="font-size:20px">▶</span></button>';
    }
    return h;
  };

  /* ---------- Fortschritt ---------- */
  V.progress = function () {
    var li = S.levelInfo(), s = S.data(), st = SRS.stats();
    var h = '<div class="card card--hero"><div class="h1">My Progress</div>' +
      '<div class="row row--between mt"><div><div class="tiny" style="color:rgba(255,255,255,.8)">LEVEL</div><div class="h1">' + li.lvl + ' · ' + esc(li.name) + '</div></div>' +
      '<div class="center"><div class="h1">' + S.streakView() + '</div><div class="tiny" style="color:rgba(255,255,255,.8)">🔥 Serie</div></div></div>' +
      '<div class="mt">' + bar(li.pct) + '</div><div class="tiny mt-s" style="color:rgba(255,255,255,.85)">⭐ ' + li.xp + ' XP</div></div>';

    var cats = [['Vocabulary', st.pct, ''], ['Grammar', typeProgress('grammar').pct, 'bar--violet'],
                ['Listening', typeProgress('listening').pct, 'bar--amber'], ['Reading', typeProgress('reading').pct, 'bar--green'],
                ['Speaking', typeProgress('speaking').pct, ''], ['Writing', typeProgress('writing').pct, 'bar--violet'],
                ['Everyday English', typeProgress('everyday').pct, 'bar--green']];
    h += '<div class="card">';
    for (var i = 0; i < cats.length; i++) {
      h += '<div class="' + (i ? 'mt' : '') + '"><div class="row row--between"><span>' + cats[i][0] + '</span><b>' + cats[i][1] + '%</b></div>' +
        bar(cats[i][1], cats[i][2]) + '</div>';
    }
    h += '</div>';

    var mins = Math.round(s.timeSec / 60);
    var stats = [
      ['Wörter geübt', st.seen + ' / ' + st.total],
      ['Wörter gemeistert', st.mastered],
      ['Richtige Antworten', s.correct],
      ['Falsche Antworten', s.wrong],
      ['Quizze / Lektionen', Object.keys(s.lessons).length],
      ['Tests gemacht', s.tests.length],
      ['Längste Lernserie', s.streak.best + ' Tage'],
      ['Gesamte Lernzeit', mins >= 60 ? Math.floor(mins / 60) + ' h ' + (mins % 60) + ' min' : mins + ' min']
    ];
    h += '<div class="sec">Zahlen</div><div class="card">';
    for (i = 0; i < stats.length; i++) {
      h += '<div class="row row--between' + (i ? ' mt-s' : '') + '"><span class="muted">' + stats[i][0] + '</span><b>' + stats[i][1] + '</b></div>';
    }
    h += '</div>';

    h += '<div class="sec">Wortschatz-Status</div><div class="card">';
    for (i = 0; i < SRS.STATUS.length; i++) {
      var pct = st.total ? Math.round(st.buckets[i] / st.total * 100) : 0;
      h += '<div class="' + (i ? 'mt-s' : '') + '"><div class="row row--between"><span>' + SRS.STATUS[i].icon + ' ' + SRS.STATUS[i].label + '</span><b>' + st.buckets[i] + '</b></div>' +
        '<div class="bar" style="height:6px"><div class="bar__fill" style="width:' + pct + '%;background:' + SRS.STATUS[i].col + '"></div></div></div>';
    }
    h += '</div>';

    h += '<button class="card card--tap" data-go="ach" type="button"><div class="row"><div class="lesson__ico">🏆</div>' +
      '<div class="grow"><div class="lesson__t">Auszeichnungen</div><div class="lesson__s">' +
      Object.keys(s.ach).length + ' von ' + D.achievements.length + ' freigeschaltet</div></div><span style="font-size:22px">▶</span></div></button>';
    h += '<button class="card card--tap" data-go="parents" type="button"><div class="row"><div class="lesson__ico">👨‍👩‍👦</div>' +
      '<div class="grow"><div class="lesson__t">Elternbereich</div><div class="lesson__s">Lernzeit, Schwächen, Einstellungen</div></div>' +
      '<span style="font-size:22px">▶</span></div></button>';
    return h;
  };

  V.ach = function () {
    var s = S.data(), h = '<div class="sec">Auszeichnungen</div>';
    for (var i = 0; i < D.achievements.length; i++) {
      var a = D.achievements[i], got = !!s.ach[a.id];
      h += '<div class="ach' + (got ? '' : ' ach--locked') + '"><div class="ach__ico">' + (got ? a.icon : '🔒') + '</div>' +
        '<div class="grow"><b>' + esc(a.name) + '</b><div class="tiny">' + esc(a.desc) + '</div></div>' +
        (got ? '<span class="badge badge--ok">✓</span>' : '') + '</div>';
    }
    return h;
  };

  /* ---------- Elternbereich ---------- */
  V.parents = function () {
    var s = S.data(), st = SRS.stats(), weak = SRS.weak(10);
    var mins = Math.round(s.timeSec / 60);
    var days = Object.keys(s.days).sort().slice(-7);
    var h = '<div class="card"><div class="h1">👨‍👩‍👦 Elternbereich</div>' +
      '<div class="muted mt-s">Alle Daten bleiben auf diesem Gerät. Kein Konto, keine Übertragung ins Internet.</div></div>';

    h += '<div class="card"><b>Überblick</b>' +
      row('Level', S.levelInfo().lvl + ' (' + s.xp + ' XP)') +
      row('Aktuelle Lernserie', S.streakView() + ' Tage (Rekord: ' + s.streak.best + ')') +
      row('Gesamte Lernzeit', (mins >= 60 ? Math.floor(mins / 60) + ' h ' + (mins % 60) + ' min' : mins + ' min')) +
      row('Wörter geübt', st.seen + ' von ' + st.total) +
      row('Wörter gemeistert', st.mastered) +
      row('Units abgeschlossen', Object.keys(s.units).filter(function (k) { return s.units[k].done; }).length + ' von ' + D.units.length) +
      row('Richtig / Falsch', s.correct + ' / ' + s.wrong) + '</div>';

    if (days.length) {
      h += '<div class="card"><b>Letzte 7 Lerntage</b>';
      for (var i = days.length - 1; i >= 0; i--) {
        var d = s.days[days[i]], p = days[i].split('-');
        h += row(p[2] + '.' + p[1] + '.', Math.round(d.sec / 60) + ' min · ' + d.xp + ' XP');
      }
      h += '</div>';
    }

    h += '<div class="card"><b>Aktuelle Schwächen</b>';
    if (weak.length) {
      h += '<div class="mt-s">';
      for (i = 0; i < weak.length; i++) {
        var r = SRS.recRaw(weak[i].id);
        h += '<div class="row row--between mt-s"><span>' + esc(weak[i].en) + ' <span class="tiny">(' + esc(weak[i].de) + ')</span></span>' +
          '<span class="tiny">✗' + (r ? r.w : 0) + ' / ✓' + (r ? r.c : 0) + '</span></div>';
      }
      h += '</div>';
    } else h += '<div class="muted mt-s">Noch keine auffälligen Fehler.</div>';
    h += '</div>';

    if (s.tests.length) {
      h += '<div class="card"><b>Testergebnisse</b>';
      for (i = 0; i < Math.min(10, s.tests.length); i++) {
        var dt = new Date(s.tests[i].ts);
        h += row(dt.getDate() + '.' + (dt.getMonth() + 1) + '. ' + s.tests[i].label, s.tests[i].pct + ' %');
      }
      h += '</div>';
    }

    h += '<div class="card"><b>Einstellungen</b>' +
      '<div class="row row--between mt"><span>Sprachausgabe</span>' +
      '<button class="btn btn--sm ' + (s.settings.sound ? '' : 'btn--ghost') + '" data-go="toggle:sound" type="button">' + (s.settings.sound ? 'An' : 'Aus') + '</button></div>' +
      (w.Speech.recogSupported()
        ? '<div class="row row--between mt"><span>Mikrofon beim Nachsprechen</span>' +
          '<button class="btn btn--sm ' + (s.settings.mic !== false ? '' : 'btn--ghost') + '" data-go="toggle:mic" type="button">' + (s.settings.mic !== false ? 'An' : 'Aus') + '</button></div>'
        : '') +
      '<div class="row row--between mt"><span>Sprechtempo</span><span>' +
      ['slow', 'normal', 'fast'].map(function (k, i2) {
        var v = [0.7, 0.85, 1][i2];
        return '<button class="btn btn--sm ' + (Math.abs(s.settings.rate - v) < 0.02 ? '' : 'btn--ghost') + '" data-go="rate:' + v + '" type="button">' + k + '</button>';
      }).join(' ') + '</span></div>' +
      '<div class="tiny mt">Sprachausgabe: ' + (w.Speech.supported() ? (w.Speech.ready() ? 'verfügbar ✓' : 'wird geladen …') : 'auf diesem Gerät nicht verfügbar') + '</div>' +
      '<div class="tiny">Spracherkennung: ' + (w.Speech.recogSupported() ? 'verfügbar ✓ (beim ersten Mal fragt Android nach der Mikrofon-Erlaubnis). Die App stellt die Sprache selbst ein: Englisch beim Nachsprechen, Deutsch bei Übersetzungen ins Deutsche, unabhängig von der Handy-Sprache.' : 'auf diesem Gerät nicht verfügbar, Nachsprechen läuft als Selbstkontrolle') + '</div>' +
      '<div class="tiny">Speicher: ' + (S.storageOk() ? 'localStorage aktiv ✓' : '⚠️ Browser blockiert das Speichern') + '</div>' +
      '</div>';

    h += '<div class="card"><b>Daten</b>' +
      '<button class="btn btn--ghost mt" data-go="export" type="button">Fortschritt anzeigen (Backup)</button>' +
      '<button class="btn btn--ghost mt" data-go="reset" type="button" style="color:#DC2626;border-color:#FECACA">Allen Fortschritt löschen</button></div>';

    var unconfirmed = D.units.filter(function (u) { return !u.titleConfirmed; });
    if (unconfirmed.length) {
      h += '<div class="card"><b>Hinweis für Eltern</b><div class="muted mt-s">Die Unit-Titel sind noch vorläufig ' +
        '(' + unconfirmed.length + ' von ' + D.units.length + '). Sie lassen sich in der Datei <b>data/units.js</b> anpassen. ' +
        'Bereiche mit dem Hinweis „Content to be added“ warten auf eigene Inhalte.</div></div>';
    }
    return h;
  };
  function row(a, b) { return '<div class="row row--between mt-s"><span class="muted">' + esc(a) + '</span><b>' + esc(b) + '</b></div>'; }

  /* =========================================================
     Router
     ========================================================= */
  var TITLES = { home: 'English Adventure', units: 'Units', games: 'Spiele', tests: 'Test Training',
                 progress: 'Fortschritt', ach: 'Auszeichnungen', parents: 'Elternbereich', panic: 'Test Tomorrow?' };

  UI.render = function (route) {
    screen = document.getElementById('screen');
    topTitle = document.getElementById('topTitle');
    backBtn = document.getElementById('backBtn');
    document.getElementById('topbar').hidden = false;
    document.getElementById('tabbar').hidden = false;
    screen.className = 'screen';

    var p = route.split('/'), name = p[0] || 'home', html = '', title = TITLES[name] || 'English Adventure', back = false;
    if (name === 'unit') { var u = E.unitById(p[1]); html = V.unit(p[1]); title = u ? 'Unit ' + u.no + ' – ' + u.title : 'Unit'; back = true; }
    else if (name === 'vocab') { html = V.vocab(p[1]); title = 'Wortschatz'; back = true; }
    else if (name === 'learn') { html = V.learn(p[1], p[2]); title = 'Grammar'; back = true; }
    else if (V[name]) { html = V[name](); back = (name !== 'home' && !document.querySelector('.tab[data-nav="' + name + '"]')); }
    else { html = V.home(); name = 'home'; }

    screen.innerHTML = html;
    topTitle.textContent = title;
    backBtn.hidden = !back;
    document.getElementById('pillXp').textContent = S.data().xp + ' XP';
    document.getElementById('pillStreak').textContent = S.streakView();
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      var n = tabs[i].getAttribute('data-nav');
      tabs[i].className = 'tab' + (n === name || (name === 'ach' && n === 'progress') || (name === 'parents' && n === 'progress') ||
        (name === 'unit' && n === 'units') || (name === 'vocab' && n === 'units') || (name === 'learn' && n === 'units') ||
        (name === 'panic' && n === 'tests') ? ' is-active' : '');
    }
    screen.scrollTop = 0;
    w.scrollTo(0, 0);
  };

  /* ---------------- Aktionen ---------------- */
  UI.action = function (code) {
    var p = code.split(':'), a = p[0], s = S.data();

    if (a === 'unit') return UI.go('unit/' + p[1]);
    if (a === 'vocab') return UI.go('vocab/' + p[1]);
    if (a === 'ach') return UI.go('ach');
    if (a === 'parents') return UI.go('parents');
    if (a === 'panic') return UI.go('panic');

    if (a === 'lesson') {
      var ls = E.lessonsOf(p[1]);
      for (var i = 0; i < ls.length; i++) if (ls[i].id === p.slice(2).join(':')) return UI.startLesson(ls[i]);
      return;
    }
    if (a === 'gram') {
      var gid = p[2], lvl = p[3], g = D.grammar[gid];
      var build = function () { return E.grammarTasks(gid, lvl); };
      return w.Player.start({
        title: g.title + ' · ' + (lvl === 'practice' ? 'Practice' : 'Challenge'),
        tasks: build(), lessonId: p[1] + ':gram:' + gid, kind: 'grammar', unit: p[1], rebuild: build,
        onExit: function () { UI.go('learn/' + p[1] + '/' + gid); }
      });
    }
    if (a === 'say') {
      var gg = D.grammar[p[1]]; if (!gg) return;
      w.Speech.warmup();
      var list = gg.learn.rules.map(function (r) { return r.en; }).join('. ');
      return w.Speech.speak(list);
    }
    if (a === 'sayw') { w.Speech.warmup(); var it = SRS.byId(p.slice(1).join(':')); if (it) w.Speech.speak(it.ex || it.en); return; }
    if (a === 'vfilter') { vocabFilter = p[1]; return UI.render('vocab/' + p[2]); }

    if (a === 'claim') { var got = S.missionClaim(); if (got) UI.toast('🎯 Mission geschafft! +' + got + ' XP'); return UI.render('home'); }

    if (a === 'weak') {
      var weak = SRS.weak(12);
      if (!weak.length) return UI.toast('Keine Problemwörter – super!');
      var b1 = function () { return E.vocabTasks(SRS.weak(12), ['mc1', 'mc2', 'type', 'gap'], 2); };
      return w.Player.start({ title: 'Weak words', tasks: b1(), kind: 'review', rebuild: b1,
        onExit: function () { UI.go('home'); } });
    }
    if (a === 'review') {
      var due = SRS.pick({ mode: 'due', n: 15 });
      if (!due.length) due = SRS.pick({ n: 15 });
      if (!due.length) return UI.toast('Noch keine Wörter zum Wiederholen.');
      var b2 = function () { var d = SRS.pick({ mode: 'due', n: 15 }); if (!d.length) d = SRS.pick({ n: 15 }); return E.vocabTasks(d, ['mc1', 'mc2', 'type', 'gap'], 1); };
      return w.Player.start({ title: 'Wiederholung', tasks: b2(), kind: 'review', rebuild: b2,
        onExit: function () { UI.go('home'); } });
    }
    if (a === 'trainvoc') {
      var uid = p[1];
      var b3 = function () { return E.vocabTasks(SRS.pick({ unit: uid, n: 12 }), ['mc1', 'mc2', 'type', 'gap'], 2); };
      return w.Player.start({ title: 'Wortschatz Unit ' + (E.unitById(uid) || {}).no, tasks: b3(), kind: 'review', unit: uid, rebuild: b3,
        onExit: function () { UI.go('vocab/' + uid); } });
    }

    if (a === 'gunit') { gameUnit = p[1] === 'all' ? null : p[1]; return UI.render('games'); }
    if (a === 'game') { return w.Games.start(p[1], gameUnit, function () { UI.render('games'); }); }

    if (a === 'tunit') { testUnit = p[1] === 'all' ? null : p[1]; return UI.render('tests'); }
    if (a === 'tlevel') { testLevel = p[1]; return UI.render('tests'); }
    if (a === 'test') {
      var conf = {
        voc:   { n: 15, parts: ['vocab'], label: 'Vocabulary Test' },
        gram:  { n: 15, parts: ['grammar'], label: 'Grammar Test' },
        mixed: { n: 20, parts: ['vocab', 'grammar', 'writing', 'everyday'], label: 'Mixed Test' },
        ten:   { n: 25, parts: ['vocab', 'grammar', 'writing'], label: '10-Minute Test' },
        full:  { n: 30, parts: ['vocab', 'grammar', 'reading', 'writing', 'listening', 'everyday'], label: 'Full Unit Test' }
      }[p[1]];
      var o = { unit: testUnit, level: testLevel, n: conf.n, parts: conf.parts };
      var b4 = function () { return E.mixedTest(o); };
      var t4 = b4();
      if (!t4.length) return UI.toast('Für diese Auswahl gibt es noch keine Aufgaben.');
      return w.Player.start({
        title: conf.label + (testUnit ? ' · Unit ' + E.unitById(testUnit).no : '') + ' · ' + testLevel,
        tasks: t4, kind: 'test', isTest: true, unit: testUnit, rebuild: b4,
        onExit: function () { UI.go('tests'); }
      });
    }

    if (a === 'panicgo') return UI.panic(p[1]);

    if (a === 'toggle') {
      if (p[1] === 'mic') s.settings.mic = (s.settings.mic === false);
      else s.settings.sound = !s.settings.sound;
      S.saveNow(); return UI.render('parents');
    }
    if (a === 'rate') { s.settings.rate = parseFloat(p[1]); S.saveNow(); w.Speech.speak('This is my speed.'); return UI.render('parents'); }
    if (a === 'reset') {
      if (w.confirm('Wirklich ALLEN Lernfortschritt löschen? Das kann nicht rückgängig gemacht werden.')) {
        S.reset(); UI.toast('Fortschritt gelöscht.'); return UI.go('home');
      }
      return;
    }
    if (a === 'export') {
      var d = S.data();
      w.prompt('Backup-Text (kopieren und sicher aufbewahren):', JSON.stringify({ xp: d.xp, streak: d.streak, words: Object.keys(d.words).length, lessons: Object.keys(d.lessons).length, time: d.timeSec }));
      return;
    }
  };

  /* ---------------- Panik-Modus: Kette aus Etappen ---------------- */
  UI.panic = function (uid) {
    var u = E.unitById(uid); if (!u) return;
    var steps = [];
    var weakIds = SRS.pick({ unit: uid, mode: 'weak', n: 10 });
    if (weakIds.length < 6) weakIds = SRS.pick({ unit: uid, n: 10 });
    steps.push({ label: '1/5 Schwierige Wörter', tasks: E.vocabTasks(weakIds, ['mc1', 'type', 'gap'], 2) });

    var gTasks = [];
    for (var i = 0; i < u.grammar.length; i++) {
      gTasks = gTasks.concat(E.grammarTasks(u.grammar[i], 'practice').slice(0, 2));
      gTasks = gTasks.concat(E.grammarTasks(u.grammar[i], 'challenge').slice(0, 1));
    }
    steps.push({ label: '2/5 Typische Grammatikfehler', tasks: E.shuffle(gTasks).slice(0, 12) });
    steps.push({ label: '3/5 10 Quizfragen', tasks: E.mixedTest({ unit: uid, level: 'normal', n: 10, parts: ['vocab', 'grammar', 'everyday'] }) });
    steps.push({ label: '4/5 Schreibaufgabe', tasks: E.writingTasks(uid) });
    steps.push({ label: '5/5 Abschlusstest', tasks: E.mixedTest({ unit: uid, level: 'normal', n: 15, parts: ['vocab', 'grammar', 'reading', 'writing'] }), isTest: true });

    steps = steps.filter(function (s2) { return s2.tasks && s2.tasks.length; });
    if (!steps.length) return UI.toast('Für diese Unit gibt es noch keine Inhalte.');

    var k = 0;
    function run(reason) {
      if (reason === 'quit') { UI.toast('Training abgebrochen.'); return UI.go('tests'); }
      if (k >= steps.length) {
        UI.toast('🚀 Du bist fit für morgen! Viel Erfolg!');
        return UI.go('tests');
      }
      var st2 = steps[k++];
      w.Player.start({
        title: '🚨 Unit ' + u.no + ' · ' + st2.label,
        tasks: st2.tasks, kind: 'panic', unit: uid, isTest: !!st2.isTest, retryable: false,
        onExit: run
      });
    }
    run();
  };
})(window);
