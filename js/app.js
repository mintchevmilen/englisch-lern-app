/* =============================================================
   js/app.js – Start, Navigation (Hash-Routing), Service Worker
   ============================================================= */
(function (w) {
  var UI = w.UI;
  w.APP_VERSION = '3.0.0';

  function route() {
    return (w.location.hash || '#/home').replace(/^#\/?/, '') || 'home';
  }

  var goOrig = UI.go;
  UI.go = function (r) {
    var target = '#/' + String(r).replace(/^#?\/?/, '');
    if (w.location.hash === target) UI.render(route());
    else w.location.hash = target;
  };

  function draw() {
    if (w.Player && w.Player.active()) return;    // Player laeuft: nicht ueberzeichnen
    try { UI.render(route()); }
    catch (e) {
      document.getElementById('screen').innerHTML =
        '<div class="empty"><span class="empty__ico">⚠️</span>Da ist etwas schiefgelaufen.<br>' +
        '<button class="btn mt" onclick="location.hash=\'#/home\';location.reload()" type="button">Neu starten</button></div>';
      if (w.console) w.console.error(e);
    }
  }

  w.addEventListener('hashchange', draw);

  document.addEventListener('click', function (e) {
    var t = e.target;
    var b = t && t.closest ? t.closest('[data-go],[data-nav]') : null;
    if (!b) return;
    var nav = b.getAttribute('data-nav');
    if (nav) { e.preventDefault(); w.Speech.warmup(); return UI.go(nav); }
    var go = b.getAttribute('data-go');
    if (go) { e.preventDefault(); w.Speech.warmup(); return UI.action(go); }
  }, false);

  document.getElementById('backBtn').addEventListener('click', function () {
    if (history.length > 1) history.back(); else UI.go('home');
  });

  /* ---------- Kurse (Englisch, Mathe, Bulgarisch, Python), Kursleiste oben ---------- */
  var COURSES = {
    englisch: { name: 'Englisch 5. Klasse', ico: '\uD83C\uDDEC\uD83C\uDDE7' },
    mathe:    { name: 'Mathe 5. Klasse',    ico: '\u2795', src: 'mathe/index.html', frame: 'mathFrame' },
    bulgarisch: { name: 'Bulgarisch',       ico: '\uD83C\uDDE7\uD83C\uDDEC', src: 'bulgarisch/index.html', frame: 'bulgarischFrame' },
    python:   { name: 'Python programmieren', ico: '\uD83D\uDC0D', src: 'python/index.html', frame: 'pythonFrame' }
  };
  var course = 'englisch';
  var courseMenu = document.getElementById('coursemenu');
  var courseBtn = document.getElementById('courseBtn');

  function closeCourseMenu() { courseMenu.hidden = true; courseBtn.setAttribute('aria-expanded', 'false'); }

  function setCourse(id, remember) {
    if (!COURSES[id]) id = 'englisch';
    course = id;
    document.body.classList.toggle('course-mathe', id !== 'englisch');
    document.getElementById('courseName').textContent = COURSES[id].name;
    document.getElementById('courseIco').textContent = COURSES[id].ico;
    Array.prototype.forEach.call(courseMenu.querySelectorAll('[data-course]'), function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-course') === id);
    });
    Object.keys(COURSES).forEach(function (k) {
      var c = COURSES[k];
      if (!c.frame) return;
      var fr = document.getElementById(c.frame);
      if (k === id) {
        if (!fr.getAttribute('src')) fr.setAttribute('src', c.src);
        fr.hidden = false;
      } else {
        fr.hidden = true;
        /* Ton und Mikrofon des verlassenen Kurses beenden */
        try { if (fr.contentWindow && fr.contentWindow.Speaker) { fr.contentWindow.Speaker.stop(); fr.contentWindow.Speaker.stopListening && fr.contentWindow.Speaker.stopListening(); } } catch (e) { /* egal */ }
      }
    });
    if (id !== 'englisch' && w.Speech && w.Speech.stop) { try { w.Speech.stop(); } catch (e) { /* egal */ } }
    if (remember) { try { w.localStorage.setItem('ea-course', id); } catch (e) { /* egal */ } }
    closeCourseMenu();
  }

  courseBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = courseMenu.hidden;
    courseMenu.hidden = !open;
    courseBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  courseMenu.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-course]') : null;
    if (b) setCourse(b.getAttribute('data-course'), true);
    e.stopPropagation();
  });
  document.addEventListener('click', closeCourseMenu);

  var saved = 'englisch';
  try { saved = w.localStorage.getItem('ea-course') || 'englisch'; } catch (e) { /* egal */ }
  setCourse(saved, false);

  try { w.Store.autoSnapshot(); } catch (e) { /* nicht kritisch */ }

  /* Erststart */
  if (!w.location.hash) w.location.hash = '#/home';
  draw();

  /* Service Worker: macht die Web-Version (PWA) offline nutzbar. In der Android-App
     ist er unnoetig (alles liegt lokal) und kann nach einem Update alte Dateien
     festhalten; dort wird ein evtl. vorhandener Service Worker samt Zwischenspeicher entfernt. */
  var isNative = !!(w.Capacitor && w.Capacitor.isNativePlatform && w.Capacitor.isNativePlatform());
  if ('serviceWorker' in navigator && /^https?:$/.test(w.location.protocol)) {
    if (isNative) {
      try {
        navigator.serviceWorker.getRegistrations().then(function (rs) { rs.forEach(function (r) { r.unregister(); }); });
        if (w.caches && w.caches.keys) w.caches.keys().then(function (ks) { ks.forEach(function (k) { w.caches['delete'](k); }); });
      } catch (e) { /* nicht kritisch */ }
    } else {
      w.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* nicht kritisch */ });
      });
    }
  }
})(window);
