// Zloží zdroj appky do jedného textu: zdroj/appka.html je kostra a riadky
//   /*@vloz styly/nazov.css*/   (v <style>)      //@vloz kod/nazov.js   (v <script>)
// sa nahradia obsahom súboru zo zdroj/. Poradie riadkov je poradie v appke (v CSS na ňom záleží).
// Používa ho zostav.js aj test.js. Spustenie samostatne: node zdroj/zloz.js > cela-appka.html
const fs = require('fs'), path = require('path');
function zloz() {
  const kostra = fs.readFileSync(path.join(__dirname, 'appka.html'), 'utf8');
  return kostra.replace(/^(?:\/\*@vloz ([\w\/.-]+)\*\/|\/\/@vloz ([\w\/.-]+))\n/gm, (m, a, b) => {
    const s = fs.readFileSync(path.join(__dirname, a || b), 'utf8');
    return s.endsWith('\n') ? s : s + '\n';
  });
}
module.exports = { zloz };
if (require.main === module) process.stdout.write(zloz());
