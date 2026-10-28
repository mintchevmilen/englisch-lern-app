#!/usr/bin/env node
/* =============================================================
   build.mjs – Build-/Validierungsschritt fuer English Adventure
   -------------------------------------------------------------
   Die App ist eine reine Vanilla-JS-App ohne Bundler-Bedarf:
   www/ ist bereits die fertige, auslieferbare Web-App (wird auch
   1:1 fuer GitHub Pages verwendet). Dieses Skript baut nichts
   zusammen, sondern prueft vor jedem Android-Build, dass alle
   Pflichtdateien vorhanden sind und die Vokabel-/Grammatikdaten
   in sich konsistent sind (keine fehlenden Felder, keine
   unit-Referenzen ins Leere). Schlaegt die Pruefung fehl, bricht
   der GitHub-Actions-Lauf ab, statt eine kaputte APK zu bauen.
   ============================================================= */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WWW = path.join(__dirname, 'www');

const REQUIRED_FILES = [
  'index.html', 'manifest.webmanifest',
  'css/style.css',
  'data/units.js', 'data/vocabulary.js', 'data/grammar.js', 'data/content.js',
  'js/storage.js', 'js/srs.js', 'js/audio.js', 'js/engine.js',
  'js/player.js', 'js/games.js', 'js/ui.js', 'js/app.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon.svg',
  'mathe/index.html', 'mathe/css/app.css', 'mathe/js/data.js', 'mathe/js/gen.js', 'mathe/js/state.js', 'mathe/js/ui.js', 'mathe/js/exam.js', 'mathe/js/games.js', 'mathe/js/app.js',
  'bulgarisch/index.html', 'bulgarisch/css/style.css', 'bulgarisch/js/app.js', 'bulgarisch/js/audio.js', 'bulgarisch/js/screens.js', 'bulgarisch/data/lessons.js', 'bulgarisch/data/words.js', 'bulgarisch/data/alphabet.js',
  'python/index.html', 'python/css/py.css', 'python/js/ui.js', 'python/js/lessons.js', 'python/js/runner.js', 'python/js/worker.mjs', 'python/js/check.js', 'python/js/store.js',
  'python/pyodide/pyodide.mjs', 'python/pyodide/pyodide.asm.mjs', 'python/pyodide/pyodide.asm.wasm', 'python/pyodide/python_stdlib.zip', 'python/pyodide/pyodide-lock.json'
];

let failed = false;
function fail(msg) { failed = true; console.error('✗ ' + msg); }
function ok(msg) { console.log('✓ ' + msg); }

for (const f of REQUIRED_FILES) {
  const p = path.join(WWW, f);
  if (!existsSync(p)) fail('Fehlt: www/' + f);
}
if (!failed) ok('Alle ' + REQUIRED_FILES.length + ' Pflichtdateien vorhanden.');

// Datenkonsistenz pruefen (gleiche Logik wie der manuelle Konsistenz-Check)
global.window = {};
try {
  for (const f of ['data/units.js', 'data/vocabulary.js', 'data/grammar.js', 'data/content.js']) {
    const code = readFileSync(path.join(WWW, f), 'utf8');
    // eslint-disable-next-line no-eval
    (0, eval)(code);
  }
  const D = global.window.DATA;
  if (!D || !D.units || !D.vocab || !D.grammar) {
    fail('data/*.js hat nicht das erwartete Format (DATA.units/vocab/grammar fehlen).');
  } else {
    let totalWords = 0;
    for (const unitId of Object.keys(D.vocab)) {
      const list = D.vocab[unitId];
      const seen = new Set();
      list.forEach((w, i) => {
        totalWords++;
        if (!w.en || !w.de) fail(`vocab.${unitId}[${i}] fehlt en/de: ${JSON.stringify(w)}`);
        const key = w.en.toLowerCase();
        if (seen.has(key)) fail(`vocab.${unitId}[${i}] Duplikat in derselben Unit: ${w.en}`);
        seen.add(key);
      });
    }
    ok(totalWords + ' Vokabeln in ' + Object.keys(D.vocab).length + ' Units geprueft.');

    const unitIds = D.units.map(u => u.id);
    for (const gid of Object.keys(D.grammar || {})) {
      const g = D.grammar[gid];
      if (g.unit && !unitIds.includes(g.unit)) fail(`grammar.${gid} verweist auf unbekannte unit "${g.unit}"`);
    }
    for (const u of D.units) {
      for (const gid of (u.grammar || [])) {
        if (!D.grammar || !D.grammar[gid]) fail(`Unit ${u.id} referenziert fehlendes Grammatikthema "${gid}"`);
      }
    }
    if (!failed) ok('Grammatik-Unit-Referenzen konsistent.');
  }
} catch (e) {
  fail('Fehler beim Laden der data/*.js: ' + e.message);
}

if (failed) {
  console.error('\nBuild abgebrochen: siehe Fehler oben.');
  process.exit(1);
}
console.log('\nBuild-Check erfolgreich. www/ ist bereit fuer Capacitor (cap sync).');
