// Barselona 11–16 Kasım 2026 — sabit içerik (rehberden derlendi)
// Bu dosyayı düzenleyerek havuza mekan, önerilere slot veya checklist'e madde ekleyebilirsiniz.

const PEOPLE = [
  { id: 'mertcan', name: 'Mertcan', group: 'A', color: '#4f46e5' },
  { id: 'elif',    name: 'Elif',    group: 'A', color: '#db2777' },
  { id: 'atay',    name: 'Atay',    group: 'B', color: '#0891b2' },
  { id: 'alev',    name: 'Alev',    group: 'B', color: '#ea580c' }
  // İspanyolca arayüz isteyen biri eklenirse: lang: 'es'
];

// Ekipten ayrılanlar: eski sohbet mesajlarında adları doğru görünsün diye
const FORMER_PEOPLE = { cagatay: 'Çağatay', maribel: 'Maribel' };

const GROUPS = {
  A: { label: 'Grup A', who: 'Mertcan, Elif, Demir (3)', note: '07:00 kalkış, 12:30–15:00 otelde öğle uykusu, 21:00 sakinleşme.' },
  B: { label: 'Grup B', who: 'Atay, Alev, Keremacar (7)', note: 'Uyku yok; bilim, futbol, park, kano enerjisi.' }
};

const SLOTS = [
  { key: 'morning',   label: 'Sabah',       start: '08:30', end: '12:00', hint: 'Kahvaltı, fırın, serin saatte park veya mimari tur' },
  { key: 'lunch_nap', label: 'Öğle & Uyku', start: '12:30', end: '15:30', hint: 'Demir otelde uyuyor · B grubu park / müze', nap: true },
  { key: 'afternoon', label: 'İkindi',      start: '15:30', end: '19:30', hint: 'Uyanış ödülü tatlı, sahil, Zoo' },
  { key: 'evening',   label: 'Akşam',       start: '20:00', end: '23:30', hint: 'Tapas masaları, Pizza Local veya yetişkin gecesi' }
];

const DAYS = [
  { key: 'day1', date: '2026-11-11', short: 'Çar', num: 11, title: '11 Kasım Çarşamba',  desc: 'Varış günü · otele yerleşme ve yakın çevre', closed: { morning: 'Uçuş ve transfer' } },
  { key: 'day2', date: '2026-11-12', short: 'Per', num: 12, title: '12 Kasım Perşembe',  desc: 'Şehri keşif günü · pazar, Boqueria ve sahil' },
  { key: 'day3', date: '2026-11-13', short: 'Cum', num: 13, title: '13 Kasım Cuma',      desc: 'Tüm ekip birlikte · kültür, park, gurme tapas' },
  { key: 'day4', date: '2026-11-14', short: 'Cmt', num: 14, title: '14 Kasım Cumartesi', desc: 'Sahil, alışveriş ve büyük akşam buluşması' },
  { key: 'day5', date: '2026-11-15', short: 'Paz', num: 15, title: '15 Kasım Pazar',     desc: 'HYROX Doubles sabahı (Mertcan & Atay) · son tam gün' },
  { key: 'day6', date: '2026-11-16', short: 'Pzt', num: 16, title: '16 Kasım Pazartesi', desc: 'Dönüş günü', closed: { lunch_nap: 'Dönüş uçuşu', afternoon: 'İstanbul 17:55', evening: 'Evdeyiz' } }
];

const CATEGORIES = [
  { key: 'food',   label: 'Yemek',        icon: 'fa-utensils' },
  { key: 'coffee', label: 'Kahve & Tatlı', icon: 'fa-mug-hot' },
  { key: 'kids',   label: 'Çocuk & Aile', icon: 'fa-child-reaching' },
  { key: 'sight',  label: 'Gezi',         icon: 'fa-landmark' },
  { key: 'night',  label: 'Gece',         icon: 'fa-martini-glass-citrus' },
  { key: 'sport',  label: 'Spor',         icon: 'fa-dumbbell' }
];

// best: en uygun slotlar · res: rezervasyon/bilet gerekir · kid: çocuk dostu
// url: resmi site (Ekim 2026'da kontrol edildi; bulunamayanlarda yok) · addr: Google Maps araması için adres
const POOL = [
  { id: 'canete',     name: 'Bar Cañete',                 cat: 'food',   area: 'El Raval',          addr: 'Carrer de la Unió 17',            url: 'https://barcanete.com/',           icon: 'fa-utensils',        res: true,  kid: false, best: ['evening'],               desc: 'Üst düzey tapas barı: deniz ürünleri, biftek tartarlı brioche. Kalabalık akşam için erken rezervasyon şart.' },
  { id: 'nacional',   name: 'El Nacional',                cat: 'food',   area: 'Passeig de Gràcia', addr: 'Passeig de Gràcia 24 Bis',        url: 'https://www.elnacionalbcn.com/',   icon: 'fa-wine-glass',      res: true,  kid: true,  best: ['evening', 'lunch_nap'],  desc: '6 kişilik grubun çocuklarla en ferah oturabileceği tarihi gastronomi sarayı.' },
  { id: 'boqueria',   name: 'Mercat de la Boqueria',      cat: 'food',   area: 'La Rambla',         addr: 'La Rambla 91',                    url: 'https://www.boqueria.barcelona/',  icon: 'fa-basket-shopping', res: false, kid: true,  best: ['morning'],               desc: 'Sabah erken: taze meyve suları, jambon, Pinotxo / El Quim tezgah tapasları.' },
  { id: 'pizzalocal', name: 'Pizza Local',                cat: 'food',   area: 'El Born',           addr: "Carrer de l'Argenteria 27",       icon: 'fa-pizza-slice',     res: false, kid: true,  best: ['evening'],               desc: 'Ekşi mayalı pizza, glütensiz seçenek. Demir ve Keremacar için hızlı, stressiz akşam kurtarıcısı.' },
  { id: 'malvon',     name: 'Empanadas Malvón',           cat: 'food',   area: 'Birden fazla şube', addr: 'Empanadas Malvón',                url: 'https://www.malvon.es/es',         icon: 'fa-cookie',          res: false, kid: true,  best: ['afternoon', 'evening'],  desc: 'Yürürken elde yenen sıcak Arjantin empanadaları; kriz önleyici atıştırmalık. Haritada en yakın şube çıkar.' },
  { id: 'fritas',     name: 'Las Fritas',                 cat: 'food',   area: 'Barceloneta',       addr: 'Passeig de Joan de Borbó',        icon: 'fa-bowl-food',       res: false, kid: true,  best: ['afternoon'],             desc: 'Çift kızartma külah patates, bol sos seçeneği. Oturma yeri yok, al-götür; karşıda liman manzaralı banklar.' },
  { id: 'succulent',  name: 'Suculent',                   cat: 'food',   area: 'El Raval',          addr: 'Rambla del Raval 45',             url: 'https://suculent.com/',            icon: 'fa-champagne-glasses', res: true, kid: false, best: ['evening'],               desc: 'Şef Antonio (Toni) Romero: modern Katalan tabakları, kemik ilikli tartar. Hafta sonu kapalı; Per/Cum için uygun.' },
  { id: 'pepita',     name: 'La Pepita',                  cat: 'food',   area: 'Gràcia',            addr: 'Carrer de Còrsega 343',           url: 'https://www.lapepitabcn.com/',     icon: 'fa-burger',          res: false, kid: true,  best: ['lunch_nap', 'evening'],  desc: 'Rahat, samimi gurme sandviç ve imza tapas barı. HYROX kutlaması için ideal.' },
  { id: 'sartoria',   name: 'Sartoria Panatieri',         cat: 'food',   area: 'Gràcia · Eixample', addr: "Carrer de l'Encarnació 51",       url: 'https://sartoriapanatieri.com/',   ig: 'sartoriapanatieri',   icon: 'fa-pizza-slice',     res: true,  kid: true,  best: ['evening', 'lunch_nap'],  desc: '50 Top Pizza listesinde dünyanın en iyileri arasında; Avrupa\'nın İtalya dışındaki en iyi pizzacısı seçildi. İkinci şube Eixample\'da (Provença 330). Sitesinden rezervasyon.' },
  { id: 'positano',   name: 'Positano Pizzeria',          cat: 'food',   area: 'Eixample',          addr: 'Carrer del Rosselló 24',          url: 'https://positanopizzeriabcn.com/en', ig: 'positanopizzeriabcn', icon: 'fa-pizza-slice',     res: false, kid: true,  best: ['evening', 'lunch_nap'],  desc: 'Üç Napolili\'nin açtığı Napoli usulü pizzacı: 48 saat mayalanmış hamur, odun fırını.' },
  { id: 'leromane',   name: 'Le Romane',                  cat: 'food',   area: 'Eixample',          addr: 'Carrer de Muntaner 103',          url: 'https://www.leromane.com/',        ig: 'leromanebarcelona',   icon: 'fa-pizza-slice',     res: true,  kid: true,  best: ['evening', 'lunch_nap'],  desc: 'Roma usulü pizza, makarna ve İtalyan şarapları. Her kişi iki pizza çeşidi seçiyor, pizza masaya dilim dilim paylaşılıyor. Her gün 13:00\'ten gece geç saate kadar açık.' },
  { id: 'madmad',     name: 'Mad Mad Vegan',              cat: 'food',   area: 'Eixample',          addr: "Carrer d'Aribau 65",              url: 'https://madmadvegan.com/',         ig: 'madmadvegan',         icon: 'fa-leaf',            res: false, kid: true,  best: ['lunch_nap', 'evening'],  desc: '%100 bitkisel burger restoranı. Her gün 12:30\'dan gece geç saate kadar açık.' },
  { id: 'hofmann',    name: 'Pastisseria Hofmann',        cat: 'coffee', area: 'El Born',           addr: 'Carrer dels Flassaders 44',       url: 'https://hofmannpasteleria.com/',   ig: 'pasteleriahofmann',   icon: 'fa-bread-slice',     res: false, kid: true,  best: ['afternoon', 'morning'],  desc: 'Meşhur mascarpone kremalı kruvasan. Demir uyanınca ikindi ödülü.' },
  { id: 'lapapa',     name: 'La Papa',                    cat: 'coffee', area: 'Birden fazla şube', addr: 'La Papa',                         url: 'https://lapapa.es/',               ig: 'lapapa______',        icon: 'fa-mug-saucer',      res: false, kid: true,  best: ['morning', 'lunch_nap'],  desc: 'Ev yapımı gündüz mutfağı ve özel kahve; kahvaltı/brunch. Şubeler: Gran de Gràcia 127, Trafalgar 56, Aribau 92, Pau Claris 190. Haritada en yakını çıkar.' },
  { id: 'brunchcake', name: 'Brunch & Cake Sagrada Família', cat: 'coffee', area: 'Eixample',         addr: 'Plaça de la Sagrada Família 21',  url: 'https://brunchandcake.com/sagrada-familia/', ig: 'brunchandcake', icon: 'fa-cake-candles',  res: false, kid: true,  best: ['morning', 'lunch_nap'],  desc: 'Sagrada Família\'nın tam karşısında, gösterişli tabaklarıyla ünlü brunch zinciri. Her gün 09:00–16:30 (Cum–Paz 17:00). Kule ziyaretinden önce ya da sonra ideal.' },
  { id: 'faire',      name: 'Faire. Brunch & Drinks',     cat: 'coffee', area: 'Eixample',          addr: 'Carrer de Girona 81',             url: 'https://www.fairebarcelona.com/',  icon: 'fa-egg',             res: false, kid: true,  best: ['morning'],               desc: 'Vejetaryen brunch: pancake, avokadolu ekşi maya, iyi kahve. Günlük sınırlı rezervasyon alıyor.' },
  { id: 'nomad',      name: 'Nomad Coffee Lab',           cat: 'coffee', area: 'Passatge Sert',     addr: 'Passatge Sert 12',                url: 'https://nomadcoffee.es/',          icon: 'fa-mug-hot',         res: false, kid: false, best: ['morning', 'lunch_nap'],  desc: 'Şehrin en iyi özel çekirdek kavurucusu; shaked espresso.' },
  { id: 'funky',      name: 'Funky Bakers',               cat: 'coffee', area: 'El Born',           addr: 'Passeig del Born 10',             icon: 'fa-cookie-bite',     res: false, kid: true,  best: ['morning', 'afternoon'],  desc: 'Babka, tuzlu çikolatalı kurabiye ve kahvaltı. (Oturmalı "Eatery" şubesi Eixample, Bailèn 61.)' },
  { id: 'campana',    name: 'La Campana',                 cat: 'coffee', area: 'El Born',           addr: 'Carrer de la Princesa 36',        icon: 'fa-ice-cream',       res: false, kid: true,  best: ['afternoon'],             desc: '1890\'dan beri turrón ustası. Dondurma sezonu Ekim\'de bitiyor; Kasım\'da turrón ve çikolata.' },
  { id: 'zoo',        name: 'Zoo de Barcelona',           cat: 'kids',   area: 'Parc de la Ciutadella', addr: 'Zoo de Barcelona',            url: 'https://zoobarcelona.cat/',        icon: 'fa-paw',             res: false, kid: true,  best: ['lunch_nap', 'afternoon', 'morning'], desc: 'Gölgelik, düz ayak, puset dostu. Bileti online almak sırayı kısaltır.' },
  { id: 'ciutadella', name: 'Ciutadella Parkı & Mamut',   cat: 'kids',   area: 'El Born',           addr: 'Passeig de Picasso 21',           url: 'https://www.barcelona.cat/en/what-to-do-in-bcn/parks-and-gardens/parque-de-la-ciutadella-92086011921', icon: 'fa-tree', res: false, kid: true, best: ['lunch_nap', 'afternoon'], desc: 'Göl kenarında kayık, açık çimenler ve dev taş mamut heykeli. 07:00\'den gün batımına açık.' },
  { id: 'cosmocaixa', name: 'CosmoCaixa Bilim Müzesi',    cat: 'kids',   area: 'Sant Gervasi',      addr: "Carrer d'Isaac Newton 26",        url: 'https://cosmocaixa.org/es/',       icon: 'fa-flask',           res: true,  kid: true,  best: ['lunch_nap', 'morning'],  desc: 'Kapalı yağmur ormanı ve dokunmatik su deneyleri. Keremacar için birebir.' },
  { id: 'barceloneta', name: 'Barceloneta Sahili',        cat: 'kids',   area: 'Barceloneta',       addr: 'Platja de la Barceloneta',        icon: 'fa-umbrella-beach',  res: false, kid: true,  best: ['afternoon'],             desc: 'Deniz kenarı yürüyüşü, kumda oyun; Las Fritas ile birleştirilebilir.' },
  { id: 'campnou',    name: 'Camp Nou Turu',              cat: 'kids',   area: 'Les Corts',         addr: 'Spotify Camp Nou',                url: 'https://www.fcbarcelona.com/en/tickets/camp-nou-experience', icon: 'fa-futbol', res: true, kid: true, best: ['lunch_nap', 'morning'], desc: 'Barça müzesi ve stadyum turu. Tadilat nedeniyle açık bölümleri önceden kontrol edin.' },
  { id: 'sagrada',    name: 'La Sagrada Família',         cat: 'sight',  area: 'Eixample',          addr: 'Carrer de Mallorca 401',          url: 'https://sagradafamilia.org/',      icon: 'fa-church',          res: true,  kid: true,  best: ['morning'],               desc: 'Gaudí başyapıtı. Kuleli bilet haftalar önce tükenir; online rezervasyon şart.' },
  { id: 'guell',      name: 'Park Güell',                 cat: 'sight',  area: 'Gràcia',            addr: 'Park Güell',                      url: 'https://parkguell.barcelona/',     icon: 'fa-mountain-sun',    res: true,  kid: true,  best: ['morning'],               desc: 'Mozaik teras ve şehir manzarası. Saatli giriş bileti gerekir; yokuşlu, puset zor.' },
  { id: 'picasso',    name: 'Museu Picasso',              cat: 'sight',  area: 'El Born',           addr: 'Carrer de Montcada 15-23',        url: 'https://museupicassobcn.cat/en',   icon: 'fa-palette',         res: true,  kid: true,  best: ['morning', 'afternoon'],  desc: 'Picasso\'nun gençlik yıllarının eserleri, beş Ortaçağ sarayında. Sal–Paz 10:00–19:00, Pazartesi kapalı. 12 € online, 18 yaş altı ücretsiz. Perşembe 16:00–19:00 ücretsiz; rezervasyon 4 gün önce 10:00\'da açılır.' },
  { id: 'drymartini', name: 'Dry Martini',                cat: 'night',  area: 'Eixample',          addr: "Carrer d'Aribau 162",             url: 'https://www.drymartiniorg.com/',   icon: 'fa-martini-glass',   res: false, kid: false, best: ['evening'],               desc: 'Javier de las Muelas imzalı efsane kokteyl barı (yetişkin akşamı).' },
  { id: 'stravinsky', name: 'Dr. Stravinsky',             cat: 'night',  area: 'El Born',           addr: 'Carrer dels Mirallers 5',         url: 'https://drstravinsky.cat/',        icon: 'fa-flask-vial',      res: false, kid: false, best: ['evening'],               desc: 'Kendi likörlerini damıtan simya kokteyl barı (World\'s 50 Best Bars).' },
  { id: 'mariposa',   name: 'Mariposa Negra',             cat: 'night',  area: 'El Born',           addr: 'Plaça de les Olles 4',            url: 'https://mariposanegrabar.com/',    icon: 'fa-wand-magic-sparkles', res: false, kid: false, best: ['evening'],           desc: 'Eski Savoy American Bar şefi Luca Corradini\'nin barı; el yapımı seramik/3D baskı bardaklarda kokteyller.' },
  { id: 'gatsby',     name: 'Gatsby Barcelona',           cat: 'night',  area: 'Sant Gervasi',      addr: 'Carrer de Tuset 19',              url: 'https://gatsbybarcelona.com/',     icon: 'fa-masks-theater',   res: true,  kid: false, best: ['evening'],               desc: 'Canlı müzik, dans ve kabare gösterili dinner-show (çocuksuz gece).' },
  { id: 'hyrox',      name: 'HYROX Barcelona',            cat: 'sport',  area: 'Fira Gran Via',     addr: 'Fira Barcelona Gran Via, Av. Joan Carles I 64, L\'Hospitalet de Llobregat', url: 'https://hyrox.com/event/hyrox-barcelona-2/', icon: 'fa-dumbbell', res: true, kid: true, best: ['morning'], desc: 'Pazar 15 Kasım sabahı Men\'s Doubles: Mertcan & Atay. Aileler tribünde ya da yarış sürerken Park Güell\'de.' },

  // Atay'ın öneri listesinden gelen mekanlar (notları ATAY_TIPS'te)
  { id: 'salut',      name: 'Salut Bistro',               cat: 'coffee', area: 'Eixample',          addr: "Carrer d'Enric Granados 58",      icon: 'fa-mug-saucer',      res: false, kid: true,  best: ['morning'],               desc: 'Gündüz özel kahve ve brunch, akşam şarap bistrosu.' },
  { id: 'candende',   name: 'Can Dendê',                  cat: 'coffee', area: 'Poblenou',          addr: 'Carrer de la Ciutat de Granada 44', url: 'https://candende.com/',          icon: 'fa-egg',             res: false, kid: true,  best: ['morning', 'lunch_nap'],  desc: 'Brezilya dokunuşlu sevilen brunch: dulce de leche\'li pancake, avokadolu tost. Pzt–Çar kapalı; rezervasyon almıyor, hafta sonu erken gidin.' },
  { id: 'cecconis',   name: "Cecconi's Barcelona",        cat: 'food',   area: 'Port Vell',         addr: 'Passeig de Colom 20',             url: 'https://www.cecconisrestaurants.com/barcelona/', icon: 'fa-utensils', res: true, kid: true, best: ['morning', 'lunch_nap'], desc: 'Soho House binasında Kuzey İtalyan restoranı, limana yakın. Pazar brunch\'ı meşhur.' },
  { id: 'brunchitborn', name: 'Brunchit El Born',         cat: 'coffee', area: 'El Born',           addr: 'Carrer de Sant Pere Més Alt 31-33', url: 'https://brunchit.es/en/restaurantes/el-born/', icon: 'fa-egg', res: false, kid: true, best: ['morning'], desc: 'Popüler brunch zincirinin El Born şubesi.' },
  { id: 'cremat',     name: 'Cremat 11',                  cat: 'coffee', area: 'El Born',           addr: 'Carrer del Cremat Gran 11',       icon: 'fa-mug-saucer',      res: false, kid: true,  best: ['morning'],               desc: 'Picasso Müzesi\'nin yakınında küçük brunch mekanı.' },
  { id: 'tortillez',  name: 'Los Tortíllez',              cat: 'food',   area: 'Eixample',          addr: 'Carrer del Consell de Cent 299',  url: 'https://www.lostortillez.com/',    icon: 'fa-egg',             res: false, kid: true,  best: ['morning', 'lunch_nap'],  desc: 'Tortilla de patatas (İspanyol omleti) üzerine kurulu bar: trüflü, karamelize soğanlı çeşitler ve kroketler.' },
  { id: 'brunchit',   name: 'Brunchit Eixample',          cat: 'coffee', area: 'Eixample',          addr: "Carrer d'Aragó 352",              url: 'https://brunchit.es/en/restaurantes/brunch-barcelona-eixample/', icon: 'fa-egg', res: false, kid: true, best: ['morning'], desc: 'Popüler brunch zinciri. Bu şube Çarşamba kapalı.' },
  { id: 'lato',       name: 'Lato',                       cat: 'coffee', area: 'Eixample',          addr: 'Carrer del Bruc 118',             icon: 'fa-mug-saucer',      res: false, kid: true,  best: ['morning'],               desc: 'And mutfağı esintili brunch: ceviche, muzlu omlet, bol vegan seçenek.' },
  { id: 'zenith',     name: 'Zenith',                     cat: 'coffee', area: 'Eixample',          addr: 'Gran Via de les Corts Catalanes 633', icon: 'fa-mug-saucer',  res: false, kid: true,  best: ['morning'],               desc: 'Gün boyu brunch ve özel içecekler; vegan ve glütensiz seçenekler.' },
  { id: 'billy',      name: 'Billy Brunch Headquarters',  cat: 'coffee', area: 'Eixample',          addr: 'Carrer de Muntaner 64',           url: 'https://billybrunch.com/',         icon: 'fa-egg',             res: false, kid: true,  best: ['morning'],               desc: 'Billy Brunch zincirinin ilk mekanı; tavuklu arka bahçesiyle bilinir.' },
  { id: 'alsur',      name: 'Alsur Café',                 cat: 'coffee', area: 'Eixample',          addr: 'Carrer de Roger de Llúria 23',    url: 'https://www.alsurcafe.com/',       icon: 'fa-mug-hot',         res: false, kid: true,  best: ['lunch_nap', 'morning'],  desc: 'Gün boyu brunch ve hafif yemek. El Born\'da da şubeleri var.' },
  { id: 'surfhouse',  name: 'Surf House Barcelona',       cat: 'food',   area: 'Barceloneta',       addr: 'Platja de la Barceloneta',        url: 'https://www.surfhousebarcelona.com/', icon: 'fa-burger',       res: false, kid: true,  best: ['lunch_nap', 'afternoon'], desc: 'Sahilde sörf kafe: burger, nachos, smoothie ve kokteyl.' },
  { id: 'caravelle',  name: 'Caravelle',                  cat: 'food',   area: 'El Raval',          addr: 'Carrer del Pintor Fortuny 31',    icon: 'fa-pepper-hot',      res: false, kid: true,  best: ['lunch_nap', 'morning'],  desc: 'Kendi birasını yapan kafe-gastropub: brunch, taco ve bowl\'lar. Boqueria\'ya birkaç dakika.' },
  { id: 'xampanyet',  name: 'El Xampanyet',               cat: 'food',   area: 'El Born',           addr: 'Carrer de Montcada 22',           icon: 'fa-wine-bottle',     res: false, kid: false, best: ['afternoon', 'evening'],  desc: 'Picasso Müzesi\'nin karşısında, ev yapımı köpüklü "xampanyet"i ve hamsi tapaslarıyla klasik bar. Ayakta ve kalabalık.' },
  { id: 'cerveceria', name: 'Cervecería Catalana',        cat: 'food',   area: 'Eixample',          addr: 'Carrer de Mallorca 236',          icon: 'fa-beer-mug-empty',  res: false, kid: true,  best: ['evening', 'lunch_nap'],  desc: 'Şehrin en sevilen klasik tapas barlarından; uzun montadito ve tapas tezgahı. Sıra olabilir.' },
  { id: 'petittapas', name: 'Petit Tapas',                cat: 'food',   area: 'Barri Gòtic',       addr: 'Carrer Ample 26',                 url: 'https://petittapas.com/',          icon: 'fa-utensils',        res: true,  kid: true,  best: ['evening'],               desc: 'Gotik Mahalle\'de samimi tapas ve paylaşımlık tabaklar, iyi şarap. Sitesinden rezervasyon.' },
  { id: 'ciutatcomtal', name: 'Ciutat Comtal',            cat: 'food',   area: 'Eixample',          addr: 'Rambla de Catalunya 18',          icon: 'fa-utensils',        res: false, kid: true,  best: ['evening', 'lunch_nap'],  desc: 'Rambla de Catalunya\'da çok popüler tapas barı; akşamları kalabalık.' },
  { id: 'pacomeralgo', name: 'Paco Meralgo',              cat: 'food',   area: 'Eixample',          addr: 'Carrer de Muntaner 171',          url: 'https://restaurantpacomeralgo.com/', icon: 'fa-fish',          res: true,  kid: true,  best: ['evening'],               desc: '"Alta taberna": taze deniz ürünleri ağırlıklı klasik tapas.' },
  { id: 'ocana',      name: 'Ocaña',                      cat: 'food',   area: 'Barri Gòtic',       addr: 'Plaça Reial 13-15',               url: 'https://www.ocana.cat/',           icon: 'fa-utensils',        res: false, kid: true,  best: ['evening'],               desc: 'Plaça Reial\'de restoran, kafe ve kokteyl barı; meydana bakan teras.' },
  { id: 'desoriente', name: 'Desoriente',                 cat: 'food',   area: 'Eixample',          addr: 'Desoriente Eixample',             icon: 'fa-fish',            res: true,  kid: false, best: ['evening'],               desc: 'Japon–Akdeniz füzyonu, tadım menüsü; küçük salon, rezervasyon iyi olur.' },
  { id: 'honestgreens', name: 'Honest Greens Tuset',      cat: 'food',   area: 'Sant Gervasi',      addr: 'Carrer de Tuset 4',               url: 'https://www.honestgreens.com/en/restaurants/tuset-en/', icon: 'fa-leaf', res: false, kid: true, best: ['lunch_nap', 'evening'], desc: 'Taze, sağlıklı tabaklar ve bowl\'lar; hızlı servis, çocuklarla rahat.' },
  { id: 'trebol',     name: 'Xurreria Trébol',            cat: 'coffee', area: 'Gràcia',            addr: 'Carrer de Còrsega 341',           icon: 'fa-cookie',          res: false, kid: true,  best: ['afternoon', 'evening'],  desc: '1950\'den beri churro ve sıcak çikolata; La Pepita\'nın hemen yanında.' }
];

// Atay'ın öneri listesi: havuzda "Atay'ın önerileri" filtresiyle bölüm bölüm görünür
const ATAY_SECTIONS = [
  { key: 'kahvalti', label: 'Kahvaltı' },
  { key: 'yakin',    label: 'Otele yakın kahvaltı' },
  { key: 'eixample', label: 'Kahvaltı · Eixample' },
  { key: 'oglen',    label: 'Öğlen' },
  { key: 'tapas',    label: 'Tapas' },
  { key: 'aksam',    label: 'Akşam yemeği' },
  { key: 'alt',      label: 'Alternatif' }
];

const ATAY_TIPS = {
  salut:        { sec: 'kahvalti', note: '2 km, ~20 dk Uber.' },
  candende:     { sec: 'kahvalti', note: '3 km, ~20 dk arabayla.' },
  lapapa:       { sec: 'kahvalti', note: 'Geç kahvaltı için Pau Claris şubesi (190): 1,8 km, ~18 dk Uber.' },
  cecconis:     { sec: 'kahvalti', note: 'Pazarları açık, kahvaltısı çok iyi. Sahilde, 1 km yürüme.' },
  malvon:       { sec: 'kahvalti', note: '450 m, 7 dk yürüme. Kıymalı börek tadında.' },
  hofmann:      { sec: 'kahvalti', note: 'Kruvasan. 950 m, 12 dk yürüme (Picasso Müzesi\'nin orada).' },
  caravelle:    { sec: 'yakin',    note: '700 m, 9 dk yürüme. Öğlen listesinde "Carabela Cafe" diye de var: Meksika yemekleri, nachos ve margaritaları çok iyi.' },
  brunchitborn: { sec: 'yakin',    note: '650 m, 9 dk yürüme.' },
  cremat:       { sec: 'yakin',    note: '750 m, 10 dk yürüme.' },
  tortillez:    { sec: 'eixample', note: 'İspanyol omleti. 1,3 km, 18 dk yürüme (yukarıda).' },
  brunchit:     { sec: 'eixample', note: '1,8 km, 25 dk yürüme (yukarıda).' },
  lato:         { sec: 'eixample', note: '1,8 km, 25 dk yürüme (yukarıda).' },
  zenith:       { sec: 'eixample', note: '1,1 km, 15 dk yürüme.' },
  billy:        { sec: 'eixample', note: '1,5 km, 22 dk yürüme.' },
  alsur:        { sec: 'oglen',    note: '1 km, 13 dk yürüme (yukarı kısımda).' },
  surfhouse:    { sec: 'oglen',    note: 'Uber + yürüme ~25 dk (marinada).' },
  xampanyet:    { sec: 'tapas',    note: '800 m, 11 dk yürüme.' },
  petittapas:   { sec: 'tapas',    note: '700 m, 10 dk.' },
  cerveceria:   { sec: 'tapas',    note: 'Akşam yemeği için de: 1,6 km, 23 dk yürüme ya da 18 dk Uber.' },
  ciutatcomtal: { sec: 'tapas',    note: 'Akşam yemeği için de: 900 m, 13–15 dk yürüme. Akşam rezervasyon gerekebilir.' },
  fritas:       { sec: 'aksam',    note: 'Patates kızartmacısı. 700 m, 9 dk.' },
  gatsby:       { sec: 'aksam',    note: '2,5 km, ~20 dk Uber (yukarıda).' },
  drymartini:   { sec: 'aksam',    note: 'Kokteyl deneyin! 2,2 km, ~15 dk Uber (yukarıda).' },
  pizzalocal:   { sec: 'aksam',    note: '550 m, 7 dk yürüme.' },
  pacomeralgo:  { sec: 'aksam',    note: '~20 dk Uber.' },
  ocana:        { sec: 'aksam',    note: '700 m, 9 dk yürüme.' },
  desoriente:   { sec: 'aksam',    note: 'Japon ve Akdeniz mutfağı. 1,7 km, 15 dk Uber.' },
  sartoria:     { sec: 'alt',      note: 'Dünyanın en iyi ikinci pizzacısı. 1,9 km, 18 dk Uber.' },
  honestgreens: { sec: 'alt',      note: '2,4 km, 19 dk Uber.' },
  trebol:       { sec: 'alt',      note: 'Tatlıcı. 2 km, 18 dk Uber.' }
};

// Silinemeyen, takvime sabit olaylar
const FIXED_EVENTS = {
  day1: {
    morning: [
      { time: '09:10', title: 'TK1853 IST → BCN (varış 10:55)', icon: 'fa-plane-departure' }
    ],
    // Transfer (10:55) veritabanında PDF'li plan kartı olarak duruyor; check-in onun ardından
    lunch_nap: [
      { time: '12:15', title: 'Otele check-in, bavulları bırak', icon: 'fa-hotel' }
    ]
  },
  day5: {
    morning: [ { time: 'Sabah', title: 'HYROX Men\'s Doubles · Mertcan & Atay · Fira Gran Via', icon: 'fa-dumbbell' } ]
  },
  day6: {
    morning: [
      { time: '08:30', title: 'Kahvaltı + Hofmann\'dan paket kruvasan', icon: 'fa-bread-slice' },
      { time: '09:30', title: 'Otelden çıkış', icon: 'fa-suitcase-rolling' },
      { time: '10:00', title: 'Havalimanı: bagaj, Tax-Free, pasaport', icon: 'fa-passport' },
      { time: '12:20', title: 'TK1854 BCN → IST (varış 17:55)', icon: 'fa-plane-departure' }
    ]
  }
};

// Seçenekli ortak kararlar (ekip oylar)
const DECISIONS = [
  {
    id: 'big_dinner', title: 'Cumartesi büyük akşam', icon: 'fa-champagne-glasses',
    desc: '14 Kasım akşamı tüm ekip nerede?',
    options: [
      { id: 'nacional', label: 'El Nacional',  sub: '6 kişi, çocuklarla rahat, ferah salon' },
      { id: 'gatsby',   label: 'Gatsby',       sub: 'Yetişkin dinner-show; çocuklar için bakıcı/nöbet gerekir' },
      { id: 'both',     label: 'İkisi de',     sub: 'Erken El Nacional, sonra yetişkinler Gatsby / Dry Martini' }
    ]
  }
];

// Önerilen plan: kabul edilene kadar kesik çizgili "öneri" kartı olarak görünür.
// who: hangi grup için
const SUGGESTED_PLAN = {
  day1: {
    lunch_nap: [ { id: 'ciutadella', who: 'B', note: 'Demir uyurken Atay, Alev & Keremacar' } ],
    afternoon: [ { id: 'hofmann', note: 'Uyanış ödülü + El Born turu' } ],
    evening:   [ { id: 'pizzalocal', note: 'Yolculuk günü: hızlı ve stressiz' } ]
  },
  day2: {
    morning:   [ { id: 'boqueria' } ],
    lunch_nap: [ { id: 'cosmocaixa', who: 'B' } ],
    afternoon: [ { id: 'barceloneta' }, { id: 'fritas' } ],
    evening:   [ { id: 'canete' } ]
  },
  day3: {
    morning:   [ { id: 'sagrada' } ],
    lunch_nap: [ { id: 'zoo', who: 'B' } ],
    afternoon: [ { id: 'ciutadella', note: 'Kayık turu' }, { id: 'campana' } ],
    evening:   [ { id: 'succulent', note: 'Cuma açık, hafta sonu kapalı' }, { id: 'stravinsky', note: 'Yemek sonrası yetişkinler' } ]
  },
  day4: {
    morning:   [ { id: 'faire' }, { id: 'nomad' } ],
    lunch_nap: [ { id: 'campnou', who: 'B' } ],
    afternoon: [ { id: 'zoo' } ],
    evening:   [ { id: 'nacional', note: 'Ekipçe büyük akşam' }, { id: 'gatsby', note: 'Yetişkinler, çocuklar uyuduktan sonra' } ]
  },
  day5: {
    morning:   [ { id: 'ciutadella', note: 'Aileler, yarış sürerken' } ],
    lunch_nap: [ { id: 'pepita', note: 'Madalya kutlaması / Gràcia' } ],
    afternoon: [ { id: 'funky' } ],
    evening:   [ { id: 'malvon' }, { id: 'pizzalocal', note: 'Son akşam sakin' } ]
  }
};

// url: resmi bilet / rezervasyon sayfası (Ekim 2026'da kontrol edildi)
const CHECKLIST = [
  { id: 'sagrada',   text: 'Sagrada Família kuleli bilet', cat: 'Bilet', url: 'https://sagradafamilia.org/en/tickets' },
  { id: 'guell',     text: 'Park Güell saatli bilet', cat: 'Bilet', url: 'https://parkguell.barcelona/en/buy-tickets' },
  { id: 'catedral',  text: 'Barselona Katedrali bileti', cat: 'Bilet', url: 'https://tickets.catedralbcn.org/en' },
  { id: 'picasso',   text: 'Picasso Müzesi bileti (Paz 15 Kas 10:45)', cat: 'Bilet', url: 'https://museupicassobcn.cat/en/plan-your-visit/buy-tickets-and-opening-hours' },
  { id: 'cosmo',     text: 'CosmoCaixa bileti', cat: 'Bilet', url: 'https://cosmocaixa.org/es/' },
  { id: 'zoo',       text: 'Zoo online bilet', cat: 'Bilet', url: 'https://zoobarcelona.cat/en/tickets' },
  { id: 'campnou',   text: 'Camp Nou turu (açık mı kontrol)', cat: 'Bilet', url: 'https://www.fcbarcelona.com/en/tickets/camp-nou-experience' },
  { id: 'canete',    text: 'Bar Cañete rezervasyonu', cat: 'Rezervasyon', url: 'https://barcanete.com/' },
  { id: 'nacional',  text: 'El Nacional 6 kişilik masa', cat: 'Rezervasyon', url: 'https://www.elnacionalbcn.com/' },
  { id: 'succulent', text: 'Suculent rezervasyonu (hafta sonu kapalı)', cat: 'Rezervasyon', url: 'https://suculent.com/' },
  { id: 'leromane',  text: 'Le Romane rezervasyonu', cat: 'Rezervasyon', url: 'https://www.leromane.com/' },
  { id: 'gatsby',    text: 'Gatsby show rezervasyonu', cat: 'Rezervasyon', url: 'https://gatsbybarcelona.com/' },
  { id: 'hyrox',     text: 'HYROX Doubles kaydı (Mertcan & Atay, Pazar)', cat: 'HYROX', url: 'https://hyrox.com/event/hyrox-barcelona-2/' },
  { id: 'transfer1', text: '11 Kas havalimanı → otel transferi (taksi / Aerobús)', cat: 'Ulaşım', url: 'https://aerobusbarcelona.es/en/' },
  { id: 'transfer2', text: '16 Kas 09:30 otel → havalimanı transferi', cat: 'Ulaşım', url: 'https://aerobusbarcelona.es/en/' },
  { id: 'tcasual',   text: 'T-Casual (10 biniş, 13 €) / Hola BCN kartı', cat: 'Ulaşım', url: 'https://www.tmb.cat/en/barcelona-fares-metro-bus/t-casual' },
  { id: 'stroller',  text: 'Puset + çocuk ilaç çantası', cat: 'Bavul' },
  { id: 'rain',      text: 'Yağmurluk / ince mont (Kasım ~12–18°C)', cat: 'Bavul' }
];

const PRACTICAL = [
  { icon: 'fa-cloud-sun-rain', title: 'Hava', text: 'Kasım ortası gündüz 15–18°C, akşam 10–12°C. Ara ara yağmur; katmanlı giyin.' },
  { icon: 'fa-bed', title: 'Demir uyku kuralı', text: '12:30–15:00 otelde uyku dokunulmaz. Planlar otele yakın kurgulanır; puset öğlen otelde kalır, akşam yürüyüşleri için alınır.' },
  { icon: 'fa-baby-carriage', title: 'Puset stratejisi', text: 'Gündüz kısa pusetsiz keşif. Akşam uzun yürüyüş veya geç yemekte puset gelir; Demir 21:00 civarı pusette uyuyabilir.' },
  { icon: 'fa-burger', title: 'Kriz önleyici', text: 'Bekleme yok: Pizza Local ve Empanadas Malvón kilit noktalarda.' },
  { icon: 'fa-bus', title: 'Ulaşım', text: 'Havalimanı: taksi ~30–35 dk veya Aerobús (Plaça Catalunya). Şehir içi metro + T-Casual (10 biniş, 13 €); T-Casual havalimanı metro istasyonlarında geçmez.' },
  { icon: 'fa-phone', title: 'Acil', text: 'Avrupa acil hattı 112. Eczane: yeşil haç tabelası.' },
  { icon: 'fa-route', title: 'Otelden mesafeler (Atay)', text: 'Yürüme: El Corte Inglés 6 dk (400 m) · Boqueria 7 dk (500 m) · Picasso Müzesi 10 dk (700 m) · Zoo 20 dk (1,5 km). Uber: Arenas de Barcelona 19 dk · Sagrada Família 22 dk · Zoo 24 dk · Havalimanı 27 dk · Park Güell 28 dk · Camp Nou 30 dk.' }
];
