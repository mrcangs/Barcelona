// Barselona 2026 — ortak planlayıcı
// Veri: Firebase Realtime Database, trips/<davet-anahtarı>/… altında.
(function () {
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyDvo9yY87I9we7VFMAbqUjOIRDoNMQ-t7s",
    authDomain: "barcelona-11-16nov.firebaseapp.com",
    databaseURL: "https://barcelona-11-16nov-default-rtdb.firebaseio.com",
    projectId: "barcelona-11-16nov",
    storageBucket: "barcelona-11-16nov.firebasestorage.app",
    messagingSenderId: "861658477337",
    appId: "1:861658477337:web:c9e22583ea126477964b88"
  };

  const LS_TRIP = 'barca_trip';
  const LS_USER = 'barca_user_v2';
  const LS_CHAT_SEEN = 'barca_chat_seen';
  const LS_VIEW = 'barca_view';

  // ---------- yardımcılar ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC_MAP[c]);
  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
  const person = id => PEOPLE.find(p => p.id === id);
  const dayOf = key => DAYS.find(d => d.key === key);
  const slotOf = key => SLOTS.find(s => s.key === key);
  const catOf = key => CATEGORIES.find(c => c.key === key);
  const toMin = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const pad = n => String(n).padStart(2, '0');
  const localDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const mapsUrl = (name, where) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${name}, ${where || ''}, Barcelona`);
  const mapsFor = a => mapsUrl(a.name, a.addr || a.area);

  // ---------- dil ----------
  // Varsayılan Türkçe; lang: 'es' olan kişi seçilince arayüz + içerik İspanyolcaya geçer.
  let LANG = 'tr';
  const TL = (lang, k, vars) => {
    let s = (UI[lang] && UI[lang][k]) || UI.tr[k] || k;
    if (vars) Object.keys(vars).forEach(n => { s = s.split('{' + n + '}').join(vars[n]); });
    return s;
  };
  const T = (k, vars) => TL(LANG, k, vars);
  const locale = () => (LANG === 'es' ? 'es-ES' : 'tr-TR');

  function applyStaticText() {
    $$('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach(el => { el.placeholder = T(el.dataset.i18nPh); });
    $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', T(el.dataset.i18nAria)); });
  }

  function setLang(lang) {
    if (lang === LANG) return;
    LANG = lang;
    if (lang === 'es') applySpanishContent();
    document.documentElement.lang = lang;
    applyStaticText();
  }

  // Kart içindeki web sitesi / harita kısayolları
  function linkButtons(a) {
    const cls = 'h-8 px-2.5 rounded-lg btn-ghost inline-flex items-center gap-1.5 text-xs font-bold';
    const web = a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener" class="${cls}" aria-label="${esc(a.name)} · ${esc(T('link.web'))}"><i class="fa-solid fa-globe accent" aria-hidden="true"></i>${esc(T('link.web'))}</a>` : '';
    const map = `<a href="${esc(mapsFor(a))}" target="_blank" rel="noopener" class="${cls}" aria-label="${esc(a.name)} · Google Maps"><i class="fa-solid fa-location-dot terra" aria-hidden="true"></i>${esc(T('link.map'))}</a>`;
    const ig = a.ig ? `<a href="https://www.instagram.com/${encodeURIComponent(a.ig)}/" target="_blank" rel="noopener" class="${cls}" aria-label="${esc(a.name)} · Instagram"><i class="fa-brands fa-instagram" style="color:#d62976" aria-hidden="true"></i>Instagram</a>` : '';
    return `<div class="flex flex-wrap gap-1.5 mt-2">${web}${ig}${map}</div>`;
  }

  function avatar(id, size = 'w-7 h-7 text-[11px]') {
    const p = person(id);
    if (!p) return '';
    return `<span class="${size} shrink-0 rounded-full inline-flex items-center justify-center font-extrabold text-white" style="background:${p.color}" title="${esc(p.name)}">${esc(p.name[0])}</span>`;
  }

  // ---------- durum ----------
  const state = {
    key: null,
    me: null,
    day: 'day1',
    tab: 'plan',
    view: LS.get(LS_VIEW) === 'summary' ? 'summary' : 'day',
    poolCat: 'all',
    poolQuery: '',
    data: {},
    loaded: false,
    sheet: null
  };

  let db = null;
  let tripRef = null;

  // ---------- veri erişimi ----------
  const D = () => state.data || {};
  const slotItems = (day, slot) => ((D().slots || {})[day] || {})[slot] || {};
  const customActs = () => D().custom_activities || {};

  function activity(id) {
    if (!id) return null;
    if (id.startsWith('custom:')) {
      const c = customActs()[id.slice(7)];
      return c ? { id, name: c.name, area: c.area || '', cat: c.cat || 'custom', desc: c.desc || '', icon: 'fa-star', res: false, kid: false, best: [], custom: true, addedBy: c.addedBy } : null;
    }
    return POOL.find(a => a.id === id) || null;
  }

  // Havuz mekanlarında güncel (dile göre) ad/semt; kendi önerilerde kayıttaki değer
  const itemName = item => { const a = activity(item.activityId); return a && !a.custom ? a.name : item.name; };
  const itemArea = item => { const a = activity(item.activityId); return a && !a.custom ? a.area : item.area; };

  function allActivities() {
    const custom = Object.keys(customActs()).map(k => activity('custom:' + k)).filter(Boolean);
    return POOL.concat(custom);
  }

  function voteTally(itemKey) {
    const v = (D().slot_votes || {})[itemKey] || {};
    const up = [], down = [];
    Object.entries(v).forEach(([u, val]) => { if (val === 'up') up.push(u); else if (val === 'down') down.push(u); });
    return { up, down, mine: v[state.me] || null, score: up.length - down.length };
  }

  function decisionTally(decId) {
    const v = (D().decisions || {})[decId] || {};
    const counts = {};
    Object.entries(v).forEach(([u, opt]) => { (counts[opt] = counts[opt] || []).push(u); });
    const dec = DECISIONS.find(d => d.id === decId);
    let winner = null, best = 0, tie = false;
    dec.options.forEach(o => {
      const n = (counts[o.id] || []).length;
      if (n > best) { best = n; winner = o.id; tie = false; } else if (n === best && n > 0) tie = true;
    });
    return { counts, mine: v[state.me] || null, winner: tie ? null : winner, total: Object.keys(v).length };
  }


  // ---------- zaman ----------
  function todayKey() {
    const t = localDate(new Date());
    const d = DAYS.find(x => x.date === t);
    return d ? d.key : null;
  }

  function slotStatus(dayKey, slot) {
    const t = localDate(new Date());
    const d = dayOf(dayKey);
    if (d.date < t) return 'past';
    if (d.date > t) return 'future';
    const now = new Date().getHours() * 60 + new Date().getMinutes();
    if (now >= toMin(slot.end)) return 'past';
    if (now >= toMin(slot.start)) return 'now';
    return 'future';
  }

  function countdownText() {
    const start = new Date(DAYS[0].date + 'T00:00:00');
    const end = new Date(DAYS[DAYS.length - 1].date + 'T23:59:59');
    const now = new Date();
    if (now < start) {
      return T('count.before', { n: Math.ceil((start - now) / 86400000) });
    }
    if (now <= end) {
      const idx = DAYS.findIndex(d => d.key === todayKey());
      return T('count.during', { i: idx + 1, n: DAYS.length });
    }
    return T('count.after');
  }

  const whereText = (day, slot) => `${dayOf(day).short} ${dayOf(day).num} ${slotOf(slot).label}`;

  // ---------- yazma işlemleri ----------
  function write(path, value) {
    if (!tripRef) return Promise.reject(new Error('offline'));
    return tripRef.child(path).set(value).catch(err => { toast(T('toast.saveFail', { e: err.code })); throw err; });
  }

  function addToSlot(actId, day, slot) {
    const act = activity(actId);
    if (!act) return;
    const exists = Object.values(slotItems(day, slot)).some(i => i.activityId === actId);
    if (exists) { toast(T('toast.dup')); return; }
    const ref = tripRef.child(`slots/${day}/${slot}`).push();
    ref.set({
      activityId: act.id,
      name: act.name,
      cat: act.cat,
      area: act.area || '',
      addedBy: state.me,
      addedAt: firebase.database.ServerValue.TIMESTAMP
    }).then(() => toast(T('toast.added', { where: whereText(day, slot) })))
      .catch(err => toast(T('toast.saveFail', { e: err.code })));
  }

  function moveItem(day, slot, key, toDay, toSlot) {
    if (day === toDay && slot === toSlot) return;
    const item = slotItems(day, slot)[key];
    if (!item) return;
    tripRef.update({
      [`slots/${toDay}/${toSlot}/${key}`]: item,
      [`slots/${day}/${slot}/${key}`]: null
    }).then(() => toast(T('toast.moved', { where: whereText(toDay, toSlot) })))
      .catch(err => toast(T('toast.moveFail', { e: err.code })));
  }

  function removeItem(day, slot, key) {
    tripRef.update({ [`slots/${day}/${slot}/${key}`]: null, [`slot_votes/${key}`]: null })
      .catch(err => toast(T('toast.delFail', { e: err.code })));
  }

  function vote(itemKey, v) {
    const cur = voteTally(itemKey).mine;
    write(`slot_votes/${itemKey}/${state.me}`, cur === v ? null : v);
  }

  function decide(decId, optId) {
    const cur = decisionTally(decId).mine;
    write(`decisions/${decId}/${state.me}`, cur === optId ? null : optId);
  }

  // ---------- RENDER: kimlik ----------
  function renderWhoami() {
    const members = D().members || {};
    $('#whoamiGrid').innerHTML = PEOPLE.map(p => `
      <button data-action="pick-me" data-id="${p.id}" class="surface rounded-2xl p-4 text-left flex items-center gap-3 hover:ring-accent transition min-h-[72px]">
        ${avatar(p.id, 'w-11 h-11 text-base')}
        <span class="min-w-0">
          <span class="block font-extrabold">${esc(p.name)}</span>
          <span class="block text-[11px] muted">${esc(GROUPS[p.group].label)}${members[p.id] ? ' · <span class="ok font-bold">✓</span>' : ''}</span>
        </span>
      </button>`).join('');
  }

  // ---------- RENDER: üst bar ----------
  function renderHeader() {
    $('#countdown').textContent = countdownText();
    const p = person(state.me);
    $('#meBadge').innerHTML = p ? `${avatar(p.id, 'w-9 h-9 text-sm')}<span class="hidden md:inline text-sm font-bold">${esc(p.name)}</span>` : '';
  }

  function renderTabs() {
    $$('[data-panel]').forEach(el => el.classList.toggle('hidden', el.dataset.panel !== state.tab));
    $$('.nav-btn').forEach(b => {
      const on = b.dataset.tab === state.tab;
      b.classList.toggle('accent', on);
      b.classList.toggle('muted', !on);
    });
  }

  // ---------- RENDER: gün çipleri ----------
  function renderDayChips() {
    const today = todayKey();
    $('#dayChips').innerHTML = DAYS.map(d => {
      const on = state.view === 'day' && d.key === state.day;
      const count = SLOTS.reduce((n, s) => n + Object.keys(slotItems(d.key, s.key)).length, 0);
      return `<button data-action="day" data-day="${d.key}" class="shrink-0 w-[52px] h-11 rounded-xl flex flex-col items-center justify-center leading-none transition ${on ? 'btn-accent shadow' : 'surface'}">
        <span class="text-[10px] font-bold ${on ? '' : 'muted'}">${d.short}${d.key === today ? ' •' : ''}</span>
        <span class="text-base font-extrabold">${d.num}</span>
        ${count ? `<span class="sr-only">${count} plan</span>` : ''}
      </button>`;
    }).join('');
    $('#viewToggle').innerHTML = state.view === 'day'
      ? `<i class="fa-solid fa-list" aria-hidden="true"></i><span class="ml-1.5">${esc(T('view.summary'))}</span>`
      : `<i class="fa-solid fa-calendar-day" aria-hidden="true"></i><span class="ml-1.5">${esc(T('view.day'))}</span>`;
  }

  // ---------- RENDER: zaman çizelgesi ----------
  const fixedEventsFor = (day, slot) => (FIXED_EVENTS[day] || {})[slot] || [];

  function fixedCard(ev) {
    return `<div class="flex items-center gap-3 rounded-xl px-3 py-2.5 surface2">
      <i class="fa-solid ${ev.icon} w-4 text-center accent" aria-hidden="true"></i>
      <span class="text-[11px] font-bold muted w-14 shrink-0">${esc(ev.time)}</span>
      <span class="text-sm font-semibold">${esc(ev.title)}</span>
      <i class="fa-solid fa-lock text-[10px] muted ml-auto" aria-label="${esc(T('fixed.locked'))}"></i>
    </div>`;
  }

  function groupChips(groups) {
    const on = Object.keys(groups || {}).filter(g => groups[g]);
    return on.map(g => `<span class="tag surface2 muted">${g}</span>`).join('');
  }

  function itemCard(day, slot, rawKey, item) {
    const act = activity(item.activityId) || {};
    const t = voteTally(rawKey);
    const key = esc(rawKey);
    const cat = item.cat || act.cat || 'custom';
    const by = person(item.addedBy);
    const area = itemArea(item);
    return `<article data-action="detail" data-day="${day}" data-slot="${slot}" data-key="${key}" draggable="true" data-drag-item="1"
      class="surface rounded-xl p-3 cursor-pointer hover:shadow-md transition ${item.confirmed ? 'ring-accent' : ''}">
      <div class="flex items-start gap-3">
        <span class="tag-${esc(cat)} w-9 h-9 shrink-0 rounded-xl flex items-center justify-center"><i class="fa-solid ${act.icon || 'fa-star'}" aria-hidden="true"></i></span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <h4 class="text-sm font-extrabold leading-snug">${esc(itemName(item))}</h4>
            ${item.confirmed ? `<span class="tag btn-accent"><i class="fa-solid fa-check" aria-hidden="true"></i> ${esc(T('item.confirmed'))}</span>` : ''}
            ${act.res ? `<span class="tag tag-res" title="${esc(T('item.resNeeded'))}"><i class="fa-solid fa-ticket" aria-hidden="true"></i></span>` : ''}
          </div>
          <div class="flex items-center gap-1.5 mt-1 flex-wrap text-[11px] muted">
            ${area ? `<span>${esc(area)}</span>` : ''}
            ${groupChips(item.groups)}
            ${by ? `<span class="inline-flex items-center gap-1">· <span class="w-3.5 h-3.5 rounded-full inline-block" style="background:${by.color}"></span>${esc(by.name)}</span>` : ''}
          </div>
        </div>
        <div class="flex items-center gap-0.5 shrink-0">
          <button data-action="vote" data-key="${key}" data-v="up" class="h-9 min-w-[40px] px-2 rounded-lg text-xs font-bold ${t.mine === 'up' ? 'ok btn-ghost' : 'muted'}" aria-label="${esc(T('item.like'))}"><i class="fa-solid fa-thumbs-up" aria-hidden="true"></i> ${t.up.length}</button>
          <button data-action="vote" data-key="${key}" data-v="down" class="h-9 min-w-[40px] px-2 rounded-lg text-xs font-bold ${t.mine === 'down' ? 'bad btn-ghost' : 'muted'}" aria-label="${esc(T('item.dislike'))}"><i class="fa-solid fa-thumbs-down" aria-hidden="true"></i> ${t.down.length}</button>
        </div>
      </div>
    </article>`;
  }

  function suggestionCard(day, slot, s) {
    const act = activity(s.id);
    if (!act) return '';
    const who = s.who ? `${GROUPS[s.who].label} · ` : '';
    return `<div class="dashed rounded-xl p-3 flex items-center gap-3">
      <span class="tag-${act.cat} w-9 h-9 shrink-0 rounded-xl flex items-center justify-center opacity-70"><i class="fa-solid ${act.icon}" aria-hidden="true"></i></span>
      <div class="min-w-0 flex-1">
        <div class="text-[10px] font-bold uppercase tracking-wide terra">${esc(T('sugg.label'))}</div>
        <div class="text-sm font-bold leading-snug">${esc(act.name)}</div>
        <div class="text-[11px] muted">${esc(who)}${esc(s.note || act.area)}</div>
      </div>
      <button data-action="accept" data-act="${act.id}" data-day="${day}" data-slot="${slot}" class="h-9 px-3 rounded-lg btn-soft text-xs font-bold shrink-0">${esc(T('sugg.add'))}</button>
    </div>`;
  }

  function renderTimeline() {
    const d = dayOf(state.day);
    const closed = d.closed || {};
    let html = `<div class="mb-1">
      <h2 class="text-xl font-extrabold">${esc(d.title)}</h2>
      <p class="text-sm muted">${esc(d.desc)}</p>
    </div><div class="space-y-3">`;

    SLOTS.forEach(slot => {
      const status = slotStatus(d.key, slot);
      const items = Object.entries(slotItems(d.key, slot.key))
        .sort((a, b) => (b[1].confirmed ? 1 : 0) - (a[1].confirmed ? 1 : 0) || voteTally(b[0]).score - voteTally(a[0]).score || (a[1].addedAt || 0) - (b[1].addedAt || 0));
      const fixed = fixedEventsFor(d.key, slot.key);
      const takenIds = new Set(items.map(([, it]) => it.activityId));
      const sugg = (((SUGGESTED_PLAN[d.key] || {})[slot.key]) || []).filter(s => !takenIds.has(s.id));
      const isClosed = !!closed[slot.key];

      html += `<section class="grid grid-cols-[44px_1fr] gap-2.5 ${status === 'past' ? 'past' : ''}">
        <div class="pt-3 text-right">
          <div class="text-xs font-extrabold">${slot.start}</div>
          <div class="text-[10px] muted">${slot.end}</div>
        </div>
        <div data-drop="${slot.key}" class="rounded-2xl p-3 border transition ${slot.nap ? 'nap' : 'surface'} ${status === 'now' ? 'ring-accent' : ''}">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="min-w-0">
              <h3 class="text-sm font-extrabold flex items-center gap-2 ${slot.nap ? 'nap-ink' : ''}">
                ${slot.nap ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>' : ''}${esc(slot.label)}
                ${status === 'now' ? `<span class="tag btn-accent">${esc(T('slot.now'))}</span>` : ''}
              </h3>
              <p class="text-[11px] ${slot.nap ? 'nap-ink opacity-80' : 'muted'} truncate">${esc(isClosed ? closed[slot.key] : slot.hint)}</p>
            </div>
            ${isClosed ? '' : `<button data-action="pick-activity" data-slot="${slot.key}" class="shrink-0 w-10 h-10 rounded-xl btn-soft" aria-label="${esc(T('slot.addAria', { slot: slot.label }))}"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>`}
          </div>
          <div class="space-y-2">
            ${fixed.map(fixedCard).join('')}
            ${items.map(([k, it]) => itemCard(d.key, slot.key, k, it)).join('')}
            ${isClosed ? '' : sugg.map(s => suggestionCard(d.key, slot.key, s)).join('')}
            ${!fixed.length && !items.length && (isClosed || !sugg.length) ? `<p class="text-xs muted text-center py-3">${isClosed ? esc(closed[slot.key]) : esc(T('slot.empty'))}</p>` : ''}
          </div>
        </div>
      </section>`;
    });
    html += '</div>';
    $('#planBody').innerHTML = html;
  }

  function renderSummary() {
    const today = todayKey();
    $('#planBody').innerHTML = `<div class="space-y-3">${DAYS.map(d => {
      const rows = SLOTS.map(slot => {
        const fixed = fixedEventsFor(d.key, slot.key).map(e => `<span class="muted">${esc(e.title)}</span>`);
        const items = Object.values(slotItems(d.key, slot.key))
          .sort((a, b) => (b.confirmed ? 1 : 0) - (a.confirmed ? 1 : 0))
          .map(i => i.confirmed ? `<strong>${esc(itemName(i))} ✓</strong>` : esc(itemName(i)));
        const all = fixed.concat(items);
        if (!all.length) return '';
        return `<div class="flex gap-3 text-sm py-1"><span class="w-20 shrink-0 text-[11px] font-bold muted pt-0.5">${esc(slot.label)}</span><span class="min-w-0">${all.join(' · ')}</span></div>`;
      }).join('');
      return `<button data-action="open-day" data-day="${d.key}" class="surface rounded-2xl p-4 w-full text-left block hover:shadow-md transition ${d.key === today ? 'ring-accent' : ''}">
        <div class="flex items-center justify-between mb-1">
          <h3 class="font-extrabold">${esc(d.title)}</h3>
          <i class="fa-solid fa-chevron-right text-xs muted" aria-hidden="true"></i>
        </div>
        <p class="text-[11px] muted mb-2">${esc(d.desc)}</p>
        ${rows || `<p class="text-xs muted">${esc(T('summary.empty'))}</p>`}
      </button>`;
    }).join('')}</div>`;
  }

  function renderPlan() {
    renderDayChips();
    if (state.view === 'summary') renderSummary(); else renderTimeline();
  }

  // ---------- RENDER: havuz ----------
  function filteredActivities(targetSlot) {
    const q = state.poolQuery.trim().toLocaleLowerCase(LANG);
    let list = allActivities().filter(a =>
      (state.poolCat === 'all' || a.cat === state.poolCat) &&
      (!q || `${a.name} ${a.area} ${a.desc}`.toLocaleLowerCase(LANG).includes(q)));
    if (targetSlot) list = list.slice().sort((a, b) => (b.best.includes(targetSlot) ? 1 : 0) - (a.best.includes(targetSlot) ? 1 : 0));
    return list;
  }

  function catChipsHtml() {
    const chips = [{ key: 'all', label: T('pool.all'), icon: 'fa-border-all' }].concat(CATEGORIES);
    return chips.map(c => `<button data-action="pool-cat" data-cat="${c.key}" class="shrink-0 h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 ${state.poolCat === c.key ? 'btn-accent' : 'surface'}"><i class="fa-solid ${c.icon}" aria-hidden="true"></i>${esc(c.label)}</button>`).join('');
  }

  function poolCard(a, targetSlot) {
    const catLabel = (catOf(a.cat) || { label: T('pool.teamIdea') }).label;
    const fits = targetSlot && a.best.includes(targetSlot);
    return `<div ${targetSlot ? `data-action="add-here" data-act="${esc(a.id)}"` : `draggable="true" data-drag-act="${esc(a.id)}"`}
      class="surface rounded-xl p-3 flex gap-3 ${targetSlot ? 'cursor-pointer hover:shadow-md' : 'lg:cursor-grab'} transition">
      <span class="tag-${esc(a.cat)} w-9 h-9 shrink-0 rounded-xl flex items-center justify-center"><i class="fa-solid ${a.icon}" aria-hidden="true"></i></span>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5 flex-wrap">
          <h4 class="text-sm font-extrabold leading-snug">${esc(a.name)}</h4>
          ${fits ? `<span class="tag btn-soft">${esc(T('pool.fits'))}</span>` : ''}
        </div>
        <div class="flex items-center gap-1.5 flex-wrap mt-0.5">
          <span class="tag tag-${esc(a.cat)}">${esc(catLabel)}</span>
          ${a.res ? `<span class="tag tag-res"><i class="fa-solid fa-ticket" aria-hidden="true"></i> ${esc(T('pool.res'))}</span>` : ''}
          ${a.kid ? '<span class="tag surface2 muted"><i class="fa-solid fa-child" aria-hidden="true"></i></span>' : ''}
          ${a.area ? `<span class="text-[11px] muted">${esc(a.area)}</span>` : ''}
        </div>
        <p class="text-xs muted mt-1 leading-snug">${esc(a.desc)}</p>
        ${linkButtons(a)}
      </div>
      ${targetSlot ? '<span class="self-start w-9 h-9 shrink-0 rounded-lg btn-soft inline-flex items-center justify-center"><i class="fa-solid fa-plus" aria-hidden="true"></i></span>'
        : `<button data-action="pick-slot" data-act="${esc(a.id)}" class="self-start w-9 h-9 shrink-0 rounded-lg btn-soft" aria-label="${esc(T('pool.addAria', { name: a.name }))}"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>`}
    </div>`;
  }

  function renderPool() {
    $('#poolCats').innerHTML = catChipsHtml();
    const list = filteredActivities(null);
    $('#poolList').innerHTML = list.length ? list.map(a => poolCard(a, null)).join('') : `<p class="text-sm muted text-center py-6">${esc(T('pool.none'))}</p>`;
  }

  // ---------- RENDER: kararlar, ekip, checklist ----------
  function renderTeam() {
    const members = D().members || {};
    const joined = PEOPLE.filter(p => members[p.id]).length;
    $('#teamCard').innerHTML = `<div class="surface rounded-2xl p-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-extrabold">${esc(T('team.title'))}</h2>
        <span class="text-[11px] muted">${esc(T('team.joined', { n: joined, m: PEOPLE.length }))}</span>
      </div>
      <div class="flex gap-2 flex-wrap">${PEOPLE.map(p => `<div class="flex flex-col items-center gap-1 w-12 ${members[p.id] ? '' : 'opacity-35'}">${avatar(p.id, 'w-9 h-9 text-sm')}<span class="text-[10px] font-semibold truncate w-full text-center">${esc(p.name)}</span></div>`).join('')}</div>
      <div class="mt-3 grid gap-1.5">${Object.entries(GROUPS).map(([k, g]) => `<p class="text-[11px] muted"><strong class="accent">${k}</strong> · ${esc(g.who)}</p>`).join('')}</div>
    </div>`;
  }

  function renderDecisions() {
    $('#decisions').innerHTML = DECISIONS.map(dec => {
      const t = decisionTally(dec.id);
      return `<div class="surface rounded-2xl p-4">
        <div class="flex items-center gap-2 mb-1">
          <i class="fa-solid ${dec.icon} terra" aria-hidden="true"></i>
          <h2 class="text-sm font-extrabold">${esc(dec.title)}</h2>
          <span class="ml-auto text-[11px] muted">${esc(T('dec.votes', { n: t.total, m: PEOPLE.length }))}</span>
        </div>
        <p class="text-xs muted mb-3">${esc(dec.desc)}</p>
        <div class="space-y-2">${dec.options.map(o => {
          const voters = t.counts[o.id] || [];
          const pct = Math.round(voters.length / PEOPLE.length * 100);
          const mine = t.mine === o.id;
          return `<button data-action="decide" data-dec="${dec.id}" data-opt="${o.id}" class="relative w-full text-left rounded-xl p-3 overflow-hidden border ${mine ? 'ring-accent line' : 'line'}">
            <span class="absolute inset-y-0 left-0 btn-soft" style="width:${pct}%" aria-hidden="true"></span>
            <span class="relative flex items-center gap-2">
              <span class="w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${mine ? 'btn-accent border-transparent' : 'line'}">${mine ? '<i class="fa-solid fa-check text-[10px]" aria-hidden="true"></i>' : ''}</span>
              <span class="font-bold text-sm">${esc(o.label)}</span>
              ${t.winner === o.id ? `<span class="tag btn-accent">${esc(T('dec.leading'))}</span>` : ''}
              <span class="ml-auto flex -space-x-1.5">${voters.map(u => avatar(u, 'w-5 h-5 text-[9px] ring-2 ring-white/70')).join('')}</span>
            </span>
            <span class="relative block text-[11px] muted mt-1 pl-7">${esc(o.sub)}</span>
          </button>`;
        }).join('')}</div>
      </div>`;
    }).join('');
  }

  function renderChecklist() {
    const done = D().checklist || {};
    const n = CHECKLIST.filter(c => done[c.id] && done[c.id].done).length;
    const cats = [...new Set(CHECKLIST.map(c => c.cat))];
    $('#checklist').innerHTML = `<div class="surface rounded-2xl p-4">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-sm font-extrabold flex items-center gap-2"><i class="fa-solid fa-list-check accent" aria-hidden="true"></i> ${esc(T('check.title'))}</h2>
        <span class="text-[11px] font-bold muted">${n}/${CHECKLIST.length}</span>
      </div>
      <div class="h-1.5 rounded-full surface2 mb-3 overflow-hidden"><div class="h-full btn-accent" style="width:${Math.round(n / CHECKLIST.length * 100)}%"></div></div>
      ${cats.map(cat => `<div class="mb-2">
        <p class="text-[10px] font-bold uppercase tracking-wide muted mb-1">${esc(cat)}</p>
        ${CHECKLIST.filter(c => c.cat === cat).map(c => {
          const st = done[c.id] || {};
          const by = person(st.by);
          return `<div class="flex items-center gap-1">
            <button data-action="check" data-id="${c.id}" class="flex-1 min-w-0 flex items-center gap-2.5 py-2 text-left">
              <span class="w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center ${st.done ? 'btn-accent border-transparent' : 'line'}">${st.done ? '<i class="fa-solid fa-check text-[10px]" aria-hidden="true"></i>' : ''}</span>
              <span class="text-sm flex-1 ${st.done ? 'line-through muted' : ''}">${esc(c.text)}</span>
              ${st.done && by ? avatar(by.id, 'w-5 h-5 text-[9px]') : ''}
            </button>
            ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener" class="w-9 h-9 shrink-0 rounded-lg inline-flex items-center justify-center accent" title="${esc(T('check.linkTitle'))}" aria-label="${esc(c.text)} · ${esc(T('check.linkTitle'))}"><i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i></a>` : ''}
          </div>`;
        }).join('')}
      </div>`).join('')}
    </div>`;
  }

  function renderPractical() {
    $('#practical').innerHTML = `<div class="surface rounded-2xl p-4">
      <h2 class="text-sm font-extrabold mb-3 flex items-center gap-2"><i class="fa-solid fa-circle-info accent" aria-hidden="true"></i> ${esc(T('practical.title'))}</h2>
      <div class="space-y-3">${PRACTICAL.map(p => `<div class="flex gap-3">
        <i class="fa-solid ${p.icon} w-4 text-center terra mt-0.5" aria-hidden="true"></i>
        <div><p class="text-xs font-bold">${esc(p.title)}</p><p class="text-xs muted leading-snug">${esc(p.text)}</p></div>
      </div>`).join('')}</div>
    </div>`;
  }

  // ---------- RENDER: sohbet ----------
  function chatMessages() {
    return Object.values(D().discussions || {}).filter(m => m && m.text).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)).slice(-100);
  }

  function renderChat() {
    const box = $('#chatList');
    const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 60;
    const msgs = chatMessages();
    const today = localDate(new Date());
    box.innerHTML = msgs.length ? msgs.map(m => {
      const mine = m.user === state.me;
      const p = person(m.user);
      const d = new Date(m.timestamp || Date.now());
      const when = (localDate(d) === today ? '' : `${d.getDate()}.${d.getMonth() + 1} `) + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      return `<div class="flex gap-2 ${mine ? 'flex-row-reverse' : ''}">
        ${mine ? '' : avatar(m.user)}
        <div class="max-w-[80%] ${mine ? 'text-right' : ''}">
          <div class="text-[10px] muted mb-0.5">${mine ? '' : esc(p ? p.name : (FORMER_PEOPLE[m.user] || m.user)) + ' · '}${when}</div>
          <div class="inline-block text-left px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${mine ? 'btn-accent rounded-tr-md' : 'surface2 rounded-tl-md'}">${esc(m.text)}</div>
        </div>
      </div>`;
    }).join('') : `<p class="text-sm muted text-center py-8">${esc(T('chat.empty'))}</p>`;
    if (atBottom || !renderChat.didInit) box.scrollTop = box.scrollHeight;
    renderChat.didInit = true;
    updateChatBadge();
  }

  function updateChatBadge() {
    const msgs = chatMessages();
    const chatVisible = isDesktop() || state.tab === 'chat';
    if (chatVisible && msgs.length) LS.set(LS_CHAT_SEEN, String(msgs[msgs.length - 1].timestamp || Date.now()));
    const seen = Number(LS.get(LS_CHAT_SEEN) || 0);
    const unread = msgs.filter(m => m.user !== state.me && (m.timestamp || 0) > seen).length;
    const b = $('#chatBadge');
    b.textContent = unread > 9 ? '9+' : String(unread);
    b.classList.toggle('hidden', !unread);
    const myDecisions = DECISIONS.every(dec => decisionTally(dec.id).mine);
    $('#decideBadge').classList.toggle('hidden', myDecisions);
  }

  function renderAll() {
    if (!state.me) return;
    renderHeader();
    renderTabs();
    renderPlan();
    renderPool();
    renderTeam();
    renderDecisions();
    renderChecklist();
    renderPractical();
    renderChat();
    if (state.sheet) renderSheet(true);
  }

  // ---------- ALT SAYFA (sheet) ----------
  function openSheet(s) {
    state.sheet = s;
    renderSheet(false);
    const el = $('#sheet');
    el.classList.remove('sheet-hidden');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusEl = $('#sheetContent [data-autofocus]');
    if (focusEl && isDesktop()) setTimeout(() => focusEl.focus(), 50);
  }

  function closeSheet() {
    state.sheet = null;
    const el = $('#sheet');
    el.classList.add('sheet-hidden');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function sheetHeader(title, sub) {
    return `<div class="px-5 pt-3 pb-3 flex items-start gap-3 border-b line">
      <div class="min-w-0 flex-1"><h2 class="text-lg font-extrabold leading-tight">${title}</h2>${sub ? `<p class="text-xs muted mt-0.5">${sub}</p>` : ''}</div>
      <button data-action="close" class="w-9 h-9 shrink-0 rounded-full btn-ghost" aria-label="${esc(T('sheet.close'))}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    </div>`;
  }

  function renderSheet(isUpdate) {
    const s = state.sheet;
    const c = $('#sheetContent');
    if (!s) return;
    if (s.type === 'pick-activity') {
      if (!isUpdate) {
        const d = dayOf(s.day);
        c.innerHTML = sheetHeader(esc(T('sheet.addTo', { slot: slotOf(s.slot).label })), `${esc(d.title)} · ${slotOf(s.slot).start}–${slotOf(s.slot).end}`) + `
          <div class="px-5 pt-3 space-y-2">
            <input id="sheetSearch" data-autofocus type="search" placeholder="${esc(T('sheet.search'))}" value="${esc(state.poolQuery)}" class="w-full rounded-xl px-3 py-2.5 text-sm">
            <div id="sheetCats" class="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1"></div>
          </div>
          <div id="sheetList" class="px-5 py-3 space-y-2 overflow-y-auto flex-1"></div>
          <div class="px-5 py-3 border-t line pb-safe"><button data-action="custom" class="w-full h-11 rounded-xl btn-ghost text-sm font-bold"><i class="fa-solid fa-plus" aria-hidden="true"></i> ${esc(T('sheet.notListed'))}</button></div>`;
      }
      $('#sheetCats').innerHTML = catChipsHtml();
      const list = filteredActivities(s.slot);
      $('#sheetList').innerHTML = list.length ? list.map(a => poolCard(a, s.slot)).join('') : `<p class="text-sm muted text-center py-6">${esc(T('pool.none'))}</p>`;
      return;
    }
    if (s.type === 'pick-slot') {
      const act = activity(s.act);
      const pickDay = s.pickDay || state.day;
      const title = s.move ? esc(T('sheet.move')) : esc(act ? act.name : '');
      c.innerHTML = sheetHeader(title, s.move ? esc(s.move.name) : esc(T('sheet.whichSlot'))) + `
        <div class="px-5 py-4 space-y-4 overflow-y-auto pb-safe">
          <div class="flex gap-1.5 overflow-x-auto hide-scrollbar">${DAYS.map(d => `<button data-action="sheet-day" data-day="${d.key}" class="shrink-0 w-[52px] h-12 rounded-xl flex flex-col items-center justify-center leading-none ${d.key === pickDay ? 'btn-accent' : 'surface'}"><span class="text-[10px] font-bold">${d.short}</span><span class="text-base font-extrabold">${d.num}</span></button>`).join('')}</div>
          <div class="grid grid-cols-2 gap-2">${SLOTS.map(sl => {
            const closed = (dayOf(pickDay).closed || {})[sl.key];
            return `<button data-action="sheet-slot" data-slot="${sl.key}" ${closed ? 'disabled' : ''} class="rounded-xl p-3 text-left border ${sl.nap ? 'nap' : 'surface'} ${closed ? 'opacity-40' : 'hover:ring-accent'}">
              <span class="block text-sm font-extrabold ${sl.nap ? 'nap-ink' : ''}">${esc(sl.label)}</span>
              <span class="block text-[11px] muted">${closed ? esc(closed) : sl.start + '–' + sl.end}</span>
              ${act && act.best.includes(sl.key) && !closed ? `<span class="tag btn-soft mt-1 inline-block">${esc(T('sheet.fits'))}</span>` : ''}
            </button>`;
          }).join('')}</div>
        </div>`;
      return;
    }
    if (s.type === 'detail') {
      const item = slotItems(s.day, s.slot)[s.key];
      if (!item) { closeSheet(); return; }
      const act = activity(item.activityId) || {};
      const t = voteTally(s.key);
      const by = person(item.addedBy);
      const groups = item.groups || {};
      const key = esc(s.key);
      const desc = act.desc || '';
      const name = itemName(item);
      const area = itemArea(item);
      c.innerHTML = sheetHeader(esc(name), `${esc(dayOf(s.day).title)} · ${esc(slotOf(s.slot).label)} ${slotOf(s.slot).start}–${slotOf(s.slot).end}`) + `
        <div class="px-5 py-4 space-y-5 overflow-y-auto pb-safe">
          <div class="flex flex-wrap gap-1.5 items-center">
            <span class="tag tag-${esc(item.cat || 'custom')}">${esc((catOf(item.cat) || { label: T('pool.teamIdea') }).label)}</span>
            ${act.res ? `<span class="tag tag-res"><i class="fa-solid fa-ticket" aria-hidden="true"></i> ${esc(T('item.resNeeded'))}</span>` : ''}
            ${area ? `<span class="text-xs muted">${esc(area)}</span>` : ''}
          </div>
          ${desc ? `<p class="text-sm leading-relaxed">${esc(desc)}</p>` : ''}
          <div class="flex flex-wrap gap-2">
            ${act.url ? `<a href="${esc(act.url)}" target="_blank" rel="noopener" class="h-10 px-4 rounded-xl btn-ghost inline-flex items-center gap-2 text-sm font-bold"><i class="fa-solid fa-globe accent" aria-hidden="true"></i> ${esc(T('link.web'))}</a>` : ''}
            <a href="${esc(mapsFor({ name, addr: act.addr, area }))}" target="_blank" rel="noopener" class="h-10 px-4 rounded-xl btn-ghost inline-flex items-center gap-2 text-sm font-bold"><i class="fa-solid fa-location-dot terra" aria-hidden="true"></i> ${esc(T('link.mapOpen'))}</a>
          </div>

          <div>
            <p class="text-xs font-bold muted mb-2">${esc(T('detail.votes'))}</p>
            <div class="grid grid-cols-2 gap-2">
              <button data-action="vote" data-key="${key}" data-v="up" class="rounded-xl p-3 border line text-left ${t.mine === 'up' ? 'ring-accent' : ''}">
                <span class="text-sm font-extrabold ok"><i class="fa-solid fa-thumbs-up" aria-hidden="true"></i> ${t.up.length}</span>
                <span class="flex -space-x-1 mt-1.5 min-h-[20px]">${t.up.map(u => avatar(u, 'w-5 h-5 text-[9px]')).join('')}</span>
              </button>
              <button data-action="vote" data-key="${key}" data-v="down" class="rounded-xl p-3 border line text-left ${t.mine === 'down' ? 'ring-accent' : ''}">
                <span class="text-sm font-extrabold bad"><i class="fa-solid fa-thumbs-down" aria-hidden="true"></i> ${t.down.length}</span>
                <span class="flex -space-x-1 mt-1.5 min-h-[20px]">${t.down.map(u => avatar(u, 'w-5 h-5 text-[9px]')).join('')}</span>
              </button>
            </div>
          </div>

          <div>
            <p class="text-xs font-bold muted mb-2">${esc(T('detail.who'))}</p>
            <div class="grid grid-cols-2 gap-2">${Object.entries(GROUPS).map(([g, info]) => `
              <button data-action="group" data-g="${g}" class="rounded-xl p-2.5 border text-left ${groups[g] ? 'btn-soft ring-accent line' : 'line'}">
                <span class="block text-sm font-extrabold">${g}</span>
                <span class="block text-[10px] muted leading-tight">${esc(info.who.split(',')[0])}…</span>
              </button>`).join('')}</div>
          </div>

          <div class="flex flex-col gap-2">
            <button data-action="confirm-item" class="h-12 rounded-xl text-sm font-bold ${item.confirmed ? 'btn-ghost' : 'btn-accent'}">
              <i class="fa-solid ${item.confirmed ? 'fa-rotate-left' : 'fa-check'}" aria-hidden="true"></i> ${esc(T(item.confirmed ? 'detail.unconfirm' : 'detail.confirm'))}
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button data-action="move" class="h-11 rounded-xl btn-ghost text-sm font-bold"><i class="fa-solid fa-arrows-up-down" aria-hidden="true"></i> ${esc(T('detail.move'))}</button>
              <button data-action="remove" class="h-11 rounded-xl btn-ghost text-sm font-bold bad"><i class="fa-solid fa-trash-can" aria-hidden="true"></i> ${esc(T('detail.remove'))}</button>
            </div>
          </div>
          <p class="text-[11px] muted">${by ? esc(T('detail.addedBy', { name: by.name })) : ''}${item.addedAt ? ' · ' + new Date(item.addedAt).toLocaleString(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</p>
        </div>`;
      return;
    }
    if (s.type === 'custom') {
      if (isUpdate) return;
      const lbl = 'text-xs font-bold muted';
      const inp = 'mt-1 w-full rounded-xl px-3 py-2.5 text-sm';
      c.innerHTML = sheetHeader(esc(T('custom.title')), s.slot ? esc(T('custom.subSlot', { where: `${dayOf(s.day).title} · ${slotOf(s.slot).label}` })) : esc(T('custom.subPool'))) + `
        <form id="customForm" class="px-5 py-4 space-y-3 overflow-y-auto pb-safe">
          <label class="block"><span class="${lbl}">${esc(T('custom.name'))}</span><input name="name" data-autofocus required maxlength="80" class="${inp}" placeholder="${esc(T('custom.namePh'))}"></label>
          <label class="block"><span class="${lbl}">${esc(T('custom.area'))}</span><input name="area" maxlength="60" class="${inp}" placeholder="${esc(T('custom.areaPh'))}"></label>
          <label class="block"><span class="${lbl}">${esc(T('custom.cat'))}</span><select name="cat" class="${inp}">${CATEGORIES.map(c2 => `<option value="${c2.key}">${esc(c2.label)}</option>`).join('')}</select></label>
          <label class="block"><span class="${lbl}">${esc(T('custom.note'))}</span><textarea name="desc" maxlength="300" rows="3" class="${inp}" placeholder="${esc(T('custom.notePh'))}"></textarea></label>
          <button type="submit" class="w-full h-12 rounded-xl btn-accent text-sm font-bold">${esc(T('custom.submit'))}</button>
        </form>`;
      return;
    }
    if (s.type === 'confirm-me') {
      // Onay ekranı seçilen kişinin dilinde gösterilir
      const p = person(s.id);
      const pl = p.lang || 'tr';
      c.innerHTML = sheetHeader(esc(TL(pl, 'me.title', { name: p.name })), '') + `
        <div class="px-5 py-5 space-y-4 pb-safe">
          <div class="flex items-center gap-3">${avatar(p.id, 'w-12 h-12 text-lg')}<p class="text-sm">${TL(pl, 'me.body', { name: esc(p.name) })}</p></div>
          <div class="grid grid-cols-2 gap-2">
            <button data-action="close" class="h-12 rounded-xl btn-ghost text-sm font-bold">${esc(TL(pl, 'me.cancel'))}</button>
            <button data-action="confirm-me" data-id="${p.id}" class="h-12 rounded-xl btn-accent text-sm font-bold">${esc(TL(pl, 'me.ok'))}</button>
          </div>
        </div>`;
      return;
    }
    if (s.type === 'invite') {
      c.innerHTML = sheetHeader(esc(T('invite.title')), esc(T('invite.sub'))) + `
        <div class="px-5 py-5 space-y-3 pb-safe">
          <input readonly value="${esc(s.url)}" class="w-full rounded-xl px-3 py-2.5 text-xs" onfocus="this.select()">
          <p class="text-xs muted">${esc(T('invite.hint'))}</p>
        </div>`;
    }
  }

  // ---------- olaylar ----------
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.add('hidden'), 2200);
  }

  function inviteUrl() {
    return location.origin + location.pathname + '#t=' + state.key;
  }

  const actions = {
    'pick-me': el => openSheet({ type: 'confirm-me', id: el.dataset.id }),
    'confirm-me': el => {
      const id = el.dataset.id;
      if (!person(id)) return;
      state.me = id;
      LS.set(LS_USER, id);
      setLang(person(id).lang || 'tr');
      const m = (D().members || {})[id];
      tripRef.child('members/' + id).set({
        joinedAt: (m && m.joinedAt) || firebase.database.ServerValue.TIMESTAMP,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });
      closeSheet();
      showApp();
    },
    close: () => closeSheet(),
    tab: el => { state.tab = el.dataset.tab; renderTabs(); updateChatBadge(); window.scrollTo(0, 0); if (state.tab === 'chat') { const b = $('#chatList'); b.scrollTop = b.scrollHeight; } },
    day: el => { state.day = el.dataset.day; state.view = 'day'; LS.set(LS_VIEW, 'day'); renderPlan(); },
    'open-day': el => { state.day = el.dataset.day; state.view = 'day'; LS.set(LS_VIEW, 'day'); renderPlan(); window.scrollTo(0, 0); },
    view: () => { state.view = state.view === 'day' ? 'summary' : 'day'; LS.set(LS_VIEW, state.view); renderPlan(); },
    'pool-cat': el => { state.poolCat = el.dataset.cat; renderPool(); if (state.sheet && state.sheet.type === 'pick-activity') renderSheet(true); },
    'pick-activity': el => openSheet({ type: 'pick-activity', day: state.day, slot: el.dataset.slot }),
    'add-here': el => { const s = state.sheet; addToSlot(el.dataset.act, s.day, s.slot); closeSheet(); },
    'pick-slot': el => openSheet({ type: 'pick-slot', act: el.dataset.act, pickDay: state.day }),
    'sheet-day': el => { state.sheet.pickDay = el.dataset.day; renderSheet(true); },
    'sheet-slot': el => {
      const s = state.sheet;
      const day = s.pickDay || state.day;
      if (s.move) moveItem(s.move.day, s.move.slot, s.move.key, day, el.dataset.slot);
      else addToSlot(s.act, day, el.dataset.slot);
      closeSheet();
    },
    accept: el => addToSlot(el.dataset.act, el.dataset.day, el.dataset.slot),
    detail: el => openSheet({ type: 'detail', day: el.dataset.day, slot: el.dataset.slot, key: el.dataset.key }),
    vote: el => vote(el.dataset.key, el.dataset.v),
    group: el => {
      const s = state.sheet;
      const item = slotItems(s.day, s.slot)[s.key];
      const cur = !!(item && item.groups && item.groups[el.dataset.g]);
      write(`slots/${s.day}/${s.slot}/${s.key}/groups/${el.dataset.g}`, cur ? null : true);
    },
    'confirm-item': () => {
      const s = state.sheet;
      const item = slotItems(s.day, s.slot)[s.key];
      write(`slots/${s.day}/${s.slot}/${s.key}/confirmed`, item && item.confirmed ? null : true);
    },
    move: () => {
      const s = state.sheet;
      const item = slotItems(s.day, s.slot)[s.key];
      openSheet({ type: 'pick-slot', act: item.activityId, pickDay: s.day, move: { day: s.day, slot: s.slot, key: s.key, name: itemName(item) } });
    },
    remove: () => {
      const s = state.sheet;
      const item = slotItems(s.day, s.slot)[s.key];
      if (!item || !confirm(T('detail.removeAsk', { name: itemName(item) }))) return;
      removeItem(s.day, s.slot, s.key);
      closeSheet();
    },
    custom: () => {
      const s = state.sheet;
      openSheet(s && s.type === 'pick-activity' ? { type: 'custom', day: s.day, slot: s.slot } : { type: 'custom' });
    },
    decide: el => decide(el.dataset.dec, el.dataset.opt),
    check: el => {
      const cur = (D().checklist || {})[el.dataset.id];
      write(`checklist/${el.dataset.id}`, cur && cur.done ? null : { done: true, by: state.me, at: firebase.database.ServerValue.TIMESTAMP });
    },
    invite: () => {
      const url = inviteUrl();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => toast(T('toast.copied')), () => openSheet({ type: 'invite', url }));
      } else {
        openSheet({ type: 'invite', url });
      }
    }
  };

  document.addEventListener('click', e => {
    if (e.target.closest('a[href]')) return; // dış linkler kartın kendi eylemini tetiklemesin
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el); }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.sheet && state.me) closeSheet();
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'poolSearch' || e.target.id === 'sheetSearch') {
      state.poolQuery = e.target.value;
      if (e.target.id === 'poolSearch') renderPool(); else renderSheet(true);
    }
  });

  document.addEventListener('submit', e => {
    if (e.target.id === 'chatForm') {
      e.preventDefault();
      const input = $('#chatInput');
      const text = input.value.trim().slice(0, 500);
      if (!text || !tripRef) return;
      tripRef.child('discussions').push({ user: state.me, text, timestamp: firebase.database.ServerValue.TIMESTAMP })
        .catch(err => toast(T('toast.sendFail', { e: err.code })));
      input.value = '';
    }
    if (e.target.id === 'customForm') {
      e.preventDefault();
      const f = new FormData(e.target);
      const name = String(f.get('name') || '').trim();
      if (!name) return;
      const ref = tripRef.child('custom_activities').push();
      const s = state.sheet;
      ref.set({
        name: name.slice(0, 80),
        area: String(f.get('area') || '').trim().slice(0, 60),
        cat: String(f.get('cat') || 'food'),
        desc: String(f.get('desc') || '').trim().slice(0, 300),
        addedBy: state.me,
        addedAt: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        if (s && s.slot) setTimeout(() => addToSlot('custom:' + ref.key, s.day, s.slot), 300);
        else toast(T('toast.poolAdded'));
      }).catch(err => toast(T('toast.saveFail', { e: err.code })));
      closeSheet();
    }
  });

  // Masaüstü sürükle-bırak: havuzdan slota ekle, slotlar arasında taşı
  document.addEventListener('dragstart', e => {
    const a = e.target.closest('[data-drag-act]');
    const it = e.target.closest('[data-drag-item]');
    if (a) e.dataTransfer.setData('text/plain', 'act:' + a.dataset.dragAct);
    else if (it) e.dataTransfer.setData('text/plain', `item:${it.dataset.day}:${it.dataset.slot}:${it.dataset.key}`);
    else return;
    e.dataTransfer.effectAllowed = 'copyMove';
  });
  document.addEventListener('dragover', e => {
    const z = e.target.closest('[data-drop]');
    if (!z) return;
    e.preventDefault();
    $$('.drop-over').forEach(x => x !== z && x.classList.remove('drop-over'));
    z.classList.add('drop-over');
  });
  document.addEventListener('dragleave', e => {
    const z = e.target.closest('[data-drop]');
    if (z && !z.contains(e.relatedTarget)) z.classList.remove('drop-over');
  });
  document.addEventListener('drop', e => {
    const z = e.target.closest('[data-drop]');
    if (!z) return;
    e.preventDefault();
    z.classList.remove('drop-over');
    const payload = e.dataTransfer.getData('text/plain') || '';
    if (payload.startsWith('act:')) addToSlot(payload.slice(4), state.day, z.dataset.drop);
    else if (payload.startsWith('item:')) {
      const [, d, s, k] = payload.split(':');
      moveItem(d, s, k, state.day, z.dataset.drop);
    }
  });

  window.addEventListener('resize', () => updateChatBadge());

  // ---------- akış ----------
  function show(id) {
    ['gate', 'whoami', 'app'].forEach(x => $('#' + x).classList.toggle('hidden', x !== id));
  }

  function showGate(msg) {
    if (msg) $('#gateMsg').textContent = msg;
    show('gate');
  }

  function showApp() {
    show('app');
    renderAll();
  }

  function readTripKey() {
    const m = location.hash.match(/[#&]t=([A-Za-z0-9_-]{20,})/);
    if (m) { LS.set(LS_TRIP, m[1]); return m[1]; }
    const saved = LS.get(LS_TRIP);
    if (saved && /^[A-Za-z0-9_-]{20,}$/.test(saved)) {
      history.replaceState(null, '', location.pathname + location.search + '#t=' + saved);
      return saved;
    }
    return null;
  }

  function init() {
    const savedUser = LS.get(LS_USER);
    state.me = person(savedUser) ? savedUser : null;
    if (state.me) setLang(person(state.me).lang || 'tr');

    state.key = readTripKey();
    if (!state.key) { showGate(); return; }

    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.database();
    } catch (e) {
      showGate(T('gate.offline'));
      return;
    }
    tripRef = db.ref('trips/' + state.key);
    state.day = todayKey() || 'day1';

    db.ref('.info/connected').on('value', snap => {
      const dot = $('#connDot');
      const ok = snap.val() === true;
      dot.className = 'w-2 h-2 rounded-full ' + (ok ? 'bg-emerald-500' : 'bg-amber-500');
      dot.title = T(ok ? 'conn.ok' : 'conn.wait');
    });

    // Ekran hemen çizilir, veri geldikçe güncellenir (yavaş bağlantıda boş sayfa olmasın)
    if (state.me) {
      tripRef.child('members/' + state.me + '/lastSeen').set(firebase.database.ServerValue.TIMESTAMP).catch(() => {});
      showApp();
    } else {
      renderWhoami();
      show('whoami');
    }

    tripRef.on('value', snap => {
      state.data = snap.val() || {};
      state.loaded = true;
      if (state.me) renderAll(); else renderWhoami();
    }, err => {
      showGate(T(err && err.code === 'PERMISSION_DENIED' ? 'gate.denied' : 'gate.offline'));
    });

    // Slotlar "şimdi" vurgusu için dakikada bir tazelenir
    setInterval(() => { if (state.me && !state.sheet) { renderHeader(); renderPlan(); } }, 60000);
  }

  init();
})();
