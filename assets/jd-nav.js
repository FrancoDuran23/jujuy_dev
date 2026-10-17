/* Menú del sistema de diseño (.jd-nav) en pantallas chicas, y el año del footer.
   Lo cargan todas las páginas. */
(function () {
  document.querySelectorAll('.jd-nav').forEach(function (nav) {
    var toggle = nav.querySelector('.jd-nav__toggle');
    if (!toggle) return;
    function set(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Cerrar' : 'Menú';
    }
    toggle.addEventListener('click', function () { set(!nav.classList.contains('is-open')); });
    nav.querySelectorAll('.jd-nav__links a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  });
})();

(function () {
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* Abriendo el sitio con doble click (file://), un link a una carpeta («eventos/») muestra la
   carpeta en vez de la página: le sumamos index.html. En el sitio publicado no hace nada. */
(function () {
  if (location.protocol !== 'file:') return;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.defaultPrevented) return;
    var url = new URL(a.href);
    if (url.protocol !== 'file:' || !/\/$/.test(url.pathname)) return;
    e.preventDefault();
    url.pathname += 'index.html';
    location.href = url.href;
  });
})();
