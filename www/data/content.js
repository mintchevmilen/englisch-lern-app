/* =============================================================
   data/content.js  –  Lesetexte, Alltagsenglisch, Schreibaufgaben
   -------------------------------------------------------------
   Alle Texte sind eigenstaendig geschrieben.
   Struktur je Unit:
     reading : { title, text, qs:[Aufgaben] }
     everyday: [ { en, de, note } ]   -> Alltagsenglisch
     writing : [ Aufgaben vom Typ "trans" ]
   Fehlt ein Bereich, zeigt die App automatisch
   "Content to be added" an, statt etwas zu erfinden.

   Stand: Lesetexte, Alltagsenglisch und Schreibaufgaben wurden
   den echten Unit-Themen zugeordnet (Welcome bleibt, Familie/Zuhause
   -> Unit 1, Schulalltag -> Unit 2, Hobbys/Freizeit -> Unit 3,
   Wetter/Nachbarschaft -> Unit 4, Wochenende/Ausflüge -> Extra).
   ============================================================= */
(function (w) {
  var D = w.DATA = w.DATA || {};

  D.content = {

  u0:{
    reading:{
      title:"A new friend",
      text:"Hello! My name is Emily. I am eleven years old. I have got a small dog. His name is Rocky and he is brown and white. Rocky is three. Every day we go to the park. My best friend is Leo. Leo has got a rabbit. Its name is Snow because it is white. We are in the same class. Our favourite day is Friday.",
      qs:[
        {t:"mc", q:"How old is Emily?", opts:["three","eleven","five"], a:1, why:"Im Text steht: I am eleven years old."},
        {t:"mc", q:"What animal has Emily got?", opts:["a rabbit","a cat","a dog"], a:2, why:"Im Text steht: I have got a small dog."},
        {t:"mc", q:"What colour is the rabbit?", opts:["white","brown","black"], a:0, why:"Its name is Snow because it is white."},
        {t:"mc", q:"Which day do they like best?", opts:["Monday","Sunday","Friday"], a:2, why:"Our favourite day is Friday."}
      ]
    },
    everyday:[
      {en:"Hello, my name is ...", de:"Hallo, ich heiße ...", note:"So stellst du dich vor."},
      {en:"What is your name?", de:"Wie heißt du?"},
      {en:"How old are you?", de:"Wie alt bist du?"},
      {en:"Nice to meet you.", de:"Schön, dich kennenzulernen."},
      {en:"How are you?", de:"Wie geht es dir?"},
      {en:"I am fine, thanks.", de:"Mir geht es gut, danke."},
      {en:"See you tomorrow.", de:"Bis morgen."},
      {en:"Sorry, I do not understand.", de:"Entschuldigung, ich verstehe nicht."}
    ],
    writing:[
      {t:"trans", de:"Hallo, ich heiße Ben.", a:"Hello, my name is Ben.", alt:["Hi, my name is Ben.","Hello, I am Ben.","Hi, I'm Ben."], why:"Hello / Hi + my name is + Name."},
      {t:"trans", de:"Ich bin elf Jahre alt.", a:"I am eleven years old.", alt:["I'm eleven years old.","I am 11 years old."], why:"I am + Alter + years old."},
      {t:"trans", de:"Das ist mein Hund.", a:"This is my dog.", alt:["That is my dog.","This is my dog!"], why:"This is + my + Nomen."},
      {t:"trans", de:"Meine Lieblingsfarbe ist blau.", a:"My favourite colour is blue.", alt:["My favorite colour is blue.","My favourite color is blue."], why:"My favourite colour is + Farbe."}
    ]
  },

  /* ---- Unit 1: At home with friends -> Lesetext über Familie & Zuhause ---- */
  u1:{
    reading:{
      title:"At home with the Parkers",
      text:"The Parkers live in an old house near the park. There are five people in the family: Mr and Mrs Parker, Lucy, Jack and baby Mia. The house has got four bedrooms and a big kitchen. Lucy's bedroom is upstairs. It is small but she likes it. Every morning Mr Parker makes breakfast. Lucy usually has bread with cheese and a glass of milk. Jack does not like milk. He drinks apple juice. After school the children tidy up their rooms. Then they watch TV in the living room.",
      qs:[
        {t:"mc", q:"How many people are in the family?", opts:["four","five","six"], a:1, why:"There are five people in the family."},
        {t:"mc", q:"Where is Lucy's bedroom?", opts:["downstairs","in the garden","upstairs"], a:2, why:"Lucy's bedroom is upstairs."},
        {t:"mc", q:"What does Jack drink?", opts:["milk","apple juice","tea"], a:1, why:"He drinks apple juice."},
        {t:"mc", q:"Who makes breakfast?", opts:["Mr Parker","Lucy","Mrs Parker"], a:0, why:"Every morning Mr Parker makes breakfast."},
        {t:"gap", q:"The house has got ___ bedrooms.", a:"four", why:"The house has got four bedrooms."}
      ]
    },
    everyday:[
      {en:"Can I have some water, please?", de:"Kann ich bitte etwas Wasser haben?"},
      {en:"Dinner is ready!", de:"Das Abendessen ist fertig!"},
      {en:"I am hungry.", de:"Ich habe Hunger."},
      {en:"Would you like some tea?", de:"Möchtest du etwas Tee?"},
      {en:"Yes, please. / No, thank you.", de:"Ja, bitte. / Nein, danke."},
      {en:"It is time for bed.", de:"Es ist Zeit fürs Bett."},
      {en:"Have you got a brother or a sister?", de:"Hast du einen Bruder oder eine Schwester?"},
      {en:"Where do you live?", de:"Wo wohnst du?"}
    ],
    writing:[
      {t:"trans", de:"Wir wohnen in einer kleinen Wohnung.", a:"We live in a small flat.", alt:["We live in a small apartment."], why:"we + live in + a small flat."},
      {t:"trans", de:"Meine Schwester hat eine Gitarre.", a:"My sister has got a guitar.", alt:["My sister has a guitar."], why:"she -> has got."},
      {t:"trans", de:"Ich stehe um halb sieben auf.", a:"I get up at half past six.", why:"half past six = 6:30."},
      {t:"trans", de:"Mein Vater kocht sonntags.", a:"My father cooks on Sundays.", alt:["My father cooks on Sunday."], why:"he -> cooks mit -s."},
      {t:"trans", de:"Das ist das Zimmer meines Bruders.", a:"This is my brother's room.", alt:["That is my brother's room.","This is my brother's bedroom."], why:"Besitzer + 's + Ding."}
    ]
  },

  /* ---- Unit 2: A new week at Varndean -> Lesetext über den Schulalltag ---- */
  u2:{
    reading:{
      title:"My first day",
      text:"My name is Sam and today is my first day at my new school. The school is big and there are a lot of pupils. My classroom is on the first floor. There are twenty-four desks and two big windows. Our teacher is Mrs Bell. She is very nice and she is funny too. Lessons start at eight o'clock. My first lesson is maths and I am not very good at maths. But my favourite subject is art. We have art on Thursday.",
      qs:[
        {t:"mc", q:"Where is Sam's classroom?", opts:["on the first floor","in the garden","next to the door"], a:0, why:"My classroom is on the first floor."},
        {t:"mc", q:"When do the lessons start?", opts:["at nine","at eight","at seven"], a:1, why:"Lessons start at eight o'clock."},
        {t:"mc", q:"What is Sam's favourite subject?", opts:["maths","music","art"], a:2, why:"But my favourite subject is art."},
        {t:"mc", q:"How is the teacher?", opts:["nice and funny","late","angry"], a:0, why:"She is very nice and she is funny too."},
        {t:"gap", q:"There are ___ big windows in the classroom.", a:"two", why:"Im Text steht: and two big windows."}
      ]
    },
    everyday:[
      {en:"Can you repeat that, please?", de:"Kannst du das bitte wiederholen?"},
      {en:"How do you spell that?", de:"Wie schreibt man das?"},
      {en:"What does ... mean?", de:"Was bedeutet ...?"},
      {en:"May I go to the toilet, please?", de:"Darf ich bitte auf die Toilette?"},
      {en:"I am sorry I am late.", de:"Entschuldigung, dass ich zu spät bin."},
      {en:"I have forgotten my exercise book.", de:"Ich habe mein Heft vergessen."},
      {en:"Open your books at page ten.", de:"Schlagt eure Bücher auf Seite zehn auf."},
      {en:"What time is it?", de:"Wie spät ist es?"},
      {en:"It is half past eight.", de:"Es ist halb neun.", note:"half past eight = 8:30"}
    ],
    writing:[
      {t:"trans", de:"Meine Schultasche ist sehr schwer.", a:"My school bag is very heavy.", why:"My school bag + is + very heavy."},
      {t:"trans", de:"Der Unterricht beginnt um acht Uhr.", a:"Lessons start at eight o'clock.", alt:["School starts at eight o'clock.","The lessons start at eight o'clock."], why:"start at + Uhrzeit + o'clock."},
      {t:"trans", de:"Kannst du mir bitte helfen?", a:"Can you help me, please?", alt:["Can you help me please?"], why:"Can + you + Grundform help + me."},
      {t:"trans", de:"Es gibt zwanzig Schüler in meiner Klasse.", a:"There are twenty pupils in my class.", alt:["There are 20 pupils in my class.","There are twenty students in my class."], why:"Mehrzahl - also There are."},
      {t:"trans", de:"Mein Lieblingsfach ist Englisch.", a:"My favourite subject is English.", alt:["My favorite subject is English."], why:"My favourite subject is + Fach."}
    ]
  },

  u3:{
    reading:{
      title:"The Monday club",
      text:"Our school has got a lot of clubs. I am a member of the chess club. We meet every Monday after school. There are twelve members and our teacher Mr Owen is the trainer. I usually play two games. Sometimes I win, but I often lose against Nina. She is really good. My friend Leo does not like chess. He plays football twice a week and he goes swimming on Saturdays. Next month our club has a big match against another school. I am nervous but it is exciting.",
      qs:[
        {t:"mc", q:"How often does the chess club meet?", opts:["every day","every Monday","twice a week"], a:1, why:"We meet every Monday after school."},
        {t:"mc", q:"Who is really good at chess?", opts:["Leo","Mr Owen","Nina"], a:2, why:"I often lose against Nina. She is really good."},
        {t:"mc", q:"What does Leo do on Saturdays?", opts:["he goes swimming","he plays chess","he stays at home"], a:0, why:"he goes swimming on Saturdays."},
        {t:"mc", q:"How many members has the club got?", opts:["two","twelve","twenty"], a:1, why:"There are twelve members."},
        {t:"gap", q:"Leo plays football ___ a week.", a:"twice", why:"He plays football twice a week."}
      ]
    },
    everyday:[
      {en:"Do you want to join us?", de:"Willst du mitmachen?"},
      {en:"What is your hobby?", de:"Was ist dein Hobby?"},
      {en:"I am in the football team.", de:"Ich bin in der Fußballmannschaft."},
      {en:"That sounds like fun!", de:"Das klingt lustig!"},
      {en:"Sorry, I have not got time.", de:"Tut mir leid, ich habe keine Zeit."},
      {en:"See you at the sports ground.", de:"Wir sehen uns am Sportplatz."},
      {en:"Well done!", de:"Gut gemacht!"},
      {en:"Never mind.", de:"Macht nichts."}
    ],
    writing:[
      {t:"trans", de:"Ich spiele zweimal pro Woche Fußball.", a:"I play football twice a week.", why:"twice a week steht am Satzende."},
      {t:"trans", de:"Sie geht nie schwimmen.", a:"She never goes swimming.", why:"never steht vor dem Vollverb goes."},
      {t:"trans", de:"Spielst du Gitarre?", a:"Do you play the guitar?", why:"Do + you + Grundform. Bei Instrumenten: the guitar."},
      {t:"trans", de:"Mein Bruder hat viele Hobbys.", a:"My brother has got a lot of hobbies.", alt:["My brother has a lot of hobbies.","My brother has got many hobbies."], why:"a lot of + Mehrzahl hobbies."},
      {t:"trans", de:"Wir treffen uns normalerweise am Sportplatz.", a:"We usually meet at the sports ground.", why:"usually steht vor dem Vollverb meet."}
    ]
  },

  /* ---- Unit 4: Out and about in Brighton -> Lesetext Nachbarschaft/Wetter (present progressive) ---- */
  u4:{
    reading:{
      title:"Out and about",
      text:"It is a cloudy Saturday afternoon and we are out and about in our neighbourhood. The wind is quite strong today. My little brother is following our dog down the pavement. He is not listening to me because he is very busy. My mum is standing outside the bakery and she is talking to a neighbour. I am looking for the key to our post box but I cannot find it. Two cats are hiding behind a bench. They are waiting for the rain to stop! Now my dad is coming back from the post office with a letter. I am really happy, because it is a nice walk.",
      qs:[
        {t:"mc", q:"What is the little brother doing?", opts:["he is reading","he is following the dog","he is hiding"], a:1, why:"My little brother is following our dog down the pavement."},
        {t:"mc", q:"What is mum doing?", opts:["she is talking to a neighbour","she is looking for a key","she is running"], a:0, why:"she is talking to a neighbour."},
        {t:"mc", q:"What are the cats waiting for?", opts:["the bus","the rain to stop","their food"], a:1, why:"They are waiting for the rain to stop!"},
        {t:"mc", q:"How is the weather?", opts:["sunny and hot","cloudy and windy","snowy"], a:1, why:"It is a cloudy Saturday afternoon ... the wind is quite strong today."},
        {t:"gap", q:"Dad is coming back from the post ___ .", a:"office", why:"my dad is coming back from the post office with a letter."}
      ]
    },
    everyday:[
      {en:"What are you doing?", de:"Was machst du gerade?"},
      {en:"I am just looking, thanks.", de:"Ich schaue nur, danke."},
      {en:"It is a lovely day.", de:"Es ist ein schöner Tag."},
      {en:"Be careful!", de:"Sei vorsichtig!"},
      {en:"How much does this cost, please?", de:"Wie viel kostet das bitte?"},
      {en:"Wait for me!", de:"Warte auf mich!"},
      {en:"What's the matter?", de:"Was ist denn los?"},
      {en:"Look at that!", de:"Schau dir das an!"}
    ],
    writing:[
      {t:"trans", de:"Es regnet gerade.", a:"It is raining.", why:"It -> is + raining."},
      {t:"trans", de:"Die Kinder spielen gerade auf dem Gehweg.", a:"The children are playing on the pavement.", why:"children = they -> are + playing."},
      {t:"trans", de:"Ich suche meinen Schlüssel.", a:"I am looking for my key.", alt:["I'm looking for my key."], why:"gerade jetzt -> I am looking for."},
      {t:"trans", de:"Es gibt hier keine Briefkästen.", a:"There are not any post boxes here.", alt:["There aren't any post boxes here.","There are no post boxes here."], why:"Verneinung: not any."},
      {t:"trans", de:"Was machst du gerade?", a:"What are you doing?", why:"Fragewort + are + you + Verb mit -ing."}
    ]
  },

  /* ---- Extra: Vergangenheit & Zukunftspläne -> Lesetext über ein Wochenende ---- */
  u5:{
    reading:{
      title:"A rainy weekend",
      text:"Last weekend was not very good. On Saturday morning it rained a lot. My sister and I wanted to go to the park, but we stayed at home. In the afternoon we watched two films and made a big cake. On Sunday the weather was better. We took the bus into town and went to the museum. The tickets were only three pounds. After that we walked to the market and I bought a small present for my mum. In the evening I was very tired but happy.",
      qs:[
        {t:"mc", q:"Why did they stay at home on Saturday?", opts:["they were ill","it rained","the bus was late"], a:1, why:"On Saturday morning it rained a lot."},
        {t:"mc", q:"What did they do on Saturday afternoon?", opts:["they went to the museum","they played football","they watched films and made a cake"], a:2, why:"we watched two films and made a big cake."},
        {t:"mc", q:"How did they go into town?", opts:["by bus","by train","by bike"], a:0, why:"We took the bus into town."},
        {t:"mc", q:"How much were the tickets?", opts:["three pounds","five pounds","ten pounds"], a:0, why:"The tickets were only three pounds."},
        {t:"gap", q:"He bought a present for his ___ .", a:"mum", why:"I bought a small present for my mum."}
      ]
    },
    everyday:[
      {en:"How was your weekend?", de:"Wie war dein Wochenende?"},
      {en:"It was great, thanks.", de:"Es war toll, danke."},
      {en:"What did you do?", de:"Was hast du gemacht?"},
      {en:"I went to the cinema.", de:"Ich war im Kino."},
      {en:"Two tickets, please.", de:"Zwei Karten, bitte."},
      {en:"How much is it?", de:"Wie viel kostet das?"},
      {en:"Where is the station?", de:"Wo ist der Bahnhof?"},
      {en:"Have a nice weekend!", de:"Schönes Wochenende!"}
    ],
    writing:[
      {t:"trans", de:"Wir haben letzte Woche meine Großeltern besucht.", a:"We visited my grandparents last week.", alt:["Last week we visited my grandparents."], why:"visit + ed = visited. Zeitangabe am Ende."},
      {t:"trans", de:"Ich bin gestern zum Strand gelaufen.", a:"I walked to the beach yesterday.", alt:["Yesterday I walked to the beach."], why:"walk + ed = walked."},
      {t:"trans", de:"Sie hat eine neue Jacke gekauft.", a:"She bought a new jacket.", why:"buy ist unregelmaessig: bought."},
      {t:"trans", de:"Wir sind nicht ins Museum gegangen.", a:"We did not go to the museum.", alt:["We didn't go to the museum."], why:"didn't + Grundform go."},
      {t:"trans", de:"Das Wetter war schrecklich.", a:"The weather was terrible.", why:"The weather = it -> was."}
    ]
  }

  };
})(window);
