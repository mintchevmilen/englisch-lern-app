/* Mini-Dialoge für echte Familien-Gespräche. Jede Zeile hat einen Sprecher
   ("papa", "mama" oder "kind") und optional genderVariant für die
   Kind-Antwort. */

window.BG_DIALOGUES = [
  {
    id: "wie-si",
    title: "Как си?",
    subtitle: "Wie geht's?",
    lines: [
      { speaker: "papa", bg: "Как си?", de: "Wie geht's?" },
      { speaker: "kind", bg: "Добре съм.", de: "Mir geht's gut." },
      { speaker: "papa", bg: "Гладен ли си?", de: "Hast du Hunger?", genderVariant: { female: { bg: "Гладна ли си?" } } },
      {
        speaker: "kind", bg: "Да, гладен съм.", de: "Ja, ich habe Hunger.",
        genderVariant: { female: { bg: "Да, гладна съм." } }
      }
    ]
  },
  {
    id: "kakvo-iskash",
    title: "Какво искаш?",
    subtitle: "Was möchtest du?",
    lines: [
      { speaker: "mama", bg: "Какво искаш?", de: "Was möchtest du?" },
      { speaker: "kind", bg: "Искам вода.", de: "Ich möchte Wasser." },
      { speaker: "mama", bg: "Заповядай!", de: "Bitte sehr!" },
      { speaker: "kind", bg: "Благодаря!", de: "Danke!" }
    ]
  },
  {
    id: "dobro-utro",
    title: "Добро утро",
    subtitle: "Guten Morgen",
    lines: [
      { speaker: "papa", bg: "Добро утро!", de: "Guten Morgen!" },
      { speaker: "kind", bg: "Добро утро, тати!", de: "Guten Morgen, Papa!" },
      { speaker: "papa", bg: "Как спа?", de: "Wie hast du geschlafen?" },
      { speaker: "kind", bg: "Добре!", de: "Gut!" }
    ]
  }
];
