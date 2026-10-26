// Barselona 11–16 Kasım 2026 — sabit içerik (rehberden derlendi)
// Bu dosyayı düzenleyerek havuza mekan, önerilere slot veya checklist'e madde ekleyebilirsiniz.

const PEOPLE = [
  { id: 'mertcan', name: 'Mertcan', group: 'A', color: '#4f46e5' },
  { id: 'elif',    name: 'Elif',    group: 'A', color: '#db2777' },
  { id: 'atay',    name: 'Atay',    group: 'B', color: '#0891b2' },
  { id: 'alev',    name: 'Alev',    group: 'B', color: '#ea580c' },
  { id: 'cagatay', name: 'Çağatay', group: 'C', color: '#16a34a' },
  { id: 'maribel', name: 'Maribel', group: 'C', color: '#9333ea' }
];

const GROUPS = {
  A: { label: 'Grup A', who: 'Mertcan, Elif, Demir (3)', note: '07:00 kalkış, 12:30–15:00 otelde öğle uykusu, 21:00 sakinleşme.' },
  B: { label: 'Grup B', who: 'Atay, Alev, Keremacar (7)', note: 'Uyku yok; bilim, futbol, park, kano enerjisi.' },
  C: { label: 'Grup C', who: 'Çağatay, Maribel (Per–Paz)', note: 'Amsterdam çıkışlı; kokteyl barları, 3. nesil kahve, geç akşam yemeği.' }
};

const SLOTS = [
  { key: 'morning',   label: 'Sabah',       start: '08:30', end: '12:00', hint: 'Kahvaltı, fırın, serin saatte park veya mimari tur' },
  { key: 'lunch_nap', label: 'Öğle & Uyku', start: '12:30', end: '15:30', hint: 'Demir otelde uyuyor · B grubu park / müze', nap: true },
  { key: 'afternoon', label: 'İkindi',      start: '15:30', end: '19:30', hint: 'Uyanış ödülü tatlı, sahil, Zoo' },
  { key: 'evening',   label: 'Akşam',       start: '20:00', end: '23:30', hint: 'Tapas masaları, Pizza Local veya yetişkin gecesi' }
];

const DAYS = [
  { key: 'day1', date: '2026-11-11', short: 'Çar', num: 11, title: '11 Kasım Çarşamba',  desc: 'Varış günü · otele yerleşme ve yakın çevre', closed: { morning: 'Uçuş ve transfer' } },
  { key: 'day2', date: '2026-11-12', short: 'Per', num: 12, title: '12 Kasım Perşembe',  desc: 'Çağatay & Maribel geliyor · HYROX Relay seçilirse akşam yarış' },
  { key: 'day3', date: '2026-11-13', short: 'Cum', num: 13, title: '13 Kasım Cuma',      desc: 'Tüm ekip birlikte · kültür, park, gurme tapas' },
  { key: 'day4', date: '2026-11-14', short: 'Cmt', num: 14, title: '14 Kasım Cumartesi', desc: 'Sahil, alışveriş ve büyük akşam buluşması' },
  { key: 'day5', date: '2026-11-15', short: 'Paz', num: 15, title: '15 Kasım Pazar',     desc: 'HYROX Doubles seçilirse sabah yarış · Çağatay & Maribel dönüyor' },
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
const POOL = [
  { id: 'canete',     name: 'Bar Cañete',                 cat: 'food',   area: 'El Raval',          icon: 'fa-utensils',        res: true,  kid: false, best: ['evening'],               desc: 'Üst düzey tapas barı: deniz ürünleri, biftek tartarlı brioche. Kalabalık akşam için erken rezervasyon şart.' },
  { id: 'nacional',   name: 'El Nacional',                cat: 'food',   area: 'Passeig de Gràcia', icon: 'fa-wine-glass',      res: true,  kid: true,  best: ['evening', 'lunch_nap'],  desc: '8 kişilik grubun çocuklarla en ferah oturabileceği tarihi gastronomi sarayı.' },
  { id: 'boqueria',   name: 'Mercat de la Boqueria',      cat: 'food',   area: 'La Rambla',         icon: 'fa-basket-shopping', res: false, kid: true,  best: ['morning'],               desc: 'Sabah erken: taze meyve suları, jambon, Pinotxo / El Quim tezgah tapasları.' },
  { id: 'pizzalocal', name: 'Pizza Local',                cat: 'food',   area: 'El Born',           icon: 'fa-pizza-slice',     res: false, kid: true,  best: ['evening'],               desc: 'Demir ve Keremacar için hızlı, kaliteli ve stressiz akşam kurtarıcısı.' },
  { id: 'malvon',     name: 'Empanadas Malvón',           cat: 'food',   area: 'El Born',           icon: 'fa-cookie',          res: false, kid: true,  best: ['afternoon', 'evening'],  desc: 'Yürürken elde yenen sıcak Arjantin empanadaları; kriz önleyici atıştırmalık.' },
  { id: 'fritas',     name: 'Las Fritas',                 cat: 'food',   area: 'Barceloneta',       icon: 'fa-bowl-food',       res: false, kid: true,  best: ['afternoon'],             desc: 'Sahil yürüyüşünde çocukların eline verilecek soslu külah patates.' },
  { id: 'succulent',  name: 'Succulent',                  cat: 'food',   area: 'El Raval',          icon: 'fa-champagne-glasses', res: true, kid: false, best: ['evening'],               desc: 'Şef Toni Romero: modern Katalan güveçleri, dana yanağı, kemik ilikli tartar.' },
  { id: 'pepita',     name: 'La Pepita',                  cat: 'food',   area: 'Gràcia',            icon: 'fa-burger',          res: false, kid: true,  best: ['lunch_nap', 'evening'],  desc: 'Rahat, samimi gurme sandviç ve imza tapas barı. HYROX kutlaması için ideal.' },
  { id: 'hofmann',    name: 'Pastisseria Hofmann',        cat: 'coffee', area: 'El Born',           icon: 'fa-bread-slice',     res: false, kid: true,  best: ['afternoon', 'morning'],  desc: 'Meşhur mascarpone kremalı kruvasan. Demir uyanınca ikindi ödülü.' },
  { id: 'faire',      name: 'Faire. Brunch & Drinks',     cat: 'coffee', area: 'Eixample',          icon: 'fa-egg',             res: false, kid: true,  best: ['morning'],               desc: 'Geniş kahvaltı, pancake ve üçüncü nesil kahve.' },
  { id: 'nomad',      name: 'Nomad Coffee Lab',           cat: 'coffee', area: 'Passatge Sert',     icon: 'fa-mug-hot',         res: false, kid: false, best: ['morning', 'lunch_nap'],  desc: 'Şehrin en iyi özel çekirdek kavurucusu; shaked espresso.' },
  { id: 'funky',      name: 'Funky Bakers Eatery',        cat: 'coffee', area: 'El Born',           icon: 'fa-cookie-bite',     res: false, kid: true,  best: ['morning', 'afternoon'],  desc: 'Babka, tuzlu çikolatalı kurabiye ve kahvaltı.' },
  { id: 'campana',    name: 'La Campana',                 cat: 'coffee', area: 'El Born',           icon: 'fa-ice-cream',       res: false, kid: true,  best: ['afternoon'],             desc: '1890\'dan kalma turrón dondurmacısı; çocuklar için tatlı molası.' },
  { id: 'zoo',        name: 'Zoo de Barcelona',           cat: 'kids',   area: 'Parc de la Ciutadella', icon: 'fa-paw',         res: false, kid: true,  best: ['lunch_nap', 'afternoon', 'morning'], desc: 'Gölgelik, düz ayak, puset dostu. Bileti online almak sırayı kısaltır.' },
  { id: 'ciutadella', name: 'Ciutadella Parkı & Mamut',   cat: 'kids',   area: 'El Born',           icon: 'fa-tree',            res: false, kid: true,  best: ['lunch_nap', 'afternoon'], desc: 'Göl kenarında kayık, açık çimenler ve dev taş mamut heykeli.' },
  { id: 'cosmocaixa', name: 'CosmoCaixa Bilim Müzesi',    cat: 'kids',   area: 'Sant Gervasi',      icon: 'fa-flask',           res: true,  kid: true,  best: ['lunch_nap', 'morning'],  desc: 'Kapalı yağmur ormanı ve dokunmatik su deneyleri. Keremacar için birebir.' },
  { id: 'barceloneta', name: 'Barceloneta Sahili',        cat: 'kids',   area: 'Barceloneta',       icon: 'fa-umbrella-beach',  res: false, kid: true,  best: ['afternoon'],             desc: 'Deniz kenarı yürüyüşü, kumda oyun; Las Fritas ile birleştirilebilir.' },
  { id: 'campnou',    name: 'Camp Nou Turu',              cat: 'kids',   area: 'Les Corts',         icon: 'fa-futbol',          res: true,  kid: true,  best: ['lunch_nap', 'morning'],  desc: 'Barça müzesi ve stadyum turu. Tadilat nedeniyle açık bölümleri önceden kontrol edin.' },
  { id: 'sagrada',    name: 'La Sagrada Família',         cat: 'sight',  area: 'Eixample',          icon: 'fa-church',          res: true,  kid: true,  best: ['morning'],               desc: 'Gaudí başyapıtı. Kuleli bilet haftalar önce tükenir; online rezervasyon şart.' },
  { id: 'guell',      name: 'Park Güell',                 cat: 'sight',  area: 'Gràcia',            icon: 'fa-mountain-sun',    res: true,  kid: true,  best: ['morning'],               desc: 'Mozaik teras ve şehir manzarası. Saatli giriş bileti gerekir; yokuşlu, puset zor.' },
  { id: 'drymartini', name: 'Dry Martini',                cat: 'night',  area: 'Eixample',          icon: 'fa-martini-glass',   res: false, kid: false, best: ['evening'],               desc: 'Javier de las Muelas imzalı efsane kokteyl barı (yetişkin akşamı).' },
  { id: 'stravinsky', name: 'Dr. Stravinsky',             cat: 'night',  area: 'El Born',           icon: 'fa-flask-vial',      res: false, kid: false, best: ['evening'],               desc: 'Kendi likörlerini damıtan simya kokteyl barı (World\'s 50 Best Bars).' },
  { id: 'mariposa',   name: 'Mariposa Negra',             cat: 'night',  area: 'El Born',           icon: 'fa-wand-magic-sparkles', res: false, kid: false, best: ['evening'],           desc: '3D baskı gotik bardaklarda masalsı kokteyller.' },
  { id: 'gatsby',     name: 'Gatsby Barcelona',           cat: 'night',  area: 'Sant Gervasi',      icon: 'fa-masks-theater',   res: true,  kid: false, best: ['evening'],               desc: 'Canlı müzik, dans ve kabare gösterili dinner-show (çocuksuz gece).' },
  { id: 'hyrox',      name: 'HYROX Barcelona',            cat: 'sport',  area: 'Fira Gran Via',     icon: 'fa-dumbbell',        res: true,  kid: true,  best: ['evening', 'morning'],    desc: 'Perşembe Relay (4 kişi) veya Pazar Doubles (Mertcan & Atay). Aileler tribünde.' }
];

// Silinemeyen, takvime sabit olaylar
const FIXED_EVENTS = {
  day1: {
    morning: [
      { time: '09:10', title: 'TK1853 IST → BCN (varış 10:55)', icon: 'fa-plane-departure' },
      { time: '11:45', title: 'Havalimanından otele transfer', icon: 'fa-taxi' },
      { time: '12:15', title: 'Otele check-in, bavulları bırak', icon: 'fa-hotel' }
    ]
  },
  day2: {
    morning: [ { time: 'Gün içi', title: 'Çağatay & Maribel Amsterdam\'dan geliyor', icon: 'fa-plane-arrival' } ]
  },
  day5: {
    afternoon: [ { time: 'Akşamüstü', title: 'Çağatay & Maribel\'i Amsterdam\'a uğurlama', icon: 'fa-hand' } ]
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

// Seçenekli ortak kararlar. HYROX'un kazananı takvimdeki HYROX kartını belirler.
const DECISIONS = [
  {
    id: 'hyrox', title: 'HYROX formatı', icon: 'fa-dumbbell',
    desc: 'Fira Gran Via. Hangi senaryo takvime girsin?',
    options: [
      { id: 'relay',   label: 'Perşembe Relay',  sub: '12 Kas akşam · Mertcan, Atay, Çağatay + 4. kişi · çıkışta 8 kişilik tapas kutlaması' },
      { id: 'doubles', label: 'Pazar Doubles',   sub: '15 Kas sabah · Mertcan & Atay · aileler Park Güell / sahil, öğlen La Pepita kutlaması' }
    ]
  },
  {
    id: 'big_dinner', title: 'Cumartesi büyük akşam', icon: 'fa-champagne-glasses',
    desc: '14 Kasım akşamı tüm ekip nerede?',
    options: [
      { id: 'nacional', label: 'El Nacional',  sub: '8 kişi, çocuklarla rahat, ferah salon' },
      { id: 'gatsby',   label: 'Gatsby',       sub: 'Yetişkin dinner-show; çocuklar için bakıcı/nöbet gerekir' },
      { id: 'both',     label: 'İkisi de',     sub: 'Erken El Nacional, sonra yetişkinler Gatsby / Dry Martini' }
    ]
  }
];

const HYROX_EVENT = {
  relay:   { day: 'day2', slot: 'evening', time: 'Akşam', title: 'HYROX Men\'s Relay · Fira Gran Via', icon: 'fa-dumbbell' },
  doubles: { day: 'day5', slot: 'morning', time: 'Sabah', title: 'HYROX Men\'s Doubles · Fira Gran Via', icon: 'fa-dumbbell' }
};

// Önerilen plan: kabul edilene kadar kesik çizgili "öneri" kartı olarak görünür.
// when: sadece HYROX kararı bu yönde ise göster · who: hangi grup için
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
    evening:   [ { id: 'succulent', when: 'relay', note: 'Yarış sonrası 8 kişilik kutlama' }, { id: 'canete', when: '!relay' } ]
  },
  day3: {
    morning:   [ { id: 'sagrada' } ],
    lunch_nap: [ { id: 'zoo', who: 'B' } ],
    afternoon: [ { id: 'ciutadella', note: 'Kayık turu' }, { id: 'campana' } ],
    evening:   [ { id: 'canete', when: 'relay' }, { id: 'stravinsky', who: 'C', note: 'Yemek sonrası yetişkinler' } ]
  },
  day4: {
    morning:   [ { id: 'faire' }, { id: 'nomad', who: 'C' } ],
    lunch_nap: [ { id: 'campnou', who: 'B' } ],
    afternoon: [ { id: 'zoo' } ],
    evening:   [ { id: 'nacional', note: '8 kişi büyük akşam' }, { id: 'gatsby', note: 'Yetişkinler, çocuklar uyuduktan sonra' } ]
  },
  day5: {
    morning:   [ { id: 'guell', when: 'doubles', note: 'Aileler, yarış sürerken' }, { id: 'funky', when: '!doubles' } ],
    lunch_nap: [ { id: 'pepita', note: 'Madalya kutlaması / Gràcia' } ],
    afternoon: [ { id: 'funky', when: 'doubles' }, { id: 'barceloneta', when: '!doubles' } ],
    evening:   [ { id: 'malvon' }, { id: 'pizzalocal', note: 'Son akşam sakin' } ]
  }
};

const CHECKLIST = [
  { id: 'sagrada',   text: 'Sagrada Família kuleli bilet', cat: 'Bilet' },
  { id: 'guell',     text: 'Park Güell saatli bilet', cat: 'Bilet' },
  { id: 'cosmo',     text: 'CosmoCaixa bileti', cat: 'Bilet' },
  { id: 'zoo',       text: 'Zoo online bilet', cat: 'Bilet' },
  { id: 'campnou',   text: 'Camp Nou turu (açık mı kontrol)', cat: 'Bilet' },
  { id: 'canete',    text: 'Bar Cañete rezervasyonu', cat: 'Rezervasyon' },
  { id: 'nacional',  text: 'El Nacional 8 kişilik masa', cat: 'Rezervasyon' },
  { id: 'succulent', text: 'Succulent rezervasyonu', cat: 'Rezervasyon' },
  { id: 'gatsby',    text: 'Gatsby show rezervasyonu', cat: 'Rezervasyon' },
  { id: 'hyrox',     text: 'HYROX kaydı (+ Relay ise 4. kişi)', cat: 'HYROX' },
  { id: 'transfer1', text: '11 Kas havalimanı → otel transferi', cat: 'Ulaşım' },
  { id: 'transfer2', text: '16 Kas 09:30 otel → havalimanı transferi', cat: 'Ulaşım' },
  { id: 'tcasual',   text: 'T-Casual / Hola BCN ulaşım kartları', cat: 'Ulaşım' },
  { id: 'stroller',  text: 'Puset + çocuk ilaç çantası', cat: 'Bavul' },
  { id: 'rain',      text: 'Yağmurluk / ince mont (Kasım ~12–18°C)', cat: 'Bavul' }
];

const PRACTICAL = [
  { icon: 'fa-cloud-sun-rain', title: 'Hava', text: 'Kasım ortası gündüz 15–18°C, akşam 10–12°C. Ara ara yağmur; katmanlı giyin.' },
  { icon: 'fa-bed', title: 'Demir uyku kuralı', text: '12:30–15:00 otelde uyku dokunulmaz. Planlar otele yakın kurgulanır; puset öğlen otelde kalır, akşam yürüyüşleri için alınır.' },
  { icon: 'fa-baby-carriage', title: 'Puset stratejisi', text: 'Gündüz kısa pusetsiz keşif. Akşam uzun yürüyüş veya geç yemekte puset gelir; Demir 21:00 civarı pusette uyuyabilir.' },
  { icon: 'fa-burger', title: 'Kriz önleyici', text: 'Bekleme yok: Pizza Local ve Empanadas Malvón kilit noktalarda.' },
  { icon: 'fa-bus', title: 'Ulaşım', text: 'Havalimanı: taksi ~30–35 dk. Şehir içi metro + T-Casual (10 biniş). Aerobús Plaça Catalunya\'ya iner.' },
  { icon: 'fa-phone', title: 'Acil', text: 'Avrupa acil hattı 112. Eczane: yeşil haç tabelası.' }
];
