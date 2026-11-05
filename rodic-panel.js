// Účet rodiča (3.5), úloha C: panel rodiča (rodic, rodicDieta, rodicNastavenia).
// Tento súbor je zatiaľ kostra z úlohy A. Plní ho úloha C.
// Rozhranie (názvy sú záväzné):
//   views: { rodic: () => html, rodicDieta: () => html, rodicNastavenia: () => html }
//          doplnia sa do `brany` (st.faza) aj do `views`. Ak !Rodic.jeOdomknute(), presmerovať na Rodic.chod('rodicPin').
//   klik(b, d): spracuje tlačidlá panela; vráti true, ak klik spracoval
const RodicPanel = {
  views: {},
  klik(b, d) { return false; },
};
