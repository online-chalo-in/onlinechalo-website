/* OnlineChalo first-party consent. Optional resources must be registered here. */
(() => {
  'use strict';
  if (window.OnlineChaloConsent) return;

  const script = document.currentScript;
  const adsId = script?.dataset.googleAds || '';
  const hasAnalytics = script?.hasAttribute('data-vercel-analytics') || false;
  const conversionLabel = script?.dataset.googleAdsConversion || '';
  const STORAGE_KEY = 'onlinechalo:consent:v2';
  const VERSION = 2;
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const categories = ['advertising', 'analytics', 'externalMedia'];
  const denied = () => ({ advertising: false, analytics: false, externalMedia: false });
  // Version 1 did not disclose Meta Pixel. Never carry those choices forward.
  // Removing its key also notifies open version-1 documents to stop their SDKs.
  try { localStorage.removeItem('onlinechalo:consent:v1'); } catch (_) { /* fail closed */ }
  let choice = readChoice();
  let state = choice ? choice.preferences : denied();
  let banner;
  let dialog;
  let liveStatus;
  let previousFocus;
  let googleStarted = false;
  let conversionSent = false;
  let expiryTimer;
  const services = new Map();

  // This local queue makes no network requests. Basic Consent Mode v2:
  // denied defaults and the visitor's update precede any Google config/event.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied',
    ad_personalization: 'denied', analytics_storage: 'denied'
  });

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || saved.version !== VERSION || !Number.isFinite(saved.savedAt) ||
          saved.savedAt > Date.now() || saved.expiresAt !== saved.savedAt + MAX_AGE ||
          saved.expiresAt <= Date.now() ||
          !categories.every(k => typeof saved.preferences?.[k] === 'boolean')) return null;
      return saved;
    } catch (_) { return null; }
  }

  function googleConsent() {
    window.gtag('consent', 'update', {
      ad_storage: state.advertising ? 'granted' : 'denied',
      ad_user_data: state.advertising ? 'granted' : 'denied',
      ad_personalization: state.advertising ? 'granted' : 'denied',
      analytics_storage: state.analytics ? 'granted' : 'denied'
    });
  }

  function loadScript(id, src) {
    if (document.getElementById(id)) return;
    const element = document.createElement('script');
    element.id = id;
    element.async = true;
    element.src = src;
    document.head.appendChild(element);
  }

  function registerService(id, category, load, enabled = true) {
    if (!categories.includes(category) || services.has(id) || typeof load !== 'function') {
      throw new TypeError('An optional service needs a unique ID, category and loader.');
    }
    services.set(id, { category, load, enabled, started: false });
    startAllowedServices();
  }

  function startAllowedServices() {
    for (const service of services.values()) {
      if (service.enabled && !service.started && state[service.category]) {
        service.started = true;
        service.load();
      }
    }
  }

  function trackGoogleAdsConversion(label) {
    // Reject unconsented clicks outright: do not queue them for later replay.
    if (!state.advertising || !googleStarted || !adsId || !/^[A-Za-z0-9_-]+$/.test(label)) return false;
    window.gtag('event', 'conversion', { send_to: `${adsId}/${label}` });
    return true;
  }

  function clearOptionalCookies() {
    // Only first-party cookies visible to this origin can be removed here.
    const prefixes = [];
    if (!state.advertising) prefixes.push('_gcl_', '_gac_', '_fbp', '_fbc');
    if (!state.analytics) prefixes.push('_ga', '_gid', '_gat');
    const hosts = location.hostname.split('.');
    const domains = ['', location.hostname];
    for (let i = 0; i < hosts.length - 1; i++) domains.push('.' + hosts.slice(i).join('.'));
    const paths = ['/'];
    const parts = location.pathname.split('/').filter(Boolean);
    for (let i = 1; i < parts.length; i++) paths.push('/' + parts.slice(0, i).join('/'), '/' + parts.slice(0, i).join('/') + '/');
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!prefixes.some(prefix => name.startsWith(prefix))) continue;
      for (const domain of domains) for (const path of paths) {
        document.cookie = `${name}=; Max-Age=0; Path=${path}${domain ? '; Domain=' + domain : ''}; SameSite=Lax`;
      }
    }
  }

  function updateMaps() {
    document.querySelectorAll('[data-consent-map]').forEach(container => {
      const frame = container.querySelector('iframe');
      const placeholder = container.querySelector('[data-map-placeholder]');
      if (state.externalMedia) {
        if (!frame.hasAttribute('src')) frame.src = frame.dataset.consentSrc;
        frame.hidden = false;
        placeholder.hidden = true;
      } else {
        frame.removeAttribute('src');
        frame.hidden = true;
        placeholder.hidden = false;
      }
    });
  }

  function savePreferences(preferences) {
    const next = Object.fromEntries(categories.map(k => [k, preferences[k] === true]));
    const mustReload = [...services.values()].some(s => s.started && state[s.category] && !next[s.category]);
    state = next;
    const savedAt = Date.now();
    choice = { version: VERSION, savedAt, expiresAt: savedAt + MAX_AGE, preferences: { ...state } };
    let persisted = true;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(choice)); } catch (_) { persisted = false; }
    scheduleExpiry();
    clearOptionalCookies();
    if (mustReload) {
      // A loaded SDK cannot be safely unloaded. Persist first, then restart in
      // basic mode. Do not invoke the old SDK's denied-state/cookieless pings.
      // The new document queues the saved Consent Mode update before any tag.
      window.stop();
      location.reload();
      return;
    }
    googleConsent();
    startAllowedServices();
    updateMaps();
    if (banner) banner.hidden = true;
    if (dialog?.open) dialog.close();
    if (liveStatus) liveStatus.textContent = persisted ? 'Your cookie preferences have been saved.' : 'Preferences apply to this page. Your browser could not save them for future visits.';
    window.dispatchEvent(new CustomEvent('onlinechalo:consentchange', { detail: { ...state } }));
  }

  function scheduleExpiry() {
    window.clearTimeout(expiryTimer);
    if (!choice) return;
    const remaining = choice.expiresAt - Date.now();
    if (remaining > 0) {
      expiryTimer = window.setTimeout(scheduleExpiry, Math.min(remaining + 1, 2147483647));
      return;
    }
    const mustReload = [...services.values()].some(service => service.started);
    choice = null;
    state = denied();
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* fail closed */ }
    clearOptionalCookies();
    if (mustReload) { window.stop(); location.reload(); return; }
    googleConsent();
    updateMaps();
    if (banner) banner.hidden = false;
    if (dialog?.open) for (const category of categories) dialog.querySelector(`[name="${category}"]`).checked = false;
  }

  function showPreferences() {
    if (!dialog) return;
    for (const category of categories) dialog.querySelector(`[name="${category}"]`).checked = state[category];
    previousFocus = document.activeElement;
    dialog.showModal();
  }

  window.OnlineChaloConsent = Object.freeze({
    showPreferences,
    isAllowed: category => categories.includes(category) && state[category] === true,
    getPreferences: () => ({ ...state }),
    registerService,
    trackGoogleAdsConversion
  });

  googleConsent();
  clearOptionalCookies();
  if (adsId) registerService('google-ads', 'advertising', () => {
    googleStarted = true;
    window.gtag('js', new Date());
    window.gtag('config', adsId);
    loadScript('oc-google-ads', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`);
    if (conversionLabel && !conversionSent) {
      conversionSent = trackGoogleAdsConversion(conversionLabel);
    }
  });
  if (hasAnalytics) registerService('vercel-analytics', 'analytics', () => {
    // Preserve the existing integration; do not expand analytics to new pages.
    loadScript('oc-vercel-analytics', '/_vercel/insights/script.js');
  });
  registerService('meta-pixel', 'advertising', () => {
    // The registry starts this loader once per document, after permission.
    // Standard Meta queue; no SDK, preconnect or noscript outside this gate.
    if (!window.fbq) {
      const fbq = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      window.fbq = fbq;
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
    }
    // Manual PageView only: disable automatic events and automatic matching.
    // Never supply form values or advanced-matching identifiers to init/track.
    window.fbq('set', 'autoConfig', false, '1682448780096891');
    window.fbq('init', '1682448780096891');
    window.fbq('trackSingle', '1682448780096891', 'PageView');
    loadScript('oc-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
  });

  function mount() {
    const host = document.createElement('div');
    host.id = 'oc-consent-ui';
    host.innerHTML = `
      <section class="oc-consent-banner" aria-labelledby="oc-consent-title" aria-describedby="oc-consent-summary">
        <h2 id="oc-consent-title">Your privacy choices</h2>
        <p id="oc-consent-summary">Choose whether to allow optional advertising, analytics and Google Maps. Forms and contact links work without them. <a href="/privacy-policy.html">Privacy Policy</a></p>
        <div class="oc-consent-actions">
          <button type="button" data-consent-action="accept">Accept All</button>
          <button type="button" data-consent-action="reject">Reject Optional</button>
          <button type="button" data-consent-action="manage">Manage Preferences</button>
        </div>
      </section>
      <dialog class="oc-consent-dialog" aria-labelledby="oc-preferences-title" aria-describedby="oc-preferences-summary">
        <h2 id="oc-preferences-title">Cookie preferences</h2>
        <p id="oc-preferences-summary">Optional services stay off until you allow them. You can change your choices at any time.</p>
        <p><strong>Necessary — always on</strong><br>Hosting, your saved preference, and the forms or project workspace you use. These do not depend on optional consent.</p>
        <label><input type="checkbox" name="advertising"><span><strong>Advertising</strong><br>Google Ads measurement and conversions, plus Meta Pixel page-view measurement. These services can use cookies or similar identifiers for advertising measurement and remarketing audiences.</span></label>
        <label><input type="checkbox" name="analytics"><span><strong>Analytics</strong><br>Vercel Web Analytics helps us understand visits and device types on our website-design page.</span></label>
        <label><input type="checkbox" name="externalMedia"><span><strong>External media</strong><br>Google Maps on Contact and About. Google receives technical information when a map loads.</span></label>
        <p class="oc-consent-note">Choices are saved in this browser for 180 days. Removing a permission may reload this page to stop an active service; finish or copy any unsent message first.</p>
        <div class="oc-consent-actions">
          <button type="button" data-consent-action="save">Save Preferences</button>
          <button type="button" data-consent-action="accept">Accept All</button>
          <button type="button" data-consent-action="reject">Reject Optional</button>
          <button type="button" data-consent-action="close">Close</button>
        </div>
      </dialog>
      <p class="oc-consent-status" role="status" aria-live="polite"></p>`;
    document.body.appendChild(host);
    banner = host.querySelector('section');
    dialog = host.querySelector('dialog');
    liveStatus = host.querySelector('[role="status"]');
    banner.hidden = Boolean(choice);
    dialog.addEventListener('close', () => {
      const target = previousFocus?.isConnected && previousFocus.getClientRects().length ? previousFocus : document.querySelector('.oc-cookie-settings');
      target?.focus({ preventScroll: true });
    });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button, input, a[href]')].filter(e => !e.disabled && e.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.addEventListener('click', event => {
      const target = event.target.closest('[data-consent-action]');
      if (!target) return;
      switch (target.dataset.consentAction) {
        case 'accept': savePreferences({ advertising: true, analytics: true, externalMedia: true }); break;
        case 'reject': savePreferences(denied()); break;
        case 'manage': showPreferences(); break;
        case 'close': dialog.close(); break;
        case 'save': savePreferences(Object.fromEntries(categories.map(k => [k, dialog.querySelector(`[name="${k}"]`).checked]))); break;
        case 'map': savePreferences({ ...state, externalMedia: true }); break;
      }
    });
    updateMaps();
    scheduleExpiry();
  }

  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    const saved = readChoice();
    const next = saved ? saved.preferences : denied();
    const mustReload = [...services.values()].some(s => s.started && state[s.category] && !next[s.category]);
    choice = saved;
    state = next;
    scheduleExpiry();
    clearOptionalCookies();
    if (mustReload) { window.stop(); location.reload(); return; }
    googleConsent();
    startAllowedServices();
    updateMaps();
    if (banner) banner.hidden = Boolean(choice);
    if (dialog?.open) for (const k of categories) dialog.querySelector(`[name="${k}"]`).checked = state[k];
  });
  // A previously accepted document restored from back/forward cache must check
  // for choices withdrawn in another page before its SDKs resume.
  window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleExpiry(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
