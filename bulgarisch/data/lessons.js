/* Der Lernpfad. Jede Lektion verweist per ID auf Wörter/Buchstaben/Sätze/
   Dialoge aus den anderen data/*.js Dateien. Neue Lektion hinzufügen =
   neues Objekt an das Array anhängen (Reihenfolge = Reihenfolge im Pfad).
   type: "words" | "alphabet" | "sentences" | "dialogue" | "mixed"
   game:  "bilderquiz" | "hoerquiz" | "buchstabenjagd" | "memory" | "satzbau" | null */

window.BG_LESSONS = [
  {
    id: "erste-woerter",
    icon: "🌱",
    title: "Erste Wörter",
    type: "words",
    wordIds: ["mama", "tati", "kuche", "kotka", "voda", "topka"],
    game: "bilderquiz"
  },
  {
    id: "alphabet-1",
    icon: "🔤",
    title: "Alphabet",
    type: "alphabet",
    letterIds: ["a", "b", "v", "g", "d", "e", "zh", "z", "i", "y"],
    game: "buchstabenjagd"
  },
  {
    id: "alphabet-2",
    icon: "🔠",
    title: "Alphabet 2",
    type: "alphabet",
    letterIds: ["k", "l", "m", "n", "o", "p", "r", "s", "t", "u"],
    game: "buchstabenjagd"
  },
  {
    id: "familie",
    icon: "👨‍👩‍👧",
    title: "Familie",
    type: "words",
    wordIds: ["mama", "tati", "baba", "dyado", "sestra", "brat", "semeystvo"],
    game: "memory"
  },
  {
    id: "zuhause",
    icon: "🏠",
    title: "Zuhause",
    type: "words",
    wordIds: ["dom", "kashta", "masa", "stol", "vrata", "leglo", "kuhnya", "prozorec", "staya"],
    game: "hoerquiz"
  },
  {
    id: "essen",
    icon: "🍎",
    title: "Essen & Trinken",
    type: "words",
    wordIds: ["voda", "hlyab", "mlyako", "yabalka", "banan", "sirene", "yaytse", "sok", "chay", "supa", "shokolad"],
    game: "bilderquiz"
  },
  {
    id: "erste-saetze",
    icon: "🗣️",
    title: "Erste Sätze",
    type: "sentences",
    sentenceIds: ["hallo", "wie-gehts", "gut", "ja", "nein", "bitte", "danke", "hunger", "durst"],
    game: "satzbau"
  },
  {
    id: "alphabet-3",
    icon: "🔡",
    title: "Alphabet 3",
    type: "alphabet",
    letterIds: ["f", "h", "c", "ch", "sh", "sht", "hard", "soft", "yu", "ya"],
    game: "buchstabenjagd"
  },
  {
    id: "urlaub",
    icon: "🏖️",
    title: "Urlaub",
    type: "words",
    wordIds: ["more", "plazh", "slantse", "hotel", "rakovina", "lodka"],
    game: "memory"
  },
  {
    id: "zahlen",
    icon: "🔢",
    title: "Zahlen",
    type: "words",
    wordIds: ["eins", "zwei", "drei", "vier", "fuenf", "sechs", "sieben", "acht", "neun", "zehn"],
    game: "hoerquiz"
  },
  {
    id: "farben",
    icon: "🎨",
    title: "Farben",
    type: "words",
    wordIds: ["rot", "blau", "gruen", "gelb", "weiss", "schwarz", "orange", "lila", "braun"],
    game: "bilderquiz"
  },
  {
    id: "koerper",
    icon: "🧍",
    title: "Körper",
    type: "words",
    wordIds: ["glawa", "oko", "nos", "usta", "uho", "raka", "krak", "zab"],
    game: "memory"
  },
  {
    id: "fragen",
    icon: "❓",
    title: "Fragen stellen",
    type: "sentences",
    sentenceIds: ["wie-alt", "was-ist-das", "wo-ist", "welche-farbe", "wie-viele", "ich-sehe"],
    game: "satzbau"
  },
  {
    id: "natur",
    icon: "🌦️",
    title: "Natur & Wetter",
    type: "words",
    wordIds: ["dazhd", "snyag", "vyatar", "oblak", "ogan"],
    game: "memory"
  },
  {
    id: "gespraeche",
    icon: "💬",
    title: "Kleine Gespräche",
    type: "dialogue",
    dialogueIds: ["wie-si", "kakvo-iskash", "dobro-utro"],
    game: null
  },
  {
    id: "abenteuer",
    icon: "🇧🇬",
    title: "Bulgarisch-Abenteuer",
    type: "mixed",
    wordIds: ["kuche", "kotka", "riba", "ptitsa", "zaek", "kon", "krava", "meche",
      "uchilishte", "uchitel", "kniga", "tetradka", "moliv", "chanta", "zvanets",
      "drehi", "obuvki", "yake", "shapka", "chorapi",
      "kola", "topka", "priyatel", "igrachka", "slon", "lav", "zvezda", "luna", "daga", "tsvete", "darvo"],
    game: "hoerquiz"
  }
];

window.BG_LEVELS = [
  { minXp: 0, icon: "🌱", title: "Bulgarisch-Anfänger" },
  { minXp: 100, icon: "🐣", title: "Wort-Entdecker" },
  { minXp: 300, icon: "🗣️", title: "Bulgarisch-Sprecher" },
  { minXp: 600, icon: "🇧🇬", title: "Bulgarisch-Profi" },
  { minXp: 1000, icon: "🏆", title: "Bulgarisch-Meister" }
];
