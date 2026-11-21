# GEO/SEO Audit — 0NOXTACKORE

**Date:** 2026-11-21  
**Site:** https://0noxtackore.makes.fyi  
**Locales:** `/es` (default), `/en`  
**Method:** GEO-SEO skill scripts (`fetch_page`, `citability_scorer`, `brand_scanner`, `llmstxt_generator`) + manual technical/SEO/GEO review of live pages, sitemap, robots, and structured data.

> Note: Executed in OpenCode using the installed `~/.claude/skills/geo` toolset and direct analysis (not Claude Code subagent orchestration).

---

## Executive summary (Quick / Audit)

| Area | Status | Priority |
|---|---:|---|
| Indexability / crawlability | Good baseline | P1 |
| AI crawler access (robots) | Open (`Allow: /`) | P2 |
| Structured data (JSON-LD) | Present, needs fixes | P1 |
| Citability for AI answers | Low (28.7 EN home, 35.8 EN guide) | P0 |
| Brand/entity presence off-site | Very low / unverified | P0 |
| Technical security headers | Missing most headers | P1 |
| llms.txt | Exists, valid, basic | P2 |
| i18n / canonical / hreflang | Good after recent fixes | P2 |
| OG/Twitter metadata | Present, minor gaps | P2 |

**Top 5 actions (highest impact):**
1. **Increase AI citability**: add short, self-contained answer blocks (134–167 words), definition-first openings, stats/facts, and clear H2/H3 question-style sections on home/about/guide.
2. **Fix schema bugs**: Organization `logo` used locale-prefixed URL on EN (`/en/sites/...` returned 404) — fixed in code; verify after deploy. Add `Person`/founder details, `ContactPoint`, `WebPage`/`BreadcrumbList`, and richer `Article` metadata (dateModified, author Person, headline/image complete).
3. **Build brand/entity signals**: create/complete profiles and third-party mentions (YouTube, Reddit, LinkedIn, GitHub org profile, Wikidata/entity consistency, industry directories). AI visibility correlates strongly with brand mentions.
4. **Add missing security headers**: CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy via `next.config.ts` headers.
5. **Strengthen llms.txt**: add `llms-full.txt`, more detailed sections, project links, contact, policies, and explicit language/resource structure.

---

## 1) `/geo quick` — 60-second snapshot

- **Live/Indexable:** 200 on key pages (`/es`, `/en`, `/es/guia`, `/en/guide`, `/es/acerca`, `/en/about`). `robots` meta: `index, follow`.
- **Robots/Sitemap:** `robots.txt` allows all; sitemap declared and includes 6 localized URLs with hreflang alternates.
- **llms.txt:** Present and valid (`/llms.txt`), 4 sections, 6 links; `llms-full.txt` missing.
- **Schema present:** Organization, WebSite, FAQPage on home; Article on guide; ProfilePage on about.
- **Main gaps:** low citability, missing security headers, weak off-site brand presence, some alt text missing.

## 2) `/geo audit` — Full GEO + SEO audit (synthesized)

### AI Citability & Visibility (25%) — **Needs work**
- `citability_scorer.py` (EN home): **28.7 / 100**, 11 blocks, 0 optimal-length passages (134–167 words).
- `citability_scorer.py` (EN guide): **35.8 / 100**, 8 blocks, 0 optimal-length passages.
- **Why low:** content is visually clean but not structured as extractable AI answers. Few definition-first paragraphs, few self-contained 134–167 word passages, limited explicit facts/stats/citations.
- **Fix:** for each key section, add a direct answer in first 1–2 sentences, then supporting detail; include concrete facts (dates, technologies, process, scope, pricing model if public, location/service area).

### Brand Authority Signals (20%) — **Low / early stage**
- `brand_scanner.py` (0NOXTACKORE, 0noxtackore.makes.fyi): no detected signals on YouTube/Reddit/Wikipedia/LinkedIn/other from script heuristics.
- **Reality check:** brand has GitHub/YouTube/Facebook/Instagram links in schema and site; off-site mention depth, consistency, and third-party citations likely still limited.
- **Fix:** consistent entity name/NAP-style brand profile, complete social profiles, publish technical content on YouTube/GitHub/blog, earn mentions on Reddit/LinkedIn/dev communities, add Organization sameAs completeness (LinkedIn company page if available, Crunchbase/Wikidata if appropriate).

### Content Quality & E-E-A-T (20%) — **Moderate**
- Clear positioning and service areas; founder/CEO included on About page (good trust/entity signal).
- Missing: author bylines/person pages, publication/update dates visible on content, case studies, testimonials/evidence, external citations/sources, detailed process/proof.
- **Fix:** add “Last updated” dates, author Person schema, case studies/portfolio, real testimonials, project pages with outcomes, and references where claims are made.

### Technical Foundations (15%) — **Moderate**
- HTTPS + HSTS present. Status 200, canonical tags present, robots index/follow, sitemap with hreflang.
- Missing headers: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options` (or CSP frame-ancestors), `Referrer-Policy`, `Permissions-Policy`.
- **Fix:** add headers in `next.config.ts` (`headers()`), validate CSP carefully with Next/Vercel/inline scripts/analytics.

### Structured Data (10%) — **Good base, fixable issues**
- Present: `Organization`, `WebSite`, `FAQPage` (home); `Article` (guide); `ProfilePage` (about).
- **Issue found/fixed in code:** Organization `logo` was built with `content.baseUrl`, producing `.../en/sites/0noxtackore/logo.webp` (404). Changed to `siteUrl` root in `src/app/[locale]/layout.tsx` and `src/components/sites/0noxtackore/About.tsx`.
- **Improve:** add `ContactPoint`/`email` when available, `founder` as Person with sameAs, `BreadcrumbList`, `WebPage`, richer `Article` (`author` Person, `datePublished`/`dateModified`, `mainEntityOfPage`, `image`), `Service`/`ProfessionalService` where applicable.

### Platform Optimization (10%) — **Early**
- Good: clear brand/entity, FAQ, llms.txt, sitemap, open robots.
- Missing: explicit Q&A blocks optimized for AI extraction, comparison/definition passages, strong off-site corroboration, `llms-full.txt`.
- **Fix:** create “What is 0NOXTACKORE?”, “What services do you offer?”, “Who is behind 0NOXTACKORE?” answer blocks with concise factual copy; publish authoritative third-party profiles.

---

## 3) `/geo citability` — AI citation readiness

| Page | Avg citability | Blocks | Optimal 134–167 word passages | Grade dist |
|---|---:|---:|---:|---|
| `/en` | 28.7 | 11 | 0 | F-heavy (per script) |
| `/en/guide` | 35.8 | 8 | 0 | F-heavy (per script) |

**Recommendations:**
- Add “answer-first” paragraph under each H2.
- Create 1–2 citable passages per page: 134–167 words, self-contained, factual, with entity name in text.
- Add definitions: “0NOXTACKORE is…”, “GEO/SEO guide purpose is…”.
- Include concrete data (founded 2026, founder Angello Aponte, service areas, open-source focus) in extractable form.

## 4) `/geo crawlers` — AI crawler access

- **robots.txt:** `User-agent: *` / `Allow: /` / Sitemap declared. No AI bot blocks detected.
- **Meta robots:** `index, follow` on audited pages.
- **AI crawlers to explicitly allow/monitor:** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended (decide policy), CCBot (decide policy), Bytespider (decide policy).
- **Recommendation:** keep open for discovery unless you have a reason to restrict; optionally add explicit bot groups for clarity and monitoring. Ensure important pages are SSR/static and not blocked by JS-only rendering (current Next static output is good).

## 5) `/geo llmstxt` — llms.txt analysis

- **`/llms.txt`:** exists, valid, has title/description/sections/links (4 sections, 6 links). No script issues/suggestions.
- **`/llms-full.txt`:** missing.
- **Recommendations:**
  - Add `/llms-full.txt` with expanded descriptions, project summaries, services, founder info, policies, and contact.
  - Add explicit links to key resources (projects, guide, about, GitHub repos, contact/policy pages when created).
  - Keep ES/EN sections clearly labeled; include canonical URLs.

## 6) `/geo brands` — Brand mention scan

- **Script result:** no strong automated signals detected for YouTube/Reddit/Wikipedia/LinkedIn/other.
- **Manual signals present:** sameAs links to GitHub, YouTube, Facebook, Instagram; founder named on About; Organization schema.
- **Recommendations:**
  - Ensure brand name consistency: `0NOXTACKORE` / `0noxtackore`.
  - Complete and actively maintain YouTube and LinkedIn presence; publish technical/project demos.
  - Create/claim relevant profiles (GitHub org profile README, dev communities) and seek third-party mentions.
  - Consider Wikidata/entity-home alignment only when notability/accuracy criteria are met.

## 7) `/geo platforms` — Platform-specific optimization

- **Google AI Overviews:** good basics (indexable, schema, FAQ, sitemap). Improve with concise answer blocks and authoritative evidence.
- **ChatGPT / Browse:** allow OAI-SearchBot/ChatGPT-User; provide clear factual “about/services/founder” passages.
- **Perplexity:** values citations and clear factual structure; add sources, dates, author/entity clarity.
- **Gemini:** benefits from strong entity/brand consistency and structured data.
- **Recommendation:** create a “Facts / Entity” block on About: founded 2026, founder Angello Aponte, services, languages, official links, location/service scope.

## 8) `/geo schema` — Structured data

**Detected:** Organization, WebSite, FAQPage, Article, ProfilePage.  
**Validated issues:**
- **Logo URL bug (fixed in code):** Organization logo resolved to locale URL on EN (`/en/sites/0noxtackore/logo.webp` = 404). Fixed to use root `siteUrl`.
- `og:locale` missing on guide/about pages (minor).
- Consider adding `BreadcrumbList`, `WebPage`, `Person` (founder), `ContactPoint`, richer `Article`.

## 9) `/geo technical` — Technical SEO

- **Good:** 200 responses, canonical, hreflang in sitemap, index/follow, HSTS, static/SSR-friendly Next output.
- **Gaps:** missing CSP/X-Content-Type-Options/X-Frame-Options/Referrer-Policy/Permissions-Policy; 6 home images missing `alt` (area cards).
- **Fix:** add security headers in `next.config.ts`; add meaningful alt text for area images in `content.ts`.

## 10) `/geo content` — Content quality & E-E-A-T

- **Strengths:** clear mission, service areas, founder identity, bilingual content.
- **Gaps:** low extractable answer density, limited evidence/proof, no visible dates/authors/references, few citable stats.
- **Fix:** add case studies, project outcome snapshots, “last updated”, author/founder attribution, and answer-first content blocks.

## 11) `/geo report` — Client-ready summary

**Priority backlog (P0–P2):**

| Priority | Action | Effort | Impact |
|---|---|---:|---:|
| P0 | Rewrite key sections into citable answer blocks (134–167 words), definition-first | Med | Very High |
| P0 | Build off-site brand/entity presence (profiles, mentions, consistent sameAs) | High | Very High |
| P1 | Add security headers in Next config | Low | High |
| P1 | Fix remaining schema richness (Person, ContactPoint, BreadcrumbList, Article fields) | Med | High |
| P1 | Add missing alt text to area images | Low | Med |
| P2 | Create `llms-full.txt` + enrich `llms.txt` | Low | Med |
| P2 | Add visible update dates/author attribution/case studies | Med | High |

## 12) `/geo report-pdf`

- The installed skill supports PDF generation via `pandoc` + headless Chrome (Mac-oriented template in SKILL.md). On this Windows environment, PDF generation was **not executed**.
- The Markdown report is available at `docs/seo-geo-audit-2026-11-21.md`; it can be converted to PDF later when `pandoc`/Chrome are configured.

---

## Code fixes applied during this audit

- Fixed schema `logo` URL to use root `siteUrl` instead of locale `content.baseUrl` (prevented 404 on EN):
  - `src/app/[locale]/layout.tsx`
  - `src/components/sites/0noxtackore/About.tsx`

*Validate with `npm run check` and deploy before re-testing live schema URLs.*
