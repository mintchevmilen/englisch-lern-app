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
- D-003 (wie Fitness-App D-009): fester, einmal erzeugter Debug-Keystore (`android/keystore/englishadventure-debug.keystore`) wird mit ins Repo eingecheckt, damit jede über GitHub Actions gebaute APK als Update über die vorherige installierbar ist. Niemals ändern, sonst verlieren Nutzer beim Update ihre lokalen Lerndaten. Hinweis: Das Repo ist **public** (nötig für kostenlose GitHub Pages), die Keystore-Passwörter sind Android-Standardwerte (`android`/`android`) – unkritisch, weil es nur ein Debug-Signing-Key ist (kein Play-Store-Release-Key), aber bewusst transparent dokumentiert statt stillschweigend angenommen.
- D-004: `versionCode` wird aus `GITHUB_RUN_NUMBER` abgeleitet (siehe `android/app/build.gradle`), damit jeder Build eine höhere Versionsnummer als der vorherige hat.
- D-005: `npm run build` ist bewusst kein Bundler-Schritt, sondern ein Konsistenz-Check der Daten (keine fehlenden en/de-Felder, keine kaputten Grammatik-Unit-Referenzen) – bricht den CI-Lauf ab, bevor eine kaputte APK gebaut wird.
- D-006: Aussprache in der nativen APK läuft über das Plugin `@capacitor-community/text-to-speech` statt über `window.speechSynthesis` (das die Android-WebView nicht unterstützt). `js/audio.js` erkennt automatisch, ob die App nativ (Capacitor) oder im Browser (PWA) läuft, und wählt das passende Backend – ein Code, zwei Auslieferungswege.

## Offen
- E2E-Test (Playwright) bewusst noch nicht eingerichtet (laut Vorlage optional) – kann bei Bedarf ergänzt werden.
- Spracherkennung (Web Speech API `SpeechRecognition` bzw. ein eigenes Android-Plugin wie bei der Fitness-App) noch nicht implementiert – das ist etwas anderes als die (jetzt behobene) Aussprache/Vorlesen-Funktion: Spracherkennung würde den Nutzer abhören und bewerten, nicht nur Wörter vorlesen.
- Debug-Build wird vom Workflow bereits erzeugt (`assembleDebug`); ein echter Release-Build mit eigenem Signing-Key ist für reine private Nutzung nicht nötig.
- Automatisches Pushen durch Claude (ohne dass der Nutzer `git push` selbst ausführen muss) ist aus dieser Cowork-Sitzung heraus nicht möglich: GitHub-Schreibzugriff ist session-seitig gesperrt (kein `add_repo`-Mechanismus verfügbar), und das verbundene Gerät hat keine Shell-Anbindung. Push bleibt vorerst ein manueller Schritt beim Nutzer.
