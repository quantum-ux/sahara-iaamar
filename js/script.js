// js/script.js (replace the file contents with this)
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');

  // Mobile menu toggle
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });
  }
  function closeMobileNav() {
    if (navList && navList.classList.contains('show')) {
      navList.classList.remove('show');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Smooth scroll for same-page anchors only
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href) return;
      // if it's a hash (same page anchor) and the element exists on the current page, scroll smoothly
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeMobileNav();
          setActiveNav();
        }
      }
      // otherwise let the browser navigate to the page (services.html, projects.html...)
    });
  });

  // Active nav detection (file-name based)
  function normalizePath(p) {
    if (!p || p === '/') return 'index.html';
    return p.split('/').pop();
  }
  function setActiveNav() {
    const current = normalizePath(window.location.pathname);
    navLinks.forEach(link => {
      let linkPath = link.getAttribute('href') || '';
      // normalize absolute/relative href
      try { linkPath = normalizePath(new URL(link.href, location.origin).pathname); }
      catch (err) { /* fallback to raw href */ }
      if (linkPath === current) link.classList.add('active');
      else link.classList.remove('active');
    });
  }
  setActiveNav();

  // Accessibility: close mobile menu with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // Shrink header on scroll
  function shrinkOnScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', shrinkOnScroll);
  shrinkOnScroll();

  // Scroll reveal for .reveal elements
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });
  revealElements.forEach(el => revealObserver.observe(el));

  // Counters (if present)
  const counters = document.querySelectorAll('.stat-number');
  const runCounter = (el) => {
    const target = +el.dataset.target || 0;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 120));
    const update = () => {
      current += step;
      if (current >= target) el.textContent = target;
      else {
        el.textContent = current;
        requestAnimationFrame(update);
      }
    };
    update();
  };
  if (counters.length) {
    let countersStarted = false;
    const countersObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          counters.forEach(c => runCounter(c));
          countersStarted = true;
        }
      });
    }, { threshold: 0.45 });
    countersObserver.observe(document.querySelector('.stats') || document.body);
  }

  // Contact form (if present) — unchanged behavior
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !message) {
        formMsg.textContent = 'Please fill required fields (name, email, message).';
        formMsg.style.color = '#b45309';
        return;
      }
      formMsg.textContent = 'Sending...';
      formMsg.style.color = '#0b2b4a';
      setTimeout(() => {
        contactForm.reset();
        formMsg.textContent = 'Thank you! Your request has been received. We will contact you soon.';
        formMsg.style.color = '#0b2b4a';
      }, 900);
    });
  }
});
