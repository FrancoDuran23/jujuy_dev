/* ==========================================================================
   filtros.js
   Buscador + filtros para los listados del sitio (proyectos, oportunidades,
   recursos) y pestañas simples. Sin dependencias, sin build.

   Cómo funciona
   -------------
   Un listado es un contenedor con `data-listing`:

     <div data-listing
          data-facets="tech:Tecnología,tema:Temática"
          data-noun="proyecto|proyectos">
       <div class="grid grid-3" data-items>
         <article class="card item" data-item> ... </article>
       </div>
     </div>

   - `data-facets` lista los filtros: `clave:Etiqueta`, separados por coma.
   - Dentro de cada tarjeta, el valor de cada filtro se lee del contenido
     visible marcado con `data-facet="clave"`. Si el elemento es una lista
     (`<ul>`), cada `<li>` es un valor. Así hay una sola fuente de verdad y
     la página se lee igual sin JavaScript.
   - `data-order` (opcional) fija el orden de las opciones de un filtro:
     `nivel=Junior|Semi Senior|Senior;modalidad=Remoto|Híbrido`.
     Lo que no figure se ordena por cantidad de resultados.
   - `data-prefix` (opcional) evita choques en la URL cuando hay más de un
     listado en la misma página.
   - Una tarjeta con `data-cierre="AAAA-MM-DD"` se oculta sola cuando pasa
     esa fecha (se puede volver a mostrar con "Mostrar cerradas").

   Con JavaScript, el listado se arma así: buscador arriba a todo el ancho y
   debajo dos columnas (filtros en acordeones a la izquierda, resultados a la
   derecha). En pantallas chicas los filtros quedan detrás de "Filtros (N)".
   Sin JavaScript, la página es una lista de tarjetas.

   Los filtros se guardan en la URL (?q=react&tech=React), así se puede
   compartir una búsqueda por WhatsApp.
   ========================================================================== */
(function () {
  'use strict';

  var VISIBLE_CHIPS = 10;

  function norm(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function parseFacets(raw) {
    return (raw || '')
      .split(',')
      .map(function (part) {
        var bits = part.split(':');
        return { key: bits[0].trim(), label: (bits[1] || bits[0]).trim() };
      })
      .filter(function (f) { return f.key; });
  }

  function parseOrder(raw) {
    var out = {};
    (raw || '').split(';').forEach(function (chunk) {
      var bits = chunk.split('=');
      if (bits.length < 2) return;
      out[bits[0].trim()] = bits[1].split('|').map(norm);
    });
    return out;
  }

  function searchIcon() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('aria-hidden', 'true');
    var c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', '11');
    c.setAttribute('cy', '11');
    c.setAttribute('r', '7');
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', 'm20 20-3.5-3.5');
    svg.appendChild(c);
    svg.appendChild(p);
    return svg;
  }

  function initListing(root, uid) {
    var list = root.querySelector('[data-items]');
    if (!list) return;

    var items = Array.prototype.filter.call(list.children, function (n) {
      return n.hasAttribute('data-item');
    });
    var facets = parseFacets(root.getAttribute('data-facets'));
    var order = parseOrder(root.getAttribute('data-order'));
    var nouns = (root.getAttribute('data-noun') || 'resultado|resultados').split('|');
    var prefix = root.getAttribute('data-prefix') ? root.getAttribute('data-prefix') + '-' : '';
    var today = todayISO();

    /* ---- Leer los datos de cada tarjeta desde su contenido visible ---- */
    items.forEach(function (item) {
      item._facets = {};
      facets.forEach(function (f) {
        var values = [];
        var seen = {};
        Array.prototype.forEach.call(item.querySelectorAll('[data-facet="' + f.key + '"]'), function (node) {
          var parts = /^(UL|OL)$/.test(node.tagName) ? node.querySelectorAll('li') : [node];
          Array.prototype.forEach.call(parts, function (p) {
            var label = p.textContent.replace(/\s+/g, ' ').trim();
            var n = norm(label);
            if (label && !seen[n]) {
              seen[n] = true;
              values.push({ n: n, label: label });
            }
          });
        });
        item._facets[f.key] = values;
      });
      item._text = norm(item.textContent);
      var cierre = item.getAttribute('data-cierre');
      item._closed = !!cierre && cierre < today;
      if (item._closed) item.classList.add('is-closed');
    });

    var closedCount = items.filter(function (i) { return i._closed; }).length;

    /* ---- Estado ---- */
    var state = { q: '', sel: {}, showClosed: false };
    facets.forEach(function (f) { state.sel[f.key] = {}; });

    /* ---- Opciones de cada filtro ---- */
    var options = {};
    facets.forEach(function (f) {
      var map = {};
      items.forEach(function (item) {
        item._facets[f.key].forEach(function (v) {
          if (!map[v.n]) map[v.n] = { n: v.n, label: v.label, total: 0 };
          map[v.n].total += 1;
        });
      });
      var fixed = order[f.key] || [];
      options[f.key] = Object.keys(map)
        .map(function (k) { return map[k]; })
        .sort(function (a, b) {
          var ia = fixed.indexOf(a.n);
          var ib = fixed.indexOf(b.n);
          if (ia !== -1 || ib !== -1) {
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
          }
          return b.total - a.total || a.label.localeCompare(b.label, 'es');
        });
    });

    /* ---- Interfaz ----
       Arriba: buscador a todo el ancho. Debajo, en escritorio, dos columnas:
       filtros (acordeones, sticky) a la izquierda y resultados a la derecha.
       En pantallas chicas los filtros quedan detrás del botón "Filtros (N)". */
    var panelId = 'filtros-' + uid;

    var top = make('div', 'listing-top');
    top.setAttribute('role', 'search');

    var searchLabel = make('label', 'search');
    searchLabel.appendChild(make('span', 'sr-only', 'Buscar'));
    searchLabel.appendChild(searchIcon());
    var input = make('input');
    input.type = 'search';
    input.id = 'buscar-' + uid;
    input.placeholder = root.getAttribute('data-placeholder') || 'Buscar…';
    input.setAttribute('autocomplete', 'off');
    searchLabel.appendChild(input);
    top.appendChild(searchLabel);

    var openBtn = make('button', 'btn btn-ghost btn-sm filters-open');
    openBtn.type = 'button';
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.setAttribute('aria-controls', panelId);
    top.appendChild(openBtn);

    var closedToggle = null;
    var tl = null;
    if (closedCount) {
      tl = make('label', 'toggle');
      closedToggle = make('input');
      closedToggle.type = 'checkbox';
      tl.appendChild(closedToggle);
      tl.appendChild(make('span', null, 'Mostrar cerradas (' + closedCount + ')'));
    }

    var body = make('div', 'listing-body');
    var panel = make('div', 'filters-panel');
    panel.id = panelId;
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'Filtros');
    panel.appendChild(make('p', 'filters-title', 'Filtros'));

    var groupsWrap = make('div', 'filters-groups');
    var chipRefs = {};
    var groupRefs = {};
    facets.forEach(function (f) {
      if (!options[f.key].length) return;
      var group = make('div', 'filter-group');
      var bodyId = panelId + '-' + f.key;

      var toggle = make('button', 'filter-toggle');
      toggle.type = 'button';
      toggle.id = bodyId + '-btn';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', bodyId);
      toggle.appendChild(make('span', 'filter-name', f.label));
      var badge = make('span', 'filter-badge');
      badge.hidden = true;
      var badgeNum = make('span', null, '0');
      badgeNum.setAttribute('aria-hidden', 'true');
      badge.appendChild(badgeNum);
      badge.appendChild(make('span', 'sr-only', ' elegidas'));
      toggle.appendChild(badge);
      toggle.appendChild(make('span', 'filter-chevron'));
      group.appendChild(toggle);

      var content = make('div', 'filter-body');
      content.id = bodyId;
      content.setAttribute('role', 'group');
      content.setAttribute('aria-labelledby', toggle.id);
      content.hidden = true;
      var chips = make('div', 'chips');
      chipRefs[f.key] = [];

      options[f.key].forEach(function (opt, idx) {
        var chip = make('button', 'chip');
        chip.type = 'button';
        chip.setAttribute('aria-pressed', 'false');
        chip.appendChild(document.createTextNode(opt.label));
        var n = make('span', 'n', String(opt.total));
        chip.appendChild(n);
        if (idx >= VISIBLE_CHIPS) chip.classList.add('is-extra');
        chip._opt = opt;
        chip._count = n;
        chip._key = f.key;
        chips.appendChild(chip);
        chipRefs[f.key].push(chip);
      });
      content.appendChild(chips);

      if (options[f.key].length > VISIBLE_CHIPS) {
        var more = make('button', 'chips-more');
        more.type = 'button';
        more.setAttribute('aria-expanded', 'false');
        more._extra = options[f.key].length - VISIBLE_CHIPS;
        more.textContent = 'Ver ' + more._extra + ' más';
        more.addEventListener('click', function () {
          var open = group.classList.toggle('expanded');
          more.setAttribute('aria-expanded', String(open));
          more.textContent = open ? 'Ver menos' : 'Ver ' + more._extra + ' más';
        });
        content.appendChild(more);
      }
      group.appendChild(content);
      groupsWrap.appendChild(group);

      groupRefs[f.key] = { group: group, toggle: toggle, body: content, badge: badge, badgeNum: badgeNum };
      toggle.addEventListener('click', function () {
        setOpen(f.key, toggle.getAttribute('aria-expanded') !== 'true');
      });
    });
    panel.appendChild(groupsWrap);

    var done = make('button', 'btn btn-primary btn-sm filters-done');
    done.type = 'button';
    panel.appendChild(done);

    var main = make('div', 'listing-main');
    var status = make('div', 'listing-status');
    var count = make('p', 'filters-count');
    count.setAttribute('role', 'status');
    count.setAttribute('aria-live', 'polite');
    status.appendChild(count);
    var actions = make('div', 'listing-actions');
    if (tl) actions.appendChild(tl);
    var clear = make('button', 'btn btn-ghost btn-sm filters-clear', 'Limpiar filtros');
    clear.type = 'button';
    clear.hidden = true;
    actions.appendChild(clear);
    status.appendChild(actions);
    main.appendChild(status);

    root.insertBefore(top, list);
    root.insertBefore(body, list);
    body.appendChild(panel);
    body.appendChild(main);
    main.appendChild(list);
    root.classList.add('listing', 'is-enhanced');

    var empty = make('p', 'listing-empty');
    empty.hidden = true;
    empty.textContent = 'No encontramos nada con esa búsqueda. Probá con otras palabras o limpiá los filtros.';
    main.appendChild(empty);

    function setOpen(key, open) {
      var g = groupRefs[key];
      if (!g) return;
      g.toggle.setAttribute('aria-expanded', String(open));
      g.body.hidden = !open;
      g.group.classList.toggle('is-open', open);
    }

    function setPanel(open) {
      root.classList.toggle('is-filters-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
    }

    /* ---- Lógica de filtrado ---- */
    function hasSelection(key) {
      return Object.keys(state.sel[key]).length > 0;
    }

    function matches(item, ignoreKey) {
      if (item._closed && !state.showClosed) return false;
      var tokens = norm(state.q).split(' ').filter(Boolean);
      for (var t = 0; t < tokens.length; t++) {
        if (item._text.indexOf(tokens[t]) === -1) return false;
      }
      for (var i = 0; i < facets.length; i++) {
        var key = facets[i].key;
        if (key === ignoreKey || !hasSelection(key)) continue;
        var ok = item._facets[key].some(function (v) { return state.sel[key][v.n]; });
        if (!ok) return false;
      }
      return true;
    }

    function selectedCount(key) {
      return Object.keys(state.sel[key]).length;
    }

    function activeFilters() {
      var n = state.q.trim() ? 1 : 0;
      facets.forEach(function (f) { n += selectedCount(f.key); });
      return n;
    }

    function render() {
      var shown = 0;
      var pool = 0;
      items.forEach(function (item) {
        var ok = matches(item, null);
        item.hidden = !ok;
        if (ok) shown += 1;
        if (!item._closed || state.showClosed) pool += 1;
      });

      facets.forEach(function (f) {
        (chipRefs[f.key] || []).forEach(function (chip) {
          var selected = !!state.sel[f.key][chip._opt.n];
          var n = items.filter(function (item) {
            return matches(item, f.key) && item._facets[f.key].some(function (v) { return v.n === chip._opt.n; });
          }).length;
          chip._count.textContent = String(n);
          chip.setAttribute('aria-pressed', String(selected));
          var isEmpty = n === 0 && !selected;
          chip.classList.toggle('is-empty', isEmpty);
          chip.setAttribute('aria-disabled', String(isEmpty));
          // Una opción elegida nunca queda escondida detrás de "Ver más".
          if (selected) groupRefs[f.key].group.classList.add('expanded');
        });
        var g = groupRefs[f.key];
        if (g) {
          var picked = selectedCount(f.key);
          g.badge.hidden = picked === 0;
          g.badgeNum.textContent = String(picked);
        }
      });

      var chosen = 0;
      facets.forEach(function (f) { chosen += selectedCount(f.key); });
      openBtn.textContent = 'Filtros (' + chosen + ')';
      done.textContent = shown === 1 ? 'Ver 1 resultado' : 'Ver ' + shown + ' resultados';

      // "Mostrando 1 de 4 proyectos": el sustantivo concuerda con el total, no con lo mostrado.
      var noun = pool === 1 ? nouns[0] : nouns[1] || nouns[0];
      count.textContent = shown === pool
        ? pool + ' ' + noun
        : 'Mostrando ' + shown + ' de ' + pool + ' ' + noun;
      empty.hidden = shown !== 0;
      clear.hidden = activeFilters() === 0;
    }

    /* ---- URL ---- */
    function writeURL() {
      try {
        var params = new URLSearchParams(window.location.search);
        params.delete(prefix + 'q');
        params.delete(prefix + 'cerradas');
        facets.forEach(function (f) { params.delete(prefix + f.key); });
        if (state.q.trim()) params.set(prefix + 'q', state.q.trim());
        if (state.showClosed) params.set(prefix + 'cerradas', '1');
        facets.forEach(function (f) {
          var labels = options[f.key]
            .filter(function (o) { return state.sel[f.key][o.n]; })
            .map(function (o) { return o.label; });
          if (labels.length) params.set(prefix + f.key, labels.join('|'));
        });
        var qs = params.toString();
        history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
      } catch (e) { /* abierto como archivo: no pasa nada */ }
    }

    function readURL() {
      try {
        var params = new URLSearchParams(window.location.search);
        var q = params.get(prefix + 'q');
        if (q) { state.q = q; input.value = q; }
        if (closedToggle && params.get(prefix + 'cerradas') === '1') {
          state.showClosed = true;
          closedToggle.checked = true;
        }
        facets.forEach(function (f) {
          var raw = params.get(prefix + f.key);
          if (!raw) return;
          raw.split('|').map(norm).forEach(function (n) {
            var known = options[f.key].some(function (o) { return o.n === n; });
            if (known) state.sel[f.key][n] = true;
          });
        });
      } catch (e) { /* ignorar */ }
    }

    /* ---- Eventos ---- */
    var typing = null;
    input.addEventListener('input', function () {
      state.q = input.value;
      render();
      clearTimeout(typing);
      typing = setTimeout(writeURL, 250);
    });

    // Enter en el buscador no debe enviar nada ni recargar.
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') e.preventDefault();
    });

    groupsWrap.addEventListener('click', function (e) {
      var chip = e.target.closest ? e.target.closest('.chip') : null;
      if (!chip || !chip._opt) return;
      var sel = state.sel[chip._key];
      if (chip.classList.contains('is-empty')) return;
      if (sel[chip._opt.n]) delete sel[chip._opt.n];
      else sel[chip._opt.n] = true;
      render();
      writeURL();
    });

    if (closedToggle) {
      closedToggle.addEventListener('change', function () {
        state.showClosed = closedToggle.checked;
        render();
        writeURL();
      });
    }

    openBtn.addEventListener('click', function () {
      setPanel(!root.classList.contains('is-filters-open'));
    });

    done.addEventListener('click', function () {
      setPanel(false);
      openBtn.focus();
    });

    clear.addEventListener('click', function () {
      state.q = '';
      input.value = '';
      facets.forEach(function (f) { state.sel[f.key] = {}; });
      render();
      writeURL();
      input.focus();
    });

    readURL();
    // Todos los grupos arrancan cerrados, salvo los que ya tienen algo elegido.
    facets.forEach(function (f) { if (selectedCount(f.key)) setOpen(f.key, true); });
    render();
  }

  /* ---- Pestañas: enlaces ancla que, con JS, muestran un panel a la vez ---- */
  function initTabs(nav) {
    var tabs = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var panels = tabs.map(function (t) {
      return document.getElementById(t.getAttribute('href').slice(1));
    });
    if (!tabs.length || panels.indexOf(null) !== -1) return;

    nav.setAttribute('role', 'tablist');
    tabs.forEach(function (t, i) {
      t.setAttribute('role', 'tab');
      t.id = t.id || 'tab-' + panels[i].id;
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', t.id);
    });

    function activate(index, focus) {
      tabs.forEach(function (t, i) {
        var on = i === index;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        activate(i, false);
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search + '#' + panels[i].id);
        } catch (err) { /* ignorar */ }
      });
      t.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        activate(next, true);
      });
    });

    var fromHash = panels.findIndex(function (p) { return '#' + p.id === window.location.hash; });
    activate(fromHash === -1 ? 0 : fromHash, false);
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-listing]'), function (root, i) {
      initListing(root, i);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), initTabs);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
