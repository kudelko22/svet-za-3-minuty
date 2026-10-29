// Úvodné obrázky pre iPhone a iPad (ikony/start/*.png): rovnaké ako úvodná obrazovka v appke (.uvod v appka.html).
// iPhone ich ukáže hneď po ťuknutí na ikonku na ploche, kým sa appka načíta. Zoznam rozmerov je STARTY v zostav.js.
// Spustenie: node zdroj/uvod-obrazky.js, potom otvoriť http://127.0.0.1:5077 v Chrome alebo Edge a počkať na „Hotovo“.
const fs = require('fs'), path = require('path'), http = require('http'), vm = require('vm');
const R = path.join(__dirname, '..'), ciel = path.join(R, 'ikony', 'start');
const STARTY = JSON.parse(fs.readFileSync(path.join(__dirname, 'zostav.js'), 'utf8').match(/const STARTY = (\[[\s\S]*?\]\]);/)[1]);
const c = {}; vm.createContext(c);
vm.runInContext(['temy.js', 'obrazky.js'].map(f => fs.readFileSync(path.join(R, f), 'utf8')).join('\n') + '\nthis.SOVA = owl("hi"); this.HV = STAR();', c);
const xml = s => s.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
const stranka = `<!doctype html><meta charset="utf-8"><title>Úvodné obrázky</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&family=Nunito:wght@800&display=swap">
<p id="stav" style="font:20px sans-serif">Kreslím…</p><script>
const STARTY = ${JSON.stringify(STARTY)}, SOVA = ${JSON.stringify(xml(c.SOVA))}, HV = ${JSON.stringify(xml(c.HV))};
const obr = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
async function generuj() {
  await document.fonts.load("700 34px 'Baloo 2'"); await document.fonts.load('800 17px Nunito');
  const sova = await obr(SOVA), hv = await obr(HV), hotove = [];
  for (const [w, h, d] of STARTY) {
    // rovnaké miery ako .uvod: stred 44 % výšky, kruh 110, sova 150 × 165, nadpis 128 px a podnadpis 170 px pod stredom
    const cv = document.createElement('canvas'); cv.width = w * d; cv.height = h * d;
    const g = cv.getContext('2d'), p = v => v * d, cx = p(w / 2), cy = p(h * .44);
    g.fillStyle = '#E3F4FF'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = 'rgba(255, 255, 255, .75)'; g.beginPath(); g.arc(cx, cy, p(110), 0, Math.PI * 2); g.fill();
    for (const [x, y] of [[-118, -70], [112, -84], [-100, 86], [122, 62]]) g.drawImage(hv, cx + p(x - 13), cy + p(y - 13), p(26), p(26));
    g.drawImage(sova, cx - p(75), cy - p(82.5), p(150), p(165));
    const text = (t, font, farba, hore, lh) => {
      g.font = font; g.fillStyle = farba; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      const m = g.measureText(t), a = m.fontBoundingBoxAscent, b = m.fontBoundingBoxDescent;
      g.fillText(t, cx, cy + p(hore) + (p(lh) - (a + b)) / 2 + a); // ako riadok v CSS: písmo v strede výšky riadka
    };
    text('Svet za 3 minúty', '700 ' + p(34) + "px 'Baloo 2'", '#2B2240', 128, 40);
    text('Krátke témy o svete', '800 ' + p(17) + 'px Nunito', '#5F587A', 170, 24);
    const meno = w * d + 'x' + h * d, blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    await fetch('/uloz/' + meno, { method: 'POST', body: blob }); hotove.push(meno);
    document.getElementById('stav').textContent = 'Hotové: ' + hotove.length + ' z ' + STARTY.length;
  }
  document.getElementById('stav').textContent = 'Hotovo: ' + hotove.length + ' obrázkov';
  return hotove;
}
window.vysledok = generuj();
</script>`;
http.createServer((q, s) => {
  if (q.method === 'POST' && /^\/uloz\/\d+x\d+$/.test(q.url)) {
    const casti = [];
    q.on('data', x => casti.push(x));
    q.on('end', () => { fs.mkdirSync(ciel, { recursive: true }); fs.writeFileSync(path.join(ciel, q.url.split('/')[2] + '.png'), Buffer.concat(casti)); s.end('ok'); });
    return;
  }
  s.setHeader('Content-Type', 'text/html; charset=utf-8'); s.end(stranka);
}).listen(5077, '127.0.0.1', () => console.log('Otvorte http://127.0.0.1:5077 a počkajte na Hotovo (Ctrl+C ukončí).'));
