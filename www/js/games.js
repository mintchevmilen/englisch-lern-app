/* =============================================================
   js/games.js – Drei leichtgewichtige Lernspiele
   Kein Canvas, keine Animationen mit Dauerschleife – nur DOM.
   ============================================================= */
(function (w) {
  var D = w.DATA, S = w.Store, SRS = w.SRS, E = w.Engine;
  var G = w.Games = {};
  var host, timer = null, onExit = null;

  G.list = [
    { id: 'match',   icon: '🔗', name: 'Word Match',      desc: 'Englisch und Deutsch verbinden' },
    { id: 'runner',  icon: '⚡', name: 'Word Runner',     desc: 'Schnell die richtige Übersetzung' },
    { id: 'builder', icon: '🧱', name: 'Sentence Builder', desc: 'Wörter in die richtige Reihenfolge' }
  ];

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function open() {
    host = document.getElementById('screen');
    host.className = 'screen screen--full';
    document.getElementById('topbar').hidden = true;
    document.getElementById('tabbar').hidden = true;
  }
  function close() {
    if (timer) { clearInterval(timer); timer = null; }
    w.Speech.stop();
    document.getElementById('topbar').hidden = false;
    document.getElementById('tabbar').hidden = false;
    S.saveNow();
    if (onExit) onExit();
  }
  G.close = close;

  function top(title, right) {
    return '<div class="play__top">' +
      '<button class="play__close" data-act="close" type="button" aria-label="Beenden">&times;</button>' +
      '<div class="grow"><b>' + esc(title) + '</b></div>' +
      '<div class="hearts">' + (right || '') + '</div></div>';
  }
  function score(id, pts) {
    var s = S.data();
    if (!s.games[id]) s.games[id] = { plays: 0, best: 0 };
    s.games[id].plays++;
    if (pts > s.games[id].best) s.games[id].best = pts;
    S.save();
  }
  function words(unit, n) {
    var pool = unit ? SRS.ofUnit(unit) : SRS.all();
    pool = pool.filter(function (x) { return x.en && x.de; });
    return E.shuffle(pool.slice()).slice(0, n);
  }
  function finish(id, title, pts, sub) {
    score(id, pts);
    var xp = Math.max(5, Math.round(pts / 2));
    S.addXp(xp); S.touchStreak(); S.missionAdd('quiz', 1);
    var ach = w.UI.checkAchievements(1, 0, { kind: 'game' });
    S.saveNow();
    host.innerHTML = top(title) +
      '<div class="play__body center">' +
        '<div class="h1 mt">🎮 Runde beendet!</div>' +
        '<div class="result__ring"><div class="result__pct">' + pts + '</div><div class="tiny">Punkte</div></div>' +
        (sub ? '<p class="muted">' + esc(sub) + '</p>' : '') +
        '<div class="card"><div class="row row--between"><span class="muted">Bestwert</span><b>' + S.data().games[id].best + '</b></div>' +
        '<div class="row row--between mt-s"><span class="muted">XP</span><b>+' + xp + '</b></div></div>' +
        (ach.length ? '<div class="card card--hero"><div class="h2">🏆 Neue Auszeichnung!</div><div class="mt-s">' +
          ach.map(function (a) { return a.icon + ' ' + esc(a.name); }).join('<br>') + '</div></div>' : '') +
      '</div>' +
      '<div class="play__foot"><button class="btn btn--ghost mb" data-act="redo" type="button">↻ Nochmal</button>' +
      '<button class="btn" data-act="close" type="button">Fertig</button></div>';
    host.onclick = function (e) {
      var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b) return;
      if (b.getAttribute('data-act') === 'close') return close();
      if (b.getAttribute('data-act') === 'redo') G.start(id, G._unit, onExit);
    };
  }

  G.start = function (id, unit, exit) {
    onExit = exit || onExit;
    G._unit = unit || null;
    open();
    if (id === 'match') return match(unit);
    if (id === 'runner') return runner(unit);
    if (id === 'builder') return builder(unit);
    close();
  };

  /* ---------- Spiel 1: Word Match ---------- */
  function match(unit) {
    var ROUND = 5, round = 0, pts = 0, sel = null, left = 0;
    function deal() {
      round++;
      var ws = words(unit, 5);
      if (ws.length < 3) { w.UI.toast('Zu wenige Wörter.'); return close(); }
      left = ws.length;
      var tiles = [];
      ws.forEach(function (x) {
        tiles.push({ k: x.id, t: x.en, side: 'en', speak: x.en });
        tiles.push({ k: x.id, t: x.de, side: 'de' });
      });
      E.shuffle(tiles);
      var h = '';
      tiles.forEach(function (t, i) {
        h += '<button class="gm-tile" data-act="t" data-i="' + i + '" data-k="' + esc(t.k) + '" type="button">' + esc(t.t) + '</button>';
      });
      host.innerHTML = top('Word Match', 'Runde ' + round + '/' + ROUND) +
        '<div class="play__body">' +
          '<p class="muted center mb">Finde die Paare: Englisch ↔ Deutsch</p>' +
          '<div class="gm-grid" id="grid">' + h + '</div>' +
          '<p class="tiny center mt">Punkte: <b id="pts">' + pts + '</b></p>' +
        '</div>';
      sel = null;
      host.onclick = function (e) {
        var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b) return;
        var a = b.getAttribute('data-act');
        if (a === 'close') return close();
        if (a !== 't') return;
        if (b.className.indexOf('is-done') >= 0) return;
        var k = b.getAttribute('data-k'), i = b.getAttribute('data-i');
        var td = tiles[+i];
        if (td.side === 'en') w.Speech.speak(td.speak);
        if (!sel) { sel = { el: b, k: k, i: i }; b.className = 'gm-tile is-sel'; return; }
        if (sel.i === i) { sel.el.className = 'gm-tile'; sel = null; return; }
        if (sel.k === k) {
          sel.el.className = 'gm-tile is-done'; b.className = 'gm-tile is-done';
          pts += 10; left--; SRS.answer(k, true); S.missionAdd('words', 1);
          host.querySelector('#pts').textContent = pts;
          sel = null;
          if (left <= 0) {
            if (round >= ROUND) return setTimeout(function () { finish('match', 'Word Match', pts, 'Alle Paare gefunden!'); }, 350);
            return setTimeout(deal, 400);
          }
        } else {
          var bad = sel.el, cur = b;
          bad.className = 'gm-tile is-bad'; cur.className = 'gm-tile is-bad';
          pts = Math.max(0, pts - 3); SRS.answer(k, false);
          host.querySelector('#pts').textContent = pts;
          sel = null;
          setTimeout(function () {
            if (bad.className.indexOf('is-done') < 0) bad.className = 'gm-tile';
            if (cur.className.indexOf('is-done') < 0) cur.className = 'gm-tile';
          }, 380);
        }
      };
    }
    deal();
  }

  /* ---------- Spiel 2: Word Runner ---------- */
  function runner(unit) {
    var TOTAL = 60000, t0 = Date.now(), pts = 0, n = 0, cur = null, locked = false;
    function tick() {
      var left = Math.max(0, TOTAL - (Date.now() - t0));
      var f = host.querySelector('#tf');
      if (f) f.style.width = (left / TOTAL * 100) + '%';
      if (left <= 0) { clearInterval(timer); timer = null; finish('runner', 'Word Runner', pts, n + ' Wörter geschafft'); }
    }
    function nextQ() {
      var ws = words(unit, 1);
      if (!ws.length) return close();
      var it = ws[0];
      var wrong = SRS.distractors(it, 3, 'de');
      if (wrong.length < 3) return nextQ();
      var opts = E.shuffle([it.de].concat(wrong.map(function (x) { return x.de; })));
      cur = { it: it, opts: opts, a: opts.indexOf(it.de) };
      var h = '';
      opts.forEach(function (o, i) { h += '<button class="gm-tile" data-act="p" data-i="' + i + '" type="button">' + esc(o) + '</button>'; });
      host.innerHTML = top('Word Runner', pts + ' Pkt') +
        '<div class="play__body">' +
          '<div class="timer"><div class="timer__f" id="tf"></div></div>' +
          '<div class="card center"><div class="question">' + esc(it.en) + '</div></div>' +
          '<div class="gm-grid mt">' + h + '</div>' +
        '</div>';
      locked = false;
      w.Speech.speak(it.en);
      host.onclick = function (e) {
        var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b) return;
        if (b.getAttribute('data-act') === 'close') { if (timer) clearInterval(timer); timer = null; return close(); }
        if (b.getAttribute('data-act') !== 'p' || locked) return;
        locked = true;
        var i = +b.getAttribute('data-i'), ok = i === cur.a;
        b.className = 'gm-tile ' + (ok ? 'is-done' : 'is-bad');
        if (!ok) host.querySelectorAll('.gm-tile')[cur.a].className = 'gm-tile is-done';
        SRS.answer(cur.it.id, ok);
        if (ok) { pts += 10; n++; S.missionAdd('words', 1); } else { pts = Math.max(0, pts - 5); }
        setTimeout(function () { if (timer) nextQ(); }, ok ? 260 : 900);
      };
      tick();
    }
    nextQ();
    timer = setInterval(tick, 200);
  }

  /* ---------- Spiel 3: Sentence Builder ---------- */
  function builder(unit) {
    var ROUND = 6, round = 0, pts = 0, sel = [], cur = null, done = false;
    function pool() {
      var out = [], units = unit ? [unit] : D.units.map(function (u) { return u.id; });
      units.forEach(function (uid) {
        (D.vocab[uid] || []).forEach(function (v) {
          if (v.ex && v.ex.split(' ').length >= 3 && v.ex.split(' ').length <= 7) out.push(v.ex);
        });
        var u = E.unitById(uid);
        if (u) u.grammar.forEach(function (gid) {
          var g = D.grammar[gid]; if (!g) return;
          g.practice.concat(g.challenge).forEach(function (r) { if (r.t === 'order') out.push(r.a); });
        });
      });
      return out;
    }
    var SENT = E.shuffle(pool());
    function deal() {
      round++;
      if (round > ROUND || !SENT.length) return finish('builder', 'Sentence Builder', pts, round - 1 + ' Sätze gebaut');
      var s = SENT[(round - 1) % SENT.length];
      var clean = s.replace(/[.!?]$/, '');
      cur = { full: s, words: E.shuffle(clean.split(' ')) , target: clean };
      sel = []; done = false;
      draw();
    }
    function draw(state) {
      var h = '', i;
      for (i = 0; i < sel.length; i++) h += '<button class="chip chip--in" data-act="un" data-i="' + i + '" type="button">' + esc(cur.words[sel[i]]) + '</button>';
      var slots = h || '<span class="tiny" style="align-self:center">Tippe die Wörter an</span>';
      h = '';
      for (i = 0; i < cur.words.length; i++) h += '<button class="chip' + (sel.indexOf(i) >= 0 ? ' chip--used' : '') + '" data-act="on" data-i="' + i + '" type="button">' + esc(cur.words[i]) + '</button>';
      host.innerHTML = top('Sentence Builder', 'Satz ' + round + '/' + ROUND) +
        '<div class="play__body">' +
          '<p class="muted center mb">Bilde einen richtigen englischen Satz.</p>' +
          '<div class="slots">' + slots + '</div>' +
          '<div class="pool">' + h + '</div>' +
          (state ? state : '') +
          '<p class="tiny center mt">Punkte: <b>' + pts + '</b></p>' +
        '</div>' +
        '<div class="play__foot">' + (done
          ? '<button class="btn btn--green" data-act="next" type="button">Weiter</button>'
          : '<button class="btn" data-act="ok" type="button">Prüfen</button>') + '</div>';
      host.onclick = function (e) {
        var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b) return;
        var a = b.getAttribute('data-act');
        if (a === 'close') return close();
        if (a === 'next') return deal();
        if (done) return;
        if (a === 'on') { var i = +b.getAttribute('data-i'); if (sel.indexOf(i) < 0) { sel.push(i); draw(); } return; }
        if (a === 'un') { sel.splice(+b.getAttribute('data-i'), 1); draw(); return; }
        if (a === 'ok') {
          if (!sel.length) return w.UI.toast('Bitte zuerst Wörter antippen.');
          var given = sel.map(function (k) { return cur.words[k]; }).join(' ');
          var ok = E.norm(given) === E.norm(cur.target);
          done = true;
          if (ok) { pts += 15; w.Speech.speak(cur.full); }
          else { pts = Math.max(0, pts - 5); }
          draw(ok
            ? '<div class="fb fb--ok mt"><div class="fb__t">✅ Richtig!</div><div class="fb__a">' + esc(cur.full) + '</div></div>'
            : '<div class="fb fb--no mt"><div class="fb__t">Fast!</div><div class="fb__w">Richtig wäre:</div><div class="fb__a">' + esc(cur.full) + '</div></div>');
        }
      };
    }
    deal();
  }
})(window);
