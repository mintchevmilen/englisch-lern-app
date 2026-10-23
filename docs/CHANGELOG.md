# Changelog – English Adventure

## 2.2.0 – 2026-10-23
- Neu: Spracherkennung beim Nachsprechen (Speaking-Lektion). Die App hört zu, vergleicht mit dem Zielwort und gibt Rückmeldung („Perfekt!“, „Gut!“ oder was verstanden wurde, mit Nochmal-Versuch). APK: natives Plugin `@capacitor-community/speech-recognition` (fragt beim ersten Mal nach der Mikrofon-Erlaubnis); Browser/PWA: Web Speech API. Die Bewertung ist bewusst großzügig (Alternativen des Erkenners, kleine Abweichungen, Zahlen, „to“ bei Verben).
- Nachsprechen bleibt ohne Risiko: „Ohne Mikrofon weiter“ zählt wie früher als gesagt; Erkennungsfehler werden nie als falsch gewertet. Bei verweigertem Mikrofon oder fehlender Erkennung fällt die App automatisch auf die bisherige Selbstkontrolle zurück. In den Einstellungen (Eltern) gibt es einen Schalter „Mikrofon beim Nachsprechen“.
- Vokabelfragen aufgeräumt:
  - Falsche Antwortmöglichkeiten haben nie dieselbe Bedeutung wie die richtige (vorher z. B. „thanks“ als Falschantwort bei „danke“ = „thank you“) und kommen bevorzugt aus gleicher Wortart (Verben zu Verben, Phrasen zu Phrasen).
  - Tippaufgaben akzeptieren alle richtigen Wörter (danke: thank you und thanks; auch: too und also) und Verben mit oder ohne „to“.
  - Deutsch tippen: Klammerzusätze werden ignoriert („Stadt (kleiner)“ → „Stadt“), alle gleichwertigen Übersetzungen zählen. Ein einzelnes „danke“ gilt nicht mehr als Übersetzung der Phrase „I'm fine, thanks“.
  - Lückensätze erkennen gebeugte Formen (smile → smiles); 666 statt 555 von 741 Wörtern haben jetzt einen Lückensatz. Steht das Wort mehrfach im Satz oder ist es ein Platzhalter-Eintrag („a piece of ...“), gibt es stattdessen Multiple-Choice.
  - Dasselbe englische Wort aus mehreren Units (z. B. „town“) kommt in gemischten Tests, Spielen und Wiederholungen nur noch einmal vor, mit dem Eintrag, der den meisten Lernfortschritt hat.
  - Nachsprechen nutzt nur Einträge, die man so sagen kann (keine „sb“, „sth“ oder „...“).
- Neue Tests (`tests/engine.test.mjs`, 20 Fälle), u. a. dass `www/` und Repo-Root identisch bleiben.

## 2.1.1 – 2026-10-23
- Fix: In der nativen Android-APK wurde nie etwas vorgelesen (kein 🔊-Icon, kein Auto-Vorlesen). Ursache: Android-System-WebView unterstützt `window.speechSynthesis` nicht – eine seit Jahren bekannte Chromium-Einschränkung, die nur die Chrome-PWA-Version betraf, nicht die APK. Behoben durch das native Plugin `@capacitor-community/text-to-speech` (nutzt die Geräte-TTS-Engine, offline, kostenlos/MIT); `js/audio.js` wählt jetzt automatisch nativ (APK) oder Web Speech API (PWA/Chrome).

## 2.1.0 – 2026-10-23
- Wortschatz für Unit 2 (komplett inkl. Part B/C und Story), Unit 3 und Unit 4 auf den echten Buch-Wortschatz (Access 1, Cornelsen) umgestellt – vorher teils eigenständig formulierter Platzhalter-Wortschatz.
- Thema von Unit 4 korrigiert: Wetter/Nachbarschaft/Wegbeschreibung/Bildbeschreibung statt der früheren Strand-Annahme.
- Grammatikthema "Object pronouns" von Unit 3 nach Unit 2 verschoben (passend zur echten GAP12-Zuordnung im Buch).
- Android-Build-Pipeline eingerichtet (Capacitor 7 + GitHub Actions), nach dem Vorbild der Fitness-App: automatischer APK-Build und GitHub-Release bei jedem Push.

## 2.0.0 – 2026-09
- Komplette Neufassung der Daten (units.js/grammar.js/vocabulary.js/content.js) nach dem echten Grammar-and-Practice-Anhang (GAP1–21) und Vokabelanhang des Buchs.

## 1.0.0
- Erste spielbare Version mit eigenständig formuliertem Basiswortschatz.
