/* Bewertung des Nachsprechens fuer Bulgarisch. Bewusst grosszuegig (Kinder!).
   BgScore.score(heardList, target) -> { level, heard, alts }
     level 2 = genau richtig, 1 = fast richtig (zaehlt als geschafft), 0 = nicht erkannt */
(function (w) {
  function norm(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^a-zа-я0-9\s]/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  /* Lautschluessel: Buchstaben, die ein Kind (oder der Erkenner) leicht
     verwechselt, werden gleich behandelt. */
  function pkey(word) {
    var s = norm(word).replace(/\s+/g, "");
    s = s.replace(/щ/g, "шт").replace(/ьо/g, "йо").replace(/ь/g, "")
      .replace(/ю/g, "йу").replace(/я/g, "йа");
    var map = { ъ: "а", е: "и", й: "и", б: "п", в: "ф", г: "к", д: "т", ж: "ш", з: "с" };
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var ch = map[s.charAt(i)] || s.charAt(i);
      if (out.charAt(out.length - 1) !== ch) out += ch;      // doppelte Buchstaben zusammenziehen
    }
    return out;
  }

  function lev(a, b) {
    var m = a.length, n = b.length, i, j, prev = [], cur;
    if (!m) return n; if (!n) return m;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }

  function tol(len) { return len <= 4 ? 0 : (len <= 6 ? 1 : (len <= 9 ? 2 : 3)); }

  /* Passt ein gehoertes Wort zu einem gesuchten Wort? 2 = exakt, 1 = nah genug, 0 = nein */
  function wordMatch(h, t) {
    if (h === t) return 2;
    if (pkey(h) === pkey(t)) return 1;
    if (Math.min(h.length, t.length) >= 5 && lev(h, t) <= tol(t.length)) return 1;
    return 0;
  }

  function scoreOne(heardRaw, target) {
    var H = norm(heardRaw), T = norm(target);
    if (!H || !T) return 0;
    if (H === T) return 2;
    if (H.replace(/\s/g, "") === T.replace(/\s/g, "")) return 2;     // Erkenner trennt Woerter anders
    var ht = H.split(" "), tt = T.split(" "), i, j;
    if (tt.length === 1) {
      var best = 0;
      for (i = 0; i < ht.length; i++) best = Math.max(best, wordMatch(ht[i], T));
      if (best === 2 && ht.length > 1) return 2;                      // z. B. Kind sagt das Wort zweimal
      if (best) return best;
      return wordMatch(H.replace(/\s/g, ""), T);
    }
    var used = [], hit = 0, exact = 0;
    for (i = 0; i < tt.length; i++) {
      var bi = -1, bs = 0;
      for (j = 0; j < ht.length; j++) {
        if (used[j]) continue;
        var sc = wordMatch(ht[j], tt[i]);
        if (sc > bs) { bs = sc; bi = j; }
      }
      if (bi >= 0) { used[bi] = true; hit++; if (bs === 2) exact++; }
    }
    if (exact === tt.length) return 2;
    if (tt.length === 2) return hit === 2 ? 1 : 0;
    return hit / tt.length >= 0.66 ? 1 : 0;
  }

  function score(heardList, target) {
    var list = (heardList || []).filter(function (x) { return x && String(x).trim(); });
    var best = { level: 0, heard: list[0] || "", alts: [] }, i;
    for (i = 0; i < list.length; i++) {
      var lv = scoreOne(list[i], target);
      if (lv > best.level) { best.level = lv; best.heard = list[i]; if (lv === 2) break; }
    }
    var seen = {};
    best.alts = list.filter(function (x) {
      var k = norm(x); if (!k || x === best.heard || seen[k]) return false; seen[k] = true; return true;
    }).slice(0, 3);
    return best;
  }

  w.BgScore = { score: score, norm: norm, pkey: pkey, lev: lev };
})(typeof window !== "undefined" ? window : globalThis);
