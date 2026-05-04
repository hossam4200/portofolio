(function() {
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], connections = [];
  const N = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random()
    });
  }

  let mx = W/2, my = H/2;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const primary = 'hsla(38,92%,60%,';

    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repel
      const dx = p.x - mx, dy = p.y - my;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) { p.vx += dx/d * 0.05; p.vy += dy/d * 0.05; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = primary + (p.a * 0.6) + ')';
      ctx.fill();

      for (let j = i+1; j < N; j++) {
        const dx2 = p.x - particles[j].x, dy2 = p.y - particles[j].y;
        const d2 = Math.sqrt(dx2*dx2 + dy2*dy2);
        if (d2 < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = primary + (1 - d2/120) * 0.15 + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let cx = 0, cy = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; cursor.style.left = cx+'px'; cursor.style.top = cy+'px'; });
function animRing() {
  rx += (cx - rx) * 0.15; ry += (cy - ry) * 0.15;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(1.8)'; ring.style.borderColor = 'hsla(38,92%,60%,0.8)'; });
  el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'hsla(38,92%,60%,0.5)'; });
});

// ===== SCROLL PROGRESS =====
const prog = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const h = document.body.scrollHeight - window.innerHeight;
  prog.style.width = (window.scrollY / h * 100) + '%';
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const iconMenu = document.getElementById('iconMenu');
const iconClose = document.getElementById('iconClose');
navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  iconMenu.style.display = isOpen ? 'none' : 'block';
  iconClose.style.display = isOpen ? 'block' : 'none';
});
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
  mobileMenu.classList.remove('open'); iconMenu.style.display = 'block'; iconClose.style.display = 'none';
}));

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '-50px 0px' });
reveals.forEach(el => revealObs.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = +e.target.dataset.count;
      let cur = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        e.target.textContent = Math.floor(cur) + (target === 100 ? '%' : '+');
      }, 20);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// ===== 3D PROFILE TILT =====
const profile3d = document.getElementById('profile3d');
const inner3d = document.getElementById('profile3dInner');
if (profile3d && inner3d) {
  profile3d.addEventListener('mousemove', e => {
    const rect = profile3d.getBoundingClientRect();
    const cx2 = rect.left + rect.width / 2;
    const cy2 = rect.top + rect.height / 2;
    const rx2 = -(e.clientY - cy2) / rect.height * 20;
    const ry2 = (e.clientX - cx2) / rect.width * 20;
    inner3d.style.transform = `perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg)`;
  });
  profile3d.addEventListener('mouseleave', () => {
    inner3d.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
  });
}

// ===== 3D PROJECT CARD TILT =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx2 = rect.left + rect.width / 2;
    const cy2 = rect.top + rect.height / 2;
    const rx2 = -(e.clientY - cy2) / rect.height * 10;
    const ry2 = (e.clientX - cx2) / rect.width * 10;
    card.style.transform = `perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== SKILL CARD MOUSE GRADIENT =====
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});
