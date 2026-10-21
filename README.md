# Lakmal Sampath — portfolio

Static site (HTML, CSS, vanilla JS). No framework, no build server; Vercel serves the files as they are.

## Edit content
- **All case-study and project text:** `assets/data.js`
- **Page layout and section copy:** `scripts/index.tpl.html` (then rebuild, below)
- **Styles:** `assets/site.css` · **Behaviour:** `assets/site.js`

## Rebuild after editing
```bash
python3 scripts/build_index.py      # index.html from the template + icon sprite
python3 scripts/build_pages.py      # /projects/*.html and sitemap.xml from data.js
python3 scripts/make_flow_covers.py # workflow-diagram covers (needs Playwright)
```

## Deploy
Push to `main`. Vercel redeploys automatically. Add a custom domain under Vercel → Settings → Domains.
