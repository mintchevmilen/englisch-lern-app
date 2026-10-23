/* =====================================================================
   Mathe Mission 5 — Kapitel- und Themenstruktur
   ---------------------------------------------------------------------
   QUELLE DER STRUKTUR:
   Hessischer Lehrplan Mathematik, Gymnasium G9, Jahrgangsstufe 5
   (Themenfelder: Zahlbereiche / Größen / Geometrie).
   Passend zum Schulbuch: Fundamente der Mathematik 5,
   Hessen Gymnasium G9, Cornelsen, ISBN 978-3-06-009267-3.

   >>> DIESE DATEI IST DIE EINZIGE STELLE, DIE ANGEPASST WERDEN MUSS,
   >>> wenn das echte Inhaltsverzeichnis des Schulbuchs vorliegt.
   >>> Reihenfolge und Titel der Kapitel hier ändern -> App übernimmt alles.

   KEINE Inhalte aus dem Schulbuch. Alle Erklärungen, Beispiele und
   Aufgaben sind eigenständig formuliert bzw. werden zur Laufzeit erzeugt.
   ===================================================================== */

var KAPITEL = [
{
  id: 'k1', nr: 1, titel: 'Zahlen & Daten', icon: '🔢', farbe: '#4f7cff',
  themen: [
    { id:'t101', titel:'Stellenwerte & Zahlen lesen',
      ziel:'Ich kann Zahlen in der Stellenwerttafel lesen und schreiben.',
      erklaerung:'Jede Ziffer hat einen **Stellenwert**. Von rechts nach links: Einer (E), Zehner (Z), Hunderter (H), Tausender (T), Zehntausender (ZT), Hunderttausender (HT), Millionen (M).\nBeispiel: In 47 502 steht die 5 an der Hunderter-Stelle, sie ist also 500 wert.',
      beispiel:{ frage:'Welchen Wert hat die Ziffer 6 in der Zahl 3 615 480?',
        schritte:['Stellen von rechts abzählen: 0=E, 8=Z, 4=H, 5=T, 1=ZT, 6=HT, 3=M.',
                  'Die 6 steht an der Hunderttausender-Stelle.',
                  '6 · 100 000 = 600 000'],
        ergebnis:'600 000' } },

    { id:'t102', titel:'Vergleichen & Ordnen',
      ziel:'Ich kann Zahlen vergleichen und der Größe nach ordnen.',
      erklaerung:'Zuerst zählst du die **Stellen**: Mehr Stellen = größere Zahl.\nBei gleich vielen Stellen vergleichst du von links nach rechts Ziffer für Ziffer.\nZeichen: < kleiner als, > größer als, = gleich.',
      beispiel:{ frage:'Setze das richtige Zeichen: 24 809 __ 24 890',
        schritte:['Beide Zahlen haben 5 Stellen.','ZT gleich (2), T gleich (4), H gleich (8).',
                  'Jetzt Zehner: 0 gegen 9 — also ist die erste Zahl kleiner.'],
        ergebnis:'24 809 < 24 890' } },

    { id:'t103', titel:'Zahlenstrahl',
      ziel:'Ich kann Zahlen am Zahlenstrahl ablesen und eintragen.',
      erklaerung:'Auf dem Zahlenstrahl haben alle Striche den **gleichen Abstand**.\nSo gehst du vor: 1) Schrittweite bestimmen (Abstand zwischen zwei beschrifteten Zahlen : Anzahl der Teilstriche). 2) Vom nächsten beschrifteten Wert aus weiterzählen.',
      beispiel:{ frage:'Zwischen 200 und 300 liegen 5 gleiche Abschnitte. Welche Zahl steht am 3. Strich nach 200?',
        schritte:['Schrittweite: 100 : 5 = 20','3 Schritte: 3 · 20 = 60','200 + 60 = 260'],
        ergebnis:'260' } },

    { id:'t104', titel:'Runden',
      ziel:'Ich kann Zahlen auf jede Stelle runden.',
      erklaerung:'Schau auf die **Ziffer rechts** von der Rundungsstelle.\n0, 1, 2, 3, 4 → **abrunden** (Ziffer bleibt)\n5, 6, 7, 8, 9 → **aufrunden** (Ziffer + 1)\nAlle Stellen danach werden zu 0.',
      beispiel:{ frage:'Runde 34 762 auf Tausender.',
        schritte:['Rundungsstelle = Tausender: die 4.','Rechts davon steht die 7.','7 ≥ 5 → aufrunden: aus 34 wird 35 Tausender.'],
        ergebnis:'35 000' } },

    { id:'t105', titel:'Große Zahlen',
      ziel:'Ich kann große Zahlen schreiben, lesen und zerlegen.',
      erklaerung:'Große Zahlen schreibt man in **Dreierblöcken** von rechts: 1 250 000.\nDu kannst jede Zahl in Stellenwerte zerlegen:\n5 208 = 5 · 1000 + 2 · 100 + 0 · 10 + 8 · 1',
      beispiel:{ frage:'Schreibe als Zahl: 4 Millionen, 30 Tausend, 7 Einer',
        schritte:['4 Millionen = 4 000 000','30 Tausend = 30 000','7 Einer = 7','Zusammen: 4 000 000 + 30 000 + 7'],
        ergebnis:'4 030 007' } },

    { id:'t106', titel:'Daten & Diagramme',
      ziel:'Ich kann Werte aus Tabellen und Säulendiagrammen ablesen und auswerten.',
      erklaerung:'In einer **Strichliste** oder Tabelle steht, wie oft etwas vorkommt (die **Häufigkeit**).\nWichtige Fragen: Was ist der größte Wert? Der kleinste? Die Summe? Der Unterschied?',
      beispiel:{ frage:'Mo 12, Di 8, Mi 15, Do 11 verkaufte Brezeln. Wie viele insgesamt, und wie groß ist der Unterschied zwischen bestem und schlechtestem Tag?',
        schritte:['Summe: 12 + 8 + 15 + 11 = 46','Größter Wert: 15 (Mi), kleinster: 8 (Di)','Unterschied: 15 - 8 = 7'],
        ergebnis:'46 Brezeln, Unterschied 7' } }
  ]
},
{
  id: 'k2', nr: 2, titel: 'Rechnen', icon: '➕', farbe: '#2fb673',
  themen: [
    { id:'t201', titel:'Kopfrechnen + und −',
      ziel:'Ich kann im Kopf geschickt addieren und subtrahieren.',
      erklaerung:'Trick 1: **Zerlegen** — 47 + 28 = 47 + 20 + 8 = 67 + 8 = 75.\nTrick 2: **Zum vollen Zehner** — 63 - 19 = 63 - 20 + 1 = 44.\nFachwörter: Summand + Summand = **Summe**; Minuend - Subtrahend = **Differenz**.',
      beispiel:{ frage:'Berechne im Kopf: 86 - 39',
        schritte:['39 ist fast 40.','86 - 40 = 46','Ich habe 1 zu viel abgezogen: 46 + 1 = 47'],
        ergebnis:'47' } },

    { id:'t202', titel:'Schriftlich + und −',
      ziel:'Ich kann schriftlich addieren und subtrahieren, auch mit Übertrag.',
      erklaerung:'Stellen **genau untereinander** schreiben (Einer unter Einer).\nVon rechts nach links rechnen.\nBeim Addieren: Ist das Ergebnis größer als 9, kommt ein **Übertrag** in die nächste Spalte.\nBeim Subtrahieren: Reicht die Ziffer nicht, borgst du dir 10 aus der nächsten Stelle.',
      beispiel:{ frage:'Berechne schriftlich: 3 487 + 2 659',
        schritte:['E: 7 + 9 = 16 → 6 hin, 1 Übertrag','Z: 8 + 5 + 1 = 14 → 4 hin, 1 Übertrag','H: 4 + 6 + 1 = 11 → 1 hin, 1 Übertrag','T: 3 + 2 + 1 = 6'],
        ergebnis:'6 146' } },

    { id:'t203', titel:'Kopfrechnen · und :',
      ziel:'Ich kann im Kopf multiplizieren und dividieren.',
      erklaerung:'Mit 10, 100, 1000 multiplizieren: **Nullen anhängen**. 34 · 100 = 3400.\nDividieren durch 10, 100: **Nullen streichen**. 4500 : 100 = 45.\nFachwörter: Faktor · Faktor = **Produkt**; Dividend : Divisor = **Quotient**.',
      beispiel:{ frage:'Berechne: 25 · 12',
        schritte:['12 zerlegen: 12 = 10 + 2','25 · 10 = 250','25 · 2 = 50','250 + 50 = 300'],
        ergebnis:'300' } },

    { id:'t204', titel:'Schriftlich multiplizieren',
      ziel:'Ich kann schriftlich mit mehrstelligen Zahlen multiplizieren.',
      erklaerung:'Du multiplizierst die erste Zahl **nacheinander mit jeder Ziffer** des zweiten Faktors.\nJede neue Zeile rückt um **eine Stelle nach links**.\nZum Schluss alle Zeilen addieren.',
      beispiel:{ frage:'Berechne schriftlich: 243 · 26',
        schritte:['243 · 6 = 1 458','243 · 20 = 4 860','1 458 + 4 860 = 6 318'],
        ergebnis:'6 318' } },

    { id:'t205', titel:'Schriftlich dividieren',
      ziel:'Ich kann schriftlich dividieren, auch mit Rest.',
      erklaerung:'Von **links** anfangen: Wie oft passt der Divisor hinein?\nErgebnis notieren, zurückmultiplizieren, subtrahieren, nächste Ziffer herunterholen.\nBleibt am Ende etwas übrig, ist das der **Rest**.',
      beispiel:{ frage:'Berechne: 947 : 4',
        schritte:['9 : 4 = 2 Rest 1 → 2 notieren','Rest 1, nächste Ziffer 4 → 14 : 4 = 3 Rest 2','Rest 2, nächste Ziffer 7 → 27 : 4 = 6 Rest 3'],
        ergebnis:'236 Rest 3' } },

    { id:'t206', titel:'Punkt vor Strich & Klammern',
      ziel:'Ich kenne die Reihenfolge der Rechenarten.',
      erklaerung:'Regeln in dieser Reihenfolge:\n1. **Klammern zuerst**\n2. **Potenzen**\n3. **Punkt vor Strich** (· und : vor + und −)\n4. Sonst von links nach rechts',
      beispiel:{ frage:'Berechne: 3 + 7 · 4 - (10 - 6)',
        schritte:['Klammer: 10 - 6 = 4','Punktrechnung: 7 · 4 = 28','3 + 28 - 4','31 - 4 = 27'],
        ergebnis:'27' } },

    { id:'t207', titel:'Rechengesetze',
      ziel:'Ich kann Rechengesetze zum geschickten Rechnen nutzen.',
      erklaerung:'**Kommutativgesetz** (Vertauschen): a + b = b + a und a · b = b · a\n**Assoziativgesetz** (Umklammern): (a + b) + c = a + (b + c)\n**Distributivgesetz** (Ausmultiplizieren): a · (b + c) = a · b + a · c',
      beispiel:{ frage:'Rechne geschickt: 25 · 17 · 4',
        schritte:['Vertauschen: 25 · 4 · 17','25 · 4 = 100','100 · 17 = 1 700'],
        ergebnis:'1 700' } },

    { id:'t208', titel:'Überschlag & Schätzen',
      ziel:'Ich kann Ergebnisse überschlagen und prüfen.',
      erklaerung:'Beim **Überschlag** rundest du zuerst und rechnest dann mit den einfachen Zahlen.\nSo merkst du schnell, ob ein Ergebnis überhaupt stimmen kann.',
      beispiel:{ frage:'Überschlage: 412 · 19',
        schritte:['412 ≈ 400','19 ≈ 20','400 · 20 = 8 000'],
        ergebnis:'ungefähr 8 000' } },

    { id:'t209', titel:'Teiler, Vielfache, Primzahlen',
      ziel:'Ich kann Teiler und Vielfache bestimmen und Primzahlen erkennen.',
      erklaerung:'**Teiler** von 12: 1, 2, 3, 4, 6, 12 (Division geht ohne Rest auf).\n**Vielfache** von 4: 4, 8, 12, 16, ...\nEine **Primzahl** hat genau zwei Teiler: 1 und sich selbst (2, 3, 5, 7, 11, 13, ...).\nTeilbarkeitsregeln: durch 2 wenn die letzte Ziffer gerade ist; durch 5 wenn sie auf 0 oder 5 endet; durch 3 wenn die **Quersumme** durch 3 teilbar ist.',
      beispiel:{ frage:'Ist 234 durch 3 teilbar?',
        schritte:['Quersumme bilden: 2 + 3 + 4 = 9','9 : 3 = 3 geht auf'],
        ergebnis:'Ja, 234 ist durch 3 teilbar.' } },

    { id:'t210', titel:'Potenzen & Quadratzahlen',
      ziel:'Ich kann Potenzen schreiben und berechnen.',
      erklaerung:'Eine **Potenz** ist eine kurze Schreibweise für eine Malaufgabe mit gleichen Faktoren:\n5 · 5 · 5 = 5^{3} (sprich: 5 hoch 3). Die 5 ist die **Basis**, die 3 der **Exponent**.\nQuadratzahlen: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.',
      beispiel:{ frage:'Berechne 2^{4}',
        schritte:['2^{4} bedeutet 2 · 2 · 2 · 2','2 · 2 = 4','4 · 2 = 8','8 · 2 = 16'],
        ergebnis:'16' } },

    { id:'t211', titel:'Einfache Gleichungen',
      ziel:'Ich kann einfache Gleichungen durch Umkehren lösen.',
      erklaerung:'Eine Gleichung ist wie eine **Waage** — beide Seiten sind gleich schwer.\nMit der **Umkehraufgabe** findest du die gesuchte Zahl:\nx + 7 = 20 → x = 20 - 7\nx · 6 = 42 → x = 42 : 6',
      beispiel:{ frage:'Löse: 4 · x + 5 = 33',
        schritte:['Zuerst die 5 rückgängig: 33 - 5 = 28','Also gilt 4 · x = 28','Jetzt durch 4 teilen: 28 : 4 = 7','Probe: 4 · 7 + 5 = 33 ✓'],
        ergebnis:'x = 7' } },

    { id:'t212', titel:'Sachaufgaben',
      ziel:'Ich kann aus einem Text die richtige Rechnung finden.',
      erklaerung:'So gehst du vor:\n1. Text lesen, **gesucht** und **gegeben** markieren\n2. Rechnung aufschreiben\n3. Rechnen\n4. **Antwortsatz** mit Einheit\nSignalwörter: "insgesamt" → +, "Rest / weniger" → −, "je / pro / mal" → ·, "aufteilen / gleichmäßig" → :',
      beispiel:{ frage:'Ein Bus hat 48 Sitze. Für 300 Kinder — wie viele Busse braucht man?',
        schritte:['Gesucht: Anzahl Busse. Gegeben: 300 Kinder, 48 Sitze.','300 : 48 = 6 Rest 12','6 Busse sind voll, 12 Kinder haben noch keinen Platz → 1 Bus mehr'],
        ergebnis:'7 Busse' } }
  ]
},
{
  id: 'k3', nr: 3, titel: 'Größen', icon: '📏', farbe: '#f0972a',
  themen: [
    { id:'t301', titel:'Längen',
      ziel:'Ich kann Längen umrechnen und mit ihnen rechnen.',
      erklaerung:'1 km = 1000 m | 1 m = 10 dm | 1 dm = 10 cm | 1 cm = 10 mm\nAlso: 1 m = 100 cm = 1000 mm\nIn eine **kleinere** Einheit → mal nehmen. In eine **größere** Einheit → teilen.',
      beispiel:{ frage:'Wie viele Zentimeter sind 3 m 45 cm?',
        schritte:['3 m = 3 · 100 cm = 300 cm','300 cm + 45 cm'],
        ergebnis:'345 cm' } },

    { id:'t302', titel:'Massen (Gewichte)',
      ziel:'Ich kann Massen umrechnen und mit ihnen rechnen.',
      erklaerung:'1 t = 1000 kg | 1 kg = 1000 g | 1 g = 1000 mg\nAuch hier gilt: kleinere Einheit → mal 1000, größere Einheit → geteilt durch 1000.',
      beispiel:{ frage:'Schreibe 2 kg 350 g in Gramm.',
        schritte:['2 kg = 2 · 1000 g = 2000 g','2000 g + 350 g'],
        ergebnis:'2350 g' } },

    { id:'t303', titel:'Zeit & Zeitspannen',
      ziel:'Ich kann Zeitspannen berechnen.',
      erklaerung:'1 d = 24 h | 1 h = 60 min | 1 min = 60 s\nAchtung: Zeit rechnet man **nicht im Zehnersystem**! 1 h 70 min gibt es nicht — das sind 2 h 10 min.\nZeitspanne = Endzeit − Startzeit.',
      beispiel:{ frage:'Ein Film startet um 17:45 Uhr und dauert 95 min. Wann ist er zu Ende?',
        schritte:['95 min = 1 h 35 min','17:45 + 1 h = 18:45','18:45 + 35 min = 19:20'],
        ergebnis:'19:20 Uhr' } },

    { id:'t304', titel:'Geld & Kommaschreibweise',
      ziel:'Ich kann mit Euro und Cent rechnen.',
      erklaerung:'1 € = 100 ct\nIn der Kommaschreibweise stehen **immer zwei Stellen** hinter dem Komma: 3,05 € sind 3 Euro und 5 Cent.\nBeim Rechnen: Komma unter Komma!',
      beispiel:{ frage:'Wie viel Cent sind 7,40 €?',
        schritte:['7 € = 700 ct','0,40 € = 40 ct','700 + 40'],
        ergebnis:'740 ct' } },

    { id:'t305', titel:'Mit Größen rechnen',
      ziel:'Ich kann Größen addieren, subtrahieren und vervielfachen.',
      erklaerung:'**Erst gleichnamig machen** — beide Größen in dieselbe Einheit umrechnen. Dann rechnen.\nFalsch: 2 m + 30 cm = 32. Richtig: 200 cm + 30 cm = 230 cm.',
      beispiel:{ frage:'Berechne: 1 kg 200 g + 850 g',
        schritte:['1 kg 200 g = 1200 g','1200 g + 850 g = 2050 g','2050 g = 2 kg 50 g'],
        ergebnis:'2050 g = 2 kg 50 g' } },

    { id:'t306', titel:'Sachaufgaben mit Größen',
      ziel:'Ich kann Sachaufgaben mit Größen lösen.',
      erklaerung:'Wie bei allen Sachaufgaben: gegeben/gesucht, Rechnung, Ergebnis, Antwort.\nZusätzlich wichtig: **Einheiten zuerst angleichen** und am Ende die Einheit sinnvoll wählen (2500 g lieber als 2 kg 500 g angeben).',
      beispiel:{ frage:'6 Flaschen zu je 750 ml — wie viele Liter sind das? (1 l = 1000 ml)',
        schritte:['6 · 750 ml = 4500 ml','4500 ml : 1000 = 4,5 l'],
        ergebnis:'4,5 l' } }
  ]
},
{
  id: 'k4', nr: 4, titel: 'Geometrie: Figuren', icon: '📐', farbe: '#8b5cf6',
  themen: [
    { id:'t401', titel:'Punkt, Strecke, Gerade',
      ziel:'Ich kenne die geometrischen Grundbegriffe.',
      erklaerung:'**Punkt**: Ort, mit Großbuchstaben benannt (A, B, ...).\n**Strecke** [AB]: hat zwei Endpunkte, also eine Länge.\n**Gerade** AB: geht auf beiden Seiten unendlich weiter.\n**Halbgerade / Strahl** [AB: hat einen Anfangspunkt und geht in eine Richtung weiter.',
      beispiel:{ frage:'Welche Linie hat einen Anfang, aber kein Ende?',
        schritte:['Strecke: Anfang und Ende → nein','Gerade: kein Anfang, kein Ende → nein','Halbgerade: genau ein Endpunkt → passt'],
        ergebnis:'die Halbgerade (der Strahl)' } },

    { id:'t402', titel:'Senkrecht & parallel',
      ziel:'Ich erkenne senkrechte und parallele Linien.',
      erklaerung:'**Parallel** (g ∥ h): die Linien haben überall den gleichen Abstand und schneiden sich nie.\n**Senkrecht** (g ⊥ h): die Linien treffen sich im rechten Winkel (90°).\nBeim Rechteck sind gegenüberliegende Seiten parallel und benachbarte Seiten senkrecht.',
      beispiel:{ frage:'Wie stehen zwei benachbarte Seiten eines Quadrats zueinander?',
        schritte:['Ein Quadrat hat vier rechte Winkel.','Benachbarte Seiten treffen sich in einem rechten Winkel.'],
        ergebnis:'senkrecht zueinander' } },

    { id:'t403', titel:'Koordinatensystem',
      ziel:'Ich kann Punkte im Koordinatensystem eintragen und ablesen.',
      erklaerung:'Ein Punkt wird als P(x|y) angegeben.\n**Zuerst nach rechts** (x-Achse), **dann nach oben** (y-Achse).\nMerksatz: erst der Flur, dann die Treppe.',
      beispiel:{ frage:'Ein Rechteck hat die Ecken A(2|1), B(7|1), C(7|4). Wo liegt D?',
        schritte:['D liegt über A und links von C.','x-Wert wie A: 2','y-Wert wie C: 4'],
        ergebnis:'D(2|4)' } },

    { id:'t404', titel:'Vierecke',
      ziel:'Ich kann Vierecke an ihren Eigenschaften erkennen.',
      erklaerung:'**Quadrat**: 4 gleich lange Seiten, 4 rechte Winkel.\n**Rechteck**: gegenüberliegende Seiten gleich lang, 4 rechte Winkel.\n**Parallelogramm**: gegenüberliegende Seiten parallel und gleich lang.\n**Raute**: 4 gleich lange Seiten, aber nicht unbedingt rechte Winkel.\n**Trapez**: mindestens ein Paar paralleler Seiten.',
      beispiel:{ frage:'Welches Viereck hat 4 gleich lange Seiten, aber keine rechten Winkel?',
        schritte:['Quadrat hat rechte Winkel → nein','Raute: 4 gleiche Seiten, Winkel beliebig → passt'],
        ergebnis:'die Raute' } },

    { id:'t405', titel:'Achsensymmetrie',
      ziel:'Ich erkenne Symmetrieachsen von Figuren.',
      erklaerung:'Eine Figur ist **achsensymmetrisch**, wenn man sie an einer Linie so falten kann, dass beide Hälften genau aufeinander liegen. Diese Linie heißt **Symmetrieachse**.\nQuadrat: 4 Achsen | Rechteck: 2 | Raute: 2 | Kreis: unendlich viele | Parallelogramm (schief): 0',
      beispiel:{ frage:'Wie viele Symmetrieachsen hat ein Rechteck, das kein Quadrat ist?',
        schritte:['Waagerechte Mittellinie → passt','Senkrechte Mittellinie → passt','Diagonalen passen beim Rechteck nicht'],
        ergebnis:'2 Achsen' } },

    { id:'t406', titel:'Kreis',
      ziel:'Ich kenne Mittelpunkt, Radius und Durchmesser.',
      erklaerung:'Alle Punkte eines Kreises haben den gleichen Abstand zum **Mittelpunkt M**.\nDieser Abstand ist der **Radius r**.\nDer **Durchmesser d** geht durch den Mittelpunkt: d = 2 · r, also r = d : 2.',
      beispiel:{ frage:'Ein Kreis hat den Durchmesser 18 cm. Wie groß ist der Radius?',
        schritte:['r = d : 2','18 cm : 2'],
        ergebnis:'9 cm' } }
  ]
},
{
  id: 'k5', nr: 5, titel: 'Flächen', icon: '🟦', farbe: '#e0567a',
  themen: [
    { id:'t501', titel:'Flächeneinheiten',
      ziel:'Ich kann Flächeneinheiten umrechnen.',
      erklaerung:'Bei Flächen ist der Umrechnungsfaktor **100** (nicht 10!):\n1 cm^{2} = 100 mm^{2} | 1 dm^{2} = 100 cm^{2} | 1 m^{2} = 100 dm^{2}\n1 a = 100 m^{2} | 1 ha = 100 a | 1 km^{2} = 100 ha\nWarum 100? Weil eine Fläche zwei Richtungen hat: 10 · 10 = 100.',
      beispiel:{ frage:'Wie viele cm^{2} sind 4 dm^{2}?',
        schritte:['1 dm^{2} = 100 cm^{2}','4 · 100'],
        ergebnis:'400 cm^{2}' } },

    { id:'t502', titel:'Umfang von Rechteck & Quadrat',
      ziel:'Ich kann den Umfang berechnen.',
      erklaerung:'Der **Umfang** ist die Länge einmal rund um die Figur.\nRechteck: u = 2 · a + 2 · b (oder u = 2 · (a + b))\nQuadrat: u = 4 · a',
      beispiel:{ frage:'Ein Rechteck ist 12 cm lang und 7 cm breit. Wie groß ist der Umfang?',
        schritte:['u = 2 · a + 2 · b','u = 2 · 12 cm + 2 · 7 cm','u = 24 cm + 14 cm'],
        ergebnis:'38 cm' } },

    { id:'t503', titel:'Flächeninhalt von Rechteck & Quadrat',
      ziel:'Ich kann den Flächeninhalt berechnen.',
      erklaerung:'Der **Flächeninhalt** sagt, wie viele Einheitsquadrate hineinpassen.\nRechteck: A = a · b\nQuadrat: A = a · a = a^{2}\nDie Einheit bekommt immer eine kleine 2: cm^{2}, m^{2}, ...',
      beispiel:{ frage:'Ein Rechteck ist 9 m lang und 6 m breit. Wie groß ist der Flächeninhalt?',
        schritte:['A = a · b','A = 9 m · 6 m'],
        ergebnis:'54 m^{2}' } },

    { id:'t504', titel:'Zusammengesetzte Flächen',
      ziel:'Ich kann Flächen zerlegen und ihren Inhalt berechnen.',
      erklaerung:'Zerlege die Figur in **Rechtecke**, berechne jede Teilfläche und addiere sie.\nOder: Umschließendes großes Rechteck berechnen und die fehlende Ecke abziehen.',
      beispiel:{ frage:'Ein L-Stück: großes Rechteck 10 cm · 8 cm, davon fehlt eine Ecke von 4 cm · 3 cm. Wie groß ist die Fläche?',
        schritte:['Großes Rechteck: 10 · 8 = 80 cm^{2}','Fehlende Ecke: 4 · 3 = 12 cm^{2}','80 - 12'],
        ergebnis:'68 cm^{2}' } }
  ]
},
{
  id: 'k6', nr: 6, titel: 'Körper', icon: '🧊', farbe: '#0ea5a5',
  themen: [
    { id:'t601', titel:'Körper erkennen',
      ziel:'Ich kenne die wichtigsten Körper und ihre Eigenschaften.',
      erklaerung:'**Würfel**: 6 gleiche Quadrate, 12 Kanten, 8 Ecken.\n**Quader**: 6 Rechtecke, 12 Kanten, 8 Ecken.\n**Zylinder**: 2 Kreise + Mantel, keine Ecken.\n**Kegel**: 1 Kreis + Spitze.\n**Kugel**: keine Ecke, keine Kante.\n**Pyramide**: eine Grundfläche und dreieckige Seitenflächen, die in einer Spitze zusammenlaufen.',
      beispiel:{ frage:'Wie viele Kanten hat ein Quader?',
        schritte:['4 Kanten unten','4 Kanten oben','4 senkrechte Kanten','4 + 4 + 4'],
        ergebnis:'12 Kanten' } },

    { id:'t602', titel:'Netze & Schrägbild',
      ziel:'Ich kann Körpernetze erkennen und zuordnen.',
      erklaerung:'Ein **Netz** entsteht, wenn man einen Körper an den Kanten aufschneidet und flach ausbreitet.\nEin Würfelnetz besteht immer aus **6 Quadraten** — aber nicht jede Anordnung von 6 Quadraten ist ein gültiges Netz.\nIm **Schrägbild** zeichnet man nicht sichtbare Kanten gestrichelt.',
      beispiel:{ frage:'Aus wie vielen Rechtecken besteht das Netz eines Quaders?',
        schritte:['Ein Quader hat 6 Flächen.','Jede Fläche wird im Netz einmal gezeichnet.'],
        ergebnis:'6 Rechtecke' } },

    { id:'t603', titel:'Volumeneinheiten',
      ziel:'Ich kann Volumeneinheiten umrechnen.',
      erklaerung:'Bei Volumen ist der Faktor **1000** (drei Richtungen: 10 · 10 · 10):\n1 cm^{3} = 1000 mm^{3} | 1 dm^{3} = 1000 cm^{3} | 1 m^{3} = 1000 dm^{3}\nHohlmaße: 1 l = 1 dm^{3} = 1000 ml, und 1 ml = 1 cm^{3}',
      beispiel:{ frage:'Wie viele cm^{3} sind 3 dm^{3}?',
        schritte:['1 dm^{3} = 1000 cm^{3}','3 · 1000'],
        ergebnis:'3000 cm^{3}' } },

    { id:'t604', titel:'Volumen von Quader & Würfel',
      ziel:'Ich kann das Volumen berechnen.',
      erklaerung:'Quader: V = a · b · c\nWürfel: V = a · a · a = a^{3}\nDie Einheit bekommt eine kleine 3: cm^{3}, m^{3}, ...\nWichtig: alle Kanten in derselben Einheit!',
      beispiel:{ frage:'Ein Quader ist 5 cm · 4 cm · 3 cm groß. Welches Volumen hat er?',
        schritte:['V = a · b · c','V = 5 · 4 · 3','5 · 4 = 20; 20 · 3 = 60'],
        ergebnis:'60 cm^{3}' } },

    { id:'t605', titel:'Oberfläche von Quader & Würfel',
      ziel:'Ich kann die Oberfläche berechnen.',
      erklaerung:'Die **Oberfläche** ist die Summe aller Außenflächen.\nQuader: O = 2 · (a · b + a · c + b · c)\nWürfel: O = 6 · a · a\nTipp: Gegenüberliegende Flächen sind immer gleich groß — deshalb die 2 bzw. die 6.',
      beispiel:{ frage:'Ein Würfel hat die Kantenlänge 4 cm. Wie groß ist die Oberfläche?',
        schritte:['Eine Fläche: 4 cm · 4 cm = 16 cm^{2}','Ein Würfel hat 6 Flächen','6 · 16'],
        ergebnis:'96 cm^{2}' } }
  ]
}
];

/* Flache Themenliste + Lookup */
var THEMEN = [];
var THEMA_BY_ID = {};
var KAPITEL_BY_THEMA = {};
(function(){
  for (var i=0;i<KAPITEL.length;i++){
    var k = KAPITEL[i];
    for (var j=0;j<k.themen.length;j++){
      var t = k.themen[j];
      t.kapitel = k.id; t.kapitelTitel = k.titel; t.farbe = k.farbe; t.icon = k.icon;
      THEMEN.push(t); THEMA_BY_ID[t.id] = t; KAPITEL_BY_THEMA[t.id] = k;
    }
  }
})();
