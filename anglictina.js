/* Angličtina na každý deň: slová a vety pre denný kvízik. Úprava bez programovania: pridaj riadok na koniec zoznamu.
   ANG_SLOVA: 'skupina|anglicky|slovensky|čítaj|u'  (u = 1 ľahšie, 2 náročnejšie)
   ANG_VETY:  'anglicky|slovensky|slovo, ktoré sa dá vynechať|skupina tohto slova|u'  (slovo musí byť v ANG_SLOVA v tej istej skupine)
   Skupiny: zvierata, jedlo, domov, skola, telo, farby, cisla, slovesa, priroda, ludia, mesto, cas */
const ANG_SKUPINY = {
  zvierata: 'Zvieratá', jedlo: 'Jedlo a pitie', domov: 'Doma', skola: 'Škola', telo: 'Telo a oblečenie', farby: 'Farby', cisla: 'Čísla',
  slovesa: 'Slovesá', priroda: 'Príroda', ludia: 'Ľudia', mesto: 'Mesto a cesta', cas: 'Čas a počasie',
};
const ANG_SLOVA = `
zvierata|cat|mačka|ket|1
zvierata|dog|pes|dog|1
zvierata|bird|vtáčik|börd|1
zvierata|fish|ryba|fiš|1
zvierata|horse|kôň|hórs|1
zvierata|cow|krava|kau|1
zvierata|pig|prasiatko|pig|1
zvierata|rabbit|zajac|rebit|1
zvierata|mouse|myš|maus|1
zvierata|duck|kačka|dak|1
zvierata|sheep|ovca|šíp|2
zvierata|frog|žaba|frog|1
zvierata|lion|lev|lajen|1
zvierata|monkey|opica|manki|2
zvierata|elephant|slon|elifent|2
zvierata|bear|medveď|bér|2
zvierata|snake|had|snejk|2
zvierata|spider|pavúk|spajder|2
zvierata|butterfly|motýľ|batrflaj|2
zvierata|turtle|korytnačka|törtl|2
jedlo|apple|jablko|epl|1
jedlo|banana|banán|banána|1
jedlo|milk|mlieko|milk|1
jedlo|water|voda|vóter|1
jedlo|bread|chlieb|bred|1
jedlo|cheese|syr|číz|1
jedlo|egg|vajce|eg|1
jedlo|cake|torta|kejk|1
jedlo|juice|džús|džús|1
jedlo|soup|polievka|súp|2
jedlo|rice|ryža|rajs|2
jedlo|chicken|kura|čikin|2
jedlo|carrot|mrkva|kerot|2
jedlo|potato|zemiak|poteitou|2
jedlo|tomato|paradajka|tomejtou|2
jedlo|orange|pomaranč|orindž|1
jedlo|ice cream|zmrzlina|ajs krím|1
jedlo|sandwich|obložený chlieb|senvidž|2
domov|house|dom|haus|1
domov|door|dvere|dór|1
domov|window|okno|window|1
domov|table|stôl|tejbl|1
domov|chair|stolička|čér|1
domov|bed|posteľ|bed|1
domov|kitchen|kuchyňa|kičin|2
domov|bathroom|kúpeľňa|bátrúm|2
domov|garden|záhrada|gárdn|2
domov|lamp|lampa|lemp|1
domov|key|kľúč|kí|2
domov|clock|hodiny|klok|2
skola|book|kniha|buk|1
skola|pen|pero|pen|1
skola|pencil|ceruzka|pensl|1
skola|bag|taška|beg|1
skola|school|škola|skúl|1
skola|teacher|učiteľ|tíčr|1
skola|desk|lavica|desk|2
skola|paper|papier|pejpr|2
skola|ruler|pravítko|rúlr|2
skola|homework|domáca úloha|houmvörk|2
skola|lesson|vyučovacia hodina|lesn|2
telo|head|hlava|hed|1
telo|hand|ruka|hend|1
telo|foot|noha, chodidlo|fut|1
telo|eye|oko|aj|1
telo|ear|ucho|ír|1
telo|nose|nos|nouz|1
telo|mouth|ústa|maus|1
telo|hair|vlasy|hér|1
telo|hat|klobúk|het|1
telo|shoes|topánky|šúz|1
telo|shirt|tričko|šört|2
telo|jacket|bunda|džekit|2
telo|socks|ponožky|soks|2
telo|knee|koleno|ní|2
farby|red|červená|red|1
farby|blue|modrá|blú|1
farby|green|zelená|grín|1
farby|yellow|žltá|jelou|1
farby|black|čierna|blek|1
farby|white|biela|wajt|1
farby|pink|ružová|pink|1
farby|purple|fialová|pörpl|2
farby|brown|hnedá|braun|2
farby|grey|sivá|grej|2
cisla|one|jeden|wan|1
cisla|two|dva|tú|1
cisla|three|tri|trí|1
cisla|four|štyri|fór|1
cisla|five|päť|fajv|1
cisla|six|šesť|siks|1
cisla|seven|sedem|sevn|1
cisla|eight|osem|ejt|1
cisla|nine|deväť|najn|1
cisla|ten|desať|ten|1
cisla|twenty|dvadsať|twenti|2
cisla|hundred|sto|handred|2
slovesa|run|bežať|ran|1
slovesa|jump|skákať|džamp|1
slovesa|eat|jesť|ít|1
slovesa|drink|piť|drink|1
slovesa|sleep|spať|slíp|1
slovesa|read|čítať|ríd|1
slovesa|write|písať|rajt|1
slovesa|play|hrať sa|plej|1
slovesa|sing|spievať|sing|2
slovesa|swim|plávať|swim|2
slovesa|draw|kresliť|dró|2
slovesa|walk|chodiť|wók|2
slovesa|open|otvoriť|oupn|2
slovesa|help|pomôcť|help|2
priroda|sun|slnko|san|1
priroda|moon|mesiac|mún|1
priroda|star|hviezda|stár|1
priroda|tree|strom|trí|1
priroda|flower|kvetina|flauer|1
priroda|river|rieka|river|2
priroda|mountain|hora|mauntin|2
priroda|sea|more|sí|2
priroda|grass|tráva|grás|2
priroda|rain|dážď|rejn|1
ludia|mother|mama|madr|1
ludia|father|otec|fádr|1
ludia|sister|sestra|sistr|1
ludia|brother|brat|bradr|1
ludia|friend|kamarát|frend|1
ludia|baby|bábätko|bejbi|1
ludia|grandma|babka|grenmá|2
ludia|grandpa|dedko|grenpá|2
ludia|boy|chlapec|boj|1
ludia|girl|dievča|görl|1
mesto|car|auto|kár|1
mesto|bus|autobus|bas|1
mesto|train|vlak|trejn|1
mesto|bike|bicykel|bajk|1
mesto|street|ulica|strít|2
mesto|shop|obchod|šop|2
mesto|park|park|párk|1
mesto|bridge|most|bridž|2
mesto|airplane|lietadlo|érplejn|2
mesto|left|vľavo|left|2
mesto|right|vpravo|rajt|2
cas|day|deň|dej|1
cas|night|noc|najt|1
cas|morning|ráno|mórnink|1
cas|today|dnes|tudej|2
cas|tomorrow|zajtra|tumorou|2
cas|hot|horúci|hot|1
cas|cold|studený|kould|1
cas|snow|sneh|snou|1
cas|wind|vietor|wind|2
cas|cloud|oblak|klaud|2
`.trim().split('\n').map(r => { const [g, en, sk, cit, u] = r.split('|'); return { g, en, sk, cit, u: +u }; });
const ANG_VETY = `
The cat is on the bed.|Mačka je na posteli.|bed|domov|1
I have a red hat.|Mám červený klobúk.|red|farby|1
I like milk.|Mám rád mlieko.|milk|jedlo|1
This is my mother.|Toto je moja mama.|mother|ludia|1
The dog can run.|Pes vie behať.|run|slovesa|1
I see the sun.|Vidím slnko.|sun|priroda|1
I have two eyes.|Mám dve oči.|two|cisla|2
The bird can fly.|Vták vie lietať.|bird|zvierata|1
I eat an apple.|Jem jablko.|apple|jedlo|1
Open the door, please.|Otvor dvere, prosím.|door|domov|1
I go to school.|Idem do školy.|school|skola|1
My friend has a blue bag.|Môj kamarát má modrú tašku.|blue|farby|1
I have five fingers.|Mám päť prstov.|five|cisla|1
The fish can swim.|Ryba vie plávať.|fish|zvierata|1
It is cold today.|Dnes je zima.|cold|cas|1
I read a book.|Čítam knihu.|book|skola|1
The baby is sleeping.|Bábätko spí.|baby|ludia|1
I like ice cream.|Mám rád zmrzlinu.|ice cream|jedlo|1
My sister can sing.|Moja sestra vie spievať.|sing|slovesa|2
The car is black.|Auto je čierne.|black|farby|1
The moon is in the sky.|Mesiac je na oblohe.|moon|priroda|1
I wash my hands.|Umývam si ruky.|hand|telo|2
Good morning, teacher!|Dobré ráno, pani učiteľka!|morning|cas|1
I draw a flower.|Kreslím kvetinu.|flower|priroda|2
We play in the park.|Hráme sa v parku.|park|mesto|2
My brother has a green bike.|Môj brat má zelený bicykel.|bike|mesto|2
There are ten ducks on the river.|Na rieke je desať káčat.|river|priroda|2
Can you help me, please?|Môžeš mi pomôcť, prosím?|help|slovesa|2
The soup is hot.|Polievka je horúca.|hot|cas|2
I put my shoes on.|Obúvam si topánky.|shoes|telo|2
Grandma has a big garden.|Babka má veľkú záhradu.|garden|domov|2
Turn left at the shop.|Odbočte vľavo pri obchode.|left|mesto|2
I drink water every day.|Každý deň pijem vodu.|water|jedlo|2
The teacher has a long ruler.|Učiteľka má dlhé pravítko.|ruler|skola|2
Tomorrow we go to the sea.|Zajtra ideme k moru.|sea|priroda|2
I have a pencil and a pen.|Mám ceruzku a pero.|pencil|skola|2
The monkey eats a banana.|Opica je banán.|banana|jedlo|2
It is snowing and the wind is cold.|Sneží a vietor je studený.|wind|cas|2
My grandpa reads in the kitchen.|Môj dedko číta v kuchyni.|kitchen|domov|2
The train is faster than the bus.|Vlak je rýchlejší ako autobus.|train|mesto|2
I have a little rabbit.|Mám malého zajaca.|rabbit|zvierata|1
She is my best friend.|Ona je moja najlepšia kamarátka.|friend|ludia|2
We eat bread and cheese.|Jeme chlieb a syr.|cheese|jedlo|1
The lion is a big cat.|Lev je veľká mačka.|lion|zvierata|2
I jump very high.|Skáčem veľmi vysoko.|jump|slovesa|1
`.trim().split('\n').map(r => { const [en, sk, v, g, u] = r.split('|'); return { en, sk, v, g, u: +u }; });
