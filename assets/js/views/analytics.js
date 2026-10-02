/* ============================================================================
   views/analytics.js — Post-Event Reporting & Analytics
   ========================================================================== */
import { ANALYTICS, SUMMARY, SAMPLE } from '../data.js';
import { ic, esc, meter, trend, checkRow } from '../ui.js';

const SEV = { c: ['sev--c', 'بحرانی'], h: ['sev--h', 'بالا'], m: ['sev--m', 'متوسط'], l: ['sev--l', 'کم'] };

function monthlyChart(){
  const max = Math.max(...ANALYTICS.monthly.map(m => m.crowd), 1);
  return `<div class="cols">
    ${ANALYTICS.monthly.map(m => `
      <div class="col">
        <div class="col__w">
          <span class="col__b col__b--prev" data-h="${m.crowd ? Math.max(4, (m.crowd / max) * 62) : 2}" style="height:0" data-v="${m.crowd} هزار مخاطب"></span>
          <span class="col__b" data-h="${m.crowd ? Math.max(6, (m.crowd / max) * 100) : 0}" style="height:0" data-v="${m.crowd} هزار مخاطب"></span>
        </div>
        <span class="col__lb">${esc(m.m)}</span>
      </div>`).join('')}
  </div>
  <div class="legend" style="justify-content:center;margin-top:10px">
    <span style="color:var(--blue-600)"><i></i>پاخور ماه جاری (هزار نفر)</span>
    <span style="color:var(--ink-300)"><i></i>میانگین دوره پیش</span>
  </div>`;
}

function kpiTable(){
  return `<div class="tblwrap"><table class="tbl">
    <thead><tr><th>شاخص کلیدی</th><th>مقدار دوره</th><th>نسبت به هدف مصوب</th><th>تغییر نسبت به دوره پیش</th><th>ارزیابی</th></tr></thead>
    <tbody>${ANALYTICS.kpi.map(k => {
      const ok = k.tg >= 100;
      const near = k.tg >= 90 && k.tg < 100;
      return `<tr>
        <td class="t-main">${esc(k.l)}</td>
        <td><span class="t-num">${esc(k.v)}</span></td>
        <td style="min-width:170px">
          <div class="meter" style="gap:4px">
            <div class="meter__top"><span class="meter__name">تحقق هدف</span><span class="meter__val">${k.tg}٪</span></div>
            <div class="meter__track" style="height:6px"><span class="meter__fill ${ok ? 'meter--ok' : near ? 'meter--gold' : 'meter--warn'}" data-w="${Math.min(100, k.tg)}"></span></div>
          </div>
        </td>
        <td>${trend(k.delta)}</td>
        <td><span class="badge badge--${ok ? 'ok' : near ? 'gold' : 'warn'}">${ok ? 'فراتر از هدف' : near ? 'در محدوده هدف' : 'نیازمند بهبود'}</span></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

export default function analytics(){
  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">Post-Event Report</span>
      <h1>ارزیابی و گزارش پس از رویداد</h1>
      <p class="pagehead__lede">
        پرونده هیچ رویدادی بدون گزارش نهایی بسته نمی‌شود. در این بخش، هشت شاخص کلیدی مصوب — از تعداد مخاطب و
        پاخور تا رضایت، پوشش رسانه‌ای، داده CRM و عملکرد پیمانکار — سنجیده و درس‌آموخته‌ها ثبت می‌شود.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="sync" type="button">${ic('refresh')} به‌روزرسانی داده تحلیل</button>
      <button class="btn btn--gold" data-action="act" data-act="export" type="button">${ic('download')} گزارش مدیریتی دوره</button>
    </div>
  </header>

  <section class="grid grid--4">
    ${ANALYTICS.headline.map(h => `
      <article class="kpi ${h.gold ? 'kpi--gold' : ''}">
        <div class="kpi__top"><div class="kpi__label">${esc(h.l)}</div><span class="kpi__ic">${ic(h.gold ? 'star' : 'activity')}</span></div>
        <div class="kpi__val"><span data-count="${h.v}">0</span><small>${esc(h.u)}</small></div>
        <div class="kpi__foot">
          <div class="meter__track" style="width:100%;height:6px"><span class="meter__fill ${h.gold ? 'meter--gold' : ''}" data-w="${h.p}"></span></div>
          <span style="width:100%">${h.p}٪ تحقق هدف دوره</span>
        </div>
      </article>`).join('')}
  </section>

  <section class="panel">
    <div class="panel__head"><div><h3>جدول شاخص‌های کلیدی مصوب</h3><p>هشت KPI الزامی بند ۱۰ سند راهبری</p></div>
      <span class="badge badge--blue">${esc(SAMPLE.id)} — ${esc(SAMPLE.title)}</span></div>
    <div class="panel__body panel__body--tight">${kpiTable()}</div>
    <div class="panel__foot">
      <span>پاخور تجمعی از سامانه شمارش درب و دوربین تحلیلی استخراج و با داده CRM تقاطع‌سنجی می‌شود.</span>
      <span class="badge badge--ok">${ic('check')} داده تأییدشده دبیرخانه</span>
    </div>
  </section>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head"><div><h3>روند پاخور و تعداد رویداد در دوره</h3><p>مقایسه ماهانه هشت ماه نخست دوره راهبری</p></div>${ic('analytics')}</div>
      <div class="panel__body">${monthlyChart()}</div>
      <div class="panel__foot"><span>بیشترین رشد در مهرماه با ۹ رویداد و ۵۸ هزار مخاطب ثبت شده است.</span></div>
    </section>

    <section class="panel">
      <div class="panel__head panel__head--tint"><div><h3>عملکرد پیمانکاران</h3><p>ارزیابی بر پایه انطباق با Run Sheet و کیفیت اجرا</p></div>${ic('truck')}</div>
      <div class="panel__body" style="display:grid;gap:14px">
        ${ANALYTICS.contractors.map(c => `
          <div>
            ${meter(c.n, c.s + ' / 100', c.s >= 92 ? 'ok' : c.s >= 86 ? 'gold' : 'warn', c.s)}
            <p class="hint" style="margin-top:5px">${esc(c.note)}</p>
          </div>`).join('')}
      </div>
      <div class="panel__foot"><span>میانگین عملکرد پیمانکاران: <b>${Math.round(ANALYTICS.contractors.reduce((a, b) => a + b.s, 0) / ANALYTICS.contractors.length)}٫۰</b> از ۱۰۰</span></div>
    </section>
  </div>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head panel__head--gold"><div><h3>درس‌آموخته‌ها و اقدام اصلاحی</h3><p>ثبت اجباری در بانک دانش رویداد</p></div>
        <span class="badge badge--warn">${ANALYTICS.lessons.length} مورد ثبت‌شده</span></div>
      <div class="panel__body" style="display:grid;gap:10px">
        ${ANALYTICS.lessons.map((l, i) => {
          const s = SEV[l.lvl];
          return `<div class="accessrow" style="border-color:${l.lvl === 'm' ? 'var(--warn-bd)' : l.lvl === 'h' ? 'var(--bad-bd)' : 'var(--ink-150)'};background:${l.lvl === 'm' ? 'var(--warn-bg)' : l.lvl === 'h' ? 'var(--bad-bg)' : '#fff'}">
            <span class="accessrow__ic">${ic('lightning')}</span>
            <div><b>${esc(l.t)}</b><span>ثبت‌شده در گزارش نهایی ${esc(SAMPLE.id)}</span></div>
            <span class="sev ${s[0]}"><i></i>اثر ${s[1]}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="panel__foot"><span>اقدامات با اثر بالا، به‌صورت الزام جدید در گیت مربوطه به سند راهبری افزوده می‌شوند.</span></div>
    </section>

    <div class="grid" style="gap:var(--s5);align-content:start">
      <section class="panel">
        <div class="panel__head"><div><h3>شرایط بستن پرونده</h3><p>اصل هفتم سند راهبری</p></div>${ic('lock')}</div>
        <div class="panel__body"><div class="checks">
          ${checkRow('گزارش نهایی ارزیابی هشت‌شاخصی', 'ok')}
          ${checkRow('گزارش عملکرد پیمانکاران و امتیازدهی', 'ok')}
          ${checkRow('گزارش میدانی ناظر دبیرخانه', 'ok')}
          ${checkRow('تسویه مالی و بستن تعهدات قراردادی', 'warn')}
          ${checkRow('بایگانی مجوزها و مستندات انطباق', 'ok')}
          ${checkRow('ثبت درس‌آموخته‌ها در بانک دانش', 'warn')}
        </div></div>
        <div class="panel__foot"><span>بدون گزارش نهایی، پرونده در وضعیت «باز» باقی می‌ماند و مالک رویداد اجازه ثبت رویداد جدید ندارد.</span></div>
      </section>

      <section class="panel">
        <div class="panel__head panel__head--tint"><div><h3>اطلاعات دوره</h3><p>خلاصه وضعیت راهبری</p></div>${ic('calendar')}</div>
        <div class="panel__body">
          <div class="kv">
            <div class="kv__row"><span class="kv__k">رویدادهای ارزیابی‌شده</span><span class="kv__v">${SUMMARY.active} رویداد</span></div>
            <div class="kv__row"><span class="kv__k">گزارش نهایی بایگانی‌شده</span><span class="kv__v">${SUMMARY.active - 5} پرونده</span></div>
            <div class="kv__row"><span class="kv__k">پرونده در انتظار گزارش</span><span class="kv__v" style="color:var(--warn-700)">۵ پرونده</span></div>
            <div class="kv__row"><span class="kv__k">میانگین زمان ارزیابی</span><span class="kv__v">۶٫۲ روز</span></div>
            <div class="kv__row"><span class="kv__k">داده CRM گردآوری‌شده</span><span class="kv__v">۱۸٬۴۲۰ رکورد</span></div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <section class="panel">
    <div class="panel__head"><div><h3>تراکم فعالیت رویدادها در بازه سیزده‌هفته‌ای</h3><p>هر خانه یک هفته — شدت رنگ نشان‌دهنده حجم رویدادهای فعال است</p></div>
      <span class="badge badge--outline">۱۳ هفته</span></div>
    <div class="panel__body" style="display:grid;gap:14px">
      <div class="heatcal" style="grid-template-columns:repeat(auto-fit,minmax(26px,1fr))">
        ${ANALYTICS.heat.map((v, i) => `<i data-i="${v}" title="هفته ${i + 1} — ${v} رویداد" style="aspect-ratio:auto;height:26px"></i>`).join('')}
      </div>
      <div class="legend">
        <span style="color:var(--ink-200)"><i></i>بدون فعالیت</span>
        <span style="color:var(--blue-300)"><i></i>کم</span>
        <span style="color:var(--blue-500)"><i></i>متوسط</span>
        <span style="color:var(--blue-700)"><i></i>زیاد</span>
        <span style="color:var(--gold-500)"><i></i>اشباع تقویم</span>
      </div>
      <div class="note note--ok">${ic('check')}<div><b>نتیجه دوره:</b> با وجود رشد ${'۸٬۴'} درصدی پاخور، هیچ رویدادی به دلیل عدم انطباق ایمنی یا امنیتی متوقف نشد و هیچ پرونده‌ای بدون گزارش نهایی بسته نشد.</div></div>
    </div>
  </section>`;
}
