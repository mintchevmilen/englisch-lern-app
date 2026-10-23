# Projektstand & Entscheidungen – English Adventure

## Architektur
- Reine Vanilla-JS-PWA (kein Framework, kein Bundler nötig) unter `www/` bzw. im Repo-Root (für GitHub Pages).
- Daten (Vokabeln, Grammatik, Lesetexte) strikt getrennt von der Engine: `data/*.js` vs. `js/*.js`.
- Zwei Auslieferungswege aus demselben Code:
  1. GitHub Pages (PWA, "Zum Startbildschirm hinzufügen") – Root-Dateien + `sw.js`.
  2. Native Android-APK via Capacitor – `www/` als `webDir`, gebaut über GitHub Actions.

## Entscheidungen
- D-001: Kein Framework, keine Server-Komponente, keine Cloud – alles lokal im Browser/auf dem Gerät (IndexedDB/localStorage).
- D-002: Vokabel-/Grammatikinhalte orientieren sich nur in Struktur und Einzelwort-Übersetzung am Schulbuch (Access 1, Cornelsen) – alle Beispielsätze und Lesetexte sind eigenständig formuliert (Urheberrecht).
- D-003 (wie Fitness-App D-009): fester, einmal erzeugter Debug-Keystore (`android/keystore/englishadventure-debug.keystore`) wird mit ins (private) Repo eingecheckt, damit jede über GitHub Actions gebaute APK als Update über die vorherige installierbar ist. Niemals ändern, sonst verlieren Nutzer beim Update ihre lokalen Lerndaten.
- D-004: `versionCode` wird aus `GITHUB_RUN_NUMBER` abgeleitet (siehe `android/app/build.gradle`), damit jeder Build eine höhere Versionsnummer als der vorherige hat.
- D-005: `npm run build` ist bewusst kein Bundler-Schritt, sondern ein Konsistenz-Check der Daten (keine fehlenden en/de-Felder, keine kaputten Grammatik-Unit-Referenzen) – bricht den CI-Lauf ab, bevor eine kaputte APK gebaut wird.

## Offen
- E2E-Test (Playwright) bewusst noch nicht eingerichtet (laut Vorlage optional) – kann bei Bedarf ergänzt werden.
- Spracherkennung (Web Speech API `SpeechRecognition` bzw. ein eigenes Android-Plugin wie bei der Fitness-App) noch nicht implementiert.
- Debug-Build wird vom Workflow bereits erzeugt (`assembleDebug`); ein echter Release-Build mit eigenem Signing-Key ist für reine private Nutzung nicht nötig.
