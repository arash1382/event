/* ============================================================================
   views/permits.js — Permits & Compliance dashboard
   ========================================================================== */
import { PERMITS, PERMIT_STATS, GATES, EVENTS, SAMPLE } from '../data.js';
import { ic, esc, openDrawer, meter, checkRow } from '../ui.js';

const ST = { ok: ['ok', 'تعیین‌تکلیف‌شده'], warn: ['warn', 'در جریان'], bad: ['bad', 'رد / منقضی'] };

const CATEGORIES = [
  { n: 'رویداد فرهنگی', ic: 'star', req: ['مجوز فعالیت فرهنگی', 'مجوز تبلیغات محیطی', 'مجوز پخش زنده و صوتی‌تصویری'] },
  { n: 'رویداد هنری', ic: 'ribbon', req: ['مجوز فعالیت فرهنگی', 'مجوز پخش زنده و صوتی‌تصویری', 'مجوز آتش‌نشانی و ایمنی'] },
  { n: 'رویداد ورزشی', ic: 'target', req: ['مجوز برگزاری رویداد ورزشی', 'مجوز آتش‌نشانی و ایمنی', 'گواهی بیمه مسئولیت رویداد'] },
  { n: 'رویداد تبلیغاتی', ic: 'megaphone', req: ['مجوز تبلیغات محیطی', 'مجوز پخش آگهی صوتی', 'گواهی بیمه مسئولیت رویداد'] },
  { n: 'رویداد غذایی', ic: 'heart', req: ['مجوز بهداشت و پذیرایی', 'مجوز آتش‌نشانی و ایمنی', 'مجوز نمایشگاهی و غرفه‌آرایی'] },
  { n: 'نمایشگاه و غرفه', ic: 'building', req: ['مجوز نمایشگاهی و غرفه‌آرایی', 'مجوز ورود و تردد تجهیزات', 'مجوز تبلیغات محیطی'] }
];

const AUTHORITIES = [
  { n: 'وزارت فرهنگ و ارشاد اسلامی', c: 'FAR', d: 'فرهنگی، هنری، نشر و پخش محتوا', lead: '۲۸ روز' },
  { n: 'اداره ورزش و جوانان', c: 'SPT', d: 'رویدادهای ورزشی و مسابقات', lead: '۲۱ روز' },
  { n: 'صدا و سیمای استان', c: 'AVC', d: 'پخش زنده، تصویربرداری حرفه‌ای', lead: '۳۵ روز' },
  { n: 'معاونت بهداشت', c: 'HTH', d: 'پذیرایی، غذا و سلامت عمومی', lead: '۱۴ روز' },
  { n: 'کمیته تبلیغات شهری', c: 'ADV', d: 'تبلیغات محیطی و بیلبورد', lead: '۱۸ روز' },
  { n: 'سازمان آتش‌نشانی', c: 'FRS', d: 'ایمنی، اطفا و ظرفیت سازه', lead: '۱۲ روز' },
  { n: 'حراست ایران‌مال', c: 'SEC', d: 'ورود تجهیزات، دسترسی و تردد', lead: '۳ روز' },
  { n: 'واحد بیمه و مالی', c: 'INS', d: 'پوشش بیمه مسئولیت و اموال', lead: '۷ روز' }
];

export default function permits(){
  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">Permits &amp; Compliance</span>
      <h1>مجوزها و انطباق قانونی رویدادها</h1>
      <p class="pagehead__lede">
        بسته به ماهیت رویداد، مجوزهای فرهنگی، هنری، ورزشی، تبلیغاتی، غذایی یا نمایشگاهی مورد نیاز است.
        دبیرخانه مسئول صدور مجوز نیست؛ مسئول کنترل وضعیت مجوزهاست و تا تعیین تکلیف هر مجوز، ورود به اجرا مجاز نیست.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="refresh" type="button">${ic('refresh')} استعلام وضعیت مراجع</button>
      <button class="btn btn--primary" data-action="act" data-act="export" type="button">${ic('download')} گزارش انطباق</button>
    </div>
  </header>

  <section class="grid grid--4">
    <article class="kpi"><div class="kpi__top"><div class="kpi__label">کل مجوزهای دوره</div><span class="kpi__ic">${ic('permit')}</span></div>
      <div class="kpi__val"><span data-count="${PERMIT_STATS.total}">0</span><small>مجوز</small></div>
      <div class="kpi__foot"><span>در ۸ مرجع صالح</span></div></article>
    <article class="kpi kpi--ok"><div class="kpi__top"><div class="kpi__label">تعیین‌تکلیف‌شده</div><span class="kpi__ic">${ic('check')}</span></div>
      <div class="kpi__val"><span data-count="${PERMIT_STATS.ok}">0</span><small>مجوز</small></div>
      <div class="kpi__foot"><span>${Math.round((PERMIT_STATS.ok / PERMIT_STATS.total) * 100)}٪ از کل</span></div></article>
    <article class="kpi kpi--warn"><div class="kpi__top"><div class="kpi__label">در جریان</div><span class="kpi__ic">${ic('clock')}</span></div>
      <div class="kpi__val"><span data-count="${PERMIT_STATS.warn}">0</span><small>مجوز</small></div>
      <div class="kpi__foot"><span>نیازمند پیگیری هفتگی</span></div></article>
    <article class="kpi kpi--bad"><div class="kpi__top"><div class="kpi__label">رد شده یا منقضی</div><span class="kpi__ic">${ic('block')}</span></div>
      <div class="kpi__val"><span data-count="${PERMIT_STATS.bad}">0</span><small>مجوز</small></div>
      <div class="kpi__foot"><span>موجب توقف پرونده در G9</span></div></article>
  </section>

  <div class="note note--gold">${ic('scale')}<div>
    <b>تفکیک مسئولیت:</b> دبیرخانه مرکزی مسئول <u>صدور</u> مجوز نیست. وظیفه دبیرخانه <b>شناسایی مرجع صالح، کنترل وضعیت، پیگیری مهلت و توقف پرونده در صورت عدم تعیین تکلیف</b> است.
    مالک رویداد موظف به تأمین مجوز و ارائه شماره پیگیری معتبر است.
  </div></div>

  <section>
    <div class="sec__head">
      <div class="sec__head-l"><span class="sec__kicker">Permit Register</span><h2>وضعیت مجوزهای کلیدی</h2></div>
      <div class="filters" data-filter-scope>
        <button class="fchip is-on" data-action="filter" data-filter="all" type="button">همه <span class="fchip__n">${PERMITS.length}</span></button>
        <button class="fchip" data-action="filter" data-filter="ok" type="button">تعیین‌تکلیف‌شده <span class="fchip__n">${PERMITS.filter(p => p.st === 'ok').length}</span></button>
        <button class="fchip" data-action="filter" data-filter="warn" type="button">در جریان <span class="fchip__n">${PERMITS.filter(p => p.st === 'warn').length}</span></button>
        <button class="fchip" data-action="filter" data-filter="bad" type="button">رد / منقضی <span class="fchip__n">${PERMITS.filter(p => p.st === 'bad').length}</span></button>
      </div>
    </div>
    <div class="permitgrid">
      ${PERMITS.map((p, i) => `
        <article class="permit permit--${p.st}" data-facet="${p.st}">
          <div class="permit__hd">
            <span class="permit__ic">${ic(p.st === 'ok' ? 'check' : p.st === 'warn' ? 'clock' : 'block')}</span>
            <span class="permit__t"><b>${esc(p.n)}</b><span>${esc(p.a)}</span></span>
          </div>
          <div class="permit__bd">
            <div class="permit__meta">
              <div><span>شماره پیگیری</span><b class="ltr">${esc(p.id)}</b></div>
              <div><span>اعتبار</span><b>${esc(p.exp)}</b></div>
              <div><span>زمان اخذ</span><b>${esc(p.lead)}</b></div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap">
              <span class="badge badge--${ST[p.st][0]}">${ST[p.st][1]}</span>
              <span class="badge badge--outline">${ic('file')} ${p.ev} پرونده مرتبط</span>
            </div>
          </div>
          <button class="btn btn--sm btn--ghost" data-action="permit" data-idx="${i}" type="button">${ic('doc')} جزئیات و مستندات</button>
        </article>`).join('')}
    </div>
  </section>

  <div class="grid grid--sidebar">
    <section class="panel">
      <div class="panel__head"><div><h3>ماتریس انطباق بر پایه ماهیت رویداد</h3><p>مجوزهای الزامی هر دسته پیش از ورود به اجرا</p></div>
        <span class="badge badge--blue">گیت G9</span></div>
      <div class="tblwrap"><table class="tbl">
        <thead><tr><th>ماهیت رویداد</th><th>مجوزهای الزامی</th><th>کنترل دبیرخانه</th></tr></thead>
        <tbody>${CATEGORIES.map(c => `<tr>
          <td><div class="t-main" style="display:flex;gap:9px;align-items:center"><span style="color:var(--blue-600);width:16px">${ic(c.ic)}</span>${esc(c.n)}</div></td>
          <td><div class="taglist">${c.req.map(r => `<span class="tag tag--gold">${esc(r)}</span>`).join('')}</div></td>
          <td><span class="badge badge--ok">${ic('check')} کنترل‌شده</span></td>
        </tr>`).join('')}</tbody>
      </table></div>
      <div class="panel__foot"><span>در رویدادهای ترکیبی، اجتماع مجوزهای همه دسته‌های مرتبط الزامی است.</span></div>
    </section>

    <section class="panel">
      <div class="panel__head panel__head--tint"><div><h3>مراجع صالح و زمان اخذ</h3><p>میانگین زمان واقعی اخذ مجوز</p></div>${ic('building')}</div>
      <div class="panel__body" style="display:grid;gap:10px">
        ${AUTHORITIES.map(a => `
          <div class="authority">
            <span class="authority__n">${esc(a.c)}</span>
            <div style="flex:1;min-width:0"><b>${esc(a.n)}</b><span>${esc(a.d)}</span></div>
            <span class="badge badge--outline">${esc(a.lead)}</span>
          </div>`).join('')}
      </div>
      <div class="panel__foot"><span>میانگین وزنی زمان اخذ مجوز دوره جاری: <b>${esc(PERMIT_STATS.avgLead)}</b></span></div>
    </section>
  </div>

  <section class="panel">
    <div class="panel__head panel__head--gold"><div><h3>مجوزهای در معرض انقضا</h3><p>کنترل پیش‌دستانه پیش از شروع بازه اجرا</p></div>
      <span class="badge badge--warn">۹۰ روز آینده</span></div>
    <div class="panel__body">
      <div class="donelist">
        ${[
          { n: 'مجوز برگزاری رویداد ورزشی', id: 'SPT-1405-3310', exp: '۱۴۰۵/۱۱/۳۰', d: 52, own: 'هسته ورزش و سلامت', st: 'warn' },
          { n: 'مجوز پخش زنده و صوتی‌تصویری', id: 'در جریان', exp: 'مهلت ۱۴۰۵/۰۷/۱۱', d: 1, own: 'حقوقی', st: 'bad' },
          { n: 'مجوز بهداشت و پذیرایی', id: 'در جریان', exp: 'مهلت ۱۴۰۵/۰۷/۱۳', d: 3, own: 'هسته ورزش و سلامت', st: 'bad' },
          { n: 'مجوز تبلیغات محیطی', id: 'ADV-1405-1092', exp: '۱۴۰۵/۱۰/۱۵', d: 68, own: 'مارکتینگ', st: 'warn' },
          { n: 'مجوز نمایشگاهی و غرفه‌آرایی', id: 'EXH-1405-0771', exp: '۱۴۰۵/۱۰/۳۰', d: 83, own: 'بهره‌برداری', st: 'warn' }
        ].map(r => `
          <div class="donerow">
            <div><div class="t-main">${esc(r.n)}</div><div class="t-sub ltr">${esc(r.id)}</div></div>
            <span class="badge badge--outline">${esc(r.own)}</span>
            <span class="t-num">${esc(r.exp)}</span>
            <div class="meter__track"><span class="meter__fill ${r.st === 'bad' ? 'meter--bad' : 'meter--warn'}" data-w="${Math.max(6, 100 - r.d)}"></span></div>
            <span class="badge badge--${r.st}">${r.d} روز مانده</span>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

/* ── permit drawer ── */
export function permitDrawer(idx){
  const p = PERMITS[Number(idx)];
  if (!p) return;
  const rel = EVENTS.filter(e => e.lvl >= 2).slice(0, p.ev);
  openDrawer({
    eyebrow: ST[p.st][1],
    title: p.n,
    html: `
      <div style="display:grid;gap:var(--s5)">
        <div style="display:flex;flex-wrap:wrap;gap:9px">
          <span class="badge badge--${ST[p.st][0]} badge--lg">${ST[p.st][1]}</span>
          <span class="badge badge--blue">${esc(p.a)}</span>
        </div>
        <div class="kv">
          <div class="kv__row"><span class="kv__k">مرجع صالح</span><span class="kv__v">${esc(p.a)}</span></div>
          <div class="kv__row"><span class="kv__k">شماره پیگیری</span><span class="kv__v ltr">${esc(p.id)}</span></div>
          <div class="kv__row"><span class="kv__k">اعتبار مجوز</span><span class="kv__v">${esc(p.exp)}</span></div>
          <div class="kv__row"><span class="kv__k">میانگین زمان اخذ</span><span class="kv__v">${esc(p.lead)}</span></div>
          <div class="kv__row"><span class="kv__k">مسئول پیگیری</span><span class="kv__v">${p.st === 'ok' ? 'حقوقی — تکمیل‌شده' : 'حقوقی با همکاری مالک رویداد'}</span></div>
        </div>

        <div class="panel" style="box-shadow:none">
          <div class="panel__head"><div><h3>کنترل گیت G9 در این مجوز</h3><p>موارد بررسی دبیرخانه</p></div><span class="badge badge--gold">G9</span></div>
          <div class="panel__body"><div class="checks">
            ${checkRow('شناسایی مرجع صالح بر پایه ماهیت رویداد', 'ok')}
            ${checkRow('دریافت شماره پیگیری و تأیید اصالت', p.st === 'ok' ? 'ok' : 'warn')}
            ${checkRow('کنترل تاریخ اعتبار نسبت به بازه اجرا', p.st === 'bad' ? 'bad' : 'ok')}
            ${checkRow('انطباق محتوای تبلیغاتی با مقررات', p.st === 'bad' ? 'bad' : 'ok')}
            ${checkRow('بایگانی تصویر مجوز در پرونده رویداد', p.st === 'ok' ? 'ok' : 'open')}
          </div></div>
        </div>

        ${p.st !== 'ok' ? `<div class="note note--warn">${ic('alert')}<div><b>اثر بر پرونده:</b> این مجوز در وضعیت تعیین‌تکلیف‌نشده قرار دارد و مانع صدور GO در گیت G13 برای پرونده‌های وابسته است. تا دریافت مجوز، تبلیغات مرتبط نیز مجاز نیست.</div></div>` : ''}

        <div class="panel" style="box-shadow:none">
          <div class="panel__head"><div><h3>پرونده‌های وابسته</h3><p>رویدادهایی که این مجوز برای آن‌ها لازم است</p></div>${ic('file')}</div>
          <div class="panel__body" style="display:grid;gap:9px">
            ${rel.map(e => `
              <div class="accessrow">
                <span class="accessrow__ic">${ic('calendar')}</span>
                <div><b>${esc(e.t)}</b><span class="ltr">${esc(e.id)} · ${esc(e.place)}</span></div>
                <span class="badge badge--blue">${esc(e.stage)}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="note">${ic('scale')}<div>پیگیری وضعیت مجوز بر عهده واحد حقوقی است؛ مالک رویداد موظف است هرگونه تغییر یا رد مجوز را حداکثر ۲۴ ساعت به دبیرخانه اعلام کند.</div></div>
      </div>`
  });
}
