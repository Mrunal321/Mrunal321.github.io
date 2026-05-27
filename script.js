/* ═══════════════════════════════════════════════════════════════
   Portfolio Script — Mrunal Shende
   Features: scramble text · binary strips · theme toggle ·
             nav console · scroll reveal · active nav link
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Initialize Lucide Icons ──
  if (window.lucide) lucide.createIcons();


  /* ══════════════════════════════════════════
     Theme Toggle (dark / light)
     ══════════════════════════════════════════ */
  const themeToggle = document.getElementById('themeToggle');

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    // Re-init icons since SVGs may need a repaint
    if (window.lucide) lucide.createIcons();
  });


  /* ══════════════════════════════════════════
     Scramble Text Effect
     ══════════════════════════════════════════ */
  const SCRAMBLE_CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&';

  function scramble(el, opts = {}) {
    const finalText = el.textContent.trim();
    const duration  = opts.duration  || 900;
    const delay     = opts.delay     || 0;

    let startTime = null;

    const frame = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const revealUpTo = Math.floor(progress * finalText.length);

      let out = '';
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ' || finalText[i] === '·' || finalText[i] === '&') {
          out += finalText[i];
        } else if (i < revealUpTo) {
          out += finalText[i];
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      el.textContent = out;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = finalText;
      }
    };

    if (delay > 0) {
      setTimeout(() => requestAnimationFrame(frame), delay);
    } else {
      requestAnimationFrame(frame);
    }
  }

  // Run scramble on elements with data-scramble, staggered
  const scrambleEls = document.querySelectorAll('[data-scramble]');
  scrambleEls.forEach((el, i) => {
    scramble(el, { duration: 850, delay: 200 + i * 120 });
  });


  /* ══════════════════════════════════════════
     Binary Strip Builder & Animator
     ══════════════════════════════════════════ */
  function buildBinaryStrip(container) {
    const ROWS      = 2;
    const charWidth = 14; // approximate px per char at 0.65rem + letter-spacing

    function generateRow() {
      const count  = Math.ceil(window.innerWidth / charWidth) + 4;
      const row    = document.createElement('div');
      row.className = 'bin-row';
      for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'bin-char';
        span.textContent = Math.random() > 0.5 ? '1' : '0';
        row.appendChild(span);
      }
      return row;
    }

    for (let r = 0; r < ROWS; r++) {
      container.appendChild(generateRow());
    }

    // Random bit-flip animation
    const allChars = () => container.querySelectorAll('.bin-char');

    const flip = () => {
      const chars = allChars();
      if (!chars.length) return;
      const flips = Math.floor(Math.random() * 4) + 1;
      for (let f = 0; f < flips; f++) {
        const c = chars[Math.floor(Math.random() * chars.length)];
        c.textContent = c.textContent === '1' ? '0' : '1';
        c.classList.add('lit');
        setTimeout(() => c.classList.remove('lit'), 280);
      }
    };

    setInterval(flip, 130);
  }

  // Hero binary background
  const heroBinary = document.getElementById('heroBinary');
  if (heroBinary) {
    const HERO_ROWS = 6;
    for (let r = 0; r < HERO_ROWS; r++) {
      const count = Math.ceil(window.innerWidth / 12) + 4;
      const row   = document.createElement('div');
      row.className = 'bin-row';
      let txt = '';
      for (let i = 0; i < count; i++) {
        txt += (Math.random() > 0.5 ? '1' : '0') + ' ';
      }
      row.textContent = txt;
      heroBinary.appendChild(row);
    }
  }

  // Section binary separators
  ['binSep1', 'binSep2', 'binSep3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) buildBinaryStrip(el);
  });


  /* ══════════════════════════════════════════
     Nav Console — updates on scroll
     ══════════════════════════════════════════ */
  const SECTION_LABELS = {
    hero:         'INIT',
    about:        'ABOUT',
    research:     'RESEARCH',
    experience:   'EXP',
    projects:     'PROJECTS',
    publications: 'PAPERS',
    skills:       'SKILLS',
    contact:      'CONTACT',
  };

  const consoleText = document.getElementById('consoleText');

  function updateConsole(id) {
    if (!consoleText) return;
    const label = SECTION_LABELS[id] || id.toUpperCase();
    if (consoleText.textContent === label) return;

    // Brief scramble on the console label
    const chars = '0123456789ABCDEF';
    let ticks = 0;
    const total = 8;
    const iv = setInterval(() => {
      if (ticks < total - 2) {
        let s = '';
        for (let i = 0; i < label.length; i++) {
          s += label[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
        }
        consoleText.textContent = s;
      } else {
        consoleText.textContent = label;
        clearInterval(iv);
      }
      ticks++;
    }, 35);
  }


  /* ══════════════════════════════════════════
     Navigation: scroll shadow
     ══════════════════════════════════════════ */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ══════════════════════════════════════════
     Navigation: mobile toggle
     ══════════════════════════════════════════ */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });


  /* ══════════════════════════════════════════
     Scroll Reveal (Intersection Observer)
     ══════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* ══════════════════════════════════════════
     Active Nav Link + Console Update
     ══════════════════════════════════════════ */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  let currentSection = 'hero';

  const highlightNav = () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
        });

        if (id !== currentSection) {
          currentSection = id;
          updateConsole(id);
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // Trigger initial console label after scramble delay
  setTimeout(() => updateConsole('hero'), 1400);


  /* ══════════════════════════════════════════
     Smooth scroll fallback
     ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
