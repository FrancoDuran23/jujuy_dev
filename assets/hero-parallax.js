(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;

  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var nativeScroll = window.CSS &&
    CSS.supports('animation-timeline: view()') &&
    CSS.supports('animation-range: exit-crossing 0% exit-crossing 100%');
  // The Hornocal recedes while the two lateral frames rise at different speeds.
  // Each plane is a flattened WebP and only its compositor transform changes.
  var layers = Array.from(hero.querySelectorAll('.hero-terrain'));
  var stage = hero.querySelector('.hero-stage');
  var nav = document.querySelector('.nav');
  var frame = 0;
  var observer;
  var resizeObserver;
  var visible = true;
  var dirty = true;
  var geometry;
  var lastProgress = -1;
  var lastNavProgress = -1;

  // Cache the scene's geometry at setup/resize, outside the scroll path.
  function measure() {
    var bounds = hero.getBoundingClientRect();
    var stageHeight = stage.getBoundingClientRect().height;
    geometry = {
      top: bounds.top + window.scrollY,
      travel: Math.max(1, bounds.height - stageHeight),
      distances: layers.map(function (layer) {
        var style = getComputedStyle(layer);
        return {
          x: parseFloat(style.getPropertyValue('--drift-x')) || 0,
          y: (parseFloat(style.getPropertyValue('--depth')) || 0) * stageHeight,
          startY: (parseFloat(style.getPropertyValue('--start-y')) ||
            parseFloat(style.getPropertyValue('--entry-y')) || 0) * stageHeight,
          startScale: parseFloat(style.getPropertyValue('--start-scale')) || 1,
          endScale: parseFloat(style.getPropertyValue('--end-scale')) || 1
        };
      })
    };
    dirty = false;
    lastProgress = -1;
  }

  function render() {
    frame = 0;
    if (motion.matches || document.hidden) return;
    if (dirty) measure();
    var progress = Math.max(0, Math.min(1, (window.scrollY - geometry.top) / geometry.travel));
    if (progress === lastProgress) return;
    if (!nativeScroll) {
      layers.forEach(function (layer, index) {
        var distance = geometry.distances[index];
        var y = distance.startY + (distance.y - distance.startY) * progress;
        var scale = distance.startScale + (distance.endScale - distance.startScale) * progress;
        layer.style.transform = 'translate3d(' + (distance.x * progress).toFixed(2) + 'px, ' +
          y.toFixed(2) + 'px, 0) scale(' + scale.toFixed(4) + ')';
      });
    }
    if (nav) {
      // A short eased reveal avoids leaving the navigation visibly clipped.
      var linearNavProgress = Math.max(0, Math.min(1, (progress - 0.06) / 0.14));
      var navProgress = linearNavProgress * linearNavProgress * (3 - 2 * linearNavProgress);
      if (navProgress !== lastNavProgress) {
        nav.style.setProperty('--nav-progress', navProgress.toFixed(4));
        nav.classList.toggle('is-interactive', navProgress >= 0.85);
        lastNavProgress = navProgress;
      }
    }
    lastProgress = progress;
    // No interpolation loop: terrain stays in sync with native page scrolling.
  }

  function schedule() {
    if (!frame && visible && !motion.matches && !document.hidden) {
      frame = requestAnimationFrame(render);
    }
  }

  function invalidate() {
    dirty = true;
    if (visible) schedule();
    else render();
  }

  function configure() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', invalidate);
    window.removeEventListener('pageshow', invalidate);
    document.removeEventListener('visibilitychange', invalidate);
    layers.forEach(function (layer) { layer.style.removeProperty('transform'); });
    if (nav) {
      nav.classList.toggle('is-hero-reveal', !motion.matches);
      nav.classList.remove('is-interactive');
      nav.style.removeProperty('--nav-progress');
      lastNavProgress = -1;
    }
    hero.classList.toggle('is-parallax', !motion.matches);
    hero.classList.toggle('is-native', !motion.matches && !!nativeScroll);
    hero.classList.toggle('is-fallback', !motion.matches && !nativeScroll);
    hero.classList.remove('is-visible');
    if (motion.matches || (nativeScroll && !nav)) return;

    visible = true;
    dirty = true;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        hero.classList.toggle('is-visible', visible);
        if (visible) {
          invalidate();
        } else {
          cancelAnimationFrame(frame);
          // Anchor jumps can leave the hero before the pending frame runs.
          render();
        }
      });
      observer.observe(hero);
    } else {
      hero.classList.add('is-visible');
    }
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(invalidate);
      resizeObserver.observe(hero);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', invalidate);
    window.addEventListener('pageshow', invalidate);
    document.addEventListener('visibilitychange', invalidate);
    // Set the correct state before paint, including restored scroll positions.
    render();
  }

  motion.addEventListener('change', configure);
  configure();
})();
