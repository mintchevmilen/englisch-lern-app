// Prüft die zusätzlichen Kurse Bulgarisch und Python (eingebettet in die Sammel-App).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function walk(dir, base = dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, base, out); else out.push(path.relative(base, p));
  }
  return out;
}

test('Bulgarisch und Python: Root und www sind identisch (ohne Pyodide)', () => {
  for (const d of ['bulgarisch', 'python']) {
    const files = walk(path.join(ROOT, d)).filter((f) => !f.startsWith('pyodide'));
    assert.ok(files.length > 5, d + ' leer?');
    for (const f of files) {
      const a = path.join(ROOT, d, f), b = path.join(ROOT, 'www', d, f);
      assert.ok(fs.existsSync(b), 'fehlt in www: ' + d + '/' + f);
      assert.equal(fs.readFileSync(a, 'utf8'), fs.readFileSync(b, 'utf8'), d + '/' + f + ' unterscheidet sich');
    }
  }
});

test('Pyodide Dateien liegen in www/python/pyodide', () => {
  for (const f of ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
    assert.ok(fs.existsSync(path.join(ROOT, 'www/python/pyodide', f)), 'fehlt: ' + f);
  }
});

test('Kursleiste kennt alle vier Kurse samt Rahmen', () => {
  const html = read('index.html'), js = read('js/app.js');
  for (const id of ['englisch', 'mathe', 'bulgarisch', 'python']) assert.ok(html.includes('data-course="' + id + '"'), 'Menüeintrag fehlt: ' + id);
  for (const fr of ['mathFrame', 'bulgarischFrame', 'pythonFrame']) {
    assert.ok(html.includes('id="' + fr + '"'), 'iframe fehlt: ' + fr);
    assert.ok(js.includes("'" + fr + "'"), 'app.js kennt Rahmen nicht: ' + fr);
  }
});

/* ---------- Bulgarisch: Daten ---------- */
const bg = { window: {} };
bg.window = bg; vm.createContext(bg);
for (const f of ['alphabet', 'words', 'sentences', 'dialogues', 'lessons']) vm.runInContext(read('bulgarisch/data/' + f + '.js'), bg);

test('Bulgarisch: IDs eindeutig und Lektionen verweisen auf Vorhandenes', () => {
  const uniq = (arr, what) => assert.equal(new Set(arr).size, arr.length, 'doppelte ' + what);
  uniq(bg.BG_ALPHABET.map((x) => x.id), 'Buchstaben-IDs');
  uniq(bg.BG_WORDS.map((x) => x.id), 'Wort-IDs');
  uniq(bg.BG_SENTENCES.map((x) => x.id), 'Satz-IDs');
  uniq(bg.BG_LESSONS.map((x) => x.id), 'Lektions-IDs');
  assert.equal(bg.BG_ALPHABET.length, 30, 'das bulgarische Alphabet hat 30 Buchstaben');
  const W = new Set(bg.BG_WORDS.map((x) => x.id)), A = new Set(bg.BG_ALPHABET.map((x) => x.id)), S = new Set(bg.BG_SENTENCES.map((x) => x.id));
  for (const l of bg.BG_LESSONS) {
    for (const id of l.wordIds || []) assert.ok(W.has(id), l.id + ': Wort fehlt ' + id);
    for (const id of l.letterIds || []) assert.ok(A.has(id), l.id + ': Buchstabe fehlt ' + id);
    for (const id of l.sentenceIds || []) assert.ok(S.has(id), l.id + ': Satz fehlt ' + id);
  }
  for (const w of bg.BG_WORDS) assert.ok(bg.BG_CATEGORIES[w.category], 'Kategorie fehlt: ' + w.category);
});

/* ---------- Python: Lektionen ---------- */
const py = { window: {} };
py.window = py; vm.createContext(py);
vm.runInContext(read('python/js/lessons.js'), py);
const check = (await import('../python/js/check.js')).default || globalThis.PyCheck;

test('Python: Lektionen sind vollständig aufgebaut', () => {
  const ids = [];
  for (const l of py.PY_LESSONS) {
    assert.ok(l.title && l.ziel && l.text.length && l.tasks.length, 'Lektion unvollständig: ' + l.id);
    for (const t of l.tasks) {
      ids.push(t.id);
      assert.ok(t.aufgabe && t.hint && t.solution !== undefined && t.tests.length, 'Aufgabe unvollständig: ' + t.id);
      for (const m of t.must || []) new RegExp(m);
      for (const x of t.tests) assert.ok(['exact', 'lastIs', 'lastHas', 'has'].some((k) => x[k] !== undefined), 'Test ohne Erwartung: ' + t.id);
    }
  }
  assert.equal(new Set(ids).size, ids.length, 'doppelte Aufgaben-IDs');
});

test('Python: Prüfung meldet Fehler verständlich (Fake Runner)', async () => {
  const runner = { runWith: async () => ({ status: 'done', output: '55\n' }) };
  const task = { tests: [{ lastIs: '55' }], must: ['for'] };
  assert.equal((await check.check(task, 'print(55)', runner)).ok, false);
  assert.equal((await check.check(task, 'for i in x: print(55)', runner)).ok, true);
  const bad = await check.check({ tests: [{ exact: '1\n2' }] }, 'x', runner);
  assert.equal(bad.ok, false);
  assert.match(bad.message, /Erwartet/);
  const err = await check.check({ tests: [{ exact: '1' }] }, 'x', { runWith: async () => ({ status: 'error', error: 'NameError', output: '' }) });
  assert.match(err.message, /Fehler/);
});
