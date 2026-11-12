/* Angličtina na každý deň: slová a vety pre denný kvízik. Úprava bez programovania: pridaj riadok na koniec zoznamu.
   ANG_SLOVA: 'skupina|anglicky|slovensky|čítaj|u'  (u = 1 ľahšie, 2 náročnejšie)
   ANG_VETY:  'anglicky|slovensky|slovo, ktoré sa dá vynechať|skupina tohto slova|u'  (slovo musí byť v ANG_SLOVA v tej istej skupine)
   Skupiny: zvierata, jedlo, domov, skola, telo, farby, cisla, slovesa, priroda, ludia, mesto, cas, pocity, sport */
const ANG_SKUPINY = {
  zvierata: 'Zvieratá', jedlo: 'Jedlo a pitie', domov: 'Doma', skola: 'Škola', telo: 'Telo a oblečenie', farby: 'Farby', cisla: 'Čísla',
  slovesa: 'Slovesá', priroda: 'Príroda', ludia: 'Ľudia', mesto: 'Mesto a cesta', cas: 'Čas a počasie',
  pocity: 'Pocity', sport: 'Šport a hry',
  ovocie: 'Ovocie a zelenina', doprava: 'Vozidlá a výlety', povolania: 'Povolania a práca', hudba: 'Hudba a umenie',
  divoke: 'Divoké a morské zvieratá', vesmir: 'Vesmír a svet', veci: 'Veci okolo nás', opacne: 'Opaky a vlastnosti',
  otazky: 'Slušné slová a otázky', predlozky: 'Kde to je?',
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
cas|month|mesiac v roku|manth|2
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
ovocie|fruit|ovocie|frút|1
ovocie|vegetable|zelenina|vedžtabl|2
ovocie|cherry|čerešňa|čeri|1
ovocie|kiwi|kiwi|kíwí|1
ovocie|corn|kukurica|kórn|1
ovocie|nut|orech|nat|1
ovocie|peach|broskyňa|píč|2
ovocie|plum|slivka|plam|2
ovocie|melon|melón|melon|2
ovocie|watermelon|vodový melón|wótrmelon|2
ovocie|pineapple|ananás|pajnepl|2
ovocie|coconut|kokos|koukonat|2
ovocie|raspberry|malina|rázberi|2
ovocie|cucumber|uhorka|kjúkambr|2
ovocie|onion|cibuľa|anjn|2
ovocie|pepper|paprika|pepr|2
ovocie|peas|hrášok|píz|2
ovocie|mushroom|huba|mašrúm|2
ovocie|cabbage|kapusta|kebidž|2
ovocie|broccoli|brokolica|brokoli|2
ovocie|garlic|cesnak|gárlik|2
ovocie|bean|fazuľa|bín|2
doprava|truck|nákladiak|trak|1
doprava|tractor|traktor|traktr|1
doprava|scooter|kolobežka|skútr|1
doprava|wheel|koleso|wíl|1
doprava|ticket|lístok|tikit|1
doprava|trip|výlet|trip|1
doprava|helicopter|vrtuľník|helikoptr|2
doprava|motorbike|motorka|moutrbajk|2
doprava|tram|električka|trem|2
doprava|submarine|ponorka|sabmarín|2
doprava|ambulance|sanitka|embjulens|2
doprava|engine|motor|endžin|2
doprava|traffic light|semafor|trafik lajt|2
doprava|journey|cesta, plavba|džörni|2
povolania|job|práca, povolanie|džob|1
povolania|work|pracovať|wörk|1
povolania|student|študent|stjúdnt|1
povolania|pupil|žiak|pjúpl|1
povolania|policeman|policajt|polísmen|1
povolania|firefighter|hasič|fajrfajtr|1
povolania|singer|spevák|singr|1
povolania|pilot|pilot|pajlot|2
povolania|nurse|zdravotná sestra|nörs|2
povolania|dentist|zubár|dentist|2
povolania|waiter|čašník|wejtr|2
povolania|artist|umelec|ártist|2
povolania|builder|staviteľ|bildr|2
povolania|postman|poštár|poustmen|2
povolania|vet|veterinár|vet|2
povolania|scientist|vedec|sajentist|2
povolania|actor|herec|ektr|2
povolania|musician|hudobník|mjuzišn|2
hudba|music|hudba|mjúzik|1
hudba|song|pieseň|song|1
hudba|guitar|gitara|gitár|1
hudba|piano|klavír|piano|1
hudba|drum|bubon|dram|1
hudba|film|film|film|1
hudba|photo|fotografia|foutou|1
hudba|paint|maľovať|pejnt|1
hudba|cartoon|kreslená rozprávka|kártún|1
hudba|violin|husle|vajolin|2
hudba|trumpet|trúbka|trampit|2
hudba|flute|flauta|flút|2
hudba|band|kapela|bend|2
hudba|concert|koncert|konsrt|2
hudba|theatre|divadlo|thíatr|2
hudba|hobby|záľuba|hobi|2
hudba|clap|tlieskať|klep|2
hudba|whistle|pískať|wisl|2
hudba|microphone|mikrofón|majkrofoun|2
divoke|ant|mravec|ent|1
divoke|ladybird|lienka|lejdibörd|1
divoke|snail|slimák|snejl|1
divoke|worm|dážďovka|wörm|1
divoke|crab|krab|kreb|1
divoke|shark|žralok|šárk|1
divoke|penguin|tučniak|pengwin|1
divoke|shell|mušľa|šel|1
divoke|zebra|zebra|zíbra|1
divoke|panda|panda|penda|1
divoke|bat|netopier|bet|2
divoke|octopus|chobotnica|oktapas|2
divoke|jellyfish|medúza|dželifiš|2
divoke|seal|tuleň|síl|2
divoke|starfish|hviezdica|stárfiš|2
divoke|seahorse|morský koník|síhórs|2
divoke|crocodile|krokodíl|krokodajl|2
divoke|parrot|papagáj|perot|2
divoke|hedgehog|jež|hedžhog|2
divoke|deer|jeleň|dír|2
divoke|camel|ťava|kemel|2
divoke|kangaroo|klokan|kengarú|2
divoke|donkey|somár|donki|2
divoke|mosquito|komár|moskítou|2
divoke|hippo|hroch|hipou|2
vesmir|space|vesmír|spejs|1
vesmir|planet|planéta|plenit|1
vesmir|earth|Zem|örth|1
vesmir|rocket|raketa|rokit|1
vesmir|robot|robot|roubot|1
vesmir|alien|mimozemšťan|ejlien|1
vesmir|air|vzduch|ér|1
vesmir|world|svet|wörld|1
vesmir|dark|tma, tmavý|dárk|1
vesmir|light|svetlo|lajt|1
vesmir|ice|ľad|ajs|1
vesmir|astronaut|astronaut|estronót|2
vesmir|comet|kométa|komit|2
vesmir|telescope|ďalekohľad|teliskoup|2
vesmir|galaxy|galaxia|gelaksi|2
vesmir|country|krajina|kantri|2
vesmir|ocean|oceán|oušn|2
vesmir|desert|púšť|dezrt|2
vesmir|volcano|sopka|volkejnou|2
vesmir|storm|búrka|štórm|2
vesmir|flag|vlajka|fleg|2
vesmir|north|sever|nórth|2
vesmir|south|juh|sauth|2
veci|box|škatuľa|boks|1
veci|bottle|fľaša|botl|1
veci|cup|šálka|kap|1
veci|glass|pohár|glás|1
veci|plate|tanier|plejt|1
veci|spoon|lyžica|spún|1
veci|bowl|miska|boul|1
veci|umbrella|dáždnik|ambrela|1
veci|money|peniaze|mani|1
veci|gift|darček|gift|1
veci|balloon|balón|balún|1
veci|candle|sviečka|kendl|1
veci|soap|mydlo|soup|1
veci|fork|vidlička|fórk|2
veci|knife|nôž|najf|2
veci|watch|hodinky|woč|2
veci|glasses|okuliare|glásiz|2
veci|coin|minca|kojn|2
veci|camera|fotoaparát|kemera|2
veci|television|televízor|televižn|2
veci|comb|hrebeň|koum|2
veci|wallet|peňaženka|wolit|2
veci|hammer|kladivo|hemr|2
veci|ladder|rebrík|ledr|2
veci|battery|batéria|baterí|2
veci|button|gombík|batn|2
opacne|big|veľký|big|1
opacne|small|malý|smól|1
opacne|long|dlhý|long|1
opacne|short|krátky|šórt|1
opacne|tall|vysoký|tól|1
opacne|fast|rýchly|fást|1
opacne|slow|pomalý|slou|1
opacne|new|nový|njú|1
opacne|old|starý|ould|1
opacne|good|dobrý|gud|1
opacne|bad|zlý|bed|1
opacne|clean|čistý|klín|1
opacne|sweet|sladký|swít|1
opacne|up|hore|ap|1
opacne|down|dole|daun|1
opacne|young|mladý|jang|2
opacne|hard|tvrdý|hárd|2
opacne|soft|mäkký|soft|2
opacne|heavy|ťažký|hevi|2
opacne|full|plný|ful|2
opacne|empty|prázdny|empti|2
opacne|dirty|špinavý|dörti|2
opacne|wet|mokrý|wet|2
opacne|dry|suchý|draj|2
opacne|easy|ľahký|ízi|2
opacne|difficult|ťažký, náročný|difikalt|2
opacne|beautiful|krásny|bjútiful|2
opacne|ugly|škaredý|agli|2
opacne|different|iný|difrnt|2
opacne|high|vysoko|haj|2
opacne|sour|kyslý|saur|2
otazky|hello|ahoj|helou|1
otazky|goodbye|dovidenia|gudbaj|1
otazky|please|prosím|plíz|1
otazky|thank you|ďakujem|thenk jú|1
otazky|sorry|prepáč|sori|1
otazky|yes|áno|jes|1
otazky|no|nie|nou|1
otazky|what|čo|wot|1
otazky|where|kde|wér|1
otazky|who|kto|hú|1
otazky|how|ako|hau|1
otazky|name|meno|nejm|1
otazky|very|veľmi|veri|1
otazky|goodnight|dobrú noc|gudnajt|1
otazky|why|prečo|waj|2
otazky|when|kedy|wen|2
otazky|welcome|vitaj|welkam|2
otazky|excuse me|prepáčte|ikskjúz mí|2
otazky|great|skvelé|grejt|2
otazky|maybe|možno|mejbí|2
otazky|because|pretože|bikoz|2
otazky|again|znova|agen|2
otazky|together|spolu|tugedr|2
otazky|always|vždy|ólwejz|2
otazky|never|nikdy|nevr|2
predlozky|in|v|in|1
predlozky|on|na|on|1
predlozky|under|pod|andr|1
predlozky|near|blízko|nír|1
predlozky|far|ďaleko|fár|1
predlozky|here|tu|hír|1
predlozky|there|tam|dér|1
predlozky|behind|za|bihajnd|2
predlozky|between|medzi|bitwín|2
predlozky|next to|vedľa|nekst tú|2
predlozky|in front of|pred|in frant ov|2
predlozky|inside|vnútri|insajd|2
predlozky|outside|vonku|autsajd|2
predlozky|around|okolo|araund|2
zvierata|puppy|šteňa|papi|1
zvierata|kitten|mačiatko|kitn|1
zvierata|lamb|jahňa|lem|1
zvierata|hamster|škrečok|hemstr|1
zvierata|goose|hus|gús|2
zvierata|pigeon|holub|pidžn|2
zvierata|swan|labuť|swon|2
zvierata|eagle|orol|ígl|2
zvierata|crow|vrana|krou|2
zvierata|rooster|kohút|rúster|2
jedlo|breakfast|raňajky|brekfast|1
jedlo|lunch|obed|lanč|1
jedlo|dinner|večera|dinr|1
jedlo|snack|desiata, olovrant|snek|1
jedlo|biscuit|sušienka|biskit|1
jedlo|chocolate|čokoláda|čoklit|1
jedlo|sweets|sladkosti|swítz|1
jedlo|popcorn|popcorn|popkórn|1
jedlo|sausage|klobása|sosidž|2
jedlo|pasta|cestoviny|pasta|2
jedlo|pancake|palacinka|penkejk|2
jedlo|fries|hranolky|frajz|2
jedlo|flour|múka|flauer|2
jedlo|menu|jedálny lístok|menjú|2
domov|bedroom|spálňa|bedrúm|1
domov|fridge|chladnička|fridž|1
domov|pillow|vankúš|pilou|1
domov|living room|obývačka|living rúm|2
domov|toilet|záchod|tojlit|2
domov|shower|sprcha|šauer|2
domov|bath|vaňa|báth|2
domov|oven|rúra|avn|2
domov|shelf|polica|šelf|2
domov|carpet|koberec|kárpit|2
domov|curtain|záves|körtn|2
domov|fence|plot|fens|2
domov|gate|brána|gejt|2
skola|rubber|guma|rabr|1
skola|crayon|pastelka|krejon|1
skola|page|strana|pejdž|1
skola|break|prestávka|brejk|1
skola|bell|zvonček|bel|1
skola|maths|matematika|meths|1
skola|marker|fixka|márkr|2
skola|dictionary|slovník|dikšnri|2
skola|subject|predmet|sabdžekt|2
skola|history|dejepis|histri|2
skola|science|prírodoveda|sajens|2
skola|language|reč, cudzí jazyk|langwidž|2
skola|exam|skúška|igzem|2
skola|sentence|veta|sentns|2
telo|toe|prst na nohe|tou|1
telo|clothes|oblečenie|klouz|1
telo|skirt|sukňa|skört|1
telo|cap|šiltovka|kep|1
telo|coat|kabát|kout|1
telo|shoulder|rameno, plece|šouldr|2
telo|elbow|lakeť|elbou|2
telo|tongue|jazyk|tang|2
telo|skin|koža|skin|2
telo|bone|kosť|boun|2
telo|brain|mozog|brejn|2
telo|stomach|žalúdok|stamak|2
telo|sweater|sveter|swetr|2
telo|pocket|vrecko|pokit|2
telo|pyjamas|pyžamo|pidžámaz|2
farby|beige|béžová|bejž|2
farby|turquoise|tyrkysová|törkvoiz|2
farby|colourful|farebný|kalrful|2
farby|bright|jasný|brajt|2
cisla|number|číslo|nambr|1
cisla|count|počítať|kaunt|1
cisla|plus|plus|plas|1
cisla|minus|mínus|majnas|1
cisla|thirteen|trinásť|törtín|2
cisla|fourteen|štrnásť|fórtín|2
cisla|sixteen|šestnásť|sikstín|2
cisla|forty|štyridsať|fórti|2
cisla|sixty|šesťdesiat|siksti|2
cisla|ninety|deväťdesiat|najnti|2
cisla|second|druhý|sekend|2
cisla|third|tretí|törd|2
cisla|last|posledný|lást|2
slovesa|stop|zastaviť|stop|1
slovesa|start|začať|stárt|1
slovesa|wait|čakať|wejt|1
slovesa|look|pozerať sa|luk|1
slovesa|find|nájsť|fajnd|1
slovesa|make|vyrobiť|mejk|1
slovesa|kick|kopnúť|kik|1
slovesa|hug|objať|hag|1
slovesa|smile|usmievať sa|smajl|1
slovesa|think|myslieť|think|1
slovesa|know|vedieť|nou|1
slovesa|learn|učiť sa|lörn|1
slovesa|ask|pýtať sa|ásk|1
slovesa|say|povedať|sej|1
slovesa|close|zatvoriť|klouz|1
slovesa|buy|kúpiť|baj|2
slovesa|sell|predať|sel|2
slovesa|carry|niesť|keri|2
slovesa|pull|ťahať|pul|2
slovesa|push|tlačiť|puš|2
slovesa|teach|učiť|tíč|2
slovesa|speak|hovoriť|spík|2
slovesa|call|volať|kól|2
slovesa|build|stavať|bild|2
slovesa|fall|padať|fól|2
slovesa|bring|priniesť|bring|2
slovesa|wear|nosiť na sebe|wér|2
slovesa|ride|jazdiť|rajd|2
slovesa|visit|navštíviť|vizit|2
priroda|nature|príroda|nejčr|1
priroda|plant|rastlina|plánt|1
priroda|rose|ruža|rouz|1
priroda|seed|semienko|síd|1
priroda|mud|blato|mad|1
priroda|field|pole|fíld|2
priroda|rock|skala|rok|2
priroda|cave|jaskyňa|kejv|2
priroda|waterfall|vodopád|wótrfól|2
priroda|pond|rybník|pond|2
priroda|path|chodník v prírode|páth|2
priroda|branch|konár|bránč|2
priroda|sunset|západ slnka|sanset|2
priroda|sunrise|východ slnka|sanrajz|2
ludia|people|ľudia|pípl|1
ludia|parents|rodičia|pérents|1
ludia|princess|princezná|prinses|1
ludia|prince|princ|prins|1
ludia|pirate|pirát|pajrit|1
ludia|witch|čarodejnica|wič|1
ludia|clown|klaun|klaun|1
ludia|son|syn|san|2
ludia|daughter|dcéra|dótr|2
ludia|grandparents|starí rodičia|grenpérents|2
ludia|twin|dvojča|twin|2
ludia|stranger|cudzinec|strejndžr|2
ludia|guest|hosť|gest|2
ludia|adult|dospelý|edalt|2
ludia|giant|obor|džajent|2
ludia|knight|rytier|najt|2
mesto|farm|farma|fárm|1
mesto|hotel|hotel|houtel|1
mesto|building|budova|bildink|2
mesto|village|dedina|vilidž|2
mesto|city|veľkomesto|siti|2
mesto|square|námestie|skvér|2
mesto|bakery|pekáreň|bejkri|2
mesto|museum|múzeum|mjuzíam|2
mesto|post office|pošta|poust ofis|2
mesto|bank|banka|benk|2
mesto|restaurant|reštaurácia|restront|2
mesto|supermarket|supermarket|súpermárkit|2
mesto|swimming pool|bazén|swiming púl|2
mesto|tower|veža|tauer|2
cas|now|teraz|nau|1
cas|late|neskoro|lejt|1
cas|holiday|prázdniny|holidej|1
cas|Christmas|Vianoce|krismas|1
cas|weather|počasie|wedr|1
cas|rainy|daždivý|rejni|1
cas|cloudy|oblačný|klaudi|1
cas|Monday|pondelok|mandej|2
cas|Tuesday|utorok|tjúzdej|2
cas|Wednesday|streda|wenzdej|2
cas|Thursday|štvrtok|törzdej|2
cas|Friday|piatok|frajdej|2
cas|Saturday|sobota|saterdej|2
cas|Sunday|nedeľa|sandej|2
cas|later|neskôr|lejtr|2
cas|soon|čoskoro|sún|2
cas|early|skoro|örli|2
cas|noon|poludnie|nún|2
cas|midnight|polnoc|midnajt|2
cas|windy|veterný|windi|2
cas|foggy|hmlistý|fogi|2
cas|thunder|hrom|thandr|2
cas|lightning|blesk|lajtnink|2
cas|calendar|kalendár|kelendr|2
pocity|sleepy|ospalý|slípi|1
pocity|strong|silný|strong|1
pocity|safe|bezpečný|sejf|1
pocity|hurt|ublížiť, bolieť|hört|1
pocity|worried|ustarostený|warid|2
pocity|lonely|osamelý|lounli|2
pocity|nervous|nervózny|nörvas|2
pocity|calm|pokojný|kám|2
pocity|jealous|žiarlivý|dželas|2
pocity|cheerful|veselý|čírful|2
pocity|lucky|šťastný, mať šťastie|laki|2
pocity|weak|slabý|wík|2
pocity|busy|zaneprázdnený|bizi|2
pocity|pain|bolesť|pejn|2
pocity|smart|múdry|smárt|2
pocity|curious|zvedavý|kjurias|2
sport|sport|šport|spórt|1
sport|player|hráč|plejr|1
sport|swimming|plávanie|swiming|1
sport|running|beh, behanie|raning|1
sport|hide|schovať sa|hajd|1
sport|volleyball|volejbal|volibol|2
sport|badminton|bedminton|bedminton|2
sport|hockey|hokej|hoki|2
sport|baseball|bejzbal|bejsból|2
sport|gymnastics|gymnastika|džimnestiks|2
sport|karate|karate|karáti|2
sport|yoga|joga|jouga|2
sport|cycling|bicyklovanie|sajklink|2
sport|hiking|turistika|hajkink|2
sport|fishing|rybolov|fišink|2
sport|camping|kempovanie|kempink|2
sport|coach|tréner|kouč|2
sport|medal|medaila|medl|2
sport|helmet|prilba|helmit|2
sport|chess|šach|čes|2
sport|seek|hľadať|sík|2
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
A cherry is red and small.|Čerešňa je červená a malá.|cherry|ovocie|1
I like corn with butter.|Mám rád kukuricu s maslom.|corn|ovocie|1
Mum puts an onion in the soup.|Mama dáva do polievky cibuľu.|onion|ovocie|2
The monkey likes the coconut.|Opica má rada kokos.|coconut|ovocie|2
A watermelon is big and green.|Vodový melón je veľký a zelený.|watermelon|ovocie|2
Fruit is good for me.|Ovocie je pre mňa zdravé.|fruit|ovocie|1
The squirrel has a nut.|Veverička má orech.|nut|ovocie|1
The peach is soft and sweet.|Broskyňa je mäkká a sladká.|peach|ovocie|2
A kiwi is brown outside and green inside.|Kiwi je zvonku hnedé a vnútri zelené.|kiwi|ovocie|1
The tractor works on the farm.|Traktor pracuje na farme.|tractor|doprava|1
The wheel is round.|Koleso je okrúhle.|wheel|doprava|1
I have a ticket for the tram.|Mám lístok na električku.|ticket|doprava|2
A truck can carry big boxes.|Nákladiak vie odviezť veľké škatule.|truck|doprava|1
The helicopter flies over the town.|Vrtuľník letí nad mestom.|helicopter|doprava|2
We go on a trip by train.|Ideme na výlet vlakom.|trip|doprava|1
The submarine is under the sea.|Ponorka je pod morom.|submarine|doprava|2
The nurse helps the doctor.|Zdravotná sestra pomáha lekárovi.|nurse|povolania|2
The pilot flies the airplane.|Pilot lieta lietadlom.|pilot|povolania|2
The firefighter has a red truck.|Hasič má červený nákladiak.|firefighter|povolania|1
My dad has a new job.|Môj otec má novú prácu.|job|povolania|1
The postman brings a letter.|Poštár nosí list.|postman|povolania|2
The singer sings a song.|Spevák spieva pieseň.|singer|povolania|1
My dentist is very kind.|Môj zubár je veľmi láskavý.|dentist|povolania|2
She is a student.|Je študentka.|student|povolania|1
I play the piano every day.|Každý deň hrám na klavíri.|piano|hudba|1
He plays the guitar.|Hrá na gitare.|guitar|hudba|1
We sing a song.|Spievame pieseň.|song|hudba|1
I like music.|Mám rád hudbu.|music|hudba|1
The drum is loud.|Bubon je hlasný.|drum|hudba|1
Let's go to the concert.|Poďme na koncert.|concert|hudba|2
She plays the violin.|Hrá na husliach.|violin|hudba|2
We watch a film.|Pozeráme film.|film|hudba|1
I take a photo of my cat.|Odfotím svoju mačku.|photo|hudba|1
The ant is very small.|Mravec je veľmi malý.|ant|divoke|1
The snail is slow.|Slimák je pomalý.|snail|divoke|1
The penguin cannot fly.|Tučniak nevie lietať.|penguin|divoke|1
The shark lives in the sea.|Žralok žije v mori.|shark|divoke|1
A crab walks to the side.|Krab chodí bokom.|crab|divoke|1
The zebra is black and white.|Zebra je čierno-biela.|zebra|divoke|1
The kangaroo can jump high.|Klokan vie vysoko skákať.|kangaroo|divoke|2
The camel lives in the desert.|Ťava žije v púšti.|camel|divoke|2
A ladybird is red with black dots.|Lienka je červená s čiernymi bodkami.|ladybird|divoke|1
The hedgehog sleeps in winter.|Jež spí v zime.|hedgehog|divoke|2
The crocodile lives in the river.|Krokodíl žije v rieke.|crocodile|divoke|2
I find a shell on the beach.|Nájdem mušľu na pláži.|shell|divoke|1
The astronaut flies to space.|Astronaut letí do vesmíru.|astronaut|vesmir|2
The Earth is a planet.|Zem je planéta.|planet|vesmir|1
The rocket goes up.|Raketa letí hore.|rocket|vesmir|1
We need air.|Potrebujeme vzduch.|air|vesmir|1
The robot can help me.|Robot mi vie pomôcť.|robot|vesmir|1
It is dark at night.|V noci je tma.|dark|vesmir|1
The ocean is very big.|Oceán je veľmi veľký.|ocean|vesmir|2
The storm is loud.|Búrka je hlasná.|storm|vesmir|2
Ice is cold.|Ľad je studený.|ice|vesmir|1
There is a volcano on the island.|Na ostrove je sopka.|volcano|vesmir|2
I drink milk from a cup.|Pijem mlieko zo šálky.|cup|veci|1
Put the plate on the table.|Polož tanier na stôl.|plate|veci|1
I eat soup with a spoon.|Polievku jem lyžicou.|spoon|veci|1
Take your umbrella, it is raining.|Vezmi si dáždnik, prší.|umbrella|veci|1
The gift is in the box.|Darček je v škatuli.|gift|veci|1
The balloon is red.|Balón je červený.|balloon|veci|1
Wash your hands with soap.|Umy si ruky mydlom.|soap|veci|1
My mum has a new watch.|Moja mama má nové hodinky.|watch|veci|2
I need money.|Potrebujem peniaze.|money|veci|1
The candle is on the cake.|Sviečka je na torte.|candle|veci|1
The bottle is empty.|Fľaša je prázdna.|bottle|veci|1
Dad uses a hammer.|Otec používa kladivo.|hammer|veci|2
A snail is very slow.|Slimák je veľmi pomalý.|slow|opacne|1
A rabbit is fast.|Zajac je rýchly.|fast|opacne|1
The giraffe is tall.|Žirafa je vysoká.|tall|opacne|1
My grandpa is old.|Môj dedko je starý.|old|opacne|1
A lemon is sour.|Citrón je kyslý.|sour|opacne|2
Wash your dirty hands.|Umy si špinavé ruky.|dirty|opacne|2
It is raining, my hair is wet.|Prší, moje vlasy sú mokré.|wet|opacne|2
My bag is heavy, it has many books.|Moja taška je ťažká, má veľa kníh.|heavy|opacne|2
The test is easy, I know all the answers.|Písomka je ľahká, poznám všetky odpovede.|easy|opacne|2
The rose is beautiful.|Ruža je krásna.|beautiful|opacne|2
The sun is high in the sky.|Slnko je vysoko na oblohe.|high|opacne|2
Hello, how are you?|Ahoj, ako sa máš?|hello|otazky|1
Thank you very much.|Ďakujem pekne.|thank you|otazky|1
What is your name?|Ako sa voláš?|name|otazky|1
Where is my bag?|Kde je moja taška?|where|otazky|1
Who is that boy?|Kto je ten chlapec?|who|otazky|1
Why are you sad?|Prečo si smutný?|why|otazky|2
Sorry, I am late.|Prepáč, meškám.|sorry|otazky|1
Goodbye, see you tomorrow.|Dovidenia, uvidíme sa zajtra.|goodbye|otazky|1
Please, help me.|Prosím, pomôž mi.|please|otazky|1
How old are you?|Koľko máš rokov?|how|otazky|1
When is your birthday?|Kedy máš narodeniny?|when|otazky|2
The cat sits between the dog and the bird.|Mačka sedí medzi psom a vtáčikom.|between|predlozky|2
It is raining, so we stay inside.|Prší, preto ostávame vnútri.|inside|predlozky|2
Mars is very far from the Earth.|Mars je veľmi ďaleko od Zeme.|far|predlozky|1
It is hot, so we play outside.|Je horúco, preto sa hráme vonku.|outside|predlozky|2
The Earth goes around the Sun.|Zem obieha okolo Slnka.|around|predlozky|2
The puppy is very small.|Šteňa je veľmi malé.|puppy|zvierata|1
The kitten drinks milk.|Mačiatko pije mlieko.|kitten|zvierata|1
The goose swims on the lake.|Hus pláva po jazere.|goose|zvierata|2
The hamster sleeps in the day.|Škrečok cez deň spí.|hamster|zvierata|1
The lamb is white.|Jahňa je biele.|lamb|zvierata|1
The eagle flies high in the sky.|Orol letí vysoko na oblohe.|eagle|zvierata|2
The swan is on the lake.|Labuť je na jazere.|swan|zvierata|2
We have breakfast in the morning.|Raňajkujeme ráno.|breakfast|jedlo|1
Dinner is ready!|Večera je hotová!|dinner|jedlo|1
I like chocolate.|Mám rád čokoládu.|chocolate|jedlo|1
We eat popcorn at the cinema.|V kine jeme popcorn.|popcorn|jedlo|1
The pancake is hot.|Palacinka je horúca.|pancake|jedlo|2
Do you want some fries?|Chceš hranolky?|fries|jedlo|2
I like pasta with cheese.|Mám rád cestoviny so syrom.|pasta|jedlo|2
The sweets are in the box.|Sladkosti sú v škatuli.|sweets|jedlo|1
I sleep in my bedroom.|Spím vo svojej spálni.|bedroom|domov|1
Milk is in the fridge.|Mlieko je v chladničke.|fridge|domov|1
Mum puts a pillow on the bed.|Mama dáva vankúš na posteľ.|pillow|domov|1
I wash in the shower.|Umývam sa v sprche.|shower|domov|2
The gate is open.|Brána je otvorená.|gate|domov|2
The books are on the shelf.|Knihy sú na polici.|shelf|domov|2
The curtain is blue.|Záves je modrý.|curtain|domov|2
I have a rubber in my bag.|Mám v taške gumu.|rubber|skola|1
Draw with a crayon.|Kresli pastelkou.|crayon|skola|1
We play at the break.|O prestávke sa hráme.|break|skola|1
I love maths.|Milujem matematiku.|maths|skola|1
Open your dictionary.|Otvor si slovník.|dictionary|skola|2
Write a sentence.|Napíš vetu.|sentence|skola|2
She has a long skirt.|Má dlhú sukňu.|skirt|telo|1
Put on your coat, it is cold.|Obleč si kabát, je zima.|coat|telo|1
I wear a cap in summer.|V lete nosím šiltovku.|cap|telo|1
Stick out your tongue.|Vyplazi jazyk.|tongue|telo|2
Your brain helps you think.|Mozog ti pomáha myslieť.|brain|telo|2
A bone is hard.|Kosť je tvrdá.|bone|telo|2
He has a pocket in his jacket.|Má vrecko v bunde.|pocket|telo|2
I wear pyjamas at night.|V noci mám pyžamo.|pyjamas|telo|2
A bag hangs on my shoulder.|Taška mi visí na pleci.|shoulder|telo|2
The beige sofa is soft.|Béžová pohovka je mäkká.|beige|farby|2
Look at the colourful kite!|Pozri na farebného šarkana!|colourful|farby|2
The sea is turquoise.|More je tyrkysové.|turquoise|farby|2
I am thirteen years old.|Mám trinásť rokov.|thirteen|cisla|2
Two plus two is four.|Dva plus dva sú štyri.|plus|cisla|1
Count to ten, please.|Počítaj do desať, prosím.|count|cisla|1
He is the second in the race.|Je druhý v pretekoch.|second|cisla|2
Ninety is a big number.|Deväťdesiat je veľké číslo.|ninety|cisla|2
Stop! The light is red.|Stoj! Svieti červená.|stop|slovesa|1
Wait for me, please.|Počkaj na mňa, prosím.|wait|slovesa|1
Look at the bird!|Pozri sa na vtáka!|look|slovesa|1
I hug my mum.|Objímem mamu.|hug|slovesa|1
Smile, please!|Usmej sa, prosím!|smile|slovesa|1
I learn new words every day.|Každý deň sa učím nové slová.|learn|slovesa|1
Push the door.|Zatlač dvere.|push|slovesa|2
We build a castle.|Staviame hrad.|build|slovesa|2
Please close the window.|Zavri, prosím, okno.|close|slovesa|1
I want to buy a book.|Chcem si kúpiť knihu.|buy|slovesa|2
Can you ask the teacher?|Môžeš sa opýtať učiteľky?|ask|slovesa|1
A rose is a beautiful flower.|Ruža je krásny kvet.|rose|priroda|1
A tree grows from a small seed.|Zo semienka vyrastie strom.|seed|priroda|1
The duck swims in the pond.|Kačka pláva v rybníku.|pond|priroda|2
The waterfall is loud.|Vodopád je hlasný.|waterfall|priroda|2
We walk on the path.|Kráčame po chodníku.|path|priroda|2
I play in the mud.|Hrám sa v blate.|mud|priroda|1
Look at the sunset!|Pozri sa na západ slnka!|sunset|priroda|2
The bear lives in a cave.|Medveď žije v jaskyni.|cave|priroda|2
The prince has a white horse.|Princ má bieleho koňa.|prince|ludia|1
The princess lives in a castle.|Princezná býva v hrade.|princess|ludia|1
The pirate has a boat.|Pirát má čln.|pirate|ludia|1
The clown is funny.|Klaun je vtipný.|clown|ludia|1
My parents are at home.|Moji rodičia sú doma.|parents|ludia|1
The giant is very tall.|Obor je veľmi vysoký.|giant|ludia|2
Her daughter is five.|Jej dcéra má päť rokov.|daughter|ludia|2
The witch has a black cat.|Čarodejnica má čiernu mačku.|witch|ludia|1
The museum is big and old.|Múzeum je veľké a staré.|museum|mesto|2
We buy bread at the bakery.|Chlieb kupujeme v pekárni.|bakery|mesto|2
Mum is at the post office.|Mama je na pošte.|post office|mesto|2
My cousin lives in a village.|Môj bratranec býva v dedine.|village|mesto|2
The farm has a cow.|Na farme je krava.|farm|mesto|1
We swim in the swimming pool.|Plávame v bazéne.|swimming pool|mesto|2
The hotel is near the beach.|Hotel je blízko pláže.|hotel|mesto|1
The tower is very tall.|Veža je veľmi vysoká.|tower|mesto|2
Today is Monday.|Dnes je pondelok.|Monday|cas|2
Saturday is my favourite day.|Sobota je môj obľúbený deň.|Saturday|cas|2
Christmas is in winter.|Vianoce sú v zime.|Christmas|cas|1
It is a rainy day.|Je daždivý deň.|rainy|cas|1
See you later!|Uvidíme sa neskôr!|later|cas|2
It is cloudy today.|Dnes je oblačno.|cloudy|cas|1
I get up early.|Vstávam skoro.|early|cas|2
The holiday is long.|Prázdniny sú dlhé.|holiday|cas|1
Thunder is loud.|Hrom je hlasný.|thunder|cas|2
Do you know the weather today?|Vieš, aké je dnes počasie?|weather|cas|1
I am sleepy.|Som ospalý.|sleepy|pocity|1
The dog is strong.|Pes je silný.|strong|pocity|1
Do not worry, you are safe.|Neboj sa, si v bezpečí.|safe|pocity|1
She is very smart.|Je veľmi múdra.|smart|pocity|2
I am lonely without my friend.|Som osamelý bez kamaráta.|lonely|pocity|2
I have pain in my leg.|Bolí ma noha.|pain|pocity|2
I am nervous before the test.|Som nervózny pred písomkou.|nervous|pocity|2
Be calm and listen.|Buď pokojný a počúvaj.|calm|pocity|2
I play volleyball at school.|V škole hrám volejbal.|volleyball|sport|2
My brother plays hockey.|Môj brat hrá hokej.|hockey|sport|2
The player runs fast.|Hráč beží rýchlo.|player|sport|1
She won a gold medal.|Vyhrala zlatú medailu.|medal|sport|2
The coach is kind.|Tréner je láskavý.|coach|sport|2
I wear a helmet on my bike.|Na bicykli nosím prilbu.|helmet|sport|2
I like swimming.|Rád plávam.|swimming|sport|1
We go fishing.|Ideme na ryby.|fishing|sport|2
Dad plays chess with me.|Otec hrá so mnou šach.|chess|sport|2
Let's play hide and seek.|Poďme sa hrať na schovávačku.|hide|sport|1
`.trim().split('\n').map(r => { const [en, sk, v, g, u] = r.split('|'); return { en, sk, v, g, u: +u }; });

/* ===== Nové anglické lekcie (4.6) =====
   Lekcie majú rovnakú štruktúru ako v temy.js (k: 'anglictina'), len ležia tu, aby sa pri rozšírení angličtiny
   nemenili súbory iných tém. Obrázky k nim (ART) sú vlastné vyfarbené kresby v anglictina.js, id začínajú na „en-“. */
{
  const ok = (q, spravne, zle, w, o = {}) => ({ q, a: [['🇬🇧', spravne], ...zle.map(x => ['🇬🇧', x])], w, ...o });
  const sk = (q, spravne, zle, w, o = {}) => ({ q, a: [['🇸🇰', spravne], ...zle.map(x => ['🇸🇰', x])], w, ...o });
  const sil = (q, spravne, zle, w) => ({ v: 's', q, a: [['', spravne], ...zle.map(x => ['', x])], w });
  T.push(
    { id: 'en-ovocie', k: 'anglictina', vek: 'mladsi', t: 'Ovocie a zelenina po anglicky', s: '',
      m: 'Ovocie sa po anglicky povie fruit, čítaj frút, a zelenina vegetable, čítaj vedžtabl. Čerešňa je cherry, čítaj čeri, a kukurica corn, čítaj kórn. Orech je nut, čítaj nat, a kiwi sa hovorí skoro rovnako, kíwí. Keď ideš s mamou na trh, môžeš každé ovocie pomenovať po anglicky.',
      p: 'Pri nákupe ovocia ukazujte prstom a hovorte: cherry, kiwi, corn. Doma si urobte ovocný tanier a hádajte slová.',
      o: ['Aké ovocie máš rád? Vieš ho povedať po anglicky?', 'Ktorá zelenina ti chutí najviac?', 'Čo je zdravšie: fruit alebo sweets?'],
      z: [ok('Ako sa po anglicky povie čerešňa?', 'cherry', ['corn', 'nut'], 'Čítaj čeri.'), sk('Čo znamená corn?', 'Kukurica', ['Orech', 'Čerešňa'], 'Čítaj kórn.'), ok('Ako sa po anglicky povie orech?', 'nut', ['kiwi', 'fruit'], 'Čítaj nat.')], r: ['jedlo', 'zdrave'] },
    { id: 'en-telo', k: 'anglictina', vek: 'mladsi', t: 'Moje telo po anglicky', s: '',
      m: 'Hlava je head, čítaj hed, a oko eye, čítaj aj. Nos je nose, čítaj nouz, ústa mouth, čítaj maus, a ucho ear, čítaj ír. Ruka je hand, čítaj hend, a noha foot, čítaj fut. Prst na nohe je toe, čítaj tou. Pri umývaní môžeš pomenovať každú časť tela.',
      p: 'Zahrajte sa Simon says: rodič povie Touch your nose a dieťa sa dotkne nosa. Potom si úlohy vymeňte.',
      o: ['Ukáž a povedz po anglicky, kde máš oko.', 'Koľko máš prstov na rukách? Povedz to po anglicky.', 'Ktorá časť tela sa ti zdá najzábavnejšia?'],
      z: [ok('Ako sa po anglicky povie nos?', 'nose', ['ear', 'eye'], 'Čítaj nouz.'), sk('Čo znamená hand?', 'Ruka', ['Noha', 'Hlava'], 'Čítaj hend.'), ok('Ako sa po anglicky povie ucho?', 'ear', ['eye', 'toe'], 'Čítaj ír.')], r: ['oblecenie', 'family'] },
    { id: 'en-skola', k: 'anglictina', vek: 'mladsi', t: 'V škole po anglicky', s: '',
      m: 'Škola je school, čítaj skúl. Kniha je book, čítaj buk, a pero pen. Ceruzka je pencil, čítaj pensl, a guma rubber, čítaj rabr. Pastelka je crayon, čítaj krejon. Prestávka je break, čítaj brejk, a zvonček bell, čítaj bel.',
      p: 'Pri príprave tašky pomenujte každú vec po anglicky. Kto zabudne slovo, pozrie si ho v zošite.',
      o: ['Čo máš v taške? Povedz to po anglicky.', 'Aký je tvoj obľúbený predmet?', 'Čo robíš na prestávke?'],
      z: [ok('Ako sa po anglicky povie guma?', 'rubber', ['crayon', 'bell'], 'Čítaj rabr.'), sk('Čo znamená break?', 'Prestávka', ['Zvonček', 'Škola'], 'Čítaj brejk.'), ok('Ako sa po anglicky povie pastelka?', 'crayon', ['pencil', 'book'], 'Čítaj krejon.')], r: ['vdome', 'farby'] },
    { id: 'en-pocasie', k: 'anglictina', vek: 'mladsi', t: 'Aké je počasie po anglicky', s: '',
      m: 'Počasie je weather, čítaj wedr. Keď svieti slnko, je sunny, čítaj sani, a keď sú oblaky, je cloudy, čítaj klaudi. Keď prší, je rainy, čítaj rejni, a keď fúka, je windy, čítaj windi. Keď sa niekto spýta How is the weather, čítaj hau iz de wedr, odpovieš napríklad It is sunny.',
      p: 'Ráno sa pozrite z okna a povedzte: It is sunny. It is rainy. Počasie môžete každý deň zapísať.',
      o: ['Aké je dnes počasie? Povedz to po anglicky.', 'Aké počasie máš najradšej?', 'Čo si oblečieš, keď je rainy?'],
      z: [ok('Ako sa po anglicky povie daždivý?', 'rainy', ['sunny', 'cloudy'], 'Čítaj rejni.'), sk('Čo znamená cloudy?', 'Oblačný', ['Daždivý', 'Veterný'], 'Čítaj klaudi.'), ok('Ako sa po anglicky povie počasie?', 'weather', ['winter', 'water'], 'Čítaj wedr.')], r: ['pocasie', 'dnitydna'] },
    { id: 'en-doprava', k: 'anglictina', vek: 'mladsi', t: 'Dopravné prostriedky po anglicky', s: '',
      m: 'Auto je car, čítaj kár, a autobus bus, čítaj bas. Vlak je train, čítaj trejn, a bicykel bike, čítaj bajk. Nákladné auto je truck, čítaj trak, a traktor sa povie tractor, čítaj traktr. Koleso je wheel, čítaj wíl. Na výlet povieš We go on a trip.',
      p: 'Na ceste sa hrajte: kto uvidí auto, povie car, kto uvidí bus, povie bus. Vyhráva ten, kto povie viac slov.',
      o: ['Čím cestuješ do školy? Povedz to po anglicky.', 'Čím by si sa chcel povoziť?', 'Koľko kolies má bike?'],
      z: [ok('Ako sa po anglicky povie nákladné auto?', 'truck', ['train', 'bus'], 'Čítaj trak.'), sk('Čo znamená wheel?', 'Koleso', ['Vlak', 'Výlet'], 'Čítaj wíl.'), ok('Ako sa po anglicky povie výlet?', 'trip', ['car', 'tractor'], 'Čítaj trip.')], r: ['cestujeme', 'vlak'] },
    { id: 'en-pocity', k: 'anglictina', vek: 'mladsi', t: 'Ako sa cítim po anglicky', s: '',
      m: 'Keď sa niekto spýta How are you, čítaj hau ár jú, môžeš odpovedať I am happy, čítaj aj em hepi, teda som šťastný. Smutný je sad, čítaj sed, a nahnevaný angry, čítaj engri. Unavený je tired, čítaj tajerd, a ospalý sleepy, čítaj slípi. Keď sa niečoho bojíš, si scared, čítaj skérd.',
      p: 'Večer sa spýtajte jeden druhého How are you? a odpovedzte jedným anglickým slovom. Vymyslite aj, prečo sa tak cítite.',
      o: ['Ako sa dnes cítiš? Povedz to po anglicky.', 'Kedy si šťastný?', 'Čo ti pomôže, keď si sleepy?'],
      z: [ok('Ako sa po anglicky povie smutný?', 'sad', ['happy', 'angry'], 'Čítaj sed.'), sk('Čo znamená sleepy?', 'Ospalý', ['Smutný', 'Nahnevaný'], 'Čítaj slípi.'), ok('Ako sa po anglicky povie šťastný?', 'happy', ['tired', 'scared'], 'Čítaj hepi.')], r: ['radost', 'family'] },
    { id: 'en-cinnosti', k: 'anglictina', vek: 'mladsi', t: 'Čo robím po anglicky', s: '',
      m: 'Behať je run, čítaj ran, a skákať jump, čítaj džamp. Pozerať sa je look, čítaj luk, a čakať wait, čítaj wejt. Objať je hug, čítaj hag, a usmiať sa smile, čítaj smajl. Keď chceš niekoho zastaviť, povieš Stop. Zdvorilé slovo je please, čítaj plíz.',
      p: 'Zahrajte sa na rozkazy: rodič povie Jump! alebo Run! a dieťa to predvedie. Ak povie Stop, všetci zamrznú.',
      o: ['Čo vieš robiť rýchlo? Povedz to po anglicky.', 'Koho si dnes objal?', 'Prečo je dobré povedať please?'],
      z: [ok('Ako sa po anglicky povie skákať?', 'jump', ['run', 'wait'], 'Čítaj džamp.'), sk('Čo znamená hug?', 'Objať', ['Usmiať sa', 'Čakať'], 'Čítaj hag.'), ok('Ako sa po anglicky povie čakať?', 'wait', ['look', 'smile'], 'Čítaj wejt.')], r: ['vdome', 'oblecenie'] },
    { id: 'en-priroda', k: 'anglictina', vek: 'mladsi', t: 'V prírode po anglicky', s: '',
      m: 'Príroda je nature, čítaj nejčr. Strom je tree, čítaj trí, a kvetina flower, čítaj flauer. Ruža je rose, čítaj rouz, a semienko seed, čítaj síd. Rieka je river, čítaj river, a hora mountain, čítaj mauntin. Keď niečo uvidíš, povieš I see a tree.',
      p: 'Na prechádzke ukazujte na veci okolo a hovorte po anglicky: tree, flower, river. Doma ich nakreslite.',
      o: ['Čo si videl pri poslednej prechádzke? Povedz to po anglicky.', 'Aká je tvoja obľúbená kvetina?', 'Čo vyrastie zo seed?'],
      z: [ok('Ako sa po anglicky povie semienko?', 'seed', ['rose', 'tree'], 'Čítaj síd.'), sk('Čo znamená river?', 'Rieka', ['Hora', 'Kvetina'], 'Čítaj river.'), ok('Ako sa po anglicky povie ruža?', 'rose', ['flower', 'river'], 'Čítaj rouz.')], r: ['les', 'pocasie'] },
    { id: 'en-povolania', k: 'anglictina', t: 'Povolania po anglicky', s: '',
      m: 'Lekár je doctor, čítaj doktr, a hasič firefighter, čítaj fajrfajtr. Policajt je policeman, čítaj polísmen, a spevák singer, čítaj singr. Žiak je pupil, čítaj pjúpl, a práca job, čítaj džob. Keď sa niekto spýta What do you want to be, čítaj wot dú jú wont tú bí, odpovieš I want to be a doctor.',
      p: 'Spýtajte sa jeden druhého, čím chcete byť, a odpovedzte celou vetou: I want to be a pilot.',
      o: ['Čím chceš byť, keď vyrastieš? Povedz to po anglicky.', 'Čo robí firefighter?', 'Aké povolanie majú rodičia?'],
      z: [ok('Ako sa po anglicky povie hasič?', 'firefighter', ['singer', 'pupil'], 'Čítaj fajrfajtr.', { h: ['fireman', 'fighter', 'farmer'] }), sk('Čo znamená job?', 'Práca', ['Žiak', 'Lekár'], 'Čítaj džob.', { h: ['Cesta', 'Hra', 'Dovolenka'] }), ok('Ako sa po anglicky povie spevák?', 'singer', ['doctor', 'job'], 'Čítaj singr.', { h: ['signer', 'sinker', 'swimmer'] }),
        sil('Čo znamená I want to be a pilot?', 'Chcem byť pilot', ['Mám pilota', 'Pilot chce lietať', 'Som pilot'], 'Want znamená chcieť.'), sil('Ako sa po anglicky povie zdravotná sestra?', 'nurse', ['nose', 'nut', 'nest'], 'Čítaj nörs.')], r: ['family', 'restauracia'] },
    { id: 'en-cas', k: 'anglictina', t: 'Čas a dni po anglicky', s: '',
      m: 'Teraz je now, čítaj nau, a neskôr later, čítaj lejtr. Pondelok je Monday, čítaj mandej, a sobota Saturday, čítaj saterdej. Nedeľa je Sunday, čítaj sandej. Ráno je morning, večer evening a polnoc midnight, čítaj midnajt. Prázdniny sú holiday, čítaj holidej.',
      p: 'Pri kalendári pomenujte dni po anglicky. Každý deň zopakujte, aký deň je dnes: Today is Monday.',
      o: ['Aký deň je dnes? Povedz to po anglicky.', 'Ktorý deň v týždni máš najradšej?', 'Čo robíš v Sunday?'],
      z: [ok('Ako sa po anglicky povie pondelok?', 'Monday', ['Sunday', 'Saturday'], 'Čítaj mandej.', { h: ['Tuesday', 'Friday', 'Thursday'] }), sk('Čo znamená later?', 'Neskôr', ['Teraz', 'Ráno'], 'Čítaj lejtr.', { h: ['Skoro', 'Včera', 'Dnes'] }), ok('Ako sa po anglicky povie teraz?', 'now', ['no', 'new'], 'Čítaj nau.', { h: ['know', 'noon', 'night'] }),
        sil('Čo znamená Today is Saturday?', 'Dnes je sobota', ['Zajtra je sobota', 'Včera bola sobota', 'Dnes je nedeľa'], 'Today je dnes.'), sil('Ktoré slovo znamená polnoc?', 'midnight', ['noon', 'morning', 'evening'], 'Noon je poludnie.')], r: ['dnitydna', 'hodiny'] },
    { id: 'en-otazky', k: 'anglictina', vek: 'starsi', t: 'Otázky a slušné slová po anglicky', s: '',
      m: 'Pozdravíš slovom hello, čítaj helou, a rozlúčiš sa goodbye, čítaj gudbaj. Poprosíš slovom please a poďakuješ thank you, čítaj thenk jú. Keď sa chceš opýtať, použi what, čítaj wot, teda čo, where, čítaj wér, teda kde, a who, čítaj hú, teda kto. Na meno sa spýtaš What is your name, čítaj wot iz jór nejm, a na vek How old are you, čítaj hau ould ár jú.',
      p: 'Počas obeda si hrajte na rozhovor: jeden sa pýta What is your name? Where do you live? a druhý odpovedá celou vetou.',
      o: ['Ako sa po anglicky spýtaš na meno?', 'Kedy povieš sorry?', 'Prečo je dobré hovoriť please a thank you?'],
      z: [ok('Ako sa po anglicky povie kde?', 'where', ['what', 'who'], 'Čítaj wér.', { h: ['were', 'there', 'wear'] }), sk('Čo znamená How old are you?', 'Koľko máš rokov?', ['Ako sa voláš?', 'Kde bývaš?'], 'Old znamená starý.', { h: ['Ako sa máš?', 'Kto si?', 'Čo robíš?'] }), ok('Ako sa po anglicky povie ďakujem?', 'thank you', ['please', 'sorry'], 'Čítaj thenk jú.', { h: ['thanks me', 'think you', 'thin you'] }),
        sil('Čo znamená What is your name?', 'Ako sa voláš?', ['Kde je tvoje meno?', 'Kto je tvoj priateľ?', 'Čo robíš?'], 'Name je meno.'), sil('Ktoré slovo použiješ, keď sa chceš ospravedlniť?', 'sorry', ['please', 'hello', 'great'], 'Čítaj sori.')], r: ['pozdravy', 'osebe'] },
    { id: 'en-predlozky', k: 'anglictina', vek: 'starsi', t: 'Kde to je? Predložky po anglicky', s: '',
      m: 'Predložky nám povedia, kde niečo je. Slovko in je v, on je na a under je pod, čítaj andr. Behind je za, čítaj bihajnd, a between medzi, čítaj bitwín. Near je blízko, čítaj nír, a far ďaleko, čítaj fár. Veta The ball is under the table, čítaj de ból iz andr de tejbl, znamená Lopta je pod stolom.',
      p: 'Schovajte malú hračku a dávajte nápovedy po anglicky: It is under the chair. It is behind the door. Kto nájde hračku, schová ju znova.',
      o: ['Kde je tvoj domov? Je near alebo far od školy?', 'Čo je na tvojom stole a čo pod ním?', 'Čo sa nachádza between dvoma vecami vo vašej izbe?'],
      z: [ok('Ako sa po anglicky povie pod?', 'under', ['on', 'in'], 'Čítaj andr.', { h: ['over', 'upper', 'ender'] }), sk('Čo znamená behind?', 'Za', ['Pred', 'Medzi'], 'Čítaj bihajnd.', { h: ['Vedľa', 'Nad', 'Okolo'] }), ok('Ako sa po anglicky povie ďaleko?', 'far', ['near', 'here'], 'Čítaj fár.', { h: ['fair', 'fur', 'fat'] }),
        sil('Čo znamená The cat is between the dog and the bird?', 'Mačka je medzi psom a vtákom', ['Mačka je za psom a vtákom', 'Mačka je pod psom a vtákom', 'Mačka je pred psom'], 'Between je medzi.'), sil('Ktoré slovo znamená vedľa?', 'next to', ['behind', 'under', 'inside'], 'Čítaj nekst tú.')], r: ['vdome', 'cesta'] },
    { id: 'en-hudba', k: 'anglictina', vek: 'starsi', t: 'Hudba a záľuby po anglicky', s: '',
      m: 'Hudba je music, čítaj mjúzik, a pieseň song, čítaj song. Gitara je guitar, čítaj gitár, a klavír piano, čítaj piano. Husle sú violin, čítaj vajolin, a bubon drum, čítaj dram. Záľuba je hobby, čítaj hobi. Keď sa spýtaš What is your hobby, čítaj wot iz jór hobi, odpovedá napríklad I play the piano alebo I like chess.',
      p: 'Pustite si pesničku a povedzte po anglicky, čo počujete: guitar, drum, piano. Potom sa spýtajte, aká je tvoja hobby.',
      o: ['Aká je tvoja hobby? Povedz to po anglicky.', 'Na aký nástroj by si chcel hrať?', 'Aká je tvoja obľúbená song?'],
      z: [ok('Ako sa po anglicky povie bubon?', 'drum', ['piano', 'guitar'], 'Čítaj dram.', { h: ['drug', 'dream', 'dump'] }), sk('Čo znamená violin?', 'Husle', ['Gitara', 'Flauta'], 'Čítaj vajolin.', { h: ['Klavír', 'Trúbka', 'Bubon'] }), ok('Ako sa po anglicky povie záľuba?', 'hobby', ['music', 'song'], 'Čítaj hobi.', { h: ['hobbit', 'hobo', 'hobble'] }),
        sil('Čo znamená I play the piano?', 'Hrám na klavíri', ['Počúvam klavír', 'Mám klavír doma', 'Kupujem klavír'], 'Play znamená hrať.'), sil('Ktoré slovo znamená pieseň?', 'song', ['sing', 'sound', 'soon'], 'Čítaj song.')], r: ['pozdravy', 'family'] },
  );
}

/* Obrázky k novým lekciám: vlastné vyfarbené kresby z jednoduchých tvarov (obrys dodá spoločná skupina v svg()). */
Object.assign(ART, (() => {
  const at = (x, y, s, v) => `<g transform="translate(${x} ${y}) scale(${s})">${v}</g>`;
  const trava = (y = 134, c = '#8EE07A') => `<rect y="${y}" width="320" height="${180 - y}" fill="${c}"/><path d="M0 ${y} H320"/>`;
  /* ovocie a zelenina, stred v (0, 0), veľkosť asi 50 */
  const jablko = (x, y, s = 1) => at(x, y, s, '<path d="M0 -10 C-8 -18 -24 -12 -22 4 C-20 18 -8 24 0 20 C8 24 20 18 22 4 C24 -12 8 -18 0 -10Z" fill="#FF5A5F"/><path d="M0 -10 Q1 -18 7 -22" fill="none" stroke-width="3"/><ellipse cx="11" cy="-17" rx="8" ry="4" fill="#4CD07D" transform="rotate(-25 11 -17)"/><path d="M-12 -2 Q-14 4 -10 9" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>');
  const banan = (x, y, s = 1) => at(x, y, s, '<path d="M-26 -10 C-18 18 12 20 28 -14 L21 -17 C10 4 -14 4 -22 -16Z" fill="#FFD23F"/><path d="M-26 -10 L-24 -17 L-20 -16" fill="#8B5A2B"/><path d="M28 -14 L24 -22 L20 -17Z" fill="#8B5A2B"/>');
  const mrkva = (x, y, s = 1) => at(x, y, s, '<path d="M-9 -14 Q0 -20 9 -14 L1 26 Q0 28 -1 26Z" fill="#FF9F1C"/><path d="M-5 -6 H3 M-3 4 H4 M-1 14 H3" stroke-width="2"/><path d="M-3 -16 Q-12 -28 -8 -34 Q-2 -28 0 -18 Q2 -30 8 -34 Q12 -26 3 -16Z" fill="#4CD07D"/>');
  const jahoda = (x, y, s = 1) => at(x, y, s, '<path d="M0 22 C-20 8 -20 -8 -12 -13 C-6 -17 6 -17 12 -13 C20 -8 20 8 0 22Z" fill="#FF3B5C"/><path d="M-9 -14 L-4 -22 L0 -15 L4 -22 L9 -14 L0 -9Z" fill="#4CD07D"/><g fill="#FFE27A" stroke="none"><circle cx="-7" cy="-2" r="1.8"/><circle cx="5" cy="-4" r="1.8"/><circle cx="-2" cy="6" r="1.8"/><circle cx="8" cy="7" r="1.8"/><circle cx="-8" cy="10" r="1.8"/></g>');
  const hrozno = (x, y, s = 1) => at(x, y, s, `<path d="M0 -22 Q4 -30 10 -30" fill="none" stroke-width="3"/><ellipse cx="9" cy="-28" rx="8" ry="4" fill="#4CD07D" transform="rotate(-15 9 -28)"/>${[[-10, -12], [2, -14], [12, -10], [-14, 0], [-2, -2], [10, 2], [-8, 12], [4, 12], [-1, 22]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="8" fill="#8E5BD6"/>`).join('')}<circle cx="-12" cy="-14" r="2" fill="#fff" stroke="none" opacity=".7"/>`);
  const kukurica = (x, y, s = 1) => at(x, y, s, `<path d="M-10 -22 Q0 -30 10 -22 L12 12 Q0 22 -12 12Z" fill="#FFD23F"/>${[-6, 0, 6].map(a => `<path d="M${a} -22 V14" stroke="#E5A800" stroke-width="1.5"/>`).join('')}<path d="M-12 12 Q-24 -6 -10 -26 Q-12 -4 0 10Z M12 12 Q24 -6 10 -26 Q12 -4 0 10Z" fill="#4CD07D"/>`);
  const cerešňa = (x, y, s = 1) => at(x, y, s, '<path d="M-10 6 Q-6 -16 6 -24 M10 8 Q8 -14 6 -24" fill="none" stroke-width="3"/><circle cx="-10" cy="10" r="10" fill="#D81E5B"/><circle cx="11" cy="12" r="10" fill="#D81E5B"/><ellipse cx="14" cy="-24" rx="9" ry="4" fill="#4CD07D"/>');
  const citron = (x, y, s = 1) => at(x, y, s, '<path d="M-24 0 Q-24 -16 0 -16 Q24 -16 24 0 Q24 16 0 16 Q-24 16 -24 0Z" fill="#FFE94D"/><path d="M-26 0 L-32 0 M26 0 L32 0" stroke-width="4"/><path d="M-12 -8 Q-8 -12 0 -12" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>');
  /* tvár pre pocity: farba, oči, ústa */
  const tvar = (x, y, c, oci, usta, extra = '') => `<g transform="translate(${x} ${y})"><circle r="32" fill="${c}"/>${oci}${usta}${extra}</g>`;
  const hodiny = (x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r + 7}" fill="#FF5A5F"/><circle r="${r}" fill="#fff"/>${[...Array(12).keys()].map(i => `<path d="M0 ${-r + 5} V${-r + (i % 3 === 0 ? 14 : 10)}" transform="rotate(${i * 30})" stroke-width="${i % 3 === 0 ? 4 : 2.5}"/>`).join('')}<path d="M0 0 V${-r + 24}" transform="rotate(-60)" stroke-width="6"/><g class="spin"><path d="M0 0 V${-r + 12}" stroke="#2F7FE0" stroke-width="4"/></g><circle r="5" fill="${INK}"/></g>`;
  const lopta = (x, y, r = 11) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#FF8A3D"/><path d="M${-r} 0 H${r} M0 ${-r} V${r}" stroke-width="2"/></g>`;
  return {
    'en-ovocie': () => `${bg('#FFF1DC')}<rect y="118" width="320" height="62" fill="#C98A4B"/><path d="M0 118 H320 M0 146 H320" stroke-width="3"/>${sun(282, 30, 14)}
      ${jablko(48, 100, 1.05)}${banan(106, 100, 1)}${mrkva(160, 94, 1)}${jahoda(210, 102, 1.05)}${hrozno(268, 94, .95)}
      ${cerešňa(70, 156, .75)}${kukurica(134, 160, .7)}${citron(210, 160, .75)}${jablko(280, 160, .6)}`,
    'en-telo': () => `${bg('#E9F7FF')}<g transform="translate(160 98)">
      <circle cx="-62" cy="4" r="14" fill="#FFD2B0"/><circle cx="62" cy="4" r="14" fill="#FFD2B0"/><circle cx="-62" cy="4" r="6" fill="#FFB38A" stroke="none"/><circle cx="62" cy="4" r="6" fill="#FFB38A" stroke="none"/>
      <circle r="60" fill="#FFD2B0"/><path d="M-60 -8 C-62 -66 62 -66 60 -8 C44 -36 -44 -36 -60 -8Z" fill="#8B5A2B"/>
      <ellipse cx="-24" cy="-4" rx="13" ry="15" fill="#fff"/><ellipse cx="24" cy="-4" rx="13" ry="15" fill="#fff"/>
      <g class="blink"><circle cx="-22" cy="-2" r="7" fill="#3D8BFF"/><circle cx="26" cy="-2" r="7" fill="#3D8BFF"/><circle cx="-22" cy="-2" r="3.2" fill="${INK}" stroke="none"/><circle cx="26" cy="-2" r="3.2" fill="${INK}" stroke="none"/></g>
      <path d="M-36 -24 Q-24 -32 -12 -24 M12 -24 Q24 -32 36 -24" fill="none" stroke-width="4"/>
      <path d="M0 4 Q-8 20 0 22 Q8 20 0 4Z" fill="#FFB38A"/><path d="M-22 38 Q0 58 22 38 Q0 46 -22 38Z" fill="#FF5A5F"/><circle cx="-40" cy="24" r="8" fill="#FF8FB1" opacity=".7" stroke="none"/><circle cx="40" cy="24" r="8" fill="#FF8FB1" opacity=".7" stroke="none"/></g>
      <g transform="translate(274 120)"><g class="bob"><rect x="-17" y="-10" width="34" height="34" rx="14" fill="#FFD2B0"/>${[[-17, -12, -16], [-8, -20, -6], [3, -22, 4], [13, -18, 14]].map(([a, b, r]) => `<rect x="${a}" y="${b}" width="8" height="20" rx="4" fill="#FFD2B0" transform="rotate(${r} ${a + 4} ${b + 18})"/>`).join('')}<rect x="-26" y="2" width="9" height="20" rx="4.5" fill="#FFD2B0" transform="rotate(35 -21 12)"/></g></g>`,
    'en-skola': () => `${bg('#FFF4DE')}<rect x="40" y="12" width="240" height="84" rx="6" fill="#B5651D"/><rect x="48" y="20" width="224" height="68" rx="3" fill="#2F6B4F"/><text x="160" y="68" font-size="40" ${TXT} fill="#fff">A B C</text>
      <rect y="128" width="320" height="52" fill="#E8B67A"/><path d="M0 128 H320"/>
      <g transform="translate(70 124)"><g class="bob"><rect x="-34" y="-26" width="68" height="30" rx="4" fill="#FF5A5F"/><rect x="-28" y="-20" width="56" height="20" rx="2" fill="#fff"/><path d="M-20 -14 H20 M-20 -8 H12" stroke-width="2"/></g></g>
      <g transform="translate(160 150) rotate(-12)"><rect x="-40" y="-6" width="64" height="12" fill="#FFD23F"/><path d="M24 -6 L38 0 L24 6Z" fill="#FFE3BD"/><path d="M34 -2 L38 0 L34 2Z" fill="${INK}"/><rect x="-46" y="-6" width="8" height="12" rx="2" fill="#FF8FB1"/></g>
      <g transform="translate(250 126)"><g class="bob"><rect x="-26" y="-34" width="52" height="40" rx="12" fill="#4C7DFF"/><path d="M-12 -34 Q-12 -46 0 -46 Q12 -46 12 -34" fill="none" stroke-width="4"/><rect x="-16" y="-20" width="32" height="18" rx="5" fill="#8FB3FF"/><circle cx="0" cy="-11" r="3" fill="#FFD23F"/></g></g>`,
    'en-pocasie': () => `${bg('#CDEBFF')}${sun(52, 50, 20)}${trava(140)}
      <path d="M170 140 A60 60 0 0 1 290 140" fill="none" stroke="#FF5A5F" stroke-width="9"/><path d="M178 140 A52 52 0 0 1 282 140" fill="none" stroke="#FFD23F" stroke-width="9"/><path d="M186 140 A44 44 0 0 1 274 140" fill="none" stroke="#4CD07D" stroke-width="9"/><path d="M194 140 A36 36 0 0 1 266 140" fill="none" stroke="#3D8BFF" stroke-width="9"/>
      ${cloud(104, 26, 1.5)}${drop(116, 98, 0)}${drop(144, 112, .4)}${drop(172, 98, .8)}${drop(130, 128, 1.2)}
      <g transform="translate(236 40)"><g class="spin"><path d="M0 -10 V10 M-9 -5 L9 5 M-9 5 L9 -5" stroke="#8FD3FF" stroke-width="4"/></g></g>`,
    'en-doprava': () => `${bg('#CDEBFF')}${cloud(30, 14, .8)}${sun(286, 34, 14)}
      <g transform="translate(222 52)"><g class="drift"><path d="M-34 0 Q-34 -12 -18 -12 H20 Q34 -12 38 0 Q34 10 20 10 H-18 Q-34 10 -34 0Z" fill="#fff"/><path d="M-6 0 L-22 22 H-8 L12 0Z M-6 -2 L-22 -22 H-8 L12 -2Z" fill="#3D8BFF"/><path d="M-34 -2 L-44 -16 L-34 -14Z" fill="#3D8BFF"/><circle cx="26" cy="-2" r="3" fill="#BFE7FF"/></g></g>
      <rect y="124" width="320" height="56" fill="#8C8FA8"/><path d="M0 124 H320"/><path d="M10 154 H50 M80 154 H120 M150 154 H190 M220 154 H260 M290 154 H330" stroke="#fff" stroke-width="4"/>
      <g transform="translate(96 134)"><g class="bob"><rect x="-70" y="-62" width="140" height="58" rx="12" fill="#FFD23F"/><path d="M-70 -24 H70" stroke-width="2.5"/>${[-52, -26, 0, 26].map(a => `<rect x="${a - 10}" y="-54" width="20" height="20" rx="3" fill="#BFE7FF"/>`).join('')}<rect x="42" y="-54" width="20" height="30" rx="3" fill="#BFE7FF"/><circle cx="-44" cy="-4" r="13" fill="${INK}"/><circle cx="-44" cy="-4" r="5" fill="#fff" stroke="none"/><circle cx="40" cy="-4" r="13" fill="${INK}"/><circle cx="40" cy="-4" r="5" fill="#fff" stroke="none"/></g></g>
      <g transform="translate(250 150)"><g class="bob"><path d="M-44 -4 V-22 Q-44 -28 -38 -28 H-28 L-16 -46 H14 L26 -28 H40 Q46 -28 46 -22 V-4Z" fill="#FF5A5F"/><path d="M-22 -28 L-13 -42 H-2 V-28Z M4 -28 V-42 H12 L21 -28Z" fill="#BFE7FF"/><circle cx="-24" cy="-2" r="11" fill="${INK}"/><circle cx="-24" cy="-2" r="4" fill="#fff" stroke="none"/><circle cx="26" cy="-2" r="11" fill="${INK}"/><circle cx="26" cy="-2" r="4" fill="#fff" stroke="none"/></g></g>`,
    'en-pocity': () => `${bg('#FFF1DC')}
      ${tvar(46, 90, '#FFD23F', `<g class="blink">${dot(-11, -6, 3.5)}${dot(11, -6, 3.5)}</g>`, '<path d="M-14 8 Q0 24 14 8" fill="none" stroke-width="3.5"/>', '<circle cx="-20" cy="8" r="5" fill="#FF8FB1" opacity=".7" stroke="none"/><circle cx="20" cy="8" r="5" fill="#FF8FB1" opacity=".7" stroke="none"/>')}
      ${tvar(124, 90, '#8FD3FF', `<g class="blink">${dot(-11, -4, 3.5)}${dot(11, -4, 3.5)}</g><path d="M-18 -14 L-6 -18 M18 -14 L6 -18" stroke-width="3"/>`, '<path d="M-12 16 Q0 4 12 16" fill="none" stroke-width="3.5"/>', '<path d="M-13 0 q-4 8 0 10 q4 -2 0 -10Z" fill="#3D8BFF" stroke-width="2"/>')}
      ${tvar(202, 90, '#FF7A6B', `<path d="M-20 -14 L-5 -6 M20 -14 L5 -6" stroke-width="4"/>${dot(-11, -2, 3.5)}${dot(11, -2, 3.5)}`, '<path d="M-12 16 Q0 6 12 16" fill="none" stroke-width="3.5"/>')}
      ${tvar(280, 90, '#C9B8FF', '<path d="M-17 -4 q6 5 12 0 M5 -4 q6 5 12 0" fill="none" stroke-width="3.5"/>', '<circle cx="0" cy="14" r="5" fill="#fff"/>', `<text x="26" y="-22" font-size="22" ${TXT} fill="${INK}">z</text>`)}
      <text x="46" y="150" font-size="15" ${TXT} fill="${INK}">happy</text><text x="124" y="150" font-size="15" ${TXT} fill="${INK}">sad</text><text x="202" y="150" font-size="15" ${TXT} fill="${INK}">angry</text><text x="280" y="150" font-size="15" ${TXT} fill="${INK}">sleepy</text>`,
    'en-cinnosti': () => `${bg('#CDEBFF')}${sun(282, 30, 14)}${cloud(20, 14, .7)}${trava(134)}${tree(30, 140, .9)}
      ${kid(104, 156, '#FF6FA8', { arm: -50 })}${kid(204, 156, '#4C7DFF', { flip: true, arm: -60, d: .4 })}
      <g transform="translate(154 64)"><g class="bob">${lopta(0, 0, 12)}</g></g>
      <text x="104" y="40" font-size="20" ${TXT} fill="${INK}">run</text><text x="204" y="40" font-size="20" ${TXT} fill="${INK}">jump</text>`,
    'en-priroda': () => `${bg('#CDEBFF')}${sun(274, 34, 16)}${cloud(24, 16, .8)}
      <path d="M0 120 L70 36 L124 100 L162 54 L230 120Z" fill="#9FB0C2"/><path d="M70 36 L50 62 L64 58 L72 66 L82 56 L92 62Z" fill="#fff"/><path d="M162 54 L148 74 L158 70 L166 76 L174 68 L180 74Z" fill="#fff"/>
      ${trava(120, '#8EE07A')}<path d="M0 150 C60 136 110 164 170 150 C230 136 280 160 320 148 V180 H0Z" fill="#4FB3F0"/><path d="M30 160 q10 -5 20 0 M170 164 q10 -5 20 0" fill="none" stroke="#fff" stroke-width="2.5"/>
      ${pine(246, 128, 1.1)}${tree(30, 134, .9)}${kvet(88, 26, '#FF6FA8')}${kvet(116, 20, '#FFD23F')}${kvet(284, 22, '#B36BFF')}`,
    'en-povolania': () => `${bg('#E9F7FF')}<rect y="138" width="320" height="42" fill="#CBD6E6"/><path d="M0 138 H320"/>
      ${kid(70, 158, '#FFFFFF', { s: 1.2, extra: '<circle cx="0" cy="-62" r="6" fill="#C9CED8"/><path d="M-9 -58 H9" stroke-width="3"/><path d="M0 -30 V-14 M-8 -22 H8" stroke="#FF5A5F" stroke-width="4"/>' })}
      ${kid(160, 158, '#FFFFFF', { s: 1.2, hair: '#2A2356', d: .3, extra: '<path d="M-13 -60 Q-22 -72 -9 -75 Q0 -84 10 -75 Q22 -72 13 -60Z" fill="#fff"/>' })}
      ${kid(250, 158, '#FF5A5F', { s: 1.2, d: .6, extra: '<path d="M-16 -58 Q-16 -77 0 -77 Q16 -77 16 -58Z" fill="#FF5A5F"/><rect x="-19" y="-61" width="38" height="6" rx="3" fill="#FF5A5F"/><circle cx="0" cy="-70" r="3" fill="#FFD23F" stroke-width="2"/>' })}
      <text x="70" y="24" font-size="18" ${TXT} fill="${INK}">doctor</text><text x="160" y="24" font-size="18" ${TXT} fill="${INK}">chef</text><text x="250" y="24" font-size="18" ${TXT} fill="${INK}">firefighter</text>`,
    'en-cas': () => `${bg('#FFF4DE')}${hodiny(160, 92, 62)}
      <g transform="translate(46 50)"><g class="spin"><circle r="16" fill="#FFD23F"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M0 -22 V-30" transform="rotate(${a})" stroke="#FFB300" stroke-width="4"/>`).join('')}</g></g>
      <g transform="translate(274 50)"><path d="M6 -22 A22 22 0 1 0 22 10 A18 18 0 0 1 6 -22Z" fill="#FFE27A"/></g>${hviezdicka(236, 28, .8, '#FFD23F', 0)}${hviezdicka(298, 100, .7, '#FFD23F', .5)}
      <rect x="22" y="128" width="76" height="40" rx="6" fill="#fff"/><path d="M22 134 A6 6 0 0 1 28 128 H92 A6 6 0 0 1 98 134 V142 H22Z" fill="#FF5A5F"/><text x="60" y="162" font-size="14" ${TXT} fill="${INK}">Monday</text>
      <text x="262" y="156" font-size="16" ${TXT} fill="${INK}">now</text>`,
    'en-otazky': () => `${bg('#FFF1DC')}${trava(140, '#8EE07A')}
      ${kid(64, 160, '#FF6FA8', { s: 1.2, arm: -50 })}${kid(256, 160, '#4C7DFF', { s: 1.2, flip: true, hair: '#2A2356', d: .5 })}
      <rect x="22" y="14" width="124" height="50" rx="14" fill="#fff"/><path d="M50 64 L56 82 L72 64Z" fill="#fff" stroke="none"/><path d="M50 64 L56 82 L72 64" fill="none"/><text x="84" y="46" font-size="22" ${TXT} fill="${INK}">Hello!</text>
      <rect x="168" y="14" width="136" height="50" rx="14" fill="#fff"/><path d="M262 64 L268 82 L284 64Z" fill="#fff" stroke="none"/><path d="M262 64 L268 82 L284 64" fill="none"/><text x="236" y="46" font-size="19" ${TXT} fill="${INK}">Your name?</text>`,
    'en-predlozky': () => `${bg('#E9F7FF')}<rect y="140" width="320" height="40" fill="#E8B67A"/><path d="M0 140 H320"/>
      <rect x="20" y="86" width="120" height="12" rx="3" fill="#B5651D"/><rect x="30" y="98" width="10" height="42" fill="#B5651D"/><rect x="120" y="98" width="10" height="42" fill="#B5651D"/>
      <g transform="translate(80 0)"><g class="bob">${lopta(0, 74)}</g></g>${lopta(80, 126)}
      <text x="80" y="38" font-size="22" ${TXT} fill="${INK}">on</text><text x="80" y="164" font-size="22" ${TXT} fill="${INK}">under</text>
      <g transform="translate(224 0)"><rect x="-46" y="96" width="92" height="44" rx="5" fill="#C98A4B"/><g class="bob">${lopta(0, 90, 12)}</g><path d="M-46 96 H46" stroke-width="3"/><rect x="-46" y="96" width="92" height="12" fill="#B5651D"/></g>
      <text x="224" y="38" font-size="22" ${TXT} fill="${INK}">in</text><text x="224" y="164" font-size="14" ${TXT} fill="${INK}">box</text>`,
    'en-hudba': () => `${bg('#F3E8FF')}<rect y="140" width="320" height="40" fill="#D9C8FF"/><path d="M0 140 H320"/>
      <g transform="translate(70 136) rotate(-14)"><rect x="-6" y="-120" width="12" height="62" fill="#8B5A2B"/><path d="M-8 -126 H8 V-110 H-8Z" fill="#6B3A22"/><path d="M0 -62 C-34 -64 -30 -30 -40 -16 C-48 4 -30 14 0 14 C30 14 48 4 40 -16 C30 -30 34 -64 0 -62Z" fill="#E0873A"/><circle cx="0" cy="-26" r="10" fill="${INK}"/><path d="M-12 8 H12" stroke-width="3"/></g>
      <g transform="translate(176 136)"><g class="bob"><path d="M-36 -44 H36 V-2 Q0 8 -36 -2Z" fill="#FF5A5F"/><ellipse cx="0" cy="-44" rx="36" ry="9" fill="#fff"/><path d="M-36 -34 L-20 -4 M-12 -34 L-4 4 M12 -34 L4 4 M36 -34 L20 -4" stroke-width="2"/></g></g>
      <path d="M214 98 L246 66 M262 98 L230 66" stroke="#B5651D" stroke-width="6"/>
      <g transform="translate(264 128)"><g class="bob">${[0, 1, 2, 3, 4].map(i => `<rect x="${-26 + i * 11}" y="-30" width="11" height="40" rx="2" fill="#fff"/>`).join('')}${[0, 1, 3, 4].map(i => `<rect x="${-26 + i * 11 + 7}" y="-30" width="8" height="24" rx="1.5" fill="${INK}"/>`).join('')}</g></g>
      ${[[120, 40, 0], [200, 24, .6], [250, 50, 1.2]].map(([x, y, d]) => `<g transform="translate(${x} ${y})"><g class="twinkle" style="animation-delay:${d}s"><ellipse cx="0" cy="10" rx="8" ry="6" fill="${INK}"/><path d="M7 10 V-14 Q14 -10 16 -2" fill="none" stroke-width="3.5"/></g></g>`).join('')}`,
  };
})());
