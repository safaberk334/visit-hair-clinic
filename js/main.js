/* ============================================
   VISIT HAIR CLINIC — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Initialize AOS (Animate on Scroll) ──
  const isInIframe = window.self !== window.top;
  AOS.init({
    duration: isInIframe ? 0 : 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: isInIframe ? -9999 : 80,
    disable: isInIframe ? false : (window.innerWidth < 768 ? 'phone' : false)
  });

  // ── Initialize Lucide Icons ──
  lucide.createIcons();

  // ── Header Scroll Effect ──
  const header = document.getElementById('header');
  const logoImg = document.getElementById('logo-img');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
      logoImg.src = 'img/logo/logo-dark.png';
    } else {
      header.classList.remove('header--scrolled');
      logoImg.src = 'img/logo/logo-dark.png';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile Navigation ──
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  // Close nav on link click
  nav.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
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

  // ── Contact Form Handling ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // For now, show success message and log data
      console.log('Form submitted:', data);

      // Create success message
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="check-circle"></i> <span>G&ouml;nderildi!</span>';
      btn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
      lucide.createIcons();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        lucide.createIcons();
        form.reset();
      }, 3000);
    });
  }

  // ── Particle Background Effect ──
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: rgba(100,176,211,${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      particleContainer.appendChild(particle);
    }

    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}50px); opacity: 0; }
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

  // ── Language Switcher ──
  const translations = {
    tr: {
      nav_about: 'Hakkımızda',
      nav_services: 'Hizmetler',
      nav_journey: 'Süreç',
      nav_results: 'Sonuçlar',
      nav_whyus: 'Neden Biz',
      nav_tourism: 'Sağlık Turizmi',
      nav_contact: 'İletişim',
      hero_badge: "Türkiye'nin Güvenilir Saç Ekim Merkezi",
      hero_title1: 'Yeni Saçlarınız,',
      hero_title2: 'Yeni Hayatınız.',
      hero_subtitle: "9 yıllık deneyim ve 5.000'den fazla başarılı operasyonla, doğal ve kalıcı sonuçlar sunuyoruz.",
      hero_cta1: 'Ücretsiz Konsültasyon',
      stat_years: 'Yıl Deneyim',
      stat_ops: 'Başarılı Operasyon',
      stat_countries: 'Ülke',
      stat_satisfaction: 'Memnuniyet',
      about_label: 'HAKKIMIZDA',
      about_title: 'Saç Ekim Uzmanı <span class="text-accent">Sedat Kuren</span>',
      about_text1: "9 yılı aşkın deneyimi ve 5.000'den fazla başarılı operasyonuyla Sedat Kuren, saç ekimi alanında Türkiye'nin en deneyimli uzmanlarından biridir.",
      about_text2: 'FUE, DHI ve Safir FUE dahil en güncel tekniklerde uzmanlaşmış olan Sedat Kuren, her hastaya özel doğal saç çizgisi tasarımı ile kalıcı ve estetik sonuçlar sunar.',
      about_badge: 'Yıllık Deneyim',
      about_f1_title: 'Sertifikalı Uzman',
      about_f1_text: 'Uluslararası sertifikalara sahip',
      about_f2_title: 'Uluslararası Deneyim',
      about_f2_text: '7+ ülkede operasyon tecrübesi',
      about_f3_title: 'Anlaşmalı Doktorlar',
      about_f3_text: 'Uzman doktor ekibiyle çalışır',
      about_f4_title: 'Kişiye Özel Tasarım',
      about_f4_text: 'Doğal saç çizgisi garantisi',
      services_label: 'HİZMETLERİMİZ',
      services_title: 'Uzman Olduğumuz <span class="text-accent">Tedaviler</span>',
      services_desc: 'En son teknoloji ve tekniklerle, her hastaya özel çözümler sunuyoruz.',
      journey_label: 'SÜREÇ',
      journey_title: 'Hasta <span class="text-accent">Yolculuğunuz</span>',
      journey_desc: 'İlk görüşmeden sonuca kadar her adımda yanınızdayız.',
      results_label: 'SONUÇLARIMIZ',
      results_title: 'Gerçek Hastalar, <span class="text-accent">Gerçek Sonuçlar</span>',
      results_desc: 'Önce ve sonra fotoğraflarıyla operasyonlarımızın sonuçlarını inceleyin.',
      whyus_label: 'NEDEN BİZ',
      whyus_title: "Visit Hair Clinic'i <span class=\"text-accent\">Tercih Etmeniz İçin</span>",
      tourism_label: 'SAĞLIK TURİZMİ',
      tourism_title: "Türkiye'de <span class=\"text-accent\">All-Inclusive</span> Saç Ekimi",
      tourism_text: "Uluslararası hastalarımız için her şey dahil paketler sunuyoruz. Havaalanından ayrılana kadar her detay sizin için planlanır.",
      contact_label: 'İLETİŞİM',
      contact_title: 'Ücretsiz <span class="text-accent">Konsültasyon</span>',
      contact_text: "Saç durumunuzu analiz edelim ve size özel tedavi planı oluşturalım. Fotoğraflarınızı gönderin, 24 saat içinde dönüş yapalım.",
      form_name: 'Ad Soyad',
      form_email: 'E-posta',
      form_phone: 'Telefon',
      form_country: 'Ülke',
      form_country_select: 'Seçiniz',
      form_country_other: 'Diğer',
      form_message: 'Mesajınız',
      form_submit: 'Gönder',
      footer_tagline: 'Yeni saçlarınız, yeni hayatınız.',
      footer_quick: 'Hızlı Linkler',
      footer_services: 'Hizmetlerimiz',
      footer_contact: 'İletişim',
      footer_rights: 'Tüm hakları saklıdır.',
    },
    en: {
      nav_about: 'About Us',
      nav_services: 'Services',
      nav_journey: 'Process',
      nav_results: 'Results',
      nav_whyus: 'Why Us',
      nav_tourism: 'Health Tourism',
      nav_contact: 'Contact',
      hero_badge: "Turkey's Trusted Hair Transplant Center",
      hero_title1: 'Your New Hair,',
      hero_title2: 'Your New Life.',
      hero_subtitle: 'With 9 years of experience and over 5,000 successful operations, we deliver natural and lasting results.',
      hero_cta1: 'Free Consultation',
      stat_years: 'Years Experience',
      stat_ops: 'Successful Operations',
      stat_countries: 'Countries',
      stat_satisfaction: 'Satisfaction',
      about_label: 'ABOUT US',
      about_title: 'Hair Transplant Specialist <span class="text-accent">Sedat Kuren</span>',
      about_text1: "With over 9 years of experience and more than 5,000 successful operations, Sedat Kuren is one of Turkey's most experienced hair transplant specialists.",
      about_text2: 'Specialized in the latest techniques including FUE, DHI, and Sapphire FUE, Sedat Kuren delivers permanent and aesthetic results with personalized hairline design for each patient.',
      about_badge: 'Years Experience',
      about_f1_title: 'Certified Expert',
      about_f1_text: 'International certifications',
      about_f2_title: 'Global Experience',
      about_f2_text: 'Operations in 7+ countries',
      about_f3_title: 'Partner Doctors',
      about_f3_text: 'Works with expert medical team',
      about_f4_title: 'Custom Design',
      about_f4_text: 'Natural hairline guarantee',
      services_label: 'OUR SERVICES',
      services_title: 'Treatments We <span class="text-accent">Specialize In</span>',
      services_desc: 'We offer personalized solutions with the latest technology and techniques.',
      journey_label: 'PROCESS',
      journey_title: 'Your Patient <span class="text-accent">Journey</span>',
      journey_desc: "We're with you every step — from first consultation to final result.",
      results_label: 'OUR RESULTS',
      results_title: 'Real Patients, <span class="text-accent">Real Results</span>',
      results_desc: 'Explore our operation results with before and after photos.',
      whyus_label: 'WHY US',
      whyus_title: 'Reasons to Choose <span class="text-accent">Visit Hair Clinic</span>',
      tourism_label: 'HEALTH TOURISM',
      tourism_title: '<span class="text-accent">All-Inclusive</span> Hair Transplant in Turkey',
      tourism_text: 'We offer all-inclusive packages for our international patients. Every detail is planned for you from airport arrival to departure.',
      contact_label: 'CONTACT',
      contact_title: 'Free <span class="text-accent">Consultation</span>',
      contact_text: "Let us analyze your hair condition and create a personalized treatment plan. Send your photos and we'll respond within 24 hours.",
      form_name: 'Full Name',
      form_email: 'Email',
      form_phone: 'Phone',
      form_country: 'Country',
      form_country_select: 'Select',
      form_country_other: 'Other',
      form_message: 'Your Message',
      form_submit: 'Send',
      footer_tagline: 'Your new hair, your new life.',
      footer_quick: 'Quick Links',
      footer_services: 'Our Services',
      footer_contact: 'Contact',
      footer_rights: 'All rights reserved.',
    },
    ar: {
      nav_about: 'من نحن',
      nav_services: 'خدماتنا',
      nav_journey: 'المراحل',
      nav_results: 'النتائج',
      nav_whyus: 'لماذا نحن',
      nav_tourism: 'السياحة العلاجية',
      nav_contact: 'اتصل بنا',
      hero_badge: 'مركز زراعة الشعر الموثوق في تركيا',
      hero_title1: 'شعرك الجديد،',
      hero_title2: 'حياتك الجديدة.',
      hero_subtitle: 'مع 9 سنوات من الخبرة وأكثر من 5000 عملية ناجحة، نقدم نتائج طبيعية ودائمة.',
      hero_cta1: 'استشارة مجانية',
      stat_years: 'سنوات خبرة',
      stat_ops: 'عملية ناجحة',
      stat_countries: 'دول',
      stat_satisfaction: 'رضا العملاء',
      about_label: 'من نحن',
      about_title: 'أخصائي زراعة الشعر <span class="text-accent">سادات كورين</span>',
      about_text1: 'مع أكثر من 9 سنوات من الخبرة وأكثر من 5000 عملية ناجحة، يعد سادات كورين من أكثر المتخصصين خبرة في زراعة الشعر في تركيا.',
      about_text2: 'متخصص في أحدث التقنيات بما في ذلك FUE و DHI و Sapphire FUE، يقدم سادات كورين نتائج دائمة وجمالية مع تصميم خط شعر مخصص لكل مريض.',
      about_badge: 'سنوات الخبرة',
      about_f1_title: 'خبير معتمد',
      about_f1_text: 'شهادات دولية',
      about_f2_title: 'خبرة عالمية',
      about_f2_text: 'عمليات في أكثر من 7 دول',
      about_f3_title: 'أطباء شركاء',
      about_f3_text: 'يعمل مع فريق طبي متخصص',
      about_f4_title: 'تصميم مخصص',
      about_f4_text: 'ضمان خط شعر طبيعي',
      services_label: 'خدماتنا',
      services_title: 'العلاجات التي <span class="text-accent">نتخصص فيها</span>',
      services_desc: 'نقدم حلولاً مخصصة بأحدث التقنيات والتكنولوجيا.',
      journey_label: 'المراحل',
      journey_title: 'رحلة <span class="text-accent">المريض</span>',
      journey_desc: 'نحن معك في كل خطوة — من الاستشارة الأولى إلى النتيجة النهائية.',
      results_label: 'نتائجنا',
      results_title: 'مرضى حقيقيون، <span class="text-accent">نتائج حقيقية</span>',
      results_desc: 'استعرض نتائج عملياتنا بصور قبل وبعد.',
      whyus_label: 'لماذا نحن',
      whyus_title: 'أسباب لاختيار <span class="text-accent">Visit Hair Clinic</span>',
      tourism_label: 'السياحة العلاجية',
      tourism_title: 'زراعة شعر <span class="text-accent">شاملة</span> في تركيا',
      tourism_text: 'نقدم باقات شاملة لمرضانا الدوليين. كل التفاصيل مخططة من وصولك إلى المطار حتى مغادرتك.',
      contact_label: 'اتصل بنا',
      contact_title: 'استشارة <span class="text-accent">مجانية</span>',
      contact_text: 'دعنا نحلل حالة شعرك ونضع خطة علاج مخصصة لك. أرسل صورك وسنرد خلال 24 ساعة.',
      form_name: 'الاسم الكامل',
      form_email: 'البريد الإلكتروني',
      form_phone: 'الهاتف',
      form_country: 'البلد',
      form_country_select: 'اختر',
      form_country_other: 'أخرى',
      form_message: 'رسالتك',
      form_submit: 'إرسال',
      footer_tagline: 'شعرك الجديد، حياتك الجديدة.',
      footer_quick: 'روابط سريعة',
      footer_services: 'خدماتنا',
      footer_contact: 'اتصل بنا',
      footer_rights: 'جميع الحقوق محفوظة.',
    }
  };

  let currentLang = 'tr';

  const switchLanguage = (lang) => {
    currentLang = lang;
    const t = translations[lang];
    if (!t) return;

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (t[key].includes('<span')) {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Update HTML direction for Arabic
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update active lang button
    document.querySelectorAll('.lang-btn, .lang-btn-sm').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  };

  // Bind language buttons
  document.querySelectorAll('.lang-btn, .lang-btn-sm').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.getAttribute('data-lang'));
    });
  });

});
