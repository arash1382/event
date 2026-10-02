/* ============================================================================
   views/dashboard.js — Hero + Executive Dashboard
   ========================================================================== */
import { META, SUMMARY, EVENTS, GATES, CORES, APPLICANTS, PRINCIPLES, CONFLICTS, PERMIT_STATS, ANALYTICS } from '../data.js';
import { ic, esc, ring, meter, trend, lvlBadge, fmt } from '../ui.js';

const CORE_NAME = Object.fromEntries(CORES.map(c => [c.id, c.name]));
const ST = { ok: ['badge--ok', 'GO'], progress: ['badge--info', 'در جریان'], warn: ['badge--warn', 'نیازمند تکمیل'], bad: ['badge--bad', 'مسدود'], new: ['badge--idle', 'تازه ثبت‌شده'], conditional: ['badge--gold', 'CONDITIONAL GO'] };

function hero(){
  const p = PRINCIPLES.map(x => `<span class="hero__rule"><i></i>${esc(x)}</span>`).join('');
  return `
  <section class="hero" aria-labelledby="heroTitle">
    <div class="hero__grid"></div><div class="hero__lattice"></div><div class="hero__orb"></div>
    <div class="hero__inner">
      <div>
        <span class="hero__seal">
          <img src="assets/img/iran-mall-mark.webp" alt="" aria-hidden="true">
          <b>شورای دبیرخانه مرکزی رویدادهای ایران‌مال</b>
        </span>
        <div class="hero__eyebrow">Event Governance Secretariat</div>
        <h1 id="heroTitle">دبیرخانه مرکزی راهبری و برگزاری رویدادهای <em>ایران‌مال</em></h1>
        <p class="hero__lede">
          مرجع واحد برای ثبت، ارزیابی، تصویب، اجرا و پایش تمامی رویدادهای ایران‌مال.
          هر رویداد از ایده تا اختتام مسیر <b>۱۳ مرحله‌ای چرخه عمر</b> را طی می‌کند و پیش از ورود به اجرا
          باید از <b>۱۴ گیت کنترلی</b> عبور کند؛ از همسویی استراتژیک و کیفیت محتوا تا HSE، حراست و مجوزها.
        </p>
        <div class="hero__act">
          <a class="btn btn--gold btn--lg" href="#/gates">${ic('gate')} مشاهده ۱۴ گیت کنترلی</a>
          <a class="btn btn--ghost btn--lg" href="#/event">${ic('file')} پرونده نمونه رویداد</a>
          <button class="btn btn--ghost btn--lg" data-action="act" data-act="print" type="button">${ic('print')} نسخه ویژه هیئت‌مدیره</button>
        </div>
        <div class="hero__rules">${p}</div>
      </div>

      <div class="herostat">
        <div class="herostat__card">
          <div class="herostat__hd"><b>آمادگی راهبری رویداد</b><span class="badge badge--gold">دوره ۱۴۰۵</span></div>
          <div style="position:relative">
            ${ring(SUMMARY.readiness)}
            <div class="herostat__ringT" style="position:absolute;inset:0"><b>${SUMMARY.readiness}٪</b><span>شاخص آمادگی کل</span></div>
          </div>
          <div class="herostat__mini">
            <div><b>${SUMMARY.pipeline}</b><span>پرونده فعال در خط تصویب</span></div>
            <div><b>${SUMMARY.compliance}٪</b><span>انطباق مجوز و الزامات</span></div>
            <div><b>${GATES.filter(g => g.status === 'passed').length} از ۱۴</b><span>گیت بسته‌شده دوره</span></div>
            <div><b>${SUMMARY.cycleDays} روز</b><span>میانگین چرخه تصویب</span></div>
          </div>
        </div>
        <div class="herostat__card">
          <div class="herostat__hd"><b>جریان زنده دبیرخانه</b><i class="dot dot--pulse"></i></div>
          <div class="herostat__feed">
            ${SUMMARY.feed.map(f => `
              <div class="feedrow">
                <span class="feedrow__dot ${f.k === 'ok' ? 'feedrow__dot--ok' : f.k === 'bad' ? 'feedrow__dot--bad' : f.k === 'info' ? 'feedrow__dot--info' : ''}"></span>
                <b>${esc(f.t)}</b><span>${esc(f.at)}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function kpis(){
  const items = [
    { l: 'رویداد فعال در دوره', v: SUMMARY.active, u: 'رویداد', cls: '', icn: 'calendar', foot: `<span>${SUMMARY.pipeline} پرونده در خط تصویب</span>` },
    { l: 'گیت‌های باز و الزامات', v: SUMMARY.gatesOpen, u: 'گیت', cls: 'kpi--warn', icn: 'gate', foot: `<span>${SUMMARY.atRisk} پرونده در معرض ریسک زمانی</span>` },
    { l: 'پاخور تجمعی دوره', v: '2.41', u: 'میلیون نفر', cls: 'kpi--gold', icn: 'users', foot: `${trend(8.4)}<span>نسبت به دوره پیش</span>` },
    { l: 'مجوزهای تعیین‌تکلیف‌نشده', v: SUMMARY.permitsOpen, u: `از ${SUMMARY.permitsTotal}`, cls: 'kpi--bad', icn: 'permit', foot: `<span>${PERMIT_STATS.avgLead} میانگین زمان اخذ</span>` },
    { l: 'تصمیم GO در اولین جلسه', v: SUMMARY.goRate, u: '٪', cls: 'kpi--ok', icn: 'gavel', foot: `<span>نرخ رد پرونده: ${SUMMARY.rejectRate}٪</span>` },
    { l: 'توقف رویداد به دلیل عدم انطباق', v: SUMMARY.stopped, u: 'مورد', cls: 'kpi--ok', icn: 'shield', foot: `<span>اختیار توقف HSE و حراست فعال</span>` }
  ];
  return `<section class="grid grid--3" aria-label="شاخص‌های کلیدی دبیرخانه">
    ${items.map((b, i) => `
      <article class="kpi${b.cls ? ' ' + b.cls : ''}" style="animation-delay:${i*40}ms">
        <div class="kpi__top">
          <div class="kpi__label">${esc(b.l)}</div>
          <span class="kpi__ic">${ic(b.icn)}</span>
        </div>
        <div class="kpi__val"><span data-count="${b.v}">0</span><small>${esc(b.u)}</small></div>
        <div class="kpi__foot">${b.foot}</div>
      </article>`).join('')}
  </section>`;
}

function gatePipeline(){
  const rows = GATES.map(g => {
    const tone = g.status === 'passed' ? 'ok' : g.status === 'warn' ? 'warn' : g.status === 'blocked' ? 'bad' : g.status === 'final' ? 'gold' : 'idle';
    return `<div class="gmast__row" data-action="gate" data-code="${g.code}" style="cursor:pointer" role="button" tabindex="0">
      <span class="gmast__id"><i>${g.code}</i><span class="gmast__name">${esc(g.fa)}</span></span>
      <span class="meter__track" style="width:100%"><span class="meter__fill ${tone === 'gold' ? 'meter--gold' : tone === 'warn' ? 'meter--warn' : tone === 'bad' ? 'meter--bad' : ''}" data-w="${g.progress}" style="${tone === 'ok' ? '' : ''}"></span></span>
      <span class="gmast__val">${g.progress}٪</span>
      <span class="gmast__st badge badge--${tone === 'gold' ? 'gold' : tone === 'idle' ? 'idle' : tone}">${g.status === 'passed' ? 'بسته' : g.status === 'warn' ? 'باز' : g.status === 'blocked' ? 'مسدود' : 'نهایی'}</span>
    </div>`;
  }).join('');
  return `<section class="panel">
    <div class="panel__head">
      <div><h3>وضعیت گیت‌های کنترلی در پرونده‌های جاری</h3><p>پیشرفت هر گیت بر پایه پرونده‌های در جریان دبیرخانه</p></div>
      <div class="legend">
        <span style="color:var(--ok-600)"><i></i>بسته‌شده</span>
        <span style="color:var(--warn-600)"><i></i>نیازمند تکمیل</span>
        <span style="color:var(--bad-600)"><i></i>مسدود</span>
        <span style="color:var(--gold-600)"><i></i>تصمیم نهایی</span>
      </div>
    </div>
    <div class="panel__body"><div class="gmast">${rows}</div></div>
    <div class="panel__foot">
      <span>برای مشاهده جزئیات هر گیت، روی ردیف آن کلیک کنید.</span>
      <a class="btn btn--sm btn--ghost" href="#/gates">${ic('layers')} نمای کامل گیت‌ها</a>
    </div>
  </section>`;
}

function portfolio(){
  const rows = EVENTS.slice(0, 7).map(ev => {
    const st = ST[ev.status] || ST.progress;
    return `<tr data-action="event" data-id="${ev.id}" style="cursor:pointer">
      <td><span class="tbl__code">${esc(ev.id)}</span></td>
      <td><div class="t-main">${esc(ev.t)}</div><div class="t-sub">${esc(ev.owner)} · ${esc(CORE_NAME[ev.core])}</div></td>
      <td>${lvlBadge(ev.lvl)}</td>
      <td><span class="badge badge--blue">${esc(ev.stage)}</span></td>
      <td><span class="t-num">${esc(ev.crowd)}</span></td>
      <td><span class="badge ${st[0]}">${esc(ev.verdict)}</span></td>
    </tr>`;
  }).join('');
  return `<section class="panel">
    <div class="panel__head panel__head--tint">
      <div><h3>پرونده‌های منتخب شورا</h3><p>رویدادهای سطح ۳ و ۴ در دست بررسی راهبری</p></div>
      <a class="btn btn--sm btn--ghost" href="#/calendar">${ic('calendar')} تقویم کامل</a>
    </div>
    <div class="tblwrap"><table class="tbl">
      <thead><tr><th>شناسه</th><th>عنوان رویداد</th><th>سطح</th><th>مرحله</th><th>مخاطب هدف</th><th>تصمیم</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </section>`;
}

function integrity(){
  const total = SUMMARY.byStatus.reduce((a, b) => a + b.n, 0);
  let acc = 0;
  const R = 62, C = 2 * Math.PI * R;
  const colors = { ok: '#1B8055', warn: '#C08823', bad: '#A93226', idle: '#5A6779' };
  const segs = SUMMARY.byStatus.map(s => {
    const frac = s.n / total;
    const el = `<circle r="${R}" cx="79" cy="79" fill="none" stroke="${colors[s.tone]}" stroke-width="17"
      stroke-dasharray="${(C * frac - 3).toFixed(2)} ${(C - C * frac + 3).toFixed(2)}"
      stroke-dashoffset="${(-C * acc).toFixed(2)}" style="transform:rotate(-90deg);transform-origin:79px 79px"/>`;
    acc += frac; return el;
  }).join('');

  return `<section class="panel">
    <div class="panel__head"><div><h3>ترکیب پرونده‌ها بر پایه وضعیت انطباق</h3><p>۱۲ پرونده در خط تصویب — ۳۴ رویداد فعال دوره</p></div></div>
    <div class="panel__body">
      <div class="donutwrap">
        <div class="donut">
          <svg viewBox="0 0 158 158"><circle r="${R}" cx="79" cy="79" fill="none" stroke="var(--ink-100)" stroke-width="17"/>${segs}</svg>
          <div class="donut__c"><b>${total}</b><span>پرونده در جریان</span></div>
        </div>
        <div class="donut__lg">
          ${SUMMARY.byStatus.map(s => `
            <button type="button" data-action="act" data-act="refresh">
              <i style="background:${colors[s.tone]}"></i>
              <span>${esc(s.k)}</span><b>${s.n}</b>
            </button>`).join('')}
        </div>
      </div>
      <div class="rule"></div>
      <div class="stat-inline">
        <div><b>${PERMIT_STATS.ok}</b><span>مجوز تعیین‌تکلیف‌شده</span></div>
        <div><b>${PERMIT_STATS.warn}</b><span>مجوز در جریان</span></div>
        <div><b>${PERMIT_STATS.bad}</b><span>مجوز رد یا منقضی</span></div>
        <div><b>${SUMMARY.cycleDays}</b><span>روز — میانگین چرخه</span></div>
      </div>
    </div>
  </section>`;
}

function applicantsPanel(){
  const total = APPLICANTS.reduce((a, b) => a + b.share, 0);
  return `<section class="panel">
    <div class="panel__head"><div><h3>متقاضیان ثبت درخواست رویداد</h3><p>سهم هر گروه از کل درخواست‌های دوره جاری</p></div>
      <span class="badge badge--blue">۶ گروه مجاز</span></div>
    <div class="panel__body" style="display:grid;gap:14px">
      ${APPLICANTS.map(a => `
        <div class="meter">
          <div class="meter__top"><span class="meter__name">${esc(a.n)} <em style="font-style:normal;color:var(--ink-350);font-weight:600">· ${esc(a.c)}</em></span><span class="meter__val">${a.share}٪</span></div>
          <div class="meter__track"><span class="meter__fill" data-w="${(a.share / total) * 100 * 2.4}" style="background:${a.color}"></span></div>
        </div>`).join('')}
    </div>
  </section>`;
}

function alertsPanel(){
  return `<section class="panel">
    <div class="panel__head panel__head--gold">
      <div><h3>هشدارهای تداخل تقویمی</h3><p>کنترل G1 — همسویی استراتژیک و عدم تداخل</p></div>
      <span class="badge badge--warn">${CONFLICTS.length} مورد باز</span>
    </div>
    <div class="panel__body" style="display:grid;gap:10px">
      ${CONFLICTS.map(c => {
        const sevMap = { l: ['sev--l', 'کم'], m: ['sev--m', 'متوسط'], h: ['sev--h', 'بالا'], c: ['sev--c', 'بحرانی'] };
        const s = sevMap[c.sev];
        return `<div class="conflict" style="border-color:${c.sev === 'c' ? 'var(--bad-bd)' : c.sev === 'l' ? 'var(--ink-150)' : 'var(--warn-bd)'};background:${c.sev === 'c' ? 'var(--bad-bg)' : c.sev === 'l' ? 'var(--ink-50)' : 'var(--warn-bg)'}">
          <span class="conflict__ic">${ic('alert')}</span>
          <div><b>${esc(c.t)}</b><p>${esc(c.a)} ↔ ${esc(c.b)}</p></div>
          <span class="sev ${s[0]}"><i></i>${s[1]}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="panel__foot"><span>تداخل‌های بحرانی پیش از صدور GO در G13 مسدود می‌شوند.</span>
      <a class="btn btn--sm btn--ghost" href="#/calendar">${ic('calendar')} بررسی تقویم</a></div>
  </section>`;
}

function execSummary(){
  const g = GATES.filter(x => !x.final);
  const closed = g.filter(x => x.status === 'passed').length;
  return `<section class="panel">
    <div class="panel__head"><div><h3>خلاصه اجرایی برای هیئت‌مدیره</h3><p>دوره راهبری ۱۴۰۵ — ${esc(META.charterRef)}</p></div>
      <span class="badge badge--solid">${esc(META.classification)}</span></div>
    <div class="panel__body" style="display:grid;gap:18px">
      <p style="font-size:var(--fs-sm);line-height:2;color:var(--ink-600)">
        در دوره جاری، دبیرخانه مرکزی <b>۳۴ رویداد فعال</b> و <b>۱۲ پرونده در خط تصویب</b> را راهبری می‌کند.
        <b>${closed} گیت از ۱۳ گیت عملیاتی</b> در سطح پرتفوی کاملاً بسته شده و <b>۹ الزام باز</b> عمدتاً در حوزه مجوزها و CRM متمرکز است.
        میانگین چرخه تصویب به <b>${SUMMARY.cycleDays} روز</b> رسیده و نرخ رد پرونده‌ها در گیت محتوا <b>${SUMMARY.rejectRate}٪</b> است.
        در همین دوره، <b>هیچ رویدادی</b> به دلیل عدم انطباق HSE متوقف نشده که نشان‌دهنده اثربخشی گیت‌های G11 و G12 است.
      </p>
      <div class="scorebox">
        <div class="score score--gold"><span class="score__v" data-count="${SUMMARY.readiness}">0</span><span class="score__l">شاخص آمادگی راهبری</span></div>
        <div class="score"><span class="score__v" data-count="${SUMMARY.compliance}">0</span><span class="score__l">انطباق مجوز و الزامات</span></div>
        <div class="score"><span class="score__v" data-count="${ANALYTICS.headline[1].v}">0</span><span class="score__l">رضایت مخاطب از ۵</span></div>
        <div class="score"><span class="score__v" data-count="${SUMMARY.goRate}">0</span><span class="score__l">نرخ GO در اولین جلسه</span></div>
      </div>
    </div>
  </section>`;
}

export default function dashboard(){
  return `
    ${hero()}
    ${kpis()}
    <div class="grid grid--sidebar">
      <div class="grid" style="gap:var(--s5)">${gatePipeline()}${portfolio()}</div>
      <div class="grid" style="gap:var(--s5)">${integrity()}${execSummary()}</div>
    </div>
    <div class="grid grid--sidebar-r">
      <div class="grid" style="gap:var(--s5)">${applicantsPanel()}</div>
      <div class="grid" style="gap:var(--s5)">${alertsPanel()}</div>
    </div>`;
}
