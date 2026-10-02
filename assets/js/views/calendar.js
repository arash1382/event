/* ============================================================================
   views/calendar.js — Event Calendar (Jalali) with conflict control
   ========================================================================== */
import { EVENTS, CONFLICTS, CORES, LEVELS } from '../data.js';
import { ic, esc, buildMonth, wireDynamics, lvlBadge, toGregorian } from '../ui.js';
import { eventDrawer } from './eventfile.js';

const CORE_NAME = Object.fromEntries(CORES.map(c => [c.id, c.name]));
const ST = {
  ok: ['ok', 'GO'], progress: ['info', 'در جریان'], warn: ['warn', 'نیازمند تکمیل'],
  bad: ['bad', 'مسدود'], new: ['idle', 'تازه ثبت'], conditional: ['gold', 'CONDITIONAL GO']
};
const TONE = { ok: 'ok', progress: '', warn: 'warn', bad: 'bad', new: '', conditional: 'gold' };

/* مهر ۱۴۰۵ = ماه مرجع داده‌های پرتفوی؛ روزهای بزرگ‌تر به آبان منتقل می‌شوند */
const M0 = 7, LEN0 = 30;

function spread(ev){
  const out = [];
  for (let d = ev.start; d <= ev.end; d++) {
    if (d <= LEN0) out.push({ m: M0, d });
    else out.push({ m: M0 + 1, d: d - LEN0 });
  }
  return out;
}
function eventsOn(m, d){
  return EVENTS.filter(ev => spread(ev).some(x => x.m === m && x.d === d));
}
function monthEvents(m){
  return EVENTS.filter(ev => spread(ev).some(x => x.m === m));
}

let offset = 0;

function monthTitle(mo){
  const g1 = toGregorian(mo.y, mo.m, 1);
  const g2 = toGregorian(mo.y, mo.m, mo.len);
  const f = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `<span class="calbar__title">${esc(mo.name)} ${mo.y}<small>${f(g1)} — ${f(g2)} ${g2.getFullYear()}</small></span>`;
}
function bar(mo){
  const evs = monthEvents(mo.m);
  const crowd = evs.reduce((a, e) => a + Number(String(e.crowd).replace(/[^\d]/g, '')) * 0 + 1, 0);
  return `<div class="calbar">
    <div class="calbar__nav">
      <button class="iconbtn" data-cal-nav="-1" type="button" aria-label="ماه قبل">${ic('right')}</button>
      ${monthTitle(mo)}
      <button class="iconbtn" data-cal-nav="1" type="button" aria-label="ماه بعد">${ic('left')}</button>
      <button class="btn btn--sm btn--ghost" data-cal-nav="reset" type="button">${ic('target')} ماه جاری</button>
    </div>
    <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
      <div class="stat-inline">
        <div><b>${evs.length}</b><span>رویداد در ماه</span></div>
        <div><b>${evs.filter(e => e.lvl >= 3).length}</b><span>سطح ۳ و ۴</span></div>
        <div><b>${CONFLICTS.length}</b><span>هشدار تداخل باز</span></div>
      </div>
    </div>
  </div>`;
}

function grid(mo){
  const dows = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
  const head = dows.map(d => `<div class="cal__dow">${d}</div>`).join('');
  const todayObj = mo.today;
  const cells = mo.cells.map((c, i) => {
    if (!c) return `<div class="cal__cell cal__cell--off"></div>`;
    const evs = eventsOn(c.m, c.d);
    const isToday = todayObj && c.y === todayObj.y && c.m === todayObj.m && c.d === todayObj.d;
    const isHoliday = (i % 7) === 6;
    const heavy = evs.length >= 3;
    const shown = evs.slice(0, 3);
    const g = new Date();
    return `<div class="cal__cell ${isToday ? 'cal__cell--today' : ''} ${isHoliday ? 'cal__cell--off' : ''} ${heavy ? 'cal__cell--peak' : ''}">
      <div class="cal__day">
        ${isToday ? `<b>${c.d}</b>` : c.d}
        <em>${heavy ? `${evs.length} رویداد` : (isHoliday ? 'تعطیل' : '')}</em>
      </div>
      ${shown.map(ev => `
        <button class="ev ev--${TONE[ev.status] || ''}" data-action="event" data-id="${ev.id}" type="button" title="${esc(ev.t)}">
          <b>${esc(ev.t)}</b>
          <span>${esc(ev.id)} · سطح ${ev.lvl}</span>
        </button>`).join('')}
      ${evs.length > 3 ? `<div class="cal__more">+ ${evs.length - 3} رویداد دیگر</div>` : ''}
    </div>`;
  }).join('');
  return `<div class="calwrap"><div class="cal">${head}${cells}</div></div>`;
}

function legend(){
  return `<div class="panel__foot" style="border-top:1px solid var(--ink-100)">
    <div class="legend">
      <span style="color:var(--blue-600)"><i></i>در جریان</span>
      <span style="color:var(--gold-600)"><i></i>تصمیم مشروط</span>
      <span style="color:var(--ok-600)"><i></i>GO صادرشده</span>
      <span style="color:var(--warn-600)"><i></i>نیازمند تکمیل</span>
      <span style="color:var(--bad-600)"><i></i>مسدود / NO-GO</span>
      <span style="color:var(--stop-600)"><i></i>توقف‌یافته</span>
    </div>
    <span>هفته کاری ایران‌مال: شنبه تا جمعه · روز تعطیل: جمعه</span>
  </div>`;
}

function monthPanel(mo){
  return `<section class="panel">
    ${bar(mo)}
    <div id="calHost">${grid(mo)}</div>
    ${legend()}
  </section>`;
}

function listPanel(mo){
  const evs = monthEvents(mo.m).slice().sort((a, b) => a.start - b.start);
  return `<section class="panel">
    <div class="panel__head"><div><h3>فهرست رویدادهای ${esc(mo.name)} ${mo.y}</h3><p>به ترتیب تاریخ شروع</p></div>
      <span class="badge badge--blue">${evs.length} رویداد</span></div>
    <div class="tblwrap"><table class="tbl">
      <thead><tr><th>بازه</th><th>شناسه</th><th>عنوان رویداد</th><th>هسته</th><th>سطح</th><th>مرحله</th><th>مخاطب</th><th>تصمیم</th></tr></thead>
      <tbody>${evs.map(ev => {
        const s = ST[ev.status] || ST.progress;
        return `<tr data-action="event" data-id="${ev.id}" style="cursor:pointer">
          <td><span class="t-num">${ev.start}–${ev.end}</span></td>
          <td><span class="tbl__code">${esc(ev.id)}</span></td>
          <td><div class="t-main">${esc(ev.t)}</div><div class="t-sub">${esc(ev.place)}</div></td>
          <td>${esc(CORE_NAME[ev.core])}</td>
          <td>${lvlBadge(ev.lvl)}</td>
          <td><span class="badge badge--blue">${esc(ev.stage)}</span></td>
          <td><span class="t-num">${esc(ev.crowd)}</span></td>
          <td><span class="badge badge--${s[0]}">${esc(ev.verdict)}</span></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>
  </section>`;
}

function conflictsPanel(){
  const sevMap = { l: ['sev--l', 'کم'], m: ['sev--m', 'متوسط'], h: ['sev--h', 'بالا'], c: ['sev--c', 'بحرانی'] };
  return `<section class="panel">
    <div class="panel__head panel__head--gold">
      <div><h3>کنترل تداخل تقویمی</h3><p>گیت G1 — هیچ رویدادی با تداخل بحرانی تأیید نمی‌شود</p></div>
      <span class="badge badge--warn">${CONFLICTS.length} مورد</span>
    </div>
    <div class="panel__body" style="display:grid;gap:10px">
      ${CONFLICTS.map(c => {
        const s = sevMap[c.sev];
        return `<div style="display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 13px;border-radius:var(--r-md);border:1px solid ${c.sev === 'c' ? 'var(--bad-bd)' : c.sev === 'l' ? 'var(--ink-150)' : 'var(--warn-bd)'};background:${c.sev === 'c' ? 'var(--bad-bg)' : c.sev === 'l' ? 'var(--ink-50)' : 'var(--warn-bg)'}">
          <span class="accessrow__ic" style="background:#fff">${ic('alert')}</span>
          <div><b style="font-size:var(--fs-xs);font-weight:800">${esc(c.t)}</b>
            <p class="hint" style="margin-top:3px">${esc(c.a)} ↔ ${esc(c.b)}</p></div>
          <span class="sev ${s[0]}"><i></i>${s[1]}</span>
        </div>`;
      }).join('')}
    </div>
  </section>`;
}

function windowPanel(mo){
  const peak = [];
  for (let d = 1; d <= mo.len; d++) {
    const e = eventsOn(mo.m, d);
    if (e.length) peak.push({ d, n: e.length, crowd: e.reduce((a, x) => a + Math.round(Number(String(x.crowd).replace(/[^\d]/g, '')) / 1000), 0) });
  }
  const max = Math.max(1, ...peak.map(p => p.crowd));
  return `<section class="panel">
    <div class="panel__head"><div><h3>پنجره‌های ازدحام ماه</h3><p>شدت تردد پیش‌بینی‌شده بر پایه مخاطب هدف رویدادها</p></div>${ic('activity')}</div>
    <div class="panel__body" style="display:grid;gap:12px">
      <div class="heatcal" style="grid-template-columns:repeat(auto-fit,minmax(18px,1fr))">
        ${Array.from({ length: mo.len }, (_, i) => {
          const d = i + 1, e = eventsOn(mo.m, d);
          const lvl = e.length === 0 ? 0 : Math.max(1, Math.min(5, Math.round((e.reduce((a, x) => a + Number(String(x.crowd).replace(/[^\d]/g, '')), 0) / 40000) * 5)));
          return `<i data-i="${lvl}" title="${d} ${mo.name} — ${e.length} رویداد"></i>`;
        }).join('')}
      </div>
      <div class="legend">
        <span style="color:var(--ink-200)"><i></i>بدون رویداد</span>
        <span style="color:var(--blue-300)"><i></i>سبک</span>
        <span style="color:var(--blue-600)"><i></i>متوسط</span>
        <span style="color:var(--gold-500)"><i></i>پیک ازدحام</span>
      </div>
      <div class="rule" style="margin:6px 0"></div>
      <div class="kv kv--stack">
        <div class="kv__row"><span class="kv__k">روزهای دارای رویداد</span><span class="kv__v">${peak.length} روز از ${mo.len}</span></div>
        <div class="kv__row"><span class="kv__k">شلوغ‌ترین روز</span><span class="kv__v">${peak.length ? (peak.sort((a, b) => b.crowd - a.crowd)[0].d + ' ' + mo.name) : '—'}</span></div>
        <div class="kv__row"><span class="kv__k">محدودیت هم‌زمانی سطح ۳</span><span class="kv__v">حداکثر ۱ رویداد</span></div>
      </div>
      <div class="note note--gold">${ic('alert')}<div>هیچ دو رویداد سطح ۳ و ۴ نمی‌توانند در یک روز و مکان مشترک اجرا شوند؛ این قاعده در G1 و G6 کنترل می‌شود.</div></div>
    </div>
  </section>`;
}

export default function calendar(){
  offset = 0;
  const mo = buildMonth(0);
  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">Event Calendar</span>
      <h1>تقویم راهبردی رویدادهای ایران‌مال</h1>
      <p class="pagehead__lede">
        تقویم مرجع دبیرخانه، همه رویدادهای ثبت‌شده را با سطح، مرحله و وضعیت تصویب نشان می‌دهد.
        کنترل تداخل، تخصیص مکان و ظرفیت بهره‌برداری بر پایه همین تقویم انجام می‌شود.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="sync" type="button">${ic('refresh')} همگام‌سازی تقویم</button>
      <button class="btn btn--primary" data-action="act" data-act="export" type="button">${ic('download')} خروجی تقویم</button>
    </div>
  </header>

  <div data-tabs>
    <div class="tabs" role="tablist">
      <button role="tab" aria-selected="true" data-action="tab" data-tab="month" type="button">${ic('calendar')} نمای ماهانه</button>
      <button role="tab" aria-selected="false" data-action="tab" data-tab="list" type="button">${ic('list')} فهرست رویدادها</button>
      <button role="tab" aria-selected="false" data-action="tab" data-tab="conf" type="button">${ic('alert')} تداخل‌ها و پنجره‌ها</button>
    </div>

    <div class="tabpanel" data-panel="month">${monthPanel(mo)}</div>
    <div class="tabpanel" data-panel="list" hidden>${listPanel(mo)}</div>
    <div class="tabpanel" data-panel="conf" hidden>
      <div class="grid grid--sidebar">${conflictsPanel()}<div>${windowPanel(mo)}</div></div>
    </div>
  </div>`;
}

/* month navigation — re-renders only the month panel */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-cal-nav]');
  if (!b) return;
  const v = b.dataset.calNav;
  offset = v === 'reset' ? 0 : offset + Number(v);
  const host = document.getElementById('calHost');
  if (!host) return;
  const mo = buildMonth(offset);
  host.innerHTML = grid(mo);
  wireDynamics(host);
  const oldBar = host.closest('.panel').querySelector('.calbar');
  if (oldBar) oldBar.outerHTML = bar(mo);
});
