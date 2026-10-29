# Khadim.com — household help, hired the fair way

Guides, pay tools and a free matching service for families hiring housekeepers, cooks, nannies, elder carers and drivers in India, the Gulf, Singapore, Hong Kong, the UK, US and Canada — monetised with Google AdSense, household lead generation, agency listings, sponsorships, donations and monthly awards.

**Live (free GitHub Pages):** https://webworksa1.github.io/khadim-com/

## How the site is built

- Static Jekyll site that GitHub Pages builds automatically on the free plan — no local tooling needed.
- `_layouts/default.html` holds everything shared: the top contact strip, header and menu, footer, AdSense code, SEO and social tags, cookie notice and scripts. Each page holds only its front matter (title, description, canonical URL, `root` prefix) and its content.
- Styles: `assets/css/style.css`. Scripts: `assets/js/main.js` (planner, forms, tools, contract builder, checklist, videos, countdown) and `assets/js/rates.js` (indicative 2026 pay data — update yearly).
- Links are relative (`root` is `""` for top-level pages and `"../"` inside `guides/`), so the same files work on `webworksa1.github.io/khadim-com/` and on `khadim.com/`.
- Add a page: copy an existing page, change its front matter and content, set `root` for its folder depth, and add it to `sitemap.xml`.

## Forms

Every form posts by AJAX to a form relay that forwards to the site's single private inbox. The address is stored encoded in `main.js` and assembled only at runtime; it never appears in any page or file in readable form. The first submission triggers a one-time activation email to the inbox — open it and click **Activate** once, then every form delivers normally.

## Publish on GitHub Pages (free plan)

Settings → Pages → Build and deployment → **Deploy from a branch** → `main` / `(root)`. Every push to `main` rebuilds the site in about a minute.

## Move to khadim.com

1. At the domain registrar, remove the for-sale/parking redirect and add DNS records:
   - `A` @ → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` www → `webworksa1.github.io`
2. GitHub → repo Settings → Pages → Custom domain: `khadim.com` → Save (this adds a `CNAME` file). Tick **Enforce HTTPS** when offered.
3. No code changes needed — links are relative and canonical URLs already point to `https://khadim.com/`.

## AdSense

- `ads.txt` is at the root: `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
- The AdSense script is in every page head. Once khadim.com is live, add the site in AdSense, then turn on **Auto ads**.
- In AdSense → Privacy & messaging, enable the Google consent message for EEA/UK/Switzerland visitors.
- Submit `https://khadim.com/sitemap.xml` in Google Search Console.

## Trademark

"Khadim" is used descriptively (it means "one who serves"). The site is not affiliated with Khadim India Limited or the "Khadim's" footwear brand. See `/trademark.html`.

See `BUILD-PROMPTS.md` for the phase-wise build prompts and `RESEARCH.md` for the 36-site benchmark and verified facts.
