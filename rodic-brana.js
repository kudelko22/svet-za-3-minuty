// Účet rodiča (3.5), úloha B: obrazovky pred panelom (rodicTvorba, rodicPin, karta rodiča vo výbere).
// Tento súbor je zatiaľ kostra z úlohy A. Plní ho úloha B, appka.html sa nemení.
// Rozhranie (názvy sú záväzné):
//   brany: { rodicTvorba: () => html, rodicPin: () => html }  doplnia sa do `brany` (st.faza)
//   vyber(povodny): vráti html výberu dieťaťa; `povodny()` dá pôvodný výber z 3.0.2 (stačí ho doplniť o kartu rodiča)
//   klik(b, d): spracuje data-rodic-vstup, data-rodic-novy, data-pin-cislo, data-pin-zrus, data-rodic-zabudol; vráti true, ak klik spracoval
//   po(): zavolá sa po každom vykreslení brány (väzby na vstupy a pod.)
const RodicBrana = {
  brany: {},
  vyber: povodny => povodny(),
  klik(b, d) { return false; },
  po() {},
};
