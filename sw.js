
const CACHE = 'pn-cache-v1';
const ASSETS = [
  './','./index.html','./style.css','./script.js','./favicon.png',
  './background_intro.jpg','./background_morning.jpg','./background_noon.jpg','./background_evening.jpg','./background_night.jpg','./compass.png'
];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k))))); });
self.addEventListener('fetch', e=>{ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); });
