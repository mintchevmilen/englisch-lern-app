/* Service Worker – macht die App offline nutzbar.
   Bei Aenderungen die Versionsnummer erhoehen, damit das Handy die
   neue Fassung laedt. */
var CACHE = 'english-adventure-v3';
var FILES = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css',
  './data/units.js', './data/vocabulary.js', './data/grammar.js', './data/content.js',
  './js/storage.js', './js/srs.js', './js/audio.js', './js/engine.js',
  './js/player.js', './js/games.js', './js/ui.js', './js/app.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Cache first – die App ist statisch und klein, das ist am schnellsten. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return r || fetch(e.request).then(function (resp) {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          var copy = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return resp;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});
