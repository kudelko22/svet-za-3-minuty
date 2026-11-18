/* Okruh týždňa a história dní (verzia 4.0).
   Rozhranie pre Domov (záväzné): Tyzden.okruhy(), vybrany(dieta?), nastav(id, dieta?), dni(dieta?), temaDna(datumISO, dieta?), otvor(datumISO).
   Ukladá sa do localStorage (kľúč tyzden-okruhy-<id dieťaťa>): zoznam zmien { od: 'YYYY-MM-DD', id }.
   Zmena platí od dnešného dňa do konca týždňa (od pondelka je znova Zmiešaný), minulé dni sa nemenia.
   5.1: deň je „hotový“ (hotovo), keď sa v ňom dieťa učilo (st.dni, rovnako ako séria a strom), nie podľa toho, či je téma dňa v st.done.
   Téma dňa je len vzorec (číslo dňa a okruh), takže je stabilná aj pre dni, keď dieťa appku nespustilo. */
const Tyzden = {
  _id: d => d || st.dietaId || 'x',
  _kluc(d) { return 'tyzden-okruhy-' + this._id(d); },
  _dnes() { return key(new Date()); },
  _datum(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); },
  _pondelok(iso) { const d = this._datum(iso); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return key(d); },
  _cislo(iso) { const d = this._datum(iso); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); },
  okruhy() {
    return [{ id: 'zmiesany', nazov: 'Zmiešaný', ikona: IK.duha ? IK.duha : '' }, ...SKUPINY.map(g => ({ id: g.id, nazov: g.nazov, ikona: g.ikona() }))];
  },
  _zmeny(dieta) { const z = S.get(this._kluc(dieta), []); return Array.isArray(z) ? z.filter(x => x && typeof x.od === 'string') : []; },
  // okruh platný pre daný deň: posledná zmena z toho istého týždňa, ktorá nie je po tom dni
  okruhNa(iso, dieta) {
    const p = this._pondelok(iso); let r = 'zmiesany';
    for (const z of this._zmeny(dieta)) if (z.od <= iso && this._pondelok(z.od) === p && (z.id === 'zmiesany' || SKUPINY.some(g => g.id === z.id))) r = z.id;
    return r;
  },
  vybrany(dieta) { return this.okruhNa(this._dnes(), dieta); },
  _zajtra() { const d = this._datum(this._dnes()); d.setDate(d.getDate() + 1); return key(d); },
  // 5.1: keď sa dieťa dnes už učilo, zmena platí až od zajtra (inak by sa zmenila už splnená téma dňa a dala by sa získať druhá);
  // v nedeľu je zajtra nový týždeň, vtedy platí hneď. Vráti true (platí dnes), 'zajtra' alebo false (neplatný okruh).
  nastav(id, dieta) {
    if (id !== 'zmiesany' && !SKUPINY.some(g => g.id === id)) return false;
    const dnes0 = this._dnes(), p = this._pondelok(dnes0), zajtra = this._zajtra();
    const dnes = !dieta && st.dni.includes(dnes0) && this._pondelok(zajtra) === p ? zajtra : dnes0;
    const h = this._datum(p); h.setDate(h.getDate() - 7 * 14); const hranica = key(h); // minulé týždne ostanú (história Prehľadu), zahodia sa až staršie ako 14 týždňov
    const z = this._zmeny(dieta).filter(x => x.od !== dnes && x.od >= hranica && !(dnes === dnes0 && x.od > dnes0));
    z.push({ od: dnes, id });
    S.set(this._kluc(dieta), z);
    return dnes === dnes0 ? true : 'zajtra';
  },
  // okruh, ktorý začne platiť zajtra (zmena po dnešnom učení), inak null
  odZajtra(dieta) { const z = this._zajtra(), o = this.okruhNa(z, dieta); return this._pondelok(z) === this._pondelok(this._dnes()) && o !== this.vybrany(dieta) ? o : null; },
  temaDna(iso, dieta) {
    const v = TV(), o = this.okruhNa(iso, dieta), g = SKUPINY.find(x => x.id === o);
    const pool = g ? v.filter(t => g.kat.includes(t.k)) : v, s = pool.length ? pool : v;
    return s[this._cislo(iso) % s.length].id;
  },
  dni(dieta, posun = 0) { // posun = počet týždňov dozadu (0 = tento týždeň, -1 = minulý)
    const dnes = this._dnes(), start = this._datum(this._pondelok(dnes)), nazvy = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
    start.setDate(start.getDate() + 7 * Math.min(0, Math.trunc(+posun || 0)));
    return nazvy.map((den, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); const datum = key(d), temaId = this.temaDna(datum, dieta), bud = datum > dnes;
      return { datum, den, jeDnes: datum === dnes, jeBudúci: bud, jeBudici: bud, temaId, hotovo: !bud && st.dni.includes(datum) };
    });
  },
  otvor(iso) {
    if (!/^\d{4}-\d\d-\d\d$/.test(iso) || iso > this._dnes()) return false;
    const id = this.temaDna(iso);
    if (!byId(id)) return false;
    startTema(id, iso < this._dnes() && !st.done.includes(id)); return true; // zmeškaný deň = len na precvičenie (bez hviezdičiek, série a stromu)
  },
};
