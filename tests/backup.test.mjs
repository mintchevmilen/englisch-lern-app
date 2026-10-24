import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WWW = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'www');
const mem = {};
global.window = global;
global.localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
global.APP_VERSION = 'test';
global.addEventListener = () => {};
global.document = { addEventListener() {} };
global.setTimeout = (f) => { f(); return 1; };   // Store.save sofort
(0, eval)(readFileSync(path.join(WWW, 'js/storage.js'), 'utf8'));
const S = global.Store;

test('Vollbackup: Export und Import ergeben denselben Stand, Mathe inklusive', () => {
  mem['mathe-mission-5'] = JSON.stringify({ xp: 77, themen: { t101: { ok: 3 } } });
  const d = S.data(); d.xp = 321; d.words['u1:school'] = { c: 3, w: 1, box: 3 }; d.lessons['u1:vocab-1'] = { done: true };
  const text = S.backupText();
  S.reset(); delete mem['mathe-mission-5'];
  assert.equal(S.data().xp, 0);
  const b = S.parseBackup(text);
  assert.equal(b.kind, 'full');
  assert.match(S.describeBackup(b), /321 XP, 1 Wörter, 1 Lektionen, plus Mathe/);
  S.applyBackup(b);
  assert.equal(S.data().xp, 321);
  assert.deepEqual(S.data().words['u1:school'], { c: 3, w: 1, box: 3 });
  assert.equal(JSON.parse(mem['mathe-mission-5']).xp, 77);
});

test('altes Kurz-Backup bringt XP, Serie und Zeit zurück, aber keine Wörter', () => {
  S.reset();
  const old = '{"xp":1840,"streak":{"count":6,"best":9,"lastDay":"2026-10-20"},"words":412,"lessons":38,"time":9000}';
  const b = S.parseBackup(old);
  assert.equal(b.kind, 'legacy');
  S.applyBackup(b);
  const d = S.data();
  assert.equal(d.xp, 1840); assert.equal(d.streak.best, 9); assert.equal(d.timeSec, 9000);
  assert.equal(Object.keys(d.words).length, 0);
});

test('Kurz-Backup senkt vorhandenen Fortschritt nie', () => {
  S.reset(); S.data().xp = 5000;
  S.applyBackup(S.parseBackup('{"xp":100,"streak":2,"words":1,"lessons":1,"time":5}'));
  assert.equal(S.data().xp, 5000);
});

test('Text mit Anführungszeichen, Codeblock oder BOM wird erkannt; Müll nicht', () => {
  const old = '{"xp":10,"streak":{"count":1,"best":1,"lastDay":""},"words":1,"lessons":1,"time":1}';
  assert.equal(S.parseBackup('﻿' + old).kind, 'legacy');
  assert.equal(S.parseBackup('```json\n' + old + '\n```').kind, 'legacy');
  assert.equal(S.parseBackup(JSON.stringify(old)).kind, 'legacy');
  assert.equal(S.parseBackup('hallo'), null);
  assert.equal(S.parseBackup('{"foo":1}'), null);
  assert.equal(S.parseBackup(''), null);
});

test('automatische Sicherung: höchstens eine pro Tag, höchstens 5, Rückholen klappt', () => {
  delete mem['englishAdventure.snapshots'];
  S.reset(); S.data().xp = 50;
  S.autoSnapshot(); S.autoSnapshot();
  assert.equal(S.snapshots().length, 1);
  for (let i = 0; i < 8; i++) S.snapshot('x' + i);
  assert.equal(S.snapshots().length, 5);
  S.data().xp = 1; S.snapshot('jetzt');
  S.data().xp = 999;
  assert.ok(S.restoreSnapshot(0));
  assert.equal(S.data().xp, 1);
});
