/* Kyrillisches Alphabet, Schritt für Schritt. Weitere Buchstaben können hier
   einfach angehängt werden (in data/lessons.js dann einer neuen Lektion
   zuordnen, z.B. "alphabet-2"). */

window.BG_ALPHABET = [
  { id: "a", upper: "А", lower: "а", sound: "a", soundHint: 'wie "a" in Ananas', example: { bg: "автобус", de: "Bus", emoji: "🚌" } },
  { id: "b", upper: "Б", lower: "б", sound: "b", soundHint: 'wie "b" in Ball', example: { bg: "баба", de: "Oma", emoji: "👵" } },
  { id: "v", upper: "В", lower: "в", sound: "v", soundHint: 'wie "w" in Wasser', example: { bg: "вода", de: "Wasser", emoji: "💧" } },
  { id: "g", upper: "Г", lower: "г", sound: "g", soundHint: 'wie "g" in Garten', example: { bg: "гъба", de: "Pilz", emoji: "🍄" } },
  { id: "d", upper: "Д", lower: "д", sound: "d", soundHint: 'wie "d" in Dach', example: { bg: "дом", de: "Zuhause", emoji: "🏠" } },
  { id: "e", upper: "Е", lower: "е", sound: "e", soundHint: 'wie "e" in Elefant', example: { bg: "еднорог", de: "Einhorn", emoji: "🦄" } },
  { id: "zh", upper: "Ж", lower: "ж", sound: "sch", soundHint: 'weiches "j" wie in Journal', example: { bg: "жаба", de: "Frosch", emoji: "🐸" } },
  { id: "z", upper: "З", lower: "з", sound: "s", soundHint: 'weiches "s" wie in Sonne', example: { bg: "заек", de: "Hase", emoji: "🐰" } },
  { id: "i", upper: "И", lower: "и", sound: "i", soundHint: 'wie "i" in Igel', example: { bg: "игра", de: "Spiel", emoji: "🎮" } },
  { id: "y", upper: "Й", lower: "й", sound: "j", soundHint: 'kurzes "i"', example: { bg: "йогурт", de: "Joghurt", emoji: "🥛" } },
  { id: "k", upper: "К", lower: "к", sound: "k", soundHint: 'wie "k" in Katze', example: { bg: "котка", de: "Katze", emoji: "🐱" } },
  { id: "l", upper: "Л", lower: "л", sound: "l", soundHint: 'wie "l" in Lampe', example: { bg: "луна", de: "Mond", emoji: "🌙" } },
  { id: "m", upper: "М", lower: "м", sound: "m", soundHint: 'wie "m" in Mama', example: { bg: "мама", de: "Mama", emoji: "👩" } },
  { id: "n", upper: "Н", lower: "н", sound: "n", soundHint: 'wie "n" in Nase', example: { bg: "нос", de: "Nase", emoji: "👃" } },
  { id: "o", upper: "О", lower: "о", sound: "o", soundHint: 'wie "o" in Ofen', example: { bg: "огън", de: "Feuer", emoji: "🔥" } },
  { id: "p", upper: "П", lower: "п", sound: "p", soundHint: 'wie "p" in Papa', example: { bg: "пица", de: "Pizza", emoji: "🍕" } },
  { id: "r", upper: "Р", lower: "р", sound: "r", soundHint: 'gerolltes "r" wie in Rakete', example: { bg: "риба", de: "Fisch", emoji: "🐟" } },
  { id: "s", upper: "С", lower: "с", sound: "s", soundHint: 'scharfes "s" wie in Bus', example: { bg: "слон", de: "Elefant", emoji: "🐘" } },
  { id: "t", upper: "Т", lower: "т", sound: "t", soundHint: 'wie "t" in Tasche', example: { bg: "топка", de: "Ball", emoji: "⚽" } },
  { id: "u", upper: "У", lower: "у", sound: "u", soundHint: 'wie "u" in Uhu', example: { bg: "уста", de: "Mund", emoji: "👄" } },
  { id: "f", upper: "Ф", lower: "ф", sound: "f", soundHint: 'wie "f" in Fisch', example: { bg: "фея", de: "Fee", emoji: "🧚" } },
  { id: "h", upper: "Х", lower: "х", sound: "ch", soundHint: 'wie "ch" in Bach', example: { bg: "хляб", de: "Brot", emoji: "🍞" } },
  { id: "c", upper: "Ц", lower: "ц", sound: "z", soundHint: 'wie "z" in Zebra', example: { bg: "цвете", de: "Blume", emoji: "🌸" } },
  { id: "ch", upper: "Ч", lower: "ч", sound: "tsch", soundHint: 'wie "tsch" in Tschüss', example: { bg: "чай", de: "Tee", emoji: "🍵" } },
  { id: "sh", upper: "Ш", lower: "ш", sound: "sch", soundHint: 'wie "sch" in Schule', example: { bg: "шапка", de: "Mütze", emoji: "🧢" } },
  { id: "sht", upper: "Щ", lower: "щ", sound: "scht", soundHint: "wie „scht“ in Geschichte (zwei Laute: sch und t)", example: { bg: "щъркел", de: "Storch", emoji: "🐦" } },
  { id: "hard", upper: "Ъ", lower: "ъ", sound: "a", soundHint: "dumpfer, kurzer Laut, ähnlich dem „e“ in „Gabe“", example: { bg: "къща", de: "Haus", emoji: "🏡" } },
  { id: "soft", upper: "Ь", lower: "ь", sound: "j", soundHint: "kein eigener Laut: macht den Buchstaben davor weich (steht nur vor „о“)", example: { bg: "синьо", de: "blau", emoji: "🔵" } },
  { id: "yu", upper: "Ю", lower: "ю", sound: "ju", soundHint: "wie „ju“ in Juli", example: { bg: "юрган", de: "Bettdecke", emoji: "🛏️" } },
  { id: "ya", upper: "Я", lower: "я", sound: "ja", soundHint: "wie „ja“ in Jacke", example: { bg: "ябълка", de: "Apfel", emoji: "🍎" } }
];
