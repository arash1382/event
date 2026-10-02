/* ============================================================================
   app.js — shell, router, navigation, command palette, print & presentation
   ========================================================================== */
import { META, GATES, EVENTS, PERMITS, CORES, PARTNERS, PHASES, GUESTS, VERDICTS } from './data.js';
import { $, $$, mount, wireDynamics, ic, nz, esc, closeDrawer, openDrawer, stampNow, todayJalali, toast } from './ui.js';

import dashboard  from './views/dashboard.js';
import governance from './views/governance.js';
import gates      from './views/gates.js';
import eventfile  from './views/eventfile.js';
import calendar   from './views/calendar.js';
import operations from './views/operations.js';
import permits    from './views/permits.js';
import guests     from './views/guests.js';
import safety     from './views/safety.js';
import analytics  from './views/analytics.js';

/* ── route table ── */
const ROUTES = [
  { g: 'فرماندهی', items: [
    { id: 'dashboard',  t: 'داشبورد اجرایی',  en: 'Executive Dashboard', ic: 'dashboard', view: dashboard },
    { id: 'governance', t: 'نمای راهبری',     en: 'Governance Overview', ic: 'target',    view: governance },
    { id: 'council',    t: 'ساختار شورا',     en: 'Council Structure',   ic: 'council',   view: governance, anchor: 'council' },
    { id: 'calendar',   t: 'تقویم رویدادها',  en: 'Event Calendar',      ic: 'calendar',  view: calendar }
  ]},
  { g: 'کنترل راهبری', items: [
    { id: 'lifecycle', t: 'چرخه عمر رویداد', en: 'Event Lifecycle',     ic: 'lifecycle', view: governance, anchor: 'lifecycle' },
    { id: 'gates',     t: '۱۴ گیت کنترلی',   en: '14 Governance Gates', ic: 'gate',      view: gates, badge: GATES.filter(g => g.status !== 'passed' && !g.final).length },
    { id: 'permits',   t: 'مجوزها و انطباق', en: 'Permits & Compliance', ic: 'permit',   view: permits, badge: PERMITS.filter(p => p.st !== 'ok').length }
  ]},
  { g: 'پرونده‌ها', items: [
    { id: 'event',      t: 'پرونده نمونه رویداد', en: 'Sample Event File',   ic: 'file',      view: eventfile },
    { id: 'guests',     t: 'مهمانان و سخنرانان',  en: 'Guest & Speaker',     ic: 'users',     view: guests, badge: GUESTS.filter(x => x.a !== 'ok').length },
    { id: 'operations', t: 'عملیات و Run Sheet',  en: 'Operations Run Sheet', ic: 'runsheet', view: operations }
  ]},
  { g: 'ایمنی و ارزیابی', items: [
    { id: 'hse',       t: 'HSE و آتش‌نشانی',     en: 'HSE & Fire Safety',  ic: 'hse',      view: safety, tab: 'hse' },
    { id: 'security',  t: 'حراست و امنیت',        en: 'Security & Order',   ic: 'security', view: safety, tab: 'sec' },
    { id: 'analytics', t: 'گزارش پس از رویداد',   en: 'Post-Event Report',  ic: 'analytics', view: analytics }
  ]}
];
const FLAT = ROUTES.flatMap(g => g.items.map(i => ({ ...i, group: g.g })));

/* ── rail ── */
function renderRail(){
  const current = currentId();
  const html = ROUTES.map(sec => `
    <div class="rnavg">${esc(sec.g)}</div>
    ${sec.items.map(i => `
      <a class="rnavlink ${i.id === current ? 'is-active' : ''}" href="#/${i.id}" data-route="${i.id}">
        <span class="rnavlink__ic">${ic(i.ic)}</span>
        <span class="rnavlink__t"><b>${esc(i.t)}</b><i>${esc(i.en)}</i></span>
        ${i.badge ? `<span class="rnavlink__badge">${esc(String(i.badge))}</span>` : ''}
      </a>`).join('')}
  `).join('');
  mount($('#railNav'), html);
}

const IDS = FLAT.map(r => r.id);
function currentId(){
  const h = location.hash.replace(/^#\/?/, '').split('/')[0];
  return IDS.includes(h) ? h : 'dashboard';
}
function currentRoute(){ return FLAT.find(r => r.id === currentId()); }

/* ── render ── */
function render(){
  const route = currentRoute();
  const view = $('#view');
  mount(view, `<div class="wrap">${route.view({ tab: route.tab, route: route.id })}</div>`);
  view.classList.remove('is-entering'); void view.offsetWidth; view.classList.add('is-entering');

  $$('.crumb__cur').forEach(n => n.textContent = route.t);
  document.title = `${nz(route.t)} — ${META.short}`;
  renderRail();
  wireDynamics(view);

  if (route.anchor) {
    requestAnimationFrame(() => {
      const el = document.getElementById(route.anchor);
      if (el) window.scrollTo({ top: el.offsetTop - 84, behavior: 'smooth' });
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  $('#rail').classList.remove('is-open');
  $('#railScrim').hidden = true;
  buildPrintHead();
}

/* ── delegated interactions ── */
function wireGlobal(){
  // route changes
  window.addEventListener('hashchange', render);

  // rail collapse
  $('#railToggle').addEventListener('click', () => {
    const app = $('#app');
    app.classList.toggle('is-collapsed');
    $('#railToggle').setAttribute('aria-expanded', String(!app.classList.contains('is-collapsed')));
  });

  // mobile rail
  const openRail = v => {
    $('#rail').classList.toggle('is-open', v);
    $('#railScrim').hidden = !v;
  };
  $('#burger').addEventListener('click', () => openRail(true));
  $('#railScrim').addEventListener('click', () => openRail(false));

  // tabs / filters / accordions (any element carrying data-action)
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;

    if (a === 'tab') {
      const scope = t.closest('[data-tabs]');
      if (!scope) return;
      $$('[data-action="tab"]', scope).forEach(b => b.setAttribute('aria-selected', String(b === t)));
      $$('[data-panel]', scope).forEach(p => { p.hidden = p.dataset.panel !== t.dataset.tab; });
      wireDynamics(scope);
      return;
    }
    if (a === 'filter') {
      const scope = t.closest('[data-filter-scope]') || document;
      $$('[data-action="filter"]', scope).forEach(b => b.classList.toggle('is-on', b === t));
      const f = t.dataset.filter;
      $$('[data-facet]', scope).forEach(n => {
        const tags = (n.dataset.facet || '').split(' ');
        n.hidden = !(f === 'all' || tags.includes(f));
      });
      return;
    }
    if (a === 'seg') {
      const scope = t.closest('[data-seg]');
      $$('[data-action="seg"]', scope).forEach(b => { b.classList.toggle('is-on', b === t); b.setAttribute('aria-selected', String(b === t)); });
      wireDynamics(scope);
      return;
    }
    if (a === 'gate') { import('./views/gates.js').then(m => m.gateDrawer(t.dataset.code)); return; }
    if (a === 'event') { import('./views/eventfile.js').then(m => m.eventDrawer(t.dataset.id)); return; }
    if (a === 'permit') { import('./views/permits.js').then(m => m.permitDrawer(t.dataset.idx)); return; }
    if (a === 'guest') { import('./views/guests.js').then(m => m.guestDrawer(t.dataset.idx)); return; }
    if (a === 'act') {
      const msgs = {
        new: 'فرم درخواست جدید رویداد در دبیرخانه باز شد — شناسه موقت IRM-1405-0241 صادر گردید.',
        export: 'خروجی مدیریتی دوره جاری در قالب PDF آماده شد.',
        print: 'نسخه چاپی ویژه هیئت‌مدیره آماده شد.',
        notify: 'یادآوری به ۴ مالک رویداد دارای الزام باز ارسال شد.',
        sync: 'همگام‌سازی با سامانه‌های مجوز و CRM انجام شد.',
        refresh: 'داده‌های دبیرخانه به‌روزرسانی شد.'
      };
      toast(msgs[t.dataset.act] || 'عملیات انجام شد.');
    }
  });

  // drawer close
  $('#drawer').addEventListener('click', e => { if (e.target.closest('[data-drawer-close]')) closeDrawer(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawer(); closeCmdk(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdk(); }
  });

  // presentation mode
  $('#presentBtn').addEventListener('click', () => {
    const on = document.documentElement.dataset.mode === 'present';
    document.documentElement.dataset.mode = on ? 'executive' : 'present';
    $('#presentBtn').setAttribute('aria-pressed', String(!on));
    toast(on ? 'حالت عادی فعال شد.' : 'حالت ارائه به هیئت‌مدیره فعال شد.');
  });

  // print
  $('#printBtn').addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', buildPrintHead);

  // search
  $('#searchBtn').addEventListener('click', openCmdk);
  wireCmdk();
}

/* ── command palette ── */
let SEL = 0, RESULTS = [];
function buildIndex(){
  const idx = [];
  FLAT.forEach(r => idx.push({ t: r.t, s: r.en, k: 'بخش', go: `#/${r.id}`, ic: r.ic }));
  GATES.forEach(g => idx.push({ t: `${g.code} — ${g.fa}`, s: g.en, k: 'گیت', go: `#/gates`, act: ['gate', g.code], ic: 'gate' }));
  EVENTS.forEach(ev => idx.push({ t: `${ev.id} · ${ev.t}`, s: `${ev.place} — مرحله ${ev.stage}`, k: 'رویداد', go: '#/calendar', act: ['event', ev.id], ic: 'calendar' }));
  PERMITS.forEach((p, i) => idx.push({ t: p.n, s: `${p.a} — ${p.id}`, k: 'مجوز', go: '#/permits', act: ['permit', String(i)], ic: 'permit' }));
  CORES.forEach(c => idx.push({ t: `هسته ${c.name}`, s: c.en, k: 'هسته', go: '#/council', ic: 'council' }));
  PARTNERS.forEach(p => idx.push({ t: p.n, s: `واحد همکار — گیت ${p.gates.join(' / ')}`, k: 'واحد', go: '#/council', ic: 'building' }));
  PHASES.forEach(p => idx.push({ t: `مرحله ${p.n} — ${p.t}`, s: p.out, k: 'چرخه', go: '#/lifecycle', ic: 'lifecycle' }));
  GUESTS.forEach((g, i) => idx.push({ t: g.n, s: `${g.r} — ${g.c}`, k: 'مهمان', go: '#/guests', act: ['guest', String(i)], ic: 'users' }));
  VERDICTS.forEach(v => idx.push({ t: v.t, s: `${v.fa} — ${v.n} پرونده`, k: 'تصمیم', go: '#/gates', ic: 'gavel' }));
  return idx;
}
const INDEX = buildIndex();

function openCmdk(){
  $('#cmdk').hidden = false;
  const inp = $('#cmdkInput'); inp.value = ''; inp.focus();
  runSearch('');
}
function closeCmdk(){ const c = $('#cmdk'); if (c) c.hidden = true; }

function runSearch(q){
  const s = nz(q).trim().toLowerCase();
  RESULTS = s
    ? INDEX.filter(r => (r.t + ' ' + r.s + ' ' + r.k).toLowerCase().includes(s)).slice(0, 24)
    : INDEX.filter(r => r.k === 'بخش' || r.k === 'گیت').slice(0, 16);
  SEL = 0;
  const list = $('#cmdkList');
  if (!RESULTS.length) {
    list.innerHTML = `<div class="empty"><span class="empty__ic">${ic('search')}</span><b>نتیجه‌ای یافت نشد</b><span>عبارت دیگری را امتحان کنید</span></div>`;
    return;
  }
  let last = '', html = '';
  RESULTS.forEach((r, i) => {
    if (r.k !== last) { html += `<div class="cmdk__grp">${esc(r.k)}</div>`; last = r.k; }
    html += `<button class="cmdk__item ${i === SEL ? 'is-sel' : ''}" data-i="${i}" data-go="${r.go}" role="option">
      <span class="cmdk__ic ${r.k === 'گیت' || r.k === 'تصمیم' ? 'cmdk__ic--gold' : ''}">${r.k === 'گیت' || r.k === 'تصمیم' ? esc(r.t.slice(0, 3)) : ic(r.ic)}</span>
      <span class="cmdk__t"><b>${esc(r.t)}</b><span>${esc(r.s)}</span></span>
      ${ic('right')}
    </button>`;
  });
  list.innerHTML = nz(html);
}

function wireCmdk(){
  const inp = $('#cmdkInput');
  inp.addEventListener('input', () => runSearch(inp.value));
  $('#cmdk').querySelector('[data-cmdk-close]').addEventListener('click', closeCmdk);
  $('#cmdkList').addEventListener('click', e => {
    const b = e.target.closest('.cmdk__item'); if (b) pick(parseInt(b.dataset.i, 10));
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      SEL = Math.max(0, Math.min(RESULTS.length - 1, SEL + (e.key === 'ArrowDown' ? 1 : -1)));
      $$('.cmdk__item').forEach((n, i) => n.classList.toggle('is-sel', i === SEL));
      const n = $(`.cmdk__item[data-i="${SEL}"]`); if (n) n.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter') { e.preventDefault(); pick(SEL); }
  });
}
function pick(i){
  const r = RESULTS[i]; if (!r) return;
  closeCmdk();
  if (r.act) {
    if (r.act[0] === 'gate') import('./views/gates.js').then(m => m.gateDrawer(r.act[1]));
    if (r.act[0] === 'event') import('./views/eventfile.js').then(m => m.eventDrawer(r.act[1]));
    if (r.act[0] === 'permit') import('./views/permits.js').then(m => m.permitDrawer(r.act[1]));
    if (r.act[0] === 'guest') import('./views/guests.js').then(m => m.guestDrawer(r.act[1]));
  }
  if (r.go && location.hash !== r.go) location.hash = r.go;
}

/* ── print header ── */
function buildPrintHead(){
  const route = currentRoute();
  const h = $('#printHead');
  if (!h) return;
  h.innerHTML = nz(`
    <div class="printhead__l">
      <img src="assets/img/iran-mall-mark.webp" alt="">
      <div>
        <b>${esc(META.title)}</b>
        <span>${esc(META.titleEn)} — مرجع واحد ثبت، ارزیابی، تصویب، اجرا و پایش رویدادها</span>
      </div>
    </div>
    <div class="printhead__r">
      <b>${esc(route.t)}</b><br>
      سند ${esc(META.charterRef)} · نسخه ${esc(META.version)} · ${esc(META.period)}<br>
      ${esc(META.classification)} — تاریخ چاپ ${esc(stampNow())}
    </div>`);
}

/* ── clock ── */
function startClock(){
  const d = new Date();
  const j = Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { day: 'numeric' }).format(d);
  const m = Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { month: 'numeric' }).format(d);
  $('.todaycal__d').textContent = nz(j);
  $('.todaycal__m').textContent = nz(todayJalali());
  $('#railPeriod').textContent = nz(META.period);
  $('#footStamp').textContent = nz('آخرین به‌روزرسانی: ' + stampNow());
}

/* ── boot ── */
function boot(){
  document.documentElement.dataset.mode = 'executive';
  startClock();
  if (!location.hash) location.hash = '#/dashboard';
  render();
  wireGlobal();
  setTimeout(() => $('#boot').classList.add('is-done'), 620);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
