// pokrok zo starších verzií (pred prihlasovaním) dostane prvé dieťa
const staryOk = () => !S.get('stary-hotovo', false); // starý lokálny pokrok dostane len prvý účet na zariadení, potom sa už nepoužije
const STARY = { meno: S.get('meno', ''), vek: S.get('vek', 'mladsi'), body: S.get('body', 0), done: S.get('done', []), fav: S.get('fav', []), dni: S.get('dni', []) };
const st = {
  meno: '', vek: 'mladsi', fav: [], done: [], dni: [], body: 0, odznaky: [], kedy: {}, chyby: [], vybrate: [], dietaId: null, avatar: null,
  faza: 'nacitava', upravuje: null, view: 'domov', kat: '', skupina: '', q: '', flow: null, priatel: null, socTab: 'spravy', socTemy: false,
};
const main = document.getElementById('main');
const byId = id => T.find(t => t.id === id);
const teaser = t => t.m.split(/(?<=[.?!])\s/)[0];
const bez = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const key = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const mix = n => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
// kategórie pre vek dieťaťa; tie len pre jeho vek idú prvé
/* 4 veľké oblasti tém, v každej menšie kategórie (každá kategória patrí práve do jednej oblasti) */
const SKUPINY = [
  { id: 'priroda', nazov: 'Príroda a vesmír', c: '#16BFAE', ikona: () => IK_KAT.priroda, kat: ['zvieratka', 'priroda', 'cas', 'telo', 'vesmir', 'planeta', 'biologia'] },
  { id: 'ludia', nazov: 'Ľudia a život', c: '#FF6FA8', ikona: () => IK.rodina, kat: ['domacnost', 'zivot', 'bezpecne', 'psychologia', 'ekonomika', 'kultura'] },
  { id: 'svet', nazov: 'Svet a dejiny', c: '#FF8A3D', ikona: () => IK_KAT.planeta, kat: ['historia', 'dejiny', 'geografia', 'politika'] },
  { id: 'veda', nazov: 'Veda a technika', c: '#7C6CFF', ikona: () => IK_KAT.veda, kat: ['tvary', 'veda', 'technika', 'doprava', 'vynalezy', 'digital'] },
];
const skupinaKat = id => SKUPINY.find(g => g.kat.includes(id));
const skupinaKarta = (g, kk, i) => {
  const k = g.kat.map(id => kk.find(x => x.id === id)).filter(Boolean), n = k.reduce((a, x) => a + x.n, 0), h = k.reduce((a, x) => a + x.hotovo, 0);
  return `<button class="tile skupina" style="--c:${g.c}" data-skupina="${g.id}" aria-pressed="${st.skupina === g.id}"><span class="tile-e" style="--j:${i}">${g.ikona()}</span><b>${g.nazov}</b>
    <span class="mini-ik">${k.map(x => `<i>${ikKat(x.id)}</i>`).join('')}</span><small>${h}/${n} tém</small></button>`;
};
const kats = () => { const v = TV(); return Object.keys(KAT).map(id => ({ id, ...KAT[id], n: v.filter(t => t.k === id).length, hotovo: v.filter(t => t.k === id && st.done.includes(t.id)).length })).filter(k => k.n).sort((a, b) => !!b.vek - !!a.vek); };
const pre = q => st.vek === 'starsi' || q.v !== 's';
// témy pre vek dieťaťa: kategória alebo téma s vek: 'mladsi' / 'starsi' patrí len danému veku
const preVek = t => (!t.vek || t.vek === st.vek) && (!KAT[t.k].vek || KAT[t.k].vek === st.vek);
const TV = () => T.filter(t => t.k !== 'anglictina' && preVek(t));
// anglické lekcie sú mimo bežných tém: majú vlastné miesto Angličtina (bonus)
const ANGT = () => T.filter(t => t.k === 'anglictina' && preVek(t));
// väčšie deti: namiesto ľahkých nesprávnych odpovedí ťažšie (q.h); pôvodná otázka ostáva v povodna
const naVek = q => st.vek === 'starsi' && q.h ? { ...q, a: [q.a[0], ...q.h.map(t => ['', t])], povodna: q } : q;
// 4.8.2: obrázky pri odpovediach len keď ich má každá odpoveď otázky, inak písmená A–D (aby správna odpoveď nebola prázdna)
const pismenaOdpovedi = q => st.vek === 'starsi' || q.a.some(a => !String(a[0]).trim());
const dni = n => n === 1 ? 'deň' : n > 1 && n < 5 ? 'dni' : 'dní';
/* Precvičovanie (4.3): vynechaný deň sa dá zahrať dodatočne, ale bez hviezdičiek, série, stromu a odmien.
   Jeden príznak `precvic` na aktivite (téma, auto, angličtina); všetky miesta, čo niečo udeľujú, idú cez Precvic.teraz() / pripisBody(). */
const Precvic = {
  je: x => !!(x && x.precvic),
  teraz: () => Precvic.je(st.flow) || Precvic.je(st.auto) || Precvic.je(st.ang) || Precvic.je(st.misia),
  stitok: () => '<span class="chip tmavy precvic-stitok" style="--c:#CFE8FF">Len na precvičenie</span>',
  prazdne: () => ({ zisk: 0, noveOdznaky: [], noveOdmeny: [], noveHry: [], precvic: true }),
  poznamka: () => '<p class="precvic-pozn">Len na precvičenie: nedostaneš hviezdičky, séria ani strom sa nezmenia.</p>',
};
function pripisBody(n) { if (!n || Precvic.teraz()) return 0; st.body += n; S.set('body', st.body); return n; }
const denCislo = (dt = new Date()) => { const d = dt; return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); };
const temaDna = () => byId(Tyzden.temaDna(key(new Date())));

function seria() {
  let n = 0; const d = new Date();
  if (!st.dni.includes(key(d))) d.setDate(d.getDate() - 1);
  while (st.dni.includes(key(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function row(t) {
  const k = KAT[t.k];
  return `<button class="row" data-start="${t.id}" style="--c:${k.c}"><span class="thumb">${svg(t)}</span>
    <span class="row-main"><span class="row-t">${t.t}</span><span class="row-s">${k.nazov}${st.fav.includes(t.id) ? ` · ${ii(IK.srdce)}` : ''}</span></span>
    ${st.done.includes(t.id) ? '<span class="badge ok" aria-label="Hotovo">✓</span>' : '<span class="badge new">Nová</span>'}</button>`;
}

// odomknutý panel rodiča sa po vypršaní zámku sám zakryje (bez ťuknutia)
setInterval(() => { if (Rodic.odomknute && Date.now() > Rodic.do && /^rodic(Dieta|Nastavenia)?$/.test(st.faza)) render(); }, 15000);
