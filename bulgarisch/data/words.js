/* Wortschatz-Datenbank. Neue Wörter einfach als neues Objekt in die passende
   Kategorie einfügen. Felder: id (eindeutig, a-z0-9-), bg (Bulgarisch),
   de (Deutsch), latin (Aussprachehilfe), emoji (Bild-Ersatz), category.
   Optional: genderVariant {male:{bg,latin}, female:{bg,latin}} für Wörter,
   die je nach Geschlecht anders lauten (z.B. Lehrer/Lehrerin). */

window.BG_WORDS = [
  // Familie
  { id: "mama", bg: "мама", de: "Mama", latin: "mama", emoji: "👩", category: "familie" },
  { id: "tati", bg: "тати", de: "Papa", latin: "tati", emoji: "👨", category: "familie" },
  { id: "baba", bg: "баба", de: "Oma", latin: "baba", emoji: "👵", category: "familie" },
  { id: "dyado", bg: "дядо", de: "Opa", latin: "dyado", emoji: "👴", category: "familie" },
  { id: "sestra", bg: "сестра", de: "Schwester", latin: "sestra", emoji: "👧", category: "familie" },
  { id: "brat", bg: "брат", de: "Bruder", latin: "brat", emoji: "👦", category: "familie" },
  { id: "semeystvo", bg: "семейство", de: "Familie", latin: "semeystvo", emoji: "👨‍👩‍👧‍👦", category: "familie" },

  // Zuhause
  { id: "dom", bg: "дом", de: "Zuhause", latin: "dom", emoji: "🏠", category: "zuhause" },
  { id: "kashta", bg: "къща", de: "Haus", latin: "kashta", emoji: "🏡", category: "zuhause" },
  { id: "masa", bg: "маса", de: "Tisch", latin: "masa", emoji: "🍽️", category: "zuhause" },
  { id: "stol", bg: "стол", de: "Stuhl", latin: "stol", emoji: "🪑", category: "zuhause" },
  { id: "vrata", bg: "врата", de: "Tür", latin: "vrata", emoji: "🚪", category: "zuhause" },
  { id: "leglo", bg: "легло", de: "Bett", latin: "leglo", emoji: "🛏️", category: "zuhause" },
  { id: "kuhnya", bg: "кухня", de: "Küche", latin: "kuhnya", emoji: "🍳", category: "zuhause" },
  { id: "prozorec", bg: "прозорец", de: "Fenster", latin: "prozorets", emoji: "🪟", category: "zuhause" },
  { id: "staya", bg: "стая", de: "Zimmer", latin: "staya", emoji: "🛋️", category: "zuhause" },

  // Essen & Trinken
  { id: "voda", bg: "вода", de: "Wasser", latin: "voda", emoji: "💧", category: "essen" },
  { id: "hlyab", bg: "хляб", de: "Brot", latin: "hlyab", emoji: "🍞", category: "essen" },
  { id: "mlyako", bg: "мляко", de: "Milch", latin: "mlyako", emoji: "🥛", category: "essen" },
  { id: "yabalka", bg: "ябълка", de: "Apfel", latin: "yabalka", emoji: "🍎", category: "essen" },
  { id: "banan", bg: "банан", de: "Banane", latin: "banan", emoji: "🍌", category: "essen" },
  { id: "sirene", bg: "сирене", de: "Käse", latin: "sirene", emoji: "🧀", category: "essen" },
  { id: "yaytse", bg: "яйце", de: "Ei", latin: "yaytse", emoji: "🥚", category: "essen" },
  { id: "sok", bg: "сок", de: "Saft", latin: "sok", emoji: "🧃", category: "essen" },
  { id: "chay", bg: "чай", de: "Tee", latin: "chay", emoji: "🍵", category: "essen" },
  { id: "supa", bg: "супа", de: "Suppe", latin: "supa", emoji: "🍲", category: "essen" },
  { id: "shokolad", bg: "шоколад", de: "Schokolade", latin: "shokolad", emoji: "🍫", category: "essen" },

  // Tiere
  { id: "kuche", bg: "куче", de: "Hund", latin: "kutscheh", emoji: "🐶", category: "tiere" },
  { id: "kotka", bg: "котка", de: "Katze", latin: "kotka", emoji: "🐱", category: "tiere" },
  { id: "riba", bg: "риба", de: "Fisch", latin: "riba", emoji: "🐟", category: "tiere" },
  { id: "ptitsa", bg: "птица", de: "Vogel", latin: "ptiza", emoji: "🐦", category: "tiere" },
  { id: "zaek", bg: "заек", de: "Hase", latin: "sayek", emoji: "🐰", category: "tiere" },
  { id: "kon", bg: "кон", de: "Pferd", latin: "kon", emoji: "🐴", category: "tiere" },
  { id: "krava", bg: "крава", de: "Kuh", latin: "krawa", emoji: "🐮", category: "tiere" },
  { id: "meche", bg: "мече", de: "Teddybär", latin: "metscheh", emoji: "🧸", category: "tiere" },

  // Schule
  { id: "uchilishte", bg: "училище", de: "Schule", latin: "utschilischte", emoji: "🏫", category: "schule" },
  {
    id: "uchitel", bg: "учител", de: "Lehrer", latin: "utschitel", emoji: "👨‍🏫", category: "schule",
    genderVariant: { male: { bg: "учител", latin: "utschitel" }, female: { bg: "учителка", latin: "utschitelka" } }
  },
  { id: "kniga", bg: "книга", de: "Buch", latin: "kniga", emoji: "📖", category: "schule" },
  { id: "tetradka", bg: "тетрадка", de: "Heft", latin: "tetradka", emoji: "📓", category: "schule" },
  { id: "moliv", bg: "молив", de: "Bleistift", latin: "moliw", emoji: "✏️", category: "schule" },
  { id: "chanta", bg: "чанта", de: "Schultasche", latin: "tschanta", emoji: "🎒", category: "schule" },
  { id: "zvanets", bg: "звънец", de: "Klingel", latin: "swanez", emoji: "🔔", category: "schule" },

  // Urlaub
  { id: "more", bg: "море", de: "Meer", latin: "moreh", emoji: "🌊", category: "urlaub" },
  { id: "plazh", bg: "плаж", de: "Strand", latin: "plash", emoji: "🏖️", category: "urlaub" },
  { id: "slantse", bg: "слънце", de: "Sonne", latin: "slanzeh", emoji: "☀️", category: "urlaub" },
  { id: "hotel", bg: "хотел", de: "Hotel", latin: "hotel", emoji: "🏨", category: "urlaub" },
  { id: "rakovina", bg: "раковина", de: "Muschel", latin: "rakowina", emoji: "🐚", category: "urlaub" },
  { id: "lodka", bg: "лодка", de: "Boot", latin: "lodka", emoji: "⛵", category: "urlaub" },

  // Alltag
  { id: "drehi", bg: "дрехи", de: "Kleidung", latin: "drechi", emoji: "👕", category: "alltag" },
  { id: "obuvki", bg: "обувки", de: "Schuhe", latin: "obuwki", emoji: "👟", category: "alltag" },
  { id: "yake", bg: "яке", de: "Jacke", latin: "yakeh", emoji: "🧥", category: "alltag" },
  { id: "shapka", bg: "шапка", de: "Mütze", latin: "schapka", emoji: "🧢", category: "alltag" },
  { id: "chorapi", bg: "чорапи", de: "Socken", latin: "tschorapi", emoji: "🧦", category: "alltag" },

  // Freizeit & Mehr
  { id: "kola", bg: "кола", de: "Auto", latin: "kola", emoji: "🚗", category: "freizeit" },
  { id: "topka", bg: "топка", de: "Ball", latin: "topka", emoji: "⚽", category: "freizeit" },
  {
    id: "priyatel", bg: "приятел", de: "Freund", latin: "priyatel", emoji: "🧑‍🤝‍🧑", category: "freizeit",
    genderVariant: { male: { bg: "приятел", latin: "priyatel" }, female: { bg: "приятелка", latin: "priyatelka" } }
  },
  { id: "igrachka", bg: "играчка", de: "Spielzeug", latin: "igratschka", emoji: "🪀", category: "freizeit" },
  { id: "slon", bg: "слон", de: "Elefant", latin: "slon", emoji: "🐘", category: "freizeit" },
  { id: "lav", bg: "лъв", de: "Löwe", latin: "lav", emoji: "🦁", category: "freizeit" },
  { id: "zvezda", bg: "звезда", de: "Stern", latin: "swesda", emoji: "⭐", category: "freizeit" },
  { id: "luna", bg: "луна", de: "Mond", latin: "luna", emoji: "🌙", category: "freizeit" },
  { id: "daga", bg: "дъга", de: "Regenbogen", latin: "daga", emoji: "🌈", category: "freizeit" },
  { id: "tsvete", bg: "цвете", de: "Blume", latin: "zweteh", emoji: "🌸", category: "freizeit" },
  { id: "darvo", bg: "дърво", de: "Baum", latin: "darwo", emoji: "🌳", category: "freizeit" },

  // Zahlen,
  { id: "eins", bg: "едно", de: "eins", latin: "edno", emoji: "1️⃣", category: "zahlen" },
  { id: "zwei", bg: "две", de: "zwei", latin: "dwe", emoji: "2️⃣", category: "zahlen" },
  { id: "drei", bg: "три", de: "drei", latin: "tri", emoji: "3️⃣", category: "zahlen" },
  { id: "vier", bg: "четири", de: "vier", latin: "tschetiri", emoji: "4️⃣", category: "zahlen" },
  { id: "fuenf", bg: "пет", de: "fünf", latin: "pet", emoji: "5️⃣", category: "zahlen" },
  { id: "sechs", bg: "шест", de: "sechs", latin: "schest", emoji: "6️⃣", category: "zahlen" },
  { id: "sieben", bg: "седем", de: "sieben", latin: "sedem", emoji: "7️⃣", category: "zahlen" },
  { id: "acht", bg: "осем", de: "acht", latin: "osem", emoji: "8️⃣", category: "zahlen" },
  { id: "neun", bg: "девет", de: "neun", latin: "dewet", emoji: "9️⃣", category: "zahlen" },
  { id: "zehn", bg: "десет", de: "zehn", latin: "deset", emoji: "🔟", category: "zahlen" },

  // Farben,
  { id: "rot", bg: "червено", de: "rot", latin: "tscherweno", emoji: "🔴", category: "farben" },
  { id: "blau", bg: "синьо", de: "blau", latin: "sinjo", emoji: "🔵", category: "farben" },
  { id: "gruen", bg: "зелено", de: "grün", latin: "seleno", emoji: "🟢", category: "farben" },
  { id: "gelb", bg: "жълто", de: "gelb", latin: "schalto", emoji: "🟡", category: "farben" },
  { id: "weiss", bg: "бяло", de: "weiß", latin: "bjalo", emoji: "⚪", category: "farben" },
  { id: "schwarz", bg: "черно", de: "schwarz", latin: "tscherno", emoji: "⚫", category: "farben" },
  { id: "orange", bg: "оранжево", de: "orange", latin: "oranschewo", emoji: "🟠", category: "farben" },
  { id: "lila", bg: "лилаво", de: "lila", latin: "lilawo", emoji: "🟣", category: "farben" },
  { id: "braun", bg: "кафяво", de: "braun", latin: "kafjawo", emoji: "🟤", category: "farben" },

  // Körper,
  { id: "glawa", bg: "глава", de: "Kopf", latin: "glawa", emoji: "🙂", category: "koerper" },
  { id: "oko", bg: "око", de: "Auge", latin: "oko", emoji: "👁️", category: "koerper" },
  { id: "nos", bg: "нос", de: "Nase", latin: "nos", emoji: "👃", category: "koerper" },
  { id: "usta", bg: "уста", de: "Mund", latin: "usta", emoji: "👄", category: "koerper" },
  { id: "uho", bg: "ухо", de: "Ohr", latin: "ucho", emoji: "👂", category: "koerper" },
  { id: "raka", bg: "ръка", de: "Hand", latin: "raka", emoji: "✋", category: "koerper" },
  { id: "krak", bg: "крак", de: "Fuß", latin: "krak", emoji: "🦶", category: "koerper" },
  { id: "zab", bg: "зъб", de: "Zahn", latin: "sab", emoji: "🦷", category: "koerper" },

  // Natur & Wetter,
  { id: "dazhd", bg: "дъжд", de: "Regen", latin: "dascht", emoji: "🌧️", category: "natur" },
  { id: "snyag", bg: "сняг", de: "Schnee", latin: "snjag", emoji: "❄️", category: "natur" },
  { id: "vyatar", bg: "вятър", de: "Wind", latin: "wjatar", emoji: "💨", category: "natur" },
  { id: "oblak", bg: "облак", de: "Wolke", latin: "oblak", emoji: "☁️", category: "natur" },
  { id: "ogan", bg: "огън", de: "Feuer", latin: "ogan", emoji: "🔥", category: "natur" }
];

window.BG_CATEGORIES = {
  familie: { title: "Familie", icon: "👨‍👩‍👧" },
  zuhause: { title: "Zuhause", icon: "🏠" },
  essen: { title: "Essen & Trinken", icon: "🍎" },
  tiere: { title: "Tiere", icon: "🐶" },
  schule: { title: "Schule", icon: "🏫" },
  urlaub: { title: "Urlaub", icon: "🏖️" },
  alltag: { title: "Alltag", icon: "👕" },
  freizeit: { title: "Freizeit & Mehr", icon: "🎈" },
  zahlen: { title: "Zahlen", icon: "🔢" },
  farben: { title: "Farben", icon: "🎨" },
  koerper: { title: "Körper", icon: "🧍" },
  natur: { title: "Natur & Wetter", icon: "🌦️" },
  familienwoerter: { title: "Unsere Familie", icon: "❤️" }
};
