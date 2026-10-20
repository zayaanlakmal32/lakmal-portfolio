const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const arrow = '<svg width="16" height="16"><use href="#i-arrow"/></svg>';
const LOGO = {'Notion':'b-notion','Slack':'b-slack','Zapier':'b-zapier','Claude':'b-claude','Vercel':'b-vercel','GitHub':'b-github','Google Sheets':'b-googlesheets','GoHighLevel':'i-ghl','JavaScript':'b-javascript','TypeScript':'b-typescript','Next.js':'b-nextdotjs','Excel':'i-excel','CSV':'i-excel'};
const logoFor = t => { for (const k in LOGO) if (t.includes(k)) return LOGO[k]; return null; };
const stackLogos = list => { const seen = new Set(); return list.map(logoFor).filter(x => x && !seen.has(x) && seen.add(x)).slice(0,5).map(id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`).join(''); };

function card(p, isSystem){
  const foot = isSystem
    ? `<span class="stack-logos" title="${esc(p.stack.join(', '))}">${stackLogos(p.stack)}</span><span class="more">Details ${arrow}</span>`
    : `${p.pdf ? '<span class="pdf-flag">PDF report</span>' : '<span class="pdf-flag">Photos</span>'}<span class="more">Details ${arrow}</span>`;
  return `<button class="card" type="button" data-id="${p.id}" aria-haspopup="dialog">
    <div class="cover"><img src="/assets/covers/${p.cover}.jpg" alt="${esc(p.title)} cover" loading="lazy" width="1600" height="1200"></div>
    <div class="body"><p class="kind">${esc(p.kind)}</p>${isSystem ? `<p class="metric">${esc(p.metric)}</p>` : ''}<h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><div class="foot">${foot}</div></div>
  </button>`;
}
document.getElementById('systemGrid').classList.add('stagger');
document.getElementById('projectGrid').classList.add('stagger');
document.getElementById('systemGrid').innerHTML = window.SYSTEMS.map(p => card(p, true)).join('');
document.getElementById('projectGrid').innerHTML = window.PROJECTS.map(p => card(p, false)).join('');
const fg = document.getElementById('foundationGrid');
if (fg) fg.innerHTML = window.FOUNDATION.map(f => `<article class="db-card">
  <div class="db-top"><svg aria-hidden="true"><use href="#b-notion"/></svg><p class="kind">${esc(f.kind)}</p></div>
  <h3>${esc(f.title)}</h3><p class="muted">${esc(f.summary)}</p>
  <div class="db-facts">${f.facts.map(([a,b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>
  <ul>${f.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('');

const ALL = Object.fromEntries([...window.SYSTEMS, ...window.PROJECTS].map(p => [p.id, p]));
const dlg = document.getElementById('dlg');
let lastFocus = null;

function open(id){
  const p = ALL[id]; if (!p) return;
  document.getElementById('dlgKind').textContent = p.kind;
  document.getElementById('dlgTitle').textContent = p.title;
  const imgs = p.images ? p.images.map(([f,c]) => [`/assets/img/${f}`, c]) : [[`/assets/covers/${p.cover}.jpg`, p.illustration ? 'Illustration with example numbers. The live dashboard shows real client data, so it isn\'t shown here.' : p.title]];
  const viewer = `<div class="viewer"><img id="vImg" src="${imgs[0][0]}" alt="${esc(imgs[0][1])}"></div>
    <p class="cap-t" id="vCap">${esc(imgs[0][1])}</p>
    ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((im,i) => `<button type="button" data-i="${i}" aria-current="${i===0}" aria-label="Image ${i+1}: ${esc(im[1])}"><img src="${im[0]}" alt=""></button>`).join('')}</div>` : ''}`;
  const acts = [];
  if (p.pdf) acts.push(`<a class="btn ink" href="/docs/${p.pdf[0]}" target="_blank" rel="noopener"><svg><use href="#i-pdf"/></svg>Open ${esc(p.pdf[1])}</a>`);
  (p.videos || []).forEach(([u, t]) => acts.push(`<a class="btn outline-g" href="${u}" target="_blank" rel="noopener"><svg><use href="#i-play"/></svg>${esc(t)}</a>`));
  acts.push(`<a class="btn outline-g" href="/projects/${p.id}"><svg><use href="#i-link"/></svg>Open as a page</a>`);
  const actions = `<div class="dlg-actions">${acts.join('')}</div>`;
  const isSys = window.SYSTEMS.includes(p);
  document.getElementById('dlgBody').innerHTML = `${viewer}${actions}
    <div class="impact">${p.impact.map(([a,b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>
    <div class="cols">
      <div><h4>The problem</h4><p>${esc(p.problem)}</p></div>
      <div><h4>${isSys ? 'How it works' : 'What we did'}</h4><ul>${p.how.map(h => `<li>${esc(h)}</li>`).join('')}</ul></div>
      <div><h4>${isSys ? 'Built with' : 'Skills used'}</h4><div class="chips">${p.stack.map(s => { const id = logoFor(s); return `<span class="chip logo-chip">${id ? `<svg><use href="#${id}"/></svg>` : ''}${esc(s)}</span>`; }).join('')}</div></div>
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


/* ================= motion ================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Network background: drifting nodes, links, and data pulses travelling along links
function network(canvas, opts){
  const ctx = canvas.getContext('2d');
  const o = Object.assign({ density: 1, color: '47,210,122', pulses: true }, opts);
  let W, H, dpr, nodes = [], pulses = [], raf, visible = true, mouse = null;
  function size(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const n = Math.round(Math.min(90, (W * H) / 16000) * o.density);
    nodes = Array.from({length:n}, () => ({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*.28, vy:(Math.random()-.5)*.28, r: Math.random()*1.6 + .8 }));
  }
  const LINK = 150;
  function frame(){
    ctx.clearRect(0,0,W,H);
    for (const n of nodes){
      if (!reduce){ n.x += n.vx; n.y += n.vy; }
      if (n.x < -20) n.x = W+20; if (n.x > W+20) n.x = -20; if (n.y < -20) n.y = H+20; if (n.y > H+20) n.y = -20;
    }
    for (let i=0;i<nodes.length;i++){
      const a = nodes[i];
      for (let j=i+1;j<nodes.length;j++){
        const b = nodes[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if (d < LINK){
          ctx.strokeStyle = `rgba(${o.color},${(1-d/LINK)*.22})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          if (o.pulses && !reduce && Math.random() < .0009) pulses.push({a,b,t:0});
        }
      }
      let glow = .55;
      if (mouse){ const md = Math.hypot(a.x-mouse.x, a.y-mouse.y); if (md < 140) glow = 1; }
      ctx.fillStyle = `rgba(${o.color},${glow})`; ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2); ctx.fill();
    }
    pulses = pulses.filter(p => p.t <= 1);
    for (const p of pulses){
      p.t += .018;
      const x = p.a.x + (p.b.x-p.a.x)*p.t, y = p.a.y + (p.b.y-p.a.y)*p.t;
      const g = ctx.createRadialGradient(x,y,0,x,y,10); g.addColorStop(0,`rgba(${o.color},.95)`); g.addColorStop(1,`rgba(${o.color},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2); ctx.fill();
    }
    if (visible && !reduce) raf = requestAnimationFrame(frame);
  }
  size(); frame();
  addEventListener('resize', () => { size(); if (reduce) frame(); });
  canvas.parentElement.parentElement.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse = {x:e.clientX-r.left, y:e.clientY-r.top}; });
  canvas.parentElement.parentElement.addEventListener('pointerleave', () => { mouse = null; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible && !reduce) raf = requestAnimationFrame(frame); }).observe(canvas);
}
const net = document.getElementById('net'); if (net) network(net);
document.querySelectorAll('canvas.net-alt').forEach(c => network(c, { density:.6 }));

// 2. Count-up numbers when they scroll into view
function countUp(el){
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
  const fmt = v => (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf;
  if (reduce){ el.textContent = fmt(end); return; }
  const dur = 1600, t0 = performance.now();
  (function tick(t){ const k = Math.min(1,(t-t0)/dur), e = 1 - Math.pow(1-k, 4); el.textContent = fmt(end*e); if (k < 1) requestAnimationFrame(tick); })(t0);
}
const counted = new WeakSet();
const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !counted.has(e.target)){ counted.add(e.target); countUp(e.target); } }), { threshold:.6 });
document.querySelectorAll('[data-count]').forEach(el => { cio.observe(el); });

// 3. Reveal on scroll
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold:.12, rootMargin:'0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .stagger').forEach(el => rio.observe(el));
setTimeout(() => document.querySelectorAll('.reveal, .stagger').forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }), 60);

// 4. Header: scroll progress, shrink, sliding active pill, Colombo clock
const nav = document.getElementById('nav'), bar = document.getElementById('progress');
const links = [...document.querySelectorAll('#navLinks a')], pill = document.getElementById('navPill');
function movePill(a){
  if (!a){ pill.style.opacity = 0; links.forEach(l => l.classList.remove('active')); return; }
  const ul = a.closest('ul').getBoundingClientRect(), r = a.getBoundingClientRect();
  pill.style.opacity = 1; pill.style.width = r.width + 'px'; pill.style.transform = `translateX(${r.left - ul.left}px)`;
  links.forEach(l => l.classList.toggle('active', l === a));
}
const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
function onScroll(){
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  nav.classList.toggle('scrolled', scrollY > 40);
  let cur = null;
  for (const s of secs){ const r = s.getBoundingClientRect(); if (r.top <= innerHeight * .35 && r.bottom > innerHeight * .35) cur = s; }
  movePill(cur ? links.find(a => a.getAttribute('href') === '#' + cur.id) : null);
  if (!reduce) document.querySelectorAll('.big-num').forEach(n => { const r = n.parentElement.getBoundingClientRect(); n.style.transform = `translateY(${(r.top) * -0.15}px)`; });
}
addEventListener('scroll', onScroll, { passive:true }); addEventListener('resize', onScroll); onScroll();
const clock = document.getElementById('clock');
function tickClock(){ try { clock.textContent = 'Colombo ' + new Intl.DateTimeFormat('en-GB',{ timeZone:'Asia/Colombo', hour:'2-digit', minute:'2-digit' }).format(new Date()); } catch(e){} }
tickClock(); setInterval(tickClock, 30000);

// open a project from #id links
(function(){ const id = location.hash.slice(1); if (ALL[id]) setTimeout(() => open(id), 400); })();
