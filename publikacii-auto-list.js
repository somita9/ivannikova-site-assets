(function(){
  var listBox = document.querySelector('.publication-list');   // страница /publikacii — полный список
  var gridBox = document.querySelector('.publication-grid');   // главная страница — карусель из последних постов
  if (!listBox && !gridBox) return;

  fetch('/rss-feed-741487392851.xml').then(function(r){ return r.text(); }).then(function(xml){
    var doc = new DOMParser().parseFromString(xml, 'text/xml');
    var items = [].slice.call(doc.querySelectorAll('item')).map(function(it){
      var g = function(tag){ var n = it.querySelector(tag); return n ? n.textContent : ''; };
      return { title: g('title'), link: g('link'), desc: g('description'), date: new Date(g('pubDate')) };
    });
    items.sort(function(a,b){ return b.date - a.date; });

    var months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    var IMG = 'https://static.tildacdn.com/tild3634-3231-4366-b539-363865363833/ivannikova-publicati.jpg';
    var esc = function(s){ var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
    var pathOf = function(link){ try { return new URL(link).pathname; } catch(e){ return link; } };
    var dateOf = function(d){ return isNaN(d) ? '' : (d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()); };

    // страница /publikacii: полный список, карточки <h2>, ссылка класса read-more
    if (listBox) {
      var htmlList = items.map(function(it){
        var path = pathOf(it.link), dateStr = dateOf(it.date);
        return '<article><img src="' + IMG + '" alt="" width="800" height="1067" loading="lazy" decoding="async">' +
          '<div><span>' + dateStr + '</span><h2><a href="' + path + '">' + esc(it.title) + '</a></h2>' +
          '<p>' + esc(it.desc) + '</p><a href="' + path + '" class="read-more">Читать статью →</a></div></article>';
      }).join('');
      if (htmlList) listBox.innerHTML = htmlList;
    }

    // главная страница: карусель из последних 30 постов, карточки <h3>, без класса у ссылки
    if (gridBox) {
      var htmlGrid = items.slice(0, 30).map(function(it){
        var path = pathOf(it.link), dateStr = dateOf(it.date);
        return '<article><img src="' + IMG + '" alt="" width="800" height="1067" loading="lazy" decoding="async">' +
          '<div><span>' + dateStr + '</span><h3>' + esc(it.title) + '</h3>' +
          '<p>' + esc(it.desc) + '</p><a href="' + path + '">Читать статью →</a></div></article>';
      }).join('');
      if (htmlGrid) gridBox.innerHTML = htmlGrid;
    }
  }).catch(function(){});
})();

// ---- персональные данные: оператор — лично Иванникова О.Н., а не бюро ----
(function(){
  // страница /privacy: правим раздел «1. Оператор» и раздел «10. Контакты»
  if (location.pathname === '/privacy') {
    var paras = document.querySelectorAll('.policy-page p');
    for (var i = 0; i < paras.length; i++) {
      var p = paras[i];
      if (p.textContent.indexOf('Оператором персональных данных является Адвокатское бюро') === 0) {
        p.innerHTML = 'Оператором персональных данных является адвокат Иванникова Ольга Николаевна, ' +
          'реестровый номер в реестре адвокатов Свердловской области — 66/2906. ' +
          'Адрес для корреспонденции: 620075, г. Екатеринбург, проспект Ленина, 24/8, офис 615. ' +
          'Электронная почта: advokat-ion@mail.ru. Телефон: +7 912 634-61-65.';
        // следующий абзац («Обращения по вопросам... также принимает адвокат Иванникова»)
        // теперь дублирует эту же информацию — убираем его
        var next = p.nextElementSibling;
        if (next && next.tagName === 'P' && next.textContent.indexOf('Обращения по вопросам юридической помощи') === 0) {
          next.remove();
        }
      }
      if (p.textContent.indexOf('По вопросам обработки персональных данных: lawyersburo@gmail.com') === 0) {
        p.innerHTML = 'По вопросам обработки персональных данных: advokat-ion@mail.ru, +7 912 634-61-65.';
      }
      if (p.textContent.indexOf('Данные из нативных форм сайта передаются средствами платформы Tilda') === 0 &&
          !document.querySelector('.iv-cdn-disclosure')) {
        var note = document.createElement('p');
        note.className = 'iv-cdn-disclosure';
        note.innerHTML = 'Список публикаций на странице /publikacii дополнительно загружает вспомогательный ' +
          'скрипт отображения карточек с внешнего сервиса jsDelivr (CDN, технически связан с GitHub). ' +
          'Этот сервис отдаёт только статический файл кода и не получает, не обрабатывает и не хранит ' +
          'персональные данные посетителей сайта.';
        p.parentNode.insertBefore(note, p.nextSibling);
      }
    }
  }

  // на всех страницах: чекбокс согласия в форме — ссылка на отдельную страницу «Согласие»
  var links = document.querySelectorAll('label.consent a[href="/privacy"]');
  for (var j = 0; j < links.length; j++) {
    var span = links[j].closest('span') || links[j].parentElement;
    if (span) {
      span.innerHTML = 'Даю согласие на обработку персональных данных на условиях, изложенных в ' +
        '<a href="/soglasie" target="_blank" rel="noreferrer">Согласии на обработку персональных данных</a> и ' +
        '<a href="/privacy" target="_blank" rel="noreferrer">Политике обработки персональных данных</a>.';
    }
  }

  // главная: убираем из блока отзывов конкретный псевдоним и текст отзыва,
  // оставляем только сводный рейтинг — публикация чужого текста требует отдельного согласия автора
  var feed = document.querySelector('.review-feed');
  if (feed) {
    var author = feed.querySelector('.review-author');
    if (author) {
      var quote = author.nextElementSibling;
      if (quote && quote.tagName === 'P') quote.remove();
      author.remove();
      var b = feed.querySelector('b');
      if (b) {
        var countNote = document.createElement('p');
        countNote.textContent = '188 оценок, 157+ отзывов клиентов';
        b.parentNode.insertBefore(countNote, b.nextSibling);
      }
    }
  }

  // на всех страницах статей: чиним разметку Article — mainEntityOfPage, publisher.url, author.url
  var ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (var k = 0; k < ldScripts.length; k++) {
    var s = ldScripts[k];
    try {
      var data = JSON.parse(s.textContent);
      if (data && data['@type'] === 'Article') {
        var canonicalEl = document.querySelector('link[rel="canonical"]');
        var fullUrl = canonicalEl ? canonicalEl.href : location.href;
        data.mainEntityOfPage = fullUrl;
        data.url = fullUrl;
        if (data.publisher && typeof data.publisher === 'object') {
          data.publisher.url = 'https://xn-----6kcabhcpormaugc7bk8ee2l.xn--p1ai/';
        }
        if (data.author && typeof data.author === 'object' && data.author.url &&
            data.author.url.charAt(0) === '/') {
          data.author.url = 'https://xn-----6kcabhcpormaugc7bk8ee2l.xn--p1ai' + data.author.url;
        }
        s.textContent = JSON.stringify(data);
      }
    } catch (e) {}
  }
})();

// ---- главная: обогащение LegalService (рейтинг, ссылки на профили, фото) ----
(function(){
  if (location.pathname !== '/') return;
  var scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (var i = 0; i < scripts.length; i++) {
    var s = scripts[i];
    try {
      var data = JSON.parse(s.textContent);
      if (data && data['@type'] === 'LegalService') {
        data.url = 'https://xn-----6kcabhcpormaugc7bk8ee2l.xn--p1ai/';
        data.image = 'https://static.tildacdn.com/tild6334-6537-4237-b731-383663353435/ivannikova-dsc-5276.jpg';
        data.sameAs = [
          'https://yandex.ru/maps/org/advokatskoye_byuro_zashchitnik/210516705456/',
          'https://2gis.ru/ekaterinburg/firm/70000001059777135'
        ];
        data.aggregateRating = {
          '@type': 'AggregateRating',
          'ratingValue': '5.0',
          'reviewCount': '188'
        };
        s.textContent = JSON.stringify(data);
      }
    } catch (e) {}
  }
})();
