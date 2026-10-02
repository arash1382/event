/* ============================================================================
   views/guests.js — Guest & Speaker Review (Gate G3)
   ========================================================================== */
import { GUESTS, GUEST_STATS, SAMPLE } from '../data.js';
import { ic, esc, openDrawer, meter, checkRow } from '../ui.js';

const A = { ok: ['ok', 'تأییدشده', 'check'], warn: ['warn', 'در بررسی', 'clock'], bad: ['bad', 'ردشده', 'block'] };

const STEPS = [
  { t: 'دریافت فهرست اولیه مهمانان', d: 'مالک رویداد فهرست کامل با نقش و سطح حضور را ثبت می‌کند.', own: 'مالک رویداد', sla: 'هفته ۸ پیش از رویداد' },
  { t: 'احراز هویت و کنترل سوابق', d: 'حراست هویت فردی/حقوقی و سوابق را بررسی و تأییدیه صادر می‌کند.', own: 'حراست', sla: '≤ ۴ روز کاری' },
  { t: 'ارزیابی اعتبار و انطباق', d: 'دبیرخانه اعتبار حرفه‌ای، رسانه‌ای و تعارض منافع را می‌سنجد.', own: 'دبیرخانه', sla: '≤ ۳ روز کاری' },
  { t: 'بازبینی حقوقی تعهدات', d: 'حقوقی مفاد تعهد، حق‌الزحمه و شرایط لغو را کنترل می‌کند.', own: 'حقوقی', sla: '≤ ۵ روز کاری' },
  { t: 'تأیید نهایی و بایگانی', d: 'فهرست نهایی مهر و موم و در پرونده گیت G3 بایگانی می‌شود.', own: 'دبیرخانه + حراست', sla: 'پیش از G13' }
];

const CATS = ['همه', 'فرهنگی', 'هنری', 'بین‌الملل', 'ورزشی', 'رسانه', 'تجاری', 'سلامت', 'ویژه'];

export default function guests(){
  const rejected = GUESTS.filter(g => g.a !== 'ok');
  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">Guest &amp; Speaker Review</span>
      <h1>بررسی مهمانان و سخنرانان</h1>
      <p class="pagehead__lede">
        سوابق، نقش، اعتبار و انطباق سازمانی مهمانان و سخنرانان پیش از هر تعهد رسمی بررسی می‌شود.
        در صورت نیاز، پرونده به حراست و حقوقی ارجاع می‌گردد و تا صدور تأییدیه، هیچ تعهدی معتبر نیست.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="refresh" type="button">${ic('refresh')} استعلام پیشینه</button>
      <button class="btn btn--primary" data-action="act" data-act="export" type="button">${ic('download')} فهرست نهایی مهمانان</button>
    </div>
  </header>

  <section class="grid grid--6">
    ${[
      { l: 'کل مهمانان ثبت‌شده', v: GUEST_STATS.total, cls: '', icn: 'users' },
      { l: 'تأییدشده', v: GUEST_STATS.approved, cls: 'kpi--ok', icn: 'check' },
      { l: 'در انتظار تأیید', v: GUEST_STATS.pending, cls: 'kpi--warn', icn: 'clock' },
      { l: 'ردشده', v: GUEST_STATS.rejected, cls: 'kpi--bad', icn: 'block' },
      { l: 'مهمان ویژه', v: GUEST_STATS.vip, cls: 'kpi--gold', icn: 'star' },
      { l: 'میانگین زمان بررسی', v: GUEST_STATS.avgDays, cls: '', icn: 'gauge' }
    ].map(b => `<article class="kpi ${b.cls}">
      <div class="kpi__top"><div class="kpi__label">${esc(b.l)}</div><span class="kpi__ic">${ic(b.icn)}</span></div>
      <div class="kpi__val"><span data-count="${b.v}">0</span></div>
    </article>`).join('')}
  </section>

  <section class="panel">
    <div class="panel__head">
      <div><h3>فهرست بررسی مهمانان</h3><p>وضعیت هر مهمان در گیت G3 — برای مشاهده پرونده روی ردیف کلیک کنید</p></div>
      <span class="badge badge--warn">${rejected.length} مورد نیازمند اقدام</span>
    </div>
    <div class="panel__body panel__body--tight">
      <div style="padding:14px 16px 0">
        <div class="filters" data-filter-scope>
          <button class="fchip is-on" data-action="filter" data-filter="all" type="button">همه دسته‌ها</button>
          ${['ok', 'warn', 'bad'].map(s => `<button class="fchip" data-action="filter" data-filter="${s}" type="button">${A[s][1]} <span class="fchip__n">${GUESTS.filter(g => g.a === s).length}</span></button>`).join('')}
        </div>
      </div>
      <div style="padding:0 6px 6px;margin-top:10px">
        ${GUESTS.map((g, i) => `
          <div class="guestrow" data-facet="${g.a}" data-action="guest" data-idx="${i}" style="cursor:pointer">
            <span class="avatar ${g.a === 'ok' ? '' : g.a === 'warn' ? 'avatar--gold' : ''}">${esc(g.n.slice(0, 2))}</span>
            <div class="guestrow__n"><b>${esc(g.n)}</b><span>${esc(g.r)}</span></div>
            <span class="guestrow__x"><span class="tag tag--blue">${esc(g.c)}</span></span>
            <span class="guestrow__x hint">${esc(g.s)}</span>
            <span class="badge badge--${A[g.a][0]}">${ic(A[g.a][2])} ${A[g.a][1]}</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="panel__foot">
      <span>هیچ مهمان ویژه‌ای بدون تأییدیه کتبی حراست، اجازه حضور در مسیر ویژه و سالن VIP ندارد.</span>
      <span class="badge badge--gold">${ic('shield')} کنترل اجباری حراست</span>
    </div>
  </section>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head"><div><h3>گردش کار بررسی — گیت G3</h3><p>پنج گام مصوب از دریافت فهرست تا بایگانی</p></div>
        <span class="badge badge--blue">۷ روز کاری</span></div>
      <div class="panel__body" style="display:grid;gap:11px">
        ${STEPS.map((s, i) => `
          <div class="accessrow" style="border-color:var(--blue-100);background:var(--blue-25)">
            <span class="accessrow__ic" style="background:var(--blue-600);color:#fff;border-color:var(--blue-700);font-weight:900;font-size:var(--fs-2xs)">${i + 1}</span>
            <div><b>${esc(s.t)}</b><span>${esc(s.d)}</span></div>
            <div style="display:grid;gap:4px;justify-items:end">
              <span class="badge badge--outline">${esc(s.own)}</span>
              <span class="hint">${esc(s.sla)}</span>
            </div>
          </div>`).join('')}
      </div>
    </section>

    <div class="grid" style="gap:var(--s5);align-content:start">
      <section class="panel">
        <div class="panel__head panel__head--gold"><div><h3>معیارهای ارزیابی مهمان</h3><p>چک‌لیست رسمی گیت G3</p></div>${ic('target')}</div>
        <div class="panel__body"><div class="checks">
          ${checkRow('احراز هویت فردی و حقوقی', 'ok')}
          ${checkRow('سوابق حرفه‌ای و رسانه‌ای', 'ok')}
          ${checkRow('تعیین نقش و سطح حضور', 'ok')}
          ${checkRow('کنترل تعارض منافع و انطباق سازمانی', 'ok')}
          ${checkRow('کنترل پیشینه اظهارنظرهای عمومی', 'warn')}
          ${checkRow('تأییدیه حراست برای مهمان ویژه', 'warn')}
          ${checkRow('نظر حقوقی درباره مفاد تعهد و لغو', 'warn')}
        </div></div>
      </section>

      <section class="panel">
        <div class="panel__head"><div><h3>نقاط ارجاع اجباری</h3><p>مواردی که خارج از دبیرخانه تصمیم می‌گیرند</p></div>${ic('flow')}</div>
        <div class="panel__body" style="display:grid;gap:10px">
          <div class="authority"><span class="authority__n" style="background:var(--blue-700)">SEC</span>
            <div style="flex:1"><b>حراست</b><span>مهمانان ویژه، هیئت‌های خارجی، سوابق امنیتی</span></div>
            <span class="badge badge--bad">اجباری</span></div>
          <div class="authority"><span class="authority__n" style="background:var(--blue-700)">LEG</span>
            <div style="flex:1"><b>حقوقی</b><span>تعهد مالی، حق‌الزحمه، شرایط لغو و پیام حقوقی</span></div>
            <span class="badge badge--bad">اجباری</span></div>
          <div class="authority"><span class="authority__n" style="background:var(--blue-700)">PR</span>
            <div style="flex:1"><b>روابط عمومی</b><span>هماهنگی رسانه‌ای و پیام برند سخنران</span></div>
            <span class="badge badge--warn">توصیه‌شده</span></div>
          <div class="authority"><span class="authority__n" style="background:var(--blue-700)">OPS</span>
            <div style="flex:1"><b>عملیات</b><span>پروتکل استقبال، مسیر ویژه و پذیرایی</span></div>
            <span class="badge badge--warn">توصیه‌شده</span></div>
        </div>
      </section>
    </div>
  </div>`;
}

/* ── guest drawer ── */
export function guestDrawer(idx){
  const g = GUESTS[Number(idx)];
  if (!g) return;
  const a = A[g.a];
  openDrawer({
    eyebrow: a[1],
    title: g.n,
    html: `
      <div style="display:grid;gap:var(--s5)">
        <div style="display:flex;flex-wrap:wrap;gap:9px;align-items:center">
          <span class="avatar avatar--lg ${g.a === 'ok' ? '' : 'avatar--gold'}">${esc(g.n.slice(0, 2))}</span>
          <span class="badge badge--${a[0]} badge--lg">${a[1]}</span>
          <span class="badge badge--blue">${esc(g.c)}</span>
          <span class="badge badge--outline">${esc(g.link)}</span>
        </div>

        <div class="kv">
          <div class="kv__row"><span class="kv__k">نقش در رویداد</span><span class="kv__v">${esc(g.r)}</span></div>
          <div class="kv__row"><span class="kv__k">حوزه تخصصی</span><span class="kv__v">${esc(g.c)}</span></div>
          <div class="kv__row"><span class="kv__k">پرونده رویداد</span><span class="kv__v ltr">${esc(g.link)}</span></div>
          <div class="kv__row"><span class="kv__k">نتیجه بررسی</span><span class="kv__v">${esc(g.s)}</span></div>
        </div>

        ${meter('پیشرفت بررسی گیت G3', g.a === 'ok' ? '۱۰۰٪' : g.a === 'warn' ? '۶۲٪' : '۱۰۰٪', g.a === 'ok' ? 'ok' : g.a === 'warn' ? 'warn' : 'bad', g.a === 'ok' ? 100 : g.a === 'warn' ? 62 : 100)}

        <div class="panel" style="box-shadow:none">
          <div class="panel__head"><div><h3>کنترل‌های انجام‌شده</h3><p>چک‌لیست گیت G3 برای این مهمان</p></div><span class="badge badge--gold">G3</span></div>
          <div class="panel__body"><div class="checks">
            ${checkRow('احراز هویت فردی و حقوقی', 'ok')}
            ${checkRow('کنترل سوابق حرفه‌ای', 'ok')}
            ${checkRow('تعیین نقش و سطح حضور', 'ok')}
            ${checkRow('کنترل تعارض منافع', g.a === 'ok' ? 'ok' : 'warn')}
            ${checkRow('تأییدیه کتبی حراست', g.a === 'ok' ? 'ok' : g.a === 'warn' ? 'warn' : 'bad')}
            ${checkRow('بازبینی تعهد و مفاد قرارداد', g.a === 'ok' ? 'ok' : g.a === 'warn' ? 'warn' : 'bad')}
          </div></div>
        </div>

        ${g.a === 'bad'
          ? `<div class="note note--bad">${ic('block')}<div><b>دلیل رد:</b> تعارض قراردادی با یک اسپانسر رقیب در همان بازه اجرا. حضور این فرد تا رفع تعارض و تأیید مجدد حقوقی، در هیچ رویداد ایران‌مال مجاز نیست.</div></div>`
          : g.a === 'warn'
            ? `<div class="note note--warn">${ic('alert')}<div><b>اقدام لازم:</b> پرونده در انتظار تأییدیه حراست یا نظر حقوقی است. تا دریافت پاسخ، هیچ تعهد مالی یا اعلام رسمی حضور مجاز نیست.</div></div>`
            : `<div class="note note--ok">${ic('check')}<div><b>تأییدشده:</b> این مهمان مجاز به حضور با نقش مصوب است. مسیر ویژه، پروتکل استقبال و هماهنگی رسانه‌ای در Run Sheet اجرا درج شده است.</div></div>`}

        <div class="note note--gold">${ic('shield')}<div>تأیید شفاهی برای حضور هیچ مهمانی معتبر نیست؛ حضور در ایران‌مال تنها با تأییدیه مکتوب و ثبت در پرونده رویداد امکان‌پذیر است.</div></div>
      </div>`
  });
}
