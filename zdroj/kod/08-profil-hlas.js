/* Hlas na čítanie: zo slovenských hlasov v telefóne vyberie najkrajší (vylepšené a „prirodzené“ znejú oveľa ľudskejšie) */
const kvalitaHlasu = v => { const x = v.name + ' ' + v.voiceURI; return /premium|prémiov/i.test(x) ? 3 : /enhanced|vylepšen|natural|neural|online|network|wavenet|google/i.test(x) ? 2 : 0; };
const hlasy = () => { try { return speechSynthesis.getVoices().filter(v => /^sk/i.test(v.lang)).sort((a, b) => kvalitaHlasu(b) - kvalitaHlasu(a)); } catch (e) { return []; } };
const hlasSk = () => { const z = hlasy(), vol = S.get('hlas', ''); return z.find(v => v.voiceURI === vol) || z[0] || null; };
const menoHlasu = v => v.name.replace(/^Microsoft\s+/i, '').replace(/\s+-\s+.*$/, '').replace(/\bOnline\b|\s*\(.*?\)/gi, '').trim() || v.name;
const radaHlas = () => Zvuk.ios
  ? 'Krajší hlas zadarmo: v iPhone otvorte Nastavenia → Prístupnosť → Hovorený obsah → Hlasy → Slovenčina a stiahnite hlas Laura (vylepšený). Potom appku úplne zavrite a otvorte znova.'
  : /Android/i.test(navigator.userAgent)
    ? 'Krajší hlas zadarmo: v Nastaveniach telefónu vyhľadajte „Prevod textu na reč“, pri službe Google stiahnite slovenčinu a vyberte hlas vo vysokej kvalite. Potom appku zavrite a otvorte znova.'
    : 'Na počítači číta najkrajšie prehliadač Microsoft Edge (hlasy Viktória a Lukáš).';
function hlasyHtml() {
  const vik = Nahravky.zoznam ? `<button class="hlas" data-hlas="viktoria" aria-pressed="${Nahravky.zapnute()}"><b>Viktória</b><small>${ikn('hviezda')} najkrajší, na každom telefóne</small></button>` : '';
  if (!('speechSynthesis' in window)) return vik ? `<div class="hlasy">${vik}</div>` : '<p class="muted">Tento telefón nevie čítať nahlas.</p>';
  const z = hlasy(), vyb = vik && Nahravky.zapnute() ? null : hlasSk();
  if (!z.length) return vik ? `<div class="hlasy">${vik}</div>` : `<p class="muted">Slovenský hlas sa v telefóne zatiaľ nenašiel.</p><p class="rada">${radaHlas()}</p>`;
  return `<div class="hlasy">${vik}${z.map(v => `<button class="hlas" data-hlas="${esc(v.voiceURI)}" aria-pressed="${v === vyb}"><b>${esc(menoHlasu(v))}</b><small>${kvalitaHlasu(v) ? ikn('hviezda') + ' kvalitný' : 'hlas telefónu'}</small></button>`).join('')}</div>
    <p class="muted">Ťuknite na hlas a vypočujte si ho.</p>${vik || kvalitaHlasu(z[0]) ? '' : `<p class="rada">${radaHlas()}</p>`}`;
}
try { speechSynthesis.addEventListener('voiceschanged', () => { const el = document.getElementById('hlasy'); if (el) el.innerHTML = hlasyHtml(); }); } catch (e) {}

