/* Angličtina na každý deň: slová a vety pre denný kvízik. Úprava bez programovania: pridaj riadok na koniec zoznamu.
   ANG_SLOVA: 'skupina|anglicky|slovensky|čítaj|u'  (u = 1 ľahšie, 2 náročnejšie)
   ANG_VETY:  'anglicky|slovensky|slovo, ktoré sa dá vynechať|skupina tohto slova|u'  (slovo musí byť v ANG_SLOVA v tej istej skupine)
   Skupiny: zvierata, jedlo, domov, skola, telo, farby, cisla, slovesa, priroda, ludia, mesto, cas, pocity, sport */
const ANG_SKUPINY = {
  zvierata: 'Zvieratá', jedlo: 'Jedlo a pitie', domov: 'Doma', skola: 'Škola', telo: 'Telo a oblečenie', farby: 'Farby', cisla: 'Čísla',
  slovesa: 'Slovesá', priroda: 'Príroda', ludia: 'Ľudia', mesto: 'Mesto a cesta', cas: 'Čas a počasie',
  pocity: 'Pocity', sport: 'Šport a hry',
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
zvierata|goat|koza|gout|1
zvierata|hen|sliepka|hen|1
zvierata|chick|kuriatko|čik|1
zvierata|owl|sova|aul|1
zvierata|bee|včela|bí|1
zvierata|fox|líška|foks|1
zvierata|wolf|vlk|wulf|2
zvierata|tiger|tiger|tajgr|1
zvierata|giraffe|žirafa|džiraf|2
zvierata|squirrel|veverička|skvirl|2
zvierata|dolphin|delfín|dolfin|2
zvierata|whale|veľryba|wejl|2
jedlo|meat|mäso|mít|1
jedlo|butter|maslo|batr|1
jedlo|sugar|cukor|šugr|1
jedlo|salt|soľ|solt|1
jedlo|pizza|pizza|pica|1
jedlo|salad|šalát|selad|2
jedlo|strawberry|jahoda|stróberi|2
jedlo|grapes|hrozno|grejps|2
jedlo|lemon|citrón|lemn|2
jedlo|pear|hruška|pér|1
jedlo|tea|čaj|tí|1
jedlo|honey|med|hani|2
jedlo|jam|džem|džem|2
domov|sofa|pohovka|soufa|1
domov|floor|podlaha|flór|2
domov|wall|stena|wól|1
domov|roof|strecha|rúf|1
domov|stairs|schody|stérz|2
domov|computer|počítač|kompjútr|2
domov|phone|telefón|foun|1
domov|mirror|zrkadlo|mirr|2
domov|towel|uterák|taul|2
domov|blanket|prikrývka|blenkit|2
domov|picture|obraz|pikčr|2
skola|classroom|trieda|klásrúm|1
skola|board|tabuľa|bórd|2
skola|scissors|nožnice|sizrz|2
skola|glue|lepidlo|glú|1
skola|notebook|zošit|noutbuk|1
skola|test|písomka|test|1
skola|question|otázka|kveščn|2
skola|answer|odpoveď|ánsr|2
skola|story|príbeh|stóri|1
skola|letter|písmeno|letr|2
skola|word|slovo|wörd|1
skola|map|mapa|mep|1
telo|arm|rameno|ám|1
telo|leg|noha|leg|1
telo|finger|prst|fingr|1
telo|tooth|zub|túth|2
telo|face|tvár|fejs|1
telo|back|chrbát|bek|1
telo|neck|krk|nek|2
telo|tummy|brucho|tami|1
telo|heart|srdce|hárt|2
telo|dress|šaty|dres|1
telo|trousers|nohavice|trauzrz|2
telo|boots|čižmy|búts|1
telo|scarf|šál|skárf|2
telo|gloves|rukavice|glavz|2
farby|gold|zlatá|gould|2
farby|silver|strieborná|silvr|2
farby|colour|farba|kalr|1
cisla|zero|nula|zírou|1
cisla|eleven|jedenásť|ilevn|2
cisla|twelve|dvanásť|twelv|2
cisla|fifteen|pätnásť|fiftín|2
cisla|thirty|tridsať|törti|2
cisla|fifty|päťdesiat|fifti|2
cisla|thousand|tisíc|tauzend|2
cisla|half|polovica|háf|2
cisla|first|prvý|först|2
cisla|many|veľa|meni|1
slovesa|sit|sedieť|sit|1
slovesa|stand|stáť|stend|1
slovesa|come|prísť|kam|1
slovesa|go|ísť|gou|1
slovesa|give|dať|giv|1
slovesa|take|vziať|tejk|1
slovesa|see|vidieť|sí|1
slovesa|hear|počuť|hír|1
slovesa|love|milovať|lav|1
slovesa|want|chcieť|wont|1
slovesa|cry|plakať|kraj|1
slovesa|laugh|smiať sa|láf|1
slovesa|dance|tancovať|dáns|1
slovesa|cook|variť|kuk|2
slovesa|wash|umývať|woš|2
slovesa|listen|počúvať|lisn|2
slovesa|climb|liezť|klajm|2
slovesa|fly|lietať|flaj|1
slovesa|throw|hodiť|srou|2
slovesa|catch|chytiť|keč|2
priroda|sky|obloha|skaj|1
priroda|forest|les|forist|2
priroda|lake|jazero|lejk|2
priroda|beach|pláž|bíč|1
priroda|sand|piesok|send|1
priroda|leaf|list|líf|1
priroda|rainbow|dúha|rejnbou|1
priroda|island|ostrov|ajlend|2
priroda|hill|kopec|hil|2
priroda|stone|kameň|stoun|2
priroda|fire|oheň|fajr|2
priroda|wave|vlna|wejv|2
ludia|man|muž|men|1
ludia|woman|žena|wumn|1
ludia|child|dieťa|čajld|1
ludia|doctor|lekár|doktr|1
ludia|farmer|farmár|fármr|2
ludia|baker|pekár|bejkr|2
ludia|driver|vodič|drajvr|2
ludia|neighbour|sused|nejbr|2
ludia|family|rodina|femili|1
ludia|uncle|strýko|ankl|2
ludia|aunt|teta|ánt|2
ludia|cousin|bratranec|kazn|2
ludia|king|kráľ|king|1
ludia|queen|kráľovná|kvín|1
ludia|chef|šéfkuchár|šef|2
mesto|town|mesto|taun|1
mesto|road|cesta|roud|1
mesto|hospital|nemocnica|hospitl|2
mesto|station|stanica|stejšn|2
mesto|market|trh|márkit|2
mesto|church|kostol|čörč|2
mesto|castle|hrad|kásl|2
mesto|playground|ihrisko|plejgraund|2
mesto|cinema|kino|sinema|1
mesto|library|knižnica|lajbreri|2
mesto|zoo|zoo|zú|1
mesto|ship|loď|šip|1
mesto|boat|čln|bout|1
mesto|taxi|taxík|taksi|1
cas|time|čas|tajm|1
cas|week|týždeň|wík|1
cas|month|mesiac|manth|2
cas|year|rok|jír|1
cas|weekend|víkend|wíkend|1
cas|evening|večer|ívnin|2
cas|afternoon|popoludnie|áfternún|2
cas|yesterday|včera|jesterdej|2
cas|summer|leto|samr|1
cas|winter|zima|wintr|1
cas|spring|jar|spring|1
cas|autumn|jeseň|ótm|2
cas|sunny|slnečno|sani|1
cas|warm|teplý|wórm|1
cas|birthday|narodeniny|bördej|1
cas|hour|hodina|auer|2
cas|minute|minúta|minit|2
pocity|happy|šťastný|hepi|1
pocity|sad|smutný|sed|1
pocity|angry|nahnevaný|engri|1
pocity|tired|unavený|tajerd|1
pocity|hungry|hladný|hangri|1
pocity|thirsty|smädný|törsti|1
pocity|scared|vystrašený|skérd|2
pocity|excited|natešený|iksajtid|2
pocity|kind|láskavý|kajnd|2
pocity|brave|odvážny|brejv|2
pocity|funny|vtipný|fani|1
pocity|shy|hanblivý|šaj|2
pocity|proud|hrdý|praud|2
pocity|surprised|prekvapený|saprajzd|2
pocity|bored|znudený|bórd|2
pocity|sick|chorý|sik|1
pocity|clever|šikovný|klevr|2
pocity|quiet|tichý|kvajet|1
pocity|loud|hlasný|laud|1
sport|ball|lopta|ból|1
sport|game|hra|gejm|1
sport|team|tím|tím|1
sport|football|futbal|futból|1
sport|basketball|basketbal|báskitból|2
sport|tennis|tenis|tenis|1
sport|skate|korčuľovať|skejt|2
sport|ski|lyžovať|skí|1
sport|race|preteky|rejs|2
sport|win|vyhrať|win|1
sport|lose|prehrať|lúz|2
sport|goal|gól|goul|2
sport|toy|hračka|toj|1
sport|doll|bábika|dol|1
sport|puzzle|puzzle|pazl|2
sport|cards|karty|kárdz|2
sport|kite|šarkan|kajt|2
sport|rope|švihadlo|roup|2
sport|slide|šmýkačka|slajd|1
sport|swing|hojdačka|swing|1
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
I have one nose.|Mám jeden nos.|one|cisla|1
I see three birds.|Vidím tri vtáky.|three|cisla|1
The fish can swim.|Ryba vie plávať.|fish|zvierata|1
It is cold today.|Dnes je zima.|cold|cas|1
I read a book.|Čítam knihu.|book|skola|1
The baby is sleeping.|Bábätko spí.|baby|ludia|1
I like ice cream.|Mám rád zmrzlinu.|ice cream|jedlo|1
My sister can sing.|Moja sestra vie spievať.|sing|slovesa|2
The car is black.|Auto je čierne.|black|farby|1
The moon is in the sky.|Mesiac je na oblohe.|moon|priroda|1
I wash my hands.|Umývam si ruky.|wash|slovesa|2
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
The fox is red and clever.|Líška je červená a šikovná.|fox|zvierata|1
The tiger is a big cat.|Tiger je veľká mačka.|tiger|zvierata|1
The giraffe has a long neck.|Žirafa má dlhý krk.|giraffe|zvierata|2
A squirrel climbs the tree.|Veverička šplhá na strom.|squirrel|zvierata|2
The owl sleeps in the day.|Sova cez deň spí.|owl|zvierata|1
The bee is on the flower.|Včela je na kvete.|bee|zvierata|1
The goat eats grass.|Koza žerie trávu.|goat|zvierata|1
The whale lives in the sea.|Veľryba žije v mori.|whale|zvierata|2
The hen has five chicks.|Sliepka má päť kuriatok.|hen|zvierata|1
The dolphin can jump high.|Delfín vie vysoko skákať.|dolphin|zvierata|2
I like pizza.|Mám rád pizzu.|pizza|jedlo|1
Please pass the salt.|Podaj mi, prosím, soľ.|salt|jedlo|2
I put butter on my bread.|Dám si maslo na chlieb.|butter|jedlo|1
This strawberry is sweet.|Táto jahoda je sladká.|strawberry|jedlo|2
She drinks tea with honey.|Pije čaj s medom.|honey|jedlo|2
A lemon is yellow and sour.|Citrón je žltý a kyslý.|lemon|jedlo|2
I eat a pear.|Jem hrušku.|pear|jedlo|1
We make a salad.|Robíme šalát.|salad|jedlo|2
Sugar is sweet.|Cukor je sladký.|sugar|jedlo|1
The sofa is soft.|Pohovka je mäkká.|sofa|domov|1
The picture is on the wall.|Obraz visí na stene.|wall|domov|1
Look at the mirror.|Pozri sa do zrkadla.|mirror|domov|2
I have a warm blanket.|Mám teplú prikrývku.|blanket|domov|2
He is on the stairs.|Je na schodoch.|stairs|domov|2
The roof is red.|Strecha je červená.|roof|domov|1
Open your notebook.|Otvor si zošit.|notebook|skola|1
The teacher writes on the board.|Učiteľka píše na tabuľu.|board|skola|2
I know the answer.|Poznám odpoveď.|answer|skola|2
The map is in my bag.|Mapa je v mojej taške.|map|skola|2
Cut the paper with scissors.|Papier strihaj nožnicami.|scissors|skola|2
Our classroom is big.|Naša trieda je veľká.|classroom|skola|1
Raise your arm.|Zdvihni ruku.|arm|telo|1
I have ten fingers.|Mám desať prstov.|ten|cisla|1
My heart is beating fast.|Srdce mi rýchlo bije.|heart|telo|2
She has a happy face.|Má veselú tvár.|face|telo|1
It is cold, wear a scarf.|Je zima, nasaď si šál.|scarf|telo|2
Put on your boots.|Obuj si čižmy.|boots|telo|1
Let's dance.|Poďme tancovať.|dance|slovesa|1
I can climb a tree.|Viem vyliezť na strom.|climb|slovesa|2
Birds can fly.|Vtáky vedia lietať.|fly|slovesa|1
I listen to music.|Počúvam hudbu.|listen|slovesa|2
We cook dinner.|Varíme večeru.|cook|slovesa|2
Come here, please.|Poď sem, prosím.|come|slovesa|1
I am happy today.|Dnes som šťastný.|happy|pocity|1
She is sad.|Je smutná.|sad|pocity|1
I am hungry.|Som hladný.|hungry|pocity|1
He is tired after school.|Je unavený po škole.|tired|pocity|2
Do not be scared.|Neboj sa.|scared|pocity|2
This joke is funny.|Tento vtip je smiešny.|funny|pocity|2
Throw the ball to me.|Hoď mi loptu.|ball|sport|1
I love this game.|Milujem túto hru.|game|sport|1
Our team can win.|Náš tím môže vyhrať.|team|sport|2
My doll is small.|Moja bábika je malá.|doll|sport|1
Let us fly a kite.|Poďme púšťať šarkana.|kite|sport|2
He kicks the ball into the goal.|Kopne loptu do brány.|goal|sport|2
The bus station is near.|Autobusová stanica je blízko.|station|mesto|2
We go to the zoo.|Ideme do zoo.|zoo|mesto|1
The castle is old.|Hrad je starý.|castle|mesto|2
The boat is small.|Čln je malý.|boat|mesto|1
The road is long.|Cesta je dlhá.|road|mesto|1
My mum works in a hospital.|Moja mama pracuje v nemocnici.|hospital|mesto|2
There are seven days in a week.|V týždni je sedem dní.|week|cas|2
It is a sunny day.|Je slnečný deň.|sunny|cas|1
Summer is hot.|Leto je horúce.|summer|cas|1
Winter is cold.|Zima je studená.|winter|cas|1
Happy birthday to you!|Všetko najlepšie k narodeninám!|birthday|cas|1
See you in the evening.|Uvidíme sa večer.|evening|cas|2
Look at the rainbow.|Pozri sa na dúhu.|rainbow|priroda|1
The beach has soft sand.|Pláž má jemný piesok.|sand|priroda|2
The leaf is green.|List je zelený.|leaf|priroda|1
My uncle is a farmer.|Môj strýko je farmár.|farmer|ludia|2
The doctor is kind.|Lekár je láskavý.|doctor|ludia|1
The baker makes bread.|Pekár robí chlieb.|baker|ludia|2
My family is big.|Moja rodina je veľká.|family|ludia|1
I have twelve pencils.|Mám dvanásť ceruziek.|twelve|cisla|2
My grandpa is fifty years old.|Môj dedko má päťdesiat rokov.|fifty|cisla|2
`.trim().split('\n').map(r => { const [en, sk, v, g, u] = r.split('|'); return { en, sk, v, g, u: +u }; });
