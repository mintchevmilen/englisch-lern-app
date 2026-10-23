# 🇬🇧 English Adventure

Eine kleine, schnelle Lern-App für Englisch in der **5. Klasse**.
Orientiert an den Themen- und Grammatikbereichen von
*Access 1 – Allgemeine Ausgabe 2022* (Cornelsen, ISBN 978-3-06-033978-5).

> **Wichtig:** Diese App enthält **keine** Texte, Übungen oder Vokabellisten aus dem
> Schulbuch. Alle Sätze, Aufgaben und Erklärungen sind eigenständig formuliert.
> Die App bildet lediglich die *Struktur* (Units, Themenfelder, Grammatikprogression)
> nach, damit das Üben zum Unterricht passt.

---

## 1. Was die App kann

| Bereich | Inhalt |
|---|---|
| 📚 Vocabulary | 741 Wörter in 6 Units (echter Buchwortschatz), mit Beispielsatz, Aussprache und 4 Übungsformen |
| 🧩 Grammar | 24 Grammatikbereiche mit *Learn → Practice → Challenge* und 221 Aufgaben |
| 👂 Listening | Hörverständnis über die Sprachausgabe des Browsers |
| 📖 Reading | Ein eigener kurzer Lesetext pro Unit mit Verständnisfragen |
| 💬 Speaking | Vorsprechen und Nachsprechen |
| ✍️ Writing | Eigene Sätze schreiben (Übersetzungsaufgaben) |
| 🌍 Everyday English | Redewendungen für den Alltag |
| 🏆 Unit Challenge | Abschlusstest je Unit (wird erst freigeschaltet) |
| 📝 Test Training | Vocabulary / Grammar / Mixed / 10-Minute / Full Unit Test in 3 Schwierigkeiten |
| 🚨 Test Tomorrow | 5-stufiges Intensivtraining (ca. 15 Minuten) für den Tag vor der Arbeit |
| 🎮 Spiele | Word Match, Word Runner, Sentence Builder |
| 🔥 Gamification | XP, 7 Level, Lernserie (Streak), Tagesmission, 14 Auszeichnungen |
| 🧠 Smartes Wiederholen | Leitner-System – falsche Wörter kommen häufiger dran |
| 👨‍👩‍👦 Elternbereich | Lernzeit, XP, Streak, Schwächen, Testergebnisse, Einstellungen |

**Kein Login, kein Konto, keine Datenübertragung.** Der gesamte Fortschritt liegt
im `localStorage` des Browsers auf dem Handy.

---

## 2. Technik – und warum

* **Reines HTML, CSS und JavaScript.** Kein React, kein Vite, kein Build-Schritt.
* **Keine externen Bibliotheken**, keine Webfonts, keine Tracker → 14 Requests, ca. 210 KB
  (über GitHub Pages gzip-komprimiert deutlich weniger).
* **ES5-Syntax** im gesamten App-Code – läuft auch auf älteren Chrome-Versionen.
* **Keine 3D-Effekte, keine Dauer-Animationen.** Übergänge dauern 140 ms.
* **Service Worker** → nach dem ersten Laden funktioniert die App **offline**.
* **Audio über die Web Speech API** des Browsers (siehe Abschnitt 6).

Das ist bewusst so gewählt für ein **Samsung Galaxy S7**: wenig RAM, schneller Start,
stabil auch bei schlechter Verbindung.

---

## 3. Lokal ausprobieren

Einfach `index.html` doppelklicken – das funktioniert bereits.
Für den Service Worker (Offline-Modus) braucht es einen kleinen Webserver:

```bash
# Variante A – Python (auf Windows meist vorhanden)
python -m http.server 8080

# Variante B – Node.js
npx serve .
```

Dann im Browser `http://localhost:8080` öffnen.

---

## 4. Auf GitHub veröffentlichen (Schritt für Schritt)

### 4.1 Repository anlegen

```powershell
cd "C:\Users\mintc\OneDrive\Dokumente\Englisch Lern App"
git init
git add .
git commit -m "English Adventure – erste Version"
gh repo create englisch-lern-app --public --source=. --remote=origin --push
```

> Das Repository muss **public** sein, damit GitHub Pages ohne kostenpflichtigen Plan
> funktioniert. Die App enthält keinerlei persönliche Daten.

Ohne `gh` geht es auch von Hand: auf github.com ein Repository `englisch-lern-app`
anlegen und dann:

```powershell
git remote add origin https://github.com/mintchevmilen/englisch-lern-app.git
git branch -M main
git push -u origin main
```

### 4.2 GitHub Pages aktivieren

1. Repository auf github.com öffnen
2. **Settings** → links **Pages**
3. Bei *Source*: **Deploy from a branch**
4. Branch: **main**, Ordner: **/ (root)** → **Save**
5. Nach ein bis zwei Minuten erscheint oben die Adresse:

```
https://mintchevmilen.github.io/englisch-lern-app/
```

Die Datei `.nojekyll` liegt bereits im Projekt – sie sorgt dafür, dass GitHub die
Dateien unverändert ausliefert.

### 4.3 Auf dem Galaxy S7 einrichten

1. In **Chrome** die Adresse öffnen
2. Menü (⋮) → **Zum Startbildschirm hinzufügen**
3. Bestätigen – die App liegt jetzt als Symbol auf dem Startbildschirm und
   startet im Vollbild, ohne Adressleiste
4. Einmal komplett durchklicken, damit der Service Worker alles zwischenspeichert –
   danach läuft sie auch ohne Internet

### 4.4 Später etwas ändern

```powershell
git add .
git commit -m "Neue Vokabeln für Unit 4"
git push
```

Damit das Handy die neue Fassung sicher lädt, in `sw.js` die Zeile

```js
var CACHE = 'english-adventure-v1';
```

auf `v2`, `v3` … hochzählen.

### 4.5 Native Android-APK (automatisch, ohne Play Store)

Zusätzlich zur PWA baut GitHub bei jedem `git push` auf `main`/`master`
automatisch eine echte Android-APK (per Capacitor + Gradle, siehe
`.github/workflows/android.yml` – Vorlage von der Fitness-App übernommen).

1. Normal pushen wie in 4.4.
2. Auf GitHub → Reiter **Actions** den Lauf **Android-APK** abwarten
   (ca. 5 Minuten).
3. Unter **Releases** (rechte Seitenleiste des Repos) liegt danach eine
   `english-adventure-<Version>-build<Nummer>.apk` zum Download.
4. Am Handy: in Chrome bei GitHub anmelden, Release öffnen, `.apk`
   herunterladen, antippen. Android fragt einmal, ob Chrome Apps
   installieren darf – erlauben.
5. Spätere APKs über die alte installieren (nicht deinstallieren!) –
   der feste Signatur-Schlüssel in `android/keystore/` sorgt dafür, dass
   das als Update erkannt wird und lokale Lerndaten erhalten bleiben.

Technische Details und Entscheidungen: `docs/PROJEKTSTAND.md`.

---

## 5. Inhalte ergänzen

Die Lerninhalte sind vollständig von der App getrennt. Es gibt **vier** Dateien:

```
data/
  units.js       Units, Titel, Themen, Level, XP-Werte, Auszeichnungen
  vocabulary.js  Wortschatz je Unit
  grammar.js     Grammatikbereiche (Learn / Practice / Challenge)
  content.js     Lesetexte, Alltagsenglisch, Schreibaufgaben
```

### Neue Vokabeln

In `data/vocabulary.js` eine Zeile in die passende Unit einfügen:

```js
{ en:"school bag", de:"Schultasche", ex:"My school bag is heavy.",
  exDe:"Meine Schultasche ist schwer.", tip:"Merkhilfe (optional)" },
```

Pflicht sind nur `en` und `de`. Die App erzeugt daraus **automatisch**
Lernkarten, Multiple-Choice-Fragen, Schreibübungen, Lückentexte, Hörübungen
und Spielinhalte. Alle 8 Wörter entsteht automatisch eine neue Lektion.

### Neuer Grammatikbereich

1. In `data/grammar.js` einen Eintrag mit eigener `id` anlegen (Vorlage: die
   Kommentare oben in der Datei erklären alle vier Aufgabentypen)
2. Die `id` in `data/units.js` bei der Unit ins Feld `grammar` eintragen

Wichtig: Bei jeder Aufgabe das Feld `why` ausfüllen – das ist die Erklärung,
die bei einer falschen Antwort erscheint.

### Neue Unit / Access 2 und 3

In `data/units.js` einen Eintrag ergänzen, in `data/vocabulary.js` die Liste
`u6: [...]` anlegen – fertig. Die Navigation, der Fortschritt und alle Tests
passen sich automatisch an.

---

## 6. Zur Sprachausgabe

Die App hat zwei Aussprache-Wege, je nachdem wie sie läuft:

* **PWA/Chrome** (siehe 4.2): Web Speech API (`speechSynthesis`).
* **Native Android-APK** (siehe 4.5): `speechSynthesis` gibt es in der Android-
  WebView nicht (seit Jahren eine bekannte Einschränkung) – deshalb nutzt die
  APK stattdessen das Plugin `@capacitor-community/text-to-speech`, das direkt
  die Geräte-eigene Text-zu-Sprache-Engine anspricht. `js/audio.js` erkennt
  automatisch, welcher Weg gerade läuft.

Vorteile gegenüber Audiodateien (für beide Wege):

* **0 Byte Download** – bei ~300 Wörtern wären das sonst schnell 20–40 MB
* funktioniert auch offline
* jedes neu ergänzte Wort ist sofort hörbar, ohne dass eine Datei aufgenommen werden muss

Die App wählt automatisch eine **britische** Stimme (`en-GB`), sonst `en-US`, sonst
irgendeine englische. Das Sprechtempo ist im Elternbereich einstellbar (langsam /
normal / schnell); Vorgabe ist 0,85 – etwas langsamer als normal.

Falls auf einem Gerät keine englische Stimme installiert ist, bleibt die App voll
benutzbar; die Listening-Übungen weisen dann darauf hin. Nachrüsten lässt sich das
unter *Einstellungen → Allgemeine Verwaltung → Sprache → Text-zu-Sprache*.

Sollte später einmal echte Sprecher-Qualität gewünscht sein, wäre der Weg: MP3-Dateien
unter `audio/<wort>.mp3` ablegen und in `js/audio.js` zuerst dort nachsehen. Für den
Zweck – Vokabeln hören und nachsprechen – ist die Browserstimme aber völlig ausreichend.

---

## 7. Projektstruktur

```
englisch-lern-app/
├── index.html              Grundgerüst, lädt alle Skripte
├── manifest.webmanifest    macht die App zur Startbildschirm-App
├── sw.js                   Service Worker (Offline)
├── .nojekyll               GitHub Pages: Dateien unverändert ausliefern
├── css/style.css           komplettes Design
├── icons/                  App-Symbole
├── data/                   ← hier werden Inhalte gepflegt
│   ├── units.js
│   ├── vocabulary.js
│   ├── grammar.js
│   └── content.js
└── js/
    ├── storage.js          Fortschritt speichern (localStorage)
    ├── srs.js              Wortindex + Wiederholungssystem
    ├── audio.js            Sprachausgabe
    ├── engine.js           Aufgaben erzeugen, Antworten prüfen
    ├── player.js           Übungs-Player
    ├── games.js            die drei Spiele
    ├── ui.js               alle Bildschirme
    └── app.js              Navigation und Start
```

---

## 8. Wie das Wiederholungssystem arbeitet

Jedes Wort hat eine Box von 0 bis 4.

* richtig → Box +1, nächste Wiederholung nach 0 / 1 / 2 / 5 / 12 Tagen
* falsch → Box −2, das Wort kommt sehr bald wieder, außerdem innerhalb
  derselben Runde noch einmal

Daraus ergeben sich die fünf Lernstufen 🔴 Neu, 🟠 Unsicher, 🟡 In Arbeit,
🟢 Gut gelernt, ⭐ Gemeistert. Wörter mit vielen Fehlern erscheinen auf der
Startseite als *Your weak words*.

---

## 9. Rechtliches

Für den privaten Gebrauch geschrieben. „Access“ und „Cornelsen“ sind Marken der
Cornelsen Verlag GmbH; es besteht keine Verbindung zum Verlag. Die App ist keine
Kopie und kein Ersatz für das Schulbuch, sondern ein eigenständiges Übungsprogramm.
