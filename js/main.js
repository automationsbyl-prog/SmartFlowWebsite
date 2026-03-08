/* =====================================================
   SmartFlow v2 - Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initThemeToggle();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavHighlight();
  initParticleCanvas();
  initScrollAnimations();
  initCaseStudyExpand();
  initFormValidation();
  initCounterAnimations();
});

/* =====================================================
   Theme Toggle (Dark/Light Mode)
   ===================================================== */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

/* =====================================================
   Mobile Menu
   ===================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';

    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.hidden = isExpanded;

    // Animate hamburger
    const lines = menuBtn.querySelectorAll('.hamburger-line');
    lines.forEach((line, index) => {
      if (!isExpanded) {
        if (index === 0) line.style.transform = 'rotate(45deg) translate(6px, 6px)';
        if (index === 1) line.style.opacity = '0';
        if (index === 2) line.style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        line.style.transform = '';
        line.style.opacity = '';
      }
    });
  });

  // Close menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;

      const lines = menuBtn.querySelectorAll('.hamburger-line');
      lines.forEach(line => {
        line.style.transform = '';
        line.style.opacity = '';
      });
    });
  });
}

/* =====================================================
   Smooth Scroll
   ===================================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* =====================================================
   Active Navigation Highlight
   ===================================================== */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* =====================================================
   Particle Canvas (Hero Section)
   ===================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let isVisible = true;

  // Set canvas size
  function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark
        ? `rgba(0, 217, 255, ${this.opacity})`
        : `rgba(0, 81, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  function initParticles() {
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    particles = [];
    for (let i = 0; i < Math.min(particleCount, 80); i++) {
      particles.push(new Particle());
    }
  }

  // Draw connections between particles
  function drawConnections() {
    const maxDistance = 120;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;
          ctx.strokeStyle = isDark
            ? `rgba(0, 217, 255, ${opacity})`
            : `rgba(0, 81, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // Visibility observer
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationId) {
        animate();
      }
    });
  }, { threshold: 0.1 });

  visibilityObserver.observe(canvas);

  // Initialize
  resizeCanvas();
  initParticles();
  animate();

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 200);
  });
}

/* =====================================================
   Scroll Animations (using GSAP if available)
   ===================================================== */
function initScrollAnimations() {
  // Check if GSAP is available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAPAnimations();
  } else {
    // Fallback to Intersection Observer
    initFallbackAnimations();
  }
}

function initGSAPAnimations() {
  // Hero section
  gsap.from('.hero-badge', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.2
  });

  gsap.from('.hero-title', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.4
  });

  gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.6
  });

  gsap.from('.hero-cta', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.8
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 0.8
    });
  });

  // Branche cards
  gsap.utils.toArray('.branche-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: index * 0.1
    });
  });

  // Service cards
  gsap.utils.toArray('.service-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: index * 0.15
    });
  });

  // Process steps
  gsap.utils.toArray('.process-step').forEach((step, index) => {
    gsap.from(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -30,
      duration: 0.6,
      delay: index * 0.2,
      onComplete: () => step.classList.add('visible')
    });
  });

  // Metric cards
  gsap.utils.toArray('.metric-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      delay: index * 0.1
    });
  });

  // Value cards
  gsap.utils.toArray('.value-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: 30,
      duration: 0.6,
      delay: index * 0.15
    });
  });

  // FAQ items
  gsap.utils.toArray('.faq-item').forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.4,
      delay: index * 0.1
    });
  });
}

function initFallbackAnimations() {
  const animatedElements = document.querySelectorAll(
    '.section-header, .branche-card, .service-card, .process-step, ' +
    '.metric-card, .value-card, .faq-item, .case-study-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        if (entry.target.classList.contains('process-step')) {
          entry.target.classList.add('visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/* =====================================================
   Case Study Expand/Collapse
   ===================================================== */
function initCaseStudyExpand() {
  const caseStudyCards = document.querySelectorAll('.case-study-card');

  caseStudyCards.forEach(card => {
    const expandBtn = card.querySelector('.expand-btn');
    const details = card.querySelector('.case-details');

    if (!expandBtn || !details) return;

    expandBtn.addEventListener('click', () => {
      const isExpanded = card.getAttribute('data-expanded') === 'true';

      card.setAttribute('data-expanded', !isExpanded);
      expandBtn.setAttribute('aria-expanded', !isExpanded);
      details.hidden = isExpanded;
    });
  });
}

/* =====================================================
   Form Validation
   ===================================================== */
function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea, select');

  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Wird gesendet...</span>';

      // Send form data to Formspree
      const formData = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          submitBtn.innerHTML = '<span>Nachricht gesendet!</span>';
          submitBtn.style.background = 'var(--color-success)';
          setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
          }, 2000);
        } else {
          throw new Error('Formular konnte nicht gesendet werden');
        }
      })
      .catch(error => {
        submitBtn.innerHTML = '<span>Fehler beim Senden</span>';
        submitBtn.style.background = 'var(--color-error)';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 3000);
      });
    }
  });

  function validateField(input) {
    const value = input.value.trim();
    let isValid = true;

    // Remove existing error state
    input.classList.remove('error');
    input.style.borderColor = '';

    // Required check
    if (input.hasAttribute('required') && !value) {
      isValid = false;
    }

    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }

    // Phone validation (optional, basic format)
    if (input.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]{6,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
      }
    }

    if (!isValid) {
      input.classList.add('error');
      input.style.borderColor = 'var(--color-error)';
    }

    return isValid;
  }
}

/* =====================================================
   Counter Animations
   ===================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.gauge-number, .value-number');
  const gauges = document.querySelectorAll('.gauge-fill');
  const bars = document.querySelectorAll('.bar-fill');

  // Counter animation
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const targetValue = parseInt(element.getAttribute('data-value'));
        animateCounter(element, targetValue);
        counterObserver.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // Gauge animation
  const gaugeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const gauge = entry.target;
        const value = parseInt(gauge.getAttribute('data-value'));
        const circumference = 2 * Math.PI * 85; // r=85
        const offset = circumference - (value / 100) * circumference;

        setTimeout(() => {
          gauge.style.strokeDashoffset = offset;
        }, 200);

        gaugeObserver.unobserve(gauge);
      }
    });
  }, { threshold: 0.3 });

  gauges.forEach(gauge => gaugeObserver.observe(gauge));

  // Bar animation
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');

        setTimeout(() => {
          bar.style.width = `${width}%`;
        }, 300);

        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => barObserver.observe(bar));
}

function animateCounter(element, target) {
  const duration = 1500;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    const current = Math.round(start + (target - start) * easeOut);
    const lang = document.documentElement.lang || 'de';
    element.textContent = current.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE');

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* =====================================================
   Header Scroll Effect
   ===================================================== */
let lastScrollY = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 100) {
    header.style.boxShadow = 'var(--shadow-md)';
  } else {
    header.style.boxShadow = '';
  }

  lastScrollY = currentScrollY;
}, { passive: true });
