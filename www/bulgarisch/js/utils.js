/* Kleine Helfer, die von games.js, screens.js und app.js genutzt werden. */
(function () {
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function sample(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (key === "class") node.className = attrs[key];
      else if (key === "html") node.innerHTML = attrs[key];
      else if (key === "text") node.textContent = attrs[key];
      else if (key.indexOf("on") === 0 && typeof attrs[key] === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
      } else {
        node.setAttribute(key, attrs[key]);
      }
    });
    (children || []).forEach(function (c) {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function resolveGenderText(item, gender) {
    if (item.genderVariant) {
      var variant = item.genderVariant[gender] || item.genderVariant.male;
      return {
        bg: variant.bg || item.bg,
        latin: variant.latin || item.latin
      };
    }
    return { bg: item.bg, latin: item.latin };
  }

  function formatDuration(ms) {
    var totalMin = Math.round(ms / 60000);
    if (totalMin < 1) return "< 1 Min.";
    if (totalMin < 60) return totalMin + " Min.";
    var h = Math.floor(totalMin / 60);
    var m = totalMin % 60;
    return h + " Std. " + m + " Min.";
  }

  function wordById(id) {
    return window.BG_WORDS.find(function (w) { return w.id === id; }) ||
      window.Storage.getFamilyWords().find(function (w) { return w.id === id; });
  }

  function letterById(id) {
    return window.BG_ALPHABET.find(function (l) { return l.id === id; });
  }

  function sentenceById(id) {
    return window.BG_SENTENCES.find(function (s) { return s.id === id; });
  }

  function dialogueById(id) {
    return window.BG_DIALOGUES.find(function (d) { return d.id === id; });
  }

  window.Utils = {
    shuffle: shuffle,
    sample: sample,
    el: el,
    resolveGenderText: resolveGenderText,
    formatDuration: formatDuration,
    wordById: wordById,
    letterById: letterById,
    sentenceById: sentenceById,
    dialogueById: dialogueById
  };
})();
