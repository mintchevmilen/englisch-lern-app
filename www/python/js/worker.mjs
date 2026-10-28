/* Python-Ausfuehrung im Hintergrund (Web Worker), damit die App bei
   Endlosschleifen nicht einfriert. Echtes CPython ueber Pyodide (MPL-2.0).

   input() wird per "Wiederholung" geloest: Ein Webworker kann nicht warten,
   bis jemand tippt. Deshalb laeuft das Programm bis zum ersten input() ohne
   Antwort, meldet die Frage, und wird mit allen bisherigen Antworten neu
   gestartet. Das ist fuer Lernprogramme ohne Nebenwirkungen unsichtbar. */
import { loadPyodide } from '../pyodide/pyodide.mjs';
var BASE = new URL('../pyodide/', import.meta.url).href;

var pyPromise = null;
function getPy() {
  if (!pyPromise) pyPromise = loadPyodide({ indexURL: BASE });
  return pyPromise;
}

var HEAD = [
  'import sys, builtins, random',
  'class _NeedInput(BaseException):',
  '    pass',
  'def _make_input(answers, out):',
  '    state = {"i": 0}',
  '    def _input(prompt=""):',
  '        prompt = str(prompt)',
  '        if state["i"] < len(answers):',
  '            a = answers[state["i"]]; state["i"] += 1',
  '            sys.stdout.write(prompt + a + "\\n"); sys.stdout.flush()',
  '            return a',
  '        sys.stdout.write(prompt); sys.stdout.flush()',
  '        raise _NeedInput(prompt)',
  '    return _input',
].join('\n');

self.onmessage = async function (ev) {
  var m = ev.data;
  if (m.type === 'warmup') {
    try { await getPy(); self.postMessage({ type: 'ready' }); }
    catch (e) { self.postMessage({ type: 'fatal', message: String(e) }); }
    return;
  }
  if (m.type !== 'run') return;
  var py;
  try { py = await getPy(); } catch (e) { self.postMessage({ type: 'fatal', message: String(e) }); return; }
  var out = [];
  var dec = new TextDecoder();
  function sink(buf) { out.push(dec.decode(buf, { stream: true })); return buf.length; }
  py.setStdout({ write: sink });
  py.setStderr({ write: sink });
  var status = 'done', err = null, need = null;
  try {
    py.globals.set('_answers', py.toPy(m.inputs || []));
    py.globals.set('_seed', m.seed || 1);
    py.runPython(HEAD + '\nrandom.seed(_seed)\nbuiltins.input = _make_input(_answers, None)\n');
    var g = py.globals.get('dict')();
    g.set('__name__', '__main__');
    try {
      await py.runPythonAsync(m.code, { globals: g });
    } finally {
      try { py.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()'); } catch (e2) { /* egal */ }
      g.destroy();
    }
  } catch (e) {
    var msg = String(e && e.message || e);
    if (msg.indexOf('_NeedInput') >= 0) { status = 'need-input'; }
    else { status = 'error'; err = msg; }
  }
  var text = out.join('');
  if (status === 'need-input') {
    /* Der Fragetext wurde schon ausgegeben, ohne Zeilenumbruch am Ende. */
    text = text.replace(/\n$/, '');
  }
  self.postMessage({ type: 'result', id: m.id, status: status, output: text, error: err ? cleanError(err) : null });
};

/* Python-Fehlermeldung kuerzen: nur die letzten Zeilen ab dem eigenen Code. */
function cleanError(msg) {
  var lines = msg.split('\n');
  var start = 0;
  for (var i = 0; i < lines.length; i++) {
    if (/File "<exec>"/.test(lines[i])) { start = i; break; }
  }
  return lines.slice(start).join('\n').replace(/File "<exec>"/g, 'Zeile');
}
