"""Builds index.html from scripts/index.tpl.html + scripts/sprite.html. Run from repo root."""
import time
V = time.strftime('%Y%m%d%H%M')
tpl = open('scripts/index.tpl.html').read()
sprite = open('scripts/sprite.html').read()
tk = [('b-notion','Notion'),('b-slack','Slack'),('b-zapier','Zapier'),('b-claude','Claude + MCP'),('i-ghl','GoHighLevel'),('b-googlesheets','Google Sheets'),('b-vercel','Vercel'),('b-github','GitHub'),('i-excel','Excel'),('i-six','Lean Six Sigma'),('i-box','Procurement'),('i-chart','Demand planning')]
ticker = ''.join(f'<span><svg><use href="#{i}"/></svg>{t}</span>' for i, t in tk)
out = tpl.replace('{{SPRITE}}', sprite).replace('{{TICKER}}', ticker).replace('{{V}}', V)
open('index.html', 'w').write(out)
print('index.html built', V)
