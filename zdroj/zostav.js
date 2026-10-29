// Zo zdroja zdroj/appka.html urobí index.html v koreni repozitára (hlava, manifest, offline).
// Spustenie: node zdroj/zostav.js
const fs = require('fs'), path = require('path');
const zdroj = path.join(__dirname, 'appka.html'), ciel = path.join(__dirname, '..', 'index.html');
let s = fs.readFileSync(zdroj, 'utf8');
s = s.replace(/^<title>.*<\/title>\n/, '').replace(/^<meta name="claude:viewport-fit-sides"[^\n]*\n/, '');
// temy.js a obrazky.js s číslom verzie: telefón tak nikdy nespojí novú appku so starým súborom z pamäte
const verzia = (s.match(/const VERZIA_APPKY = (\d+);/) || [])[1];
if (!verzia) throw new Error('VERZIA_APPKY sa nenašla');
s = s.replace(/src="(temy|obrazky)\.js"/g, (m, n) => `src="${n}.js?v=${verzia}"`);
// úvodné obrázky pre iPhone a iPad (ikony/start, kreslí ich zdroj/uvod-obrazky.js): šírka a výška v bodoch, hustota pixelov
const STARTY = [[440, 956, 3], [420, 912, 3], [402, 874, 3], [430, 932, 3], [393, 852, 3], [428, 926, 3], [390, 844, 3], [375, 812, 3], [414, 896, 3], [414, 896, 2], [414, 736, 3], [375, 667, 2], [320, 568, 2],
  [1032, 1376, 2], [1024, 1366, 2], [834, 1210, 2], [834, 1194, 2], [820, 1180, 2], [834, 1112, 2], [810, 1080, 2], [768, 1024, 2], [744, 1133, 2]];
const starty = STARTY.map(([w, h, d]) => `<link rel="apple-touch-startup-image" media="(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d}) and (orientation: portrait)" href="ikony/start/${w * d}x${h * d}.png">`).join('\n');
const koniecHlavy = s.indexOf('</style>') + '</style>'.length;
let hlava = s.slice(0, koniecHlavy), telo = s.slice(koniecHlavy).trim();
hlava = hlava.replace('<style>\n', `<style>
/* Základ stránky (okraje pod lištami telefónu) */
html { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; }
[hidden] { display: none !important; }
img { max-width: 100%; }
`);
const registracia = `<script>
// Offline: appka sa pri prvom otvorení uloží do telefónu.
// Keď príde nová verzia, stránka sa raz sama obnoví, aby ju bolo hneď vidieť.
if ('serviceWorker' in navigator) {
  const mal = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (mal) location.reload(); });
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
</script>`;
const html = `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Svet za 3 minúty</title>
<meta name="description" content="Krátke témy o svete na rozhovor rodiča s dieťaťom, aj cestou autom.">
<meta name="theme-color" content="#E3F4FF">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="ikony/ikona-192.png" type="image/png">
<link rel="apple-touch-icon" href="ikony/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Svet za 3 min">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
${starty}
${hlava}
</head>
<body>
${telo}
${registracia}
</body>
</html>
`;
fs.writeFileSync(ciel, html);
console.log('index.html', html.length, 'znakov');
