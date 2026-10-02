/* ============================================================================
   views/safety.js — HSE & Fire Safety  ·  Security & Order
   ========================================================================== */
import { HSE, SECURITY, SAMPLE } from '../data.js';
import { ic, esc, gauge, meter, checkRow } from '../ui.js';

const sevTone = n => n >= 5 ? 'c' : n === 4 ? 'h' : n === 3 ? 'm' : 'l';
const cellTone = s => s >= 20 ? 'c' : s >= 12 ? 'h' : s >= 6 ? 'm' : 'l';

function riskMatrix(){
  const counts = {};
  HSE.riskAssessment.forEach(r => { const k = r.prob + ':' + r.sev; counts[k] = (counts[k] || 0) + 1; });
  const rows = [5, 4, 3, 2, 1].map(sev => {
    const cells = [1, 2, 3, 4, 5].map(prob => {
      const n = counts[prob + ':' + sev];
      const score = prob * sev;
      const tone = cellTone(score);
      return `<div class="rcell ${n ? 'rcell--' + tone : 'is-empty'}" title="احتمال ${prob} × شدت ${sev}">
        ${n ? `<span>${n}</span>` : ''}${n ? `<span class="rcell__n">${score}</span>` : ''}
      </div>`;
    }).join('');
    return `<div class="riskmatrix__lh">شدت ${sev}</div>${cells}`;
  }).join('');
  const heads = [1, 2, 3, 4, 5].map(p => `<div class="riskmatrix__h">${p}</div>`).join('');
  return `<div class="riskmatrix" style="display:grid;grid-template-columns:auto repeat(5,minmax(0,1fr));gap:5px">
    <div></div>${heads}${rows}
    <div></div><div class="riskmatrix__h" style="grid-column:2/-1">احتمال وقوع ←</div>
  </div>`;
}

function hsePage(){
  const stops = HSE.stops;
  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">HSE &amp; Fire Safety</span>
      <h1>داشبورد ایمنی، بهداشت و آتش‌نشانی</h1>
      <p class="pagehead__lede">
        ارزیابی ریسک، مسیر خروج اضطراری، کنترل ازدحام، حریق و کمک‌های اولیه پیش از هر اجرا تأیید می‌شود.
        HSE حق دارد رویداد غیرمنطبق را در هر مرحله متوقف کند؛ این اختیار مشروط به تأیید مرجع دیگری نیست.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="refresh" type="button">${ic('refresh')} بازبینی ارزیابی ریسک</button>
      <button class="btn btn--primary" data-action="act" data-act="print" type="button">${ic('print')} گزارش ایمنی رویداد</button>
    </div>
  </header>

  <section class="grid grid--4">
    <article class="kpi kpi--bad"><div class="kpi__top"><div class="kpi__label">اختیار توقف رویداد</div><span class="kpi__ic">${ic('shield')}</span></div>
      <div class="kpi__val" style="font-size:var(--fs-xl)">فعال</div>
      <div class="kpi__foot"><span>بدون نیاز به تأیید سایر مراجع</span></div></article>
    <article class="kpi kpi--ok"><div class="kpi__top"><div class="kpi__label">توقف منجر به لغو رویداد</div><span class="kpi__ic">${ic('check')}</span></div>
      <div class="kpi__val"><span data-count="${stops[0].n}">0</span><small>مورد</small></div>
      <div class="kpi__foot"><span>در دوره جاری</span></div></article>
    <article class="kpi kpi--warn"><div class="kpi__top"><div class="kpi__label">اخطار کتبی HSE</div><span class="kpi__ic">${ic('alert')}</span></div>
      <div class="kpi__val"><span data-count="${stops[1].n}">0</span><small>مورد</small></div>
      <div class="kpi__foot"><span>تمام موارد رفع نقص شد</span></div></article>
    <article class="kpi kpi--ok"><div class="kpi__top"><div class="kpi__label">حادثه منجر به مصدومیت</div><span class="kpi__ic">${ic('heart')}</span></div>
      <div class="kpi__val"><span data-count="${stops[3].n}">0</span><small>مورد</small></div>
      <div class="kpi__foot"><span>در ۱۸ رویداد اخیر</span></div></article>
  </section>

  <section class="panel">
    <div class="panel__head"><div><h3>شاخص‌های آمادگی ایمنی</h3><p>کنترل تجمعی گیت G11 — HSE و آتش‌نشانی</p></div>
      <span class="badge badge--warn">${HSE.gauges.filter(g => g.tone === 'warn').length} شاخص نیازمند بهبود</span></div>
    <div class="panel__body"><div class="gaugerow">
      ${HSE.gauges.map(g => gauge(g.v, g.l, g.tone)).join('')}
    </div></div>
  </section>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head"><div><h3>ماتریس ریسک رویداد</h3><p>احتمال × شدت — بر پایه سند Risk Assessment پرونده ${esc(SAMPLE.id)}</p></div>
        <span class="badge badge--blue">${HSE.riskAssessment.length} ریسک شناسایی‌شده</span></div>
      <div class="panel__body" style="display:grid;gap:18px">
        <div style="overflow-x:auto">${riskMatrix()}</div>
        <div class="legend">
          <span style="color:#0F3A26"><i style="background:#8EC5A8"></i>پایین</span>
          <span style="color:#4A3405"><i style="background:#E5CB84"></i>متوسط</span>
          <span style="color:#4A2405"><i style="background:#E09C5C"></i>بالا</span>
          <span style="color:#8E2A20"><i style="background:#C4544A"></i>بحرانی</span>
        </div>
      </div>
      <div class="tblwrap"><table class="tbl tbl--tight">
        <thead><tr><th>کد</th><th>ریسک شناسایی‌شده</th><th>احتمال</th><th>شدت</th><th>کنترل کاهنده</th><th>مسئول</th><th>وضعیت</th></tr></thead>
        <tbody>${HSE.riskAssessment.map(r => `<tr>
          <td><span class="tbl__code">${esc(r.id)}</span></td>
          <td class="t-main">${esc(r.h)}</td>
          <td><span class="t-num">${r.prob}</span></td>
          <td><span class="t-num">${r.sev}</span></td>
          <td style="color:var(--ink-500);font-weight:600;font-size:var(--fs-2xs)">${esc(r.ctrl)}</td>
          <td><span class="badge badge--outline">${esc(r.own)}</span></td>
          <td><span class="badge badge--${r.st === 'کاهیده' ? 'ok' : 'warn'}">${esc(r.st)}</span></td>
        </tr>`).join('')}</tbody>
      </table></div>
      <div class="panel__foot"><span>ریسک‌های با امتیاز ۱۵ و بالاتر نیازمند طرح کنترل اختصاصی و تأیید کتبی HSE پیش از صدور GO هستند.</span></div>
    </section>

    <div class="grid" style="gap:var(--s5);align-content:start">
      <section class="panel">
        <div class="panel__head panel__head--gold"><div><h3>مسیرهای خروج و ظرفیت اضطراری</h3><p>کنترل تجمعی و ظرفیت ایمن</p></div>${ic('map')}</div>
        <div class="panel__body" style="display:grid;gap:10px">
          ${HSE.exits.map(e => `
            <div class="accessrow ${e.st !== 'ok' ? 'accessrow--deny' : ''}">
              <span class="accessrow__ic">${ic(e.st === 'ok' ? 'check' : 'alert')}</span>
              <div><b>${esc(e.n)}</b><span>ظرفیت ${esc(e.cap)} — ${esc(e.note)}</span></div>
              <span class="badge badge--${e.st === 'ok' ? 'ok' : 'warn'}">${e.st === 'ok' ? 'باز' : 'محدود'}</span>
            </div>`).join('')}
        </div>
        <div class="panel__foot"><span>ظرفیت ایمن تجمعی خروج اضطراری: <b>۸٬۱۰۰ نفر</b> در برابر پیش‌بینی ۷٬۰۰۰ نفر در اوج</span></div>
      </section>

      <section class="panel">
        <div class="panel__head"><div><h3>چک‌لیست ایمنی پیش از اجرا</h3><p>کنترل‌های اجباری روز رویداد</p></div>${ic('hse')}</div>
        <div class="panel__body"><div class="checks">
          ${checkRow('بازرسی مسیرهای خروج و علامت‌گذاری', 'ok')}
          ${checkRow('کنترل مهاربندی و تراز سازه استیج', 'ok')}
          ${checkRow('تست خاموش‌کننده‌های سیار و سیستم اطفا', 'ok')}
          ${checkRow('استقرار ایستگاه کمک‌های اولیه و امدادگر', 'warn')}
          ${checkRow('هماهنگی مسیر دسترسی اورژانس ۱۱۵', 'warn')}
          ${checkRow('کنترل ایمنی اتصالات برقی و ارت', 'ok')}
          ${checkRow('کنترل ظرفیت ورود و شمارشگر درب', 'ok')}
        </div></div>
        <div class="panel__foot"><span>ثبت گزارش بازرسی در پرونده رویداد الزامی است؛ نبود گزارش، مانع صدور GO است.</span></div>
      </section>
    </div>
  </div>`;
}

function securityPage(){
  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">Security &amp; Order</span>
      <h1>داشبورد حراست، امنیت و کنترل جمعیت</h1>
      <p class="pagehead__lede">
        طرح امنیتی رویداد، کنترل جمعیت، حفاظت مهمانان ویژه، مدیریت دسترسی‌ها و طرح بحران پیش از اجرا مصوب می‌شود.
        حراست، هم‌راستا با HSE، حق توقف رویداد غیرمنطبق را دارد.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="refresh" type="button">${ic('refresh')} بازبینی طرح امنیتی</button>
      <button class="btn btn--primary" data-action="act" data-act="print" type="button">${ic('print')} گزارش حراست</button>
    </div>
  </header>

  <section class="grid grid--4">
    ${SECURITY.forces.map(f => `
      <article class="kpi kpi--ok">
        <div class="kpi__top"><div class="kpi__label">${esc(f.l)}</div><span class="kpi__ic">${ic('security')}</span></div>
        <div class="kpi__val"><span data-count="${f.v}">0</span><small>از ${f.of} نفر</small></div>
        <div class="kpi__foot"><span>استقرار کامل — ۱۰۰٪ طرح مصوب</span></div>
      </article>`).join('')}
  </section>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head"><div><h3>مدیریت دسترسی‌ها و کارت‌های رویداد</h3><p>سطوح دسترسی مصوب گیت G12 — حراست و امنیت</p></div>
        <span class="badge badge--bad">${SECURITY.access.find(a => a.st === 'deny').c} درخواست رد‌شده</span></div>
      <div class="panel__body" style="display:grid;gap:9px">
        ${SECURITY.access.map(a => `
          <div class="accessrow ${a.st === 'vip' ? 'accessrow--vip' : a.st === 'deny' ? 'accessrow--deny' : ''}">
            <span class="accessrow__ic">${ic(a.st === 'vip' ? 'star' : a.st === 'deny' ? 'block' : 'key')}</span>
            <div><b>${esc(a.n)}</b><span>${esc(a.lvl)}</span></div>
            <span class="badge badge--${a.st === 'vip' ? 'gold' : a.st === 'deny' ? 'bad' : 'ok'}">${a.c} کارت</span>
          </div>`).join('')}
      </div>
      <div class="panel__foot"><span>هر کارت به یک فرد مشخص و بازه زمانی محدود تخصیص می‌یابد؛ کارت بدون مالک باطل می‌شود.</span></div>
    </section>

    <div class="grid" style="gap:var(--s5);align-content:start">
      <section class="panel secpanel secpanel--dark" style="border-radius:var(--r-lg);padding:20px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <span style="width:34px;height:34px;border-radius:8px;background:rgba(215,168,102,.18);border:1px solid rgba(215,168,102,.4);display:grid;place-items:center;color:var(--gold-400)">${ic('users')}</span>
          <div><h3 style="font-size:var(--fs-md);font-weight:900;color:#fff">کنترل جمعیت</h3>
            <p class="hint">زون مرکزی — رویداد ${esc(SAMPLE.id)}</p></div>
        </div>
        <div style="display:grid;gap:13px">
          ${SECURITY.crowd.map(c => `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:11px;border-bottom:1px solid rgba(255,255,255,.09)">
              <span style="font-size:var(--fs-2xs);color:rgba(255,255,255,.6);font-weight:600">${esc(c.l)}</span>
              <b style="font-size:var(--fs-xs);color:#fff;font-weight:800">${esc(c.v)}</b>
            </div>`).join('')}
        </div>
      </section>

      <section class="panel">
        <div class="panel__head"><div><h3>سطوح مدیریت بحران</h3><p>پروتکل پاسخ و زمان واکنش</p></div>${ic('alert')}</div>
        <div class="panel__body" style="display:grid;gap:10px">
          ${SECURITY.crisis.map((c, i) => `
            <div class="accessrow" style="border-color:${i === 2 ? 'var(--bad-bd)' : i === 1 ? 'var(--warn-bd)' : 'var(--ink-150)'};background:${i === 2 ? 'var(--bad-bg)' : i === 1 ? 'var(--warn-bg)' : '#fff'}">
              <span class="accessrow__ic">${ic(i === 2 ? 'lightning' : i === 1 ? 'radio' : 'info')}</span>
              <div><b>${esc(c.t)}</b><span>${esc(c.d)}</span></div>
              <span class="badge badge--${i === 2 ? 'bad' : i === 1 ? 'warn' : 'idle'}">${esc(c.sla)}</span>
            </div>`).join('')}
        </div>
      </section>
    </div>
  </div>

  <div class="grid grid--2">
    <section class="panel">
      <div class="panel__head panel__head--gold"><div><h3>پروتکل مهمانان ویژه</h3><p>مسیر، حفاظت و هماهنگی</p></div>${ic('star')}</div>
      <div class="panel__body"><div class="checks">
        ${checkRow('تعیین مسیر ویژه ورود و خروج مستقل از مسیر عمومی', 'ok')}
        ${checkRow('تیم حفاظت اختصاصی ۶ نفره در تمام بازه حضور', 'ok')}
        ${checkRow('مدیریت بازه حضور برای عدم هم‌زمانی با اوج ازدحام', 'ok')}
        ${checkRow('هماهنگی پذیرایی و اتاق VIP با بهره‌برداری', 'warn')}
        ${checkRow('تأییدیه کتبی حراست پیش از اعلام عمومی حضور', 'warn')}
        ${checkRow('طرح خروج اضطراری اختصاصی مهمان ویژه', 'ok')}
      </div></div>
    </section>

    <section class="panel">
      <div class="panel__head panel__head--tint"><div><h3>پایش و اتاق فرمان</h3><p>ابزارهای کنترل لحظه‌ای رویداد</p></div>${ic('camera')}</div>
      <div class="panel__body" style="display:grid;gap:14px">
        ${meter('پوشش دوربین در زون رویداد', '۱۰۰٪', 'ok', 100)}
        ${meter('دوربین تحلیلی شمارش جمعیت', '۸۶٪', 'ok', 86)}
        ${meter('پوشش بی‌سیم دوکاناله', '۹۴٪', 'ok', 94)}
        ${meter('نیروی آموزش‌دیده کنترل صف', '۷۸٪', 'warn', 78)}
        <div class="note note--warn" style="margin-top:4px">${ic('alert')}<div><b>نقطه بهبود:</b> آموزش مجدد ۶ نفر از نیروی کنترل صف پیش از رویدادهای سطح ۳ و ۴ الزامی است.</div></div>
      </div>
    </section>
  </div>`;
}

export default function safety(ctx){
  return (ctx && ctx.tab === 'sec') ? securityPage() : hsePage();
}
