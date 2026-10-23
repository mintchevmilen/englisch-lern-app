// Prüft alle Aufgaben-Generatoren mit je 1000 Zufallsläufen: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../mathe/js/', import.meta.url).pathname;
const ctx = { console, Math, String, Object, Array, parseInt, parseFloat, isNaN, JSON, Number };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root + 'data.js', 'utf8') + '\n' + fs.readFileSync(root + 'gen.js', 'utf8') +
  '\n;this.GEN=GEN;this.erz=erzeugeAufgabe;this.KAP=KAPITEL;', ctx);
const strip = s => String(s).replace(/<[^>]+>/g, '');

test('jedes Thema hat einen Generator', () => {
  const ids = ctx.KAP.flatMap(k => k.themen.map(t => t.id));
  for (const id of ids) assert.ok(ctx.GEN[id], 'Generator fehlt: ' + id);
});

for (const id of Object.keys(ctx.GEN)) {
  test('Generator ' + id + ' liefert sinnvolle Aufgaben', () => {
    for (const l of [1, 2, 3]) for (let i = 0; i < 1000; i++) {
      const a = ctx.erz(id, l), f = strip(a.frage);
      assert.ok(!/undefined|NaN|Infinity|null/.test(JSON.stringify(a)), id + ' L' + l + ': ' + f);
      if (a.typ === 'mc') {
        assert.equal(new Set(a.optionen).size, a.optionen.length, 'doppelte Optionen: ' + f);
        assert.ok(a.optionen.length >= 3, 'zu wenige Optionen: ' + f);
        assert.ok(a.optionen[a.richtig] !== undefined, 'richtige Option fehlt: ' + f);
      }
      if (a.typ === 'num' || a.typ === 'gap') {
        assert.ok(!/^-/.test(a.loesung), 'negative Lösung: ' + f + ' => ' + a.loesung);
      }
      if (a.typ === 'steps') for (const s of a.schritte) {
        assert.ok(!/^-/.test(s.loesung) && s.loesung !== '0', 'Schritt ohne Sinn: ' + f + ' | ' + s.frage);
      }
      if (a.typ === 'order') assert.equal(new Set(a.items).size, a.items.length, 'doppelte Reihenfolge: ' + f);
    }
  });
}
