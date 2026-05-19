'use strict';

// ── Custom Cursor ──────────────────────────────────────────────
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  const LERP = 0.12;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * LERP;
    ringY += (mouseY - ringY) * LERP;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, [role="button"], input, textarea, select, label, .radio-option';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

// ── Navigation scroll state ───────────────────────────────────
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function update() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// ── Mobile menu ───────────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay   = document.querySelector('.nav__mobile-overlay');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    overlay.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
  });

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });
})();

// ── Active nav link ───────────────────────────────────────────
(function setActiveLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isHome = (href === '../index.html' || href === 'index.html' || href === '/') &&
                   (path === '/' || path.endsWith('index.html'));
    const matches = !isHome && href && path.includes(href.replace('../', '').replace('.html', ''));
    if (isHome || matches) link.classList.add('active');
  });
})();

// ── Page transition ───────────────────────────────────────────
(function initPageTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;

  // Smooth fade-out of overlay after page loads
  requestAnimationFrame(() => {
    overlay.classList.add('enter');
    overlay.addEventListener('animationend', () => {
      overlay.classList.remove('enter');
      overlay.style.opacity = '0';
    }, { once: true });
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('http') || href.startsWith('tel') ||
        link.target === '_blank') return;

    link.addEventListener('click', e => {
      // Allow modifier-click to open in new tab
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      overlay.classList.remove('enter');
      overlay.classList.add('exit');
      overlay.addEventListener('animationend', () => {
        window.location.href = href;
      }, { once: true });
    });
  });
})();
