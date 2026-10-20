const SYSTEMS = [
  { id:'strategy', kind:'Live dashboard · Notion + GoHighLevel', title:'Strategy Execution Dashboard',
    summary:'Shows whether every strategy idea ships within 7 days, and which clients and product owners need attention.',
    metric:'241 ideas · 27 clients', cover:'strategy',
    images:[['strat-1.jpg','Overview: what was suggested, what shipped and which client needs attention'],['strat-2.jpg','Client cards: execution rate and every idea\'s status and days overdue'],['strat-3.jpg','Calls: previous and next strategy call per client, from the GoHighLevel calendar'],['strat-4.jpg','Checkpoints: 14-day, 30-day and renewal checks for each project phase'],['strat-5.jpg','Allocation: every active project grouped by strategy team member'],['strat-6.jpg','Bottleneck: stalled ideas and the clients carrying the most overdue work'],['strat-8.jpg','Performance: product owners ranked by delivery for the month'],['strat-9.jpg','Performance table: suggested, excluded, eligible and executed per PO']],
    problem:'The strategy team suggested ideas on every client call, but nobody could see whether product owners executed them before the next call, or which clients were falling behind.',
    how:['Finds every ⭐ idea on each client\'s Notion content board, using the board IDs already stored in the Project Tracker.','Starts a 7-day check-by clock per idea. Published counts as done; On Hold and Do Not Progress are left out of the score.','Calls tab reads the strategy-call calendar from GoHighLevel and scores each call cycle; moving a booking updates it automatically.','Checkpoints, Allocation, Bottleneck and Performance tabs give leadership the full picture, filterable by client and month.'],
    impact:[['241','ideas tracked'],['42','active projects allocated'],['0','manual entry']],
    stack:['Notion API','GoHighLevel API','JavaScript','Vercel serverless','Claude + MCP'] },
  { id:'report', kind:'Web tool · client reporting', title:'Monthly Report Builder',
    summary:'Turns a 2-hour manual client report into four quick steps and a ready-to-send PDF.',
    metric:'2 hrs → 8–10 min', cover:'report',
    images:[['report-output.jpg','The finished one-page client report'],['report-step1.jpg','Step 1: pick the channels the client uses'],['report-step2.jpg','Step 2: upload the Meta export; accounts are detected automatically'],['report-step3.jpg','Step 3: goals fill in from Notion; the PO adds wins and priorities']],
    problem:'Product owners spent about two hours per client copying numbers from each platform, rebuilding charts and retyping goals. Reports were stressful to make and often late.',
    how:['Channels: tick the platforms the client uses.','Data: upload the Meta CSV or Excel export; TikTok, LinkedIn and YouTube use a simple template.','Details: pick the client and their 90-day goal fills in from the Notion Project Tracker.','Report: weekly views, channel split, top 3 posts and the goal ring are built automatically, then saved as a PDF.'],
    impact:[['8–10 min','per report (was ~2 hrs)'],['50+ hrs','saved a month (est.)'],['1 format','for every client']],
    stack:['JavaScript','CSV / XLSX parsing','Notion API','Vercel','SOP + video guides'] },
  { id:'pace', kind:'Live dashboard · content deadlines', title:'PO Pace Dashboard',
    summary:'Flags content cards across every client board before a review deadline is missed.',
    metric:'33+ boards per refresh', cover:'pace',
    images:[['pace-flags.jpg','Flags grouped by product owner and client, by urgency'],['pace-scan.jpg','Full scan: every active client, cards checked and cards flagged']],
    problem:'Content status was spread across more than 30 separate Notion boards. Late cards were usually found after the post date had already passed.',
    how:['Reads the Project Tracker to find every active client and their content board.','Checks each card against its publish date: Critical if review was missed, High if review is due today, Heads-up if it\'s behind pace.','Reads each client\'s review lead time from the team\'s cadence sheet, with a 24-hour default.','One click copies the flag list for Slack, per PO or for everyone.'],
    impact:[['33+','client boards in one view'],['3','urgency levels'],['0','boards opened by hand']],
    stack:['Notion API','Google Sheets API','JavaScript','Vercel serverless'] },
  { id:'flags', kind:'Live dashboard · weekly audits', title:'Flag Trends',
    summary:'Turns weekly client audits into trends, a PO leaderboard and a list of clients to watch.',
    metric:'Grows every audit week', cover:'flags', illustration:true,
    problem:'Every week the team audited each client and logged execution and creative flags in Notion, but there was no way to see patterns across weeks or spot repeat problems.',
    how:['Reads the Weekly Audit Records database and adds each new audit week automatically.','Dashboard: total audits, execution flags and creative flags over time, with each client\'s history.','Top Performers and a PO Leaderboard ranked by best post and peak views, with a pod breakdown.','Clients to Watch lists repeat flags; Data Gaps shows missing audit fields. Embedded in the team\'s Notion page.'],
    impact:[['Weekly','trend, no manual tallying'],['Early','warning on repeat issues'],['Embedded','in Notion']],
    stack:['Notion API','JavaScript','Vercel serverless'] },
  { id:'tasks', kind:'Slack + Notion · accountability', title:'POD Task Tracker',
    summary:'A weekly view of what every product owner did, built from their daily Slack updates.',
    metric:'1,313 tasks in 3 weeks', cover:'tasks',
    images:[['tracker-table.jpg','One week of the weekly report, with names replaced']],
    problem:'Product owners posted daily task updates in Slack, and they disappeared. There was no weekly picture of who finished what, or which tasks kept slipping.',
    how:['Claude reads the week\'s Slack updates and produces an Excel report: a summary per PO, a breakdown per client and a daily log that flags tasks carried over.','A web dashboard reads the Notion task tracker and shows each pod\'s totals, % done, % in progress and the change from last week.','Generate Report saves a PDF or CSV snapshot and archives the week in Notion for week-on-week comparison.'],
    impact:[['1,313','tasks logged in 3 weeks'],['11','product owners in 4 pods'],['0','manual data entry']],
    stack:['Claude + Slack','Excel','Next.js','TypeScript','Notion API','Vercel'] },
  { id:'mkt', kind:'Live dashboard · marketing ops', title:'Marketing Ops Dashboard',
    summary:'One place for the marketing lead\'s day: funnels, upsell checkpoints, ads and client briefs.',
    metric:'Reads and writes Notion', cover:'mkt', illustration:true,
    problem:'The marketing lead\'s information was spread across the Project Tracker, project and task databases, the strategy board and the phase archive.',
    how:['Today, Funnels, Upsell, Ads and Briefs tabs pull from five Notion databases at once.','Upsell suggests a route (win, client ask or gap) and an offer from each client\'s blockers and phase results, then saves the checkpoint back to Notion.','Ad logs and per-client ad settings are saved from the page. Team sign-in with a company email; the Notion token never reaches the browser.'],
    impact:[['5','Notion databases in one view'],['2-way','reads and saves'],['Secure','team login']],
    stack:['Notion API (read + write)','JavaScript','Vercel serverless','Session login'] }
];

const PROJECTS = [
  { id:'c3s', kind:'Project Lead · Oct – Dec 2024', title:'Project C3S',
    summary:'A supplier portal designed to end stockouts, missed messages and order surprises.', cover:'c3s',
    pdf:['c3s-project-report.pdf','Full project report (73 pages)'],
    problem:'A Sri Lankan company faced supply chain disruptions, communication breakdowns with its suppliers, and regular stockouts.',
    how:['Real-time inventory alerts so suppliers see stock levels before a shortage.','Order status tracking that suppliers update themselves.','Supplier performance analytics on delivery timeliness and accuracy, plus one shared messaging hub.','Subscription model for suppliers, with the first nine onboarded free to build adoption.'],
    impact:[['73 pages','full project report'],['Break-even','and cash-flow plan'],['Risk','and stakeholder plans']],
    stack:['Project management','Supplier management','Financial modelling'] },
  { id:'samsung', kind:'Team Lead · Jun – Aug 2023', title:'Samsung Galaxy P1 Pro',
    summary:'A purchasing and supply chain strategy for launching a new Samsung stylus.', cover:'samsung',
    pdf:['samsung-purchasing-strategy.pdf','Purchasing strategy report'],
    problem:'Plan how Samsung should buy, make and distribute a new product so it launches on time and stays cost-effective.',
    how:['Global sourcing that balances cost, quality and supplier reliability.','Lean manufacturing and just-in-time inventory, with Kanban and automation.','Blockchain for traceability, ERP and APS for planning, greener packaging and logistics.','I wrote the executive summary, background and strategic analysis.'],
    impact:[['Lower','procurement cost'],['Faster','order fulfilment'],['Global','sourcing plan']],
    stack:['Purchasing strategy','Demand forecasting','Supplier partnerships','Logistics'] },
  { id:'aura', kind:'Founder & Project Lead · Sep 2024 – Jan 2025', title:'Project AURA',
    summary:'Smart clothing that harvests solar, thermal and kinetic energy. Competition finalist.', cover:'aura',
    images:[['aura-award.jpg','Accepting the award as competition finalists'],['aura-cover.jpg','Cover of the AURA business plan']],
    problem:'Build a full business case for an eco-friendly smart apparel brand, in an international team of Sri Lankan and French students from Toulouse.',
    how:['Defined the brand, product line and pricing (jackets from €300, hoodies €225).','Led market research: wearable tech worth $61.3B in 2022, heading to $157.3B by 2030.','Planned three years of growth: 500 to 1,000 units and €150k to €300k revenue at about 47% margin.','Presented the business model and go-to-market plan at the final.'],
    impact:[['Finalist','at the competition'],['2 countries','one team'],['~47%','planned margin']],
    stack:['Leadership','Market research','Pricing','Financial planning'] },
  { id:'g2fs', kind:'Team Lead · Jun – Sep 2023', title:'Green Fiber Filter Sphere',
    summary:'A start-up plan for a laundry filter that stops microfibres reaching the sea.', cover:'g2fs',
    pdf:['g2fs-business-plan.pdf','Start-up business plan'],
    problem:'Microfibres from washing machines pollute rivers and oceans, and existing filters are hard to maintain.',
    how:['Triple filtration, self-cleaning and smart sensors that adjust to detergent and water conditions.','Priced at LKR 4,200 for households, laundromats and hotels; sold through Keells, IKEA India, Amazon, Daraz and eBay.','LKR 34.5M investment plan, with LKR 32M secured through green loans and founder funds.','I wrote the start-up section of the business plan.'],
    impact:[['LKR 34.5M','investment plan'],['15%','yearly growth target'],['5','sales channels']],
    stack:['Business planning','Market sizing','Funding strategy'] },
  { id:'nike', kind:'Personal case study · Apr 2026', title:'Nike “Just Do It”',
    summary:'How a slogan became a demand engine, and what that means for planning and supply.', cover:'nike',
    pdf:['nike-case-study.pdf','Case study deck'],
    problem:'Look past the branding to see how marketing decisions at the top shape demand planning, procurement and supply chain further down.',
    how:['Emotion-led storytelling, athlete endorsements and one consistent message on every channel.','How identity-based marketing builds repeat demand and pricing power.','How stable demand supports inventory planning and forecasting.','Nike\'s revenue grew from $9.2B in 1988 to over $39B by 2019.'],
    impact:[['30+ years','one campaign'],['100+','countries reached'],['$39B+','revenue by 2019']],
    stack:['Brand strategy','Demand generation','Supply chain'] }
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const arrow = '<svg width="16" height="16"><use href="#i-arrow"/></svg>';

function card(p, isSystem){
  const foot = isSystem
    ? `<span class="metric">${esc(p.metric)}</span><span class="more">Details ${arrow}</span>`
    : `${p.pdf ? '<span class="pdf-flag">PDF report</span>' : '<span class="pdf-flag">Photos</span>'}<span class="more">Details ${arrow}</span>`;
  return `<button class="card" type="button" data-id="${p.id}" aria-haspopup="dialog">
    <div class="cover"><img src="assets/covers/${p.cover}.jpg" alt="${esc(p.title)} cover" loading="lazy" width="1600" height="1200"></div>
    <div class="body"><p class="kind">${esc(p.kind)}</p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><div class="foot">${foot}</div></div>
  </button>`;
}
document.getElementById('systemGrid').innerHTML = SYSTEMS.map(p => card(p, true)).join('');
document.getElementById('projectGrid').innerHTML = PROJECTS.map(p => card(p, false)).join('');

const ALL = Object.fromEntries([...SYSTEMS, ...PROJECTS].map(p => [p.id, p]));
const dlg = document.getElementById('dlg');
let lastFocus = null;

function open(id){
  const p = ALL[id]; if (!p) return;
  document.getElementById('dlgKind').textContent = p.kind;
  document.getElementById('dlgTitle').textContent = p.title;
  const imgs = p.images ? p.images.map(([f,c]) => [`assets/img/${f}`, c]) : [[`assets/covers/${p.cover}.jpg`, p.illustration ? 'Illustration with example numbers. The live dashboard shows real client data, so it isn\'t shown here.' : p.title]];
  const viewer = `<div class="viewer"><img id="vImg" src="${imgs[0][0]}" alt="${esc(imgs[0][1])}"></div>
    <p class="cap-t" id="vCap">${esc(imgs[0][1])}</p>
    ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((im,i) => `<button type="button" data-i="${i}" aria-current="${i===0}" aria-label="Image ${i+1}: ${esc(im[1])}"><img src="${im[0]}" alt=""></button>`).join('')}</div>` : ''}`;
  const actions = p.pdf ? `<div class="dlg-actions"><a class="btn ink" href="docs/${p.pdf[0]}" target="_blank" rel="noopener"><svg><use href="#i-pdf"/></svg>Open ${esc(p.pdf[1])}</a></div>` : '';
  const isSys = SYSTEMS.includes(p);
  document.getElementById('dlgBody').innerHTML = `${viewer}${actions}
    <div class="impact">${p.impact.map(([a,b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>
    <div class="cols">
      <div><h4>The problem</h4><p>${esc(p.problem)}</p></div>
      <div><h4>${isSys ? 'How it works' : 'What we did'}</h4><ul>${p.how.map(h => `<li>${esc(h)}</li>`).join('')}</ul></div>
      <div><h4>${isSys ? 'Built with' : 'Skills used'}</h4><div class="chips">${p.stack.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>
    </div>`;
  const thumbs = dlg.querySelectorAll('.thumbs button');
  thumbs.forEach(b => b.addEventListener('click', () => {
    const [src, cap] = imgs[+b.dataset.i];
    const v = document.getElementById('vImg'); v.src = src; v.alt = cap;
    document.getElementById('vCap').textContent = cap;
    thumbs.forEach(t => t.setAttribute('aria-current', String(t === b)));
  }));
  lastFocus = document.activeElement;
  dlg.showModal();
  dlg.querySelector('.dlg-body').scrollTop = 0;
}
document.addEventListener('click', e => { const c = e.target.closest('.card[data-id]'); if (c) open(c.dataset.id); });
document.getElementById('dlgClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => { if (lastFocus) lastFocus.focus(); });

document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied'; }
  catch (err) {
    const el = b.parentElement.querySelector('.v');
    if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    b.textContent = 'Selected';
  }
  setTimeout(() => { b.textContent = 'Copy'; }, 1600);
}));
