# Development-led redesign — owner-review preview

Base: production `0b8711b3281fbbd38df8040af4f95fa55dc8ea68`.
Work branch: `codex/development-led-preview`. Do not merge or promote without
owner approval. Existing canonical `.html` routes are retained.

## Design specification

- Light ivory-green background `#f7f8f4`, white media surfaces, forest text
  `#16352d`, muted text `#5d6b64`, line `#dce2d9`, lime CTA `#cef580`.
- Original blue/green wordmark; locally hosted Inter, weights 400–700.
- 1248px content maximum on standard desktops, expanding to 1440px at 1536px;
  48px desktop / 22px mobile gutters, 8px spacing scale.
- Open editorial layout: two-column headline/intro, two actual work images,
  four ruled service rows, three process columns, split native-details FAQs,
  dark forest contact band, four-column footer. No generic card grid, badges,
  fake figures or promotional deadline/price strips on the homepage.
- Service pages reuse the hero, split capability rows, scope lists, process,
  FAQs and contact band. All navigation, questions and CTAs are real HTML.
- Desktop dropdowns support click, keyboard and Escape; mobile uses an explicit
  toggle with announced state. Focus is visible. Reduced motion is respected.
- Images are original project screenshots, not the illustrative project images
  generated inside design concepts. Preserve actual screenshot content, use
  responsive compressed assets, intrinsic dimensions and lazy loading below fold.

## Evidence and copy boundaries

- Supplied Keyword Planner figures are estimates for India, not site traffic,
  SEO difficulty or additive totals. No ranking/AI placement promises.
- Rechecked Windsor Search Console for 2026-10-20–2026-11-14: homepage 2 clicks /
  23 impressions; clinics 0/7; coaching 0/18; Google Ads 0/9; real estate 0/8;
  website design 0/6. Other target URLs were absent from returned rows; this
  does not establish zero demand or an exhaustive total.
- Owner supplied actual Rememo dashboard and catalogue WebP screenshots.
  These are used unchanged as interface proof; their displayed figures are not
  presented as OnlineChalo client outcomes.
- Owner approved reuse of the Rememo and AMI Natural screenshots with these limits. The AMI Natural image shows the brand/product site; do not claim verified
  checkout, specific platform, integration implementation or sales results.
- No Shopify/WooCommerce/Magento expertise, native mobile development, team-size,
  certification, new client count, outcome or testimonial claims are added.
- Owner confirmed Meta Ads campaign management is ready, covering paid strategy,
  lead forms/click-to-WhatsApp, audience/creative testing and lead-quality reporting.
  Creative production is agreed separately. Organic posting/content management is excluded.
- Ownership, third-party licenses, maintenance, costs and timelines must be
  agreed in the project scope; do not invent blanket contractual promises.

## Preserved systems

Keep `js/consent.js`, `css/consent.css`, all six form blocks, configured actions,
Web3Forms keys, redirects, demo WhatsApp functions, discovery storage/endpoint,
existing Google Ads conversion handling and the privacy policy. Keep a footer
Cookie Preferences control everywhere. Add neither GA4 nor Meta Pixel.

## Review checklist

Screenshot reuse and Meta campaign-management scope were confirmed by the owner.
The approved Rememo product UI attachment is included; review support/ownership wording
and any fuller project-contribution descriptions, then approve a separate production
release. The preview is not an authorisation to merge or publish to production.

## Search guidance consulted

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable

## Page-by-page change log

| URL / surface | Change |
| --- | --- |
| `/` | Development-led company title/H1, two real project frames including supplied Rememo UI, primary development services followed by Google/Meta Ads, scoping process, buyer FAQs and project CTA. Removed cheap/fast positioning from the company hero. |
| `/ecommerce.html` | Unique Mumbai-focused title/description/H1, catalogue vs transactional-store distinction, scope factors, generic provider-feasibility wording, truthful AMI showcase proof, ownership/maintenance FAQs. Existing ₹15,000 starting offer retained lower on the page. |
| `/web-app-development.html` | Custom browser-application intent, dashboard/catalogue UI proof, users/roles, workflows, first version, integrations/testing/support FAQs, explicit native mobile distinction. Existing ₹50,000 starting offer retained lower on the page. |
| `/google-ads.html` | Enquiry/sales objective without guarantees; account/keyword/negative-keyword work, landing-page alignment, measurement/reporting and fee boundaries. Existing ₹3,000–5,000 management range and separate ₹10,000 recommended media starting budget retained, qualified by scope and suitability. |
| `/meta-ads.html` | New paid campaign service, confirmed strategy/lead forms/WhatsApp/testing/reporting scope; creative production agreed separately; organic posting/content/account management excluded. No made-up Meta fee, client results or Pixel installation. |
| `/portfolio.html` | Grouped application, brand/product, business website and campaign/landing-page work. Actual Rememo screenshots open at full size; AMI is a showcase, not checkout/result evidence. Removed unsupported quantitative outcomes from rewritten proof copy. |
| `/about.html` | Company description aligned with development; owner-confirmed founder and existing office/contact identity retained; optimised founder photograph. Existing consent-controlled office map retained. No team-size or credential claims added. |
| `/contact.html` | Updated heading/intro for stores, apps and paid campaigns; form block, fields, key, action and success handling unchanged. |
| `/website-design.html`, `/pricing.html`, GBP and industry pages | Existing service and pricing content retained. New shared navigation/footer makes development and advertising primary; entry-level/industry services remain in secondary links. |
| `/privacy-policy.html` | Policy article preserved; shared navigation/footer updated; preference button retained. |
| `/lp.html`, `/thank-you.html`, demos and discovery | Source unchanged. Existing paid flow, Google Ads conversions, WhatsApp enquiries, discovery endpoint and local storage retained. |
| Sitemap | Added canonical `/meta-ads.html`; existing canonical routes retained. |

## SEO / AEO implementation

Unique service title, meta description and H1; existing canonical routes; real
internal links between services, scope, work and contact. Native details/summary
FAQs remain readable and keyboard operable. No FAQ rich-result or AI placement
promise. Organization/ProfessionalService facts are visible on Home/About;
Service markup mirrors the four services; BreadcrumbList mirrors visible trails.
No rating/review/result markup or platform-specialist claims were added.

## Tests and visual review

- Local browser QA: 22/22 pages HTTP 200, meaningful content, expected metadata,
  one public-page main/H1, unique preference control, no broken images or page
  JavaScript exceptions. Zero optional requests before consent.
- Responsive checks at 320, 390, 768 and 1280 CSS pixels. All redesigned pages
  fit. The unchanged legacy `/lp.html` comparison table still overflows on
  320/390px; this existing paid page was intentionally kept outside the redesign.
- Desktop keyboard dropdowns, Escape, mobile menu state/navigation, FAQ expansion
  and preference controls exercised. First visual checks used the built-in
  browser; automated Playwright checks captured metadata/layout and provider
  network/storage regressions. These are Chromium tests, not Safari certification.
- All 18 consent scenarios passed on 22 local pages: fresh/rejected visits,
  Accept, separate Ads/analytics/Maps, withdrawal, storage/cookie inspection,
  expiry, invalid/unavailable storage, cross-tab changes, native dialog focus,
  direct Ads conversion gating, both Contact/About map gates and no Meta requests.
- All six form blocks match the production base exactly. Web3Forms payload and
  success routing, three demo WhatsApp flows and discovery draft saving were
  tested with intercepted provider submissions; no duplicate real enquiries were
  sent. Current inbox delivery and provider dashboard collection are not newly
  certified by these regression tests.
- Consent JS/CSS, the original paid landing page and thank-you page match the
  production base. Neither GA4 nor Meta Pixel was added.
- Main supplied screenshots: actual source pixels, 36.6KB catalogue / 21.5KB
  dashboard. AMI's WebP copy is 56.7KB versus the original 689.4KB. Source PNGs
  were preserved. Unused generated marketing-image copy removed.
- Visual comparison against the section concepts checked: ivory/forest/lime
  palette, Inter hierarchy, two-column hero, aligned proof frames, editorial
  service rules, process/FAQ rhythm, contact band and footer. Original real
  screenshots replace generated concept placeholders. This is a deliberate
  evidence constraint, with the owner-supplied UI now used for app proof.

## Remaining review decisions

Review the complete preview and the proposed ownership/support wording. Fuller
client contribution descriptions and any future results claims still require
supporting records. Screenshot reuse and Meta campaign scope are confirmed;
creative production is separate. Only a later explicit approval may authorise
merging this branch or deploying it to production.

## Measurement after an approved release

Keep the dated page-level Search Console baseline above. Compare subsequent
periods for `/ecommerce.html`, `/web-app-development.html`, `/google-ads.html` and
`/meta-ads.html` once the new page is indexed. Report queries, impressions and
clicks alongside qualified enquiries and customers; do not treat an early small
sample as evidence of ranking difficulty or a predicted result. Landing-page / UTM
attribution must be verified against the actual enquiry and follow-up records
with the applicable consent choices. This preview adds no attribution tracker,
GA4, GTM or Meta Pixel, and does not certify inbox delivery or sales attribution.
