# Consent-controlled services

Every public HTML page loads `/js/consent.js` synchronously in its head and uses
`/css/consent.css`. Optional resources have no direct HTML script or iframe src.
The script sets local Google Consent Mode v2 defaults to denied, then applies the
stored choice before loading any optional service. This is **basic** mode: no
Google tag or cookieless consent/measurement ping is loaded on an unconsented or
rejected visit. No GA4 property or GTM container has been added.

## Existing services

- `data-google-ads="AW-17938047753"` marks the 15 pages that already used Ads.
  The loader starts only for `advertising`. Existing landing-page conversion
  labels use `OnlineChaloConsent.trackGoogleAdsConversion(label)`, which drops
  unconsented events instead of replaying them later. Native WhatsApp/phone link
  navigation never waits for a tag or callback.
- `data-google-ads-conversion` preserves the existing thank-you-page event under
  advertising consent. Direct visits/refreshes can still count this existing
  event; reliable receipt-based deduplication needs a separate backend change.
- `data-vercel-analytics` is limited to website-design.html, preserving the
  existing script integration after `analytics` consent. A served script does
  not prove provider dashboard collection. Do not add initialisation, expand
  coverage or change provider configuration without reviewing that change.
- Maps use `data-consent-src` and a placeholder. Only `externalMedia` loads the
  iframe. The inline Enable Google Maps button explicitly grants this category;
  it does not grant advertising or analytics.
- Inter fonts are hosted locally with their SIL OFL license.
- Web3Forms POSTs and Google Apps Script project draft/submission requests are
  functional, user-requested processing, not optional tracking. Do not block or
  alter these destinations based on advertising/analytics choices. WhatsApp and
  external client links open only when followed.

## Preference lifecycle

`onlinechalo:consent:v1` contains version, savedAt, expiresAt and three booleans
in localStorage. Choices last 180 days; malformed, expired, future-dated and
unrecognised-version records fail closed. No unique visitor ID is stored.
Storage failure does not grant permission on future visits.

Withdrawing permission for a loaded SDK persists the choice, clears accessible
known first-party cookies, and reloads. This stops runtime code that cannot be
reliably unloaded, rather than running it in denied/cookieless mode. The new
document queues the saved Consent Mode update after denied defaults. The UI
warns that a reload can discard unsent form values. Maps can be removed without
a reload. Cross-tab changes are applied through storage events; BFCache pages
reload to avoid resuming stale permissions. Third-party/HttpOnly cookies cannot
be deleted by this script. No arbitrary script interception is promised.

## Later Meta Pixel installation (currently disabled)

The registry reserves `meta-pixel` in the advertising category with enabled=false
and an empty loader. There is no Pixel ID, fbevents.js loader, fbq initialisation,
PageView, conversion event, noscript beacon or Meta request. Accept All does not
enable it.

A later reviewed release must:

1. Confirm Pixel ownership/ID and approved event scope; update visible disclosure.
2. Implement the reserved loader and enable it **inside** the advertising-gated
   registry. Never add an HTML script, noscript beacon, tag-manager trigger,
   preconnect or auto-loading component outside this gate.
3. Check `OnlineChaloConsent.isAllowed('advertising')` at event time. Drop events
   generated without permission. Do not replay pre-consent form/contact events
   or send raw name, phone, email or project details as event parameters.
4. Test fresh, rejected, accepted, withdrawn, stored, expired and cross-tab states
   using actual network requests/cookies, including every third-party dependency.

Other future services can use
`OnlineChaloConsent.registerService(uniqueId, category, loadCallback)`;
registration invokes the callback only when the category is allowed. Duplicate
IDs are rejected. Loaders must be reviewed and resilient to provider failure.

## Contacts / remaining confirmation

The owner confirmed Kunal Grang, Founder, +91 9820027331 as the privacy/grievance
contact. Existing privacy email: hello@onlinechalo.in. The general business phone
remains +91 9820762331. A specific grievance acknowledgement/resolution deadline,
escalation route and detailed handling procedure have not been confirmed; no
name, alternate contact or response deadline has been invented.

## References

- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/consent
- https://vercel.com/docs/analytics/privacy-policy
