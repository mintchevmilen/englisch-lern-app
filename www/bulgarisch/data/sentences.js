/* Alltagssätze. genderVariant wird genutzt, wenn Junge/Mädchen unterschiedliche
   Formen sagen (z.B. "Гладен съм." / "Гладна съм."). Ist kein genderVariant
   gesetzt, gilt bg/latin für beide. */

window.BG_SENTENCES = [
  { id: "hallo", bg: "Здравей!", de: "Hallo!", latin: "Zdrawey!", category: "begruessung" },
  { id: "guten-morgen", bg: "Добро утро!", de: "Guten Morgen!", latin: "Dobro utro!", category: "begruessung" },
  { id: "wie-gehts", bg: "Как си?", de: "Wie geht's?", latin: "Kak si?", category: "begruessung" },
  { id: "wie-heisst-du", bg: "Как се казваш?", de: "Wie heißt du?", latin: "Kak se kazwasch?", category: "begruessung" },

  { id: "gut", bg: "Добре съм.", de: "Mir geht's gut.", latin: "Dobre sam.", category: "gefuehle" },
  { id: "nicht-gut", bg: "Не съм добре.", de: "Mir geht's nicht gut.", latin: "Ne sam dobre.", category: "gefuehle" },
  {
    id: "hunger", de: "Ich habe Hunger.", category: "gefuehle",
    genderVariant: { male: { bg: "Гладен съм.", latin: "Gladen sam." }, female: { bg: "Гладна съм.", latin: "Gladna sam." } }
  },
  {
    id: "durst", de: "Ich habe Durst.", category: "gefuehle",
    genderVariant: { male: { bg: "Жаден съм.", latin: "Schaden sam." }, female: { bg: "Жадна съм.", latin: "Schadna sam." } }
  },
  {
    id: "muede", de: "Ich bin müde.", category: "gefuehle",
    genderVariant: { male: { bg: "Уморен съм.", latin: "Umoren sam." }, female: { bg: "Уморена съм.", latin: "Umorena sam." } }
  },
  { id: "ich-liebe-dich", bg: "Обичам те.", de: "Ich liebe dich.", latin: "Obitscham te.", category: "gefuehle" },

  { id: "wasser-wollen", bg: "Искам вода.", de: "Ich möchte Wasser.", latin: "Iskam woda.", category: "bitten" },
  { id: "nicht-verstehen", bg: "Не разбирам.", de: "Ich verstehe nicht.", latin: "Ne rasbiram.", category: "bitten" },
  { id: "hilf-mir", bg: "Помогни ми.", de: "Hilf mir.", latin: "Pomogni mi.", category: "bitten" },
  { id: "komm-her", bg: "Ела тук.", de: "Komm her.", latin: "Ela tuk.", category: "bitten" },
  { id: "warte", bg: "Чакай.", de: "Warte.", latin: "Tschakay.", category: "bitten" },

  { id: "ja", bg: "Да.", de: "Ja.", latin: "Da.", category: "hoeflichkeit" },
  { id: "nein", bg: "Не.", de: "Nein.", latin: "Ne.", category: "hoeflichkeit" },
  { id: "bitte", bg: "Моля.", de: "Bitte.", latin: "Molya.", category: "hoeflichkeit" },
  { id: "danke", bg: "Благодаря.", de: "Danke.", latin: "Blagodarya.", category: "hoeflichkeit" },
  { id: "entschuldigung", bg: "Извинявай.", de: "Entschuldigung.", latin: "Iswinyawai.", category: "hoeflichkeit" },

  { id: "bis-bald", bg: "До скоро!", de: "Bis bald!", latin: "Do skoro!", category: "abschied" },
  { id: "gute-nacht", bg: "Лека нощ!", de: "Gute Nacht!", latin: "Leka nosch!", category: "abschied" },
  { id: "auf-wiedersehen", bg: "Довиждане!", de: "Auf Wiedersehen!", latin: "Dowishdane!", category: "abschied" },

  { id: "wie-alt", bg: "На колко си години?", de: "Wie alt bist du?", latin: "Na kolko si godini?", category: "fragen" },
  { id: "was-ist-das", bg: "Какво е това?", de: "Was ist das?", latin: "Kakwo e towa?", category: "fragen" },
  { id: "wo-ist", bg: "Къде е мама?", de: "Wo ist Mama?", latin: "Kade e mama?", category: "fragen" },
  { id: "welche-farbe", bg: "Какъв цвят е това?", de: "Welche Farbe ist das?", latin: "Kakav zwjat e towa?", category: "fragen" },
  { id: "wie-viele", bg: "Колко са?", de: "Wie viele sind es?", latin: "Kolko sa?", category: "fragen" },
  { id: "ich-sehe", bg: "Виждам червена топка.", de: "Ich sehe einen roten Ball.", latin: "Wischdam tscherwena topka.", category: "fragen" }
];

window.BG_SENTENCE_CATEGORIES = {
  begruessung: { title: "Begrüßung", icon: "👋" },
  gefuehle: { title: "Gefühle", icon: "❤️" },
  bitten: { title: "Bitten & Wünsche", icon: "🙏" },
  hoeflichkeit: { title: "Höflichkeit", icon: "😊" },
  abschied: { title: "Abschied", icon: "👋" },
  fragen: { title: "Fragen & Sehen", icon: "❓" }
};
