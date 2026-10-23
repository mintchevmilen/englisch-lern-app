import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WWW = path.join(__dirname, '..', 'www');
const ROOT = path.join(__dirname, '..');

/* Engine + SRS ohne Browser laden (kleine Attrappen fuer Store/Speech). */
const store = { words: {}, settings: { sound: true, rate: 0.85, mic: true } };
global.window = {
  Store: { data: () => store, save() {}, saveNow() {}, lesson: () => null },
  Speech: { ready: () => true, supported: () => true }
};
const load = (f) => (0, eval)(readFileSync(path.join(WWW, f), 'utf8'));
for (const f of ['data/units.js', 'data/vocabulary.js', 'data/grammar.js', 'data/content.js',
  'js/srs.js', 'js/engine.js']) load(f);
const { SRS, Engine: E, DATA: D } = global.window;

const word = (en) => SRS.all().find((x) => x.en === en);

/* ---------- Dateien in www/ und im Repo-Root muessen gleich sein ---------- */
test('www/ und Repo-Root sind identisch (GitHub Pages und APK zeigen dasselbe)', () => {
  const files = ['index.html', 'css/style.css', 'js/app.js', 'js/audio.js', 'js/engine.js',
    'js/games.js', 'js/player.js', 'js/srs.js', 'js/storage.js', 'js/ui.js',
    'data/units.js', 'data/vocabulary.js', 'data/grammar.js', 'data/content.js'];
  for (const f of files) {
    assert.ok(existsSync(path.join(ROOT, f)), `Root fehlt: ${f}`);
    assert.equal(readFileSync(path.join(ROOT, f), 'utf8'), readFileSync(path.join(WWW, f), 'utf8'),
      `${f} unterscheidet sich zwischen Root und www/`);
  }
});

/* ---------- Bedeutungs-Helfer ---------- */
test('deParts zerlegt Uebersetzungen sinnvoll', () => {
  assert.deepEqual(SRS.deParts('Stadt (kleiner)', 'town'), ['Stadt']);
  assert.deepEqual(SRS.deParts('schwer, schwierig; hart', 'hard'), ['schwer', 'schwierig', 'hart']);
  assert.deepEqual(SRS.deParts('Entschuldigung. / Entschuldigen Sie.', 'Excuse me.'),
    ['Entschuldigung', 'Entschuldigen Sie']);
  assert.deepEqual(SRS.deParts('(Koch-)Rezept', 'recipe'), ['Rezept']);
});

test('lange Phrasen werden nicht an jedem Komma getrennt', () => {
  const parts = SRS.deParts('mir geht es gut, danke', "I'm fine, thanks");
  assert.ok(parts.includes('mir geht es gut, danke'));
  assert.ok(!parts.includes('danke'), '"danke" allein ist keine Uebersetzung der Phrase');
  const nice = SRS.deParts('schön, dich kennenzulernen', 'nice to meet you');
  assert.ok(!nice.includes('schön'));
});

/* ---------- Falsche Antwortmoeglichkeiten ---------- */
test('Distraktoren haben nie dieselbe Bedeutung wie die richtige Antwort', () => {
  for (let round = 0; round < 15; round++) {
    for (const it of SRS.all()) {
      for (const field of ['de', 'en']) {
        for (const d of SRS.distractors(it, 3, field)) {
          assert.ok(!SRS.same(it, d), `${it.en} (${it.de}) bekam gleichbedeutend: ${d.en} (${d.de})`);
        }
      }
    }
  }
});

test('Verben bekommen bevorzugt Verben als falsche Antworten', () => {
  const it = word('to ask');
  assert.ok(it, 'Testwort fehlt');
  const d = SRS.distractors(it, 3, 'de');
  assert.equal(d.length, 3);
  assert.ok(d.every((x) => /^to\s/i.test(x.en)), 'alle Falschantworten sollten Verben sein');
});

test('Multiple-Choice hat immer genau eine richtige und eindeutige Optionen', () => {
  for (const it of SRS.all()) {
    for (const t of [E.vocabTasks([it], ['mc1'], 1)[0], E.vocabTasks([it], ['mc2'], 1)[0]]) {
      assert.equal(t.kind, 'mc');
      assert.equal(new Set(t.opts.map((o) => o.toLowerCase())).size, t.opts.length,
        `doppelte Optionen bei ${it.en}`);
      assert.ok(t.a >= 0 && t.a < t.opts.length);
    }
  }
});

/* ---------- Tippaufgaben ---------- */
test('danke: thank you UND thanks sind richtig', () => {
  const t = E.vocabTasks([word('thank you')], ['type'], 1)[0];
  assert.equal(E.check('thank you', t), 2);
  assert.equal(E.check('thanks', t), 2);
  assert.equal(E.check('thank', t), 0);
});

test('Verben duerfen mit und ohne "to" getippt werden', () => {
  const t = E.vocabTasks([word('to ask')], ['type'], 1)[0];
  assert.equal(E.check('to ask', t), 2);
  assert.equal(E.check('ask', t), 2);
});

test('Deutsche Uebersetzung: Klammerzusatz und einzelne Teile sind ok', () => {
  const town = E.vocabTasks([word('town')], ['trans'], 1)[0];
  assert.equal(E.check('Stadt', town), 2);
  const hard = E.vocabTasks([word('hard')], ['trans'], 1)[0];
  assert.equal(E.check('schwierig', hard), 2);
  assert.equal(E.check('hart', hard), 2);
});

test('Ein einzelnes "danke" ist keine Uebersetzung von "I\'m fine, thanks"', () => {
  const t = E.vocabTasks([word("I'm fine, thanks")], ['trans'], 1)[0];
  assert.ok(t, 'Aufgabe fehlt');
  assert.equal(E.check('danke', t), 0);
  assert.equal(E.check('mir geht es gut, danke', t), 2);
});

test('Platzhalter-Eintraege ("...") erzeugen keine Tippaufgaben', () => {
  const it = word('a piece of ...');
  assert.ok(it);
  for (const mode of ['type', 'trans', 'gap']) {
    const t = E.vocabTasks([it], [mode], 1)[0];
    assert.equal(t.kind, 'mc', `${mode} sollte auf Multiple-Choice ausweichen`);
  }
});

/* ---------- Lueckensaetze ---------- */
test('Lueckensatz findet auch gebeugte Formen (smile -> smiles)', () => {
  const t = E.vocabTasks([word('smile')], ['gap'], 1)[0];
  assert.equal(t.kind, 'input');
  assert.ok(t.question.includes('_____'));
  assert.equal(E.check('smiles', t), 2);
  assert.equal(E.check('smile', t), 2);
});

test('mehr Lueckensaetze moeglich als vorher (Beugung wird erkannt)', () => {
  let ok = 0;
  for (const it of SRS.all()) {
    const t = E.vocabTasks([it], ['gap'], 1)[0];
    if (t && t.kind === 'input') {
      ok++;
      assert.ok(t.question.includes('_____'), `kein Platzhalter bei ${it.en}`);
      assert.ok(!new RegExp('\\b' + t.a + '\\b', 'i').test(t.question), `Loesung steht noch im Satz: ${it.en}`);
    }
  }
  assert.ok(ok > 600, `nur ${ok} Lueckensaetze`);
});

/* ---------- Duplikate ueber Units ---------- */
test('gemischte Auswahl enthaelt kein englisches Wort doppelt', () => {
  for (let i = 0; i < 20; i++) {
    const picked = SRS.pick({ n: 200 });
    const keys = picked.map((x) => x.key);
    assert.equal(new Set(keys).size, keys.length, 'Duplikat in globaler Auswahl');
  }
});

test('unique behaelt den Eintrag mit Lernfortschritt', () => {
  const a = SRS.all().filter((x) => x.key === 'town');
  assert.ok(a.length >= 2, 'Testdaten: "town" sollte in mehreren Units stehen');
  store.words[a[1].id] = { c: 3, w: 0, box: 2, last: 1, due: 1 };
  const u = SRS.unique(a);
  assert.equal(u.length, 1);
  assert.equal(u[0].id, a[1].id);
  delete store.words[a[1].id];
});

/* ---------- Sprachbewertung ---------- */
test('Sprachbewertung: exakt, Alternativen, kleine Abweichungen', () => {
  assert.equal(E.speechScore(['cat'], 'cat').level, 2);
  assert.equal(E.speechScore(['cut', 'cat'], 'cat').level, 2, 'Alternativen zaehlen');
  assert.equal(E.speechScore(['Monday.'], 'Monday').level, 2);
  assert.equal(E.speechScore(['mondey'], 'Monday').level, 1);
  assert.equal(E.speechScore(['banana'], 'Monday').level, 0);
  assert.equal(E.speechScore([], 'Monday').level, 0);
});

test('Sprachbewertung: Zahlen, to, Kurzformen, Phrasen', () => {
  assert.equal(E.speechScore(['5'], 'five').level, 2);
  assert.equal(E.speechScore(['ask'], 'to ask').level, 2);
  assert.equal(E.speechScore(['to ask'], 'to ask').level, 2);
  assert.equal(E.speechScore(['I am from Germany'], "I'm from Germany").level, 2);
  assert.equal(E.speechScore(['nice to meet'], 'nice to meet you').level, 1, '3 von 4 Woertern reichen (Kinder-Toleranz)');
  assert.equal(E.speechScore(['nice to'], 'nice to meet you').level, 0, '2 von 4 reichen nicht');
  assert.equal(E.speechScore(['how old are you'], 'how old are you').level, 2);
  assert.equal(E.speechScore(['how old are'], 'how old are you').level, 1);
  assert.equal(E.speechScore(['hello hello hello hello'], 'hello').level, 0, 'Gebrabbel zaehlt nicht');
});

test('Sprachaufgaben enthalten keine Platzhalter-Woerter', () => {
  for (const u of D.units) {
    const tasks = E.speakingTasks(SRS.ofUnit(u.id));
    for (const t of tasks) {
      assert.ok(!/\.\.\.|\/|\bsb\b|\bsth\b/.test(t.say), `nicht sprechbar: ${t.question}`);
      assert.equal(t.kind, 'repeat');
    }
  }
});

/* ---------- Toleranz fuer Kinderaussprache ---------- */
test('Gleichklang zaehlt als richtig (bye/buy, to/two, hello/hallo)', () => {
  assert.equal(E.speechScore(['buy'], 'bye').level, 2);
  assert.equal(E.speechScore(['bei'], 'bye').level, 2, 'deutsch klingendes "bei" fuer bye');
  assert.equal(E.speechScore(['two'], 'to').level, 2);
  assert.equal(E.speechScore(['hallo'], 'hello').level, 2);
  assert.equal(E.speechScore(['tree'], 'three').level, 2, 'th wird oft als t/s gesprochen');
  assert.equal(E.speechScore(['ve'], 'we').level, 2, 'w wird oft als v gesprochen');
});

test('Wiederholtes Wort ("bye bye") ist ok, Gebrabbel nicht', () => {
  assert.equal(E.speechScore(['bye bye'], 'bye').level, 1);
  assert.equal(E.speechScore(['hello hello hello hello'], 'hello').level, 0);
});

test('Aehnlicher Klang bei laengeren Woertern wird akzeptiert, kurze Woerter nicht verwechselt', () => {
  assert.equal(E.speechScore(['sank you'], 'thank you').level, 2);
  assert.equal(E.speechScore(['mondeh'], 'Monday').level, 1);
  assert.equal(E.speechScore(['cut'], 'cat').level, 0, 'cat/cut/bat sind verschiedene Woerter');
  assert.equal(E.speechScore(['bat'], 'cat').level, 0);
});

test('Ergebnis nennt Alternativen fuer die Anzeige', () => {
  const r = E.speechScore(['banana', 'bandana', 'bonanza'], 'Monday');
  assert.equal(r.level, 0);
  assert.equal(r.heard, 'banana');
  assert.deepEqual(r.alts, ['bandana', 'bonanza']);
});

test('Zahlen aus dem Erkenner werden zu Woertern (fuer englische Tippaufgaben)', () => {
  assert.equal(E.digitsToWords('I have 2 cats'), 'I have two cats');
  assert.equal(E.digitsToWords('5'), 'five');
  assert.equal(E.digitsToWords('2026'), '2026');
});

test('Gesprochene deutsche Antwort wird wie getippte geprueft', () => {
  const town = E.vocabTasks([word('town')], ['trans'], 1)[0];
  assert.equal(E.check('Stadt', town), 2);
  assert.equal(E.check('stadt', town), 2, 'Gross-/Kleinschreibung egal');
});
