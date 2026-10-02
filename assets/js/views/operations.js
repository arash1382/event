/* ============================================================================
   views/operations.js — Operational Timeline · Run Sheet · Logistics
   ========================================================================== */
import { RUNSHEET, GANTT, SAMPLE, PARTNERS } from '../data.js';
import { ic, esc, meter, checkRow } from '../ui.js';

const MANDATORY = [
  { t: 'ورود پیمانکار', k: 'prep' }, { t: 'ورود تجهیزات', k: 'prep' }, { t: 'نصب', k: 'risk' },
  { t: 'تست', k: 'core' }, { t: 'آماده‌باش', k: 'core' }, { t: 'شروع رویداد', k: 'core' },
  { t: 'پایان رویداد', k: 'core' }, { t: 'جمع‌آوری', k: 'prep' }, { t: 'خروج کامل', k: 'core' }
];

const EQUIP = [
  { n: 'استیج و سازه نمایشی', q: '۱ مجموعه ۱۲×۶ متر', own: 'پیمانکار صحنه', st: 'ok' },
  { n: 'سیستم صوتی خطی', q: '۲۴ عدد + ۴ ساب‌ووفر', own: 'پیمانکار نور و صدا', st: 'ok' },
  { n: 'نورپردازی صحنه', q: '۳۶ چراغ متحرک + ۲۴ پروژکتور', own: 'پیمانکار نور و صدا', st: 'ok' },
  { n: 'برق اختصاصی رویداد', q: '۲ خط ۳۲ آمپر + UPS ۲۰ کاوا', own: 'فنی و تأسیسات', st: 'warn' },
  { n: 'ژنراتور پشتیبان', q: '۱ دستگاه ۱۰۰ کاوا', own: 'فنی و تأسیسات', st: 'ok' },
  { n: 'شبکه و اینترنت اختصاصی', q: 'لینک ۲۰۰ مگابیت + AP موقت', own: 'IT', st: 'ok' },
  { n: 'سامانه ثبت‌نام و QR', q: '۶ ایستگاه + ۴ پایانه دستی', own: 'IT', st: 'warn' },
  { n: 'تجهیزات ایمنی و اطفا', q: '۱۲ خاموش‌کننده + ۲ ایستگاه کمک‌های اولیه', own: 'HSE', st: 'ok' },
  { n: 'نیروی انسانی رویداد', q: '۶۸ نفر در ۳ شیفت', own: 'عملیات', st: 'ok' }
];

const RESOURCE = [
  { l: 'نیروی دبیرخانه و ناظر میدانی', n: '۴ نفر', p: 100 },
  { l: 'عوامل عملیات و لجستیک', n: '۲۲ نفر', p: 92 },
  { l: 'نیروی حراست رویداد', n: '۲۴ نفر', p: 100 },
  { l: 'تیم HSE و آتش‌نشانی', n: '۱۰ نفر', p: 88 },
  { l: 'تیم فنی و تأسیسات', n: '۸ نفر', p: 76 },
  { l: 'پیمانکاران اجرایی', n: '۵ شرکت', p: 94 }
];

const CONTACTS = [
  { r: 'دبیر شورا — ناظر ارشد رویداد', c: '۴۱۵۰', k: 'core' },
  { r: 'اتاق فرمان و پایش', c: '۴۱۱۰', k: 'core' },
  { r: 'HSE — مسئول شیفت', c: '۴۲۲۰', k: 'risk' },
  { r: 'حراست — فرمانده شیفت', c: '۴۳۰۰', k: 'risk' },
  { r: 'فنی و تأسیسات — کشیک', c: '۴۴۰۰', k: 'core' },
  { r: 'اورژانس و کمک‌های اولیه', c: '۱۱۵ / داخلی ۴۵۰۰', k: 'risk' }
];

export default function operations(){
  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">Operations Run Sheet</span>
      <h1>زمان‌بندی اجرایی و عملیات رویداد</h1>
      <p class="pagehead__lede">
        هر رویداد باید دارای Run Sheet مصوب باشد. این سند، از ورود پیمانکار و تجهیزات تا نصب، تست،
        آماده‌باش، اجرا، جمع‌آوری و خروج کامل را در یک خط زمان واحد تعریف می‌کند و مبنای کنترل گیت‌های G6 و G10 است.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="sync" type="button">${ic('refresh')} به‌روزرسانی وضعیت میدانی</button>
      <button class="btn btn--primary" data-action="act" data-act="print" type="button">${ic('print')} نسخه میدانی Run Sheet</button>
    </div>
  </header>

  <section class="grid grid--4">
    <article class="kpi"><div class="kpi__top"><div class="kpi__label">گام‌های زمان‌بندی‌شده</div><span class="kpi__ic">${ic('runsheet')}</span></div>
      <div class="kpi__val"><span data-count="12">0</span><small>گام</small></div>
      <div class="kpi__foot"><span>شامل ۹ گام الزامی مصوب</span></div></article>
    <article class="kpi kpi--ok"><div class="kpi__top"><div class="kpi__label">مدت پنجره اجرایی</div><span class="kpi__ic">${ic('clock')}</span></div>
      <div class="kpi__val"><span data-count="5">0</span><small>روز</small></div>
      <div class="kpi__foot"><span>نصب، اجرا، جمع‌آوری</span></div></article>
    <article class="kpi kpi--gold"><div class="kpi__top"><div class="kpi__label">نیروی درگیر رویداد</div><span class="kpi__ic">${ic('users')}</span></div>
      <div class="kpi__val"><span data-count="68">0</span><small>نفر</small></div>
      <div class="kpi__foot"><span>در ۳ شیفت کاری</span></div></article>
    <article class="kpi kpi--warn"><div class="kpi__top"><div class="kpi__label">تجهیزات نیازمند تأیید نهایی</div><span class="kpi__ic">${ic('lightning')}</span></div>
      <div class="kpi__val"><span data-count="2">0</span><small>قلم</small></div>
      <div class="kpi__foot"><span>برق اختصاصی و سامانه QR</span></div></article>
  </section>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head">
        <div><h3>خط زمان اجرایی — Run Sheet</h3><p>پرونده ${esc(SAMPLE.id)} · ${esc(SAMPLE.title)}</p></div>
        <div class="legend">
          <span style="color:var(--ok-600)"><i></i>انجام‌شده</span>
          <span style="color:var(--gold-600)"><i></i>جاری</span>
          <span style="color:var(--blue-500)"><i></i>آینده</span>
          <span style="color:var(--bad-600)"><i></i>نقطه ریسک</span>
        </div>
      </div>
      <div class="panel__body">
        <div class="runsheet">
          ${RUNSHEET.map(r => `
            <div class="rsrow ${r.st === 'ok' ? 'rsrow--past' : r.st === 'now' ? 'rsrow--now' : ''}">
              <span class="rsrow__t">${esc(r.t)}</span>
              <span class="rsrow__dot ${r.k === 'risk' ? 'rsrow__dot--risk' : r.k === 'core' ? 'rsrow__dot--core' : ''}"></span>
              <div class="rsrow__bd">
                <b>${esc(r.ttl)}</b>
                <p>${esc(r.d)}</p>
                <div class="rsrow__tags">
                  <span class="tag" style="font-size:9px">${esc(r.t2)}</span>
                  ${r.tags.map(t => `<span class="tag tag--blue" style="font-size:9px">${esc(t)}</span>`).join('')}
                  ${r.k === 'risk' ? `<span class="tag" style="font-size:9px;background:var(--bad-bg);border-color:var(--bad-bd);color:var(--bad-700)">نقطه کنترل</span>` : ''}
                </div>
              </div>
              <span class="rsrow__own"><i>${ic('users')}</i>${esc(r.own)}</span>
              <span class="rsrow__st badge badge--${r.st === 'ok' ? 'ok' : r.st === 'now' ? 'gold' : 'idle'}">${r.st === 'ok' ? 'انجام‌شده' : r.st === 'now' ? 'جاری' : 'در انتظار'}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="panel__foot">
        <span>پایش میدانی: ناظر دبیرخانه در تمام بازه اجرا حاضر و پاسخ‌گوی کنترل‌های G10 تا G12 است.</span>
        <a class="btn btn--sm btn--ghost" href="#/event">${ic('file')} پرونده رویداد</a>
      </div>
    </section>

    <div class="grid" style="gap:var(--s5);align-content:start">
      <section class="panel">
        <div class="panel__head panel__head--gold"><div><h3>گام‌های الزامی Run Sheet</h3><p>حداقل‌های مصوب بند ۸ سند راهبری</p></div>${ic('check')}</div>
        <div class="panel__body"><div class="checks">
          ${MANDATORY.map(m => checkRow(m.t, 'ok')).join('')}
        </div></div>
        <div class="panel__foot"><span>نبود هر یک از این گام‌ها، موجب توقف پرونده در گیت G10 می‌شود.</span></div>
      </section>

      <section class="panel">
        <div class="panel__head"><div><h3>خط تماس اضطراری رویداد</h3><p>شماره‌های داخلی مصوب طرح بحران</p></div>${ic('radio')}</div>
        <div class="panel__body" style="display:grid;gap:8px">
          ${CONTACTS.map(c => `
            <div class="accessrow ${c.k === 'risk' ? 'accessrow--deny' : ''}">
              <span class="accessrow__ic">${ic(c.k === 'risk' ? 'alert' : 'radio')}</span>
              <div><b>${esc(c.r)}</b><span>داخلی ${esc(c.c)}</span></div>
              <span class="badge badge--outline">${c.k === 'risk' ? 'فوری' : 'عملیاتی'}</span>
            </div>`).join('')}
        </div>
      </section>
    </div>
  </div>

  <section class="panel">
    <div class="panel__head"><div><h3>نمودار گانت آماده‌سازی رویداد</h3><p>پنجره ۱۳ هفته‌ای از تأیید مالی تا اختتام پرونده</p></div>
      <span class="badge badge--blue">هفته ۱ تا ۱۳</span></div>
    <div class="panel__body"><div class="gantt">
      <div class="gantt__scale">
        <span></span>${Array.from({ length: 12 }, (_, i) => `<span>W${i + 1}</span>`).join('')}
      </div>
      ${GANTT.map(g => `
        <div class="gantt__row">
          <span class="gantt__lbl">${esc(g.l)}</span>
          ${Array.from({ length: 12 }, (_, i) => {
            const on = i >= g.s && i <= g.e;
            const cls = !on ? '' : `gantt__cell--on ${g.k === 'gold' ? 'gantt__cell--gold' : ''} ${i === g.s ? 'gantt__cell--start' : ''} ${i === g.e ? 'gantt__cell--end' : ''}`;
            return `<span class="gantt__cell ${cls}"></span>`;
          }).join('')}
        </div>`).join('')}
    </div></div>
    <div class="panel__foot">
      <span>مسیر بحرانی: قرارداد و مالی → مجوزها → کمپین تبلیغاتی. تأخیر بیش از ۵ روز در هر مرحله، پرونده را به فهرست پرخطر منتقل می‌کند.</span>
    </div>
  </section>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head"><div><h3>تجهیزات و تأمین عملیاتی</h3><p>کنترل گیت G10 — عملیات و لجستیک</p></div>
        <span class="badge badge--warn">${EQUIP.filter(e => e.st !== 'ok').length} قلم باز</span></div>
      <div class="tblwrap"><table class="tbl tbl--tight">
        <thead><tr><th>قلم</th><th>مشخصات/تعداد</th><th>مسئول تأمین</th><th>وضعیت</th></tr></thead>
        <tbody>${EQUIP.map(e => `<tr>
          <td class="t-main">${esc(e.n)}</td>
          <td style="color:var(--ink-500);font-weight:600">${esc(e.q)}</td>
          <td style="color:var(--ink-500);font-weight:600">${esc(e.own)}</td>
          <td><span class="badge badge--${e.st === 'ok' ? 'ok' : 'warn'}">${e.st === 'ok' ? 'تأمین‌شده' : 'در انتظار تأیید'}</span></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section class="panel">
      <div class="panel__head panel__head--tint"><div><h3>منابع انسانی و ظرفیت</h3><p>نسبت تخصیص نیرو به برنامه مصوب</p></div>${ic('users')}</div>
      <div class="panel__body" style="display:grid;gap:15px">
        ${RESOURCE.map(r => meter(r.l, r.n + ' — ' + r.p + '٪', r.p >= 90 ? 'ok' : r.p >= 80 ? '' : 'warn', r.p)).join('')}
      </div>
      <div class="panel__foot"><span>کمبود نیروی فنی در هفته ۹ مشاهده شده؛ نیازمند تأمین پیمانکار مکمل.</span></div>
    </section>
  </div>

  <section class="panel">
    <div class="panel__head"><div><h3>واحدهای درگیر در اجرا</h3><p>نقش هر واحد همکار در Run Sheet مصوب</p></div>
      <a class="btn btn--sm btn--ghost" href="#/council">${ic('council')} ساختار شورا</a></div>
    <div class="panel__body">
      <div class="partners__grid">
        ${PARTNERS.map(p => `
          <div class="partner">
            <span class="partner__c">${esc(p.c)}</span>
            <span>${esc(p.n)}</span>
            <span class="partner__g">${p.gates.join('/')}</span>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}
