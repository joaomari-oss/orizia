'use strict';

// ── Main Gauge Animation ──────────────────────────────────────
(function initGauge() {
  const circle = document.querySelector('.gauge-main-circle');
  if (!circle) return;

  const r = 180;
  const circumference = 2 * Math.PI * r; // ≈ 1131
  const score = 74;
  const targetOffset = circumference - (score / 100) * circumference;

  circle.style.strokeDasharray  = circumference;
  circle.style.strokeDashoffset = circumference;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      circle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)';
      circle.style.strokeDashoffset = targetOffset;
      observer.unobserve(circle);
    });
  }, { threshold: 0.3 });

  observer.observe(circle);
})();

// ── SVG Line Chart ────────────────────────────────────────────
(function initLineChart() {
  const svg = document.getElementById('score-chart');
  if (!svg) return;

  const scores = [58, 59, 61, 62, 63, 65, 66, 68, 69, 71, 72, 74];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const W = svg.viewBox.baseVal.width  || 900;
  const H = svg.viewBox.baseVal.height || 280;
  const padL = 48, padR = 24, padT = 24, padB = 48;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const minVal = 50, maxVal = 80;

  function toX(i)   { return padL + (i / (scores.length - 1)) * chartW; }
  function toY(val) { return padT + chartH - ((val - minVal) / (maxVal - minVal)) * chartH; }

  // Grid lines
  [50, 60, 70, 80].forEach(val => {
    const y = toY(val);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padL);
    line.setAttribute('y1', y);
    line.setAttribute('x2', W - padR);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(168,186,208,0.15)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', padL - 8);
    label.setAttribute('y', y + 4);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('font-family', 'Cormorant Garamond, serif');
    label.setAttribute('font-size', '13');
    label.setAttribute('fill', 'rgba(122,147,181,0.6)');
    label.textContent = val;
    svg.appendChild(label);
  });

  // Month labels
  months.forEach((m, i) => {
    const x = toX(i);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', H - 10);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-family', 'Outfit, sans-serif');
    label.setAttribute('font-size', '10');
    label.setAttribute('fill', 'rgba(122,147,181,0.5)');
    label.setAttribute('letter-spacing', '0.05em');
    label.textContent = m;
    svg.appendChild(label);
  });

  // Area fill
  const areaPoints = scores.map((s, i) => `${toX(i)},${toY(s)}`).join(' ');
  const areaPath = `M ${toX(0)},${toY(scores[0])} L ${areaPoints} L ${toX(scores.length-1)},${padT+chartH} L ${toX(0)},${padT+chartH} Z`;
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', areaPath);
  area.setAttribute('fill', 'rgba(107,145,193,0.06)');
  svg.appendChild(area);

  // Line path
  const points = scores.map((s, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)},${toY(s)}`).join(' ');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', points);
  path.setAttribute('stroke', '#6B91C1');
  path.setAttribute('stroke-width', '1');
  path.setAttribute('fill', 'none');

  const length = 1000;
  path.style.strokeDasharray  = length;
  path.style.strokeDashoffset = length;
  svg.appendChild(path);

  // Dots
  const dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  scores.forEach((s, i) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', toX(i));
    circle.setAttribute('cy', toY(s));
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#6B91C1');
    circle.setAttribute('opacity', '0');
    dotsGroup.appendChild(circle);

    const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueLabel.setAttribute('x', toX(i));
    valueLabel.setAttribute('y', toY(s) - 10);
    valueLabel.setAttribute('text-anchor', 'middle');
    valueLabel.setAttribute('font-family', 'Cormorant Garamond, serif');
    valueLabel.setAttribute('font-size', '12');
    valueLabel.setAttribute('fill', 'rgba(107,145,193,0.8)');
    valueLabel.setAttribute('opacity', '0');
    valueLabel.textContent = s;
    dotsGroup.appendChild(valueLabel);
  });
  svg.appendChild(dotsGroup);

  // Animate on intersect
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      path.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)';
      path.style.strokeDashoffset = '0';

      dotsGroup.querySelectorAll('circle, text').forEach((el, i) => {
        setTimeout(() => {
          el.setAttribute('opacity', '1');
          el.style.transition = 'opacity 0.3s ease';
        }, 1800 + (i * 40));
      });
      observer.unobserve(svg);
    });
  }, { threshold: 0.3 });

  observer.observe(svg);
})();
