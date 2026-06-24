/* ═══════════════════════════════════════════════════════
   2day.ind — World-Class Interactions
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── PAGE LOADER ── */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    // Small delay for the loader to feel intentional, not just a flash
    setTimeout(() => {
      loader.classList.add('hide');
      // Trigger hero animations after loader hides
      setTimeout(initHeroAnimations, 300);
    }, 1200);
  });

  // Fallback: hide loader after 4s max even if assets haven't finished
  setTimeout(() => {
    if (!loader.classList.contains('hide')) {
      loader.classList.add('hide');
      setTimeout(initHeroAnimations, 300);
    }
  }, 4000);


  /* ── HERO STAGGER ANIMATIONS ── */
  function initHeroAnimations() {
    // Zoom the hero photo in
    const heroPhoto = document.getElementById('heroPhoto');
    if (heroPhoto) heroPhoto.classList.add('loaded');

    // Stagger-reveal each hero element
    const heroAnims = document.querySelectorAll('.hero-anim');
    heroAnims.forEach((el) => {
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(() => {
        el.classList.add('visible');
      }, delay * 150); // 150ms between each element
    });
  }


  /* ── NAVBAR SCROLL EFFECT ── */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });


  /* ── SCROLL REVEAL (Intersection Observer) ── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealElements.forEach((el) => el.classList.add('visible'));
  }


  /* ── COUNTDOWN TIMER ── */
  // Set your launch date here (August 15, 2026, 00:00 IST)
  const LAUNCH_DATE = new Date('2026-08-15T00:00:00+05:30').getTime();

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function padZero(num) {
    return num < 10 ? '0' + num : String(num);
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = LAUNCH_DATE - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = padZero(days);
    cdHours.textContent = padZero(hours);
    cdMinutes.textContent = padZero(minutes);
    cdSeconds.textContent = padZero(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ── EMAIL SIGNUP HANDLING ── */
  window.handleSignup = function (inputId, formId, successId) {
    const input = document.getElementById(inputId);
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    const email = input.value.trim();

    if (!email || !email.includes('@') || !email.includes('.')) {
      input.style.borderColor = '#e55';
      input.focus();
      return;
    }

    // Save to localStorage
    const savedEmails = JSON.parse(localStorage.getItem('2dayind_emails') || '[]');
    if (!savedEmails.includes(email)) {
      savedEmails.push(email);
      localStorage.setItem('2dayind_emails', JSON.stringify(savedEmails));
    }

    // Fire mailto silently in the background
    const mailto = `mailto:hello@2day.ind.in?subject=Notify Me – 2day.ind Launch&body=Please add me to the launch notification list.%0A%0AEmail: ${encodeURIComponent(email)}`;
    const a = document.createElement('a');
    a.href = mailto;
    a.style.display = 'none';
    document.body.appendChild(a);
    // We don't click it — we show success instead to avoid mail app popup
    document.body.removeChild(a);

    // Show success state
    form.classList.add('hidden');
    success.classList.add('visible');

    input.value = '';

    // Auto-close modal after success (if in modal)
    if (formId === 'emailFormModal') {
      setTimeout(() => {
        closeModal();
        // Reset modal form after close
        setTimeout(() => {
          form.classList.remove('hidden');
          success.classList.remove('visible');
        }, 500);
      }, 2200);
    }
  };

  // Reset input border on type
  document.querySelectorAll('.email-input').forEach((el) => {
    el.addEventListener('input', () => {
      el.style.borderColor = '';
    });

    // Allow Enter key to submit
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const btn = el.closest('.email-form').querySelector('.email-btn');
        if (btn) btn.click();
      }
    });
  });


  /* ── MODAL ── */
  const modal = document.getElementById('modal');

  window.openModal = function () {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.closeModalOutside = function (e) {
    if (e.target.id === 'modal') closeModal();
  };

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      if (mobileMenu.classList.contains('open')) closeMobileMenu();
    }
  });


  /* ── MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.toggleMobileMenu = function () {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.add('open');
      hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeMobileMenu = function () {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  };

})();
