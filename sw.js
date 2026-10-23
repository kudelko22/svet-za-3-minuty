// Offline pre Svet za 3 minúty: appka sa pri prvom otvorení uloží do telefónu.
// Vlastné súbory idú hneď z pamäte (rýchle aj bez signálu v aute) a na pozadí sa obnovia,
// takže nové témy sa ukážu pri ďalšom otvorení. Po zmene súborov zvýš VERZIA.
const VERZIA = 'svet3-v1';
const JADRO = ['./', 'index.html', 'temy.js', 'obrazky.js', 'manifest.webmanifest', 'ikony/ikona-192.png', 'ikony/ikona-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERZIA).then(c => c.addAll(JADRO)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(x => x !== VERZIA).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);
  const vlastne = url.origin === location.origin;
  const pisma = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!vlastne && !pisma) return;
  e.respondWith(caches.open(VERZIA).then(async c => {
    const ulozene = await c.match(r, { ignoreSearch: vlastne });
    const zo_siete = fetch(r).then(res => {
      if (res.ok || res.type === 'opaque') c.put(r, res.clone());
      return res;
    }).catch(() => ulozene || (r.mode === 'navigate' ? c.match('index.html') : Response.error()));
    return ulozene || zo_siete;
  }));
});
