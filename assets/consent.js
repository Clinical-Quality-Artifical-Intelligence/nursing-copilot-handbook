/* Cookie consent and Google Analytics for handbook.nursingcitizendevelopment.com
   Google Analytics only loads after the visitor clicks "Accept analytics cookies".
   Until then no analytics cookies are set and nothing is sent to Google. */
(function () {
  var GA_ID = 'G-NNVRRR8ZN8';
  var KEY = 'ncd-handbook-consent'; // 'granted' or 'denied'
  var loaded = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function getChoice() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { window.localStorage.setItem(KEY, value); } catch (e) { /* private mode: ask again next visit */ }
  }

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function removeGaCookies() {
    var host = window.location.hostname;
    var parts = host.split('.');
    var domains = ['', host];
    for (var i = 1; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        domains.forEach(function (d) {
          document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function hideBanner() {
    var b = document.getElementById('consent-banner');
    if (b) b.remove();
  }

  function showBanner() {
    if (document.getElementById('consent-banner')) return;
    var b = document.createElement('div');
    b.id = 'consent-banner';
    b.className = 'consent';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Cookie choice');
    b.innerHTML =
      '<div class="wrap">' +
      '<p><strong>Can we use analytics cookies?</strong> We\'d like to use Google Analytics cookies to count visits and see which pages help people. ' +
      'We won\'t set them unless you accept. <a href="privacy.html#cookies">How we use cookies</a></p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-dark" data-consent="granted">Accept analytics cookies</button>' +
      '<button type="button" class="btn btn-dark" data-consent="denied">Reject analytics cookies</button>' +
      '</div></div>';
    b.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var value = btn.getAttribute('data-consent');
      saveChoice(value);
      hideBanner();
      if (value === 'granted') {
        loadAnalytics();
      } else {
        if (loaded) gtag('consent', 'update', { analytics_storage: 'denied' });
        removeGaCookies();
      }
    });
    document.body.appendChild(b);
  }

  // "Cookie settings" links reopen the banner
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-cookie-settings]');
    if (!link) return;
    e.preventDefault();
    showBanner();
    var first = document.querySelector('#consent-banner button');
    if (first) first.focus();
  });

  // Record clicks on Stripe buy buttons (only sent if analytics was accepted)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="https://buy.stripe.com/"]');
    if (!a || !loaded) return;
    gtag('event', 'begin_checkout', { currency: 'GBP', item_name: a.textContent.trim(), transport_type: 'beacon' });
  });

  function start() {
    var choice = getChoice();
    if (choice === 'granted') loadAnalytics();
    else if (choice !== 'denied') showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
