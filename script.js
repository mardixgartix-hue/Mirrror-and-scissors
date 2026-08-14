/* ==========================================================================
   MIRRORS N SCISSORS — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. Set dynamic copyright year ── */
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ── 0.5 Back-to-top button visibility ── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
        backToTop.style.display = '';
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });
  }

  /* ── 1. Navbar: scroll state ── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ── 2. Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── 3. Hero image slideshow ── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots   = document.querySelectorAll('.h-dot');
  let heroIdx = 0;
  let heroTimer;

  function goHeroSlide(idx) {
    heroSlides[heroIdx].classList.remove('active');
    heroDots[heroIdx].classList.remove('active');
    heroIdx = (idx + heroSlides.length) % heroSlides.length;
    heroSlides[heroIdx].classList.add('active');
    heroDots[heroIdx].classList.add('active');
  }

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(heroTimer);
      goHeroSlide(Number(dot.dataset.slide));
      heroTimer = setInterval(() => goHeroSlide(heroIdx + 1), 5500);
    });
  });

  heroTimer = setInterval(() => goHeroSlide(heroIdx + 1), 5500);

  /* ── 3. Smooth scroll (offset for sticky nav) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.scrollY + target.getBoundingClientRect().top - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  /* ── 4. Scroll spy ── */
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateSpy() {
    const scrollY = window.scrollY + 90;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateSpy, { passive: true });
  updateSpy();

  /* ── 5. Intersection observer reveal ── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ── 6. Package pre-select ── */
  const serviceSelect = document.getElementById('serviceSelect');

  document.querySelectorAll('.select-package-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const pkg = btn.dataset.package;
      if (pkg && serviceSelect) {
        for (const opt of serviceSelect.options) {
          if (opt.value === pkg) { serviceSelect.value = pkg; break; }
        }
      }
    });
  });

  /* ── 8. Testimonials slider ── */
  const track = document.getElementById('testimonialsTrack');
  const dots  = document.querySelectorAll('.t-dot');
  let current = 0;
  let timer;

  function goToSlide(idx) {
    current = (idx + dots.length) % dots.length;
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goToSlide(Number(dot.dataset.slide));
      startTimer();
    });
  });

  function startTimer() {
    timer = setInterval(() => goToSlide(current + 1), 5000);
  }
  startTimer();

  /* ── 9. Gift voucher modal ── */
  const voucherModal = document.getElementById('voucherModal');
  const openModal    = document.getElementById('openVoucherModal');
  const closeModal   = document.getElementById('closeVoucherModal');

  if (openModal)  openModal.addEventListener('click', () => voucherModal.classList.add('open'));
  if (closeModal) closeModal.addEventListener('click', () => voucherModal.classList.remove('open'));
  if (voucherModal) {
    voucherModal.addEventListener('click', e => {
      if (e.target === voucherModal) voucherModal.classList.remove('open');
    });
  }

  /* ── 10. Forms → WhatsApp ── */
  const apptForm = document.getElementById('appointmentForm');
  if (apptForm) {
    apptForm.addEventListener('submit', e => {
      e.preventDefault();
      
      // Honeypot validation (spam protection)
      const honeypot = apptForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam detected');
        return;
      }
      
      const name    = document.getElementById('clientName').value.trim();
      const phone   = document.getElementById('clientPhone').value.trim();
      const service = serviceSelect.value;
      const date    = document.getElementById('preferredDate').value;

      if (!name || !phone || !service) {
        alert('Please fill in all required fields');
        return;
      }

      let msg = `Hello Mirrors N Scissors! I'd like to book an appointment. 💄\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Service:* ${service}`;
      if (date) msg += `\n*Preferred Date/Time:* ${new Date(date).toLocaleString('en-IN')}`;

      window.open(`https://wa.me/917060373975?text=${encodeURIComponent(msg)}`, '_blank');
      apptForm.reset();
    });
  }

  const voucherForm = document.getElementById('voucherForm');
  if (voucherForm) {
    voucherForm.addEventListener('submit', e => {
      e.preventDefault();
      
      // Honeypot validation (spam protection)
      const honeypot = voucherForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam detected');
        return;
      }
      
      const name   = document.getElementById('vName').value.trim();
      const phone  = document.getElementById('vPhone').value.trim();
      const amount = document.getElementById('vAmount').value;

      if (!name || !phone) {
        alert('Please fill in all required fields');
        return;
      }

      const msg = `Hello! I'd like to enquire about a Gift Voucher at Mirrors N Scissors. 🎁\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Voucher Amount:* ${amount}`;
      window.open(`https://wa.me/917060373975?text=${encodeURIComponent(msg)}`, '_blank');
      voucherForm.reset();
      voucherModal.classList.remove('open');
    });
  }

});
