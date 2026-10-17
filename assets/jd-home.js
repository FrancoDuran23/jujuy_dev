/* Home de jujuy.dev.ar: mosaico del hero y Tren Solar de la comunidad.
   Diseño: ver la guía en assets/brand/DISENO.md. Rutas relativas a la home a propósito,
   así index.html sigue abriendo con doble click. */

/* ---------- HeroMosaic: tres filas de fotos de eventos a color ---------- */
(function () {
  var B = 'assets/fotos/';
  var IMG = {
    pitch: B + 'evento-pitch-llama.webp',
    salua: B + 'evento-salua-equipo.webp',
    charla: B + 'evento-charla-superteam.webp',
    mentor: B + 'evento-mentor-superteam.webp',
    celu: B + 'evento-hackaton-celular.webp',
    mentoria: B + 'evento-mentoria-laptop.webp',
    mural: B + 'evento-hackaton-mural.webp',
    mate: B + 'evento-mate-y-codigo.webp',
    noche: B + 'evento-coworking-noche.webp',
    cerros: B + 'evento-grupal-cerros.webp',
    pizza: B + 'evento-pizza.webp',
    grupal: B + 'evento-grupal-superteam.webp',
    auditorio: B + 'evento-charla-auditorio.webp',
    selfie: B + 'evento-selfie-auditorio.webp'
  };
  // Each tile: [size, url, object-position, label?]. Only photos, so the rows never show gaps; repeat photos freely.
  var rows = [
    [['l', IMG.grupal, '50% 45%', 'Superteam ARG'], ['m', IMG.mate, '60% 55%'], ['m', IMG.charla, '55% 35%'], ['l', IMG.cerros, '50% 75%', '+600 devs'], ['m', IMG.pizza, '45% 55%'], ['m', IMG.mentor, '55% 30%'], ['l', IMG.selfie, '50% 40%'], ['m', IMG.celu, '50% 45%'], ['m', IMG.salua, '50% 70%']],
    [['l', IMG.auditorio, '40% 50%', 'Charlas'], ['m', IMG.mentoria, '45% 40%'], ['l', IMG.salua, '50% 75%', 'Demo day'], ['m', IMG.celu, '50% 45%'], ['m', IMG.noche, '50% 55%'], ['l', IMG.grupal, '60% 60%'], ['m', IMG.mural, '45% 55%'], ['m', IMG.pitch, '55% 70%'], ['m', IMG.mate, '40% 50%']],
    [['l', IMG.selfie, '50% 40%', 'Meetups'], ['m', IMG.mural, '45% 55%'], ['m', IMG.pitch, '55% 70%', 'Pitch'], ['m', IMG.mentor, '55% 30%'], ['l', IMG.cerros, '50% 40%'], ['m', IMG.charla, '50% 40%'], ['l', IMG.noche, '50% 55%'], ['m', IMG.pizza, '50% 55%'], ['m', IMG.auditorio, '60% 50%']]
  ];
  function tile(t) {
    var el = document.createElement('figure');
    el.className = 'jd-tile jd-tile--' + t[0];
    el.innerHTML = '<img alt="" decoding="async" src="' + t[1] + '" style="object-position:' + t[2] + '">' +
      (t[3] ? '<figcaption><span class="jd-tag jd-tag--solid">' + t[3] + '</span></figcaption>' : '');
    return el;
  }
  document.querySelectorAll('[data-jd-mosaic]').forEach(function (m) {
    rows.forEach(function (r) {
      var row = document.createElement('div'); row.className = 'jd-mosaic__row';
      // two copies so translateX(-50%) loops seamlessly
      for (var k = 0; k < 2; k++) r.forEach(function (t) { row.appendChild(tile(t)); });
      m.appendChild(row);
    });
  });
})();

/* ---------- MembersTrain: la comunidad viaja en el Tren Solar ---------- */
(function () {
  var CAR_W = 560, CAR_H = 232, GAP = 16, NOSE_W = 300;
  var ORANGE = '#ef6a1f', RED = '#d4231c', SILVER = '#f3f4f6', ROOF = '#d6d9df', BAND = '#1f2329', INK = '#16171c';

  function faceSVG(face, x, y, s) {
    return '<image href="' + face.src + '" x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" preserveAspectRatio="xMidYMid slice"/>';
  }

  function ridge(x0, x1, base, seed) {
    // the red "cerros" line on the lower band: a jagged mountain profile
    var pts = [], n = 7, w = (x1 - x0) / n, rnd = seed;
    function rand() { rnd = (rnd * 9301 + 49297) % 233280; return rnd / 233280; }
    pts.push(x0 + ',' + (base + 12));
    for (var i = 0; i < n; i++) {
      var px = x0 + w * (i + 0.5), py = base - 10 - rand() * 18;
      pts.push((px - w * 0.18) + ',' + (py + 8), px + ',' + py, (px + w * 0.22) + ',' + (py + 10), (x0 + w * (i + 1)) + ',' + (base + 4 + rand() * 8));
    }
    return pts;
  }

  function window_(id, x, y, w, h, face) {
    var s = '<clipPath id="' + id + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10"/></clipPath>';
    s += '<g clip-path="url(#' + id + ')"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#2a2f38"/>';
    // red seat backs, like the real train
    [0.18, 0.62].forEach(function (p) { s += '<rect x="' + (x + w * p) + '" y="' + (y + h * 0.42) + '" width="' + (w * 0.2) + '" height="' + (h * 0.62) + '" rx="8" fill="#a8323a"/>'; });
    if (face) {
      var fs = h - 14, fx = x + (w - fs) / 2 + (face.off || 0), fy = y + 7, r = fs / 2;
      s += '<clipPath id="' + id + 'f"><circle cx="' + (fx + r) + '" cy="' + (fy + r) + '" r="' + r + '"/></clipPath>';
      s += '<g clip-path="url(#' + id + 'f)">' + faceSVG(face, fx, fy, fs) + '</g>';
    }
    // glass: soft cool tint + diagonal reflection
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#9fc6ff" opacity=".08"/>';
    s += '<path d="M ' + (x + w * 0.55) + ' ' + y + ' L ' + (x + w * 0.75) + ' ' + y + ' L ' + (x + w * 0.45) + ' ' + (y + h) + ' L ' + (x + w * 0.25) + ' ' + (y + h) + ' Z" fill="#fff" opacity=".12"/>';
    s += '</g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="none" stroke="#0c0d10" stroke-width="3"/>';
    return s;
  }

  function wheels(x) {
    var s = '<g><rect x="' + (x - 54) + '" y="196" width="108" height="16" rx="5" fill="#3b3f47"/>';
    [x - 30, x + 30].forEach(function (cx) {
      s += '<g class="jd-train__wheel" style="transform-origin:' + cx + 'px 214px"><circle cx="' + cx + '" cy="214" r="16" fill="' + INK + '"/>' +
        '<circle cx="' + cx + '" cy="214" r="9" fill="#5b616c"/><rect x="' + (cx - 1.5) + '" y="200" width="3" height="28" fill="' + INK + '"/></g>';
    });
    return s + '</g>';
  }

  function car(ix, faces, label) {
    var s = '<g transform="translate(' + ix * (CAR_W + GAP) + ' 0)">';
    s += '<rect x="0" y="4" width="' + CAR_W + '" height="24" rx="10" fill="' + ROOF + '"/>';
    for (var v = 0; v < 4; v++) s += '<rect x="' + (40 + v * 130) + '" y="9" width="70" height="12" rx="3" fill="#b9bdc6"/>';
    s += '<rect x="0" y="22" width="' + CAR_W + '" height="172" rx="8" fill="' + SILVER + '"/>';
    s += '<rect x="0" y="52" width="' + CAR_W + '" height="98" fill="' + BAND + '"/>';
    s += '<rect x="18" y="58" width="34" height="132" rx="4" fill="#2a2f38" stroke="#0c0d10" stroke-width="2"/>';
    var pr = ridge(0, CAR_W, 160, 17 + ix * 31);
    s += '<polygon points="' + pr.join(' ') + ' ' + CAR_W + ',194 0,194" fill="' + ORANGE + '"/>';
    s += '<polyline points="' + pr.join(' ') + '" fill="none" stroke="' + RED + '" stroke-width="5" stroke-linejoin="round"/>';
    s += '<rect x="18" y="58" width="34" height="132" rx="4" fill="none" stroke="#0c0d10" stroke-width="2"/>';
    // 3 people per car, one per window; an empty window is a seat waiting for the next PR
    [[70, 152], [236, 152], [402, 140]].forEach(function (p, i) { s += window_('jdtw' + ix + '-' + i, p[0], 62, p[1], 78, faces[i]); });
    s += '<text x="64" y="186" font-family="Space Mono, monospace" font-weight="700" font-size="13" fill="#fff">' + label + '</text>';
    s += '<rect x="0" y="190" width="' + CAR_W + '" height="8" fill="#2b2e35"/>';
    s += wheels(110) + wheels(CAR_W - 110);
    s += '</g>';
    s += '<rect x="' + ((ix + 1) * (CAR_W + GAP) - GAP) + '" y="70" width="' + GAP + '" height="120" fill="#2b2e35"/>';
    return s;
  }

  function nose(x) {
    var s = '<g transform="translate(' + x + ' 0)">';
    s += '<path d="M 0 4 L 150 4 C 196 4 226 18 252 56 L 292 132 C 300 148 302 168 300 194 L 0 194 Z" fill="' + SILVER + '"/>';
    s += '<path d="M 0 4 L 150 4 C 180 4 200 10 214 24 L 0 24 Z" fill="' + ROOF + '"/>';
    s += '<rect x="0" y="52" width="160" height="98" fill="' + BAND + '"/>';
    s += '<path d="M 140 52 L 236 52 C 256 52 268 64 278 86 L 290 120 C 294 134 286 150 270 150 L 140 150 Z" fill="' + BAND + '"/>';
    s += '<path d="M 150 64 L 228 64 C 244 64 252 74 258 90 L 266 112 C 270 124 264 134 250 134 L 150 134 Z" fill="#2f3540"/>';
    s += '<path d="M 200 64 L 228 64 L 196 134 L 170 134 Z" fill="#fff" opacity=".1"/>';
    s += '<path d="M 0 172 L 70 150 L 96 162 L 128 140 L 160 158 L 300 176 L 300 194 L 0 194 Z" fill="' + ORANGE + '"/>';
    s += '<path d="M 0 172 L 70 150 L 96 162 L 128 140 L 160 158 L 300 176" fill="none" stroke="' + RED + '" stroke-width="5" stroke-linejoin="round"/>';
    s += '<path d="M 230 194 L 300 194 L 300 168 Z" fill="' + RED + '"/>';
    s += '<rect x="276" y="160" width="16" height="7" rx="3" fill="#fff6d6"/>';
    s += '<rect x="0" y="190" width="300" height="8" fill="#2b2e35"/>';
    s += wheels(150);
    return s + '</g>';
  }

  // Quebrada hills: three layers, the middle one with colored strata (Cerro de los Siete Colores).
  function hills(w, h) {
    var s = '<svg class="jd-train__hills" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>' +
      '<clipPath id="jdt-mid"><path d="M 0 ' + (h * .62) + ' L ' + (w * .12) + ' ' + (h * .38) + ' L ' + (w * .2) + ' ' + (h * .45) + ' L ' + (w * .33) + ' ' + (h * .2) + ' L ' + (w * .46) + ' ' + (h * .42) + ' L ' + (w * .58) + ' ' + (h * .3) + ' L ' + (w * .72) + ' ' + (h * .5) + ' L ' + (w * .84) + ' ' + (h * .26) + ' L ' + w + ' ' + (h * .46) + ' L ' + w + ' ' + h + ' L 0 ' + h + ' Z"/></clipPath></defs>';
    s += '<path class="h-back" d="M 0 ' + (h * .5) + ' L ' + (w * .1) + ' ' + (h * .3) + ' L ' + (w * .24) + ' ' + (h * .4) + ' L ' + (w * .4) + ' ' + (h * .12) + ' L ' + (w * .55) + ' ' + (h * .34) + ' L ' + (w * .68) + ' ' + (h * .18) + ' L ' + (w * .82) + ' ' + (h * .36) + ' L ' + (w * .93) + ' ' + (h * .16) + ' L ' + w + ' ' + (h * .3) + ' L ' + w + ' ' + h + ' L 0 ' + h + ' Z"/>';
    s += '<g clip-path="url(#jdt-mid)">';
    var bands = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'], y = h * .18;
    for (var i = 0; i < 14; i++) {
      var b = bands[i % 7], t = 26 + (i % 3) * 8, a = 10 + (i % 4) * 6;
      s += '<path class="' + b + '" d="M 0 ' + (y + a) + ' C ' + (w * .25) + ' ' + (y - a) + ' ' + (w * .5) + ' ' + (y + a * 1.5) + ' ' + (w * .75) + ' ' + (y - a * .5) + ' S ' + w + ' ' + (y + a) + ' ' + w + ' ' + y + ' L ' + w + ' ' + (y + t + 40) + ' L 0 ' + (y + t + 40) + ' Z"/>';
      y += t;
    }
    s += '</g>';
    s += '<path class="h-front" d="M 0 ' + (h * .8) + ' C ' + (w * .2) + ' ' + (h * .72) + ' ' + (w * .35) + ' ' + (h * .84) + ' ' + (w * .55) + ' ' + (h * .76) + ' S ' + (w * .85) + ' ' + (h * .74) + ' ' + w + ' ' + (h * .8) + ' L ' + w + ' ' + h + ' L 0 ' + h + ' Z"/>';
    // cardones
    [[.08, .78], [.27, .8], [.64, .77], [.9, .79]].forEach(function (c) {
      var cx = w * c[0], cy = h * c[1];
      s += '<path class="cardon" d="M ' + (cx - 5) + ' ' + cy + ' L ' + (cx - 5) + ' ' + (cy - 46) + ' Q ' + cx + ' ' + (cy - 54) + ' ' + (cx + 5) + ' ' + (cy - 46) + ' L ' + (cx + 5) + ' ' + cy + ' Z M ' + (cx - 5) + ' ' + (cy - 20) + ' L ' + (cx - 16) + ' ' + (cy - 20) + ' L ' + (cx - 16) + ' ' + (cy - 34) + ' Q ' + (cx - 12) + ' ' + (cy - 40) + ' ' + (cx - 9) + ' ' + (cy - 34) + ' L ' + (cx - 9) + ' ' + (cy - 26) + ' L ' + (cx - 5) + ' ' + (cy - 26) + ' Z M ' + (cx + 5) + ' ' + (cy - 28) + ' L ' + (cx + 14) + ' ' + (cy - 28) + ' L ' + (cx + 14) + ' ' + (cy - 40) + ' Q ' + (cx + 17) + ' ' + (cy - 45) + ' ' + (cx + 20) + ' ' + (cy - 40) + ' L ' + (cx + 20) + ' ' + (cy - 22) + ' L ' + (cx + 5) + ' ' + (cy - 22) + ' Z"/>';
    });
    return s + '</svg>';
  }

  // members: [{src}], one per window. Windows left over stay empty.
  function build(root, members) {
    var cars = Math.max(2, Math.ceil((members.length + 1) / 3)), total = cars * (CAR_W + GAP) + NOSE_W;
    var svg = '<svg class="jd-train__svg" viewBox="0 0 ' + total + ' ' + CAR_H + '" width="' + total + '" height="' + CAR_H + '" aria-hidden="true">';
    for (var c = 0, m = 0; c < cars; c++) {
      var faces = [];
      for (var k = 0; k < 3; k++, m++) { var f = members[m]; if (f) f.off = ((m * 13) % 21) - 10; faces.push(f); }
      svg += car(c, faces, 'VAGÓN ' + ('0' + (cars - c)).slice(-2));
    }
    svg += nose(cars * (CAR_W + GAP)) + '</svg>';
    root.querySelector('[data-jd-hills]').innerHTML = hills(1600, 420);
    root.querySelector('[data-jd-train]').innerHTML = svg;
  }

  /* Passengers: the inline JSON block the train points at (data-src="#id"), one entry per person
     with a photo in assets/people/. Newest first, and only MAX of them so the train stays short. */
  var MAX = 45;

  function seedMembers(src) {
    var data = { miembros: [] };
    try { data = JSON.parse(document.querySelector(src).textContent); } catch (e) {}
    return Promise.resolve(data)
      .then(function (data) {
        return (data.miembros || []).filter(function (m) { return m && /^assets\/people\/[\w.-]+\.webp$/.test(m.avatar || ''); })
          .reverse().slice(0, MAX).map(function (m) { return { src: m.avatar }; });
      });
  }

  function mount(root) {
    var mover = root.querySelector('[data-jd-train]'), anim = null;
    function run() {
      var W = mover.getBoundingClientRect().width, S = root.clientWidth, speed = 120;
      if (anim) anim.cancel();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || !mover.animate) { mover.style.transform = 'translateX(' + (S * 0.95 - W) + 'px)'; return; }
      anim = mover.animate([{ transform: 'translateX(' + (-W) + 'px)' }, { transform: 'translateX(' + S + 'px)' }], { duration: (W + S) / speed * 1000, iterations: Infinity });
      anim.currentTime = ((S * 0.9) / (W + S)) * anim.effect.getTiming().duration; // empieza con la trompa ya en escena
    }
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(run, 200); });
    seedMembers(root.getAttribute('data-src')).then(function (members) { build(root, members); run(); });
  }

  document.querySelectorAll('[data-jd-train-root]').forEach(mount);
})();

/* ---------- Colaboradores: carrusel continuo (una copia más para el loop) ---------- */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.jd-logos__track').forEach(function (track) {
    var set = track.querySelector('.jd-logos__set');
    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach(function (a) { a.setAttribute('tabindex', '-1'); });
    track.appendChild(clone);
  });
})();
