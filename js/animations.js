'use strict';

// ── Scroll Reveal ─────────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
})();

// ── Numeric Counters ──────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const duration = 1400;
      const start = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const value    = target * ease;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ── Progress Bars ─────────────────────────────────────────────
(function initProgressBars() {
  const bars = document.querySelectorAll('.score-bar-fill, .sub-ind-fill, .rml-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

// ── SVG Gauge (mini home version) ────────────────────────────
(function initMiniGauge() {
  const gauge = document.querySelector('.gauge-circle-mini');
  if (!gauge) return;

  // r=80 → circumference≈502.65; 74/100 of arc
  const circumference = 2 * Math.PI * 80;
  const targetOffset  = circumference - (74 / 100) * circumference;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gauge.style.strokeDashoffset = targetOffset;
        observer.unobserve(gauge);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(gauge);
})();

// ── Capability Sections (sub-page) ───────────────────────────
(function initCapabilitySections() {
  const sections = document.querySelectorAll('.capability-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(el => observer.observe(el));
})();

// ── Grid/list cards (inside-card, sample-card, indicator, method-step) ───────
(function initCardReveals() {
  const cards = document.querySelectorAll(
    '.capability-card, .inside-card, .sample-card, .indicator, .method-step'
  );
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger based on DOM position within parent
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.08) + 's';
        entry.target.classList.add('card-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(el => observer.observe(el));
})();
