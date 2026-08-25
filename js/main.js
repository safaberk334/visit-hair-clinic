/* ============================================
   VISIT HAIR CLINIC — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Aktif dil (HTML lang'inden) ──
  // gen_i18n.py ceviri blogunu main.js'ten cikardigi icin dil artik
  // <html lang> uzerinden okunuyor. Bu satir blogun DISINDA kalmali,
  // yoksa main.js'te currentLang tanimsiz kalir ve form coker.
  let currentLang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();

  // ── Ucuncu parti kutuphaneler icin koruma ──
  // unpkg.com'a ulasilamazsa (CDN kesintisi, reklam engelleyici, yavas
  // baglanti) AOS/lucide tanimsiz kalir. Korumasiz cagri butun
  // DOMContentLoaded blogunu dusurur: menu, lightbox, cerez banneri ve
  // iletisim formu birlikte olur. Ustelik aos.css [data-aos] ogelerini
  // opacity:0 yaptigi icin sayfa bombos gorunur.
  const drawIcons = function () {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  // ── Initialize AOS (Animate on Scroll) ──
  const isInIframe = window.self !== window.top;
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: isInIframe ? 0 : 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: isInIframe ? -9999 : 80,
      disable: isInIframe ? false : (window.innerWidth < 768 ? 'phone' : false)
    });
  } else {
    // AOS yok: aos.css'in gizledigi icerigi geri ac.
    document.querySelectorAll('[data-aos]').forEach(function (el) {
      el.removeAttribute('data-aos');
    });
  }

  // ── Initialize Lucide Icons ──
  drawIcons();

  // ── Header Scroll Effect ──
  const header = document.getElementById('header');
  const logoImg = document.getElementById('logo-img');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile Navigation (sagdan kayan drawer) ──
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  // Drawer arka plan karartmasi
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  const openNav = () => {
    hamburger.classList.add('active');
    nav.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    nav.classList.contains('active') ? closeNav() : openNav();
  });

  // Karartmaya tikla / linke tikla / ESC -> kapat
  backdrop.addEventListener('click', closeNav);
  nav.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('active')) closeNav();
  });

  // ── Animated Counters ──
  const counters = document.querySelectorAll('.hero__stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const start = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (target >= 1000) {
          counter.textContent = current.toLocaleString('tr-TR');
        } else {
          counter.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          if (target >= 1000) {
            counter.textContent = target.toLocaleString('tr-TR');
          } else {
            counter.textContent = target;
          }
        }
      };

      requestAnimationFrame(step);
    });
  };

  // Trigger counters when hero stats are visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ── Active Navigation Highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');

  const highlightNav = () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('header__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('header__link--active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Contact Form Handling (WhatsApp yönlendirme) ──
  // Form girdileri bir WhatsApp mesajına dönüştürülür ve wa.me ile açılır.
  // Mail/Formspree altyapısı gerekmez; fotoğraflar sohbette eklenir.
  const WHATSAPP_NUMBER = '905078814325';
  const form = document.getElementById('contact-form');
  if (form) {
    const openByLang = { tr: 'WhatsApp açılıyor…', en: 'Opening WhatsApp…', ar: 'يتم فتح واتساب…', it: 'Apertura di WhatsApp…' };

    // Mesaj alan etiketleri (dile göre)
    const labels = {
      tr: { title: 'Ücretsiz Konsültasyon Talebi', name: 'Ad Soyad', email: 'E-posta', phone: 'Telefon', country: 'Ülke', message: 'Mesaj' },
      en: { title: 'Free Consultation Request', name: 'Name', email: 'Email', phone: 'Phone', country: 'Country', message: 'Message' },
      ar: { title: 'طلب استشارة مجانية', name: 'الاسم', email: 'البريد', phone: 'الهاتف', country: 'الدولة', message: 'الرسالة' },
      it: { title: 'Richiesta di Consulenza Gratuita', name: 'Nome', email: 'Email', phone: 'Telefono', country: 'Paese', message: 'Messaggio' }
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const L = labels[currentLang] || labels.en;
      const data = Object.fromEntries(new FormData(form));
      const lines = [`*${L.title}*`, ''];
      if (data.name)    lines.push(`${L.name}: ${data.name}`);
      if (data.email)   lines.push(`${L.email}: ${data.email}`);
      if (data.phone)   lines.push(`${L.phone}: ${data.phone}`);
      if (data.country) lines.push(`${L.country}: ${data.country}`);
      if (data.message) lines.push(`${L.message}: ${data.message}`);

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i data-lucide="check-circle"></i> <span>${openByLang[currentLang] || openByLang.en}</span>`;
      btn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
      drawIcons();

      window.open(url, '_blank', 'noopener');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        drawIcons();
        form.reset();
      }, 3000);
    });
  }

  // ── Bubble Background Effect ──
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const bubbleCount = 22;

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 10 + 4; // 4-14px
      const duration = Math.random() * 14 + 14; // 14-28s (slow, elegant)
      const delay = Math.random() * 10;
      const drift = (Math.random() - 0.5) * 80;
      const startX = Math.random() * 100;

      // Mix of medical blue, sage green, very subtle red
      const colorPool = [
        `rgba(0,119,182,${Math.random() * 0.07 + 0.03})`,  // blue
        `rgba(0,119,182,${Math.random() * 0.05 + 0.02})`,  // lighter blue
        `rgba(196,219,198,${Math.random() * 0.10 + 0.04})`, // sage
        `rgba(228,35,32,${Math.random() * 0.03 + 0.01})`,   // very subtle red
      ];
      const color = colorPool[Math.floor(Math.random() * colorPool.length)];

      bubble.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 1px solid rgba(0,119,182,${Math.random() * 0.06 + 0.02});
        border-radius: 50%;
        left: ${startX}%;
        bottom: -20px;
        animation: bubbleRise ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        --drift: ${drift}px;
      `;
      particleContainer.appendChild(bubble);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes bubbleRise {
        0% {
          transform: translateY(0) translateX(0) scale(0.6);
          opacity: 0;
        }
        10% {
          opacity: 1;
          transform: translateY(-10vh) translateX(calc(var(--drift) * 0.1)) scale(0.8);
        }
        50% {
          transform: translateY(-50vh) translateX(var(--drift)) scale(1);
        }
        90% {
          opacity: 1;
          transform: translateY(-90vh) translateX(calc(var(--drift) * 0.8)) scale(0.9);
        }
        100% {
          transform: translateY(-105vh) translateX(var(--drift)) scale(0.6);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Smooth scroll for all anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Results Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  if (lightbox && lightboxImg) {
    const openLightbox = (src) => {
      lightboxImg.src = src;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => { if (!lightbox.classList.contains('is-open')) lightboxImg.src = ''; }, 300);
    };
    document.querySelectorAll('.result-item').forEach(item => {
      item.addEventListener('click', () => {
        const full = item.getAttribute('data-full');
        if (full) openLightbox(full);
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  // ── Cookie Consent Banner ──
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1500);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // ── Language Switcher ──
  // [gen_i18n] Ceviri blogu kaldirildi: metin sunucu tarafinda HTML'e gomuluyor.
  // Dil secimi artik /tr/ /en/ /ar/ /it/ URL'leri ile yapiliyor.

});
