/* XP, Level, Lernserie, Wiederholungs-Boxen (rot/gelb/grün/Stern), Daily Mission. */
(function () {
  var MISSION_TARGETS = { newWords: 5, sentences: 3, games: 1 };
  var MISSION_BONUS_XP = 50;

  function getLevel(xp) {
    var levels = window.BG_LEVELS;
    var current = levels[0];
    for (var i = 0; i < levels.length; i++) {
      if (xp >= levels[i].minXp) current = levels[i];
    }
    return current;
  }

  function getNextLevel(xp) {
    var levels = window.BG_LEVELS;
    for (var i = 0; i < levels.length; i++) {
      if (levels[i].minXp > xp) return levels[i];
    }
    return null;
  }

  function addXp(profileId, amount) {
    var before = Storage.getProfile(profileId).xp;
    var beforeLevel = getLevel(before);
    var profile = Storage.updateProfile(profileId, function (p) {
      p.xp += amount;
    });
    var afterLevel = getLevel(profile.xp);
    return {
      xp: profile.xp,
      leveledUp: afterLevel.title !== beforeLevel.title,
      level: afterLevel
    };
  }

  function ensureDailyMission(profile) {
    var today = Storage.todayStr();
    if (!profile.dailyMission || profile.dailyMission.date !== today) {
      profile.dailyMission = {
        date: today,
        newWords: 0,
        sentences: 0,
        games: 0,
        claimed: false
      };
    }
    return profile.dailyMission;
  }

  function getDailyMission(profileId) {
    var profile = Storage.getProfile(profileId);
    var mission = ensureDailyMission(profile);
    Storage.save();
    return mission;
  }

  function isMissionComplete(m) {
    return m.newWords >= MISSION_TARGETS.newWords &&
      m.sentences >= MISSION_TARGETS.sentences &&
      m.games >= MISSION_TARGETS.games;
  }

  function bumpMission(profileId, kind) {
    var result = { mission: null, justCompleted: false, bonusXp: 0 };
    Storage.updateProfile(profileId, function (p) {
      var m = ensureDailyMission(p);
      var wasComplete = isMissionComplete(m);
      if (kind === "newWord") m.newWords = Math.min(MISSION_TARGETS.newWords, m.newWords + 1);
      if (kind === "sentence") m.sentences = Math.min(MISSION_TARGETS.sentences, m.sentences + 1);
      if (kind === "game") m.games = Math.min(MISSION_TARGETS.games, m.games + 1);
      var nowComplete = isMissionComplete(m);
      if (nowComplete && !wasComplete && !m.claimed) {
        m.claimed = true;
        result.justCompleted = true;
        result.bonusXp = MISSION_BONUS_XP;
        p.xp += MISSION_BONUS_XP;
      }
      result.mission = m;
    });
    return result;
  }

  function touchStreak(profileId) {
    var result = 0;
    Storage.updateProfile(profileId, function (p) {
      var today = Storage.todayStr();
      if (p.lastActiveDate === today) {
        result = p.streak;
        return;
      }
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var yStr = yesterday.toISOString().slice(0, 10);
      if (p.lastActiveDate === yStr) {
        p.streak = (p.streak || 0) + 1;
      } else {
        p.streak = 1;
      }
      p.lastActiveDate = today;
      result = p.streak;
    });
    return result;
  }

  function statusKeyFor(kind) {
    if (kind === "word") return "wordsStatus";
    if (kind === "letter") return "lettersStatus";
    if (kind === "sentence") return "sentencesStatus";
    return "wordsStatus";
  }

  function recordItemResult(profileId, kind, itemId, correct) {
    var statusKey = statusKeyFor(kind);
    var entry = null;
    Storage.updateProfile(profileId, function (p) {
      if (!p[statusKey][itemId]) {
        p[statusKey][itemId] = { box: 0, correct: 0, incorrect: 0, seen: 0 };
      }
      var e = p[statusKey][itemId];
      e.seen++;
      if (correct) {
        e.correct++;
        e.box = Math.min(3, e.box + 1);
      } else {
        e.incorrect++;
        e.box = Math.max(0, e.box - 1);
      }
      entry = e;
    });
    return entry;
  }

  function boxLabel(box) {
    if (box >= 3) return { label: "Gemeistert", icon: "⭐", color: "gemeistert" };
    if (box === 2) return { label: "Gut", icon: "🟢", color: "gut" };
    if (box === 1) return { label: "Üben", icon: "🟡", color: "ueben" };
    return { label: "Noch lernen", icon: "🔴", color: "lernen" };
  }

  function getWeakItems(profileId, kind, n) {
    var statusKey = statusKeyFor(kind);
    var profile = Storage.getProfile(profileId);
    var entries = Object.keys(profile[statusKey]).map(function (id) {
      return Object.assign({ id: id }, profile[statusKey][id]);
    });
    entries.sort(function (a, b) {
      if (a.box !== b.box) return a.box - b.box;
      return b.incorrect - a.incorrect;
    });
    return entries.slice(0, n || 5);
  }

  function markLessonComplete(profileId, lessonId) {
    Storage.updateProfile(profileId, function (p) {
      if (p.completedLessons.indexOf(lessonId) === -1) {
        p.completedLessons.push(lessonId);
      }
    });
  }

  function addLearningTime(profileId, ms) {
    Storage.updateProfile(profileId, function (p) {
      p.learningTimeMs = (p.learningTimeMs || 0) + ms;
    });
  }

  window.Gamification = {
    getLevel: getLevel,
    getNextLevel: getNextLevel,
    addXp: addXp,
    getDailyMission: getDailyMission,
    bumpMission: bumpMission,
    MISSION_TARGETS: MISSION_TARGETS,
    isMissionComplete: isMissionComplete,
    touchStreak: touchStreak,
    recordItemResult: recordItemResult,
    boxLabel: boxLabel,
    getWeakItems: getWeakItems,
    markLessonComplete: markLessonComplete,
    addLearningTime: addLearningTime
  };
})();
