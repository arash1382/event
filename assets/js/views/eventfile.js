/* ============================================================================
   views/eventfile.js — Sample Event Case + event detail drawer
   ========================================================================== */
import { SAMPLE, EVENTS, GATES, CORES, LEVELS, RUNSHEET } from '../data.js';
import { ic, esc, openDrawer, checkRow, meter, lvlBadge, trend } from '../ui.js';

const JST = { ok: ['ok', 'check'], warn: ['warn', 'alert'], bad: ['bad', 'block'] };
const CORE_NAME = Object.fromEntries(CORES.map(c => [c.id, c.name]));
const findGate = c => GATES.find(g => g.code === c) || {};

function header(){
  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">Sample Event File</span>
      <h1>پرونده نمونه رویداد — مسیر کامل یک پرونده واقعی</h1>
      <p class="pagehead__lede">
        این پرونده، نمونه‌ای کامل از گردش کار دبیرخانه از مرحله ایده تا تصمیم شورا است.
        همه گیت‌ها، مستندات، الزامات باز و شاخص‌های آن به‌صورت زنده از یک پرونده واحد خوانده می‌شود.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="notify" type="button">${ic('radio')} یادآوری الزامات باز</button>
      <button class="btn btn--gold" data-action="act" data-act="export" type="button">${ic('download')} خروجی تصمیم شورا</button>
    </div>
  </header>`;
}

function banner(){
  return `
  <section class="evthead">
    <div class="evtbanner">
      <div class="evtcode">
        <span class="evtcode__id">${esc(SAMPLE.id)}</span>
        <span class="badge badge--gold">${esc(SAMPLE.verdict)}</span>
        <span class="badge badge--outline" style="background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);color:#fff">مرحله ${SAMPLE.stage} از ۱۳</span>
      </div>
      <h2 class="evtbanner__t">${esc(SAMPLE.title)}</h2>
      <div class="evtbanner__m">
        <div><b>${esc(SAMPLE.core)}</b><span>هسته تخصصی مالک</span></div>
        <div><b>سطح ${SAMPLE.level}</b><span>${esc(SAMPLE.levelName)}</span></div>
        <div><b>${esc(SAMPLE.jalali)}</b><span>${esc(SAMPLE.gregorian)}</span></div>
        <div><b>${esc(SAMPLE.projected)}</b><span>مخاطب پیش‌بینی‌شده</span></div>
        <div><b>${esc(SAMPLE.budget)}</b><span>بودجه مصوب</span></div>
      </div>
    </div>

    <div class="panel" style="margin:0">
      <div class="panel__head panel__head--gold"><div><h3>وضعیت تصمیم</h3><p>تصمیم G13 شورای مرکزی</p></div>${ic('gavel')}</div>
      <div class="panel__body" style="display:grid;gap:15px;justify-items:center;text-align:center">
        <span class="stamp stamp--cond" style="font-size:var(--fs-sm);padding:10px 18px">CONDITIONAL GO</span>
        <div style="font-size:var(--fs-2xs);color:var(--ink-400);font-weight:700">تاریخ تصمیم: ${esc(SAMPLE.verdictDate)} — امضای دبیر شورا</div>
        <div style="width:100%">${meter('امتیاز آمادگی پرونده', SAMPLE.score + '٪', 'gold', SAMPLE.score)}</div>
        <div class="rule" style="margin:2px 0"></div>
        <div class="stat-inline" style="justify-content:center">
          <div><b>${SAMPLE.journey.filter(j => j.st === 'ok').length}</b><span>گیت بسته</span></div>
          <div><b>${SAMPLE.journey.filter(j => j.st === 'warn').length}</b><span>گیت دارای الزام</span></div>
          <div><b>${SAMPLE.conditions.length}</b><span>الزام باز</span></div>
        </div>
        <div class="note note--warn" style="text-align:start">${ic('alert')}<div>اجرا تنها با تکمیل <b>۵ الزام</b> و تأیید کتبی دبیرخانه پیش از <b>۱۸ مهر ۱۴۰۵</b> مجاز است.</div></div>
      </div>
    </div>
  </section>`;
}

function identity(){
  return `
  <section class="panel">
    <div class="panel__head"><div><h3>شناسنامه رویداد</h3><p>نتایج گیت G0 — ثبت و طبقه‌بندی</p></div>
      <span class="badge badge--blue">${ic('file')} ${esc(SAMPLE.id)}</span></div>
    <div class="panel__body">
      <div class="grid grid--2" style="gap:22px">
        <div class="kv">
          <div class="kv__row"><span class="kv__k">مالک رویداد</span><span class="kv__v">${esc(SAMPLE.owner)}</span></div>
          <div class="kv__row"><span class="kv__k">متقاضی</span><span class="kv__v">${esc(SAMPLE.applicant)}</span></div>
          <div class="kv__row"><span class="kv__k">هسته تخصصی</span><span class="kv__v">${esc(SAMPLE.core)}</span></div>
          <div class="kv__row"><span class="kv__k">سطح رویداد</span><span class="kv__v" style="display:flex">${lvlBadge(SAMPLE.level, SAMPLE.levelName)}</span></div>
        </div>
        <div class="kv">
          <div class="kv__row"><span class="kv__k">مکان اجرا</span><span class="kv__v">${esc(SAMPLE.place)}</span></div>
          <div class="kv__row"><span class="kv__k">بازه زمانی</span><span class="kv__v">${esc(SAMPLE.jalali)} · ${esc(SAMPLE.window)}</span></div>
          <div class="kv__row"><span class="kv__k">مخاطب هدف</span><span class="kv__v">${esc(SAMPLE.audience)}</span></div>
          <div class="kv__row"><span class="kv__k">اسپانسرینگ</span><span class="kv__v">${esc(SAMPLE.sponsor)}</span></div>
        </div>
      </div>
    </div>
    <div class="panel__foot">
      <span>شناسه یکتا غیرقابل انتقال است؛ تغییر مالک یا سطح رویداد نیازمند تصمیم شورا است.</span>
      <a class="btn btn--sm btn--ghost" href="#/operations">${ic('runsheet')} Run Sheet این رویداد</a>
    </div>
  </section>`;
}

function journey(){
  return `
  <section class="panel">
    <div class="panel__head">
      <div><h3>مسیر پرونده در گیت‌های کنترلی</h3><p>تاریخ، نتیجه و یادداشت هر گیت در این پرونده</p></div>
      <div class="legend">
        <span style="color:var(--ok-600)"><i></i>بسته‌شده</span>
        <span style="color:var(--warn-600)"><i></i>دارای الزام</span>
      </div>
    </div>
    <div class="panel__body"><div class="journey">
      ${SAMPLE.journey.map(j => {
        const s = JST[j.st] || JST.warn;
        const g = findGate(j.code);
        return `<div class="jrow ${j.st !== 'ok' ? 'jrow--open' : ''}" style="cursor:pointer" data-action="gate" data-code="${j.code}">
          <span class="jrow__code"><i>${esc(j.code)}</i><span>${esc(j.t)}</span></span>
          <span class="jrow__bd">
            <b>${esc(j.d)}</b>
            <p>${esc(g.purpose || '')}</p>
          </span>
          <span class="jrow__st" style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
            <span class="badge badge--${s[0]}">${ic(s[1])} ${j.st === 'ok' ? 'بسته' : 'الزام باز'}</span>
            <span class="tbl__code">${esc(j.at)}</span>
          </span>
        </div>`;
      }).join('')}
    </div></div>
  </section>`;
}

function conditions(){
  return `
  <section class="panel">
    <div class="panel__head panel__head--gold">
      <div><h3>الزامات باز — شرط اجرای رویداد</h3><p>مطابق تصمیم CONDITIONAL GO شورای مرکزی</p></div>
      <span class="badge badge--warn">${SAMPLE.conditions.length} الزام</span>
    </div>
    <div class="panel__body" style="display:grid;gap:14px">
      ${SAMPLE.conditions.map((c, i) => `
        <div style="display:grid;gap:9px;padding-bottom:14px;border-bottom:${i === SAMPLE.conditions.length - 1 ? '0' : '1px dashed var(--ink-150)'}">
          <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
            <div style="display:flex;gap:10px;align-items:center;min-width:0">
              <span class="principle__n">${i + 1}</span>
              <b style="font-size:var(--fs-sm);font-weight:800">${esc(c.t)}</b>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <span class="badge badge--outline">${ic('users')} ${esc(c.own)}</span>
              <span class="badge badge--${c.p >= 80 ? 'ok' : c.p >= 50 ? 'warn' : 'bad'}">${ic('clock')} مهلت ${esc(c.due)}</span>
            </div>
          </div>
          ${meter('پیشرفت رفع الزام', c.p + '٪', c.p >= 80 ? 'ok' : c.p >= 50 ? 'warn' : 'bad', c.p)}
        </div>`).join('')}
    </div>
    <div class="panel__foot">
      <span>در صورت عدم تکمیل هر الزام تا مهلت مقرر، تصمیم به‌صورت خودکار به NO-GO تبدیل می‌شود.</span>
      <button class="btn btn--sm btn--primary" data-action="act" data-act="notify" type="button">${ic('radio')} ارسال یادآوری</button>
    </div>
  </section>`;
}

function kpis(){
  return `
  <section class="panel">
    <div class="panel__head"><div><h3>شاخص‌های تجاری و مخاطب</h3><p>مطابق مدل مصوب گیت G4 و برنامه CRM در G8</p></div>
      <span class="badge badge--gold">${ic('chart')} پیش‌بینی تا پایان رویداد</span></div>
    <div class="panel__body">
      <div class="grid grid--4" style="gap:14px">
        ${SAMPLE.kpis.map(k => `
          <div class="panel" style="box-shadow:none">
            <div class="panel__body" style="padding:14px;display:grid;gap:9px">
              <span class="hint">${esc(k.l)}</span>
              <b style="font-size:var(--fs-xl);font-weight:900;letter-spacing:-.02em;color:${k.gold ? 'var(--gold-700)' : 'var(--ink-900)'}">${esc(k.v)}</b>
              <span class="hint">${esc(k.u)}</span>
              <div class="meter__track" style="height:6px"><span class="meter__fill ${k.gold ? 'meter--gold' : ''}" data-w="${k.p}"></span></div>
              <span class="hint">${k.p}٪ از هدف مصوب</span>
            </div>
          </div>`).join('')}
      </div>
      <div class="rule"></div>
      <div class="grid grid--3" style="gap:16px">
        <div class="note note--gold">${ic('wallet')}<div><b>ساختار مالی:</b> بودجه مصوب ${esc(SAMPLE.budget)}؛ ۴۴٪ از طریق اسپانسرینگ، ۳۱٪ بودجه مارکتینگ، ۲۵٪ درآمد غرفه.</div></div>
        <div class="note">${ic('qr')}<div><b>باشگاه مشتریان:</b> پیش‌بینی ۳٬۱۹۰ ثبت‌نام جدید با نرخ تبدیل ۳۷٪ از مخاطبان QR.</div></div>
        <div class="note note--ok">${ic('shield')}<div><b>ریسک تجاری:</b> وابستگی ۴۴ درصدی به اسپانسر؛ نیازمند تضمین قراردادی عدم انصراف.</div></div>
      </div>
    </div>
  </section>`;
}

function runsheetMini(){
  const rows = RUNSHEET.slice(0, 6);
  return `
  <section class="panel">
    <div class="panel__head"><div><h3>چکیده Run Sheet اجرا</h3><p>زمان‌بندی مصوب مرحله ۷ — برنامه‌ریزی اجرایی</p></div>
      <a class="btn btn--sm btn--ghost" href="#/operations">${ic('runsheet')} نمای کامل</a></div>
    <div class="tblwrap"><table class="tbl tbl--tight">
      <thead><tr><th>ساعت</th><th>روز</th><th>فعالیت</th><th>مسئول</th><th>وضعیت</th></tr></thead>
      <tbody>${rows.map(r => `<tr>
        <td><span class="t-num ltr">${esc(r.t)}</span></td>
        <td style="color:var(--ink-400);font-weight:700">${esc(r.t2)}</td>
        <td class="t-main">${esc(r.ttl)}</td>
        <td style="color:var(--ink-500);font-weight:600">${esc(r.own)}</td>
        <td><span class="badge badge--${r.st === 'ok' ? 'ok' : r.st === 'now' ? 'gold' : 'idle'}">${r.st === 'ok' ? 'انجام‌شده' : r.st === 'now' ? 'جاری' : 'آینده'}</span></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </section>`;
}

export default function eventfile(){
  return `
    ${header()}
    ${banner()}
    ${identity()}
    <div class="grid grid--sidebar">
      <div class="grid" style="gap:var(--s5)">${journey()}${kpis()}</div>
      <div class="grid" style="gap:var(--s5)">${conditions()}${runsheetMini()}</div>
    </div>`;
}

/* ── drawer for any event in the portfolio ── */
export function eventDrawer(id){
  const ev = EVENTS.find(e => e.id === id);
  if (!ev) return;
  const gateIdx = GATES.findIndex(g => g.code === ev.stage);
  const done = gateIdx < 0 ? 13 : gateIdx;
  const stMap = { ok: ['ok', 'GO'], progress: ['info', 'در جریان'], warn: ['warn', 'نیازمند تکمیل'], bad: ['bad', 'مسدود'], new: ['idle', 'تازه ثبت‌شده'], conditional: ['gold', 'CONDITIONAL GO'] };
  const s = stMap[ev.status] || stMap.progress;

  openDrawer({
    eyebrow: `پرونده رویداد — ${ev.stage}`,
    title: ev.t,
    html: `
      <div style="display:grid;gap:var(--s5)">
        <div style="display:flex;flex-wrap:wrap;gap:9px;align-items:center">
          <span class="tbl__code" style="font-size:var(--fs-xs)">${esc(ev.id)}</span>
          <span class="badge badge--${s[0]} badge--lg">${esc(ev.verdict)}</span>
          <span class="badge badge--blue">${esc(ev.owner)}</span>
          <span class="badge badge--outline">${esc(CORE_NAME[ev.core])}</span>
        </div>

        <div>${lvlBadge(ev.lvl, LEVELS[ev.lvl - 1].t)}</div>

        <div class="grid grid--2" style="gap:14px">
          <div class="kv">
            <div class="kv__row"><span class="kv__k">مکان اجرا</span><span class="kv__v" style="font-size:var(--fs-xs)">${esc(ev.place)}</span></div>
            <div class="kv__row"><span class="kv__k">بازه تقویمی</span><span class="kv__v" style="font-size:var(--fs-xs)">${ev.start} تا ${ev.end} مهر ۱۴۰۵</span></div>
            <div class="kv__row"><span class="kv__k">مخاطب پیش‌بینی‌شده</span><span class="kv__v" style="font-size:var(--fs-xs)">${esc(ev.crowd)} نفر</span></div>
            <div class="kv__row"><span class="kv__k">بودجه</span><span class="kv__v" style="font-size:var(--fs-xs)">${esc(ev.budget)} ریال</span></div>
          </div>
          <div class="panel" style="box-shadow:none;margin:0">
            <div class="panel__body" style="display:grid;gap:12px">
              <div class="core__cap">پیشرفت در گیت‌های کنترلی</div>
              <div class="meter"><div class="meter__top"><span class="meter__name">گیت جاری</span><span class="meter__val">${esc(ev.stage)}</span></div>
                <div class="meter__track"><span class="meter__fill" data-w="${Math.round((done / 14) * 100)}"></span></div></div>
              <div class="stat-inline">
                <div><b>${done}</b><span>گیت بسته‌شده</span></div>
                <div><b>${14 - done}</b><span>گیت باقی‌مانده</span></div>
              </div>
              <div class="hint">مرجع تصویب: ${esc(LEVELS[ev.lvl - 1].approver)} — حداقل مهلت ${esc(LEVELS[ev.lvl - 1].sla)}</div>
            </div>
          </div>
        </div>

        <div class="panel" style="box-shadow:none">
          <div class="panel__head"><div><h3>گیت‌های باقی‌مانده تا اجرا</h3><p>به ترتیب ارجاع دبیرخانه</p></div>${ic('gate')}</div>
          <div class="panel__body"><div class="checks">
            ${GATES.slice(done).map(g => g.final
              ? checkRow(`${g.code} — ${g.fa} (تصمیم نهایی شورا)`, 'warn')
              : checkRow(`${g.code} — ${g.fa} · مسئول: ${g.owner}`, 'open')).join('')}
          </div></div>
        </div>

        <div class="note">${ic('info')}<div>این پرونده در مرحله <b>${esc(ev.stage)}</b> قرار دارد. برای مشاهده جزئیات هر گیت، از فهرست ۱۴ گیت کنترلی اقدام کنید.</div></div>
        <a class="btn btn--primary" href="#/gates" data-drawer-close>${ic('gate')} رفتن به فهرست گیت‌ها</a>
      </div>`
  });
}
