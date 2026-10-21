/* Portfolio behaviour. Content lives in data.js. */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CAT = Object.fromEntries(window.CATEGORIES);
  const LOGO = { 'Notion': 'b-notion', 'Slack': 'b-slack', 'Zapier': 'b-zapier', 'Claude': 'b-claude', 'Vercel': 'b-vercel', 'GitHub': 'b-github',
    'Google Sheets': 'b-googlesheets', 'GoHighLevel': 'i-ghl', 'JavaScript': 'b-javascript', 'Next.js': 'b-nextdotjs', 'Excel': 'i-excel', 'CSV': 'i-excel' };
  const logoFor = t => { for (const k in LOGO) if (t.includes(k)) return LOGO[k]; return null; };
  const icon = (id, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const logos = list => { const seen = new Set(); return list.map(logoFor).filter(x => x && !seen.has(x) && seen.add(x)).slice(0, 5).map(id => icon(id)).join(''); };

  /* ---------- case study cards + filter ---------- */
  const grid = document.getElementById('workGrid');
  if (grid) {
    grid.innerHTML = window.WORK.map(w => `<button class="case" type="button" data-id="${w.id}" data-cat="${w.cat}" aria-haspopup="dialog" id="card-${w.id}">
      <div class="cover"><img src="assets/covers/${w.cover}.jpg" alt="" loading="lazy" width="1600" height="1200"></div>
      <div class="body"><p class="meta"><span class="cat">${esc(CAT[w.cat])}</span><span class="typ">${esc(w.type)}</span></p>
      <h3>${esc(w.title)}</h3><p>${esc(w.hook)}</p>
      <p class="res-line">${icon('i-check')}${esc(w.result)}</p>
      <div class="foot"><span class="logos" title="${esc(w.stack.join(', '))}">${logos(w.stack)}</span><span class="more">Read case study ${icon('i-arrow')}</span></div></div></button>`).join('');
    grid.classList.add('all');
    const f = document.getElementById('filters');
    const counts = window.WORK.reduce((a, w) => (a[w.cat] = (a[w.cat] || 0) + 1, a), {});
    f.innerHTML = `<button class="chip-f" type="button" data-f="all" aria-pressed="true">All (${window.WORK.length})</button>` +
      window.CATEGORIES.map(([k, v]) => `<button class="chip-f" type="button" data-f="${k}" aria-pressed="false">${esc(v)} (${counts[k] || 0})</button>`).join('');
    f.addEventListener('click', e => {
      const b = e.target.closest('[data-f]'); if (!b) return;
      f.querySelectorAll('[data-f]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      grid.querySelectorAll('.case').forEach(c => { c.hidden = !(b.dataset.f === 'all' || c.dataset.cat === b.dataset.f); });
      grid.classList.toggle('all', b.dataset.f === 'all');
    });
  }

  /* ---------- supply chain projects ---------- */
  const pg = document.getElementById('projectGrid');
  if (pg) pg.innerHTML = window.PROJECTS.map(p => `<button class="case" type="button" data-id="${p.id}" aria-haspopup="dialog">
    <div class="cover"><img src="assets/covers/${p.cover}.jpg" alt="" loading="lazy" width="1600" height="1200"></div>
    <div class="body"><p class="meta"><span class="cat">${esc(p.type)}</span></p><h3>${esc(p.title)}</h3><p>${esc(p.hook)}</p>
    <div class="foot"><span class="typ" style="font:600 11px var(--f-mono);color:var(--dim);text-transform:uppercase;letter-spacing:.08em">${p.pdf ? 'PDF report' : 'Photos'}</span><span class="more">Details ${icon('i-arrow')}</span></div></div></button>`).join('');

  /* ---------- data foundation ---------- */
  const countAttr = v => { const m = String(v).match(/^(~?)(\d+)(.*)$/); return m ? `data-count="${m[2]}" data-prefix="${m[1]}" data-suffix="${esc(m[3])}"` : ''; };
  const VIZ = {
    // counts are the tracker's real "Specific Issue" options, grouped by category
    tracker: () => { const g = [['Internal delivery', 9], ['Strategy & content', 7], ['Funnels & ads', 7], ['Client feedback', 4], ['Client behaviour', 4], ['Client filming', 3]];
      return `<figure class="viz"><figcaption>Blockers it can name, by group</figcaption><div class="hbars">${g.map(([n, v]) => `<div class="hb"><span>${n}</span><i style="--w:${v / 9 * 100}%"></i><b>${v}</b></div>`).join('')}</div></figure>
      <figure class="viz"><figcaption>Monthly goal model</figcaption><div class="goal"><div class="g90">90-day goal</div><div class="gm"><i>M1</i><i>M2</i><i>M3</i></div><p class="gnote"><i></i>a shortfall can roll into the next month</p></div></figure>
      <div class="links-row"><span>${icon('b-notion')}Board</span><span>${icon('b-slack')}Channel</span><span>${icon('b-slack')}Canvas</span></div>`; },
    phases: () => `<figure class="viz"><figcaption>Phase ends → archived → tracker resets</figcaption><div class="phases">${['Phase 01', 'Phase 02', 'Phase 03'].map((p, i) => `<div class="ph" style="--d:${i * .25}s"><span>${p}</span><div class="ms"><i>M1</i><i>M2</i><i>M3</i></div><em>archived ✓</em></div>`).join('<div class="ph-arrow" aria-hidden="true">→</div>')}</div></figure>
      <figure class="viz"><figcaption>Each archived row keeps</figcaption><div class="keeps"><span>Goals</span><span>Actuals</span><span>Progress %</span><span>Strategy deck</span></div></figure>`,
    audit: () => `<figure class="viz"><figcaption>Posts reviewed per client, per week</figcaption><div class="slots"><i class="top">Top 1</i><i class="top">Top 2</i><i class="top">Top 3</i><i class="bot">Low 1</i><i class="bot">Low 2</i><i class="bot">Low 3</i></div><p class="slots-l"><span>title · link · views · format</span></p></figure>
      <figure class="viz"><figcaption>Flags</figcaption><div class="flags"><div><b>Execution</b><span class="pill g">Healthy</span><span class="pill a">Attention</span><span class="pill r">Critical</span></div><div><b>Creative</b><span class="pill g">Healthy</span><span class="pill a">Attention</span><span class="pill r">Critical</span></div></div></figure>
      <div class="links-row"><span>${icon('i-arrow')}Feeds the Flag Trends dashboard</span></div>`
  };
  const fg = document.getElementById('foundationGrid');
  if (fg) fg.innerHTML = window.FOUNDATION.map(f => `<article class="db-card">
    <div class="db-top">${icon('b-notion')}<p class="eyebrow">${esc(f.kind)}</p></div>
    <h3>${esc(f.title)}</h3><p class="muted">${esc(f.summary)}</p>
    <div class="db-facts">${f.facts.map(([a, b]) => `<div><b ${countAttr(a)}>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>
    ${VIZ[f.viz] ? VIZ[f.viz]() : ''}</article>`).join('');

  /* ---------- ticker ---------- */

  /* ---------- case study dialog ---------- */
  const ALL = Object.fromEntries([...window.WORK, ...window.PROJECTS].map(p => [p.id, p]));
  const dlg = document.getElementById('dlg');
  let lastFocus = null;
  function caseHTML(p) {
    const isWork = !!p.flow;
    const imgs = p.images ? p.images.map(([f, c]) => [`assets/img/${f}`, c]) : [[`assets/covers/${p.cover}.jpg`, isWork ? 'How it works' : p.title]];
    let gallery = `<div><div class="viewer"><img id="vImg" src="${imgs[0][0]}" alt="${esc(imgs[0][1])}"></div><p class="cap-t" id="vCap">${esc(imgs[0][1])}${p.shotsNote ? ' · ' + esc(p.shotsNote) : ''}</p>
      ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((im, i) => `<button type="button" data-i="${i}" aria-current="${i === 0}" aria-label="Show image ${i + 1}: ${esc(im[1])}"><img src="${im[0]}" alt=""></button>`).join('')}</div>` : ''}</div>`;
    const acts = [];
    if (p.pdf) acts.push(`<a class="btn btn-primary" href="/docs/${p.pdf[0]}" target="_blank" rel="noopener">${icon('i-pdf')}Open ${esc(p.pdf[1])}</a>`);
    (p.videos || []).forEach(([u, t]) => acts.push(`<a class="btn btn-ghost" href="${u}" target="_blank" rel="noopener">${icon('i-play')}${esc(t)}</a>`));
    acts.push(`<a class="btn btn-ghost" href="/projects/${p.id}">${icon('i-link')}Open as a page</a>`);
    if (!isWork) return `${gallery}<div class="actions">${acts.join('')}</div>
      <div class="cs-grid"><div class="cs-block"><h3>The brief</h3><p>${esc(p.problem)}</p></div>
      <div class="cs-block"><h3>What we did</h3><ul>${p.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="cs-block wide"><h3>Skills</h3><div class="chips">${p.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div></div></div>`;
    const slack = p.slack ? `<div class="slack" aria-label="Example of the flag message, with placeholder names"><div class="av" aria-hidden="true">💡</div><div><p class="meta"><b>Po Flag Bot</b> · 6:00 PM · example</p><p>Hey <span class="mention">@PO</span> 👋<br><b>Missing today's idea for:</b> Client A · Client B<br><b>You've covered:</b> 0/2 today, add the rest before end of day.</p></div></div>` : '';
    return `${gallery}<div class="actions">${acts.join('')}</div>
      <div class="cs-grid">
        <div class="cs-block"><h3>Problem</h3><p>${esc(p.problem)}</p></div>
        <div class="cs-block"><h3>Objective</h3><p>${esc(p.objective)}</p></div>
        <div class="cs-block wide"><h3>Solution</h3><p>${esc(p.solution)}</p></div>
        <div class="cs-block wide"><h3>Workflow</h3><ol class="wf">${p.flow.map((s, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(s)}</li>`).join('')}</ol></div>
        ${slack ? `<div class="cs-block wide">${slack}</div>` : ''}
        <div class="cs-block"><h3>Result</h3><ul>${p.outcome.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="cs-block"><h3>Technology</h3><div class="chips">${p.stack.map(s => { const id = logoFor(s); return `<span class="chip">${id ? icon(id) : ''}${esc(s)}</span>`; }).join('')}</div></div>
        <div class="cs-block wide role"><h3>My contribution</h3><p>${esc(p.role)}</p></div>
      </div>`;
  }
  function openCase(id) {
    const p = ALL[id]; if (!p || !dlg) return;
    document.getElementById('dlgKind').textContent = p.cat ? `${CAT[p.cat]} · ${p.type}` : p.type;
    document.getElementById('dlgTitle').textContent = p.title;
    document.getElementById('dlgBody').innerHTML = caseHTML(p);
    const imgs = p.images ? p.images.map(([f, c]) => [`assets/img/${f}`, c]) : null;
    dlg.querySelectorAll('.thumbs button').forEach((b, _, all) => b.addEventListener('click', () => {
      const [src, cap] = imgs[+b.dataset.i]; const v = document.getElementById('vImg'); v.src = src; v.alt = cap;
      document.getElementById('vCap').textContent = cap; all.forEach(t => t.setAttribute('aria-current', String(t === b)));
    }));
    lastFocus = document.activeElement;
    dlg.showModal(); dlg.querySelector('.dlg-body').scrollTop = 0;
    try { history.replaceState(null, '', '#case-' + id); } catch (e) {}
  }
  document.addEventListener('click', e => {
    const c = e.target.closest('.case[data-id]'); if (c) { openCase(c.dataset.id); return; }
    const a = e.target.closest('a[href^="#case-"]'); if (a) { e.preventDefault(); openCase(a.getAttribute('href').slice(6)); }
  });
  if (dlg) {
    document.getElementById('dlgClose').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { try { history.replaceState(null, '', location.pathname); } catch (e) {} if (lastFocus) lastFocus.focus(); });
  }
  const h = location.hash; if (h.startsWith('#case-') && ALL[h.slice(6)]) setTimeout(() => openCase(h.slice(6)), 300);

  /* ---------- mobile menu ---------- */
  const mb = document.getElementById('menuBtn'), mm = document.getElementById('mobileMenu');
  function setMenu(open) { mb.setAttribute('aria-expanded', String(open)); mb.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); mb.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu'); mm.hidden = !open; }
  if (mb) {
    mb.addEventListener('click', () => setMenu(mm.hidden));
    mm.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mm.hidden) { setMenu(false); mb.focus(); } });
  }

  /* ---------- copy email ---------- */
  document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied'; }
    catch (err) { const el = b.parentElement.querySelector('.v'); if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } b.textContent = 'Selected'; }
    setTimeout(() => { b.textContent = 'Copy'; }, 1600);
  }));

  /* ---------- count-up numbers ---------- */
  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '', pre = el.dataset.prefix || '';
    const fmt = v => pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf;
    if (reduce) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1400;
    (function tick(t) { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = fmt(end * e); if (k < 1) requestAnimationFrame(tick); })(t0);
  }
  const done = new WeakSet();
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !done.has(e.target)) { done.add(e.target); countUp(e.target); } }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---------- reveal on scroll ---------- */
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach(el => rio.observe(el));
  setTimeout(() => document.querySelectorAll('.reveal, .stagger').forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }), 80);

  /* ---------- header state ---------- */
  const nav = document.getElementById('nav'), bar = document.getElementById('progress');
  const links = [...document.querySelectorAll('#navLinks a')];
  const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (nav) nav.classList.toggle('scrolled', scrollY > 30);
    let cur = null; for (const s of secs) { const r = s.getBoundingClientRect(); if (r.top <= innerHeight * .35 && r.bottom > innerHeight * .35) cur = s; }
    links.forEach(a => a.classList.toggle('active', !!cur && a.getAttribute('href') === '#' + cur.id));
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- background network (subtle, pauses off-screen) ---------- */
  function network(canvas) {
    const ctx = canvas.getContext('2d'); let W, H, nodes = [], raf, visible = true;
    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2); W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, W * H / 20000));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22 }));
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) { if (!reduce) { n.x += n.vx; n.y += n.vy; } if (n.x < -10) n.x = W + 10; if (n.x > W + 10) n.x = -10; if (n.y < -10) n.y = H + 10; if (n.y > H + 10) n.y = -10; }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) { const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 140) { ctx.strokeStyle = `rgba(61,214,140,${(1 - d / 140) * .14})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
        ctx.fillStyle = 'rgba(61,214,140,.45)'; ctx.beginPath(); ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }
    size(); frame();
    addEventListener('resize', () => { size(); if (reduce) frame(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible && !reduce) raf = requestAnimationFrame(frame); }).observe(canvas);
  }
  document.querySelectorAll('canvas.net').forEach(network);
})();
