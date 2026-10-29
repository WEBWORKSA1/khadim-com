# Khadim.com — Phase-wise build prompts

Concept: **Khadim.com — household help, hired the fair way.** "Khadim" means "one who serves" (Arabic, Urdu, Hindi, Persian). The site helps families in India, the Gulf (UAE, Saudi Arabia, Qatar), Singapore, Hong Kong, the UK, US and Canada find, pay and fairly employ housekeepers, cooks, nannies, elder carers and drivers — and helps domestic workers find fair jobs.

Why this concept wins on revenue:

| Revenue line | Mechanism | Why it works for this niche |
|---|---|---|
| Google AdSense | Auto ads on 38 content-rich pages | High-intent queries ("maid salary Dubai", "nanny interview questions", "helper levy Singapore") with Gulf/SG/HK/UK/US CPCs |
| Lead generation | Multi-step household request (role → where/how → urgency/budget → contact) | Agencies pay per qualified lead; urgency + budget make leads sellable |
| Agency listings | Free / Featured US$49 per city per month / Lead packs from US$99 | Gulf, SG and HK markets are agency-led |
| Donations | One-time and monthly pledges, transparent allocation | Fairness mission attracts support |
| Sponsorships | Award sponsor, sponsored guides, newsletter, service partners | Insurance, remittance, payroll and verification brands want this audience |
| Contests | Home Heroes monthly award + quarterly Skills on Camera | Shareable stories, UGC videos, sponsor inventory |
| Hiring talent | Talent pool for writers, translators, video creators, fact-checkers | Scales content into worker languages |

Trademark guardrail: "Khadim's" is a listed Indian footwear retailer (Khadim India Limited). The site never touches footwear, clothing or retail, uses the word descriptively, and carries a non-affiliation disclosure in every footer and on `/trademark.html`.

Fixed rules for every phase:
- AdSense code in every page `<head>`: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`; `ads.txt` = `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
- Top of every page: "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linked to `https://web.works/contact`.
- One inbox for every form and the "Email us" link. The address is never written in HTML, text, or source in readable form — it is assembled at runtime from an encoded array in `assets/js/main.js` and posted to a form relay.
- Static files only, so the site runs on GitHub Pages' free plan.

---

## Phase 0 — Research and positioning

> Research the domestic-help market for a site named Khadim.com. Visit at least 35 leading sites across four groups — global care marketplaces (Care.com, Sittercity, UrbanSitter, Bambino, CareLinx, Honor/Home Instead, Visiting Angels, Papa, Sitly, Yoopies, Babysits), Asia/GCC helper platforms (HelperPlace, HelperChoice, maids.cc, a Tadbeer centre, Justlife, Tadbeer/MOHRE, Musaned, MOM Singapore, NetMaid, Helper4U, BookMyBai, Urban Company, Broomees), and au pair, gig, jobs and rights sites (AuPairWorld, GreatAuPair, AuPair.com, Taskrabbit, Thumbtack, Angi, Helpling, Homage, apna, WorkIndia, ILO, MRRORS/IDWF). For each, record the hero and CTA, lead-form fields and steps, trust signals, content and tools, monetisation, and one feature worth adopting. Verify the legal facts that matter (UAE Decree-Law 9/2022, Saudi Musaned and e-wages, Qatar Law 15/2017, Singapore MOM levy/bond/insurance/rest days, Hong Kong MAW and food allowance, India Labour Codes/e-Shram/police verification, ILO C189) from official sources. Find 12+ YouTube videos from reputable channels and verify each ID with oEmbed. Check the "Khadim" trademark landscape. Output RESEARCH.md.

## Phase 1 — Design system and shell

> Build a Jekyll site for GitHub Pages' free plan with one shared layout (`_layouts/default.html`) and pages that carry only front matter (title, description, canonical, section, robots, og_type, `root`) and content. Use relative links via the `root` prefix so the site works at `https://webworksa1.github.io/khadim-com/` and at `https://khadim.com/` with no changes. Layout: required top contact strip, sticky header (logo, 8-item nav, "Get matched" CTA, theme toggle, mobile menu), footer with newsletter form, four link columns, trademark and copyright disclosure, cookie notice and mobile sticky CTA bar. Add canonical, Open Graph, JSON-LD (Organization, WebSite, Article, BreadcrumbList, FAQPage), `sitemap.xml`, `robots.txt`, `ads.txt`, `site.webmanifest`, SVG favicon, icon and OG image, and a `404.html` that resolves links from the site root.
>
> Visual identity: indigo dye `#1E2A5A`, turmeric `#E9A31B`, neem green `#2E7D5B`, limewash `#F5F6FA`, ink `#141933`. Young Serif for headings, Figtree for text. Signature element: an arched doorway panel with a faint jaali lattice, used for the hero planner and echoed in the logo. Full dark mode, visible focus, reduced-motion support, no horizontal scroll at 390 px.

## Phase 2 — Home page and the hero planner

> Home page: H1 "Good help at home, hired the fair way." Hero planner inside the arch — duties chips (cleaning, cooking, childcare, elder care, driving, garden, pets), arrangement (part-time, full-time live-out, live-in), country (9), India city tier, hours slider — showing role title, monthly salary range, employer costs and total, country-specific notes, and a "Get matched with this plan" button that saves the plan and pre-fills the lead form. Then: tabbed pay table by country, four-step "How Khadim works", role tiles that deep-link into the lead form, six featured guides, Fair Home pledge band, three featured videos, worker/agency/awards cards with a live countdown, six FAQs with schema, and a support band. Pay data lives in `assets/js/rates.js` with indicative 2026 ranges.

## Phase 3 — Lead generation (the money page)

> `get-help.html`: a four-step form with progress bar — (1) help needed, tappable tiles, multi-select; (2) country, city, area, arrangement, hours, days; (3) urgency (right away / 2 weeks / a month / just planning), home details, budget, languages, live pay estimate and a below-market budget warning; (4) name, email, phone/WhatsApp, reply channel, consent to share with up to 3 licensed agencies or registered workers, optional Fair Home pledge. Hidden fields: request type, estimate shown, plan estimate, page. Honeypot spam trap. On success go to `thank-you.html` (noindex) with next steps. Side panel: what happens next, zero-worker-fee promise, quick links and FAQs (including a firm no on nationality, religion or caste filters).
>
> Secondary lead flows: worker registration (`find-work.html`, two steps), agency listing application (`agencies.html`, licence number + fair-recruitment commitment), advertising inquiries (`advertise.html`), contact (`contact.html`).

## Phase 4 — Tools that earn links and repeat visits

> `tools.html` with tabbed calculators: fair pay planner (restores the saved plan), total cost of employment over a contract, end-of-service gratuity with country presets (UAE 14 days per year with an "unsettled law" note, Qatar 21 days, custom), hourly ↔ monthly converter, leave and rest-day planner. `contract.html`: a live contract builder (parties, role, arrangement, duties, pay, pay day and method, hours, rest, leave, trial, notice, travel, other terms) rendering a printable agreement with documents-and-dignity clauses. `guides/hiring-checklist.html`: a 30-step interactive checklist saved in local storage.

## Phase 5 — Content for AdSense approval and SEO

> Write 14 original guides (900–1,400 words each), each with key facts, numbered sections, tables, a sources list, last-checked date, reading time, table of contents, share buttons and CTAs: India hiring; UAE housemaid (Tadbeer, costs, law, WPS, probation, gratuity); Saudi Arabia (Musaned, e-wages 2026); Singapore (levy, bond, insurance, SIP, rest days); Hong Kong (MAW HK$5,220 from 3 Oct 2026); how to hire a nanny; elder care at home in India for families abroad; 60 interview questions with scorecard; salary guide 2026 for 9 countries; contract guide; workers' rights by country with ILO C189; background checks and safety; live-in vs part-time; hiring checklist. Add `roles.html`, `faq.html`, `about.html` (mission, research method, corrections, funding, what we are not) and `videos.html` (19 verified videos in five sections with click-to-load facades).

## Phase 6 — Community, donations, contests and hiring

> `pledge.html`: the eight-promise Fair Home pledge with a signing form and a downloadable SVG badge. `awards.html`: Home Heroes Awards — monthly US$100 winner, annual US$500 on 16 June, live countdown to the monthly deadline, nomination form with worker-consent checkbox, judging panel, full rules; plus the quarterly Skills on Camera video challenge with entry form. `support.html`: one-time/monthly contribution pledge (secure payment link sent by email, no card fields), allocation table (operations 25%, research and translation 20%, awards 20%, promotion 20%, hiring talent 15%), monthly tiers, quarterly transparency promise. `careers.html`: six open freelance roles and a talent-pool form. `advertise.html`: six partnership products, ad standards and an inquiry form.

## Phase 7 — Compliance and trust

> Privacy Policy (form handling, AdSense cookies with Google opt-out links, YouTube, local storage, GDPR/DPDP/UAE PDPL rights, children, retention), Terms, Disclaimer, Cookie Policy (table of every cookie/storage key), Trademark & Copyright disclosure (descriptive use, no affiliation with Khadim India Limited/"Khadim's", third-party marks, takedown process). Every page: unique title and meta description, one H1, breadcrumbs, internal links, no thin pages, no broken links, consent notice, clear navigation.

## Phase 8 — Test, publish and grow

> Test: every page at 390 px and 1360 px, light and dark; no horizontal overflow; planner outputs for all 9 countries; form step validation, prefill, estimate pill, budget warning and redirect; contract builder; checklist persistence; countdown; no console errors; no readable email anywhere in the repo; AdSense script and top strip on all pages; all internal links resolve. Publish to GitHub (`webworksa1/khadim-com`) on the free plan via GitHub Pages. Then point khadim.com DNS to GitHub Pages, add the custom domain, enforce HTTPS, submit the sitemap to Search Console, and apply to AdSense with the khadim.com site.
>
> Growth backlog: city × role landing pages (Dubai live-in maid, Bengaluru cook, Riyadh driver…), Hindi/Arabic/Tagalog rights pages, public-holiday calendars by country, salary-update newsletter, agency profile pages with licence-register links, quarterly transparency report.
