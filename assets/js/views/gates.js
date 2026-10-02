/* ============================================================================
   views/gates.js — the 14 governance gates (G0 … G13)
   ========================================================================== */
import { GATES, GATE_STATUS_META, VERDICTS, SAMPLE } from '../data.js';
import { ic, esc, openDrawer, nz, checkRow, meter } from '../ui.js';

const tone = s => (s === 'passed' ? 'ok' : s === 'warn' ? 'warn' : s === 'blocked' ? 'bad' : s === 'final' ? 'gold' : 'idle');
const statusLabel = s => ({ passed: 'بسته‌شده', warn: 'نیازمند تکمیل', blocked: 'مسدود', pending: 'در انتظار', final: 'تصمیم نهایی' }[s] || '—');

function track(){
  return `<div class="gmeta__track">
    ${GATES.map(g => {
      const t = tone(g.status);
      return `<button class="gseg gseg--${t}" data-action="gate" data-code="${g.code}" title="${g.code} — ${g.fa}" type="button" style="background:none">
        <span class="gseg__bar"><i data-w="${g.progress}" style="width:0"></i></span>
        <span class="gseg__lb">${g.code}</span>
      </button>`;
    }).join('')}
  </div>`;
}

function card(g){
  const t = tone(g.status);
  return `<article class="gate ${g.final ? 'gate--final' : 'gate--' + t}" data-facet="${g.code} ${g.status} ${g.core || ''}" style="animation-delay:${GATES.indexOf(g) * 26}ms">
    <div class="gate__hd">
      <span class="gate__code">${g.code}</span>
      <span class="gate__hd-t"><b>${esc(g.fa)}</b><i>${esc(g.en)}</i></span>
    </div>
    <div class="gate__bd">
      <p class="gate__purpose">${esc(g.purpose)}</p>
      <div>
        <div class="core__cap" style="margin-bottom:7px">موارد بررسی</div>
        <div class="checks">
          ${g.checks.slice(0, 4).map(c => checkRow(c, g.status === 'blocked' && g.checks.indexOf(c) === 0 ? 'bad' : 'ok')).join('')}
          ${g.checks.length > 4 ? `<div class="hint" style="padding-inline-start:27px">+ ${g.checks.length - 4} مورد دیگر در پرونده گیت</div>` : ''}
        </div>
      </div>
      <div class="meter ${t === 'ok' ? 'meter--ok' : t === 'warn' ? 'meter--warn' : t === 'bad' ? 'meter--bad' : 'meter--gold'}">
        <div class="meter__top"><span class="meter__name">میزان تحقق الزامات</span><span class="meter__val">${g.progress}٪</span></div>
        <div class="meter__track"><span class="meter__fill" data-w="${g.progress}"></span></div>
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap">
        <div><div class="core__cap">مسئول</div><div style="font-size:var(--fs-2xs);font-weight:800;color:var(--ink-800);margin-top:3px">${esc(g.owner)}</div></div>
        <div><div class="core__cap">شاخص</div><div style="font-size:var(--fs-2xs);font-weight:800;color:var(--gold-700);margin-top:3px">${esc(g.kpi)}: ${esc(g.kpiVal)}</div></div>
      </div>
    </div>
    <div class="gate__ft">
      <span class="gate__own">${ic('clock')}<span>مهلت مصوب: ${esc(g.sla)}</span></span>
      <button class="btn btn--sm ${g.final ? 'btn--gold' : 'btn--ghost'}" data-action="gate" data-code="${g.code}" type="button">
        ${g.final ? ic('gavel') : ic('doc')} ${g.final ? 'تصمیم شورا' : 'شرح کامل گیت'}
      </button>
    </div>
  </article>`;
}

function verdicts(){
  return `<div class="verdict">
    ${VERDICTS.map(v => `
      <article class="vcard vcard--${v.tone}">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <span class="vcard__t">${v.t}</span>
          <span class="stamp stamp--${v.tone === 'go' ? 'go' : v.tone === 'cond' ? 'cond' : 'nogo'}">${esc(v.fa)}</span>
        </div>
        <p class="vcard__d">${esc(v.d)}</p>
        <span class="vcard__n">${v.n} پرونده در دوره جاری</span>
      </article>`).join('')}
  </div>`;
}

export default function gates(){
  const open = GATES.filter(g => g.status !== 'passed' && !g.final);
  const closed = GATES.filter(g => g.status === 'passed').length;
  const avg = Math.round(GATES.reduce((a, g) => a + g.progress, 0) / GATES.length);

  return `
  <header class="pagehead">
    <div class="pagehead__l">
      <span class="pagehead__eyebrow">14 Governance Gates</span>
      <h1>چهارده گیت کنترلی راهبری رویداد</h1>
      <p class="pagehead__lede">
        هیچ رویدادی از ایده به اجرا نمی‌رسد مگر آنکه از چهارده گیت کنترلی عبور کند.
        هر گیت دارای مالک مشخص، مهلت مصوب، مستندات الزامی و معیار رد است؛
        و ورود به مرحله بعد تا بسته‌شدن گیت جاری مجاز نیست.
      </p>
    </div>
    <div class="pagehead__actions">
      <button class="btn btn--ghost" data-action="act" data-act="notify" type="button">${ic('radio')} یادآوری به مالکان</button>
      <button class="btn btn--primary" data-action="act" data-act="export" type="button">${ic('download')} خروجی وضعیت گیت‌ها</button>
    </div>
  </header>

  <section class="panel">
    <div class="panel__head">
      <div><h3>خط کنترل — وضعیت تجمعی ۱۴ گیت</h3><p>برای مشاهده شرح هر گیت روی آن کلیک کنید</p></div>
      <div class="legend">
        <span style="color:var(--ok-600)"><i></i>بسته</span>
        <span style="color:var(--warn-600)"><i></i>باز</span>
        <span style="color:var(--bad-600)"><i></i>مسدود</span>
        <span style="color:var(--stop-600)"><i></i>نهایی</span>
      </div>
    </div>
    <div class="panel__body"><div class="gmeta">${track()}</div></div>
    <div class="panel__foot">
      <div class="stat-inline">
        <div><b>${closed}</b><span>گیت بسته‌شده</span></div>
        <div><b>${open.length}</b><span>گیت باز</span></div>
        <div><b>${avg}٪</b><span>میانگین تحقق</span></div>
        <div><b>${SAMPLE.score}٪</b><span>امتیاز پرونده نمونه</span></div>
      </div>
      <a class="btn btn--sm btn--ghost" href="#/event">${ic('file')} پرونده نمونه IRM-1405-0187</a>
    </div>
  </section>

  <section>
    <div class="sec__head">
      <div class="sec__head-l"><span class="sec__kicker">Gate Register</span><h2>فهرست کامل گیت‌ها</h2></div>
      <div class="filters" data-filter-scope>
        <button class="fchip is-on" data-action="filter" data-filter="all" type="button">همه گیت‌ها <span class="fchip__n">${GATES.length}</span></button>
        <button class="fchip" data-action="filter" data-filter="warn" type="button">نیازمند تکمیل <span class="fchip__n">${GATES.filter(g => g.status === 'warn').length}</span></button>
        <button class="fchip" data-action="filter" data-filter="blocked" type="button">مسدود <span class="fchip__n">${GATES.filter(g => g.status === 'blocked').length}</span></button>
        <button class="fchip" data-action="filter" data-filter="passed" type="button">بسته‌شده <span class="fchip__n">${closed}</span></button>
        <button class="fchip" data-action="filter" data-filter="final" type="button">تصمیم نهایی <span class="fchip__n">1</span></button>
      </div>
    </div>
    <div class="gmatrix">${GATES.map(card).join('')}</div>
  </section>

  <section class="panel">
    <div class="panel__head panel__head--gold">
      <div><h3>G13 — سه حالت تصمیم نهایی شورا</h3><p>تصمیم نهایی با امضای دبیر و اعضای شورای مرکزی صادر می‌شود</p></div>
      <span class="badge badge--gold">${ic('gavel')} مرجع: شورای دبیرخانه مرکزی</span>
    </div>
    <div class="panel__body" style="display:grid;gap:18px">
      ${verdicts()}
      <div class="note note--warn">${ic('alert')}<div><b>قاعده توقف:</b> تا تکمیل تمامی الزامات، ورود به اجرا مجاز نیست. در حالت CONDITIONAL GO، دبیرخانه موظف است پیش از ساعت شروع رویداد، تکمیل الزامات را کتباً تأیید کند؛ در غیر این صورت تصمیم به‌صورت خودکار به NO-GO تبدیل می‌شود.</div></div>
      <div class="grid grid--3">
        <div class="panel" style="box-shadow:none">
          <div class="panel__body" style="display:grid;gap:9px">
            <div class="core__cap">ورودی تصمیم</div>
            <div class="checks">
              ${checkRow('کنترل بسته‌بودن G0 تا G12', 'ok')}
              ${checkRow('تأیید آمادگی عملیاتی و لجستیکی', 'ok')}
              ${checkRow('تأیید کتبی HSE، حراست، حقوقی و مالی', 'warn')}
            </div>
          </div>
        </div>
        <div class="panel" style="box-shadow:none">
          <div class="panel__body" style="display:grid;gap:9px">
            <div class="core__cap">مستندات خروجی</div>
            <div class="checks">
              ${checkRow('صورت‌جلسه امضاشده تصمیم نهایی', 'ok')}
              ${checkRow('چک‌لیست آمادگی ۱۰۰٪', 'ok')}
              ${checkRow('فهرست الزامات باقی‌مانده (حالت مشروط)', 'warn')}
            </div>
          </div>
        </div>
        <div class="panel" style="box-shadow:none">
          <div class="panel__body" style="display:grid;gap:9px">
            <div class="core__cap">معیارهای رد (NO-GO)</div>
            <div class="checks">
              ${checkRow('باز بودن هر یک از گیت‌های حیاتی G5، G9، G11، G12', 'bad')}
              ${checkRow('نبود گزارش آمادگی نهایی', 'bad')}
              ${checkRow('غیبت مالک رویداد در جلسه تصمیم', 'bad')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ── gate detail drawer ── */
export function gateDrawer(code){
  const g = GATES.find(x => x.code === code);
  if (!g) return;
  const t = tone(g.status);
  const st = g.status === 'passed' ? 'ok' : g.status === 'warn' ? 'warn' : g.status === 'blocked' ? 'bad' : 'idle';

  openDrawer({
    eyebrow: `Gate ${g.code} — ${statusLabel(g.status)}`,
    title: g.fa,
    html: `
      <div style="display:grid;gap:var(--s5)">
        <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
          <span class="badge badge--${t === 'gold' ? 'gold' : t} badge--lg">${esc(statusLabel(g.status))}</span>
          <span class="badge badge--outline">${esc(g.en)}</span>
          <span class="badge badge--blue">${esc(g.kpi)}: ${esc(g.kpiVal)}</span>
        </div>

        <p style="font-size:var(--fs-sm);line-height:2;color:var(--ink-600)">${esc(g.purpose)}</p>

        ${meter('میزان تحقق الزامات گیت', g.progress + '٪', t === 'ok' ? 'ok' : t === 'warn' ? 'warn' : t === 'bad' ? 'bad' : 'gold', g.progress)}

        <div class="grid grid--2" style="gap:14px">
          <div class="panel" style="box-shadow:none">
            <div class="panel__head"><div><h3>مالکیت و مسئولیت</h3></div>${ic('users')}</div>
            <div class="panel__body">
              <div class="kv">
                <div class="kv__row"><span class="kv__k">واحد مالک</span><span class="kv__v">${esc(g.owner)}</span></div>
                <div class="kv__row"><span class="kv__k">واحدهای همکار</span><span class="kv__v">${g.also.map(a => esc(a)).join(' · ')}</span></div>
                <div class="kv__row"><span class="kv__k">مهلت مصوب</span><span class="kv__v">${esc(g.sla)}</span></div>
              </div>
            </div>
          </div>
          <div class="panel" style="box-shadow:none">
            <div class="panel__head"><div><h3>مستندات الزامی</h3></div>${ic('doc')}</div>
            <div class="panel__body"><div class="checks">
              ${g.evidence.map(e => checkRow(e, 'ok')).join('')}
            </div></div>
          </div>
        </div>

        <div class="panel" style="box-shadow:none">
          <div class="panel__head"><div><h3>موارد بررسی کامل</h3><p>چک‌لیست رسمی گیت ${g.code}</p></div><span class="badge badge--idle">${g.checks.length} مورد</span></div>
          <div class="panel__body"><div class="checks">
            ${g.checks.map((c, i) => checkRow(c, g.status === 'blocked' && i === 0 ? 'bad' : g.status === 'warn' && i < 2 ? 'warn' : 'ok')).join('')}
          </div></div>
        </div>

        <div class="note note--bad">${ic('block')}<div><b>معیارهای رد پرونده در این گیت</b>
          <ul style="margin-top:7px;display:grid;gap:5px">
            ${g.redflags.map(r => `<li style="display:flex;gap:8px"><span style="color:currentColor">—</span><span>${esc(r)}</span></li>`).join('')}
          </ul></div></div>

        <div class="panel" style="box-shadow:none">
          <div class="panel__head panel__head--tint"><div><h3>پرونده‌های مرتبط با این گیت</h3><p>وضعیت در پرونده نمونه شورا</p></div>${ic('file')}</div>
          <div class="panel__body">
            <div class="accessrow">
              <span class="accessrow__ic">${ic('file')}</span>
              <div><b>${esc(SAMPLE.id)} — ${esc(SAMPLE.title)}</b><span>سطح ${SAMPLE.level} · ${esc(SAMPLE.core)}</span></div>
              <span class="badge badge--${st === 'ok' ? 'ok' : st === 'warn' ? 'warn' : 'bad'}">${esc(statusLabel(g.status))}</span>
            </div>
          </div>
        </div>
      </div>`
  });
}
