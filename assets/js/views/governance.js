/* ============================================================================
   views/governance.js — Governance Overview · Council Structure · Lifecycle
   ========================================================================== */
import { META, CORES, PARTNERS, PHASES, LEVELS, GATES, PRINCIPLES, SUMMARY } from '../data.js';
import { ic, esc, meter } from '../ui.js';

const pagehead = (eyebrow, h1, lede, actions = '') => `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">${esc(eyebrow)}</span>
      <h1>${h1}</h1>
      <p class="pagehead__lede">${lede}</p>
    </div>
    <div class="pagehead__actions">${actions}</div>
  </header>`;

/* ══════════════════════════ GOVERNANCE OVERVIEW ══════════════════════════ */
const MISSION = [
  { t: 'ثبت تمامی رویدادها', ic: 'file' },
  { t: 'ارزیابی و تصویب رویدادها', ic: 'check' },
  { t: 'مدیریت تقویم رویدادها', ic: 'calendar' },
  { t: 'کنترل الزامات قانونی', ic: 'scale' },
  { t: 'کنترل الزامات عملیاتی', ic: 'runsheet' },
  { t: 'کنترل الزامات ایمنی و امنیتی', ic: 'shield' },
  { t: 'کنترل کیفیت محتوایی', ic: 'star' },
  { t: 'مدیریت تجربه مخاطب', ic: 'heart' },
  { t: 'افزایش اثربخشی تجاری', ic: 'chart' },
  { t: 'ثبت و تحلیل نتایج رویدادها', ic: 'analytics' }
];

const CADENCE = [
  { t: 'جلسه هفتگی شورای دبیرخانه', d: 'بررسی پرونده‌های آماده G13 و صدور تصمیم نهایی', sla: 'هر دوشنبه', own: 'دبیر شورا' },
  { t: 'بازبینی روزانه پرونده‌های در بحران', d: 'پایش الزامات باز و پرونده‌های دارای ریسک زمانی', sla: 'روزانه ۰۹:۰۰', own: 'دبیرخانه' },
  { t: 'جلسه ماهانه هیئت‌مدیره', d: 'گزارش تجمعی KPI، رویدادهای سطح ۴ و تصمیم‌های استراتژیک', sla: 'ابتدای هر ماه', own: 'هیئت‌مدیره' },
  { t: 'بازبینی کمیته HSE و حراست', d: 'اعتبارسنجی طرح‌های ایمنی و امنیتی رویدادهای سطح ۳ و ۴', sla: 'هر دو هفته', own: 'HSE و حراست' },
  { t: 'نشست ارزیابی پس از رویداد', d: 'سنجش KPI، عملکرد پیمانکار و ثبت درس‌آموخته‌ها', sla: '۷ روز پس از رویداد', own: 'هسته تخصصی' }
];

function overview(){
  return `
  ${pagehead('Governance Overview', 'نمای راهبری دبیرخانه',
    'دبیرخانه مرکزی، مرجع واحد برنامه‌ریزی، ارزیابی، تصویب، اجرا و پایش تمامی رویدادهای ایران‌مال است. این نما، مأموریت، دامنه کنترل و اصول بنیادین این نظام راهبری را در یک قاب اجرایی ارائه می‌کند.',
    `<a class="btn btn--ghost" href="#/council">${ic('council')} ساختار شورا</a>
     <a class="btn btn--primary" href="#/gates">${ic('gate')} ۱۴ گیت کنترلی</a>`)}

  <section class="grid grid--4" aria-label="شاخص‌های راهبری">
    <article class="kpi"><div class="kpi__top"><div class="kpi__label">مأموریت‌های مصوب دبیرخانه</div><span class="kpi__ic">${ic('target')}</span></div>
      <div class="kpi__val"><span data-count="10">0</span><small>مأموریت</small></div>
      <div class="kpi__foot"><span>در ۹ دامنه کنترل</span></div></article>
    <article class="kpi kpi--gold"><div class="kpi__top"><div class="kpi__label">اصول پایه غیرقابل عبور</div><span class="kpi__ic">${ic('lock')}</span></div>
      <div class="kpi__val"><span data-count="7">0</span><small>اصل</small></div>
      <div class="kpi__foot"><span>لازم‌الاجرا در همه سطوح</span></div></article>
    <article class="kpi"><div class="kpi__top"><div class="kpi__label">هسته تخصصی فعال</div><span class="kpi__ic">${ic('council')}</span></div>
      <div class="kpi__val"><span data-count="4">0</span><small>هسته</small></div>
      <div class="kpi__foot"><span>فرهنگی، گردشگری، ورزش و سلامت، مارکتینگ</span></div></article>
    <article class="kpi"><div class="kpi__top"><div class="kpi__label">واحد همکار در فرآیند</div><span class="kpi__ic">${ic('building')}</span></div>
      <div class="kpi__val"><span data-count="12">0</span><small>واحد</small></div>
      <div class="kpi__foot"><span>از بهره‌برداری تا حراست و HSE</span></div></article>
  </section>

  <section class="grid grid--sidebar">
    <div class="panel">
      <div class="panel__head"><div><h3>مأموریت دبیرخانه — مرجع واحد رویداد</h3><p>ده مأموریت مصوب شورای مرکزی</p></div>
        <span class="badge badge--blue">بند ۲ سند راهبری</span></div>
      <div class="panel__body">
        <div class="grid grid--2" style="gap:12px">
          ${MISSION.map((m, i) => `
            <div class="principle">
              <span class="principle__n">${i + 1}</span>
              <div style="display:flex;gap:9px;align-items:center">
                <span style="color:var(--blue-600);display:grid;place-items:center;width:18px">${ic(m.ic)}</span>
                <b>${esc(m.t)}</b>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="grid" style="gap:var(--s5);align-content:start">
      <div class="panel">
        <div class="panel__head panel__head--tint"><div><h3>چشم‌انداز</h3><p>بند ۳ سند راهبری</p></div>${ic('globe')}</div>
        <div class="panel__body">
          <p style="font-size:var(--fs-lg);font-weight:800;line-height:1.9;color:var(--blue-800);letter-spacing:-.015em">
            تبدیل ایران‌مال به <span style="color:var(--gold-700)">حرفه‌ای‌ترین مقصد رویدادمحور کشور</span>
            با نظام استاندارد مدیریت رویداد مبتنی بر فرآیند، داده و کنترل ریسک.
          </p>
          <div class="rule"></div>
          <div class="kv">
            <div class="kv__row"><span class="kv__k">مبنای عملکرد</span><span class="kv__v">فرآیند‌محور · داده‌محور · ریسک‌محور</span></div>
            <div class="kv__row"><span class="kv__k">سطح انتظار</span><span class="kv__v">استاندارد سازمانی قابل حسابرسی</span></div>
            <div class="kv__row"><span class="kv__k">افزایش تمرکز</span><span class="kv__v">اثربخشی تجاری و تجربه مخاطب</span></div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel__head panel__head--gold"><div><h3>اصول پایه — غیرقابل عبور</h3><p>بند ۱۱ سند راهبری</p></div>${ic('lock')}</div>
        <div class="panel__body"><div class="principles">
          ${PRINCIPLES.map((p, i) => `<div class="principle"><span class="principle__n">${i + 1}</span><b>${esc(p)}</b></div>`).join('')}
        </div></div>
      </div>
    </div>
  </section>

  <section class="panel">
    <div class="panel__head"><div><h3>آهنگ راهبری و مراجع تصمیم</h3><p>تقویم جلسات و اختیارات مصوب شورای مرکزی رویدادها</p></div>
      <span class="badge badge--gold">${esc(META.period)}</span></div>
    <div class="tblwrap"><table class="tbl">
      <thead><tr><th>نشست</th><th>دستور کار</th><th>مرجع برگزاری</th><th>تواتر</th></tr></thead>
      <tbody>${CADENCE.map(c => `<tr>
        <td class="t-main">${esc(c.t)}</td>
        <td style="color:var(--ink-500)">${esc(c.d)}</td>
        <td><span class="badge badge--outline">${esc(c.own)}</span></td>
        <td><span class="tbl__code">${esc(c.sla)}</span></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </section>

  <section class="panel">
    <div class="panel__head"><div><h3>سطح‌بندی رویداد و مرجع تصویب</h3><p>هر سطح، الزامات، مرجع تصویب و مهلت متفاوتی دارد</p></div>
      <a class="btn btn--sm btn--ghost" href="#/lifecycle">${ic('lifecycle')} چرخه عمر</a></div>
    <div class="panel__body">
      <div class="grid grid--4">
        ${LEVELS.map(l => `
          <article class="panel" style="box-shadow:none;border-color:var(--ink-150)">
            <div class="panel__body" style="display:grid;gap:11px">
              <span class="lvl lvl--${l.n}"><span class="lvl__bars"><i></i><i></i><i></i><i></i></span><span class="lvl__txt">سطح ${l.n}</span></span>
              <h4 style="font-size:var(--fs-md);font-weight:900">${esc(l.t)}</h4>
              <p class="hint" style="line-height:1.8">${esc(l.d)}</p>
              <div class="rule" style="margin:4px 0"></div>
              <div class="kv kv--stack">
                <div class="kv__row"><span class="kv__k">مرجع تصویب</span><span class="kv__v" style="font-size:var(--fs-2xs)">${esc(l.approver)}</span></div>
                <div class="kv__row"><span class="kv__k">حداقل مهلت</span><span class="kv__v" style="font-size:var(--fs-2xs);color:var(--gold-700)">${esc(l.sla)}</span></div>
              </div>
            </div>
          </article>`).join('')}
      </div>
    </div>
  </section>`;
}

/* ══════════════════════════ COUNCIL STRUCTURE ══════════════════════════ */
function coreCard(c){
  const idx = CORES.indexOf(c) + 1;
  return `
  <article class="core core--${idx}">
    <div class="core__hd">
      <span class="core__no">${esc(c.no)}</span>
      <b>هسته ${esc(c.name)}</b>
      <span>${esc(c.en)}</span>
    </div>
    <div class="core__bd">
      <p class="hint" style="line-height:1.8">${esc(c.scope)}</p>
      <div>
        <div class="core__cap">مسئول بررسی</div>
        <ul class="core__list" style="margin-top:8px">${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>
      <div class="core__gates">
        <span class="core__cap" style="align-self:center;margin-inline-end:4px">گیت‌های محوری</span>
        ${c.gates.map(g => `<span class="badge badge--gold">${esc(g)}</span>`).join('')}
      </div>
      <div class="kv" style="border-top:1px dashed var(--ink-150);padding-top:9px">
        <div class="kv__row" style="padding:0"><span class="kv__k">مسئول هسته</span><span class="kv__v" style="font-size:var(--fs-2xs)">${esc(c.owner)}</span></div>
        <div class="kv__row" style="padding:0;border:0"><span class="kv__k">پرونده در جریان</span><span class="kv__v" style="font-size:var(--fs-2xs)">${c.load} پرونده</span></div>
      </div>
    </div>
  </article>`;
}

function council(){
  return `
  ${pagehead('Council Structure', 'ساختار شورای دبیرخانه مرکزی رویدادها',
    'شورا از یک هسته راهبری مرکزی و چهار هسته تخصصی تشکیل شده و دوازده واحد همکار، اجرای عملیاتی و کنترل‌های تخصصی را پوشش می‌دهند. هر پرونده پس از غربالگری، به هسته تخصصی متناظر ارجاع می‌شود.',
    `<a class="btn btn--ghost" href="#/gates">${ic('gate')} نقش گیت‌ها در ساختار</a>
     <button class="btn btn--primary" data-action="act" data-act="export" type="button">${ic('download')} خروجی چارت</button>`)}

  <section class="panel">
    <div class="panel__head"><div><h3>چارت سازمانی راهبری رویداد</h3><p>سلسله‌مراتب تصمیم از شورای مرکزی تا واحدهای همکار</p></div>
      <span class="badge badge--blue">بند ۴ سند راهبری</span></div>
    <div class="council">
      <div class="council__apex">
        <span class="council__apexChip">${ic('gavel')} مرجع عالی تصمیم‌گیری رویداد</span>
        <div class="council__apexCard">
          <b>شورای دبیرخانه مرکزی رویدادهای ایران‌مال</b>
          <span>IRAN MALL CENTRAL EVENT COUNCIL</span>
        </div>
        <div class="taglist" style="justify-content:center;margin-top:6px">
          <span class="tag tag--blue">تصویب نهایی GO / NO-GO</span>
          <span class="tag tag--blue">تعیین سطح رویداد</span>
          <span class="tag tag--blue">رفع تداخل تقویمی</span>
          <span class="tag tag--gold">توقف رویداد غیرمنطبق</span>
        </div>
      </div>

      <div class="council__branches">
        ${CORES.map(coreCard).join('')}
      </div>

      <div class="partners" style="margin-top:var(--s5)">
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">
          <div><h3 style="font-size:var(--fs-md);font-weight:900">واحدهای همکار</h3>
            <p class="hint">دوازده واحد که بر پایه نوع رویداد در ارزیابی، اجرا و کنترل مشارکت می‌کنند</p></div>
          <span class="badge badge--outline">${PARTNERS.length} واحد</span>
        </div>
        <div class="partners__grid">
          ${PARTNERS.map(p => `
            <div class="partner">
              <span class="partner__c">${esc(p.c)}</span>
              <span>${esc(p.n)}</span>
              <span class="partner__g">${p.gates.join('/')}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="panel__foot">
      <span>ارجاع اجباری: مهمانان و سخنرانان حساس به حراست و حقوقی؛ طرح ایمنی به HSE و آتش‌نشانی؛ اسناد مالی به مالی و حقوقی.</span>
    </div>
  </section>

  <div class="grid grid--sidebar">
    <div class="panel">
      <div class="panel__head"><div><h3>مسیر ارجاع و تشدید پرونده</h3><p>از غربالگری تا تصمیم نهایی شورا</p></div>${ic('flow')}</div>
      <div class="panel__body" style="display:grid;gap:11px">
        ${[
          { n: 1, t: 'دریافت و ثبت درخواست', d: 'دبیرخانه شناسه یکتا صادر و پرونده را رسمی می‌کند.', w: 'دبیرخانه' },
          { n: 2, t: 'غربالگری و تعیین سطح', d: 'کنترل کامل بودن پرونده و طبقه‌بندی سطح ۱ تا ۴.', w: 'دبیرخانه + بهره‌برداری' },
          { n: 3, t: 'ارجاع به هسته تخصصی', d: 'هسته متناظر ارزیابی محتوایی و تجاری را انجام می‌دهد.', w: '۴ هسته تخصصی' },
          { n: 4, t: 'کنترل‌های موازی تخصصی', d: 'مالی، حقوقی، HSE، حراست و IT هم‌زمان بررسی می‌کنند.', w: 'واحدهای همکار' },
          { n: 5, t: 'تجمیع و تصمیم شورا', d: 'دبیر پرونده را در G13 به تصمیم GO / CONDITIONAL GO / NO-GO می‌رساند.', w: 'شورای مرکزی' },
          { n: 6, t: 'پایش میدانی و ارزیابی', d: 'ناظر دبیرخانه در روز اجرا حاضر و گزارش نهایی ثبت می‌شود.', w: 'دبیرخانه + HSE + حراست' }
        ].map(s => `
          <div class="accessrow" style="border-color:var(--blue-100);background:var(--blue-25)">
            <span class="accessrow__ic" style="background:var(--blue-600);color:#fff;border-color:var(--blue-700);font-weight:900;font-size:var(--fs-2xs)">${s.n}</span>
            <div><b>${esc(s.t)}</b><span>${esc(s.d)}</span></div>
            <span class="badge badge--blue">${esc(s.w)}</span>
          </div>`).join('')}
      </div>
    </div>

    <div class="panel">
      <div class="panel__head panel__head--gold"><div><h3>اختیارات ویژه در ساختار</h3><p>مواردی که خارج از مسیر عادی تصمیم می‌گیرند</p></div>${ic('shield')}</div>
      <div class="panel__body" style="display:grid;gap:12px">
        <div class="note note--bad">${ic('shield')}<div><b>حق توقف HSE و حراست</b> — این دو واحد می‌توانند رویداد غیرمنطبق را در هر مرحله تا زمان رفع نقص متوقف کنند؛ توقف نیازمند تأیید هیچ مرجع دیگری نیست.</div></div>
        <div class="note">${ic('scale')}<div><b>ممیزی حقوقی مستقل</b> — حقوقی می‌تواند بدون درخواست هسته، هر پرونده دارای تعهد یا مجوز را بازبینی کند.</div></div>
        <div class="note note--gold">${ic('wallet')}<div><b>کنترل مالی پیش از اجرا</b> — مالی تا امضای قرارداد و پوشش بیمه، هیچ هزینه اجرایی را تخصیص نمی‌دهد.</div></div>
        <div class="note note--ok">${ic('gavel')}<div><b>تصمیم مشروط</b> — شورا می‌تواند اجرا را به تکمیل فهرست الزامات و تأیید دبیرخانه مشروط کند.</div></div>
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════ EVENT LIFECYCLE ══════════════════════════ */
function lifecycle(){
  const gateOf = Object.fromEntries(GATES.map(g => [g.code, g]));
  return `
  ${pagehead('Event Lifecycle', 'چرخه عمر رویداد — سیزده مرحله',
    'هر رویداد از ایده تا اختتام، مسیر سیزده مرحله‌ای مصوب را طی می‌کند. در هر مرحله خروجی مشخص، مسئول مشخص و گیت کنترلی متناظر تعریف شده است. ورود به مرحله بعد تا تکمیل خروجی مرحله قبل مجاز نیست.',
    `<a class="btn btn--ghost" href="#/event">${ic('file')} پرونده نمونه</a>
     <a class="btn btn--primary" href="#/gates">${ic('gate')} ۱۴ گیت کنترلی</a>`)}

  <section class="panel">
    <div class="panel__head">
      <div><h3>مسیر سیزده‌مرحله‌ای رویداد</h3><p>مراحل طلایی، نقاط اتصال به گیت‌های کنترلی را نشان می‌دهند</p></div>
      <div class="legend">
        <span style="color:var(--blue-600)"><i></i>مرحله عملیاتی</span>
        <span style="color:var(--gold-600)"><i></i>مرحله دارای گیت</span>
        <span style="color:var(--ink-400)"><i></i>اختتام و بایگانی</span>
      </div>
    </div>
    <div class="panel__body panel__body--tight">
      <div class="cycle" style="padding:18px 16px">
        <div class="cycle__track">
          ${PHASES.map(p => `
            <article class="phase ${p.gate ? 'phase--gate' : ''} ${p.n === 13 ? 'phase--final' : ''}">
              <span class="phase__n">${p.n}</span>
              <h4 class="phase__t">${esc(p.t)}</h4>
              <p class="phase__d">${esc(p.d)}</p>
              <div class="phase__f">
                <div class="phase__meta">
                  <span class="tag ${p.gate && p.n !== 13 ? 'tag--gold' : ''}" style="font-size:9px">خروجی: ${esc(p.out)}</span>
                </div>
                <div class="phase__meta">
                  <span class="badge ${p.gate ? 'badge--gold' : 'badge--idle'}">${p.gate ? esc(p.gate) : 'بدون گیت'}</span>
                  <span class="badge badge--outline">${esc(p.sla)}</span>
                </div>
              </div>
            </article>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head"><div><h3>نقشه مرحله ↔ گیت</h3><p>هر مرحله به کدام کنترل‌ها متصل است و مسئول آن کیست</p></div>
        <span class="badge badge--blue">۱۳ مرحله · ۱۴ گیت</span></div>
      <div class="tblwrap"><table class="tbl">
        <thead><tr><th>مرحله</th><th>خروجی الزامی</th><th>گیت‌های متصل</th><th>مهلت مصوب</th><th>مالک فرآیند</th></tr></thead>
        <tbody>${PHASES.map(p => {
          const a = p.gate ? p.gate.split(' · ') : [];
          return `<tr>
            <td><div class="t-main"><span class="tbl__code" style="margin-inline-end:7px">${p.n}</span>${esc(p.t)}</div></td>
            <td style="color:var(--ink-500);font-weight:600">${esc(p.out)}</td>
            <td>${a.length ? a.map(c => `<span class="badge badge--gold" style="margin-inline-end:4px">${esc(c)}</span>`).join('') : '<span class="badge badge--idle">—</span>'}</td>
            <td><span class="t-num">${esc(p.sla)}</span></td>
            <td style="color:var(--ink-500);font-weight:600">${esc(a[0] && gateOf[a[0]] ? gateOf[a[0]].owner : (p.n >= 10 && p.n <= 13 ? 'دبیرخانه — پایش و ارزیابی' : 'دبیرخانه'))}</td>
          </tr>`;
        }).join('')}</tbody>
      </table></div>
    </section>

    <div class="grid" style="gap:var(--s5);align-content:start">
      <section class="panel">
        <div class="panel__head"><div><h3>سطح‌بندی رویداد</h3><p>سطح ۱ تا ۴ بر پایه مخاطب، ریسک و اثر</p></div>${ic('layers')}</div>
        <div class="panel__body" style="display:grid;gap:13px">
          ${LEVELS.map(l => `
            <div class="panel" style="box-shadow:none">
              <div class="panel__body" style="padding:13px;display:grid;gap:9px">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
                  <span class="lvl lvl--${l.n}"><span class="lvl__bars"><i></i><i></i><i></i><i></i></span><span class="lvl__txt">سطح ${l.n}</span></span>
                  <b style="font-size:var(--fs-sm);font-weight:900">${esc(l.t)}</b>
                </div>
                <p class="hint">${esc(l.d)}</p>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <span class="badge badge--outline">${esc(l.approver)}</span>
                  <span class="badge badge--gold">حداقل ${esc(l.sla)}</span>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </section>

      <section class="panel">
        <div class="panel__head panel__head--tint"><div><h3>کارایی چرخه در دوره جاری</h3><p>میانگین عملکرد در برابر هدف</p></div>${ic('gauge')}</div>
        <div class="panel__body" style="display:grid;gap:15px">
          ${meter('میانگین چرخه تصویب (هدف ۳۰ روز)', `${SUMMARY.cycleDays} روز`, 'ok', Math.round((SUMMARY.cycleDays / 30) * 100))}
          ${meter('تکمیل مدارک در مهلت مقرر', '۸۴٪', 'ok', 84)}
          ${meter('صدور شناسه در ۲۴ ساعت', '۹۶٪', 'gold', 96)}
          ${meter('تصویب در اولین جلسه شورا', `${SUMMARY.goRate}٪`, 'warn', SUMMARY.goRate)}
          ${meter('بستن پرونده در ۱۴ روز پس از رویداد', '۷۹٪', 'warn', 79)}
        </div>
      </section>
    </div>
  </div>`;
}

export default function governance(ctx){
  const r = ctx && ctx.route;
  if (r === 'council') return council();
  if (r === 'lifecycle') return lifecycle();
  return overview();
}
