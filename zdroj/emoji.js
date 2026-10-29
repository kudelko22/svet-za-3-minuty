// Z balíka OpenMoji vyberie len emoji, ktoré appka používa (odpovede kvízov, obrázky tém),
// zmenší ich a uloží do svet-za-3-minuty/e/<kód>.svg. Použitie: node postav-emoji.js <cesta k package>
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = 'C:/Users/Admin/Documents/svet-za-3-minuty', OM = process.argv[2];
const RE = /\p{RI}\p{RI}|[0-9#*]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}\uFE0F?|[\u{1F3FB}-\u{1F3FF}])*/gu;
const kod = e => [...e].map(c => c.codePointAt(0).toString(16)).filter(x => x !== 'fe0f').join('-');

const c = {}; vm.createContext(c);
vm.runInContext((fs.readFileSync(path.join(R, 'temy.js'), 'utf8') + '\n' + fs.readFileSync(path.join(R, 'obrazky.js'), 'utf8')).replace(/^const /gm, 'var '), c);
const pouzite = new Set();
for (const q of [...c.T.flatMap(t => t.z), ...(c.VYZVA || [])]) for (const a of q.a) (String(a[0]).match(RE) || []).forEach(e => pouzite.add(e));
for (const t of c.T) (c.ART[t.id]().match(RE) || []).forEach(e => pouzite.add(e));

const index = {};
for (const f of fs.readdirSync(path.join(OM, 'color/svg'))) {
  if (!f.endsWith('.svg')) continue;
  const k = f.slice(0, -4).split('-').map(h => parseInt(h, 16).toString(16)).filter(x => x !== 'fe0f').join('-');
  if (!index[k]) index[k] = f;
}
const zmensi = s => s
  .replace(/<\?xml[^>]*>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<metadata[\s\S]*?<\/metadata>/g, '')
  .replace(/\s(id|xmlns:xlink|xml:space|version|enable-background)="[^"]*"/g, '')
  .replace(/-?\d+\.\d{2,}/g, n => String(Math.round(+n * 10) / 10))
  .replace(/#000000\b|#000\b/gi, '#2B2240')
  .replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();

const ciel = path.join(R, 'e');
fs.rmSync(ciel, { recursive: true, force: true }); fs.mkdirSync(ciel);
const chyba = []; let spolu = 0;
for (const e of pouzite) {
  const k = kod(e), f = index[k];
  if (!f) { chyba.push(e + ' ' + k); continue; }
  const s = zmensi(fs.readFileSync(path.join(OM, 'color/svg', f), 'utf8'));
  fs.writeFileSync(path.join(ciel, k + '.svg'), s); spolu += s.length;
}
console.log('použitých', pouzite.size, 'uložených', pouzite.size - chyba.length, 'spolu', Math.round(spolu / 1024), 'kB');
if (chyba.length) console.log('CHÝBA:', chyba.join(' | '));
