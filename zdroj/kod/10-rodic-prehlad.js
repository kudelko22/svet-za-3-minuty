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
function prehladHnitia(d = st) {
  const id = d.id || d.dietaId, zap = hnitieZapnute(id), cloud = !!(window.Cloud && window.Cloud.rodic && window.Cloud.rodic.profil);
  // koľko dní dieťa vynechalo (po dvoch sa strom začne vädnúť), rovnako ako hnitieDni a bodyUbudlo pre aktívne dieťa
  const body = d.body || 0, posl = [...(d.dni || [])].sort().pop();
  const vyn = !posl ? 0 : (() => { const [y, m, dd] = posl.split('-').map(Number), n = new Date(); return Math.max(0, Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(y, m - 1, dd)) / 864e5)); })();
  const nn = zap ? Math.max(0, vyn - 2) : 0, hn = nn >= 6 ? 3 : nn >= 3 ? 2 : nn >= 1 ? 1 : 0, u = nn ? Math.min(Math.floor(body * .4), nn * Math.max(3, Math.ceil(body * .02))) : 0;
  return `<b>Vädnutie stromu</b><p class="muted">Ak dieťa nehrá, strom múdrosti po dvoch vynechaných dňoch pomaly vädne, hviezdičky na odomykanie hier trochu ubúdajú (najviac o 40 %) a najdrahšie hry sa dočasne zamknú. Prvý vynechaný deň sa nestane nič. Nič sa nestráca natrvalo: po prvej téme strom hneď ožije a všetko sa vráti. Platí ${cloud ? 'na všetkých zariadeniach' : 'na tomto zariadení'}.</p>
    <p class="muted">${!zap ? 'Teraz je to vypnuté, strom nevädne.' : hn ? `Teraz: ${HN_TEXT[hn].n.toLowerCase()}, ${u} ${u === 1 ? 'hviezdička spí' : u >= 2 && u <= 4 ? 'hviezdičky spia' : 'hviezdičiek spí'}.` : 'Teraz je strom v poriadku.'}</p>
    <button class="btn ghost" ${cloud ? `data-rp-hnitie="${esc(id)}"` : 'data-hnitie-prepni'}>${zap ? 'Vypnúť vädnutie stromu' : 'Zapnúť vädnutie stromu'}</button>`;
}
function prehladPriatelov(d = st) {
  const So = socC(), id = d.id || d.dietaId, meno = d.meno || '', cloud = !!(window.Cloud && window.Cloud.rodic && window.Cloud.rodic.profil);
  if (!So || !So.nacitane || (id && So.pid !== id)) return '';
  if (!So.zapnute) return cloud
    ? '<b>Priatelia</b><p class="muted">Vypnutí. Zapnúť ich môžete tu.</p><button class="btn blue" data-rp-soczapni>Zapnúť priateľov</button>'
    : '<b>Priatelia</b><p class="muted">Vypnutí. Priateľov zapína rodič, najprv si vytvorte účet rodiča.</p><button class="btn blue" data-rodic-novy>Vytvoriť účet rodiča</button>';
  const mena = Object.keys(So.priatelia).map(f => So.profily[f] && So.profily[f].meno).filter(Boolean);
  const spravy = Object.keys(So.spravy).flatMap(f => (So.spravy[f] || []).map(m => ({ ...m, f }))).sort((a, b) => b.kedy - a.kedy).slice(0, 6);
  const kto = m => m.od === So.pid ? esc(meno) : esc((So.profily[m.f] || {}).meno || 'priateľ');
  return `<b>Priatelia (kód ${esc(So.profil.kod)})</b><p class="muted">${mena.length ? mena.map(esc).join(', ') : 'Zatiaľ žiadni.'}</p>
    ${spravy.length ? `<b>Posledné správy</b><ul>${spravy.map(m => `<li><span class="pr-ik">${m.n ? (NALEPKY[m.n] ? NALEPKY[m.n]() : '') : ik('bublina')}</span><span>${kto(m)} → ${m.od === So.pid ? esc((So.profily[m.f] || {}).meno || '') : esc(meno)}<small>${m.x ? esc(m.x) : m.k ? esc(VETY[m.k] || '') : 'nálepka'} · ${casSpravy(m.kedy)}</small></span></li>`).join('')}</ul>` : ''}
    <b>Voľné písanie</b><p class="muted">Vlastný text (najviac 200 znakov) môže dieťa písať len vtedy, keď ho zapnete vy aj rodič priateľa. Nevhodné slová, telefónne čísla a odkazy appka nepustí. Ak nechcete, aby si písali, vypnite priateľov.</p>
    ${(z => z.length ? `<b>Zablokované správy</b><ul>${z.slice().reverse().map(m => `<li><span class="pr-ik">${ik('bublina')}</span><span>${esc(m.t)}</span></li>`).join('')}</ul>` : '')(S.get('soc-zablok-' + So.pid, []))}
    ${cloud ? '<button class="btn ghost" data-rp-socvypni>Vypnúť priateľov</button>' : '<p class="muted">Zapnúť alebo vypnúť priateľov môže len rodič s účtom rodiča.</p><button class="btn blue" data-rodic-novy>Vytvoriť účet rodiča</button>'}`;
}
const maRodica = () => !!(window.Cloud && window.Cloud.rodic && window.Cloud.rodic.profil);
function prehladRodica(d = st) {
  const pon = new Date(); pon.setDate(pon.getDate() - (pon.getDay() + 6) % 7);
  const od = key(pon), dnes = key(new Date());
  const den = k => k === dnes ? 'dnes' : DNI[(new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8)).getDay() + 6) % 7];
  const tyzden = Object.entries(d.kedy || {}).filter(([id, k]) => k >= od && byId(id)).sort((a, b) => a[1] < b[1] ? -1 : 1);
  const chyby = (d.chyby || []).map(x => { const [id, i] = x.split(':'), t = byId(id), q = t && t.z[+i]; return q && { t, q }; }).filter(Boolean).slice(-6).reverse();
  return `<section class="sec"><h2 class="h2" style="--hc:#4C7DFF">Pre rodiča</h2>
    <div class="card prehlad"><b>Tento týždeň prebraté</b>
      ${tyzden.length ? `<ul>${tyzden.map(([id, k]) => `<li><span class="pr-ik">${ikKat(byId(id).k)}</span><span>${esc(byId(id).t)}</span><small>${den(k)}</small></li>`).join('')}</ul>` : '<p class="muted">Tento týždeň zatiaľ nič.</p>'}
      <b>Na čo sa ešte pozrieť</b>
      ${chyby.length ? `<ul>${chyby.map(c => `<li><span class="pr-ik">${ikKat(c.t.k)}</span><span>${esc(c.q.q)}<small>Správne: ${esc(c.q.a[0][1])}</small></span></li>`).join('')}</ul>` : '<p class="muted">Žiadne chyby v kvízoch. Výborne!</p>'}
      ${prehladHnitia(d)}
      ${prehladPriatelov(d)}
    </div></section>`;
}
