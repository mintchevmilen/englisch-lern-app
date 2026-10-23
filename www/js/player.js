/* =============================================================
   js/player.js – Der Uebungs-Player (eine Lerneinheit spielen)
   ============================================================= */
(function (w) {
  var D = w.DATA, S = w.Store, SRS = w.SRS, E = w.Engine;
  var P = w.Player = {};
  var host, cfg, tasks, idx, res, runStreak, bestRun, answered, retry, startTs, requeued, baseLen;

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function $(sel) { return host.querySelector(sel); }

  P.active = function () { return !!cfg; };

  P.start = function (c) {
    cfg = c;
    tasks = (c.tasks || []).slice();
    if (!tasks.length) { cfg = null; w.UI.toast('Für diesen Bereich gibt es noch keine Inhalte.'); if (c.onExit) c.onExit(); return; }
    idx = 0; res = []; runStreak = 0; bestRun = 0; answered = false; retry = false;
    requeued = {}; startTs = Date.now(); baseLen = tasks.length;
    host = document.getElementById('screen');
    host.className = 'screen screen--full';
    document.getElementById('topbar').hidden = true;
    document.getElementById('tabbar').hidden = true;
    w.Speech.warmup();
    render();
  };

  function quit(force) {
    var done = idx >= tasks.length;
    if (!done && !force) {
      if (!w.confirm('Übung wirklich beenden? Der Fortschritt dieser Runde geht verloren.')) return;
    }
    w.Speech.stop();
    S.addTime(Math.min(3600, Math.round((Date.now() - startTs) / 1000)));
    S.saveNow();
    var cb = cfg && cfg.onExit;
    cfg = null;
    document.getElementById('topbar').hidden = false;
    document.getElementById('tabbar').hidden = false;
    if (cb) cb(done ? 'done' : 'quit');
  }
  P.quit = quit;

  /* ---------------- Rendering ---------------- */
  function header() {
    var pct = Math.round(Math.min(idx, baseLen) / Math.max(1, baseLen) * 100);
    return '<div class="play__top">' +
      '<button class="play__close" data-act="quit" type="button" aria-label="Beenden">&times;</button>' +
      '<div class="grow"><div class="bar"><div class="bar__fill" style="width:' + pct + '%"></div></div></div>' +
      '<div class="hearts">✓ ' + (res.filter(function (r) { return r; }).length) + '</div>' +
      '</div>';
  }

  function speakBtn(t) {
    if (!t.speak || !w.Speech.supported()) return '';
    return '<button class="btn btn--icon btn--ghost" data-act="speak" type="button" aria-label="Vorlesen">🔊</button>';
  }

  function render() {
    if (idx >= tasks.length) return finish();
    var t = tasks[idx];
    answered = false; retry = false;
    var body = '';

    if (t.kind === 'card') {
      body =
        '<div class="card center pop">' +
          '<div class="prompt">Neues Wort</div>' +
          '<div class="row" style="justify-content:center">' +
            '<div class="question">' + esc(t.question) + '</div>' + speakBtn(t) +
          '</div>' +
          '<div class="h2 mt-s" style="color:#475569">' + esc(t.sub) + '</div>' +
          (t.ex ? '<div class="hint mt">„' + esc(t.ex) + '“</div>' : '') +
          (t.exDe ? '<div class="tiny">' + esc(t.exDe) + '</div>' : '') +
          (t.tip ? '<div class="fb fb--ok mt"><div class="fb__w">💡 ' + esc(t.tip) + '</div></div>' : '') +
        '</div>';
      host.innerHTML = header() + '<div class="play__body">' + body + '</div>' +
        '<div class="play__foot"><button class="btn" data-act="next" type="button">Weiter</button></div>';
      bind();
      if (t.autoSpeak) setTimeout(function () { w.Speech.speak(t.speak); }, 180);
      return;
    }

    if (t.kind === 'repeat') {
      body =
        '<div class="card center pop">' +
          '<div class="prompt">' + esc(t.prompt) + '</div>' +
          '<div class="question">' + esc(t.question) + '</div>' +
          '<div class="muted">' + esc(t.sub || '') + '</div>' +
          (t.ex ? '<div class="hint mt">„' + esc(t.ex) + '“</div>' : '') +
          '<div class="row mt" style="justify-content:center">' +
            '<button class="btn btn--ghost btn--sm" data-act="speak" type="button">🔊 Nochmal hören</button>' +
            (t.ex ? '<button class="btn btn--ghost btn--sm" data-act="speak-ex" type="button">🔊 Satz</button>' : '') +
          '</div>' +
        '</div>' +
        '<p class="tiny center">Sprich das Wort laut nach. Danach tippe auf „Gesagt“.</p>';
      host.innerHTML = header() + '<div class="play__body">' + body + '</div>' +
        '<div class="play__foot"><button class="btn btn--green" data-act="said" type="button">✓ Gesagt</button></div>';
      bind();
      if (t.autoSpeak) setTimeout(function () { w.Speech.speak(t.speak); }, 200);
      return;
    }

    if (t.kind === 'mc') {
      var o = '';
      for (var i = 0; i < t.opts.length; i++) {
        o += '<button class="opt" data-act="pick" data-i="' + i + '" type="button">' +
             '<span class="opt__k">' + 'ABCD'.charAt(i) + '</span><span class="grow">' + esc(t.opts[i]) + '</span></button>';
      }
      body =
        '<div class="prompt">' + esc(t.prompt) + '</div>' +
        '<div class="row"><div class="question grow' + (t.listen ? '' : ' question--sm') + '">' +
          (t.listen ? '🔊 Hör genau hin' : esc(t.question)) + '</div>' + speakBtn(t) + '</div>' +
        '<div class="mt">' + o + '</div>';
      host.innerHTML = header() + '<div class="play__body">' + body + '</div>' +
        '<div class="play__foot" id="foot"></div>';
      bind();
      if (t.autoSpeak) setTimeout(function () { w.Speech.speak(t.speak); }, 250);
      return;
    }

    if (t.kind === 'input') {
      body =
        '<div class="prompt">' + esc(t.prompt) + '</div>' +
        '<div class="row"><div class="question grow question--sm">' + esc(t.question) + '</div>' + speakBtn(t) + '</div>' +
        '<div class="mt"><input class="input" id="ans" type="text" autocomplete="off" autocorrect="off" ' +
          'autocapitalize="off" spellcheck="false" placeholder="' + esc(t.ph || '') + '" ' +
          (t.de ? 'lang="de"' : 'lang="en"') + '></div>' +
        /* Der Pruefen-Knopf steht direkt unter dem Eingabefeld, damit ihn die
           Android-Tastatur nicht verdeckt. */
        '<div class="mt"><button class="btn" data-act="submit" type="button">Prüfen</button></div>';
      host.innerHTML = header() + '<div class="play__body">' + body + '</div>' +
        '<div class="play__foot" id="foot"></div>';
      bind();
      var inp = $('#ans');
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
      return;
    }

    if (t.kind === 'order') {
      host.innerHTML = header() +
        '<div class="play__body">' +
          '<div class="prompt">' + esc(t.prompt) + '</div>' +
          '<div class="slots" id="slots"></div>' +
          '<div class="pool" id="pool"></div>' +
        '</div>' +
        '<div class="play__foot" id="foot"><button class="btn" data-act="submit" type="button">Prüfen</button></div>';
      drawOrder(t, []);
      bind();
      return;
    }
  }

  var chosen = [];
  function drawOrder(t, sel) {
    chosen = sel;
    var slots = $('#slots'), pool = $('#pool'), i, h = '';
    for (i = 0; i < sel.length; i++) {
      h += '<button class="chip chip--in" data-act="unpick" data-i="' + i + '" type="button">' + esc(t.words[sel[i]]) + '</button>';
    }
    slots.innerHTML = h || '<span class="tiny" style="align-self:center">Tippe die Wörter der Reihe nach an</span>';
    h = '';
    for (i = 0; i < t.words.length; i++) {
      var used = sel.indexOf(i) >= 0;
      h += '<button class="chip' + (used ? ' chip--used' : '') + '" data-act="opick" data-i="' + i + '" type="button">' + esc(t.words[i]) + '</button>';
    }
    pool.innerHTML = h;
  }

  function bind() {
    host.onclick = function (e) {
      var b = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!b) return;
      var a = b.getAttribute('data-act'), t = tasks[idx];
      if (a === 'quit') return quit();
      if (a === 'speak') return w.Speech.speak(t.speak);
      if (a === 'speak-ex') return w.Speech.speak(t.ex);
      if (a === 'next') return nextTask(true);
      if (a === 'said') { record(true, t); return nextTask(true); }
      if (a === 'pick') return pick(+b.getAttribute('data-i'));
      if (a === 'submit') return submit();
      if (a === 'again') return render();
      if (a === 'cont') return nextTask(false);
      if (a === 'opick') { if (answered) return; var i = +b.getAttribute('data-i'); if (chosen.indexOf(i) < 0) { chosen.push(i); drawOrder(t, chosen); } return; }
      if (a === 'unpick') { if (answered) return; chosen.splice(+b.getAttribute('data-i'), 1); drawOrder(t, chosen); return; }
    };
  }

  /* ---------------- Auswerten ---------------- */
  function pick(i) {
    if (answered) return;
    var t = tasks[idx];
    answered = true;
    var ok = (i === t.a);
    var btns = host.querySelectorAll('.opt');
    for (var k = 0; k < btns.length; k++) {
      if (k === t.a) btns[k].className = 'opt is-right';
      else if (k === i && !ok) btns[k].className = 'opt is-wrong';
      btns[k].disabled = true;
    }
    after(ok, t, t.opts[t.a]);
  }

  function submit() {
    if (answered) return;
    var t = tasks[idx], given = '';
    if (t.kind === 'order') {
      given = chosen.map(function (i) { return t.words[i]; }).join(' ');
      if (!chosen.length) { w.UI.toast('Bitte zuerst die Wörter antippen.'); return; }
    } else {
      given = $('#ans').value;
      if (!given.trim()) { w.UI.toast('Bitte etwas eintippen.'); return; }
    }
    answered = true;
    var r = E.check(given, t);
    var ok = r > 0;
    if (t.kind === 'input') {
      var inp = $('#ans'); inp.className = 'input ' + (ok ? 'is-right' : 'is-wrong'); inp.disabled = true; inp.blur();
    }
    after(ok, t, t.a, r === 1 ? given : null);
  }

  function after(ok, t, correctText, nearMiss) {
    record(ok, t);
    var foot = $('#foot') || host.querySelector('.play__foot');
    var fb;
    if (ok) {
      fb = '<div class="fb fb--ok pop"><div class="fb__t">' +
        (nearMiss ? '✅ Fast perfekt – kleiner Tippfehler!' : '✅ Richtig!') + '</div>' +
        (nearMiss ? '<div class="fb__a">' + esc(correctText) + '</div>' : '') +
        (t.why && nearMiss ? '<div class="fb__w">' + esc(t.why) + '</div>' : '') + '</div>';
    } else {
      fb = '<div class="fb fb--no pop"><div class="fb__t">Fast!</div>' +
        '<div class="fb__w">Die richtige Antwort ist:</div>' +
        '<div class="fb__a">' + esc(correctText) + '</div>' +
        (t.why ? '<div class="fb__w"><b>Warum?</b> ' + esc(t.why) + '</div>' : '') + '</div>';
    }
    var body = host.querySelector('.play__body');
    var inlineBtn = body.querySelector('[data-act="submit"]');
    if (inlineBtn && inlineBtn.parentNode) inlineBtn.parentNode.style.display = 'none';
    body.insertAdjacentHTML('beforeend', fb);
    if (!ok && t.kind !== 'mc') {
      foot.innerHTML = '<button class="btn btn--ghost mb" data-act="again" type="button">↻ Noch einmal versuchen</button>' +
                       '<button class="btn" data-act="cont" type="button">Weiter</button>';
    } else {
      foot.innerHTML = '<button class="btn' + (ok ? ' btn--green' : '') + '" data-act="cont" type="button">Weiter</button>';
    }
    if (ok && t.speak && w.Store.data().settings.sound && t.kind !== 'repeat') {
      setTimeout(function () { w.Speech.speak(t.speak); }, 120);
    }
    body.scrollIntoView ? null : null;
    var f = host.querySelector('.fb');
    if (f && f.scrollIntoView) { try { f.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
  }

  function record(ok, t) {
    if (t.noScore || t.kind === 'card') { res[idx] = true; return; }
    if (res[idx] !== undefined) return;         // Wiederholung zaehlt nicht doppelt
    res[idx] = ok;
    if (t.wordId) {
      SRS.answer(t.wordId, ok);
      if (ok) S.missionAdd('words', 1);
    }
    if (ok) {
      S.addXp(D.xp.correct);
      runStreak++;
      if (runStreak > bestRun) bestRun = runStreak;
      if (runStreak % 5 === 0) { S.addXp(D.xp.streak5); w.UI.toast('🔥 5 richtig in Folge! +' + D.xp.streak5 + ' XP'); }
      var s = S.data(); s.correct++;
    } else {
      runStreak = 0;
      S.data().wrong++;
      if (!requeued[idx]) {                     // einmal spaeter nochmal zeigen
        requeued[idx] = 1;
        var copy = {}; for (var k in t) copy[k] = t[k];
        copy.repeatOf = idx; copy.noScore = true;
        tasks.push(copy);
      }
    }
    S.save();
  }

  function nextTask() { idx++; render(); }

  /* ---------------- Ergebnis ---------------- */
  function finish() {
    var scored = 0, right = 0, i;
    for (i = 0; i < res.length; i++) {
      if (tasks[i] && (tasks[i].noScore || tasks[i].kind === 'card')) continue;
      scored++; if (res[i]) right++;
    }
    var pct = scored ? right / scored : 1;
    var pctI = Math.round(pct * 100);
    var stars = pctI >= 95 ? 5 : pctI >= 85 ? 4 : pctI >= 70 ? 3 : pctI >= 50 ? 2 : 1;
    var xp = 0, extra = [];

    if (cfg.lessonId) {
      var prev = S.lesson(cfg.lessonId);
      S.finishLesson(cfg.lessonId, pct);
      if (!(prev && prev.done) && pct >= 0.7) { xp += D.xp.lessonDone; extra.push('Lektion geschafft +' + D.xp.lessonDone); }
      else { xp += 10; extra.push('Wiederholung +10'); }
    }
    if (cfg.kind === 'grammar') S.missionAdd('grammar', 1);
    S.missionAdd('quiz', 1);

    if (cfg.isTest) {
      var s = S.data();
      s.tests.unshift({ ts: Date.now(), label: cfg.title, pct: pctI });
      if (s.tests.length > 40) s.tests.length = 40;
      if (pctI >= 60) { xp += D.xp.testPassed; extra.push('Test bestanden +' + D.xp.testPassed); }
    }
    if (cfg.unit && cfg.kind === 'challenge' && pctI >= 70) {
      var st = S.data();
      if (!st.units[cfg.unit] || !st.units[cfg.unit].done) {
        st.units[cfg.unit] = { done: true, ts: Date.now(), pct: pctI };
        xp += D.xp.unitDone; extra.push('Unit abgeschlossen +' + D.xp.unitDone);
      }
    }
    if (xp) S.addXp(xp);
    S.touchStreak();
    S.addTime(Math.min(3600, Math.round((Date.now() - startTs) / 1000)));

    var newAch = w.UI.checkAchievements(pct, scored, cfg);
    S.saveNow();

    var starTxt = '';
    for (i = 0; i < 5; i++) starTxt += i < stars ? '⭐' : '☆';

    var head = pctI >= 85 ? '🎉 Super gemacht!' : pctI >= 60 ? '👍 Gut gemacht!' : '💪 Weiter üben!';
    var h =
      '<div class="play__top"><button class="play__close" data-act="fin" type="button">&times;</button>' +
        '<div class="grow"><div class="bar"><div class="bar__fill" style="width:100%"></div></div></div></div>' +
      '<div class="play__body center">' +
        '<div class="h1 mt">' + head + '</div>' +
        '<div class="result__ring"><div class="result__pct">' + pctI + '%</div>' +
          '<div class="tiny">' + right + ' von ' + scored + '</div></div>' +
        '<div class="stars">' + starTxt + '</div>' +
        '<div class="card mt">' +
          '<div class="row row--between"><span class="muted">XP diese Runde</span><b>+' + (right * D.xp.correct + xp) + ' XP</b></div>' +
          (extra.length ? '<div class="tiny mt-s">' + extra.join(' · ') + '</div>' : '') +
          '<div class="row row--between mt"><span class="muted">Beste Serie</span><b>' + bestRun + ' richtig</b></div>' +
        '</div>' +
        (newAch.length ? '<div class="card card--hero"><div class="h2">🏆 Neue Auszeichnung!</div><div class="mt-s">' +
            newAch.map(function (a) { return a.icon + ' ' + esc(a.name); }).join('<br>') + '</div></div>' : '') +
      '</div>' +
      '<div class="play__foot">' +
        (cfg.retryable !== false ? '<button class="btn btn--ghost mb" data-act="redo" type="button">↻ Noch eine Runde</button>' : '') +
        '<button class="btn" data-act="fin" type="button">Fertig</button>' +
      '</div>';
    host.innerHTML = h;
    var again = cfg;
    host.onclick = function (e) {
      var b = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!b) return;
      if (b.getAttribute('data-act') === 'fin') return quit(true);
      if (b.getAttribute('data-act') === 'redo') {
        var c = again, rebuilt = c.rebuild ? c.rebuild() : c.tasks;
        cfg = null;
        P.start({ title: c.title, tasks: rebuilt, lessonId: c.lessonId, kind: c.kind,
                  unit: c.unit, isTest: c.isTest, onExit: c.onExit, rebuild: c.rebuild });
      }
    };
  }
})(window);
