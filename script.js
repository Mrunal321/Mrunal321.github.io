/* ═══════════════════════════════════════════════════════════════
   Portfolio Script — Mrunal Shende
   Features: scramble hero · binary strips · letter animations ·
             staggered cards · sidebar nav · theme toggle · console
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  if (window.lucide) lucide.createIcons();


  /* ══════════════════════════════════════════
     Theme Toggle
     ══════════════════════════════════════════ */

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (window.lucide) lucide.createIcons();
  });


  /* ══════════════════════════════════════════
     Scramble Text (hero elements)
     ══════════════════════════════════════════ */

  const CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&';

  function scramble(el, delay = 0) {
    const final = el.textContent.trim();
    const duration = Math.max(700, final.length * 55);
    let start = null;

    const tick = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const resolved = Math.floor(t * final.length);

      let out = '';
      for (let i = 0; i < final.length; i++) {
        const c = final[i];
        if (c === ' ' || c === '·' || c === '&' || c === ',') { out += c; continue; }
        out += i < resolved
          ? c
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.textContent = out;

      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = final;
    };

    setTimeout(() => requestAnimationFrame(tick), delay);
  }

  document.querySelectorAll('[data-scramble]').forEach((el, i) => {
    scramble(el, 300 + i * 140);
  });


  /* ══════════════════════════════════════════
     Binary Strip Builder
     ══════════════════════════════════════════ */

  function buildBinaryRows(container, rows = 5) {
    const charW = 13;

    for (let r = 0; r < rows; r++) {
      // Insert stripe bar between rows
      if (r > 0 && r % 2 === 0) {
        const bar = document.createElement('div');
        bar.className = 'bin-stripe-bar';
        container.appendChild(bar);
      }

      const row = document.createElement('div');
      row.className = 'bin-row';
      const count = Math.ceil((window.innerWidth - 140) / charW) + 6;
      for (let i = 0; i < count; i++) {
        const sp = document.createElement('span');
        sp.className = 'bin-char';
        sp.textContent = Math.random() > 0.5 ? '1' : '0';
        row.appendChild(sp);
      }
      container.appendChild(row);
    }

    // Animate bit flips
    const flip = () => {
      const chars = container.querySelectorAll('.bin-char');
      if (!chars.length) return;
      const n = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < n; i++) {
        const c = chars[Math.floor(Math.random() * chars.length)];
        c.textContent = c.textContent === '1' ? '0' : '1';
        c.classList.add('lit');
        setTimeout(() => c.classList.remove('lit'), 300);
      }
    };
    setInterval(flip, 110);
  }

  // Hero binary background
  const heroBinary = document.getElementById('heroBinary');
  if (heroBinary) {
    const rows = 7;
    const charW = 11;
    for (let r = 0; r < rows; r++) {
      const row = document.createElement('div');
      row.className = 'bin-row';
      const count = Math.ceil(window.innerWidth / charW) + 4;
      let txt = '';
      for (let i = 0; i < count; i++) txt += (Math.random() > 0.5 ? '1' : '0') + ' ';
      row.textContent = txt;
      heroBinary.appendChild(row);
    }
  }

  // Section binary separators
  ['binSep1', 'binSep2', 'binSep3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) buildBinaryRows(el, 5);
  });


  /* ══════════════════════════════════════════
     Letter-by-letter Section Title Animation
     ══════════════════════════════════════════ */

  function wrapLetters(el) {
    const text = el.textContent;
    el.innerHTML = [...text].map(c =>
      c === ' '
        ? '<span class="ltr ltr-space"> </span>'
        : `<span class="ltr">${c}</span>`
    ).join('');
  }

  function animateLetters(el) {
    const letters = el.querySelectorAll('.ltr:not(.ltr-space)');
    letters.forEach((l, i) => {
      setTimeout(() => {
        l.style.transition = `opacity 0.4s cubic-bezier(0.25,0.46,0.45,0.94) , transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)`;
        l.style.opacity = '1';
        l.style.transform = 'translateY(0)';
      }, i * 45);
    });
  }

  const titleEls = document.querySelectorAll('.js-letters');
  titleEls.forEach(el => wrapLetters(el));

  const letterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateLetters(entry.target);
        letterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  titleEls.forEach(el => letterObserver.observe(el));


  /* ══════════════════════════════════════════
     Staggered Card Entrance Animations
     ══════════════════════════════════════════ */

  function staggerCards(container, selector, delay = 100) {
    if (!container) return;
    const cardObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll(selector);
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('card-visible'), i * delay);
          });
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    cardObs.observe(container);
  }

  staggerCards(document.getElementById('projectsGrid'),  '.project-card',   110);
  staggerCards(document.getElementById('researchGrid'),   '.research-chip',   70);
  staggerCards(document.getElementById('pubsList'),       '.pub-card',        90);
  staggerCards(document.getElementById('skillsGrid'),     '.skills-group',   100);


  /* ══════════════════════════════════════════
     Scroll Reveal (.reveal elements)
     ══════════════════════════════════════════ */

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ══════════════════════════════════════════
     Nav Console — section label scramble
     ══════════════════════════════════════════ */

  const LABELS = {
    hero: 'INIT', about: 'ABOUT', research: 'RESEARCH',
    experience: 'EXP', projects: 'PROJECTS', publications: 'PAPERS',
    skills: 'SKILLS', contact: 'CONTACT',
  };

  const consoleText = document.getElementById('consoleText');
  let currentSection = '';

  function updateConsole(id) {
    if (!consoleText) return;
    const label = LABELS[id] || id.toUpperCase();
    if (consoleText.dataset.current === label) return;
    consoleText.dataset.current = label;

    const hex = '0123456789ABCDEF';
    let ticks = 0;
    const iv = setInterval(() => {
      if (ticks < 7) {
        let s = '';
        for (let i = 0; i < label.length; i++) {
          s += label[i] === ' ' ? ' ' : hex[Math.floor(Math.random() * hex.length)];
        }
        consoleText.textContent = s;
      } else {
        consoleText.textContent = label;
        clearInterval(iv);
      }
      ticks++;
    }, 32);
  }

  setTimeout(() => updateConsole('hero'), 1200);


  /* ══════════════════════════════════════════
     Sidebar: active link + console update
     ══════════════════════════════════════════ */

  const sections   = document.querySelectorAll('section[id]');
  const sbLinks    = document.querySelectorAll('.sb-link');

  const highlightNav = () => {
    const pos = window.scrollY + 160;
    sections.forEach(sec => {
      const id  = sec.getAttribute('id');
      const top = sec.offsetTop;
      const bot = top + sec.offsetHeight;
      if (pos >= top && pos < bot) {
        sbLinks.forEach(a => {
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


  /* ══════════════════════════════════════════
     Sidebar: mobile hamburger toggle
     ══════════════════════════════════════════ */

  const sbHamburger = document.getElementById('sbHamburger');
  const sbLinksEl   = document.getElementById('sbLinks');

  sbHamburger.addEventListener('click', () => {
    sbLinksEl.classList.toggle('open');
    sbHamburger.classList.toggle('active');
  });

  sbLinksEl.querySelectorAll('.sb-link').forEach(link => {
    link.addEventListener('click', () => {
      sbLinksEl.classList.remove('open');
      sbHamburger.classList.remove('active');
    });
  });


  /* ══════════════════════════════════════════
     3D Tilt + Mouse Glow (project cards)
     ══════════════════════════════════════════ */

  function initTilt() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        if (!card.classList.contains('card-visible')) return;

        const r   = card.getBoundingClientRect();
        const x   = e.clientX - r.left;
        const y   = e.clientY - r.top;
        const cx  = r.width  / 2;
        const cy  = r.height / 2;
        const rotX = -((y - cy) / cy) * 9;
        const rotY =  ((x - cx) / cx) * 9;

        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        card.style.transform =
          `perspective(750px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.015)`;
        card.style.boxShadow =
          `0 24px 56px rgba(0,0,0,0.55), 0 0 40px rgba(94,170,162,0.07)`;
        card.style.zIndex = '2';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform   = '';
        card.style.boxShadow   = '';
        card.style.zIndex      = '';
      });
    });
  }

  initTilt();


  /* ══════════════════════════════════════════
     Smooth scroll fallback
     ══════════════════════════════════════════ */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
