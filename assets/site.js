(function () {
  // Mobile menu with state label and Escape key support
  var btn = document.querySelector('.menu'), nav = document.getElementById('nav');
  if (btn && nav) {
    function setMenu(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    }
    btn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setMenu(false);
        btn.focus();
      }
    });
  }

  // Interactive 3D perspective tilt on cards (desktop pointers only; respects reduced motion)
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    var TILT_SELECTOR = '.card, .samples figure, .sample-band, .download-box';
    var activeCard = null;

    function resetCard(el) {
      if (!el) return;
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    }

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var target = e.target && e.target.closest ? e.target.closest(TILT_SELECTOR) : null;
      if (activeCard && activeCard !== target) {
        resetCard(activeCard);
        activeCard = null;
      }
      if (!target) return;
      activeCard = target;
      var rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var maxTilt = (target.classList.contains('sample-band') || target.classList.contains('download-box')) ? 3 : 8;
      var rx = ((0.5 - py) * maxTilt).toFixed(2);
      var ry = ((px - 0.5) * maxTilt).toFixed(2);
      target.style.setProperty('--rx', rx + 'deg');
      target.style.setProperty('--ry', ry + 'deg');
    }, { passive: true });

    document.addEventListener('pointerout', function (e) {
      if (activeCard && (!e.relatedTarget || !activeCard.contains(e.relatedTarget))) {
        resetCard(activeCard);
        activeCard = null;
      }
    });
  }
})();
