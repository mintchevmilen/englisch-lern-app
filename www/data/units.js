/* =============================================================
   data/units.js  –  Struktur der Lernbereiche
   -------------------------------------------------------------
   Stand: an das Inhaltsverzeichnis und das Grammar-and-Practice-
   Verzeichnis des echten Schulbuchs angeglichen (Fotos vom
   09.2026). Titel, Reihenfolge und Grammatikprogression sind
   damit bestätigt (titleConfirmed: true).

   NEUE VOKABELN HINZUFUEGEN: siehe data/vocabulary.js
   NEUE UNIT HINZUFUEGEN (z.B. Access 2): hier einen weiteren
   Eintrag anlegen und in data/vocabulary.js eine passende Liste
   z.B. "u6: [...]" ergänzen.
   ============================================================= */
(function (w) {
  var D = w.DATA = w.DATA || {};

  D.meta = {
    course: 'Access 1 – Allgemeine Ausgabe 2022 (Cornelsen)',
    grade: '5. Schuljahr',
    isbn: '978-3-06-033978-5',
    disclaimer: 'Eigenstaendige Lern-App. Orientiert sich an Themen- und ' +
      'Grammatikbereichen des Lehrwerks. Keine Übungen, Beispielsätze oder ' +
      'Lesetexte aus dem Schulbuch übernommen.',
    version: '2.1.0'
  };

  D.units = [
    {
      id: 'u0', no: 0,
      title: 'Welcome',
      titleDe: 'Willkommen',
      titleConfirmed: true,
      color: '#0EA5E9',
      intro: 'Erste Wörter und Sätze: Begrüßung, Zahlen, Farben, Schulsachen',
      topics: ['Begrüßung & Vorstellen', 'Zahlen 1–12', 'Farben', 'Wochentage', 'Schulsachen', 'Im Klassenzimmer'],
      grammar: []
    },
    {
      id: 'u1', no: 1,
      title: 'At home with friends',
      titleDe: 'Zuhause mit Freunden',
      titleConfirmed: true,
      color: '#2563EB',
      intro: 'Familie, Zuhause und Zimmer beschreiben, Besuch bei Freunden',
      topics: ['Familie', 'Haus & Zimmer', 'Möbel', 'Komplimente machen', 'can / can’t'],
      grammar: ['g_be', 'g_pronouns', 'g_possessive', 'g_genitive', 'g_plural', 'g_article', 'g_there', 'g_can', 'g_qwords']
    },
    {
      id: 'u2', no: 2,
      title: 'A new week at Varndean',
      titleDe: 'Eine neue Woche an der Varndean-Schule',
      titleConfirmed: true,
      color: '#7C3AED',
      intro: 'Schulfächer, Schulalltag, Uhrzeit, Regeln im Klassenzimmer',
      topics: ['Schulfächer & Schulorte', 'Tagesablauf', 'Uhrzeit', 'Monate & Datum', 'Klassenzimmerregeln'],
      grammar: ['g_simplepresent', 'g_imperative', 'g_wordorder', 'g_irregular_plural', 'g_this_that', 'g_object_pron']
    },
    {
      id: 'u3', no: 3,
      title: 'In our free time',
      titleDe: 'In unserer Freizeit',
      titleConfirmed: true,
      color: '#16A34A',
      intro: 'Hobbys, Schul-AGs, Interviews führen, Essen und Rezepte',
      topics: ['Hobbys & Freizeit', 'Schul-AGs', 'Fragen stellen', 'Essen & Rezepte', 'Mengenangaben'],
      grammar: ['g_sp_questions', 'g_frequency', 'g_prepositions', 'g_countable_uncountable', 'g_much_many', 'g_wantto_haveto']
    },
    {
      id: 'u4', no: 4,
      title: 'Out and about in Brighton',
      titleDe: 'Unterwegs in Brighton',
      titleConfirmed: true,
      color: '#0891B2',
      intro: 'Wetter, was gerade passiert, Orte und Wege in der Nachbarschaft',
      topics: ['Wetter', 'Sehenswürdigkeiten & Nachbarschaft', 'Beschreiben, was gerade passiert', 'Wegbeschreibungen', 'Ein Bild beschreiben'],
      grammar: ['g_progressive', 'g_prog_vs_simple']
    },
    {
      id: 'u5', no: 5,
      title: 'Extra',
      titleDe: 'Extra: Vergangenheit & Zukunftspläne',
      titleConfirmed: true,
      color: '#EA580C',
      intro: 'Einen Tagebucheintrag über einen Ausflug schreiben, Pläne für die Zukunft',
      topics: ['Wochenende & Ausflüge', 'Über Vergangenes berichten', 'Zukunftspläne mit going to'],
      grammar: ['g_was_were', 'g_past_regular', 'g_past_irregular', 'g_past_neg_q', 'g_going_to']
    }
  ];

  /* Reihenfolge und Beschriftung der Lektionstypen innerhalb einer Unit. */
  D.lessonTypes = [
    { type: 'vocabulary', icon: '📚', label: 'Vocabulary', sub: 'Neue Wörter lernen' },
    { type: 'grammar',    icon: '🧩', label: 'Grammar',    sub: 'Grammatik verstehen und üben' },
    { type: 'listening',  icon: '👂', label: 'Listening',  sub: 'Hörverständnis' },
    { type: 'reading',    icon: '📖', label: 'Reading',    sub: 'Leseverständnis' },
    { type: 'speaking',   icon: '💬', label: 'Speaking',   sub: 'Nachsprechen & Aussprache' },
    { type: 'writing',    icon: '✍️', label: 'Writing',    sub: 'Eigene Sätze schreiben' },
    { type: 'everyday',   icon: '🌍', label: 'Everyday English', sub: 'Alltagsenglisch' },
    { type: 'challenge',  icon: '🏆', label: 'Unit Challenge',   sub: 'Abschlusstest' }
  ];

  /* Levelsystem – haengt ausschliesslich an den XP. */
  D.levels = [
    { lvl: 1, name: 'Beginner',        xp: 0 },
    { lvl: 2, name: 'Explorer',        xp: 250 },
    { lvl: 3, name: 'English Starter', xp: 700 },
    { lvl: 4, name: 'English Player',  xp: 1500 },
    { lvl: 5, name: 'English Pro',     xp: 2800 },
    { lvl: 6, name: 'English Master',  xp: 4800 },
    { lvl: 7, name: 'English Legend',  xp: 8000 }
  ];

  D.xp = {
    wordLearned: 5, correct: 5, streak5: 10,
    lessonDone: 25, unitDone: 100, testPassed: 150, dailyMission: 75
  };

  D.achievements = [
    { id: 'a_xp100',   icon: '🏆', name: 'First 100 XP',       desc: 'Sammle 100 XP.' },
    { id: 'a_xp1000',  icon: '💎', name: '1000 XP',            desc: 'Sammle 1.000 XP.' },
    { id: 'a_streak3', icon: '🔥', name: '3 Day Streak',       desc: 'Lerne 3 Tage hintereinander.' },
    { id: 'a_streak7', icon: '🔥', name: '7 Day Streak',       desc: 'Lerne 7 Tage hintereinander.' },
    { id: 'a_streak30',icon: '☄️', name: '30 Day Streak',      desc: 'Lerne 30 Tage hintereinander.' },
    { id: 'a_perfect', icon: '🎯', name: 'Perfect Quiz',       desc: 'Beende eine Lektion ohne Fehler.' },
    { id: 'a_words50', icon: '📗', name: '50 Words',           desc: '50 Wörter mindestens einmal richtig.' },
    { id: 'a_words200',icon: '📘', name: '200 Words',          desc: '200 Wörter mindestens einmal richtig.' },
    { id: 'a_master25',icon: '⭐', name: 'Vocabulary Master',        desc: '25 Wörter gemeistert.' },
    { id: 'a_grammar', icon: '🧠', name: 'Grammar Hero',       desc: 'Schließe 5 Grammatik-Lektionen ab.' },
    { id: 'a_unit1',   icon: '🎖️', name: 'Unit Champion',desc: 'Schließe eine komplette Unit ab.' },
    { id: 'a_test',    icon: '📜', name: 'Test Ready',         desc: 'Bestehe einen Unit-Test mit 80 % oder mehr.' },
    { id: 'a_games',   icon: '🎮', name: 'Game On',            desc: 'Spiele alle drei Spiele.' },
    { id: 'a_mission', icon: '🎯', name: 'Mission Complete',   desc: 'Schaffe 5 Tagesmissionen.' }
  ];
})(window);
