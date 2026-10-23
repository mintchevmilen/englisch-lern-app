# Changelog – English Adventure

## 2.4.0 – 2026-10-23
- Neu: Kursleiste ganz oben (wie bei Duolingo). Tippen auf den Kursnamen öffnet die Auswahl: „Englisch 5. Klasse“ und „Mathe 5. Klasse“. Die App merkt sich den zuletzt genutzten Kurs.
- Mathe 5. Klasse (Mathe Mission 5, Hessen G9) ist jetzt als zweiter Kurs eingebaut. Lernpfad, Klassenarbeits-Modus, Spiele und Elternbereich funktionieren wie in der eigenen Mathe-App. Fortschritt wird getrennt gespeichert, Englisch bleibt unverändert.
- Aufgaben der Mathe-App überarbeitet: unlogische Fälle behoben (Ziffer 0 als Stellenwert, Rechengesetz bei gleichen Zahlen, widersprüchliche Einheiten, unrealistische Uhrzeiten, Ergebnis 0 bei Teilschritten), mehr Abwechslung bei Geometrie und Körpern. 40 automatische Tests prüfen alle Mathe-Generatoren.
- Technisch: Mathe liegt als eigenständiger Ordner `mathe/` (in Root und `www/`) und läuft in einem eingebetteten Rahmen. Quelle bleibt das Repo `mathe-mission-5`; Änderungen dort müssen nach `mathe/` kopiert werden.

## 2.3.1 – 2026-10-23
- Fix: Nach 2.3.0 funktionierten Erkennung und Vorlesen auf dem Handy nicht mehr. Ursachen, soweit sich ohne Gerät eingrenzen lässt: (1) Ein Fehler des Erkennungs-Plugins (z. B. „kein Treffer“) wurde fälschlich als „Erkennung nicht verfügbar“ gewertet und schaltete das Mikrofon ab; jetzt gilt das nur bei eindeutigen Fällen, sonst heißt es „nichts gehört“. (2) Die neue Live-Erkennung (Teilergebnisse über Plugin-Ereignisse) ist nicht mehr Standard, sondern ein Test-Schalter in den Eltern-Einstellungen; Standard ist wieder der einfache Modus aus 2.2.0, der bei dir funktioniert hat. (3) Das Erkennungs-Plugin wird nur noch angesprochen, wenn wirklich eine Aufnahme läuft. (4) In der Android-App wird ein evtl. vorhandener Service Worker samt Zwischenspeicher entfernt, damit nach Updates keine alten Dateien oder Plugin-Listen festhängen.
- Neu: „Sprach-Diagnose“ in den Eltern-Einstellungen (Geräte-Info, Vorlesen testen, Mikrofon testen, Live testen). Zeigt Schritt für Schritt, was auf dem Gerät passiert, inklusive Fehlertexten.
- Der Mikrofon-Knopf zeigt im einfachen Modus „Aufnahme läuft“ (rot, Pulsring), Wellen und Live-Text gibt es im Live-Modus.

## 2.3.0 – 2026-10-23
- Sprechen deutlich sichtbar: großer Mikrofon-Knopf mit klaren Zuständen. Grün = bereit; rot mit Pulsring und Wellen = „Aufnahme läuft, sprich jetzt“; Wellen tanzen, sobald die App deine Stimme erkennt; gelb = „Einen Moment, ich werte aus“. Nochmal tippen bricht ab.
- Live-Text: Während man spricht, erscheint groß, was die App gerade versteht.
- Ergebnis gut lesbar: Bei „Fast“ steht groß, was verstanden wurde, darunter das gesuchte Wort und weitere gehörte Alternativen. „Nichts gehört“ wird eigens angezeigt. Nach zwei Fehlversuchen erscheint „Weiter ✓ (das üben wir später)“, damit niemand festhängt.
- Toleranz für Kinder deutlich erhöht: Gleichklang-Gruppen (bye/buy/by/„bei“, to/two/too, hello/hallo, no/know …), typische deutsche Aussprache (th→t/s: three/tree, w→v: we/ve), mehr Buchstaben-Abweichung bei längeren Wörtern, Phrasen reichen bei 2 von 3 Wörtern (Wiederholungen wie „bye bye“ sind ok). Kurze Wörter wie cat/cut/bat bleiben getrennt.
- Sprache: wird von der App ausdrücklich gesetzt, nicht vom Handy übernommen. Englisch beim Nachsprechen und bei Aufgaben mit englischer Antwort, Deutsch („de-DE“) bei „Übersetze ins Deutsche“.
- Neu: Antworten bei Tippaufgaben lassen sich auch sprechen (Mikrofon unter dem Eingabefeld). Der erkannte Text landet im Eingabefeld, man prüft und tippt auf „Prüfen“. Zahlen wie „5“ werden bei englischen Aufgaben zu „five“.
- Intern: Erkennung im Live-Modus (Teilergebnisse und Start/Ende-Signale vom Plugin), automatische Zeitlimits (7 s ohne Stimme, 16 s gesamt), Aufräumen der Plugin-Listener. Weitere Tests (28 insgesamt).

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
