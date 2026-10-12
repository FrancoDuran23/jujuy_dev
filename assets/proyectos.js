(function () {
  document.querySelectorAll('[data-project-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var slides = Array.prototype.slice.call(track.children);
    var previous = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var status = carousel.querySelector('[data-carousel-status]');
    var current = 0;
    var scrollFrame = 0;

    function updateStatus() {
      status.textContent = (current + 1) + ' de ' + slides.length;
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.scrollTo({ left: slides[current].offsetLeft, behavior: 'smooth' });
      updateStatus();
    }

    previous.addEventListener('click', function () {
      goTo(current - 1);
    });

    next.addEventListener('click', function () {
      goTo(current + 1);
    });

    track.addEventListener('scroll', function () {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(function () {
        current = Math.round(track.scrollLeft / track.clientWidth);
        updateStatus();
        scrollFrame = 0;
      });
    });
  });
})();
