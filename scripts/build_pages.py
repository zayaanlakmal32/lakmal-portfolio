"""Builds one static page per case study / project in /projects, plus sitemap.xml.
Content comes from assets/data.js. Run from the repo root: python3 scripts/build_pages.py"""
import json, subprocess, html, os, time

SITE = 'https://lakmal-portfolio.vercel.app'
V = time.strftime('%Y%m%d%H%M')
data = json.loads(subprocess.check_output(['node', '-e',
  "global.window={};require('./assets/data.js');console.log(JSON.stringify({w:window.WORK,p:window.PROJECTS,c:window.CATEGORIES}))"]))
CAT = dict(data['c'])
e = html.escape
sprite = open('scripts/sprite.html').read()
LOGO = {'Notion':'b-notion','Slack':'b-slack','Zapier':'b-zapier','Claude':'b-claude','Vercel':'b-vercel','GitHub':'b-github',
        'Google Sheets':'b-googlesheets','GoHighLevel':'i-ghl','JavaScript':'b-javascript','Next.js':'b-nextdotjs','Excel':'i-excel','CSV':'i-excel'}
def icon(i): return f'<svg aria-hidden="true"><use href="#{i}"/></svg>'
def logo(t):
    for k, v in LOGO.items():
        if k in t: return icon(v)
    return ''

items = data['w'] + data['p']
os.makedirs('projects', exist_ok=True)
for i, p in enumerate(items):
    is_work = 'flow' in p
    kind = f"{CAT[p['cat']]} · {p['type']}" if is_work else p['type']
    imgs = [(f"/assets/img/{f}", c) for f, c in p.get('images', [])] or [(f"/assets/covers/{p['cover']}.jpg", 'How it works' if is_work else p['title'])]
    gallery = ''.join(f'<figure><img src="{s}" alt="{e(c)}" loading="lazy"><figcaption>{e(c)}</figcaption></figure>' for s, c in imgs)
    acts = []
    if p.get('pdf'): acts.append(f'<a class="btn btn-primary" href="/docs/{p["pdf"][0]}" target="_blank" rel="noopener">{icon("i-pdf")}Open {e(p["pdf"][1])}</a>')
    for u, t in p.get('videos', []): acts.append(f'<a class="btn btn-ghost" href="{u}" target="_blank" rel="noopener">{icon("i-play")}{e(t)}</a>')
    if is_work:
        body = f'''<div class="cs-grid">
      <div class="cs-block"><h3>Problem</h3><p>{e(p['problem'])}</p></div>
      <div class="cs-block"><h3>Objective</h3><p>{e(p['objective'])}</p></div>
      <div class="cs-block wide"><h3>Solution</h3><p>{e(p['solution'])}</p></div>
      <div class="cs-block wide"><h3>Workflow</h3><ol class="wf">{''.join(f'<li><span>{n+1:02d}</span>{e(s)}</li>' for n, s in enumerate(p['flow']))}</ol></div>
      <div class="cs-block"><h3>Result</h3><ul>{''.join(f'<li>{e(x)}</li>' for x in p['outcome'])}</ul></div>
      <div class="cs-block"><h3>Technology</h3><div class="chips">{''.join(f'<span class="chip">{logo(s)}{e(s)}</span>' for s in p['stack'])}</div></div>
      <div class="cs-block wide role"><h3>My contribution</h3><p>{e(p['role'])}</p></div></div>'''
        lede = p['hook']
    else:
        body = f'''<div class="cs-grid">
      <div class="cs-block"><h3>The brief</h3><p>{e(p['problem'])}</p></div>
      <div class="cs-block"><h3>What we did</h3><ul>{''.join(f'<li>{e(x)}</li>' for x in p['points'])}</ul></div>
      <div class="cs-block wide"><h3>Skills</h3><div class="chips">{''.join(f'<span class="chip">{e(t)}</span>' for t in p['tags'])}</div></div></div>'''
        lede = p['hook']
    nxt = items[(i + 1) % len(items)]; prv = items[i - 1]
    note = f'<p class="cap-t">{e(p["shotsNote"])}</p>' if p.get('shotsNote') else ''
    back = '/#work' if is_work else '/#projects'
    page = f'''<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(p['title'])} · Lakmal Sampath</title>
<meta name="description" content="{e(lede)}">
<meta name="theme-color" content="#0A0C0B">
<link rel="canonical" href="{SITE}/projects/{p['id']}">
<meta property="og:type" content="article">
<meta property="og:url" content="{SITE}/projects/{p['id']}">
<meta property="og:title" content="{e(p['title'])} · Lakmal Sampath">
<meta property="og:description" content="{e(lede)}">
<meta property="og:image" content="{SITE}/assets/covers/{p['cover']}.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css?v={V}">
<script>document.documentElement.classList.replace("no-js","js")</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{sprite}
<header class="nav scrolled"><div class="nav-in">
  <a class="logo" href="/"><span class="logo-mark" aria-hidden="true">LS</span><span class="logo-t">Lakmal Sampath<small>Operations Systems &amp; AI Automation</small></span></a>
  <div class="nav-r"><a class="pg-back" href="{back}">← All work</a><a class="nav-cta" href="/#contact" style="display:inline-block">Discuss a workflow</a></div>
</div></header>
<main id="main">
<section class="pg-hero">
  <div class="wrap pg-hero-grid">
    <div><p class="eyebrow">{e(kind)}</p><h1>{e(p['title'])}</h1><p class="lede">{e(lede)}</p>
      {f'<p class="cred">{icon("i-check")}{e(p["result"])}</p>' if p.get('result') else ''}
      {f'<div class="ctas">{"".join(acts)}</div>' if acts else ''}</div>
    <img class="pg-cover" src="/assets/covers/{p['cover']}.jpg" alt="" width="1600" height="1200">
  </div>
</section>
<section class="pg-sec"><div class="wrap">{body}</div></section>
<section class="pg-sec sec-alt"><div class="wrap">
  <p class="eyebrow">{'Screens' if p.get('images') else 'Overview'}</p>{note}
  <div class="pg-gallery">{gallery}</div>
  <nav class="pg-next" aria-label="More work">
    <a href="/projects/{prv['id']}"><span>← Previous</span><b>{e(prv['title'])}</b></a>
    <a href="/projects/{nxt['id']}" style="text-align:right"><span>Next →</span><b>{e(nxt['title'])}</b></a>
  </nav>
</div></section>
</main>
<footer class="foot"><div class="wrap foot-in"><span>© 2026 Lakmal Sampath</span><span><a href="/">Home</a> · <a href="mailto:lakmalsampath102@gmail.com">lakmalsampath102@gmail.com</a></span></div></footer>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
'''
    open(f"projects/{p['id']}.html", 'w').write(page)

today = time.strftime('%Y-%m-%d')
urls = [f'{SITE}/'] + [f"{SITE}/projects/{p['id']}" for p in items]
open('sitemap.xml', 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ''.join(f'  <url><loc>{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls) + '</urlset>\n')
print('built', len(items), 'pages + sitemap')
