// Arayüz metinleri (tr / es) ve içeriğin İspanyolca çevirisi.
// PEOPLE içinde lang: 'es' olan kişi seçildiğinde tüm site İspanyolca görünür.
// Mekan adları ve kullanıcıların yazdıkları (sohbet, kendi önerileri) çevrilmez.

const UI = {
  tr: {
    'gate.title': 'Davet linki gerekli',
    'gate.msg': 'Bu planlayıcı sadece ekip içindir. WhatsApp grubundaki davet linkiyle aç.',
    'gate.denied': 'Bu davet linki geçersiz ya da erişim kapalı. Linki gruptan tekrar al.',
    'gate.offline': 'Veritabanına bağlanılamadı. Sayfayı yenile.',
    'header.invite': 'Davet linki',
    'header.inviteAria': 'Davet linkini kopyala',
    'count.before': '11–16 Kasım · {n} gün kaldı',
    'count.during': 'Gün {i} / {n} · iyi tatiller!',
    'count.after': '11–16 Kasım · tamamlandı',
    'conn.ok': 'Canlı bağlı',
    'conn.wait': 'Bağlantı bekleniyor (değişiklikler sonra gönderilir)',
    'nav.plan': 'Plan', 'nav.pool': 'Havuz', 'nav.decide': 'Kararlar', 'nav.chat': 'Sohbet',
    'pool.title': 'Mekan & Aktivite Havuzu',
    'pool.custom': 'Kendi önerin',
    'pool.search': 'Ara: tapas, Gaudí, dondurma…',
    'pool.hint': 'Kartı sürükleyip bir slota bırak ya da + ile ekle.',
    'pool.all': 'Tümü',
    'pool.teamIdea': 'Ekip önerisi',
    'pool.fits': 'Bu saate uygun',
    'pool.res': 'Rezervasyon',
    'pool.none': 'Sonuç yok',
    'pool.addAria': '{name} plana ekle',
    'link.web': 'Web sitesi',
    'link.map': 'Harita',
    'link.mapOpen': 'Haritada aç',
    'view.summary': 'Özet', 'view.day': 'Gün',
    'slot.now': 'Şimdi',
    'slot.addAria': '{slot} slotuna ekle',
    'slot.empty': 'Boş · + ile havuzdan ekle',
    'fixed.locked': 'Sabit',
    'item.confirmed': 'Kesin',
    'item.resNeeded': 'Rezervasyon / bilet gerekli',
    'item.like': 'Beğen', 'item.dislike': 'Beğenme',
    'sugg.label': 'Öneri', 'sugg.add': 'Ekle',
    'summary.empty': 'Henüz plan yok',
    'team.title': 'Ekip', 'team.joined': '{n}/{m} katıldı',
    'dec.votes': '{n}/{m} oy', 'dec.leading': 'Önde',
    'check.title': 'Hazırlık', 'check.linkTitle': 'Bilet / rezervasyon sayfası',
    'practical.title': 'Pratik bilgiler',
    'chat.title': 'Ekip sohbeti', 'chat.live': 'canlı',
    'chat.placeholder': 'Fikir, saat önerisi, link…', 'chat.send': 'Gönder',
    'chat.empty': 'İlk mesajı sen yaz 👋',
    'toast.saveFail': 'Kaydedilemedi: {e}', 'toast.dup': 'Bu slotta zaten var',
    'toast.added': 'Eklendi · {where}', 'toast.moved': 'Taşındı · {where}',
    'toast.moveFail': 'Taşınamadı: {e}', 'toast.delFail': 'Silinemedi: {e}',
    'toast.sendFail': 'Gönderilemedi: {e}', 'toast.poolAdded': 'Havuza eklendi',
    'toast.copied': 'Davet linki kopyalandı',
    'sheet.close': 'Kapat',
    'sheet.addTo': '{slot} slotuna ekle', 'sheet.search': 'Ara…',
    'sheet.notListed': 'Listede yok, kendi önerimi ekle',
    'sheet.move': 'Başka zamana taşı', 'sheet.whichSlot': 'Hangi gün ve saate eklensin?', 'sheet.fits': 'Uygun',
    'detail.votes': 'Oylar', 'detail.who': 'Kim gidiyor?',
    'detail.confirm': 'Kesinleştir', 'detail.unconfirm': 'Kesinleşmeyi geri al',
    'detail.move': 'Taşı', 'detail.remove': 'Kaldır', 'detail.addedBy': '{name} ekledi',
    'detail.removeAsk': '"{name}" plandan kaldırılsın mı?',
    'custom.title': 'Kendi önerini ekle', 'custom.subSlot': '{where} slotuna da eklenecek',
    'custom.subPool': 'Havuza eklenir, herkes görür',
    'custom.name': 'Ad *', 'custom.area': 'Semt', 'custom.cat': 'Kategori', 'custom.note': 'Not',
    'custom.namePh': 'Örn. Can Paixano', 'custom.areaPh': 'Örn. Barceloneta',
    'custom.notePh': 'Neden güzel, ne zaman gidilmeli?', 'custom.submit': 'Ekle',
    'me.title': 'Sen {name} misin?',
    'me.body': 'Bu cihazda <strong>{name}</strong> olarak oy vereceksin. Seçim <strong>sonradan değiştirilemez</strong>.',
    'me.cancel': 'Vazgeç', 'me.ok': 'Evet, benim',
    'invite.title': 'Davet linki', 'invite.sub': 'Sadece ekip ile paylaş',
    'invite.hint': 'Linki uzun basıp kopyalayabilirsin.'
  },
  es: {
    'gate.title': 'Se necesita el enlace de invitación',
    'gate.msg': 'Este planificador es solo para el grupo. Ábrelo con el enlace de invitación del grupo de WhatsApp.',
    'gate.denied': 'Este enlace no es válido o el acceso está cerrado. Pide el enlace de nuevo en el grupo.',
    'gate.offline': 'No se pudo conectar con la base de datos. Recarga la página.',
    'header.invite': 'Enlace de invitación',
    'header.inviteAria': 'Copiar el enlace de invitación',
    'count.before': '11–16 de noviembre · faltan {n} días',
    'count.during': 'Día {i} de {n} · ¡buen viaje!',
    'count.after': '11–16 de noviembre · terminado',
    'conn.ok': 'Conectado en vivo',
    'conn.wait': 'Esperando conexión (los cambios se enviarán después)',
    'nav.plan': 'Plan', 'nav.pool': 'Lugares', 'nav.decide': 'Decisiones', 'nav.chat': 'Chat',
    'pool.title': 'Lugares y actividades',
    'pool.custom': 'Tu propuesta',
    'pool.search': 'Buscar: tapas, Gaudí, helado…',
    'pool.hint': 'Arrastra una tarjeta a un bloque o añádela con +.',
    'pool.all': 'Todo',
    'pool.teamIdea': 'Propuesta del grupo',
    'pool.fits': 'Ideal para esta hora',
    'pool.res': 'Reserva',
    'pool.none': 'Sin resultados',
    'pool.addAria': 'Añadir {name} al plan',
    'link.web': 'Web',
    'link.map': 'Mapa',
    'link.mapOpen': 'Abrir en el mapa',
    'view.summary': 'Resumen', 'view.day': 'Día',
    'slot.now': 'Ahora',
    'slot.addAria': 'Añadir a {slot}',
    'slot.empty': 'Vacío · añade algo con +',
    'fixed.locked': 'Fijo',
    'item.confirmed': 'Confirmado',
    'item.resNeeded': 'Requiere reserva / entrada',
    'item.like': 'Me gusta', 'item.dislike': 'No me gusta',
    'sugg.label': 'Sugerencia', 'sugg.add': 'Añadir',
    'summary.empty': 'Aún no hay planes',
    'team.title': 'Grupo', 'team.joined': '{n}/{m} se han unido',
    'dec.votes': '{n}/{m} votos', 'dec.leading': 'En cabeza',
    'check.title': 'Preparativos', 'check.linkTitle': 'Página de entradas / reservas',
    'practical.title': 'Información práctica',
    'chat.title': 'Chat del grupo', 'chat.live': 'en vivo',
    'chat.placeholder': 'Idea, propuesta de hora, enlace…', 'chat.send': 'Enviar',
    'chat.empty': 'Escribe el primer mensaje 👋',
    'toast.saveFail': 'No se pudo guardar: {e}', 'toast.dup': 'Ya está en este bloque',
    'toast.added': 'Añadido · {where}', 'toast.moved': 'Movido · {where}',
    'toast.moveFail': 'No se pudo mover: {e}', 'toast.delFail': 'No se pudo borrar: {e}',
    'toast.sendFail': 'No se pudo enviar: {e}', 'toast.poolAdded': 'Añadido a la lista',
    'toast.copied': 'Enlace copiado',
    'sheet.close': 'Cerrar',
    'sheet.addTo': 'Añadir a: {slot}', 'sheet.search': 'Buscar…',
    'sheet.notListed': 'No está en la lista, añadir mi propuesta',
    'sheet.move': 'Mover a otro momento', 'sheet.whichSlot': '¿Qué día y a qué hora?', 'sheet.fits': 'Ideal',
    'detail.votes': 'Votos', 'detail.who': '¿Quién va?',
    'detail.confirm': 'Confirmar', 'detail.unconfirm': 'Quitar confirmación',
    'detail.move': 'Mover', 'detail.remove': 'Quitar', 'detail.addedBy': 'Añadido por {name}',
    'detail.removeAsk': '¿Quitar "{name}" del plan?',
    'custom.title': 'Añade tu propuesta', 'custom.subSlot': 'También se añadirá a {where}',
    'custom.subPool': 'Se añade a la lista y todos la verán',
    'custom.name': 'Nombre *', 'custom.area': 'Barrio', 'custom.cat': 'Categoría', 'custom.note': 'Nota',
    'custom.namePh': 'Ej. Can Paixano', 'custom.areaPh': 'Ej. Barceloneta',
    'custom.notePh': '¿Por qué vale la pena? ¿Cuándo ir?', 'custom.submit': 'Añadir',
    'me.title': '¿Eres {name}?',
    'me.body': 'En este dispositivo votarás como <strong>{name}</strong>. La elección <strong>no se puede cambiar</strong> después.',
    'me.cancel': 'Cancelar', 'me.ok': 'Sí, soy yo',
    'invite.title': 'Enlace de invitación', 'invite.sub': 'Compártelo solo con el grupo',
    'invite.hint': 'Mantén pulsado el enlace para copiarlo.'
  }
};

// İçeriğin İspanyolcası: data.js'teki sabitlerin üzerine yazılır (yalnızca lang 'es' iken).
const CONTENT_ES = {
  days: {
    day1: { short: 'Mié', title: 'Miércoles, 11 de noviembre', desc: 'Día de llegada · instalarse en el hotel y alrededores', closed: { morning: 'Vuelo y traslado' } },
    day2: { short: 'Jue', title: 'Jueves, 12 de noviembre', desc: 'Día para descubrir la ciudad · mercado, Boqueria y playa' },
    day3: { short: 'Vie', title: 'Viernes, 13 de noviembre', desc: 'Todo el grupo junto · cultura, parque y tapas gourmet' },
    day4: { short: 'Sáb', title: 'Sábado, 14 de noviembre', desc: 'Playa, compras y gran cena de grupo' },
    day5: { short: 'Dom', title: 'Domingo, 15 de noviembre', desc: 'Mañana de HYROX Doubles (Mertcan y Atay) · último día completo' },
    day6: { short: 'Lun', title: 'Lunes, 16 de noviembre', desc: 'Día de regreso', closed: { lunch_nap: 'Vuelo de vuelta', afternoon: 'Estambul 17:55', evening: 'En casa' } }
  },
  slots: {
    morning:   { label: 'Mañana',            hint: 'Desayuno, panadería, parque o arquitectura con el fresco' },
    lunch_nap: { label: 'Mediodía y siesta', hint: 'Demir duerme en el hotel · grupo B al parque / museo' },
    afternoon: { label: 'Tarde',             hint: 'Premio dulce al despertar, playa, Zoo' },
    evening:   { label: 'Noche',             hint: 'Mesas de tapas, Pizza Local o noche de adultos' }
  },
  categories: { food: 'Comida', coffee: 'Café y dulces', kids: 'Niños y familia', sight: 'Visitas', night: 'Noche', sport: 'Deporte' },
  groups: {
    A: { label: 'Grupo A', who: 'Mertcan, Elif, Demir (3)', note: 'Se levantan a las 7:00, siesta de 12:30 a 15:00 en el hotel, calma a partir de las 21:00.' },
    B: { label: 'Grupo B', who: 'Atay, Alev, Keremacar (7)', note: 'Sin siesta; ciencia, fútbol, parque y barcas.' }
  },
  pool: {
    canete:     { desc: 'Barra de tapas de alto nivel: marisco, brioche de steak tartar. Para una cena de grupo, reservar con mucha antelación.' },
    nacional:   { desc: 'Palacio gastronómico histórico; el sitio más amplio para que los 6 estemos cómodos con niños.' },
    boqueria:   { desc: 'A primera hora: zumos frescos, jamón y tapas de barra en Pinotxo / El Quim.' },
    pizzalocal: { desc: 'Pizza de masa madre, opción sin gluten. Solución rápida y sin estrés para Demir y Keremacar.' },
    malvon:     { area: 'Varias tiendas', desc: 'Empanadas argentinas calientes para comer andando; snack anti-crisis. El mapa muestra la tienda más cercana.' },
    fritas:     { desc: 'Patatas en cucurucho con doble fritura y muchas salsas. Sin mesas, para llevar; bancos con vistas al puerto enfrente.' },
    succulent:  { desc: 'Chef Antonio (Toni) Romero: cocina catalana moderna, tartar con tuétano. Cerrado el fin de semana; ideal jueves o viernes.' },
    pepita:     { desc: 'Bar de bocadillos gourmet y tapas de autor, informal y acogedor. Ideal para celebrar el HYROX.' },
    sartoria:   { desc: 'Entre las mejores del mundo en 50 Top Pizza; elegida la mejor pizzería de Europa fuera de Italia. Segundo local en el Eixample (Provença 330). Reserva en su web.' },
    positano:   { desc: 'Pizzería napolitana de tres napolitanos: masa fermentada 48 horas, horno de leña.' },
    madmad:     { desc: 'Hamburguesería 100% vegetal. Abierto todos los días desde las 12:30 hasta tarde.' },
    hofmann:    { desc: 'El famoso cruasán de mascarpone. Premio de la tarde cuando Demir se despierta.' },
    lapapa:     { area: 'Varias tiendas', desc: 'Cocina casera de día y café de especialidad; desayuno/brunch. Locales: Gran de Gràcia 127, Trafalgar 56, Aribau 92, Pau Claris 190. El mapa muestra el más cercano.' },
    brunchcake: { desc: 'Justo enfrente de la Sagrada Família, cadena de brunch famosa por sus platos espectaculares. Todos los días 09:00–16:30 (vie–dom 17:00). Ideal antes o después de la visita.' },
    faire:      { desc: 'Brunch vegetariano: pancakes, tostada de masa madre con aguacate, buen café. Acepta pocas reservas al día.' },
    nomad:      { desc: 'El mejor tostador de café de especialidad de la ciudad; shaked espresso.' },
    funky:      { desc: 'Babka, galletas de chocolate con sal y desayunos. (El "Eatery" con mesas está en el Eixample, Bailèn 61.)' },
    campana:    { desc: 'Maestros del turrón desde 1890. La temporada de helados termina en octubre; en noviembre, turrón y chocolate.' },
    zoo:        { desc: 'Sombra, terreno llano y apto para carrito. Comprar la entrada online acorta la cola.' },
    ciutadella: { name: 'Parc de la Ciutadella y el Mamut', desc: 'Barcas en el lago, césped abierto y el gran mamut de piedra. Abierto de 07:00 al anochecer.' },
    cosmocaixa: { name: 'CosmoCaixa, Museo de la Ciencia', desc: 'Bosque tropical interior y experimentos de agua para tocar. Perfecto para Keremacar.' },
    barceloneta: { name: 'Playa de la Barceloneta', desc: 'Paseo junto al mar y juegos en la arena; se puede combinar con Las Fritas.' },
    campnou:    { name: 'Tour del Camp Nou', desc: 'Museo del Barça y tour del estadio. Por las obras, comprueba antes qué zonas están abiertas.' },
    sagrada:    { desc: 'La obra maestra de Gaudí. Las entradas con torres se agotan semanas antes; reserva online imprescindible.' },
    guell:      { desc: 'Terraza de mosaico y vistas de la ciudad. Entrada con hora; muchas cuestas, difícil con carrito.' },
    drymartini: { desc: 'La mítica coctelería de Javier de las Muelas (noche de adultos).' },
    stravinsky: { desc: 'Coctelería alquimista que destila sus propios licores (World\'s 50 Best Bars).' },
    mariposa:   { desc: 'El bar de Luca Corradini, ex jefe del American Bar del Savoy; cócteles en vasos de cerámica e impresión 3D hechos a mano.' },
    gatsby:     { desc: 'Dinner-show con música en directo, baile y cabaret (noche sin niños).' },
    hyrox:      { desc: 'Domingo 15 de noviembre por la mañana, Men\'s Doubles: Mertcan y Atay. Las familias, en la grada o en Park Güell durante la carrera.' }
  },
  fixed: {
    day1: { morning: [
      { title: 'TK1853 IST → BCN (llegada 10:55)' },
      { title: 'Traslado del aeropuerto al hotel' },
      { title: 'Check-in en el hotel, dejar las maletas' } ] },
    day5: { morning: [ { time: 'Mañana', title: 'HYROX Men\'s Doubles · Mertcan y Atay · Fira Gran Via' } ] },
    day6: { morning: [
      { title: 'Desayuno + cruasanes para llevar de Hofmann' },
      { title: 'Salida del hotel' },
      { title: 'Aeropuerto: maletas, Tax-Free, pasaporte' },
      { title: 'TK1854 BCN → IST (llegada 17:55)' } ] }
  },
  decisions: {
    big_dinner: { title: 'Gran cena del sábado', desc: '¿Dónde estamos todos la noche del 14 de noviembre?', options: {
      nacional: { sub: '6 personas, cómodo con niños, sala amplia' },
      gatsby:   { sub: 'Dinner-show para adultos; hace falta canguro o turnos para los niños' },
      both:     { label: 'Las dos', sub: 'Primero El Nacional, luego los adultos a Gatsby / Dry Martini' } } }
  },
  notes: {
    'Demir uyurken Atay, Alev & Keremacar': 'Atay, Alev y Keremacar mientras Demir duerme',
    'Uyanış ödülü + El Born turu': 'Premio al despertar + paseo por El Born',
    'Yolculuk günü: hızlı ve stressiz': 'Día de viaje: rápido y sin estrés',
    'Cuma açık, hafta sonu kapalı': 'Abre el viernes, cerrado el fin de semana',
    'Kayık turu': 'Paseo en barca',
    'Yemek sonrası yetişkinler': 'Adultos, después de cenar',
    'Ekipçe büyük akşam': 'Gran cena de grupo',
    'Yetişkinler, çocuklar uyuduktan sonra': 'Adultos, cuando los niños duerman',
    'Aileler, yarış sürerken': 'Familias, mientras dura la carrera',
    'Madalya kutlaması / Gràcia': 'Celebración con medallas / Gràcia',
    'Son akşam sakin': 'Última noche tranquila'
  },
  checklistCats: { 'Bilet': 'Entradas', 'Rezervasyon': 'Reservas', 'HYROX': 'HYROX', 'Ulaşım': 'Transporte', 'Bavul': 'Maleta' },
  checklist: {
    sagrada: 'Entrada a la Sagrada Família con torres',
    guell: 'Entrada con hora al Park Güell',
    cosmo: 'Entrada a CosmoCaixa',
    zoo: 'Entrada online al Zoo',
    campnou: 'Tour del Camp Nou (comprobar qué está abierto)',
    canete: 'Reserva en Bar Cañete',
    nacional: 'Mesa para 6 en El Nacional',
    succulent: 'Reserva en Suculent (cerrado el fin de semana)',
    gatsby: 'Reserva del show de Gatsby',
    hyrox: 'Inscripción HYROX Doubles (Mertcan y Atay, domingo)',
    transfer1: '11 nov: traslado aeropuerto → hotel (taxi / Aerobús)',
    transfer2: '16 nov 09:30: traslado hotel → aeropuerto',
    tcasual: 'T-casual (10 viajes, 13 €) / tarjeta Hola BCN',
    stroller: 'Carrito + botiquín de los niños',
    rain: 'Chubasquero / chaqueta ligera (noviembre ~12–18 °C)'
  },
  practical: [
    { title: 'Tiempo', text: 'A mediados de noviembre, 15–18 °C de día y 10–12 °C por la noche. Algo de lluvia; mejor vestirse por capas.' },
    { title: 'La siesta de Demir', text: 'De 12:30 a 15:00 siesta en el hotel, intocable. Los planes se hacen cerca del hotel; el carrito se queda allí a mediodía y se recoge para los paseos de la tarde.' },
    { title: 'Estrategia del carrito', text: 'De día, paseos cortos sin carrito. Para paseos largos o cenas tardías viene el carrito; Demir puede dormirse en él hacia las 21:00.' },
    { title: 'Anti-crisis', text: 'Sin esperas: Pizza Local y Empanadas Malvón en puntos clave.' },
    { title: 'Transporte', text: 'Aeropuerto: taxi ~30–35 min o Aerobús (Plaça Catalunya). En la ciudad, metro + T-casual (10 viajes, 13 €); la T-casual no vale en las estaciones de metro del aeropuerto.' },
    { title: 'Emergencias', text: 'Número de emergencias europeo: 112. Farmacias: cruz verde.' }
  ]
};

// data.js sabitlerini İspanyolcaya çevirir (bir kez çağrılır)
function applySpanishContent() {
  const C = CONTENT_ES;
  DAYS.forEach(d => Object.assign(d, C.days[d.key]));
  SLOTS.forEach(s => Object.assign(s, C.slots[s.key]));
  CATEGORIES.forEach(c => { if (C.categories[c.key]) c.label = C.categories[c.key]; });
  Object.keys(GROUPS).forEach(g => Object.assign(GROUPS[g], C.groups[g]));
  POOL.forEach(a => Object.assign(a, C.pool[a.id] || {}));
  Object.entries(C.fixed).forEach(([day, slots]) => Object.entries(slots).forEach(([slot, list]) =>
    list.forEach((ev, i) => Object.assign(FIXED_EVENTS[day][slot][i], ev))));
  DECISIONS.forEach(dec => {
    const tr = C.decisions[dec.id];
    if (!tr) return;
    if (tr.title) dec.title = tr.title;
    if (tr.desc) dec.desc = tr.desc;
    dec.options.forEach(o => Object.assign(o, (tr.options || {})[o.id] || {}));
  });
  Object.values(SUGGESTED_PLAN).forEach(day => Object.values(day).forEach(list =>
    list.forEach(s => { if (s.note && C.notes[s.note]) s.note = C.notes[s.note]; })));
  CHECKLIST.forEach(c => {
    if (C.checklist[c.id]) c.text = C.checklist[c.id];
    if (C.checklistCats[c.cat]) c.cat = C.checklistCats[c.cat];
  });
  PRACTICAL.forEach((p, i) => Object.assign(p, C.practical[i] || {}));
}
