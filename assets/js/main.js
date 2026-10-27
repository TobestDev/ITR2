/* ============================================================
   ITR INTEGRATED TECHNOLOGIES — main.js
   ------------------------------------------------------------
   1. Theme toggle (dark ⇄ light) with localStorage + OS sync
   2. Footer year
   3. Navbar shadow on scroll
   4. Smooth in-page anchor offset
   ============================================================ */

/* ---------- 1. THEME TOGGLE ---------- */
(function () {
  var root   = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('itr-theme', theme); } catch (e) {}
    toggle.setAttribute(
      'aria-label',
      theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
    );
    toggle.setAttribute('title', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }

  toggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  // Keep in sync with OS only if user hasn't manually chosen
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var handler = function (e) {
      if (!localStorage.getItem('itr-theme')) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  }
})();

/* ---------- 2. FOOTER YEAR ---------- */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- 3. NAVBAR SHADOW ON SCROLL ---------- */
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;
  var onScroll = function () {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- 4. SMOOTH ANCHOR WITH OFFSET (for sticky nav) ---------- */
(function () {
  var header = document.querySelector('.site-nav');
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = (header ? header.offsetHeight : 0) + 12;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ---------- 5. (Optional) Reveal-on-scroll for cards ---------- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll(
    '.solution-card, .industry-card, .platform-card, .testimonial-card, .insight-card, .why-card, .stat-card'
  );
  if (!els.length) return;
  els.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();