/* Oberflaeche des Python Kurses. Reines JavaScript, keine Bibliothek. */
(function (w) {
  var root = document.getElementById('root');
  var L = w.PY_LESSONS, G = w.PY_GLOSSARY, S = w.PyStore, R = w.PyRunner, C = w.PyCheck;
  var XP_TASK = 10, XP_LESSON = 20;

  function el(tag, attrs, kids) {
    var e = document.createElement(tag), k;
    if (attrs) for (k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function toast(t) { var x = el('div', { class: 'toast', text: t }); document.body.appendChild(x); setTimeout(function () { x.remove(); }, 1800); }
  function topbar(title, back) {
    return el('div', { class: 'top' }, [
      back ? el('button', { class: 'back', 'aria-label': 'Zurück', text: '←', onclick: back }) : null,
      el('h1', { text: title }),
      el('span', { class: 'xp', text: S.get().xp + ' XP' })
    ]);
  }
  function show(nodes) { root.innerHTML = ''; nodes.forEach(function (n) { root.appendChild(n); }); w.scrollTo(0, 0); }

  function lessonDone(l) { return l.tasks.every(function (t) { return S.isDone(t.id); }); }
  function doneCount(l) { return l.tasks.filter(function (t) { return S.isDone(t.id); }).length; }
  function totalTasks() { return L.reduce(function (a, l) { return a + l.tasks.length; }, 0); }
  function totalDone() { return L.reduce(function (a, l) { return a + doneCount(l); }, 0); }

  /* ---------- Editor mit Tastenleiste und Konsole ---------- */
  function Editor(opts) {
    var ta = el('textarea', { class: 'ed', spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', rows: '9' });
    ta.value = opts.code || '';
    var con = el('div', { class: 'con' }, [el('span', { class: 'dim', text: 'Hier erscheint die Ausgabe deines Programms.' })]);
    var msg = el('div');
    var box = el('div');
    var running = false, answers = [], stopped = false, seed = 1;

    function ins(text, back) {
      var s = ta.selectionStart, e = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
      var pos = s + text.length - (back || 0);
      ta.selectionStart = ta.selectionEnd = pos; ta.focus(); changed();
    }
    function changed() { if (opts.onChange) opts.onChange(ta.value); }
    ta.addEventListener('input', changed);
    ta.addEventListener('keydown', function (ev) {
      if (ev.key === 'Tab') { ev.preventDefault(); ins('    '); }
      else if (ev.key === 'Enter') {
        var s = ta.selectionStart, before = ta.value.slice(0, s), line = before.slice(before.lastIndexOf('\n') + 1);
        var indent = (line.match(/^ */) || [''])[0];
        if (/:\s*$/.test(line)) indent += '    ';
        ev.preventDefault(); ins('\n' + indent);
      }
    });
    /* Auch auf Handy-Tastaturen ohne keydown Enter: bei Zeilenumbruch einrücken */
    ta.addEventListener('beforeinput', function (ev) {
      if (ev.inputType === 'insertLineBreak' || ev.inputType === 'insertParagraph') {
        var s = ta.selectionStart, before = ta.value.slice(0, s), line = before.slice(before.lastIndexOf('\n') + 1);
        var indent = (line.match(/^ */) || [''])[0];
        if (/:\s*$/.test(line)) indent += '    ';
        ev.preventDefault(); ins('\n' + indent);
      }
    });

    var KEYS = [['⇥', '    '], ['(', '('], [')', ')'], ['"', '"'], [':', ':'], ['=', '='], ['[', '['], [']', ']'], ['{', '{'], ['}', '}'], ["'", "'"], ['#', '#'], ['+', '+'], ['-', '-'], ['*', '*'], ['/', '/'], ['%', '%'], ['<', '<'], ['>', '>'], ['!', '!'], [',', ','], ['.', '.'], ['_', '_']];
    var keys = el('div', { class: 'keys' }, KEYS.map(function (k) {
      return el('button', { type: 'button', text: k[0], onmousedown: function (e) { e.preventDefault(); }, onclick: function () { ins(k[1]); } });
    }));

    function print(text, cls) { con.innerHTML = ''; con.appendChild(el('span', cls ? { class: cls, text: text } : { text: text })); }
    function setMsg(kind, text) { msg.innerHTML = ''; if (text) msg.appendChild(el('div', { class: 'msg ' + kind, text: text })); }

    function setBusy(b) { running = b; runBtn.hidden = b; stopBtn.hidden = !b; if (chkBtn) chkBtn.disabled = b; }

    async function run() {
      if (running) return;
      stopped = false; answers = []; seed = 1 + Math.floor(Math.random() * 100000);
      setMsg('', '');
      setBusy(true);
      print('Python startet … (beim ersten Mal dauert das einige Sekunden)', 'dim');
      for (;;) {
        var res = await R.runOnce(ta.value, answers, seed);
        if (stopped) { print('Gestoppt.', 'dim'); break; }
        if (res.status === 'need-input') {
          print(res.output);
          var a = await askInput();
          if (a === null) { print(res.output + '\n(abgebrochen)', 'dim'); break; }
          answers.push(a);
          continue;
        }
        con.innerHTML = '';
        if (res.output) con.appendChild(el('span', { text: res.output }));
        if (res.status === 'error' || res.status === 'timeout' || res.status === 'fatal') {
          con.appendChild(el('span', { class: 'err', text: (res.output ? '\n' : '') + (res.error || 'Fehler') }));
        } else if (!res.output) {
          con.appendChild(el('span', { class: 'dim', text: '(Dein Programm hat nichts ausgegeben. Benutze print(), um etwas zu zeigen.)' }));
        }
        break;
      }
      setBusy(false);
    }
    var pendingAsk = null;
    function askInput() {
      return new Promise(function (resolve) {
        var inp = el('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', enterkeyhint: 'send' });
        var row = el('div', { class: 'inrow' }, [inp, el('button', { class: 'btn chk', text: 'Senden' })]);
        function done() { var v = inp.value; row.remove(); pendingAsk = null; resolve(v); }
        row.lastChild.addEventListener('click', done);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); done(); } });
        con.parentNode.insertBefore(row, con.nextSibling);
        pendingAsk = function () { row.remove(); pendingAsk = null; resolve(null); };
        setTimeout(function () { inp.focus(); }, 50);
      });
    }

    var runBtn = el('button', { class: 'btn run', text: '▶ Ausführen', onclick: run });
    var stopBtn = el('button', { class: 'btn stop', text: '■ Stopp', hidden: '', onclick: function () { stopped = true; if (pendingAsk) pendingAsk(); R.stop(); setBusy(false); print('Gestoppt.', 'dim'); } });
    var chkBtn = null;
    var btns = el('div', { class: 'btns' }, [runBtn, stopBtn]);

    if (opts.check) {
      chkBtn = el('button', { class: 'btn chk', text: '✔ Prüfen', onclick: async function () {
        chkBtn.disabled = true; setMsg('info', 'Ich prüfe dein Programm …');
        var r = await C.check(opts.check, ta.value, R);
        chkBtn.disabled = false;
        if (r.ok) { setMsg('ok', 'Richtig! Gut gemacht.'); opts.onSolved && opts.onSolved(); }
        else { fails++; setMsg('bad', r.message); if (r.output && !/Fehler/.test(r.message)) { /* Ausgabe zeigen */ print(r.output); } if (opts.onFail) opts.onFail(fails); }
      } });
      btns.appendChild(chkBtn);
    }
    var fails = 0;
    if (opts.extraButtons) opts.extraButtons.forEach(function (b) { btns.appendChild(b); });

    box.appendChild(ta); box.appendChild(keys); box.appendChild(btns); box.appendChild(con); box.appendChild(msg);
    return { node: box, ta: ta, setCode: function (c) { ta.value = c; changed(); }, getCode: function () { return ta.value; }, msg: setMsg, run: run };
  }

  /* ---------- Startseite ---------- */
  function home() {
    var lv = S.level(), xp = S.get().xp;
    var pct = lv.next ? Math.round(100 * (xp - lv.cur.xp) / (lv.next.xp - lv.cur.xp)) : 100;
    var nodes = [topbar('Python lernen')];
    var pad = el('div', { class: 'pad' });
    pad.appendChild(el('div', { class: 'card hero' }, [
      el('div', { class: 'big', text: lv.cur.ico }),
      el('div', { style: 'flex:1' }, [
        el('b', { text: lv.cur.t }),
        el('div', { class: 'small', text: totalDone() + ' von ' + totalTasks() + ' Aufgaben geschafft' + (lv.next ? ' · noch ' + (lv.next.xp - xp) + ' XP bis ' + lv.next.t : '') }),
        el('div', { class: 'bar' }, [el('i', { style: 'width:' + pct + '%' })])
      ])
    ]));
    pad.appendChild(el('div', { class: 'tools' }, [
      el('button', { class: 'tool', onclick: workshop }, [el('span', { text: '🛠️' }), 'Werkstatt']),
      el('button', { class: 'tool', onclick: glossary }, [el('span', { text: '📖' }), 'Wörterbuch']),
      el('button', { class: 'tool', onclick: backup }, [el('span', { text: '💾' }), 'Sicherung'])
    ]));
    pad.appendChild(el('h2', { text: 'Lernpfad' }));
    L.forEach(function (l, i) {
      var d = doneCount(l), tot = l.tasks.length;
      pad.appendChild(el('button', { class: 'lrow' + (d === tot ? ' done' : ''), onclick: function () { lesson(i, 0); } }, [
        el('div', { class: 'ic', text: l.icon }),
        el('div', { class: 'tx' }, [el('b', { text: (i + 1) + '. ' + l.title }), el('span', { class: 'small', text: l.ziel })]),
        el('div', { class: 'st', text: d === tot ? '✓' : d + '/' + tot })
      ]));
    });
    pad.appendChild(el('p', { class: 'small', text: 'Das hier ist echtes Python, dieselbe Sprache wie bei großen Programmen. Dein Code läuft direkt auf dem Handy, ganz ohne Internet.' }));
    nodes.push(pad); show(nodes);
    R.warmup();
  }

  /* ---------- Lektion ---------- */
  function lesson(li, ti) {
    var l = L[li], task = l.tasks[ti], pad = el('div', { class: 'pad' });
    var tryEd = null;

    l.text.forEach(function (b) {
      if (b.p) pad.appendChild(el('p', { text: b.p }));
      if (b.code) {
        var c = el('div', { class: 'code', text: b.code });
        c.appendChild(el('br'));
        c.appendChild(el('button', { class: 'try', text: '▶ Ausprobieren', onclick: function () {
          ed.setCode(b.code); ed.msg('', ''); edHead.textContent = 'Ausprobieren';
          edHead.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } }));
        pad.appendChild(c);
      }
    });

    pad.appendChild(el('h2', { text: 'Aufgaben' }));
    var chips = el('div', { class: 'chips' }, l.tasks.map(function (t, i) {
      return el('button', { class: 'chip' + (i === ti ? ' on' : '') + (S.isDone(t.id) ? ' done' : ''), text: (i + 1) + '', onclick: function () { lesson(li, i); } });
    }));
    pad.appendChild(chips);

    var card = el('div', { class: 'card task' });
    var edHead = el('h3', { text: task.title });
    card.appendChild(edHead);
    card.appendChild(el('p', { text: task.aufgabe }));

    var hintBox = el('div');
    var hintBtn = el('button', { class: 'btn', text: '💡 Tipp', onclick: function () {
      hintBox.innerHTML = ''; hintBox.appendChild(el('div', { class: 'msg info', text: task.hint }));
    } });
    var solBtn = el('button', { class: 'btn', text: '🔓 Lösung zeigen', hidden: '', onclick: function () {
      if (w.confirm && !w.confirm('Wirklich die Lösung anschauen? Du lernst mehr, wenn du es erst selbst versuchst.')) return;
      hintBox.innerHTML = ''; hintBox.appendChild(el('div', { class: 'code', text: task.solution }));
    } });

    var saved = S.getCode(task.id);
    var ed = Editor({
      code: saved !== undefined ? saved : task.start, check: task,
      onChange: function (c) { if (edHead.textContent === task.title) S.setCode(task.id, c); },
      onFail: function (n) { if (n >= 2) solBtn.hidden = false; },
      onSolved: function () {
        var gain = S.markDone(task.id, XP_TASK);
        if (gain) {
          var extra = '';
          if (lessonDone(l)) { S.markDone('lesson-' + l.id, XP_LESSON); extra = ' Lektion geschafft! +' + XP_LESSON + ' XP'; }
          toast('+' + gain + ' XP.' + extra);
        }
        nextRow.hidden = false;
        Array.prototype.forEach.call(chips.children, function (c, i) { if (i === ti) c.classList.add('done'); });
        Array.prototype.forEach.call(document.querySelectorAll('.top .xp'), function (x) { x.textContent = S.get().xp + ' XP'; });
      },
      extraButtons: [hintBtn, solBtn]
    });
    if (saved === undefined) S.setCode(task.id, task.start);
    var resetBtn = el('button', { class: 'btn', text: '↺ Neu starten', onclick: function () { if (w.confirm('Deinen Code zurücksetzen?')) { ed.setCode(task.start); edHead.textContent = task.title; ed.msg('', ''); } } });
    ed.node.querySelector('.btns').appendChild(resetBtn);
    card.appendChild(ed.node);
    card.appendChild(hintBox);

    var last = ti === l.tasks.length - 1;
    var nextRow = el('div', { class: 'btns', hidden: '' }, [el('button', { class: 'btn chk', text: last ? (li < L.length - 1 ? 'Nächste Lektion →' : 'Fertig 🎉') : 'Nächste Aufgabe →', onclick: function () {
      if (!last) lesson(li, ti + 1); else if (li < L.length - 1) lesson(li + 1, 0); else home();
    } })]);
    card.appendChild(nextRow);
    if (S.isDone(task.id)) nextRow.hidden = false;
    pad.appendChild(card);
    show([topbar(l.title, home), pad]);
  }

  /* ---------- Werkstatt ---------- */
  function workshop(pid) {
    var progs = S.programs();
    var cur = null;
    if (typeof pid === 'string') cur = progs.filter(function (p) { return p.id === pid; })[0] || null;
    var pad = el('div', { class: 'pad' });
    pad.appendChild(el('p', { class: 'small', text: 'Hier schreibst du eigene Programme ganz frei. Speichere sie mit einem Namen, um sie später wiederzufinden.' }));
    var name = el('input', { class: 'txt', type: 'text', placeholder: 'Name des Programms', value: cur ? cur.name : '' });
    pad.appendChild(name);
    var ed = Editor({ code: cur ? cur.code : '# Schreibe hier dein Programm\nprint("Hallo!")\n' });
    var saveBtn = el('button', { class: 'btn', text: '💾 Speichern', onclick: function () {
      var p = S.saveProgram({ id: cur ? cur.id : null, name: name.value.trim() || 'Mein Programm', code: ed.getCode() });
      cur = p; toast('Gespeichert');
      renderList();
    } });
    ed.node.querySelector('.btns').appendChild(saveBtn);
    pad.appendChild(ed.node);
    var listBox = el('div');
    function renderList() {
      listBox.innerHTML = ''; var ps = S.programs();
      listBox.appendChild(el('h2', { text: 'Meine Programme' }));
      if (!ps.length) listBox.appendChild(el('p', { class: 'small', text: 'Noch nichts gespeichert.' }));
      ps.forEach(function (p) {
        listBox.appendChild(el('div', { class: 'lrow' }, [
          el('div', { class: 'ic', text: '🐍' }),
          el('button', { class: 'tx', style: 'text-align:left', onclick: function () { workshop(p.id); } }, [el('b', { text: p.name }), el('span', { class: 'small', text: p.code.split('\n').length + ' Zeilen' })]),
          el('button', { class: 'btn', text: '🗑', onclick: function () { if (w.confirm('„' + p.name + '“ löschen?')) { S.deleteProgram(p.id); if (cur && cur.id === p.id) cur = null; renderList(); } } })
        ]));
      });
      listBox.appendChild(el('button', { class: 'btn', text: '＋ Neues Programm', onclick: function () { workshop(); } }));
    }
    renderList(); pad.appendChild(listBox);
    show([topbar('Werkstatt', home), pad]);
  }

  /* ---------- Wörterbuch ---------- */
  function glossary() {
    var pad = el('div', { class: 'pad' });
    pad.appendChild(el('p', { class: 'small', text: 'Wichtige Begriffe in einfachen Worten.' }));
    var card = el('div', { class: 'card' });
    G.forEach(function (g) {
      var row = el('div', { class: 'gl' }, [el('b', { text: g.t }), el('span', { text: g.d })]);
      if (g.c) row.appendChild(el('div', { class: 'code', text: g.c }));
      card.appendChild(row);
    });
    pad.appendChild(card); show([topbar('Wörterbuch', home), pad]);
  }

  /* ---------- Sicherung ---------- */
  function backup() {
    var pad = el('div', { class: 'pad' });
    pad.appendChild(el('p', { text: 'Dein Fortschritt und deine Programme liegen nur auf diesem Handy. Mit einer Sicherung kannst du sie retten, falls die App neu installiert wird.' }));
    var ta = el('textarea', { class: 'txt', readonly: '' });
    ta.value = S.backupText();
    pad.appendChild(el('h2', { text: 'Sicherung erstellen' }));
    pad.appendChild(ta);
    pad.appendChild(el('div', { class: 'btns' }, [
      el('button', { class: 'btn chk', text: 'Text kopieren', onclick: function () {
        ta.select();
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(function () { toast('Kopiert'); }, function () { document.execCommand('copy'); toast('Kopiert'); });
        else { try { document.execCommand('copy'); toast('Kopiert'); } catch (e) { toast('Bitte markieren und selbst kopieren'); } }
      } }),
      el('button', { class: 'btn', text: 'Als Datei teilen', onclick: function () {
        var name = 'python-kurs-sicherung.json', text = ta.value;
        try {
          var f = new File([text], name, { type: 'application/json' });
          if (navigator.canShare && navigator.canShare({ files: [f] }) && navigator.share) { navigator.share({ files: [f], title: name }); return; }
        } catch (e) { /* weiter */ }
        var url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
        var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      } })
    ]));
    pad.appendChild(el('h2', { text: 'Sicherung einspielen' }));
    var inp = el('textarea', { class: 'txt', placeholder: 'Hier den Sicherungs Text einfügen' });
    pad.appendChild(inp);
    var msg = el('div');
    pad.appendChild(el('button', { class: 'btn chk', text: 'Einspielen', onclick: function () {
      var r = S.parseBackup(inp.value);
      msg.innerHTML = '';
      if (!r.ok) { msg.appendChild(el('div', { class: 'msg bad', text: r.msg })); return; }
      if (!w.confirm('Deinen jetzigen Stand durch die Sicherung ersetzen?')) return;
      S.applyBackup(r.data); toast('Eingespielt'); home();
    } }));
    pad.appendChild(msg);
    show([topbar('Sicherung', home), pad]);
  }

  w.PyApp = { home: home, lesson: lesson };
  home();
})(window);
