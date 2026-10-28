/* Lernpfad "Python von Anfang an". Alles echtes Python (CPython).
   Aufbau einer Lektion:
     text:  Absaetze {p} und Code-Beispiele {code}
     tasks: Aufgaben mit Pruefung
       tests[]: { inputs: [...], append: "Python-Code, der nach dem Programm laeuft",
                  has: [Textteile, die in der Ausgabe stehen muessen],
                  lastIs: "letzte Ausgabezeile ist genau das" (ohne Gross/Klein),
                  lastHas: "letzte Ausgabezeile enthaelt das",
                  exact: "komplette Ausgabe ist genau das" (ohne Leerzeichen am Zeilenende) }
       must[]: Regex-Muster, die im Quelltext vorkommen muessen (zeigt, dass z.B. wirklich eine Schleife benutzt wurde)
*/
window.PY_LESSONS = [
  {
    id: "hallo", icon: "👋", title: "Hallo Welt",
    ziel: "Ich schreibe mein erstes Programm.",
    text: [
      { p: "Ein Programm ist eine Liste von Befehlen. Der Computer liest sie von oben nach unten und führt sie nacheinander aus." },
      { p: "Der Befehl print() schreibt etwas auf den Bildschirm. Text muss in Anführungszeichen stehen." },
      { code: 'print("Hallo Welt")' },
      { p: "Du kannst mehrere Befehle untereinander schreiben. Jeder print() beginnt eine neue Zeile." },
      { code: 'print("Ich lerne Python")\nprint("und das macht Spaß")' },
      { p: "Wichtig: Python achtet auf jedes Zeichen. Klammern, Anführungszeichen und Schreibweise müssen stimmen. Auch print muss klein geschrieben sein." }
    ],
    tasks: [
      {
        id: "hallo-1", title: "Dein erster Befehl",
        aufgabe: 'Schreibe ein Programm, das genau diesen Text ausgibt: Hallo Welt',
        start: '# Schreibe hier deinen Code\n',
        tests: [{ exact: "Hallo Welt" }],
        hint: 'Du brauchst print( ) und darin den Text in Anführungszeichen.',
        solution: 'print("Hallo Welt")'
      },
      {
        id: "hallo-2", title: "Zwei Zeilen",
        aufgabe: 'Gib zwei Zeilen aus. Zeile 1: Ich lerne Python. Zeile 2: Das macht Spaß.',
        start: '',
        tests: [{ exact: "Ich lerne Python.\nDas macht Spaß." }],
        hint: 'Zwei print() Befehle, einer pro Zeile. Achte auf den Punkt am Ende.',
        solution: 'print("Ich lerne Python.")\nprint("Das macht Spaß.")'
      }
    ]
  },
  {
    id: "rechnen", icon: "🧮", title: "Rechnen",
    ziel: "Ich lasse Python rechnen.",
    text: [
      { p: "Python ist ein super Taschenrechner. Zahlen schreibst du ohne Anführungszeichen." },
      { code: "print(3 + 4)\nprint(10 - 7)\nprint(6 * 7)\nprint(20 / 4)" },
      { p: "Das Zeichen für Mal ist der Stern *. Geteilt ist der Schrägstrich /. Es gilt Punkt vor Strich, genau wie in der Schule. Mit Klammern änderst du die Reihenfolge." },
      { code: "print(2 + 3 * 4)\nprint((2 + 3) * 4)" },
      { p: "Drei besondere Rechenzeichen sind sehr nützlich:" },
      { code: "print(2 ** 10)   # hoch: 2 hoch 10\nprint(17 // 5)   # ganzzahlig teilen\nprint(17 % 5)    # Rest beim Teilen" },
      { p: "Alles hinter einem Doppelkreuz # ist ein Kommentar. Python ignoriert ihn. Er ist eine Notiz für Menschen." }
    ],
    tasks: [
      {
        id: "rechnen-1", title: "Malnehmen",
        aufgabe: "Lass Python 7 mal 8 ausrechnen und das Ergebnis ausgeben.",
        start: "", tests: [{ exact: "56" }], must: ["\\*"],
        hint: "print(7 * 8)", solution: "print(7 * 8)"
      },
      {
        id: "rechnen-2", title: "Sekunden am Tag",
        aufgabe: "Ein Tag hat 24 Stunden, jede Stunde 60 Minuten, jede Minute 60 Sekunden. Berechne die Sekunden eines Tages mit Python, nicht im Kopf.",
        start: "", tests: [{ exact: "86400" }], must: ["24", "60"],
        hint: "Multipliziere 24 * 60 * 60 in einem print().", solution: "print(24 * 60 * 60)"
      },
      {
        id: "rechnen-3", title: "Rest",
        aufgabe: "Du hast 23 Bonbons und verteilst sie an 5 Kinder, jedes bekommt gleich viele. Gib in der ersten Zeile aus, wie viele jedes Kind bekommt. In der zweiten Zeile, wie viele übrig bleiben.",
        start: "", tests: [{ exact: "4\n3" }], must: ["//", "%"],
        hint: "Mit // teilst du ganzzahlig, mit % bekommst du den Rest.", solution: "print(23 // 5)\nprint(23 % 5)"
      }
    ]
  },
  {
    id: "variablen", icon: "📦", title: "Variablen",
    ziel: "Ich speichere Werte und benutze sie später wieder.",
    text: [
      { p: "Eine Variable ist wie eine Kiste mit einem Namen. Du legst etwas hinein und holst es später wieder heraus. Das Gleichheitszeichen bedeutet hier: lege den Wert in die Kiste." },
      { code: 'name = "Mia"\nalter = 11\nprint(name)\nprint(alter)' },
      { p: "Du kannst mit Variablen rechnen und sie überschreiben." },
      { code: "punkte = 10\npunkte = punkte + 5\nprint(punkte)" },
      { p: "In print() darfst du mehrere Dinge mit Komma trennen. Python setzt ein Leerzeichen dazwischen." },
      { code: 'name = "Mia"\nprint("Ich heiße", name)' },
      { p: "Gute Namen sagen, was in der Kiste steckt: preis ist besser als x. Nimm kleine Buchstaben und keine Leerzeichen. Für Wörter nimmst du einen Unterstrich, zum Beispiel mein_name." }
    ],
    tasks: [
      {
        id: "variablen-1", title: "Preis mal Anzahl",
        aufgabe: "Lege eine Variable preis mit dem Wert 12 an und eine Variable anzahl mit dem Wert 3. Gib danach preis mal anzahl aus.",
        start: "", tests: [{ exact: "36" }], must: ["preis\\s*=", "anzahl\\s*="],
        hint: "preis = 12, anzahl = 3, dann print(preis * anzahl)",
        solution: "preis = 12\nanzahl = 3\nprint(preis * anzahl)"
      },
      {
        id: "variablen-2", title: "Rechteck",
        aufgabe: "Ein Rechteck ist 9 lang und 4 breit. Lege laenge und breite als Variablen an und gib den Umfang aus (2 mal laenge plus 2 mal breite).",
        start: "", tests: [{ exact: "26" }], must: ["laenge\\s*=", "breite\\s*="],
        hint: "Umfang = 2 * (laenge + breite)", solution: "laenge = 9\nbreite = 4\nprint(2 * (laenge + breite))"
      },
      {
        id: "variablen-3", title: "Überschreiben",
        aufgabe: "Starte mit punkte = 10. Addiere danach 5 dazu und verdopple dann den Wert. Gib das Ergebnis aus.",
        start: "punkte = 10\n", tests: [{ exact: "30" }], must: ["punkte\\s*=\\s*punkte"],
        hint: "punkte = punkte + 5, danach punkte = punkte * 2",
        solution: "punkte = 10\npunkte = punkte + 5\npunkte = punkte * 2\nprint(punkte)"
      }
    ]
  },
  {
    id: "eingabe", icon: "⌨️", title: "Eingaben und Text",
    ziel: "Mein Programm fragt etwas und antwortet darauf.",
    text: [
      { p: "Mit input() fragt dein Programm den Benutzer. Alles, was er tippt, kommt als Text zurück. Der Text in der Klammer wird vorher angezeigt." },
      { code: 'name = input("Wie heißt du? ")\nprint("Hallo", name)' },
      { p: "Ein f vor den Anführungszeichen macht aus dem Text einen f-String. Variablen in geschweiften Klammern werden direkt eingesetzt. Das ist sehr bequem." },
      { code: 'name = input("Wie heißt du? ")\nprint(f"Schön dich zu sehen, {name}!")' },
      { p: "Achtung: input() liefert immer Text, auch wenn jemand eine Zahl tippt. Mit int() machst du aus Text eine ganze Zahl, mit float() eine Kommazahl. Erst dann kannst du rechnen." },
      { code: 'zahl = int(input("Zahl: "))\nprint(f"Das Doppelte ist {zahl * 2}")' },
      { p: "Textstücke kannst du auch mit + zusammenkleben, zum Beispiel \"Hal\" + \"lo\". Mit len() zählst du die Buchstaben." },
      { code: 'wort = "Schmetterling"\nprint(len(wort))\nprint(wort.upper())' }
    ],
    tasks: [
      {
        id: "eingabe-1", title: "Begrüßung",
        aufgabe: 'Frage nach dem Namen und gib dann aus: Hallo NAME! (mit dem eingegebenen Namen und Ausrufezeichen).',
        start: "", tests: [{ inputs: ["Mia"], lastIs: "Hallo Mia!" }, { inputs: ["Leo"], lastIs: "Hallo Leo!" }], must: ["input"],
        hint: 'print(f"Hallo {name}!") nachdem du name = input(...) gemacht hast.',
        solution: 'name = input("Wie heißt du? ")\nprint(f"Hallo {name}!")'
      },
      {
        id: "eingabe-2", title: "Zwei Zahlen addieren",
        aufgabe: "Frage nach zwei Zahlen und gib in der letzten Zeile nur die Summe aus.",
        start: "", tests: [{ inputs: ["3", "4"], lastIs: "7" }, { inputs: ["10", "25"], lastIs: "35" }], must: ["int|float"],
        hint: "Mach aus beiden Eingaben mit int() Zahlen, sonst klebt Python sie nur als Text aneinander.",
        solution: 'a = int(input("Erste Zahl: "))\nb = int(input("Zweite Zahl: "))\nprint(a + b)'
      },
      {
        id: "eingabe-3", title: "Wie lang ist dein Name?",
        aufgabe: "Frage nach einem Wort und gib in der letzten Zeile die Anzahl der Buchstaben aus.",
        start: "", tests: [{ inputs: ["Python"], lastIs: "6" }, { inputs: ["Schmetterling"], lastIs: "13" }], must: ["len"],
        hint: "len(wort) liefert die Länge.", solution: 'wort = input("Wort: ")\nprint(len(wort))'
      }
    ]
  },
  {
    id: "wenn", icon: "🔀", title: "Entscheidungen",
    ziel: "Mein Programm reagiert unterschiedlich, je nachdem was passiert.",
    text: [
      { p: "Mit if entscheidet das Programm. Steht hinter if etwas Wahres, läuft der eingerückte Block. Sonst läuft der Block bei else." },
      { code: 'alter = 12\nif alter >= 10:\n    print("Du darfst mitfahren")\nelse:\n    print("Du bist noch zu klein")' },
      { p: "Zwei Dinge sind wichtig. Hinter der Bedingung steht ein Doppelpunkt. Die Zeilen darunter sind mit vier Leerzeichen eingerückt. So erkennt Python, was dazugehört. Ein Einrücken kannst du mit der Taste Tab erzeugen." },
      { p: "Vergleiche sind: == (gleich), != (ungleich), <, >, <= und >=. Ein einzelnes = legt dagegen eine Variable an. Das ist ein klassischer Anfängerfehler." },
      { code: 'zahl = 7\nif zahl == 7:\n    print("Glückszahl")\nelif zahl > 7:\n    print("größer")\nelse:\n    print("kleiner")' },
      { p: "Mit and, or und not verbindest du Bedingungen." },
      { code: 'temperatur = 25\nsonne = True\nif temperatur > 20 and sonne:\n    print("Eis essen!")' }
    ],
    tasks: [
      {
        id: "wenn-1", title: "Darf er mitfahren?",
        aufgabe: 'Frage nach dem Alter. Ab 10 Jahren gib aus: Du darfst mitfahren. Sonst: Du bist noch zu klein.',
        start: "", tests: [{ inputs: ["12"], lastIs: "Du darfst mitfahren" }, { inputs: ["10"], lastIs: "Du darfst mitfahren" }, { inputs: ["8"], lastIs: "Du bist noch zu klein" }], must: ["if"],
        hint: "alter = int(input(...)). Dann if alter >= 10: und else:",
        solution: 'alter = int(input("Alter: "))\nif alter >= 10:\n    print("Du darfst mitfahren")\nelse:\n    print("Du bist noch zu klein")'
      },
      {
        id: "wenn-2", title: "Gerade oder ungerade",
        aufgabe: "Frage nach einer Zahl. Gib gerade aus, wenn sie gerade ist, sonst ungerade. Tipp: Der Rest beim Teilen durch 2 verrät es.",
        start: "", tests: [{ inputs: ["4"], lastIs: "gerade" }, { inputs: ["7"], lastIs: "ungerade" }, { inputs: ["0"], lastIs: "gerade" }], must: ["%"],
        hint: "zahl % 2 == 0 bedeutet gerade.",
        solution: 'zahl = int(input("Zahl: "))\nif zahl % 2 == 0:\n    print("gerade")\nelse:\n    print("ungerade")'
      },
      {
        id: "wenn-3", title: "Note",
        aufgabe: "Frage nach Punkten von 0 bis 100. Ab 90 gib sehr gut aus, ab 70 gut, ab 50 ausreichend, sonst nicht bestanden.",
        start: "", tests: [{ inputs: ["95"], lastIs: "sehr gut" }, { inputs: ["75"], lastIs: "gut" }, { inputs: ["50"], lastIs: "ausreichend" }, { inputs: ["12"], lastIs: "nicht bestanden" }], must: ["elif"],
        hint: "if mit >= 90, dann elif >= 70, elif >= 50, am Ende else.",
        solution: 'p = int(input("Punkte: "))\nif p >= 90:\n    print("sehr gut")\nelif p >= 70:\n    print("gut")\nelif p >= 50:\n    print("ausreichend")\nelse:\n    print("nicht bestanden")'
      }
    ]
  },
  {
    id: "schleifen", icon: "🔁", title: "Schleifen",
    ziel: "Ich lasse den Computer Dinge für mich wiederholen.",
    text: [
      { p: "Computer sind gut darin, dasselbe tausendmal zu tun. Dafür gibt es Schleifen. Die for Schleife wiederholt einen Block, zum Beispiel fünfmal." },
      { code: "for i in range(5):\n    print(\"Durchgang\", i)" },
      { p: "range(5) zählt 0, 1, 2, 3, 4. Es beginnt bei 0 und hört vor der 5 auf. Willst du von 1 bis 10 zählen, schreibst du range(1, 11)." },
      { code: "for zahl in range(1, 11):\n    print(zahl * zahl)" },
      { p: "Die while Schleife läuft so lange, wie eine Bedingung stimmt. Pass auf, dass sie irgendwann endet. Sonst läuft sie ewig. Das ist eine Endlosschleife. Die App stoppt sie nach einigen Sekunden." },
      { code: "z = 3\nwhile z > 0:\n    print(z)\n    z = z - 1\nprint(\"Start!\")" }
    ],
    tasks: [
      {
        id: "schleifen-1", title: "Zählen bis 10",
        aufgabe: "Gib die Zahlen von 1 bis 10 aus, jede in einer eigenen Zeile. Benutze eine Schleife.",
        start: "", tests: [{ exact: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10" }], must: ["for|while"],
        hint: "for zahl in range(1, 11): und dann print(zahl) eingerückt.",
        solution: "for zahl in range(1, 11):\n    print(zahl)"
      },
      {
        id: "schleifen-2", title: "Das Einmaleins",
        aufgabe: "Gib das Einmaleins der 7 aus, genau in dieser Form: 7 x 1 = 7, dann 7 x 2 = 14, bis 7 x 10 = 70. Eine Zeile pro Rechnung.",
        start: "", tests: [{ exact: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70" }], must: ["for|while"],
        hint: 'print(f"7 x {i} = {7 * i}") in einer Schleife über i.',
        solution: 'for i in range(1, 11):\n    print(f"7 x {i} = {7 * i}")'
      },
      {
        id: "schleifen-3", title: "Countdown",
        aufgabe: "Zähle von 5 bis 1 herunter, jede Zahl in einer eigenen Zeile. Danach kommt eine Zeile mit: Start! Benutze eine while Schleife.",
        start: "", tests: [{ exact: "5\n4\n3\n2\n1\nStart!" }], must: ["while"],
        hint: "Setze z = 5. Solange z > 0: ausgeben und z um 1 verkleinern. Nach der Schleife: Start!",
        solution: 'z = 5\nwhile z > 0:\n    print(z)\n    z = z - 1\nprint("Start!")'
      },
      {
        id: "schleifen-4", title: "Summe bis N",
        aufgabe: "Frage nach einer Zahl n. Zähle alle Zahlen von 1 bis n zusammen und gib in der letzten Zeile die Summe aus.",
        start: "", tests: [{ inputs: ["10"], lastIs: "55" }, { inputs: ["100"], lastIs: "5050" }, { inputs: ["1"], lastIs: "1" }], must: ["for|while"],
        hint: "Starte mit summe = 0. In der Schleife: summe = summe + zahl.",
        solution: 'n = int(input("n: "))\nsumme = 0\nfor zahl in range(1, n + 1):\n    summe = summe + zahl\nprint(summe)'
      }
    ]
  },
  {
    id: "listen", icon: "📋", title: "Listen",
    ziel: "Ich speichere viele Werte in einer Liste.",
    text: [
      { p: "Eine Liste hält viele Werte unter einem Namen. Sie steht in eckigen Klammern. Gezählt wird ab 0." },
      { code: 'obst = ["Apfel", "Birne", "Banane"]\nprint(obst[0])\nprint(len(obst))' },
      { p: "Mit append() hängst du etwas hinten an. Mit einer for Schleife gehst du alle Einträge durch." },
      { code: 'obst.append("Kirsche")\nfor frucht in obst:\n    print("Ich mag", frucht)' },
      { p: "Praktisch sind außerdem sum(), max(), min() und sorted()." },
      { code: "zahlen = [4, 8, 15, 16, 23, 42]\nprint(sum(zahlen))\nprint(max(zahlen))\nprint(sorted(zahlen, reverse=True))" },
      { p: "Mit in prüfst du, ob etwas in der Liste steckt." },
      { code: 'if "Birne" in obst:\n    print("Birne ist da")' }
    ],
    tasks: [
      {
        id: "listen-1", title: "Einkaufsliste",
        aufgabe: 'Lege eine Liste einkauf mit Brot, Milch und Käse an. Hänge Eier an. Gib danach jede Sache in einer eigenen Zeile aus.',
        start: "", tests: [{ exact: "Brot\nMilch\nKäse\nEier" }], must: ["einkauf", "append"],
        hint: "einkauf = [\"Brot\", ...], einkauf.append(\"Eier\"), dann for sache in einkauf: print(sache)",
        solution: 'einkauf = ["Brot", "Milch", "Käse"]\neinkauf.append("Eier")\nfor sache in einkauf:\n    print(sache)'
      },
      {
        id: "listen-2", title: "Summe ohne sum()",
        aufgabe: "Die Liste zahlen = [4, 8, 15, 16, 23, 42] ist gegeben. Berechne die Summe mit einer Schleife, nicht mit sum(), und gib sie aus.",
        start: "zahlen = [4, 8, 15, 16, 23, 42]\n", tests: [{ exact: "108" }], must: ["for"],
        hint: "summe = 0 und dann in der Schleife jede Zahl dazuzählen.",
        solution: 'zahlen = [4, 8, 15, 16, 23, 42]\nsumme = 0\nfor z in zahlen:\n    summe = summe + z\nprint(summe)'
      },
      {
        id: "listen-3", title: "Größte Zahl",
        aufgabe: "Frage dreimal nach einer Zahl und speichere sie in einer Liste. Gib in der letzten Zeile die größte aus.",
        start: "", tests: [{ inputs: ["3", "9", "5"], lastIs: "9" }, { inputs: ["20", "1", "2"], lastIs: "20" }], must: ["append|\\["],
        hint: "Mit einer Schleife über range(3) fragst du dreimal. max(liste) findet die größte.",
        solution: 'zahlen = []\nfor i in range(3):\n    zahlen.append(int(input("Zahl: ")))\nprint(max(zahlen))'
      }
    ]
  },
  {
    id: "funktionen", icon: "🧩", title: "Funktionen",
    ziel: "Ich baue mir eigene Befehle.",
    text: [
      { p: "Eine Funktion ist ein eigener Befehl, den du selbst definierst. Das Wort dafür ist def. Danach kannst du sie beliebig oft aufrufen." },
      { code: 'def begruesse(name):\n    print(f"Hallo {name}!")\n\nbegruesse("Mia")\nbegruesse("Leo")' },
      { p: "In der Klammer steht der Parameter. Das ist die Zutat, die du beim Aufruf hineingibst. Mit return gibt die Funktion ein Ergebnis zurück. Dann kannst du es speichern oder weiterrechnen." },
      { code: 'def verdopple(x):\n    return x * 2\n\nergebnis = verdopple(21)\nprint(ergebnis)' },
      { p: "Eine Funktion kann mehrere Parameter haben und Entscheidungen treffen." },
      { code: 'def groesser(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(groesser(3, 8))' },
      { p: "Merke: Das Definieren einer Funktion führt sie noch nicht aus. Erst der Aufruf tut etwas." }
    ],
    tasks: [
      {
        id: "funktionen-1", title: "Verdoppeln",
        aufgabe: "Schreibe eine Funktion verdopple(x), die x mal 2 zurückgibt (mit return).",
        start: "def verdopple(x):\n    # dein Code\n", tests: [{ append: "print(verdopple(5))\nprint(verdopple(0))\nprint(verdopple(-4))", exact: "10\n0\n-8" }], must: ["def\\s+verdopple", "return"],
        hint: "return x * 2, eingerückt unter dem def.",
        solution: "def verdopple(x):\n    return x * 2"
      },
      {
        id: "funktionen-2", title: "Gerade?",
        aufgabe: "Schreibe eine Funktion ist_gerade(zahl). Sie gibt True zurück, wenn die Zahl gerade ist, sonst False.",
        start: "def ist_gerade(zahl):\n", tests: [{ append: "print(ist_gerade(4))\nprint(ist_gerade(7))\nprint(ist_gerade(0))", exact: "True\nFalse\nTrue" }], must: ["def\\s+ist_gerade", "return"],
        hint: "return zahl % 2 == 0 klappt in einer Zeile.",
        solution: "def ist_gerade(zahl):\n    return zahl % 2 == 0"
      },
      {
        id: "funktionen-3", title: "Fläche",
        aufgabe: "Schreibe eine Funktion flaeche(laenge, breite), die die Fläche eines Rechtecks zurückgibt.",
        start: "def flaeche(laenge, breite):\n", tests: [{ append: "print(flaeche(3, 4))\nprint(flaeche(10, 10))", exact: "12\n100" }], must: ["def\\s+flaeche", "return"],
        hint: "return laenge * breite", solution: "def flaeche(laenge, breite):\n    return laenge * breite"
      },
      {
        id: "funktionen-4", title: "Fakultät",
        aufgabe: "Schreibe eine Funktion fakultaet(n). Sie multipliziert alle Zahlen von 1 bis n. Zum Beispiel ist fakultaet(5) gleich 1 * 2 * 3 * 4 * 5 = 120. Für n = 0 kommt 1 heraus.",
        start: "def fakultaet(n):\n", tests: [{ append: "print(fakultaet(5))\nprint(fakultaet(1))\nprint(fakultaet(0))\nprint(fakultaet(10))", exact: "120\n1\n1\n3628800" }], must: ["def\\s+fakultaet", "return"],
        hint: "Starte mit ergebnis = 1 und multipliziere in einer Schleife über range(1, n + 1).",
        solution: "def fakultaet(n):\n    ergebnis = 1\n    for i in range(1, n + 1):\n        ergebnis = ergebnis * i\n    return ergebnis"
      }
    ]
  },
  {
    id: "projekt-raten", icon: "🎯", title: "Projekt: Zahlenraten",
    ziel: "Ich baue ein ganzes Spiel aus allem, was ich gelernt habe.",
    text: [
      { p: "Zeit für ein echtes Spiel. Der Computer denkt sich eine Zahl zwischen 1 und 100 aus. Du rätst, und er sagt dir, ob du zu hoch oder zu niedrig liegst." },
      { p: "Du brauchst drei neue Dinge. Zufallszahlen kommen aus dem Modul random. Mit import holst du es dir. Eine Schleife läuft, bis du richtig liegst. Und int() macht aus der Eingabe eine Zahl." },
      { code: "import random\ngeheim = random.randint(1, 100)\nprint(geheim)" },
      { p: "Probiere das Beispiel mehrmals. Es kommt jedes Mal eine andere Zahl. Jetzt bist du dran. Baue das Spiel Schritt für Schritt." }
    ],
    tasks: [
      {
        id: "raten-1", title: "Das Spiel",
        aufgabe: "Baue das Spiel. Der Computer wählt eine Zahl von 1 bis 100. Der Spieler tippt eine Zahl. Ist sie zu klein, schreibe zu klein. Ist sie zu groß, schreibe zu groß. Bei der richtigen Zahl schreibe Geschafft! und beende das Spiel. Das Spiel darf beliebig viele Versuche erlauben.",
        start: "import random\n\ngeheim = random.randint(1, 100)\n\n# Deine Schleife kommt hierher\n",
        tests: [{ inputs: Array.from({ length: 100 }, function (_, i) { return String(i + 1); }), has: ["Geschafft!"] }],
        must: ["random", "while", "input", "if"],
        hint: "while True: ... Frage die Zahl ab, vergleiche sie mit geheim. Bei Gleichheit gibst du Geschafft! aus und beendest die Schleife mit break.",
        solution: 'import random\n\ngeheim = random.randint(1, 100)\n\nwhile True:\n    tipp = int(input("Dein Tipp: "))\n    if tipp < geheim:\n        print("zu klein")\n    elif tipp > geheim:\n        print("zu groß")\n    else:\n        print("Geschafft!")\n        break'
      },
      {
        id: "raten-2", title: "Versuche zählen",
        aufgabe: "Erweitere dein Spiel: Zähle die Versuche mit einer Variable. Wenn der Spieler gewonnen hat, schreibe zusätzlich Versuche: ZAHL, mit der Zahl der Versuche. Zum Beispiel Versuche: 4.",
        start: "", tests: [{ inputs: Array.from({ length: 100 }, function (_, i) { return String(i + 1); }), has: ["Geschafft!", "Versuche: "] }],
        must: ["random", "while", "\\+\\s*1|\\+="],
        hint: "versuche = 0 vor der Schleife, in der Schleife versuche = versuche + 1.",
        solution: 'import random\n\ngeheim = random.randint(1, 100)\nversuche = 0\n\nwhile True:\n    tipp = int(input("Dein Tipp: "))\n    versuche = versuche + 1\n    if tipp < geheim:\n        print("zu klein")\n    elif tipp > geheim:\n        print("zu groß")\n    else:\n        print("Geschafft!")\n        print(f"Versuche: {versuche}")\n        break'
      }
    ]
  },
  {
    id: "projekt-quiz", icon: "🏆", title: "Projekt: Quiz",
    ziel: "Ich baue ein Quiz mit Punkten und eigenen Fragen.",
    text: [
      { p: "Jetzt baust du ein Quiz. Fragen und Antworten stehen in Listen. Eine Schleife stellt eine Frage nach der anderen und zählt die Punkte." },
      { p: "Damit Fragen und Antworten zusammenbleiben, packst du jede Frage mit ihrer Antwort in eine kleine Liste. Du kannst eine Liste in einer Liste haben." },
      { code: 'fragen = [\n    ["Hauptstadt von Deutschland?", "berlin"],\n    ["Wie viel ist 6 mal 7?", "42"],\n]\n\nfor frage in fragen:\n    print(frage[0])\n    print("Antwort ist", frage[1])' },
      { p: "Mit .lower() machst du Text klein. Dann zählt Berlin genauso wie berlin." }
    ],
    tasks: [
      {
        id: "quiz-1", title: "Dein Quiz",
        aufgabe: "Baue ein Quiz mit mindestens drei Fragen deiner Wahl. Stelle jede Frage mit input(). Wenn die Antwort stimmt, zähle einen Punkt. Am Ende gib aus: Punkte: ZAHL. Groß und Kleinschreibung soll egal sein.",
        start: 'fragen = [\n    ["Hauptstadt von Deutschland?", "berlin"],\n]\npunkte = 0\n',
        tests: [{ inputs: Array.from({ length: 30 }, function () { return "x"; }), has: ["Punkte: 0"] }],
        must: ["for", "input", "if", "lower", "punkte\\s*=\\s*punkte\\s*\\+|punkte\\s*\\+="],
        hint: "for frage in fragen: antwort = input(frage[0]). Dann if antwort.lower() == frage[1]: und punkte erhöhen.",
        solution: 'fragen = [\n    ["Hauptstadt von Deutschland?", "berlin"],\n    ["Wie viel ist 6 mal 7?", "42"],\n    ["Welche Farbe hat der Himmel?", "blau"],\n]\npunkte = 0\nfor frage in fragen:\n    antwort = input(frage[0] + " ")\n    if antwort.lower() == frage[1]:\n        punkte = punkte + 1\nprint(f"Punkte: {punkte}")'
      },
      {
        id: "quiz-2", title: "Mehr Fragen",
        aufgabe: "Hier ist ein Quiz mit zwei Fragen. Ergänze weitere Fragen, bis es mindestens vier sind. Denk dir selbst Fragen aus, zum Beispiel über Tiere, Fußball oder Schule.",
        start: 'fragen = [\n    ["Wie viel ist 6 mal 7?", "42"],\n    ["Welche Farbe hat der Himmel?", "blau"],\n]\npunkte = 0\nfor frage in fragen:\n    antwort = input(frage[0] + " ")\n    if antwort.lower() == frage[1]:\n        punkte = punkte + 1\nprint(f"Punkte: {punkte}")\n',
        tests: [{ inputs: Array.from({ length: 30 }, function () { return "x"; }), has: ["Punkte: 0"] }],
        must: ['(\\[\\s*"[^"]+",\\s*"[^"]+"\\s*\\][\\s\\S]*){4}'],
        hint: "Jede Frage ist eine Liste mit zwei Einträgen: Frage und Antwort. Zwischen den Fragen steht ein Komma.",
        solution: 'fragen = [\n    ["Wie viel ist 6 mal 7?", "42"],\n    ["Welche Farbe hat der Himmel?", "blau"],\n    ["Wie viele Beine hat eine Spinne?", "8"],\n    ["Hauptstadt von Bulgarien?", "sofia"],\n]\npunkte = 0\nfor frage in fragen:\n    antwort = input(frage[0] + " ")\n    if antwort.lower() == frage[1]:\n        punkte = punkte + 1\nprint(f"Punkte: {punkte}")'
      }
    ]
  }
];

/* Wörterbuch: Begriffe in einfachen Worten */
window.PY_GLOSSARY = [
  { t: "Programm", d: "Eine Liste von Befehlen, die der Computer nacheinander ausführt." },
  { t: "Befehl", d: "Eine einzelne Anweisung, zum Beispiel print(\"Hallo\")." },
  { t: "print()", d: "Zeigt etwas auf dem Bildschirm an.", c: 'print("Hallo")' },
  { t: "String (Text)", d: "Text steht in Anführungszeichen. Python nennt ihn str.", c: 'name = "Mia"' },
  { t: "Integer (ganze Zahl)", d: "Eine Zahl ohne Komma. Python nennt sie int.", c: "alter = 11" },
  { t: "Float (Kommazahl)", d: "Eine Zahl mit Komma. Im Programm schreibst du einen Punkt.", c: "pi = 3.14" },
  { t: "Boolean", d: "Ein Wert, der nur wahr oder falsch sein kann: True oder False.", c: "fertig = True" },
  { t: "Variable", d: "Ein Name für einen gespeicherten Wert, wie eine beschriftete Kiste.", c: "punkte = 10" },
  { t: "Operator", d: "Ein Zeichen, das etwas berechnet oder vergleicht, wie + * == oder <." },
  { t: "Kommentar", d: "Eine Notiz für Menschen. Python überspringt alles hinter dem #.", c: "# das ist ein Kommentar" },
  { t: "input()", d: "Fragt den Benutzer etwas und liefert seine Antwort als Text.", c: 'name = input("Name? ")' },
  { t: "f-String", d: "Text mit f davor. Variablen in { } werden eingesetzt.", c: 'print(f"Hallo {name}")' },
  { t: "Bedingung", d: "Eine Frage, die mit wahr oder falsch beantwortet wird, zum Beispiel alter >= 10." },
  { t: "if / elif / else", d: "Das Programm entscheidet, welcher Block ausgeführt wird.", c: "if x > 5:\n    print(\"groß\")\nelse:\n    print(\"klein\")" },
  { t: "Einrückung", d: "Die Leerzeichen am Zeilenanfang. Sie zeigen, welche Zeilen zu einem Block gehören. Üblich sind vier." },
  { t: "Schleife", d: "Wiederholt einen Block. for zählt oder geht eine Liste durch, while läuft solange eine Bedingung stimmt.", c: "for i in range(3):\n    print(i)" },
  { t: "Endlosschleife", d: "Eine Schleife, die nie aufhört, weil ihre Bedingung immer stimmt." },
  { t: "Liste", d: "Mehrere Werte unter einem Namen. Gezählt wird ab 0.", c: "farben = [\"rot\", \"blau\"]" },
  { t: "Index", d: "Die Nummer eines Eintrags in einer Liste. Der erste hat die Nummer 0.", c: "farben[0]" },
  { t: "Funktion", d: "Ein eigener Befehl, den du mit def baust und beliebig oft aufrufst.", c: "def gruss():\n    print(\"Hi\")" },
  { t: "Parameter", d: "Eine Zutat, die du einer Funktion beim Aufruf mitgibst.", c: "def doppelt(x):" },
  { t: "return", d: "Gibt das Ergebnis einer Funktion zurück und beendet sie." },
  { t: "Modul / import", d: "Fertige Werkzeugkisten von anderen. Mit import holst du sie dir.", c: "import random" },
  { t: "Syntaxfehler", d: "Python versteht den Text nicht, zum Beispiel wegen eines vergessenen Doppelpunkts oder einer fehlenden Klammer." },
  { t: "Bug und Debugging", d: "Ein Bug ist ein Fehler im Programm. Debugging heißt: den Fehler suchen und beheben. Das gehört zum Programmieren dazu." },
  { t: "Algorithmus", d: "Eine genaue Schritt für Schritt Anleitung, mit der man ein Problem löst." }
];
