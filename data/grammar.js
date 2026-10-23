/* =============================================================
   data/grammar.js  –  Grammatikbereiche
   -------------------------------------------------------------
   Stand: an das echte Grammar-and-Practice-Verzeichnis (GAP1-21)
   des Schulbuchs angeglichen (Fotos vom 09.2026). Jeder Bereich
   entspricht so weit wie möglich einem GAP-Kapitel; die Nummer
   steht als Kommentar über dem Eintrag.

   Jeder Bereich hat drei Stufen:
     learn      = kurze deutsche Erklaerung + Beispiele
     practice   = einfache Aufgaben
     challenge  = schwierigere Aufgaben

   AUFGABENTYPEN (t):
     "mc"    Multiple Choice   { t:"mc",  q:"She ___ nice.", opts:["am","is","are"], a:1, why:"..." }
     "gap"   Luecke tippen     { t:"gap", q:"She ___ nice.", a:"is", alt:["s"], why:"..." }
     "order" Wortstellung      { t:"order", words:["She","is","nice"], a:"She is nice.", why:"..." }
     "trans" Uebersetzen       { t:"trans", de:"Sie ist nett.", a:"She is nice.", alt:["..."], why:"..." }
   a = Index der richtigen Antwort (mc) bzw. Loesungstext.
   why = Erklaerung, die bei einer falschen Antwort erscheint. IMMER ausfuellen!

   NEUEN GRAMMATIKBEREICH ERGAENZEN:
   1. Hier einen neuen Eintrag anlegen (eindeutige id, z.B. g_will)
   2. Die id in data/units.js in das Feld "grammar" der Unit eintragen.
   ============================================================= */
(function (w) {
  var D = w.DATA = w.DATA || {};

  D.grammar = {

  /* ================= UNIT 1 – GAP1, GAP2, GAP3, GAP4, GAP5, GAP6, GAP7 ================= */
  g_be:{
    unit:"u1", title:"to be – am / is / are", titleDe:"Die Formen von to be",
    learn:{
      intro:"to be heisst sein. Es hat drei Formen im simple present.",
      rules:[
        {en:"I am", de:"ich bin"},
        {en:"you are / we are / they are", de:"du bist / wir sind / sie sind"},
        {en:"he is / she is / it is", de:"er ist / sie ist / es ist"},
        {en:"I am not (I'm not)", de:"ich bin nicht"},
        {en:"Are you ready?", de:"Bist du fertig?"}
      ],
      note:"Verneinung: einfach not dahinter - She is not late."
    },
    practice:[
      {t:"mc", q:"We ___ in class 5b.", opts:["am","is","are"], a:2, why:"we, you und they bekommen immer are."},
      {t:"mc", q:"The book ___ on my desk.", opts:["am","is","are"], a:1, why:"The book ist Einzahl - also is."},
      {t:"mc", q:"The books ___ on my desk.", opts:["am","is","are"], a:2, why:"books ist Mehrzahl - also are."},
      {t:"gap", q:"I ___ in the classroom.", a:"am", why:"Bei I steht immer am."},
      {t:"gap", q:"They ___ my friends.", a:"are", why:"they bekommt are."},
      {t:"mc", q:"___ you late again?", opts:["Am","Is","Are"], a:2, why:"In der Frage steht die be-Form vorne: Are you...?"}
    ],
    challenge:[
      {t:"order", words:["Are","you","in","class","5b","?"], a:"Are you in class 5b?", why:"Frage mit to be: erst are, dann you."},
      {t:"trans", de:"Wir sind nicht zu spät.", a:"We are not late.", alt:["We aren't late.","We're not late."], why:"we + are + not."},
      {t:"gap", q:"My teacher ___ very nice.", a:"is", why:"My teacher ist Einzahl - also is."},
      {t:"trans", de:"Sie sind meine Freunde.", a:"They are my friends.", alt:["They're my friends."], why:"they + are."},
      {t:"mc", q:"Sarah and Tom ___ in my class.", opts:["is","are","am"], a:1, why:"Zwei Personen = Mehrzahl - also are."}
    ]
  },

  g_pronouns:{
    unit:"u1", title:"Personal pronouns", titleDe:"Personalpronomen (I, you, he ...)",
    learn:{
      intro:"Personalpronomen ersetzen einen Namen oder ein Nomen.",
      rules:[
        {en:"I", de:"ich"},{en:"you", de:"du / ihr / Sie"},{en:"he", de:"er (Junge, Mann)"},
        {en:"she", de:"sie (Mädchen, Frau)"},{en:"it", de:"es (Ding oder Tier)"},
        {en:"we", de:"wir"},{en:"they", de:"sie (Mehrzahl)"}
      ],
      note:"Im Englischen wird I immer gross geschrieben - auch mitten im Satz."
    },
    practice:[
      {t:"mc", q:"Tom is my friend. ___ is eleven.", opts:["He","She","It"], a:0, why:"Tom ist ein Junge - also he."},
      {t:"mc", q:"Anna has a bike. ___ is red.", opts:["He","She","It"], a:2, why:"Das Fahrrad ist ein Ding - also it."},
      {t:"mc", q:"Anna has a bike. ___ likes cycling.", opts:["He","She","It"], a:1, why:"Anna ist ein Mädchen - also she."},
      {t:"gap", q:"Ben and I are friends. ___ play football.", a:"We", why:"Ben und ich = wir - also We."},
      {t:"mc", q:"My parents work a lot. ___ are tired.", opts:["He","We","They"], a:2, why:"Mehrere Personen - also they."}
    ],
    challenge:[
      {t:"gap", q:"The dog is old. ___ sleeps a lot.", a:"It", why:"Ein Tier ohne Namen wird meist mit it bezeichnet."},
      {t:"trans", de:"Sie ist meine Lehrerin.", a:"She is my teacher.", alt:["She's my teacher."], why:"she = sie (eine Frau)."},
      {t:"order", words:["They","are","in","the","classroom"], a:"They are in the classroom.", why:"Erst das Pronomen, dann die be-Form."},
      {t:"mc", q:"Mrs Miller is our teacher. ___ is very funny.", opts:["He","She","It"], a:1, why:"Mrs Miller ist eine Frau - also she."}
    ]
  },

  g_article:{
    unit:"u1", title:"a / an", titleDe:"Der unbestimmte Artikel",
    learn:{
      intro:"a und an heissen beide ein / eine. Welches du nimmst, haengt vom KLANG des naechsten Wortes ab.",
      rules:[
        {en:"a book, a pen, a school", de:"vor Konsonanten-Klang"},
        {en:"an apple, an egg, an orange", de:"vor Vokal-Klang (a, e, i, o, u)"},
        {en:"an hour", de:"h ist stumm - klingt wie our"},
        {en:"a European city", de:"European klingt wie ju-ropean"}
      ],
      note:"Merke: Es geht um den Klang, nicht um den Buchstaben."
    },
    practice:[
      {t:"mc", q:"I have ___ pen.", opts:["a","an"], a:0, why:"pen beginnt mit einem Konsonanten-Klang - also a."},
      {t:"mc", q:"She eats ___ apple.", opts:["a","an"], a:1, why:"apple beginnt mit einem Vokal-Klang - also an."},
      {t:"mc", q:"This is ___ exercise book.", opts:["a","an"], a:1, why:"exercise beginnt mit e - also an."},
      {t:"gap", q:"He is ___ teacher.", a:"a", why:"teacher beginnt mit t - also a."},
      {t:"gap", q:"I want ___ egg.", a:"an", why:"egg beginnt mit e - also an."}
    ],
    challenge:[
      {t:"mc", q:"We wait ___ hour.", opts:["a","an"], a:1, why:"Das h in hour ist stumm - es klingt wie our, deshalb an."},
      {t:"mc", q:"He is ___ university student.", opts:["a","an"], a:0, why:"university klingt wie ju-niversity - deshalb a."},
      {t:"gap", q:"There is ___ old bike in the garden.", a:"an", why:"old beginnt mit o - also an."},
      {t:"trans", de:"Das ist ein Apfel.", a:"This is an apple.", alt:["That is an apple.","It is an apple."], why:"apple beginnt mit Vokal - an apple."}
    ]
  },

  g_there:{
    unit:"u1", title:"there is / there are", titleDe:"Es gibt ...",
    learn:{
      intro:"Mit there is und there are sagst du, dass etwas da ist.",
      rules:[
        {en:"There is a desk.", de:"Es gibt / Da ist ein Pult. (Einzahl)"},
        {en:"There are two windows.", de:"Es gibt zwei Fenster. (Mehrzahl)"},
        {en:"There is not a board.", de:"Es gibt keine Tafel."},
        {en:"Is there a computer?", de:"Gibt es einen Computer?"},
        {en:"Are there any chairs?", de:"Gibt es Stühle?"}
      ],
      note:"Einzahl -> there is. Mehrzahl -> there are."
    },
    practice:[
      {t:"mc", q:"___ a big window in our classroom.", opts:["There is","There are"], a:0, why:"a big window ist Einzahl - also there is."},
      {t:"mc", q:"___ twenty pupils in my class.", opts:["There is","There are"], a:1, why:"twenty pupils ist Mehrzahl - also there are."},
      {t:"gap", q:"There ___ three books on the desk.", a:"are", why:"three books ist Mehrzahl - also are."},
      {t:"gap", q:"There ___ a cat in the garden.", a:"is", why:"a cat ist Einzahl - also is."},
      {t:"mc", q:"___ there a teacher in the room?", opts:["Is","Are","Am"], a:0, why:"a teacher ist Einzahl - also Is there ...?"}
    ],
    challenge:[
      {t:"order", words:["There","are","two","doors","in","the","room"], a:"There are two doors in the room.", why:"There are + Mehrzahl + Ortsangabe."},
      {t:"trans", de:"Es gibt einen Stuhl im Zimmer.", a:"There is a chair in the room.", alt:["There's a chair in the room."], why:"Einzahl - there is a chair."},
      {t:"gap", q:"___ there any pens in your pencil case?", a:"Are", why:"pens ist Mehrzahl - also Are there ...?"},
      {t:"trans", de:"Es gibt keine Tafel.", a:"There is no board.", alt:["There isn't a board.","There is not a board."], why:"Verneinung: there is no ... oder there isn't a ..."}
    ]
  },

  g_can:{
    unit:"u1", title:"can / can't", titleDe:"können und nicht können",
    learn:{
      intro:"can heisst koennen. Nach can steht das Verb immer in der Grundform - ohne to und ohne -s.",
      rules:[
        {en:"I can swim.", de:"Ich kann schwimmen."},
        {en:"She can sing.", de:"Sie kann singen. (kein -s bei can!)"},
        {en:"I cannot / can't swim.", de:"Ich kann nicht schwimmen."},
        {en:"Can you help me?", de:"Kannst du mir helfen?"},
        {en:"Yes, I can. / No, I can't.", de:"Ja. / Nein."}
      ],
      note:"Nach can NIE to: She can swim - nicht She can to swim."
    },
    practice:[
      {t:"mc", q:"She can ___ very well.", opts:["sings","sing","to sing"], a:1, why:"Nach can steht die Grundform ohne -s und ohne to."},
      {t:"mc", q:"___ you help me, please?", opts:["Can","Do","Are"], a:0, why:"Frage mit can: Can you ...?"},
      {t:"gap", q:"I ___ not swim yet.", a:"can", why:"Verneinung: can not / cannot / can't."},
      {t:"mc", q:"He ___ play the guitar.", opts:["cans","can","can to"], a:1, why:"can hat nie ein -s, auch nicht bei he/she/it."},
      {t:"trans", de:"Ich kann Fußball spielen.", a:"I can play football.", why:"can + Grundform play."}
    ],
    challenge:[
      {t:"order", words:["Can","you","open","the","window","?"], a:"Can you open the window?", why:"Frage: Can + Person + Grundform."},
      {t:"trans", de:"Sie kann nicht schwimmen.", a:"She cannot swim.", alt:["She can't swim.","She can not swim."], why:"can't = cannot. Danach die Grundform."},
      {t:"gap", q:"Tom ___ ride a bike, but he can't swim.", a:"can", why:"Der Gegensatz mit but zeigt: hier steht die positive Form can."},
      {t:"mc", q:"We can't ___ the board from here.", opts:["to see","seeing","see"], a:2, why:"Nach can / can't steht immer die Grundform."}
    ]
  },

  g_qwords:{
    unit:"u1", title:"Question words", titleDe:"Fragewörter",
    learn:{
      intro:"Mit Fragewoertern fragst du nach einer Information - nicht nur nach ja oder nein.",
      rules:[
        {en:"What ...?", de:"Was ...?"},{en:"Who ...?", de:"Wer ...?"},
        {en:"Where ...?", de:"Wo / Wohin ...?"},{en:"When ...?", de:"Wann ...?"},
        {en:"How old ...?", de:"Wie alt ...?"},{en:"How many ...?", de:"Wie viele ...?"},
        {en:"Why ...?", de:"Warum ...?"}
      ],
      note:"Das Fragewort steht immer ganz vorne."
    },
    practice:[
      {t:"mc", q:"___ is your name?", opts:["Who","What","Where"], a:1, why:"Nach dem Namen fragt man mit What is your name?"},
      {t:"mc", q:"___ old are you?", opts:["How","What","When"], a:0, why:"Nach dem Alter fragt man mit How old ...?"},
      {t:"mc", q:"___ do you live?", opts:["When","Where","Why"], a:1, why:"Nach dem Ort fragt man mit Where."},
      {t:"gap", q:"___ is your birthday? - In May.", a:"When", why:"Nach der Zeit fragt man mit When."},
      {t:"mc", q:"___ is your teacher?", opts:["What","Who","Where"], a:1, why:"Nach einer Person fragt man mit Who."}
    ],
    challenge:[
      {t:"gap", q:"___ many pupils are in your class?", a:"How", why:"How many ...? = Wie viele ...?"},
      {t:"order", words:["Where","is","my","pencil","case","?"], a:"Where is my pencil case?", why:"Fragewort, dann is, dann der Rest."},
      {t:"trans", de:"Wann beginnt die Schule?", a:"When does school start?", alt:["When does the school start?"], why:"When + does + Person/Sache + Grundform."},
      {t:"mc", q:"___ are you late? - Because the bus was late.", opts:["Where","Why","Who"], a:1, why:"Nach dem Grund fragt man mit Why."}
    ]
  },

  g_possessive:{
    unit:"u1", title:"Possessive determiners", titleDe:"my, your, his, her ...",
    learn:{
      intro:"Diese Woerter sagen, wem etwas gehoert.",
      rules:[
        {en:"I -> my", de:"mein"},{en:"you -> your", de:"dein / euer"},
        {en:"he -> his", de:"sein"},{en:"she -> her", de:"ihr"},
        {en:"it -> its", de:"sein / ihr (Ding, Tier)"},
        {en:"we -> our", de:"unser"},{en:"they -> their", de:"ihr (Mehrzahl)"}
      ],
      note:"Achtung: its (ohne Apostroph) heisst sein. it's heisst it is!"
    },
    practice:[
      {t:"mc", q:"Tom loves ___ dog.", opts:["her","his","its"], a:1, why:"Tom ist ein Junge - sein Hund = his dog."},
      {t:"mc", q:"Anna is here with ___ mother.", opts:["his","her","their"], a:1, why:"Anna ist ein Mädchen - ihre Mutter = her mother."},
      {t:"gap", q:"We tidy up ___ rooms on Saturday.", a:"our", why:"we -> our (unsere)."},
      {t:"mc", q:"My parents love ___ garden.", opts:["his","our","their"], a:2, why:"My parents = they -> their."},
      {t:"gap", q:"I do ___ homework after lunch.", a:"my", why:"I -> my."}
    ],
    challenge:[
      {t:"mc", q:"The cat is in ___ basket.", opts:["it's","its","his"], a:1, why:"its ohne Apostroph = sein / ihr. it's heisst it is."},
      {t:"trans", de:"Das ist ihr Bruder.", a:"That is her brother.", alt:["This is her brother.","That's her brother."], why:"ihr (von einem Mädchen) = her."},
      {t:"order", words:["Their","house","has","a","big","garden"], a:"Their house has a big garden.", why:"Their steht vor dem Nomen house."},
      {t:"gap", q:"Ben and I like ___ new school.", a:"our", why:"Ben and I = we -> our."}
    ]
  },

  g_genitive:{
    unit:"u1", title:"The s-genitive", titleDe:"Wem gehört es? (Toms Buch)",
    learn:{
      intro:"Mit 's sagst du, wem etwas gehoert. Es steht beim Besitzer, nicht beim Ding.",
      rules:[
        {en:"Tom's bike", de:"Toms Fahrrad"},
        {en:"my sister's room", de:"das Zimmer meiner Schwester"},
        {en:"the girls' school", de:"die Schule der Mädchen (Mehrzahl auf -s: nur Apostroph)"},
        {en:"the children's books", de:"die Bücher der Kinder (unregelmäßige Mehrzahl: 's)"}
      ],
      note:"Reihenfolge: Besitzer + 's + Ding."
    },
    practice:[
      {t:"mc", q:"This is ___ bike.", opts:["Toms","Tom's","Toms'"], a:1, why:"Besitzer + Apostroph + s: Tom's bike."},
      {t:"gap", q:"That is my ___ room. (sister)", a:"sister's", why:"Ein Besitzer in der Einzahl bekommt 's."},
      {t:"mc", q:"the ___ toys (die Spielsachen der Kinder)", opts:["childrens'","children's","childrens"], a:1, why:"children ist schon Mehrzahl ohne -s, deshalb children's."},
      {t:"trans", de:"Annas Katze ist schwarz.", a:"Anna's cat is black.", why:"Anna + 's + cat."}
    ],
    challenge:[
      {t:"mc", q:"the ___ names (die Namen der beiden Mädchen)", opts:["girl's","girls's","girls'"], a:2, why:"Mehrzahl auf -s bekommt nur einen Apostroph: girls'."},
      {t:"order", words:["My","brother's","room","is","upstairs"], a:"My brother's room is upstairs.", why:"Besitzer mit 's steht vor dem Ding."},
      {t:"trans", de:"Das ist das Fahrrad meines Vaters.", a:"That is my father's bike.", alt:["This is my father's bike.","That's my father's bike."], why:"my father + 's + bike."},
      {t:"gap", q:"Where is the ___ ball? (dog)", a:"dog's", why:"Ein Besitzer in der Einzahl: dog's ball."}
    ]
  },

  g_plural:{
    unit:"u1", title:"Plural forms (regular)", titleDe:"Die Mehrzahl (regelmäßig)",
    learn:{
      intro:"Die meisten Nomen bekommen in der Mehrzahl ein -s. Es gibt drei regelmäßige Muster.",
      rules:[
        {en:"book -> books, club -> clubs", de:"normal: + s"},
        {en:"box -> boxes, bus -> buses, watch -> watches", de:"nach x, s, ch, sh: + es"},
        {en:"hobby -> hobbies, city -> cities", de:"Konsonant + y wird zu -ies"},
        {en:"boy -> boys, day -> days", de:"Vokal + y bleibt einfach: + s"}
      ],
      note:"Unregelmäßige Formen wie man -> men lernst du extra in Unit 2 (Irregular plurals)."
    },
    practice:[
      {t:"gap", q:"Mehrzahl von hobby:", a:"hobbies", why:"Konsonant + y wird zu -ies: hobbies."},
      {t:"gap", q:"Mehrzahl von bus:", a:"buses", why:"Nach s kommt -es: buses."},
      {t:"gap", q:"Mehrzahl von box:", a:"boxes", why:"Nach x kommt -es: boxes."},
      {t:"mc", q:"Mehrzahl von boy:", opts:["boyes","boies","boys"], a:2, why:"Vokal + y bleibt: boys."},
      {t:"gap", q:"Mehrzahl von match:", a:"matches", why:"Nach ch kommt -es: matches."}
    ],
    challenge:[
      {t:"gap", q:"Mehrzahl von city:", a:"cities", why:"Konsonant + y wird zu -ies: cities."},
      {t:"mc", q:"Mehrzahl von party:", opts:["partys","parties","partyes"], a:1, why:"Konsonant + y wird zu -ies: parties."},
      {t:"gap", q:"Mehrzahl von class:", a:"classes", why:"Nach s kommt -es: classes."},
      {t:"trans", de:"Ich habe zwei Hobbys.", a:"I have two hobbies.", alt:["I have got two hobbies.","I've got two hobbies."], why:"hobby wird in der Mehrzahl zu hobbies."}
    ]
  },

  /* ================= UNIT 2 – GAP8, GAP9, GAP10, GAP11 ================= */
  g_simplepresent:{
    unit:"u2", title:"Simple present", titleDe:"Was immer oder regelmäßig passiert",
    learn:{
      intro:"Das simple present benutzt du fuer Gewohnheiten und Dinge, die immer wieder passieren.",
      rules:[
        {en:"I play / you play / we play / they play", de:"ohne Endung"},
        {en:"he plays / she plays / it plays", de:"bei he/she/it kommt ein -s dazu!"},
        {en:"she goes, he watches, it finishes", de:"nach o, ch, sh, s, x kommt -es"},
        {en:"she studies (study)", de:"Konsonant + y wird zu -ies"},
        {en:"I get up at seven every day.", de:"Ich stehe jeden Tag um sieben auf."},
        {en:"I don't like maths.", de:"Verneinung bei I/you/we/they: don't + Grundform"},
        {en:"She doesn't like maths.", de:"Verneinung bei he/she/it: doesn't + Grundform (kein -s mehr!)"}
      ],
      note:"Merkspruch: he, she, it - das -s muss mit! Bei der Verneinung mit doesn't fällt es dafür weg."
    },
    practice:[
      {t:"mc", q:"He ___ dinner every evening.", opts:["cook","cooks"], a:1, why:"he, she, it - das -s muss mit."},
      {t:"mc", q:"They ___ in a small flat.", opts:["live","lives"], a:0, why:"Bei they kommt kein -s dazu."},
      {t:"gap", q:"She ___ (watch) TV in the evening.", a:"watches", why:"Nach ch kommt -es: watch wird zu watches."},
      {t:"gap", q:"My father ___ (go) to work at seven.", a:"goes", why:"Nach o kommt -es: go wird zu goes."},
      {t:"mc", q:"We ___ breakfast at seven.", opts:["has","have"], a:1, why:"Bei we steht have. Nur he/she/it hat has."},
      {t:"trans", de:"Sie trinkt jeden Morgen Milch.", a:"She drinks milk every morning.", why:"she -> drinks mit -s."},
      {t:"trans", de:"Er mag keine Mathe.", a:"He does not like maths.", alt:["He doesn't like maths."], why:"Verneinung bei he: does not / doesn't + Grundform (ohne -s)."}
    ],
    challenge:[
      {t:"gap", q:"My sister ___ (study) every afternoon.", a:"studies", why:"Konsonant + y wird zu -ies: study wird zu studies."},
      {t:"order", words:["My","mother","works","in","a","hospital"], a:"My mother works in a hospital.", why:"My mother = she - deshalb works."},
      {t:"trans", de:"Mein Bruder räumt sein Zimmer nie auf.", a:"My brother never tidies up his room.", alt:["My brother never tidies his room."], why:"never steht vor dem Verb, und bei he kommt -ies."},
      {t:"mc", q:"The bus ___ at half past seven.", opts:["come","comes"], a:1, why:"The bus = it - also comes."},
      {t:"gap", q:"They ___ (not / like) football. (Verneinung)", a:"do not like", alt:["don't like"], why:"they -> do not / don't + Grundform (ohne -s)."}
    ]
  },

  g_imperative:{
    unit:"u2", title:"Imperatives", titleDe:"Aufforderungen und Bitten",
    learn:{
      intro:"Mit dem Imperativ forderst du jemanden auf, etwas zu tun. Du benutzt einfach die Grundform des Verbs - ohne Subjekt.",
      rules:[
        {en:"Open your books!", de:"Öffnet eure Bücher! (Grundform ohne to)"},
        {en:"Listen carefully!", de:"Hört gut zu!"},
        {en:"Don't talk, please!", de:"Redet bitte nicht! (Verneinung: Don't + Grundform)"},
        {en:"Be quiet!", de:"Sei/Seid leise! (bei to be: einfach Be)"},
        {en:"Let's start!", de:"Lass uns anfangen! (Vorschlag für mehrere Personen)"}
      ],
      note:"Der Imperativ hat kein Subjekt und keine Personalendung."
    },
    practice:[
      {t:"mc", q:"___ the door, please!", opts:["Close","Closes","Closing"], a:0, why:"Der Imperativ ist die Grundform ohne -s."},
      {t:"mc", q:"Welcher Satz ist ein Imperativ?", opts:["You open the window.","Open the window!"], a:1, why:"Der Imperativ hat kein Subjekt - er beginnt direkt mit der Grundform."},
      {t:"gap", q:"___ talk during the test! (Verneinung: nicht reden)", a:"Don't", why:"Verneinter Imperativ: Don't + Grundform."},
      {t:"trans", de:"Öffne dein Buch!", a:"Open your book!", why:"Imperativ: Grundform + Objekt."},
      {t:"mc", q:"___ quiet in the library!", opts:["Be","Are","Is"], a:0, why:"Bei to be lautet der Imperativ einfach Be."}
    ],
    challenge:[
      {t:"order", words:["Don't","run","in","the","classroom"], a:"Don't run in the classroom.", why:"Verneinter Imperativ: Don't + Grundform."},
      {t:"trans", de:"Macht bitte eure Hausaufgaben!", a:"Do your homework, please!", alt:["Please do your homework!"], why:"Imperativ: Grundform + Objekt, please macht es höflich."},
      {t:"gap", q:"___'s start the lesson now. (Vorschlag: Lass uns)", a:"Let", why:"Let's = Let us - ein Vorschlag für die ganze Gruppe."},
      {t:"mc", q:"___ afraid of mistakes!", opts:["Not be","Don't be","Doesn't be"], a:1, why:"Verneinung bei be: Don't be + Adjektiv."}
    ]
  },

  g_wordorder:{
    unit:"u2", title:"Word order", titleDe:"Die Satzstellung",
    learn:{
      intro:"Im Englischen ist die Reihenfolge der Woerter im Satz sehr wichtig und fast immer gleich: Subjekt - Verb - Objekt.",
      rules:[
        {en:"I play football every day.", de:"Subjekt + Verb + Objekt + Zeitangabe (Zeit meist am Ende)"},
        {en:"We go to school by bike.", de:"Subjekt + Verb + Ortsangabe"},
        {en:"We meet at the sports ground at four o'clock.", de:"Wenn Ort UND Zeit im Satz stehen: erst Ort, dann Zeit"},
        {en:"Where do you live?", de:"Fragewort + Hilfsverb + Subjekt + Grundform"}
      ],
      note:"Merksatz fuer das Satzende: Place before Time (erst wo, dann wann)."
    },
    practice:[
      {t:"order", words:["I","play","tennis","on","Mondays"], a:"I play tennis on Mondays.", why:"Subjekt + Verb + Objekt, die Zeit steht am Ende."},
      {t:"mc", q:"Welcher Satz hat die richtige Reihenfolge?", opts:["Football plays he.","He plays football."], a:1, why:"Im Englischen steht das Subjekt vor dem Verb, das Verb vor dem Objekt."},
      {t:"order", words:["We","go","to","school","by","bike"], a:"We go to school by bike.", why:"Subjekt + Verb + Ortsangabe."},
      {t:"mc", q:"Welche Reihenfolge ist richtig?", opts:["She plays every day tennis.","She plays tennis every day."], a:1, why:"Das Objekt steht vor der Zeitangabe."},
      {t:"order", words:["My","classroom","is","next","to","the","library"], a:"My classroom is next to the library.", why:"Subjekt + is + Ortsangabe."}
    ],
    challenge:[
      {t:"order", words:["We","meet","at","the","sports","ground","at","four","o'clock"], a:"We meet at the sports ground at four o'clock.", why:"Place before time: erst der Ort (at the sports ground), dann die Zeit (at four o'clock)."},
      {t:"trans", de:"Sie geht jeden Morgen zu Fuß zur Schule.", a:"She walks to school every morning.", why:"Subjekt + Verb + Ortsangabe + Zeitangabe - Ort vor Zeit."},
      {t:"mc", q:"Welcher Satz ist richtig?", opts:["My brother often is late.","My brother is often late."], a:1, why:"Häufigkeitsadverbien wie often stehen nach einer Form von to be."},
      {t:"order", words:["Where","do","you","live","?"], a:"Where do you live?", why:"Fragewort + do + Subjekt + Grundform."}
    ]
  },

  g_irregular_plural:{
    unit:"u2", title:"Irregular plurals", titleDe:"Unregelmäßige Mehrzahlformen",
    learn:{
      intro:"Manche Nomen bilden die Mehrzahl nicht mit -s, sondern ganz anders. Diese Formen musst du auswendig lernen.",
      rules:[
        {en:"man -> men", de:"Mann -> Männer"},
        {en:"woman -> women", de:"Frau -> Frauen"},
        {en:"child -> children", de:"Kind -> Kinder"},
        {en:"person -> people", de:"Person -> Leute / Menschen"},
        {en:"foot -> feet, tooth -> teeth", de:"Fuß -> Füße, Zahn -> Zähne"},
        {en:"mouse -> mice", de:"Maus -> Mäuse"},
        {en:"fish -> fish, sheep -> sheep", de:"bleiben in der Mehrzahl gleich"}
      ],
      note:"Es gibt nicht viele unregelmäßige Wörter - aber sie kommen sehr häufig vor, deshalb lohnt sich das Auswendiglernen."
    },
    practice:[
      {t:"gap", q:"Mehrzahl von child:", a:"children", why:"child ist unregelmäßig: children."},
      {t:"gap", q:"Mehrzahl von man:", a:"men", why:"man ist unregelmäßig: men."},
      {t:"mc", q:"Mehrzahl von woman:", opts:["womans","women","womens"], a:1, why:"Unregelmäßig: woman wird zu women."},
      {t:"gap", q:"Mehrzahl von foot:", a:"feet", why:"foot ist unregelmäßig: feet."},
      {t:"mc", q:"Mehrzahl von fish (mehrere Fische):", opts:["fishes","fish","fishs"], a:1, why:"fish bleibt in der Mehrzahl gleich."}
    ],
    challenge:[
      {t:"gap", q:"Mehrzahl von tooth:", a:"teeth", why:"tooth ist unregelmäßig: teeth."},
      {t:"gap", q:"Mehrzahl von mouse:", a:"mice", why:"mouse ist unregelmäßig: mice."},
      {t:"trans", de:"Es gibt viele Kinder im Park.", a:"There are many children in the park.", alt:["There are a lot of children in the park."], why:"child wird zu children."},
      {t:"mc", q:"Mehrzahl von person:", opts:["persons","peoples","people"], a:2, why:"person ist unregelmäßig: people."}
    ]
  },

  g_this_that:{
    unit:"u2", title:"this / that / these / those", titleDe:"dieser, jener ...",
    learn:{
      intro:"Damit zeigst du auf Dinge - nah oder weiter weg.",
      rules:[
        {en:"this book", de:"dieses Buch (nah, Einzahl)"},
        {en:"that book", de:"das Buch dort (weiter weg, Einzahl)"},
        {en:"these books", de:"diese Bücher (nah, Mehrzahl)"},
        {en:"those books", de:"die Bücher dort (weiter weg, Mehrzahl)"}
      ],
      note:"this / these = hier. that / those = dort."
    },
    practice:[
      {t:"mc", q:"___ apple here is mine.", opts:["This","These","Those"], a:0, why:"Einzahl und nah - also this."},
      {t:"mc", q:"___ books over there are new.", opts:["This","That","Those"], a:2, why:"Mehrzahl und weiter weg - also those."},
      {t:"gap", q:"___ shoes here are too small. (Mehrzahl, nah)", a:"These", why:"Mehrzahl und nah - also these."},
      {t:"mc", q:"Look at ___ bird in the tree over there.", opts:["these","that","those"], a:1, why:"Einzahl und weiter weg - also that."}
    ],
    challenge:[
      {t:"trans", de:"Diese Stühle hier sind neu.", a:"These chairs are new.", why:"Mehrzahl und nah - these."},
      {t:"order", words:["Those","houses","are","very","old"], a:"Those houses are very old.", why:"Those + Mehrzahl + are."},
      {t:"gap", q:"___ is my sister. (ein Mädchen, das direkt neben dir steht)", a:"This", why:"Einzahl und nah - also This is my sister."},
      {t:"mc", q:"Are ___ your pens on the desk over there?", opts:["this","these","those"], a:2, why:"Mehrzahl und weiter weg - also those."}
    ]
  },

  /* ================= UNIT 3 – GAP13, GAP14, GAP15, GAP16, GAP17, GAP18 ================= */
  g_sp_questions:{
    unit:"u3", title:"Questions with do / does", titleDe:"Fragen und Kurzantworten",
    learn:{
      intro:"Bei normalen Verben brauchst du im simple present do oder does fuer Fragen.",
      rules:[
        {en:"Do you play tennis?", de:"Spielst du Tennis?"},
        {en:"Does he play tennis?", de:"Spielt er Tennis? (he/she/it -> does)"},
        {en:"Yes, I do. / No, I don't.", de:"Kurzantwort"},
        {en:"Yes, she does. / No, she doesn't.", de:"Kurzantwort bei he/she/it"},
        {en:"I don't like fish.", de:"Ich mag keinen Fisch."}
      ],
      note:"Wichtig: Nach does hat das Verb KEIN -s mehr. Does he play? - nicht plays."
    },
    practice:[
      {t:"mc", q:"___ you like football?", opts:["Do","Does","Are"], a:0, why:"Bei you steht Do."},
      {t:"mc", q:"___ she play the piano?", opts:["Do","Does","Is"], a:1, why:"Bei he / she / it steht Does."},
      {t:"mc", q:"Does he ___ chess?", opts:["plays","play","playing"], a:1, why:"Nach does steht die Grundform ohne -s."},
      {t:"gap", q:"___ your friends play basketball?", a:"Do", why:"your friends ist Mehrzahl - also Do."},
      {t:"mc", q:"Do you swim? - Yes, I ___.", opts:["am","do","does"], a:1, why:"Die Kurzantwort wiederholt das Hilfsverb: Yes, I do."},
      {t:"gap", q:"He ___ not like maths. (Kurzform mit does)", a:"does", why:"Verneinung bei he: does not / doesn't."}
    ],
    challenge:[
      {t:"order", words:["Does","your","sister","play","tennis","?"], a:"Does your sister play tennis?", why:"Does + Person + Grundform."},
      {t:"trans", de:"Ich mag keinen Fisch.", a:"I do not like fish.", alt:["I don't like fish."], why:"Verneinung: do not / don't + Grundform."},
      {t:"mc", q:"Does Ben go swimming? - No, he ___.", opts:["don't","doesn't","isn't"], a:1, why:"Bei he lautet die Kurzantwort No, he doesn't."},
      {t:"gap", q:"My brother ___ (not / like) chess.", a:"does not like", alt:["doesn't like"], why:"he -> does not / doesn't + Grundform like."},
      {t:"trans", de:"Spielst du oft Computerspiele?", a:"Do you often play computer games?", alt:["Do you play computer games often?"], why:"Do + you + often + Grundform."}
    ]
  },

  g_frequency:{
    unit:"u3", title:"Adverbs of frequency", titleDe:"Wie oft? (always, often, never ...)",
    learn:{
      intro:"Haeufigkeitsadverbien sagen, wie oft etwas passiert. Ihre Stellung im Satz ist fest.",
      rules:[
        {en:"always (100%) - usually - often - sometimes - never (0%)", de:"immer bis nie"},
        {en:"I always walk to school.", de:"VOR dem Vollverb"},
        {en:"She is always late.", de:"NACH einer Form von to be"},
        {en:"I can never find my pen.", de:"NACH can / must usw."},
        {en:"Once a week / twice a week", de:"stehen meist am Satzende"}
      ],
      note:"Merke: vor dem Vollverb, aber nach to be."
    },
    practice:[
      {t:"mc", q:"Welcher Satz ist richtig?", opts:["I go always to bed at nine.","I always go to bed at nine."], a:1, why:"Das Adverb steht VOR dem Vollverb go."},
      {t:"mc", q:"Welcher Satz ist richtig?", opts:["She is never late.","She never is late."], a:0, why:"Nach einer Form von to be steht das Adverb dahinter."},
      {t:"order", words:["We","often","play","in","the","park"], a:"We often play in the park.", why:"often steht vor dem Vollverb play."},
      {t:"gap", q:"He ___ eats fish. (nie)", a:"never", why:"never = nie, und es steht vor dem Vollverb."},
      {t:"mc", q:"I go swimming ___ .", opts:["once a week","a week once"], a:0, why:"once a week steht am Satzende."}
    ],
    challenge:[
      {t:"order", words:["My","sister","is","usually","very","tired"], a:"My sister is usually very tired.", why:"Nach is steht usually."},
      {t:"trans", de:"Ich gehe manchmal ins Schwimmbad.", a:"I sometimes go to the swimming pool.", alt:["Sometimes I go to the swimming pool."], why:"sometimes vor dem Vollverb go (oder ganz am Anfang)."},
      {t:"mc", q:"Welcher Satz ist richtig?", opts:["They can always help you.","They always can help you."], a:0, why:"Nach can steht das Adverb dahinter."},
      {t:"trans", de:"Er kommt immer zu spät.", a:"He is always late.", why:"Bei to be steht always danach."}
    ]
  },

  g_prepositions:{
    unit:"u3", title:"Prepositions of place and time", titleDe:"Präpositionen (Ort und Zeit)",
    learn:{
      intro:"Präpositionen sagen, wo oder wann etwas ist.",
      rules:[
        {en:"in the kitchen, in April, in the morning", de:"in: drin, im Monat, am Morgen"},
        {en:"on the table, on Monday", de:"on: auf etwas, an einem Tag/Datum"},
        {en:"at school, at 4 o'clock, at home", de:"at: bei einem Ort, zu einer Uhrzeit"},
        {en:"next to, in front of, behind, between", de:"next to (neben), in front of (vor), behind (hinter), between (zwischen)"}
      ],
      note:"Merke: in - Monate/Jahreszeiten, on - Tage/Daten, at - Uhrzeiten."
    },
    practice:[
      {t:"mc", q:"The cat is ___ the table.", opts:["in","on","at"], a:1, why:"Auf einer Fläche: on the table."},
      {t:"mc", q:"We start school ___ 8 o'clock.", opts:["in","on","at"], a:2, why:"Uhrzeiten: at."},
      {t:"gap", q:"My birthday is ___ April. (Monat)", a:"in", why:"Monate: in."},
      {t:"mc", q:"See you ___ Monday!", opts:["in","on","at"], a:1, why:"Wochentage: on."},
      {t:"gap", q:"The bookshop is ___ the bakery. (daneben)", a:"next to", why:"next to = neben."}
    ],
    challenge:[
      {t:"gap", q:"The teacher's desk is ___ the classroom. (vorne, vor der Klasse)", a:"in front of", why:"in front of = vor."},
      {t:"mc", q:"I do my homework ___ the afternoon.", opts:["in","on","at"], a:0, why:"Tageszeiten: in the afternoon."},
      {t:"trans", de:"Die Schule beginnt um neun Uhr.", a:"School starts at nine o'clock.", why:"Uhrzeiten: at."},
      {t:"gap", q:"Our house is ___ the park and the school. (zwischen)", a:"between", why:"between = zwischen."}
    ]
  },

  g_countable_uncountable:{
    unit:"u3", title:"Countable and uncountable nouns", titleDe:"Zählbare und nicht zählbare Nomen",
    learn:{
      intro:"Manche Dinge kann man zählen (ein Apfel, zwei Äpfel) - andere nicht (Wasser, Zeit).",
      rules:[
        {en:"an apple, two apples, many books", de:"zählbar - hat eine Mehrzahl, kann mit a/an stehen"},
        {en:"water, milk, bread, time, money", de:"nicht zählbar - keine Mehrzahl, kein a/an"},
        {en:"some water, a lot of time", de:"some / a lot of gehen bei beiden Arten"},
        {en:"Water is important.", de:"nicht zählbare Nomen stehen immer in der Einzahl"}
      ],
      note:"Nicht zählbare Nomen bekommen nie ein -s: water - nicht waters."
    },
    practice:[
      {t:"mc", q:"___ apple is on the table.", opts:["A","An","Some"], a:1, why:"apple ist zählbar und beginnt mit einem Vokal-Klang - also An apple."},
      {t:"mc", q:"There isn't ___ milk in the fridge.", opts:["a","any"], a:1, why:"milk ist nicht zählbar - in der Verneinung steht any."},
      {t:"gap", q:"I have got two ___. (book, Mehrzahl)", a:"books", why:"Zählbare Nomen haben eine Mehrzahl."},
      {t:"mc", q:"We need ___ bread for breakfast.", opts:["a","some"], a:1, why:"bread ist nicht zählbar - also some, nicht a."},
      {t:"gap", q:"Water ___ (is/are) important. (immer Einzahl)", a:"is", why:"Nicht zählbare Nomen stehen immer in der Einzahl."}
    ],
    challenge:[
      {t:"trans", de:"Ich brauche ein bisschen Zeit.", a:"I need some time.", why:"time ist nicht zählbar - some time."},
      {t:"mc", q:"How much ___ do you drink every day?", opts:["milk","apples"], a:0, why:"How much steht vor einem nicht zählbaren Nomen."},
      {t:"mc", q:"How many ___ do you eat every day?", opts:["fruit","apples"], a:1, why:"How many steht vor einem zählbaren Nomen in der Mehrzahl."},
      {t:"gap", q:"There is a lot of ___ (Sand, nicht zählbar) on the beach.", a:"sand", why:"sand ist nicht zählbar - keine Mehrzahl."}
    ]
  },

  g_much_many:{
    unit:"u3", title:"Quantifiers: much / many / some / any", titleDe:"Mengenangaben: viel, viele, etwas, irgendein",
    learn:{
      intro:"much, many, some, any und a lot of sagen, wie viel oder wie viele es von etwas gibt.",
      rules:[
        {en:"many friends, many books", de:"many bei zählbaren Dingen (Mehrzahl)"},
        {en:"much time, much water", de:"much bei nicht zählbaren Dingen"},
        {en:"a lot of friends / a lot of water", de:"a lot of geht bei beidem - meist in positiven Sätzen"},
        {en:"some apples, some water", de:"some in positiven Sätzen (zählbar UND nicht zählbar)"},
        {en:"Have you got any apples? / not any water", de:"any in Fragen und Verneinungen"}
      ],
      note:"Faustregel: positiv -> some / a lot of. Frage und Verneinung -> any. Frage nach der Menge -> how much / how many."
    },
    practice:[
      {t:"mc", q:"How ___ books have you got?", opts:["much","many"], a:1, why:"books kann man zaehlen - also many."},
      {t:"mc", q:"How ___ water is in the bottle?", opts:["much","many"], a:0, why:"water kann man nicht zaehlen - also much."},
      {t:"gap", q:"He has got ___ ___ friends. (viele, positiver Satz)", a:"a lot of", why:"In positiven Saetzen sagt man meist a lot of."},
      {t:"mc", q:"I have got ___ money.", opts:["some","any"], a:0, why:"Positiver Satz - also some."},
      {t:"mc", q:"Have you got ___ water?", opts:["some","any"], a:1, why:"Frage - also any."},
      {t:"mc", q:"There are not ___ clouds in the sky.", opts:["some","any"], a:1, why:"Verneinung - also any."}
    ],
    challenge:[
      {t:"trans", de:"Wie viele Mitglieder hat euer Verein?", a:"How many members has your club got?", alt:["How many members does your club have?"], why:"members ist zaehlbar - also How many."},
      {t:"mc", q:"There is not ___ milk left.", opts:["many","much"], a:1, why:"milk ist nicht zaehlbar - also much."},
      {t:"gap", q:"How ___ money do you need?", a:"much", why:"money ist nicht zaehlbar - also much."},
      {t:"trans", de:"Es gibt keine Muscheln am Strand.", a:"There are not any shells on the beach.", alt:["There aren't any shells on the beach.","There are no shells on the beach."], why:"Verneinung: not any (oder no)."},
      {t:"gap", q:"Are there ___ boats in the harbour?", a:"any", why:"Frage - also any."}
    ]
  },

  g_wantto_haveto:{
    unit:"u3", title:"want to / would like to / have to", titleDe:"wollen, gerne möchten, müssen",
    learn:{
      intro:"Diese Ausdrücke sagen, was du willst, möchtest oder tun musst.",
      rules:[
        {en:"I want to play outside.", de:"Ich will draußen spielen. (want to + Grundform)"},
        {en:"I would like to (I'd like to) watch a film.", de:"Ich möchte gerne einen Film sehen. (höflicher als want to)"},
        {en:"She has to tidy her room.", de:"Sie muss ihr Zimmer aufräumen. (he/she/it -> has to)"},
        {en:"We have to be quiet in the library.", de:"Wir müssen in der Bibliothek leise sein."},
        {en:"Do you want to come?", de:"Willst du mitkommen?"}
      ],
      note:"Nach want to, would like to und have to steht immer die Grundform des Verbs."
    },
    practice:[
      {t:"mc", q:"I want to ___ football.", opts:["play","plays","playing"], a:0, why:"Nach want to steht die Grundform."},
      {t:"mc", q:"She ___ to tidy her room.", opts:["have","has"], a:1, why:"Bei he/she/it steht has to."},
      {t:"gap", q:"We ___ to be quiet. (müssen)", a:"have", why:"we -> have to."},
      {t:"mc", q:"I'd like ___ watch a film.", opts:["to","for","-"], a:0, why:"would like to + Grundform."},
      {t:"gap", q:"He ___ to do his homework before dinner. (muss)", a:"has", why:"he -> has to."}
    ],
    challenge:[
      {t:"trans", de:"Ich möchte gerne ein Eis essen.", a:"I would like to eat an ice cream.", alt:["I'd like to eat an ice cream."], why:"would like to + Grundform."},
      {t:"order", words:["Do","you","want","to","come","with","us","?"], a:"Do you want to come with us?", why:"Frage: Do + you + want to + Grundform."},
      {t:"mc", q:"My parents ___ to work every day.", opts:["has","have"], a:1, why:"they -> have to."},
      {t:"trans", de:"Sie muss um sieben Uhr aufstehen.", a:"She has to get up at seven o'clock.", why:"she -> has to + Grundform."}
    ]
  },

  g_object_pron:{
    unit:"u2", title:"Object pronouns", titleDe:"me, you, him, her ...",
    learn:{
      intro:"Objektpronomen stehen nach dem Verb oder nach einer Praeposition.",
      rules:[
        {en:"I -> me", de:"mich / mir"},{en:"you -> you", de:"dich / dir"},
        {en:"he -> him", de:"ihn / ihm"},{en:"she -> her", de:"sie / ihr"},
        {en:"it -> it", de:"es / ihm"},{en:"we -> us", de:"uns"},
        {en:"they -> them", de:"sie / ihnen"}
      ],
      note:"Vergleich: He likes me. (Er mag mich.) / I like him. (Ich mag ihn.)"
    },
    practice:[
      {t:"mc", q:"Can you help ___ , please?", opts:["I","me","my"], a:1, why:"Nach dem Verb steht das Objektpronomen me."},
      {t:"mc", q:"I often play with ___ . (Tom)", opts:["he","him","his"], a:1, why:"Nach with steht him."},
      {t:"gap", q:"Anna is nice. I like ___ .", a:"her", why:"Anna ist weiblich - als Objekt her."},
      {t:"mc", q:"Come with ___ ! (wir)", opts:["we","us","our"], a:1, why:"Nach with steht us."},
      {t:"gap", q:"The books are new. Please take ___ home.", a:"them", why:"Mehrere Dinge - als Objekt them."}
    ],
    challenge:[
      {t:"trans", de:"Er hilft mir jeden Tag.", a:"He helps me every day.", why:"mir = me, nach dem Verb helps."},
      {t:"order", words:["We","meet","them","at","the","sports","ground"], a:"We meet them at the sports ground.", why:"them steht direkt nach dem Verb meet."},
      {t:"mc", q:"This present is for ___ . (du)", opts:["you","your","yours"], a:0, why:"Nach for steht das Objektpronomen you."},
      {t:"gap", q:"My friends call ___ every evening. (ich)", a:"me", why:"mich = me."}
    ]
  },

  /* ================= UNIT 4 – GAP19 ================= */
  g_progressive:{
    unit:"u4", title:"Present progressive", titleDe:"Was gerade jetzt passiert",
    learn:{
      intro:"Das present progressive beschreibt, was GERADE JETZT passiert. Du brauchst dafuer zwei Teile.",
      rules:[
        {en:"am / is / are + Verb + ing", de:"die Formel"},
        {en:"I am swimming.", de:"Ich schwimme gerade."},
        {en:"She is reading a book.", de:"Sie liest gerade ein Buch."},
        {en:"They are not playing. (aren't)", de:"Sie spielen gerade nicht."},
        {en:"What are you doing?", de:"Was machst du gerade?"}
      ],
      note:"Schreibweise: make -> making (e faellt weg), sit -> sitting (Konsonant verdoppelt), run -> running."
    },
    practice:[
      {t:"mc", q:"She ___ swimming in the sea.", opts:["am","is","are"], a:1, why:"Bei she steht is: she is swimming."},
      {t:"gap", q:"They ___ playing on the beach.", a:"are", why:"Bei they steht are."},
      {t:"gap", q:"I am ___ (look) for my towel.", a:"looking", why:"look + ing = looking."},
      {t:"mc", q:"He is ___ a sandcastle.", opts:["build","building","builds"], a:1, why:"Nach is steht das Verb mit -ing."},
      {t:"gap", q:"The sun ___ shining.", a:"is", why:"The sun = it - also is."}
    ],
    challenge:[
      {t:"gap", q:"She is ___ (sit) on the sand.", a:"sitting", why:"Kurzer Vokal: das t wird verdoppelt - sitting."},
      {t:"trans", de:"Die Kinder spielen gerade draußen.", a:"The children are playing outside.", why:"children = they -> are + playing."},
      {t:"order", words:["What","are","you","doing","?"], a:"What are you doing?", why:"Fragewort + are + you + Verb mit -ing."},
      {t:"gap", q:"We are ___ (make) sandwiches.", a:"making", why:"Bei make faellt das e weg: making."},
      {t:"trans", de:"Ich warte gerade auf den Bus.", a:"I am waiting for the bus.", alt:["I'm waiting for the bus."], why:"I + am + waiting."}
    ]
  },

  g_prog_vs_simple:{
    unit:"u4", title:"Progressive or simple present?", titleDe:"Gerade jetzt oder immer?",
    learn:{
      intro:"Beide Zeiten gibt es im Englischen - du musst die richtige waehlen.",
      rules:[
        {en:"Present progressive: gerade jetzt", de:"Signalwörter: now, right now, at the moment, Look!, Listen!"},
        {en:"Simple present: immer / oft / regelmäßig", de:"Signalwörter: always, usually, often, every day, on Mondays"},
        {en:"She is reading now.", de:"Sie liest gerade."},
        {en:"She reads every evening.", de:"Sie liest jeden Abend."}
      ],
      note:"Frag dich: Passiert es GERADE (progressive) oder IMMER WIEDER (simple present)?"
    },
    practice:[
      {t:"mc", q:"Look! The dog ___ on the beach.", opts:["runs","is running"], a:1, why:"Look! zeigt: es passiert gerade jetzt - also present progressive."},
      {t:"mc", q:"We ___ swimming every Saturday.", opts:["go","are going"], a:0, why:"every Saturday = regelmaessig - also simple present."},
      {t:"mc", q:"It ___ at the moment.", opts:["rains","is raining"], a:1, why:"at the moment = gerade jetzt - also present progressive."},
      {t:"gap", q:"She ___ (eat) an ice cream right now.", a:"is eating", why:"right now - also present progressive: is eating."},
      {t:"gap", q:"He usually ___ (walk) to school.", a:"walks", why:"usually = regelmaessig - simple present mit -s: walks."}
    ],
    challenge:[
      {t:"trans", de:"Er spielt gerade Gitarre.", a:"He is playing the guitar.", alt:["He's playing the guitar."], why:"gerade = present progressive."},
      {t:"trans", de:"Er spielt jeden Tag Gitarre.", a:"He plays the guitar every day.", why:"jeden Tag = simple present mit -s."},
      {t:"mc", q:"Listen! The birds ___ .", opts:["sing","are singing"], a:1, why:"Listen! zeigt: gerade jetzt - present progressive."},
      {t:"mc", q:"My father ___ dinner on Sundays.", opts:["is cooking","cooks"], a:1, why:"on Sundays = regelmaessig - simple present."}
    ]
  },

  /* ================= EXTRA – GAP20, GAP21 ================= */
  g_was_were:{
    unit:"u5", title:"was / were", titleDe:"to be in der Vergangenheit",
    learn:{
      intro:"was und were sind die Vergangenheitsformen von to be.",
      rules:[
        {en:"I was / he was / she was / it was", de:"ich war / er war / sie war / es war"},
        {en:"you were / we were / they were", de:"du warst / wir waren / sie waren"},
        {en:"I was not (wasn't) at home.", de:"Ich war nicht zu Hause."},
        {en:"Were you at the party?", de:"Warst du auf der Party?"},
        {en:"Yes, I was. / No, I wasn't.", de:"Kurzantwort"}
      ],
      note:"Merke: I, he, she, it -> was. you, we, they -> were."
    },
    practice:[
      {t:"mc", q:"I ___ at the cinema yesterday.", opts:["was","were"], a:0, why:"Bei I steht was."},
      {t:"mc", q:"They ___ very tired after the trip.", opts:["was","were"], a:1, why:"Bei they steht were."},
      {t:"gap", q:"The weather ___ terrible on Sunday.", a:"was", why:"The weather ist Einzahl wie it - also was."},
      {t:"gap", q:"We ___ at my grandma's house.", a:"were", why:"Bei we steht were."},
      {t:"mc", q:"___ you at school yesterday?", opts:["Was","Were"], a:1, why:"Bei you steht Were."}
    ],
    challenge:[
      {t:"trans", de:"Der Bus war zu spät.", a:"The bus was late.", why:"The bus = it - also was."},
      {t:"order", words:["Were","they","at","the","party","?"], a:"Were they at the party?", why:"Frage: Were + Person + Rest."},
      {t:"gap", q:"My parents ___ not at home.", a:"were", why:"My parents = they - also were."},
      {t:"trans", de:"Ich war nicht müde.", a:"I was not tired.", alt:["I wasn't tired."], why:"I -> was + not."}
    ]
  },

  g_past_regular:{
    unit:"u5", title:"Simple past – regular verbs", titleDe:"Regelmäßige Verben in der Vergangenheit",
    learn:{
      intro:"Regelmaessige Verben bekommen im simple past die Endung -ed. Und zwar bei ALLEN Personen gleich.",
      rules:[
        {en:"play -> played, watch -> watched", de:"normal: + ed"},
        {en:"live -> lived, like -> liked", de:"Verb endet auf e: nur + d"},
        {en:"study -> studied, tidy -> tidied", de:"Konsonant + y wird zu -ied"},
        {en:"stop -> stopped, plan -> planned", de:"kurzer Vokal: Konsonant wird verdoppelt"},
        {en:"I played. / She played. / They played.", de:"immer gleich!"}
      ],
      note:"Grosser Vorteil: keine Endung fuer he/she/it - im simple past ist alles gleich."
    },
    practice:[
      {t:"gap", q:"Yesterday we ___ (play) football.", a:"played", why:"play + ed = played."},
      {t:"gap", q:"She ___ (live) in London last year.", a:"lived", why:"live endet auf e - nur + d: lived."},
      {t:"gap", q:"They ___ (visit) their grandparents.", a:"visited", why:"visit + ed = visited."},
      {t:"mc", q:"He ___ TV all evening.", opts:["watched","watchd","watcheded"], a:0, why:"watch + ed = watched."},
      {t:"gap", q:"I ___ (tidy) up my room.", a:"tidied", why:"Konsonant + y wird zu -ied: tidied."}
    ],
    challenge:[
      {t:"gap", q:"The bus ___ (stop) at the station.", a:"stopped", why:"Kurzer Vokal: das p wird verdoppelt - stopped."},
      {t:"trans", de:"Wir sind zum Strand gelaufen.", a:"We walked to the beach.", why:"walk + ed = walked."},
      {t:"order", words:["She","stayed","at","home","last","Sunday"], a:"She stayed at home last Sunday.", why:"stay + ed = stayed. Die Zeitangabe steht am Ende."},
      {t:"gap", q:"They ___ (travel) by train.", a:"travelled", alt:["traveled"], why:"Britisch: travelled mit zwei l. Amerikanisch: traveled."}
    ]
  },

  g_past_irregular:{
    unit:"u5", title:"Simple past – irregular verbs", titleDe:"Unregelmäßige Verben",
    learn:{
      intro:"Viele wichtige Verben sind unregelmaessig. Ihre Vergangenheitsform muss man lernen.",
      rules:[
        {en:"go -> went", de:"gehen"},{en:"see -> saw", de:"sehen"},
        {en:"buy -> bought", de:"kaufen"},{en:"take -> took", de:"nehmen"},
        {en:"make -> made", de:"machen"},{en:"find -> found", de:"finden"},
        {en:"have -> had", de:"haben"},{en:"eat -> ate", de:"essen"},
        {en:"get -> got", de:"bekommen"},{en:"come -> came", de:"kommen"}
      ],
      note:"Tipp: Lerne immer beide Formen zusammen - go / went."
    },
    practice:[
      {t:"gap", q:"We ___ (go) to the cinema.", a:"went", why:"go wird zu went."},
      {t:"gap", q:"I ___ (see) a great film.", a:"saw", why:"see wird zu saw."},
      {t:"mc", q:"She ___ a new jacket.", opts:["buyed","bought","buied"], a:1, why:"buy ist unregelmaessig: bought."},
      {t:"gap", q:"He ___ (take) the bus home.", a:"took", why:"take wird zu took."},
      {t:"gap", q:"We ___ (have) a lot of fun.", a:"had", why:"have wird zu had."}
    ],
    challenge:[
      {t:"gap", q:"I ___ (find) my key in the garden.", a:"found", why:"find wird zu found."},
      {t:"trans", de:"Wir haben einen großen Kuchen gemacht.", a:"We made a big cake.", why:"make wird zu made."},
      {t:"order", words:["They","came","home","very","late"], a:"They came home very late.", why:"come wird zu came."},
      {t:"mc", q:"He ___ a present from his uncle.", opts:["getted","gotted","got"], a:2, why:"get ist unregelmaessig: got."},
      {t:"trans", de:"Ich habe ein Eis gegessen.", a:"I ate an ice cream.", why:"eat wird zu ate."}
    ]
  },

  g_past_neg_q:{
    unit:"u5", title:"didn't / Did ...?", titleDe:"Verneinung und Fragen in der Vergangenheit",
    learn:{
      intro:"Fuer Fragen und Verneinungen im simple past brauchst du did. Danach steht die GRUNDFORM.",
      rules:[
        {en:"Did you see the film?", de:"Hast du den Film gesehen?"},
        {en:"I did not go. (didn't go)", de:"Ich bin nicht gegangen."},
        {en:"She didn't buy a ticket.", de:"Sie hat keine Karte gekauft."},
        {en:"Yes, I did. / No, I didn't.", de:"Kurzantwort"}
      ],
      note:"Achtung: Nach did / didn't NIE die Vergangenheitsform! Falsch: I didn't went."
    },
    practice:[
      {t:"mc", q:"I didn't ___ to the party.", opts:["went","go","going"], a:1, why:"Nach didn't steht die Grundform go."},
      {t:"mc", q:"___ you see the match?", opts:["Do","Did","Was"], a:1, why:"Vergangenheit: Did you ...?"},
      {t:"gap", q:"She ___ not buy a ticket.", a:"did", why:"Verneinung im simple past: did not / didn't."},
      {t:"mc", q:"Did he ___ the bus?", opts:["took","take","takes"], a:1, why:"Nach did steht die Grundform take."},
      {t:"mc", q:"Did you have fun? - Yes, I ___.", opts:["was","do","did"], a:2, why:"Kurzantwort mit did: Yes, I did."}
    ],
    challenge:[
      {t:"order", words:["Did","they","visit","the","museum","?"], a:"Did they visit the museum?", why:"Did + Person + Grundform."},
      {t:"trans", de:"Wir sind nicht ins Kino gegangen.", a:"We did not go to the cinema.", alt:["We didn't go to the cinema."], why:"didn't + Grundform go."},
      {t:"gap", q:"He ___ (not / find) his ticket.", a:"did not find", alt:["didn't find"], why:"didn't + Grundform find - nicht found!"},
      {t:"trans", de:"Hast du gestern Fußball gespielt?", a:"Did you play football yesterday?", why:"Did + you + Grundform play."}
    ]
  },

  g_going_to:{
    unit:"u5", title:"going to-future", titleDe:"Pläne für die Zukunft (going to)",
    learn:{
      intro:"Mit going to sprichst du über Pläne oder Dinge, die du für die Zukunft schon entschieden hast.",
      rules:[
        {en:"am / is / are + going to + Grundform", de:"die Formel"},
        {en:"I am going to visit my grandma.", de:"Ich werde meine Oma besuchen. (schon geplant)"},
        {en:"She is going to buy a new bike.", de:"Sie wird ein neues Fahrrad kaufen."},
        {en:"They are not going to come. (aren't)", de:"Sie werden nicht kommen."},
        {en:"What are you going to do at the weekend?", de:"Was wirst du am Wochenende machen?"}
      ],
      note:"going to benutzt du für Pläne und Absichten - nicht für spontane Entscheidungen."
    },
    practice:[
      {t:"mc", q:"I ___ going to visit my cousin.", opts:["am","is","are"], a:0, why:"Bei I steht am."},
      {t:"gap", q:"She is ___ (buy) a new bike. (going to + Grundform)", a:"going to buy", why:"Formel: is + going to + Grundform."},
      {t:"mc", q:"They ___ going to play football tomorrow.", opts:["is","are","am"], a:1, why:"Bei they steht are."},
      {t:"gap", q:"We are ___ going to the party. (Verneinung: nicht)", a:"not", why:"Verneinung: are + not + going to."},
      {t:"mc", q:"___ you going to do your homework tonight?", opts:["Are","Is","Do"], a:0, why:"Frage: Are you going to ...?"}
    ],
    challenge:[
      {t:"order", words:["What","are","you","going","to","do","at","the","weekend","?"], a:"What are you going to do at the weekend?", why:"Fragewort + are + you + going to + Grundform."},
      {t:"trans", de:"Er wird nächstes Jahr nach London fahren.", a:"He is going to go to London next year.", alt:["He's going to go to London next year."], why:"is + going to + Grundform."},
      {t:"gap", q:"They ___ not going to watch the film. (Verneinung)", a:"are", why:"they -> are not / aren't going to."},
      {t:"trans", de:"Wir werden am Strand schwimmen.", a:"We are going to swim at the beach.", alt:["We're going to swim at the beach."], why:"are + going to + Grundform."}
    ]
  }

  };
})(window);
