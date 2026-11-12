// Úvodné obrázky pre iPhone a iPad (ikony/start/*.png) a ikony appky (ikony/*.png) vo vzhľade 5.0 „Svetom“.
// Úvodné obrázky sú rovnaké ako úvodná obrazovka v appke (.uvod v zdroj/styly/23-zaklad-uvod.css). Zoznam rozmerov je STARTY v zostav.js.
// Spustenie: node zdroj/uvod-obrazky.js, potom otvoriť http://127.0.0.1:5077 v Chrome alebo Edge a počkať na „Hotovo“.
const fs = require('fs'), path = require('path'), http = require('http'), vm = require('vm');
const R = path.join(__dirname, '..'), ciel = path.join(R, 'ikony');
const STARTY = JSON.parse(fs.readFileSync(path.join(__dirname, 'zostav.js'), 'utf8').match(/const STARTY = (\[[\s\S]*?\]\]);/)[1]);
const c = {}; vm.createContext(c);
vm.runInContext(['temy.js', 'obrazky.js', 'zdroj/kod/07b-zaklad-ikony-50.js'].map(f => fs.readFileSync(path.join(R, f), 'utf8')).join('\n')
  + '\nthis.SOVA = mudra("ahoj"); this.HV = STAR(); this.GLOBUS = logoGlobus(); this.IKONA = ikonaAppky(); this.MASKA = ikonaAppky(.1);', c);
const xml = s => s.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
const stranka = `<!doctype html><meta charset="utf-8"><title>Obrázky Svetom</title>
<style>@font-face { font-family: Grandstander; font-weight: 500 900; src: url(/pisma/grandstander-latin.woff2) format("woff2"); }
@font-face { font-family: Grandstander; font-weight: 500 900; src: url(/pisma/grandstander-latin-ext.woff2) format("woff2"); unicode-range: U+0100-02BA; }</style>
<p id="stav" style="font:20px sans-serif">Kreslím…</p><script>
const STARTY = ${JSON.stringify(STARTY)}, SOVA = ${JSON.stringify(xml(c.SOVA).replace('viewBox="8 -2 184 222"', 'viewBox="-12 -2 224 222"'))}, HV = ${JSON.stringify(xml(c.HV))}, IKONA = ${JSON.stringify(xml(c.IKONA))}, MASKA = ${JSON.stringify(xml(c.MASKA))},
  GLOBUS = ${JSON.stringify(xml(c.GLOBUS).replace('viewBox="0 0 48 48"', 'viewBox="-2 -30 108 80"'))};
const obr = (s, w, h) => new Promise(r => { const i = new Image(); i.onload = () => r(i); if (w) { s = s.replace('<svg ', '<svg width="' + w + '" height="' + h + '" '); } i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
const uloz = async (cv, meno) => { const blob = await new Promise(r => cv.toBlob(r, 'image/png')); await fetch('/uloz/' + meno, { method: 'POST', body: blob }); };
async function generuj() {
  await document.fonts.load("900 44px Grandstander", "Svetom"); await document.fonts.load('700 17px Grandstander', 'Každý deň');
  const hotove = [];
  // ikony appky
  for (const [meno, px, svg] of [['ikona-192', 192, IKONA], ['ikona-512', 512, IKONA], ['ikona-maskable-512', 512, MASKA], ['apple-touch-icon', 180, IKONA]]) {
    const cv = document.createElement('canvas'); cv.width = cv.height = px;
    cv.getContext('2d').drawImage(await obr(svg, px, px), 0, 0, px, px); await uloz(cv, meno); hotove.push(meno);
  }
  for (const [w, h, d] of STARTY) {
    // rovnaké miery ako .uvod: stred 44 % výšky, kruh 110, Múdra 150 × 181, logo 122 px a podtitul 174 px pod stredom
    const cv = document.createElement('canvas'); cv.width = w * d; cv.height = h * d;
    const g = cv.getContext('2d'), p = v => v * d, cx = p(w / 2), cy = p(h * .44);
    g.fillStyle = '#FFF6E3'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#FFEEB5'; g.beginPath(); g.arc(cx, cy, p(110), 0, Math.PI * 2); g.fill();
    const hv = await obr(HV, p(26), p(26));
    for (const [x, y] of [[-118, -70], [112, -84], [-100, 86], [122, 62]]) g.drawImage(hv, cx + p(x - 13), cy + p(y - 13), p(26), p(26));
    g.drawImage(await obr(SOVA, p(183), p(181)), cx - p(91.5), cy - p(98), p(182.6), p(181)); // širší rám, aby sa zdvihnuté krídlo neorezalo
    // logo: Svet + zemeguľa + m (písmo 44 px, zemeguľa .62 em)
    g.font = '900 ' + p(44) + 'px Grandstander'; g.fillStyle = '#2A2356'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    const em = p(44), gl = em * .62, w1 = g.measureText('Svet').width, w2 = g.measureText('m').width, medz = em * .03, sirka = w1 + gl + w2 + 2 * medz;
    const m0 = g.measureText('Svetm'), zaklad = cy + p(122) + (p(48) - (m0.fontBoundingBoxAscent + m0.fontBoundingBoxDescent)) / 2 + m0.fontBoundingBoxAscent;
    let x = cx - sirka / 2; g.fillText('Svet', x, zaklad); x += w1 + medz;
    const k = gl / 48; g.drawImage(await obr(GLOBUS, Math.round(108 * k), Math.round(80 * k)), x - 2 * k, zaklad - gl + em * .055 - 30 * k, 108 * k, 80 * k); x += gl + medz;
    g.fillText('m', x, zaklad);
    g.font = '700 ' + p(17) + 'px Grandstander'; g.fillStyle = '#655E8C'; g.textAlign = 'center';
    const m1 = g.measureText('Každý deň objav niečo nové.');
    g.fillText('Každý deň objav niečo nové.', cx, cy + p(174) + (p(24) - (m1.fontBoundingBoxAscent + m1.fontBoundingBoxDescent)) / 2 + m1.fontBoundingBoxAscent);
    const meno = 'start/' + w * d + 'x' + h * d; await uloz(cv, meno); hotove.push(meno);
    document.getElementById('stav').textContent = 'Hotové: ' + hotove.length;
  }
  document.getElementById('stav').textContent = 'Hotovo: ' + hotove.length + ' obrázkov';
  return hotove.length;
}
window.vysledok = generuj().catch(e => { document.getElementById('stav').textContent = 'Chyba: ' + e.message; return 'chyba ' + e.message; });
</script>`;
http.createServer((q, s) => {
  if (q.method === 'POST' && /^\/uloz\/(start\/\d+x\d+|[a-z0-9-]+)$/.test(q.url)) {
    const casti = [];
    q.on('data', x => casti.push(x));
    q.on('end', () => { const f = path.join(ciel, q.url.slice(6) + '.png'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, Buffer.concat(casti)); s.end('ok'); });
    return;
  }
  if (/^\/pisma\/[a-z-]+\.woff2$/.test(q.url)) { s.setHeader('Content-Type', 'font/woff2'); return s.end(fs.readFileSync(path.join(R, q.url))); }
  s.setHeader('Content-Type', 'text/html; charset=utf-8'); s.end(stranka);
}).listen(5077, '127.0.0.1', () => console.log('Otvorte http://127.0.0.1:5077 a počkajte na Hotovo (Ctrl+C ukončí).'));
