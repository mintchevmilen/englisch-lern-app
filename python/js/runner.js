/* PyRunner: startet den Worker, fuehrt Code aus (mit Zeitlimit) und kuemmert
   sich um input() per Wiederholung. Alles andere in der App spricht nur
   mit diesem Objekt. */
(function (w) {
  var worker = null, ready = false, readyWaiters = [], pending = null, nextId = 1;
  var LIMIT_MS = 8000;

  function start() {
    ready = false;
    worker = new Worker('js/worker.mjs', { type: 'module' });
    worker.onmessage = function (ev) {
      var m = ev.data;
      if (m.type === 'ready') { ready = true; readyWaiters.splice(0).forEach(function (f) { f(true); }); }
      else if (m.type === 'fatal') { readyWaiters.splice(0).forEach(function (f) { f(false, m.message); }); if (pending) { var p = pending; pending = null; clearTimeout(p.timer); p.resolve({ status: 'fatal', output: '', error: m.message }); } }
      else if (m.type === 'result' && pending && pending.id === m.id) {
        var p2 = pending; pending = null; clearTimeout(p2.timer);
        p2.resolve({ status: m.status, output: m.output, error: m.error });
      }
    };
    worker.onerror = function (e) {
      if (pending) { var p = pending; pending = null; clearTimeout(p.timer); p.resolve({ status: 'fatal', output: '', error: String(e.message || e) }); }
    };
    worker.postMessage({ type: 'warmup' });
  }

  function whenReady() {
    if (ready) return Promise.resolve(true);
    if (!worker) start();
    return new Promise(function (res) { readyWaiters.push(res); });
  }

  /* Einmal ausfuehren. Ergebnis: {status: done|error|need-input|timeout|fatal, output, error} */
  function runOnce(code, inputs, seed) {
    return whenReady().then(function (ok) {
      if (!ok) return { status: 'fatal', output: '', error: 'Python konnte nicht geladen werden.' };
      return new Promise(function (resolve) {
        var id = nextId++;
        var timer = setTimeout(function () {
          pending = null;
          try { worker.terminate(); } catch (e) {}
          worker = null; ready = false;
          start();
          resolve({ status: 'timeout', output: '', error: 'Das Programm lief zu lange und wurde gestoppt. Hast du eine Endlosschleife gebaut?' });
        }, LIMIT_MS);
        pending = { id: id, resolve: resolve, timer: timer };
        worker.postMessage({ type: 'run', id: id, code: code, inputs: inputs || [], seed: seed || 1 });
      });
    });
  }

  /* Ganzer Lauf mit festen Antworten (fuer Pruefungen): fehlen Antworten, gilt das als Fehler. */
  function runWith(code, inputs, seed) { return runOnce(code, inputs, seed || 7); }

  w.PyRunner = { warmup: whenReady, runOnce: runOnce, runWith: runWith, stop: function () {
    if (worker) { try { worker.terminate(); } catch (e) {} worker = null; ready = false; if (pending) { clearTimeout(pending.timer); pending.resolve({ status: 'timeout', output: '', error: 'Gestoppt.' }); pending = null; } start(); }
  } };
})(window);
