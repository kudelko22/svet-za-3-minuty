// Offline pre Svet za 3 minúty: appka sa pri prvom otvorení uloží do telefónu.
// Vlastné súbory: najprv zo siete, aby nová verzia prišla hneď; bez signálu alebo keď sieť
// mešká viac ako 3 sekundy, z pamäte. Písma a knižnice Firebase: z pamäte (nemenia sa).
const VERZIA = 'svet3-v2';
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
  const stale = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'
    || (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'));
  if (vlastne) {
    e.respondWith(caches.open(VERZIA).then(async c => {
      const ulozene = await c.match(r, { ignoreSearch: true });
      const zo_siete = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; });
      const zaloha = () => ulozene || (r.mode === 'navigate' ? c.match('index.html') : Response.error());
      if (!ulozene) return zo_siete.catch(zaloha);
      const pomaly = new Promise(res => setTimeout(() => res(ulozene), 3000));
      return Promise.race([zo_siete.catch(zaloha), pomaly]);
    }));
  } else if (stale) {
    e.respondWith(caches.open(VERZIA).then(async c => {
      const ulozene = await c.match(r);
      return ulozene || fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; });
    }));
  }
});
