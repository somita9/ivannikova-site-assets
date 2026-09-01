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
