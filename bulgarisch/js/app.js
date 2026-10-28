/* Einstiegspunkt: Navigation zwischen Screens, Profilverwaltung, Toasts. */
(function () {
  window.APP_VERSION = "1.1.0";
  var container = document.getElementById("app");
  var bottomNav = document.getElementById("bottom-nav");
  var toastEl = document.getElementById("xp-toast");
  var toastTimer = null;

  var NAV_SCREENS = ["home", "games", "wordbook", "more"];
  var HIDE_NAV_SCREENS = { splash: true, profileSelect: true, lesson: true, standaloneGame: true };
  var MORE_FAMILY_SCREENS = { more: true, about: true, parent: true, family: true };

  var App = {
    profileId: null,
    currentScreen: null,
    currentParams: null,

    profile: function () {
      return window.Storage.getProfile(this.profileId);
    },

    setProfile: function (id) {
      this.profileId = id;
      window.Storage.setSelectedProfile(id);
      window.Gamification.touchStreak(id);
    },

    navigate: function (screenName, params) {
      try { window.Speaker.stopListening(); } catch (e) { /* egal */ }
      this.currentScreen = screenName;
      this.currentParams = params || {};
      container.innerHTML = "";
      if (window.Screens[screenName]) {
        window.Screens[screenName](container, this.currentParams);
      }
      updateNav(screenName);
      window.scrollTo(0, 0);
    },

    showXpToast: function (text) {
      if (!toastEl) return;
      toastEl.textContent = text;
      toastEl.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 1200);
    },

    init: function () {
      var selected = window.Storage.getSelectedProfileId();
      try { window.Storage.autoSnapshot(); } catch (e) { /* nicht kritisch */ }
      bindNav();
      if (selected === "boy" || selected === "girl") {
        this.profileId = selected;
        window.Gamification.touchStreak(selected);
        this.navigate("home");
      } else {
        this.navigate("splash");
      }
    }
  };

  function updateNav(screenName) {
    if (HIDE_NAV_SCREENS[screenName]) {
      bottomNav.hidden = true;
      return;
    }
    bottomNav.hidden = false;
    var activeKey = MORE_FAMILY_SCREENS[screenName] ? "more" : screenName;
    Array.prototype.forEach.call(bottomNav.querySelectorAll("button"), function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-nav") === activeKey);
    });
  }

  function bindNav() {
    Array.prototype.forEach.call(bottomNav.querySelectorAll("button"), function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-nav");
        App.navigate(target);
      });
    });
  }

  window.App = App;
  document.addEventListener("DOMContentLoaded", function () { App.init(); });
})();
