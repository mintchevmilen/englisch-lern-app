/* =============================================================
   js/app.js – Start, Navigation (Hash-Routing), Service Worker
   ============================================================= */
(function (w) {
  var UI = w.UI;
  w.APP_VERSION = '2.3.1';

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
