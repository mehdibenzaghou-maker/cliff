/* CLIFF PORTFOLIO — Flame Theme */

/* ── Intro overlay auto-removes after animation ─────────────── */
setTimeout(() => {
  const intro = document.getElementById('intro-overlay');
  if (intro) intro.remove();
}, 4700);

/* ── Nav ────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () =>
  nav.classList.toggle('on', window.scrollY > 50), {passive:true});

/* ── Burger ─────────────────────────────────────────────────── */
const burger = document.getElementById('burger');
const drawer = document.getElementById('mobDrawer');
burger.addEventListener('click', () => {
  burger.classList.toggle('x');
  drawer.classList.toggle('open');
  document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
});
window.closeMob = () => {
  burger.classList.remove('x');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
};

/* ── Canvas particles — flame & gold ───────────────────────── */
const canvas = document.getElementById('c');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  window.addEventListener('resize', resize, {passive:true});
  resize();

  const particles = Array.from({length:60}, () => ({
    x: Math.random()*1200, y: Math.random()*900,
    r: Math.random()*1.2+.2,
    vx: (Math.random()-.5)*.15, vy: -(Math.random()*.18+.04),
    a: Math.random()*Math.PI*2, s: Math.random()*.012,
    o: Math.random()*.22+.05,
    col: Math.random()<.35 ? '255,92,26' : (Math.random()<.5 ? '255,215,0' : '255,250,244'),
  }));

  (function draw() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.a += p.s; p.x += p.vx + Math.sin(p.a)*.06; p.y += p.vy;
      if (p.y < -4) { p.y = H+4; p.x = Math.random()*W; }
      ctx.beginPath(); ctx.arc(p.x%W, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.col},${p.o})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ── Scroll reveal ───────────────────────────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach((e,i) => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('in'), i*70);
    io.unobserve(e.target);
  });
}, {threshold:.07, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Counter animation ──────────────────────────────────────── */
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, tgt = +el.dataset.count, dur = 1600, s = performance.now();
    const tick = n => {
      const p = Math.min((n-s)/dur, 1);
      const eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.floor(eased * tgt);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, {threshold:.6});
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* ── Flame cursor trail (desktop) ───────────────────────────── */
if (!window.matchMedia('(hover:none)').matches) {
  const dots = Array.from({length:5}, (_,i) => {
    const d = document.createElement('div');
    const sz = 5 - i*.7;
    d.style.cssText = `position:fixed;pointer-events:none;z-index:9999;
      width:${sz}px;height:${sz}px;border-radius:50%;
      background:rgba(255,92,26,${.6-i*.1});
      transform:translate(-50%,-50%);
      transition:left ${18+i*22}ms linear,top ${18+i*22}ms linear;`;
    document.body.appendChild(d); return d;
  });
  document.addEventListener('mousemove', e => {
    dots[0].style.left = e.clientX+'px'; dots[0].style.top = e.clientY+'px';
  });
  (function loop() {
    for (let i=1;i<dots.length;i++) {
      dots[i].style.left = (parseFloat(dots[i-1].style.left)||0) + 'px';
      dots[i].style.top  = (parseFloat(dots[i-1].style.top)||0)  + 'px';
    }
    requestAnimationFrame(loop);
  })();
}
