(function(){
  if (!/\/publikacii(\/|$)/.test(location.pathname)) return;
  var box = document.querySelector('.publication-list');
  if (!box) return;
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
    var html = items.map(function(it){
      var path;
      try { path = new URL(it.link).pathname; } catch(e){ path = it.link; }
      var d = it.date, dateStr = (isNaN(d) ? '' : (d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()));
      return '<article><img src="' + IMG + '" alt="" width="800" height="1067" loading="lazy" decoding="async">' +
        '<div><span>' + dateStr + '</span><h2><a href="' + path + '">' + esc(it.title) + '</a></h2>' +
        '<p>' + esc(it.desc) + '</p><a href="' + path + '" class="read-more">Читать статью →</a></div></article>';
    }).join('');
    if (html) box.innerHTML = html;
  }).catch(function(){});
})();
