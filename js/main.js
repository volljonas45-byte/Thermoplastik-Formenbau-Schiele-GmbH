/* ===================================================
   SCHIELE GMBH – Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== MOBILE NAV ===== */
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  hamburger?.addEventListener('click', () => {
    mobileNav?.classList.add('open');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeMenu = () => {
    mobileNav?.classList.remove('open');
    hamburger?.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileClose?.addEventListener('click', closeMenu);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ===== HERO BG PARALLAX / LOAD ===== */
  document.querySelectorAll('.hero-bg').forEach(el => {
    requestAnimationFrame(() => el.classList.add('loaded'));
  });

  /* ===== INTERSECTION OBSERVER (fade animations) ===== */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-in, .timeline-item').forEach(el => {
    revealObs.observe(el);
  });

  /* ===== COUNTER ANIMATION ===== */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const startTime = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOut(progress) * target;
      el.textContent = prefix + value.toFixed(decimals).replace('.', ',') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

  /* ===== FILE UPLOAD ===== */
  document.querySelectorAll('.file-upload').forEach(wrapper => {
    const input    = wrapper.querySelector('input[type="file"]');
    const nameEl   = wrapper.querySelector('.file-name');

    wrapper.addEventListener('click', (e) => {
      if (e.target !== input) input?.click();
    });

    ['dragover', 'dragenter'].forEach(ev => {
      wrapper.addEventListener(ev, (e) => {
        e.preventDefault();
        wrapper.style.borderColor = 'var(--accent)';
        wrapper.style.background  = 'rgba(59,130,246,.05)';
      });
    });

    ['dragleave', 'dragend'].forEach(ev => {
      wrapper.addEventListener(ev, () => {
        wrapper.style.borderColor = '';
        wrapper.style.background  = '';
      });
    });

    wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      wrapper.style.borderColor = '';
      wrapper.style.background  = '';
      const file = e.dataTransfer?.files[0];
      if (file && nameEl) nameEl.textContent = '✓ ' + file.name;
    });

    input?.addEventListener('change', () => {
      if (input.files[0] && nameEl) nameEl.textContent = '✓ ' + input.files[0].name;
    });
  });

  /* ===== ANREDE PILLS ===== */
  document.querySelectorAll('.anrede-pills').forEach(group => {
    group.querySelectorAll('.anrede-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.anrede-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const hiddenInput = group.nextElementSibling;
        if (hiddenInput?.type === 'hidden') hiddenInput.value = pill.textContent.trim();
      });
    });
  });

  /* ===== FORM VALIDATION ===== */
  document.querySelectorAll('form.validated').forEach(form => {
    form.addEventListener('submit', (e) => {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) {
        e.preventDefault();
        const firstInvalid = form.querySelector('[required]:invalid, [required][style*="ef4444"]');
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===== ACTIVE NAV LINK ===== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .footer-links a').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPage) link.style.color = 'var(--accent-light)';
  });

});
