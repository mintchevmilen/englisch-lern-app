/* Lokale Speicherung (localStorage). Kein Server, kein Login. */
(function () {
  var KEY = "bgapp_v1";

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function defaultProfile(name, avatar) {
    return {
      name: name,
      avatar: avatar,
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      wordsStatus: {},
      lettersStatus: {},
      sentencesStatus: {},
      completedLessons: [],
      dailyMission: null,
      learningTimeMs: 0,
      gender: avatar === "boy" ? "male" : "female"
    };
  }

  function defaultSettings() {
    return { sound: true, mic: true, rate: 0.85 };
  }

  function defaultState() {
    return {
      selected: null,
      boy: defaultProfile("Junge", "boy"),
      girl: defaultProfile("Mädchen", "girl"),
      familyWords: [],
      settings: defaultSettings(),
      lastBackup: 0
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var base = defaultState();
      // sanft mergen, falls Struktur sich mal erweitert
      parsed.boy = Object.assign({}, base.boy, parsed.boy || {});
      parsed.girl = Object.assign({}, base.girl, parsed.girl || {});
      parsed.familyWords = parsed.familyWords || [];
      parsed.settings = Object.assign(defaultSettings(), parsed.settings || {});
      parsed.lastBackup = parsed.lastBackup || 0;
      return parsed;
    } catch (e) {
      console.warn("Konnte Speicher nicht laden, starte neu.", e);
      return defaultState();
    }
  }

  var state = load();

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Konnte nicht speichern.", e);
    }
  }

  var Storage = {
    getSelectedProfileId: function () {
      return state.selected;
    },
    setSelectedProfile: function (id) {
      state.selected = id;
      persist();
    },
    getProfile: function (id) {
      return state[id];
    },
    updateProfile: function (id, updaterFn) {
      var profile = state[id];
      updaterFn(profile);
      persist();
      return profile;
    },
    getFamilyWords: function () {
      return state.familyWords;
    },
    addFamilyWord: function (word) {
      word.id = "fam-" + Date.now();
      state.familyWords.push(word);
      persist();
      return word;
    },
    removeFamilyWord: function (id) {
      state.familyWords = state.familyWords.filter(function (w) { return w.id !== id; });
      persist();
    },
    getSettings: function () { return state.settings; },
    updateSettings: function (fn) { fn(state.settings); persist(); return state.settings; },
    todayStr: todayStr,
    save: persist
  };

  /* ---------- Backup, Wiederherstellung, automatische Sicherungen ----------
     Das Backup ist ein JSON-Text mit dem gesamten Stand (beide Profile,
     Familienwoerter, Einstellungen). */
  var SNAPKEY = "bgapp_snapshots";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }

  Storage.backupText = function () {
    return JSON.stringify({
      app: "mein-bulgarisch", format: 1, version: window.APP_VERSION || "",
      created: new Date().toISOString(), state: state
    });
  };
  Storage.markBackup = function () { state.lastBackup = Date.now(); persist(); };
  Storage.lastBackup = function () { return state.lastBackup || 0; };

  /* Text -> {state, created} oder null */
  Storage.parseBackup = function (text) {
    var t = String(text == null ? "" : text).replace(/^\uFEFF/, "").trim();
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    var o = null;
    try { o = JSON.parse(t); } catch (e) { return null; }
    if (typeof o === "string") { try { o = JSON.parse(o); } catch (e2) { return null; } }
    if (!o || typeof o !== "object") return null;
    var st = (o.app === "mein-bulgarisch" && o.state) ? o.state : o;   // auch ein roher Stand ist ok
    if (!st || typeof st !== "object" || !st.boy || !st.girl || typeof st.boy.xp !== "number" || typeof st.girl.xp !== "number") return null;
    return { state: st, created: o.created || "" };
  };

  Storage.describeBackup = function (b) {
    function line(p, label) {
      return label + ": " + p.xp + " XP, " + Object.keys(p.wordsStatus || {}).length + " Wörter, " + (p.completedLessons || []).length + " Themen";
    }
    return "Backup" + (b.created ? " vom " + b.created.slice(0, 10) : "") + "\n" +
      line(b.state.boy, "Junge") + "\n" + line(b.state.girl, "Mädchen") +
      "\nDer jetzige Stand wird ersetzt (vorher wird eine Sicherung angelegt).";
  };

  Storage.applyBackup = function (b) {
    Storage.snapshot("vor Import");
    var base = defaultState(), st = b.state;
    st.boy = Object.assign({}, base.boy, st.boy);
    st.girl = Object.assign({}, base.girl, st.girl);
    st.familyWords = st.familyWords || [];
    st.settings = Object.assign(defaultSettings(), st.settings || {});
    st.lastBackup = st.lastBackup || 0;
    state = st;
    persist();
  };

  Storage.snapshots = function () {
    var raw = lsGet(SNAPKEY), a = [];
    if (raw) { try { a = JSON.parse(raw); } catch (e) { a = []; } }
    return Array.isArray(a) ? a : [];
  };
  Storage.snapshot = function (label) {
    var a = Storage.snapshots();
    a.unshift({ ts: Date.now(), label: label || "", text: Storage.backupText() });
    while (a.length > 5) a.pop();
    if (!lsSet(SNAPKEY, JSON.stringify(a)) && a.length > 1) { a.length = 1; lsSet(SNAPKEY, JSON.stringify(a)); }
  };
  Storage.autoSnapshot = function () {
    var used = state.boy.xp + state.girl.xp;
    if (!(used > 0)) return;
    var a = Storage.snapshots();
    if (a.length && a[0].label === "automatisch" && new Date(a[0].ts).toDateString() === new Date().toDateString()) return;
    Storage.snapshot("automatisch");
  };
  Storage.restoreSnapshot = function (i) {
    var it = Storage.snapshots()[i]; if (!it) return false;
    var b = Storage.parseBackup(it.text); if (!b) return false;
    Storage.applyBackup(b);
    return true;
  };

  window.Storage = Storage;
})();
