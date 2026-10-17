/* Menú del sistema de diseño (.jd-nav) en pantallas chicas, botón de tema y el año del footer.
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

/* Tema: arranca con el del sistema (o el guardado, ver el <script> del <head>) y el botón lo
   cambia a mano. El rótulo dice a qué tema pasás. */
(function () {
  var root = document.documentElement;
  document.querySelectorAll('[data-jd-theme-toggle]').forEach(function (btn) {
    function label() {
      var dark = root.getAttribute('data-theme') === 'dark';
      btn.textContent = dark ? 'Día' : 'Noche';
      btn.setAttribute('aria-label', dark ? 'Pasar al tema claro' : 'Pasar al tema oscuro');
    }
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('jd-theme', next); } catch (e) {}
      document.querySelectorAll('[data-jd-theme-toggle]').forEach(function (b) { b.dispatchEvent(new Event('jd-theme')); });
    });
    btn.addEventListener('jd-theme', label);
    label();
  });
})();
