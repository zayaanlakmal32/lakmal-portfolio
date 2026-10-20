"""Builds one static page per project in /projects from assets/data.js.
Run from the repo root: python3 scripts/build_pages.py"""
import json, subprocess, html, os

data = json.loads(subprocess.check_output(['node', '-e',
  "global.window={};require('./assets/data.js');console.log(JSON.stringify({s:window.SYSTEMS,p:window.PROJECTS}))"]))
SITE = 'https://lakmal-portfolio.vercel.app'
import time
V = time.strftime('%Y%m%d%H%M')
e = html.escape
# reuse the icon sprite from the homepage so logos and icons match
idx = open('index.html').read()
sprite = idx[idx.index('<svg width="0" height="0"'):idx.index('</svg>', idx.index('</defs>')) + 6]
LOGO = {'Notion':'b-notion','Slack':'b-slack','Zapier':'b-zapier','Claude':'b-claude','Vercel':'b-vercel','GitHub':'b-github',
        'Google Sheets':'b-googlesheets','GoHighLevel':'i-ghl','JavaScript':'b-javascript','TypeScript':'b-typescript','Next.js':'b-nextdotjs','Excel':'i-excel','CSV':'i-excel'}
def logo(t):
    for k, v in LOGO.items():
        if k in t: return f'<svg><use href="#{v}"/></svg>'
    return ''

items = [(p, True) for p in data['s']] + [(p, False) for p in data['p']]
os.makedirs('projects', exist_ok=True)
for i, (p, is_sys) in enumerate(items):
    imgs = [(f"/assets/img/{f}", c) for f, c in p.get('images', [])] or [(f"/assets/covers/{p['cover']}.jpg", p['title'])]
    gallery = ''.join(f'<figure><img src="{src}" alt="{e(cap)}" loading="lazy"><figcaption>{e(cap)}</figcaption></figure>' for src, cap in imgs)
    acts = []
    if p.get('pdf'): acts.append(f'<a class="btn solid" href="/docs/{p["pdf"][0]}" target="_blank" rel="noopener"><svg><use href="#i-pdf"/></svg>Open {e(p["pdf"][1])}</a>')
    for u, t in p.get('videos', []): acts.append(f'<a class="btn" href="{u}" target="_blank" rel="noopener"><svg><use href="#i-play"/></svg>{e(t)}</a>')
    nxt = items[(i + 1) % len(items)][0]; prv = items[i - 1][0]
    note = '<p class="pg-note">Illustration with example numbers. The live dashboard shows real client data, so it isn\'t shown here.</p>' if p.get('illustration') else ''
    desc = p['summary']
    page = f'''<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(p['title'])} · Lakmal Sampath</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#040B07">
<meta property="og:title" content="{e(p['title'])} · Lakmal Sampath">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{SITE}/assets/covers/{p['cover']}.jpg">
<meta property="og:url" content="{SITE}/projects/{p['id']}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="{SITE}/projects/{p['id']}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css?v={V}">
<script>document.documentElement.classList.replace("no-js","js")</script>
</head>
<body class="pg">
{sprite}
<nav class="nav scrolled" aria-label="Main"><div class="wrap">
  <a class="logo" href="/"><span class="logo-mark">LS</span><span>Lakmal Sampath</span></a>
  <div class="nav-right"><a class="btn pg-back" href="/#{'systems' if is_sys else 'projects'}">← All work</a><a class="cta" href="/#contact">Get in touch <svg><use href="#i-arrow"/></svg></a></div>
</div></nav>
<header class="pg-hero dark">
  <div class="fx" aria-hidden="true"><div class="blob b1"></div><div class="blob b2"></div></div>
  <div class="wrap pg-hero-grid">
    <div>
      <p class="label">{e(p['kind'])}</p>
      <h1>{e(p['title'])}</h1>
      <p class="lede">{e(p['summary'])}</p>
      <div class="actions">{''.join(acts)}</div>
    </div>
    <img class="pg-cover" src="/assets/covers/{p['cover']}.jpg" alt="{e(p['title'])} cover">
  </div>
</header>
<main>
  <section class="block white"><div class="wrap">
    <div class="impact pg-impact">{''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in p['impact'])}</div>
    <div class="cols pg-cols">
      <div><h4>The problem</h4><p>{e(p['problem'])}</p></div>
      <div><h4>{'How it works' if is_sys else 'What we did'}</h4><ul>{''.join(f'<li>{e(x)}</li>' for x in p['how'])}</ul></div>
      <div><h4>{'Built with' if is_sys else 'Skills used'}</h4><div class="chips">{''.join(f'<span class="chip logo-chip">{logo(s)}{e(s)}</span>' for s in p['stack'])}</div></div>
    </div>
  </div></section>
  <section class="block"><div class="wrap">
    <p class="label">Screens &amp; photos</p>
    {note}
    <div class="pg-gallery">{gallery}</div>
    <nav class="pg-next" aria-label="More work">
      <a href="/projects/{prv['id']}"><span>← Previous</span><b>{e(prv['title'])}</b></a>
      <a href="/projects/{nxt['id']}" style="text-align:right"><span>Next →</span><b>{e(nxt['title'])}</b></a>
    </nav>
  </div></section>
</main>
<footer><div class="wrap"><span>© 2026 Lakmal Sampath</span><span><a href="/">lakmal-portfolio.vercel.app</a></span></div></footer>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
'''
    open(f"projects/{p['id']}.html", 'w').write(page)
print('built', len(items), 'pages')
