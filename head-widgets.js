// Виджеты сайта, вынесенные из поля «Вставка кода в HEAD» Tilda (лимит 65536 байт).
// Подключается одной строкой в HEAD с defer.

// ---- iv-wa-disclaimer-script ----
(function () {
  function addWhatsAppDisclaimer() {
    if (document.querySelector('.iv-wa-disclaimer')) return;
    if (!document.querySelector('a[href*="wa.me"]')) return;
    var note = document.createElement('p');
    note.className = 'iv-wa-disclaimer';
    note.textContent = '* Meta Platforms Inc., которой принадлежит WhatsApp, признана экстремистской организацией, её деятельность запрещена на территории Российской Федерации.';
    var target = document.querySelector('footer, .article-site-footer, .bureau-footer') ||
                 document.querySelector('main') || document.body;
    target.appendChild(note);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addWhatsAppDisclaimer);
  } else {
    addWhatsAppDisclaimer();
  }
})();

// ---- iv-map-widget-script ----
(function () {
  if (window.__ivMapWidget) return;
  window.__ivMapWidget = true;
  function init() {
    var mo = document.querySelector('.map-offline');
    if (!mo || mo.dataset.mapDone) return;
    mo.dataset.mapDone = '1';
    var ll = '60.593611,56.836938';
    var link = document.querySelector('a[href*="yandex.ru/maps"]');
    if (link) {
      var m = link.href.match(/[?&]ll=([\d.]+)%2C([\d.]+)/);
      if (m) ll = m[1] + ',' + m[2];
    }
    var iframe = document.createElement('iframe');
    iframe.src = 'https://yandex.ru/map-widget/v1/?ll=' + encodeURIComponent(ll) + '&z=16&pt=' + ll + ',pm2rdm';
    iframe.style.cssText = 'width:100%;height:260px;border:0;display:block;margin-bottom:12px;border-radius:8px;';
    iframe.loading = 'lazy';
    iframe.title = 'Карта: офис АБ СО «Защитник»';
    mo.insertBefore(iframe, mo.firstChild);
  }
  function run() { init(); }
  run();
  addEventListener('load', run);
  setTimeout(run, 600);
  setTimeout(run, 2000);
})();

// ---- iv-cookie-banner-script ----
(function () {
  if (window.__ivCookieBanner) return;
  window.__ivCookieBanner = true;
  function init() {
    try { if (localStorage.getItem('ivCookieOk')) return; } catch (e) {}
    if (document.querySelector('.iv-cookie-banner')) return;
    var bar = document.createElement('div');
    bar.className = 'iv-cookie-banner';
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#1c2733;color:#fff;padding:14px 18px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center;font-size:14px;line-height:1.4;box-shadow:0 -2px 12px rgba(0,0,0,.15)';
    var text = document.createElement('span');
    text.style.cssText = 'max-width:640px';
    text.innerHTML = 'Сайт использует файлы cookie для корректной работы. Подробнее — в <a href="/privacy" style="color:#9fd0ff;text-decoration:underline">политике конфиденциальности</a>.';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Хорошо';
    btn.style.cssText = 'background:#0f6fff;color:#fff;border:0;border-radius:6px;padding:8px 18px;font-size:14px;cursor:pointer;white-space:nowrap';
    btn.addEventListener('click', function () {
      try { localStorage.setItem('ivCookieOk', '1'); } catch (e) {}
      bar.remove();
    });
    bar.appendChild(text);
    bar.appendChild(btn);
    document.body.appendChild(bar);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ---- iv-max-button-script ----
(function () {
  if (window.__ivMaxButton) return;
  window.__ivMaxButton = true;
  var URL_MAX = 'https://web.max.ru/318171833';
  function make(cls, label) {
    var a = document.createElement('a');
    a.className = cls;
    a.href = URL_MAX;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.setAttribute('aria-label', label);
    return a;
  }
  function init() {
    var wa = document.querySelector('.side-whatsapp');
    if (wa && !document.querySelector('.side-max')) {
      wa.parentNode.insertBefore(make('side-max', 'Написать Ольге Иванниковой в MAX'), wa);
    }
    var hwa = document.querySelector('.header-whatsapp');
    if (hwa && !document.querySelector('.header-max')) {
      hwa.parentNode.insertBefore(make('header-max', 'Написать в MAX'), hwa);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  addEventListener('load', init);
})();
