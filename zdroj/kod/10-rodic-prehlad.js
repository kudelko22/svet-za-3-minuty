/* Prehľad pre rodiča: čo dieťa prebralo tento týždeň a v ktorých otázkach chybovalo */
function zapisChybu(k, ok) {
  const t = k && byId(k.tid);
  if (!t) return;
  const i = t.z.indexOf(k.q.povodna || k.q), kl = t.id + ':' + i, bola = st.chyby.includes(kl);
  if (i < 0) return; // otázky z Výzvy nie sú v téme
  if (ok && bola) st.chyby = st.chyby.filter(x => x !== kl);
  else if (!ok && !bola) st.chyby = [...st.chyby, kl].slice(-60);
  else return;
  S.set('chyby', st.chyby);
}
function zapisPrebrate(id) { st.kedy = { ...st.kedy, [id]: key(new Date()) }; S.set('kedy', st.kedy); }
// 5.0: prehľad je v pokojných blokoch rodičovskej časti (.rd-blok), prepínače namiesto tlačidiel Zapnúť a Vypnúť
const rdPrep = (zap, attr, popis) => `<button type="button" class="rd-prep" aria-pressed="${zap}" aria-label="${popis}" ${attr}><i></i></button>`;
function prehladHnitia(d = st) {
  const id = d.id || d.dietaId, zap = hnitieZapnute(id), cloud = !!(window.Cloud && window.Cloud.rodic && window.Cloud.rodic.profil);
  // koľko dní dieťa vynechalo (po dvoch sa strom začne vädnúť), rovnako ako hnitieDni a bodyUbudlo pre aktívne dieťa
  const body = d.body || 0, posl = [...(d.dni || [])].sort().pop();
  const vyn = !posl ? 0 : (() => { const [y, m, dd] = posl.split('-').map(Number), n = new Date(); return Math.max(0, Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(y, m - 1, dd)) / 864e5)); })();
  const nn = zap ? Math.max(0, vyn - 2) : 0, hn = nn >= 6 ? 3 : nn >= 3 ? 2 : nn >= 1 ? 1 : 0, u = nn ? Math.min(Math.floor(body * .4), nn * Math.max(3, Math.ceil(body * .02))) : 0;
  return `<section class="rd-blok"><h2 class="rd-h">Strom múdrosti</h2>
    <div class="rd-riadok">${ikn('strom')}<span class="rd-t"><b>Vädnutie stromu</b><small>${!zap ? 'Teraz je to vypnuté, strom nevädne.' : hn ? `Teraz: ${HN_TEXT[hn].n.toLowerCase()}, ${u} ${u === 1 ? 'hviezdička spí' : u >= 2 && u <= 4 ? 'hviezdičky spia' : 'hviezdičiek spí'}.` : 'Teraz je strom v poriadku.'}</small></span>
      ${rdPrep(zap, cloud ? `data-rp-hnitie="${esc(id)}"` : 'data-hnitie-prepni', 'Vädnutie stromu')}</div>
    <p class="rd-pozn">Ak dieťa nehrá, strom múdrosti po dvoch vynechaných dňoch pomaly vädne, hviezdičky na odomykanie hier trochu ubúdajú (najviac o 40 %) a najdrahšie hry sa dočasne zamknú. Prvý vynechaný deň sa nestane nič. Nič sa nestráca natrvalo: po prvej téme strom hneď ožije a všetko sa vráti. Platí ${cloud ? 'na všetkých zariadeniach' : 'na tomto zariadení'}.</p></section>`;
}
function prehladPriatelov(d = st) {
  const So = socC(), id = d.id || d.dietaId, meno = d.meno || '', cloud = !!(window.Cloud && window.Cloud.rodic && window.Cloud.rodic.profil);
  if (!So || !So.nacitane || (id && So.pid !== id)) return '';
  const blok = obsah => `<section class="rd-blok"><h2 class="rd-h">Priatelia</h2>${obsah}</section>`;
  if (!So.zapnute) return blok(cloud
    ? `<div class="rd-riadok">${ikn('priatelia')}<span class="rd-t"><b>Priatelia vypnutí</b><small>Zapnúť ich môžete tu</small></span>${rdPrep(false, 'data-rp-soczapni', 'Priatelia')}</div>`
    : `<p class="rd-pozn">Vypnutí. Priateľov zapína rodič, najprv si vytvorte účet rodiča.</p><div class="rd-vnutri"><button class="btn" data-rodic-novy>Vytvoriť účet rodiča</button></div>`);
  const mena = Object.keys(So.priatelia).map(f => So.profily[f] && So.profily[f].meno).filter(Boolean);
  const spravy = Object.keys(So.spravy).flatMap(f => (So.spravy[f] || []).map(m => ({ ...m, f }))).sort((a, b) => b.kedy - a.kedy).slice(0, 6);
  const kto = m => m.od === So.pid ? esc(meno) : esc((So.profily[m.f] || {}).meno || 'priateľ');
  const zabl = S.get('soc-zablok-' + So.pid, []);
  return blok(`<div class="rd-riadok">${ikn('priatelia')}<span class="rd-t"><b>Priatelia zapnutí</b><small>Kód dieťaťa: <span class="cis">${esc(So.profil.kod)}</span></small></span>
      ${cloud ? rdPrep(true, 'data-rp-socvypni', 'Priatelia') : ''}</div>
    <div class="rd-riadok"><span class="rd-t"><b>${mena.length ? `${mena.length} ${mena.length === 1 ? 'priateľ' : mena.length < 5 ? 'priatelia' : 'priateľov'}` : 'Zatiaľ žiadni priatelia'}</b>${mena.length ? `<small>${mena.map(esc).join(', ')}</small>` : ''}</span></div>
    ${spravy.length ? `<h3 class="rd-h rd-h2">Posledné správy</h3>${spravy.map(m => `<div class="rd-riadok"><span class="pr-ik">${m.n ? (NALEPKY[m.n] ? NALEPKY[m.n]() : '') : ik('bublina')}</span><span class="rd-t"><b>${kto(m)} → ${m.od === So.pid ? esc((So.profily[m.f] || {}).meno || '') : esc(meno)}</b><small>${m.x ? esc(m.x) : m.k ? esc(VETY[m.k] || '') : 'nálepka'} · ${casSpravy(m.kedy)}</small></span></div>`).join('')}` : ''}
    <p class="rd-pozn"><b>Voľné písanie.</b> Vlastný text (najviac 200 znakov) môže dieťa písať len vtedy, keď ho zapnete vy aj rodič priateľa. Nevhodné slová, telefónne čísla a odkazy appka nepustí. Ak nechcete, aby si písali, vypnite priateľov.</p>
    ${zabl.length ? `<h3 class="rd-h rd-h2">Zablokované správy</h3>${zabl.slice().reverse().map(m => `<div class="rd-riadok"><span class="pr-ik">${ik('bublina')}</span><span class="rd-t"><small>${esc(m.t)}</small></span></div>`).join('')}` : ''}
    ${cloud ? '' : '<p class="rd-pozn">Zapnúť alebo vypnúť priateľov môže len rodič s účtom rodiča.</p><div class="rd-vnutri"><button class="btn" data-rodic-novy>Vytvoriť účet rodiča</button></div>'}`);
}
const maRodica = () => !!(window.Cloud && window.Cloud.rodic && window.Cloud.rodic.profil);
// d === st: prehľad v karte Ja (bez účtu rodiča) má nadpis Pre rodiča; v paneli rodiča je nadpis v lište
function prehladRodica(d = st) {
  const pon = new Date(); pon.setDate(pon.getDate() - (pon.getDay() + 6) % 7);
  const od = key(pon), dnes = key(new Date());
  const den = k => k === dnes ? 'dnes' : DNI[(new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8)).getDay() + 6) % 7];
  const tyzden = Object.entries(d.kedy || {}).filter(([id, k]) => k >= od && byId(id)).sort((a, b) => a[1] < b[1] ? -1 : 1);
  const chyby = (d.chyby || []).map(x => { const [id, i] = x.split(':'), t = byId(id), q = t && t.z[+i]; return q && { t, q }; }).filter(Boolean).slice(-6).reverse();
  return `<section class="sec rd-prehlad">${d === st ? '<h2 class="h2">Pre rodiča</h2>' : ''}
    <section class="rd-blok"><h2 class="rd-h">Tento týždeň prebraté</h2>
      ${tyzden.length ? tyzden.map(([id, k]) => `<div class="rd-riadok"><span class="pr-ik">${ikKat(byId(id).k)}</span><span class="rd-t"><b>${esc(byId(id).t)}</b></span><span class="rd-den">${den(k)}</span></div>`).join('') : '<p class="rd-pozn">Tento týždeň zatiaľ nič.</p>'}</section>
    <section class="rd-blok"><h2 class="rd-h">Na čo sa ešte pozrieť</h2>
      ${chyby.length ? chyby.map(c => `<div class="rd-riadok">${ikn('lupa')}<span class="rd-t"><b>${esc(c.q.q)}</b><small>Správne: ${esc(c.q.a[0][1])}</small></span></div>`).join('') : '<p class="rd-pozn">Žiadne chyby v kvízoch. Výborne!</p>'}</section>
    ${prehladHnitia(d)}
    ${prehladPriatelov(d)}
  </section>`;
}
