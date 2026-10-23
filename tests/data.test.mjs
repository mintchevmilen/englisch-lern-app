import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WWW = path.join(__dirname, '..', 'www');

global.window = {};
for (const f of ['data/units.js', 'data/vocabulary.js', 'data/grammar.js', 'data/content.js']) {
  const code = readFileSync(path.join(WWW, f), 'utf8');
  // eslint-disable-next-line no-eval
  (0, eval)(code);
}
const D = global.window.DATA;

test('DATA.units, DATA.vocab und DATA.grammar sind vorhanden', () => {
  assert.ok(D.units && D.units.length > 0, 'DATA.units fehlt oder ist leer');
  assert.ok(D.vocab && Object.keys(D.vocab).length > 0, 'DATA.vocab fehlt oder ist leer');
  assert.ok(D.grammar && Object.keys(D.grammar).length > 0, 'DATA.grammar fehlt oder ist leer');
});

test('jede Vokabel hat en und de', () => {
  for (const unitId of Object.keys(D.vocab)) {
    for (const w of D.vocab[unitId]) {
      assert.ok(w.en, `vocab.${unitId}: Eintrag ohne en: ${JSON.stringify(w)}`);
      assert.ok(w.de, `vocab.${unitId}: Eintrag ohne de: ${JSON.stringify(w)}`);
    }
  }
});

test('jedes Grammatikthema einer Unit existiert auch in DATA.grammar', () => {
  for (const u of D.units) {
    for (const gid of (u.grammar || [])) {
      assert.ok(D.grammar[gid], `Unit ${u.id} referenziert fehlendes Grammatikthema "${gid}"`);
    }
  }
});

test('keine Vokabel-Duplikate innerhalb derselben Unit', () => {
  for (const unitId of Object.keys(D.vocab)) {
    const seen = new Set();
    for (const w of D.vocab[unitId]) {
      const key = w.en.toLowerCase();
      assert.ok(!seen.has(key), `vocab.${unitId}: Duplikat "${w.en}"`);
      seen.add(key);
    }
  }
});
