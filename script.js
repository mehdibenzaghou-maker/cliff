/* ══ CLIFF PORTFOLIO — script.js ══════════════════════════════════ */

/* ── Nav scroll ─────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () =>
  nav.classList.toggle('scrolled', window.scrollY > 60), {passive:true});

/* ── Hamburger ──────────────────────────────────────────────────── */
const burger = document.getElementById('burger');
const mob = document.getElementById('mobNav');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mob.classList.toggle('open');
  document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
});
window.closeMob = () => {
  burger.classList.remove('open');
  mob.classList.remove('open');
  document.body.style.overflow = '';
};

/* ── Canvas particles ───────────────────────────────────────────── */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
  window.addEventListener('resize', resize, {passive:true}); resize();

  const pts = Array.from({length:55}, () => ({
    x: Math.random()*1000,
    y: Math.random()*800,
    r: Math.random()*1.2+.2,
    vx: (Math.random()-.5)*.18,
    vy: -(Math.random()*.15+.04),
    a: Math.random()*Math.PI*2,
    s: Math.random()*.012,
    o: Math.random()*.22+.04,
    col: Math.random()<.4 ? '59,130,246' : '255,255,255'
  }));

  (function draw() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.a += p.s; p.x += p.vx + Math.sin(p.a)*.08; p.y += p.vy;
      if (p.y < -4) { p.y = H+4; p.x = Math.random()*W; }
      ctx.beginPath(); ctx.arc(p.x%W, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.col},${p.o})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ── Scroll reveal ──────────────────────────────────────────────── */
const io = new IntersectionObserver(entries => entries.forEach((e, i) => {
  if (e.isIntersecting) {
    setTimeout(() => e.target.classList.add('in'), i * 80);
    io.unobserve(e.target);
  }
}), {threshold:.08, rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Counter animation ──────────────────────────────────────────── */
const cio = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, tgt = +el.dataset.count, dur = 1600, s = performance.now();
  const tick = n => {
    el.textContent = Math.floor(Math.min((n-s)/dur, 1) * tgt);
    if (n-s < dur) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  cio.unobserve(el);
}), {threshold:.6});
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* ── Cursor trail (desktop) ─────────────────────────────────────── */
if (!window.matchMedia('(hover:none)').matches) {
  const dots = [];
  for (let i = 0; i < 5; i++) {
    const d = document.createElement('div');
    const sz = 4 - i*.5;
    d.style.cssText = `position:fixed;pointer-events:none;z-index:9999;
      width:${sz}px;height:${sz}px;border-radius:50%;
      background:rgba(59,130,246,${.55-i*.1});
      transform:translate(-50%,-50%);transition:left ${20+i*22}ms linear,top ${20+i*22}ms linear;`;
    document.body.appendChild(d); dots.push(d);
  }
  document.addEventListener('mousemove', e => {
    dots[0].style.left = e.clientX + 'px'; dots[0].style.top = e.clientY + 'px';
  });
  (function loop() {
    for (let i=1;i<dots.length;i++) {
      dots[i].style.left = (parseFloat(dots[i-1].style.left)||0) + 'px';
      dots[i].style.top  = (parseFloat(dots[i-1].style.top)||0) + 'px';
    }
    requestAnimationFrame(loop);
  })();
}
