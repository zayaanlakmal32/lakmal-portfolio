"""Renders workflow-diagram covers (no data, just the real steps) for
case studies that have no shareable screenshots. Run from repo root."""
import json, subprocess, html, os
from playwright.sync_api import sync_playwright
A = os.path.abspath('assets')
data = json.loads(subprocess.check_output(['node','-e',"global.window={};require('./assets/data.js');console.log(JSON.stringify(window.WORK))"]))
IDS = ['flags','mkt','flagbot','ideation','onboarding','canvas']
e = html.escape
CSS = f"""
@font-face{{font-family:Archivo;src:url(file://{A}/fonts/archivo.woff2);font-weight:100 900;font-stretch:62% 125%}}
@font-face{{font-family:Hanken;src:url(file://{A}/fonts/hanken.woff2);font-weight:100 900}}
@font-face{{font-family:Plex;src:url(file://{A}/fonts/plexmono-600.woff2);font-weight:600}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1600px;height:1200px;overflow:hidden;background:#0A0F0C;color:#F3F5EF;font-family:Hanken;position:relative}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:80px 80px}}
.glow{{position:absolute;inset:0;background:radial-gradient(circle at 92% 6%,rgba(34,197,94,.42),rgba(34,197,94,0) 46%),radial-gradient(circle at -5% 105%,rgba(34,197,94,.18),rgba(34,197,94,0) 40%)}}
.top{{position:absolute;left:96px;top:84px;width:1300px}}
.kick{{font-family:Plex;font-size:24px;letter-spacing:4px;text-transform:uppercase;color:#3DDC84}}
h1{{font-family:Archivo;font-stretch:118%;font-weight:800;font-size:96px;line-height:.98;letter-spacing:-2px;margin-top:22px}}
.sub{{font-size:34px;line-height:1.35;color:#A9B5AC;margin-top:24px;max-width:1150px}}
.flow{{position:absolute;left:96px;right:96px;top:600px;display:flex;align-items:stretch;gap:0}}
.st{{flex:1;background:#101914;border:2px solid #22382B;border-radius:22px;padding:26px 24px;display:flex;flex-direction:column;gap:16px;min-height:290px}}
.st:last-child{{background:#3DDC84;border-color:#3DDC84;color:#0A0F0C}}
.st i{{font-style:normal;font-family:Plex;font-size:22px;color:#3DDC84}}
.st:last-child i{{color:#0A3A20}}
.st p{{font-size:29px;line-height:1.28;font-weight:600}}
.ar{{width:52px;flex:none;display:flex;align-items:center;justify-content:center;color:#3DDC84;font-size:40px;font-weight:800}}
.tags{{position:absolute;left:96px;bottom:46px;display:flex;gap:30px;font-family:Plex;font-size:23px;color:#E7ECE6}}
.tags i{{font-style:normal;color:#3DDC84;margin-right:8px}}
"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1600,'height':1200})
    for w in data:
        if w['id'] not in IDS: continue
        steps = w['flow']
        flow = '<div class="ar">→</div>'.join(f'<div class="st"><i>{i+1:02d}</i><p>{e(s)}</p></div>' for i, s in enumerate(steps))
        body = f"<div class='grid'></div><div class='glow'></div><div class='top'><p class='kick'>{e(w['type'])} · how it works</p><h1>{e(w['title'])}</h1><p class='sub'>{e(w['hook'])}</p></div><div class='flow'>{flow}</div><div class='tags'>{''.join(f'<span><i>●</i>{e(t)}</span>' for t in w['stack'])}</div>"
        f = f'/tmp/cover_{w["id"]}.html'; open(f,'w').write(f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>")
        pg.goto('file://'+f); pg.wait_for_timeout(300)
        pg.screenshot(path=f'assets/covers/{w["id"]}.jpg', type='jpeg', quality=84); print(w['id'])
    b.close()
