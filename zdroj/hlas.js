// Nahrá vety appky hlasom Microsoft Viktória (Azure, bezplatná úroveň F0) do a/<kľúč>.mp3 a zapíše a/zoznam.json.
// Postup: node zdroj/test.js (vytvorí zdroj/vety.json), potom node zdroj/hlas.js [súbor s kľúčom].
// Súbor s kľúčom je mimo repozitára (predvolene Documents/svet-hlas-kluc.txt), riadky KLUC=... a OBLAST=...
// Už nahraté vety preskočí, takže sa dá kedykoľvek prerušiť a spustiť znova.
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..'), A = path.join(R, 'a');
const subor = process.argv[2] || path.join(R, '..', 'svet-hlas-kluc.txt');
const nast = Object.fromEntries(fs.readFileSync(subor, 'utf8').split(/\r?\n/).filter(l => /^\w+=/.test(l)).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
if (!nast.KLUC || !nast.OBLAST) throw new Error('V súbore ' + subor + ' chýba KLUC alebo OBLAST');
// rovnaké ako v appke (zdroj/appka.html)
const normVeta = t => String(t).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const klucVety = t => { let h = 0x811c9dc5; for (const c of normVeta(t)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); };
const esc = t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const cakaj = ms => new Promise(r => setTimeout(r, ms));
const vety = JSON.parse(fs.readFileSync(path.join(__dirname, 'vety.json'), 'utf8'));
fs.mkdirSync(A, { recursive: true });
const zapisZoznam = () => fs.writeFileSync(path.join(A, 'zoznam.json'), JSON.stringify(fs.readdirSync(A).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4))));

(async () => {
  const kluce = new Set(vety.map(klucVety));
  if (kluce.size !== vety.length) throw new Error('Dve vety majú rovnaký kľúč, treba iný výpočet kľúča');
  const zostava = vety.filter(v => !fs.existsSync(path.join(A, klucVety(v) + '.mp3')));
  console.log('Treba nahrať', zostava.length, 'z', vety.length, 'viet,', zostava.join('').length, 'znakov');
  let n = 0;
  for (const v of zostava) {
    for (let pokus = 1; ; pokus++) {
      const r = await fetch(`https://${nast.OBLAST}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: { 'Ocp-Apim-Subscription-Key': nast.KLUC, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'svet-za-3-minuty' },
        body: `<speak version="1.0" xml:lang="sk-SK"><voice name="sk-SK-ViktoriaNeural"><prosody rate="-6%">${esc(normVeta(v))}</prosody></voice></speak>`,
      }).catch(e => ({ ok: false, status: 0, text: async () => String(e) }));
      if (r.ok) { fs.writeFileSync(path.join(A, klucVety(v) + '.mp3'), Buffer.from(await r.arrayBuffer())); break; }
      if ((r.status === 429 || r.status === 0 || r.status >= 500) && pokus < 8) { await cakaj(5000 * pokus); continue; }
      throw new Error('Azure odpovedal ' + r.status + ': ' + (await r.text()).slice(0, 300));
    }
    if (++n % 25 === 0) { zapisZoznam(); console.log(new Date().toLocaleTimeString('sk'), n, '/', zostava.length); }
    await cakaj(3100); // bezplatná úroveň: najviac 20 viet za minútu
  }
  zapisZoznam();
  console.log('Hotovo, nahrávok:', fs.readdirSync(A).filter(f => f.endsWith('.mp3')).length);
})().catch(e => { zapisZoznam(); console.error('CHYBA:', e.message); process.exit(1); });
