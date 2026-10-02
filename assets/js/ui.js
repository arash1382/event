/* ============================================================================
   ui.js — DOM, iconography, formatting and micro-interaction helpers
   ========================================================================== */

/* ── digit normalisation: one consistent numeral system across the platform ── */
const DIGIT_MAP = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9',
  '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9',
  '٬':',','٫':'.','؜':'' };
export function nz(s){ return typeof s === 'string' ? s.replace(/[۰-۹٠-٩٬٫\u061c]/g, c => DIGIT_MAP[c] ?? c) : s; }

export function esc(s){
  return nz(String(s ?? ''))
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── icon set — 24×24 stroke geometry ── */
const P = {
  dashboard:'<path d="M3 13h8V3H3zM13 21h8v-8h-8zM13 9h8V3h-8zM3 21h8v-6H3z"/>',
  lifecycle:'<path d="M12 3a9 9 0 019 9 9 9 0 01-9 9M5 12H3m2-5.5L3.5 5M5 17.5L3.5 19"/><circle cx="12" cy="12" r="3.2"/>',
  gate:'<path d="M4 21V6l8-3 8 3v15M8 21V10M12 21V10M16 21V10M2 21h20"/>',
  council:'<path d="M12 3v5M6 21v-5a2 2 0 012-2h8a2 2 0 012 2v5M9 8h6l1 3H8zM4 21v-3M20 21v-3M2 21h4M18 21h4"/>',
  file:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5M9 13h6M9 17h4"/>',
  calendar:'<path d="M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zM8 3v4M16 3v4M4 10h16"/><path d="M8 14h3v3H8z"/>',
  runsheet:'<path d="M9 5h11M9 12h11M9 19h11M4 5l1.4 1.4L7.5 4.5M4 12l1.4 1.4L7.5 10.5M4 19l1.4 1.4L7.5 17.5"/>',
  permit:'<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6M9 14l2 2 4-4"/>',
  hse:'<path d="M12 3l8 3v6c0 5-3.4 8.4-8 9.6C7.4 20.4 4 17 4 12V6zM12 8v5M12 15.5v.5"/>',
  security:'<path d="M12 3l7.5 3v6.2c0 4.8-3.1 8.2-7.5 9.4-4.4-1.2-7.5-4.6-7.5-9.4V6z"/><circle cx="12" cy="11" r="2.2"/><path d="M12 13.2V16"/>',
  analytics:'<path d="M4 20V4M4 20h16M8 17v-5M12.5 17V8M17 17v-8.5"/>',
  users:'<path d="M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 21a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.8M17.5 21a6.5 6.5 0 00-3-5.5"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16.4 16.4"/>',
  check:'<path d="M20 6.5L9.6 17 4 11.6"/>',
  alert:'<path d="M12 4l9 16H3zM12 10v4.2M12 17.2v.3"/>',
  block:'<circle cx="12" cy="12" r="8.4"/><path d="M6.2 6.2l11.6 11.6"/>',
  clock:'<circle cx="12" cy="12" r="8.4"/><path d="M12 7.2V12l3.4 2"/>',
  gavel:'<path d="M14 3l7 7-2.6 2.6-7-7zM10.4 6.6l-7 7L6 16.2l7-7zM12.5 15.5L21 24M3 21h9"/>',
  print:'<path d="M7 9V3h10v6M7 19H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2M7 15h10v6H7z"/>',
  present:'<path d="M3 4h18v11H3zM8 20h8M12 15v5"/>',
  up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
  down:'<path d="M12 5v14M18 13l-6 6-6-6"/>',
  flat:'<path d="M5 12h14"/>',
  shield:'<path d="M12 3l7.5 3v6.2c0 4.8-3.1 8.2-7.5 9.4-4.4-1.2-7.5-4.6-7.5-9.4V6z"/>',
  flame:'<path d="M12 21c3.9 0 6.5-2.4 6.5-5.8 0-4.3-4.2-6.2-4.9-11.2-2.4 1.6-3.7 3.9-3.7 6.2 0 .9.2 1.7.5 2.4-1-.5-1.7-1.5-2-2.7-1.3 1.6-2.9 3.1-2.9 5.3C5.5 18.6 8.1 21 12 21z"/>',
  heart:'<path d="M12 20s-7-4.3-7-9.4A4.1 4.1 0 0112 8a4.1 4.1 0 017 2.6C19 15.7 12 20 12 20z"/>',
  key:'<circle cx="8" cy="8" r="4.2"/><path d="M11 11l8 8M16 16l2-2 2 2"/>',
  doc:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5"/>',
  chart:'<path d="M3 3v18h18M7 16l3.5-4 3 2.4L18 8"/>',
  flow:'<circle cx="5" cy="6" r="2.4"/><circle cx="19" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M7.4 6h9.2M6.3 8.1L11 15.6M17.7 8.1L13 15.6"/>',
  building:'<path d="M4 21V4a1 1 0 011-1h9a1 1 0 011 1v17M15 10h4a1 1 0 011 1v10M3 21h18M7.5 7h4M7.5 11h4M7.5 15h4"/>',
  scale:'<path d="M12 3v18M6 21h12M4 7h16M4 7l-2.5 5a2.9 2.9 0 005 0zM20 7l2.5 5a2.9 2.9 0 01-5 0zM8 7l4-1.6L16 7"/>',
  wallet:'<path d="M3 8a2 2 0 012-2h13a1 1 0 011 1v1M3 8v9a2 2 0 002 2h13a1 1 0 001-1v-3M3 8h16a1 1 0 011 1v2h-4a2 2 0 000 4h4"/>',
  megaphone:'<path d="M3 11v2a1 1 0 001 1h2l7 4V6L6 10H4a1 1 0 00-1 1zM17 8.5a5 5 0 010 7M20 6a8 8 0 010 12"/>',
  qr:'<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM16 18h4v2h-4zM14 18h.01"/>',
  truck:'<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  star:'<path d="M12 3.5l2.7 5.6 6.1.8-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.9l6.1-.8z"/>',
  globe:'<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.4 2.4 3.6 5.3 3.6 8.6S14.4 18.2 12 20.6C9.6 18.2 8.4 15.3 8.4 12S9.6 5.8 12 3.4z"/>',
  activity:'<path d="M3 12h4l2.5-6 3.5 12 2.5-6H21"/>',
  lock:'<path d="M6 11h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1zM8.5 11V8a3.5 3.5 0 017 0v3"/>',
  map:'<path d="M9 4l6 2 6-2v14l-6 2-6-2-6 2V6zM9 4v14M15 6v14"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  right:'<path d="M14 6l-6 6 6 6"/>',
  left:'<path d="M10 6l6 6-6 6"/>',
  down2:'<path d="M6 10l6 6 6-6"/>',
  refresh:'<path d="M4 12a8 8 0 0113.6-5.7L20 8M20 4v4h-4M20 12a8 8 0 01-13.6 5.7L4 16M4 20v-4h4"/>',
  download:'<path d="M12 3v12M7.5 10.5L12 15l4.5-4.5M4 20h16"/>',
  info:'<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.4M12 7.9v.3"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
  layers:'<path d="M12 3l9 4.5-9 4.5-9-4.5zM3 12.5L12 17l9-4.5M3 17L12 21.5 21 17"/>',
  target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1"/>',
  flag:'<path d="M5 21V4M5 5h11l-1.6 3.4L16 12H5z"/>',
  radio:'<circle cx="12" cy="12" r="2.2"/><path d="M7.5 7.5a6.4 6.4 0 000 9M16.5 7.5a6.4 6.4 0 010 9M4.6 4.6a10.5 10.5 0 000 14.8M19.4 4.6a10.5 10.5 0 010 14.8"/>',
  lightning:'<path d="M13 3L5 13.5h5.5L11 21l8-10.5h-5.5z"/>',
  briefcase:'<path d="M3 8h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1zM8.5 8V6a2 2 0 012-2h3a2 2 0 012 2v2M3 13h18"/>',
  camera:'<path d="M3 8h3.5L8 5.5h8L17.5 8H21a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13.5" r="3.4"/>',
  ribbon:'<circle cx="12" cy="9" r="5.4"/><path d="M9 13.6L7 21l5-2.6L17 21l-2-7.4"/>',
  gauge:'<path d="M4 18a9 9 0 1116 0"/><path d="M12 18l3.6-5"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'
};

export function ic(name, cls = ''){
  const d = P[name] || P.info;
  const c = cls ? ` class="${cls}"` : '';
  return `<svg viewBox="0 0 24 24"${c} aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

/* ── DOM ── */
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

export function mount(host, html){
  host.innerHTML = nz(html);
  return host;
}

/* ── micro-interactions: run after every mount ── */
let io;
export function wireDynamics(root = document){
  // width / height driven meters, bars, rings
  $$('[data-w]', root).forEach(n => {
    const v = n.dataset.w;
    if (n.dataset.done === '1') return;
    n.dataset.done = '1';
    requestAnimationFrame(() => requestAnimationFrame(() => { n.style.width = v + '%'; }));
  });
  $$('[data-h]', root).forEach(n => {
    const v = n.dataset.h;
    requestAnimationFrame(() => requestAnimationFrame(() => { n.style.height = v + '%'; }));
  });
  $$('[data-ring]', root).forEach(n => {
    const pct = parseFloat(n.dataset.ring);
    const c = n.querySelector('.fl'); if (!c) return;
    const r = parseFloat(c.getAttribute('r'));
    const C = 2 * Math.PI * r;
    c.style.strokeDasharray = C;
    c.style.strokeDashoffset = C;
    requestAnimationFrame(() => requestAnimationFrame(() => { c.style.strokeDashoffset = C * (1 - pct / 100); }));
  });
  $$('[data-dash]', root).forEach(n => {
    const pct = parseFloat(n.dataset.dash);
    const c = n.querySelector('circle'); if (!c) return;
    const r = parseFloat(c.getAttribute('r'));
    const C = 2 * Math.PI * r;
    c.style.strokeDasharray = `${(C * pct) / 100} ${C}`;
  });

  // count-up
  if (!io) io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const n = e.target; io.unobserve(n);
      if (n.dataset.counted === '1') return;
      n.dataset.counted = '1';
      const raw = n.dataset.count;
      const target = parseFloat(raw);
      if (isNaN(target)) { n.textContent = raw; return; }
      const dec = (raw.split('.')[1] || '').length;
      const dur = 950; const t0 = performance.now();
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur);
        const e2 = 1 - Math.pow(1 - p, 3);
        const v = target * e2;
        n.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .25 });
  $$('[data-count]', root).forEach(n => io.observe(n));
}

/* ── number formatting ── */
export const fmt = n => Number(n).toLocaleString('en-US');
export const pct = n => n + '٪';
export const fa = n => fmt(n);

/* ── Jalali calendar engine ── */
const J_DAYS = ['شنبه','یک‌شنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه'];
const J_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

function jalaliOf(d){
  const f = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year:'numeric', month:'numeric', day:'numeric' });
  const parts = {};
  for (const p of f.formatToParts(d)) if (p.type !== 'literal') parts[p.type] = parseInt(p.value.replace(/\D/g,''), 10);
  return { y: parts.year, m: parts.month, d: parts.day };
}
function jalaliMonthLength(y, m){
  if (m <= 6) return 31;
  if (m <= 11) return 30;
  return isLeapJ(y) ? 30 : 29;
}
function isLeapJ(y){ return ((y + 12) % 33) % 4 === 1 || [1,5,9,13,17,22,26,30].includes(((y + 12) % 33)); }

export const J = { DAYS: J_DAYS, MONTHS: J_MONTHS, of: jalaliOf, len: jalaliMonthLength };

/* Saturday = 0 ... Friday = 6  (Persian week starts Saturday) */
export function jWeekday(d){ return (d.getDay() + 1) % 7; }

export function todayJalali(){
  const j = jalaliOf(new Date());
  return `${J_MONTHS[j.m - 1]} ${j.y}`;
}
export function stampNow(){
  const d = new Date(), j = jalaliOf(d);
  const hh = String(d.getHours()).padStart(2,'0'), mm = String(d.getMinutes()).padStart(2,'0');
  return `${j.y}/${String(j.m).padStart(2,'0')}/${String(j.d).padStart(2,'0')} — ${hh}:${mm}`;
}

/* build the Persian month grid for a given offset (0 = current month) */
export function buildMonth(offset = 0){
  const now = new Date();
  const j = jalaliOf(now);
  let y = j.y, m = j.m + offset;
  while (m > 12) { m -= 12; y++; }
  while (m < 1) { m += 12; y--; }
  const len = jalaliMonthLength(y, m);
  // find gregorian date of jalali (y,m,1)
  const first = jToG(y, m, 1);
  const lead = jWeekday(first);
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= len; d++) cells.push({ d, y, m });
  while (cells.length % 7 !== 0) cells.push(null);
  return { y, m, name: J_MONTHS[m - 1], len, cells, today: j };
}
function jToG(jy, jm, jd){
  // convert via a known anchor: 1 Farvardin 1399 = 20 March 2020
  const anchor = new Date(2020, 2, 20);
  let days = 0;
  const daysIn = (y, m) => m <= 6 ? 31 : m <= 11 ? 30 : (isLeapJ(y) ? 30 : 29);
  if (jy >= 1399) {
    for (let y = 1399; y < jy; y++) days += isLeapJ(y) ? 366 : 365;
    for (let m = 1; m < jm; m++) days += daysIn(jy, m);
  } else {
    for (let y = jy; y < 1399; y++) days -= isLeapJ(y) ? 366 : 365;
    for (let m = 1; m < jm; m++) days -= daysIn(jy, m);
  }
  days += jd - 1;
  const g = new Date(anchor); g.setDate(g.getDate() + days); return g;
}
export const toGregorian = (y, m, d) => jToG(y, m, d);
export function gDayOfMonth(cell){ const g = jToG(cell.y, cell.m, cell.d); return { dom: g.getDate(), month: g.getMonth() }; }

/* ── drawer ── */
export function openDrawer({ eyebrow, title, html }){
  const d = $('#drawer');
  $('#drawerEyebrow').textContent = nz(eyebrow || '');
  $('#drawerTitle').textContent = nz(title || '');
  $('#drawerBody').innerHTML = nz(html || '');
  d.hidden = false;
  document.body.style.overflow = 'hidden';
  wireDynamics(d);
  $('#drawer').querySelector('[data-drawer-close]').focus({ preventScroll:true });
}
export function closeDrawer(){
  const d = $('#drawer'); if (!d || d.hidden) return;
  d.hidden = true; document.body.style.overflow = '';
}

/* ── toast ── */
let toastT;
export function toast(msg){
  const t = $('#toast');
  t.textContent = nz(msg); t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => { t.hidden = true; }, 3200);
}

/* ── small builders ── */
export function ring(pctVal, { size = 132, w = 8, tone = 'url(#heroGrad)', cls = '' } = {}){
  const r = (size - w) / 2, C = 2 * Math.PI * r;
  return `<div class="herostat__ring ${cls}" data-ring="${pctVal}" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 ${size} ${size}">
      <defs><linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#EACCA1"/><stop offset="1" stop-color="#BE9048"/></linearGradient></defs>
      <circle class="tr" cx="${size/2}" cy="${size/2}" r="${r}"/>
      <circle class="fl" cx="${size/2}" cy="${size/2}" r="${r}" style="stroke:${tone}"/>
    </svg>
  </div>`;
}
export function gauge(pctVal, label, tone){
  const size = 106, w = 9, r = (size - w) / 2;
  const colors = { ok:'#1B8055', gold:'#BE9048', warn:'#C08823', bad:'#A93226' };
  return `<div class="gauge">
    <div class="gauge__w" data-ring="${pctVal}">
      <svg viewBox="0 0 ${size} ${size}">
        <circle class="tr" cx="${size/2}" cy="${size/2}" r="${r}"/>
        <circle class="fl" cx="${size/2}" cy="${size/2}" r="${r}" style="stroke:${colors[tone] || colors.ok}"/>
      </svg>
      <div class="gauge__t"><b data-count="${pctVal}">0</b><span>٪</span></div>
    </div>
    <span class="gauge__lb">${esc(label)}</span>
  </div>`;
}
export function meter(label, value, tone = '', numeric = null){
  const w = numeric == null ? 100 : Math.max(0, Math.min(100, numeric));
  return `<div class="meter ${tone ? 'meter--' + tone : ''}">
    <div class="meter__top"><span class="meter__name">${esc(label)}</span><span class="meter__val">${esc(value)}</span></div>
    <div class="meter__track"><span class="meter__fill" data-w="${w}"></span></div>
  </div>`;
}
export function lvlBadge(n, name){
  const names = { 1:'کوچک', 2:'متوسط', 3:'پرمخاطب', 4:'استراتژیک' };
  return `<span class="lvl lvl--${n}"><span class="lvl__bars"><i></i><i></i><i></i><i></i></span><span class="lvl__txt">سطح ${n} · ${esc(name || names[n])}</span></span>`;
}
export function trend(v){
  const dir = v > 0 ? 'up' : v < 0 ? 'down' : 'flat';
  return `<span class="trend trend--${dir}">${ic(dir)}${Math.abs(v).toFixed(1)}٪</span>`;
}
export function checkRow(text, st = 'ok'){
  const map = { ok:'check', open:'clock', warn:'alert', bad:'block' };
  return `<div class="check check--${st}"><span class="check__ic">${ic(map[st] || 'check')}</span><span>${esc(text)}</span></div>`;
}
export function statBlock(b, cls = ''){
  return `<article class="kpi ${cls}">
    <div class="kpi__top">
      <div><div class="kpi__label">${esc(b.l)}</div></div>
      ${b.ic ? `<span class="kpi__ic">${ic(b.ic)}</span>` : ''}
    </div>
    <div class="kpi__val"><span data-count="${nz(String(b.v)).replace(/,/g,'')}">0</span><small>${esc(b.u || '')}</small></div>
    ${b.foot ? `<div class="kpi__foot">${b.foot}</div>` : ''}
  </article>`;
}
