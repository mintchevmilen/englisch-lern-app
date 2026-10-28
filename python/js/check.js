/* Aufgaben pruefen. Bekommt den Code des Kindes, fuehrt ihn mit den Testeingaben
   aus und vergleicht die Ausgabe. Gibt eine verstaendliche Rueckmeldung. */
(function (w) {
  function norm(s) {
    return String(s || '').replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n').replace(/\s+$/, '').replace(/^\n+/, '');
  }
  function lastLine(s) {
    var lines = norm(s).split('\n').filter(function (l) { return l.trim() !== ''; });
    return lines.length ? lines[lines.length - 1].trim() : '';
  }
  function fold(s) { return String(s).toLowerCase(); }

  function describeInputs(inp) { return inp && inp.length ? ' (Eingaben: ' + inp.slice(0, 4).join(', ') + (inp.length > 4 ? ', ...' : '') + ')' : ''; }

  /* Ergebnis: { ok, message, output } */
  async function check(task, code, runner) {
    var i, t, res;
    if (!String(code).trim()) return { ok: false, message: 'Hier steht noch kein Code. Schreib los!', output: '' };
    var must = task.must || [];
    for (i = 0; i < must.length; i++) {
      var re;
      try { re = new RegExp(must[i]); } catch (e) { continue; }
      if (!re.test(code)) {
        return { ok: false, message: 'Das Ergebnis könnte stimmen, aber dir fehlt noch ein Baustein, den die Aufgabe verlangt. Lies die Aufgabe noch einmal und schau in den Tipp.', output: '' };
      }
    }
    var tests = task.tests || [];
    for (i = 0; i < tests.length; i++) {
      t = tests[i];
      var src = t.append ? code + '\n' + t.append + '\n' : code;
      res = await runner.runWith(src, t.inputs || [], 7);
      if (res.status === 'timeout') return { ok: false, message: res.error, output: '' };
      if (res.status === 'fatal') return { ok: false, message: res.error || 'Python konnte nicht starten.', output: '' };
      if (res.status === 'error') return { ok: false, message: 'Dein Programm bricht mit einem Fehler ab:\n' + res.error, output: res.output };
      if (res.status === 'need-input') return { ok: false, message: 'Dein Programm fragt öfter nach einer Eingabe, als die Aufgabe verlangt.' + describeInputs(t.inputs), output: res.output };
      var out = norm(res.output), inp = describeInputs(t.inputs);
      if (t.exact !== undefined && out !== norm(t.exact)) {
        return { ok: false, message: 'Noch nicht ganz.' + inp + '\nErwartet:\n' + norm(t.exact) + '\nDein Programm gibt aus:\n' + (out || '(nichts)'), output: out };
      }
      if (t.lastIs !== undefined && fold(lastLine(out)) !== fold(t.lastIs)) {
        return { ok: false, message: 'Noch nicht ganz.' + inp + '\nDie letzte Zeile soll sein: ' + t.lastIs + '\nBei dir ist sie: ' + (lastLine(out) || '(leer)'), output: out };
      }
      if (t.lastHas !== undefined && fold(lastLine(out)).indexOf(fold(t.lastHas)) < 0) {
        return { ok: false, message: 'Noch nicht ganz.' + inp + '\nDie letzte Zeile soll "' + t.lastHas + '" enthalten.', output: out };
      }
      var has = t.has || [];
      for (var k = 0; k < has.length; k++) {
        if (out.indexOf(has[k]) < 0) {
          return { ok: false, message: 'Noch nicht ganz. In der Ausgabe fehlt: ' + has[k], output: out };
        }
      }
    }
    return { ok: true, message: 'Richtig!', output: '' };
  }

  w.PyCheck = { check: check, norm: norm, lastLine: lastLine };
  if (typeof module !== 'undefined') module.exports = w.PyCheck;
})(typeof window !== 'undefined' ? window : globalThis);
