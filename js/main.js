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
    } else {
      header.classList.remove('header--scrolled');
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

  // ── Contact Form Handling (Formspree) ──
  const form = document.getElementById('contact-form');
  if (form) {
    const successByLang = { tr: 'Gönderildi!', en: 'Sent!', ar: 'تم الإرسال!' };
    const errorByLang = { tr: 'Hata oluştu, tekrar deneyin', en: 'Error, please retry', ar: 'حدث خطأ، حاول مرة أخرى' };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      const action = form.getAttribute('action') || '';

      const showState = (text, color) => {
        btn.innerHTML = `<i data-lucide="check-circle"></i> <span>${text}</span>`;
        btn.style.background = color;
        lucide.createIcons();
      };
      const reset = (doResetForm) => setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        lucide.createIcons();
        if (doResetForm) form.reset();
      }, 3000);

      // If Formspree endpoint not yet configured, fail gracefully (no real send)
      if (action.includes('YOUR_FORM_ID') || !action) {
        console.warn('Formspree endpoint henüz ayarlanmadı (action="YOUR_FORM_ID"). Form gönderilmedi.');
        console.log('Form data:', Object.fromEntries(new FormData(form)));
        showState(successByLang[currentLang] || successByLang.tr, 'linear-gradient(135deg, #25D366, #128C7E)');
        reset(true);
        return;
      }

      btn.disabled = true;
      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          showState(successByLang[currentLang] || successByLang.tr, 'linear-gradient(135deg, #25D366, #128C7E)');
          reset(true);
        } else {
          showState(errorByLang[currentLang] || errorByLang.tr, 'linear-gradient(135deg, #E42320, #B91C1A)');
          reset(false);
        }
      } catch (err) {
        console.error('Form submit error:', err);
        showState(errorByLang[currentLang] || errorByLang.tr, 'linear-gradient(135deg, #E42320, #B91C1A)');
        reset(false);
      } finally {
        setTimeout(() => { btn.disabled = false; }, 3000);
      }
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
  const translations = {
    tr: {
      nav_about: "Hakkımızda",
      nav_services: "Hizmetler",
      nav_journey: "Süreç",
      nav_results: "Sonuçlar",
      nav_whyus: "Neden Biz",
      nav_tourism: "Sağlık Turizmi",
      nav_contact: "İletişim",
      hero_badge: "Türkiye'nin Güvenilir Saç Ekim Merkezi",
      hero_title1: "Yeni Saçlarınız,",
      hero_title2: "Yeni Hayatınız.",
      hero_subtitle: "9 yıllık deneyim ve 5.000'den fazla başarılı operasyonla, doğal ve kalıcı sonuçlar sunuyoruz.",
      hero_cta1: "Ücretsiz Konsültasyon",
      stat_years: "Yıl Deneyim",
      stat_ops: "Başarılı Operasyon",
      stat_countries: "Ülke",
      stat_satisfaction: "Memnuniyet",
      about_label: "HAKKIMIZDA",
      about_title: "Türkiye'nin <span class=\"text-accent\">Güvenilir Saç Ekim Kliniği</span>",
      about_text1: "Visit Hair Clinic, 9 yılı aşkın saha deneyimi ve 5.000'den fazla başarılı operasyonla Türkiye'nin önde gelen saç ekim kliniklerinden biridir. İstanbul'daki modern merkezimizde, dünyanın dört bir yanından gelen misafirlerimize doğal ve kalıcı sonuçlar sunuyoruz.",
      about_text2: "FUE, DHI ve Safir FUE başta olmak üzere en güncel tekniklerle; kişiye özel saç çizgisi tasarımı, uzman ekip ve uçtan uca planlanmış bir deneyim sağlıyoruz. Kurucumuz ve baş uzmanımız Sedat Kuren öncülüğünde; hijyen, güven ve estetik her zaman önceliğimizdir.",
      about_badge: "Yıllık Deneyim",
      about_f1_title: "Modern Klinik & Hijyen",
      about_f1_text: "Steril ameliyathane standartları",
      about_f2_title: "Uzman Doktor Ekibi",
      about_f2_text: "Deneyimli sağlık kadrosu",
      about_f3_title: "5.000+ Operasyon",
      about_f3_text: "7+ ülkeden mutlu misafir",
      about_f4_title: "Kişiye Özel Tasarım",
      about_f4_text: "Doğal saç çizgisi garantisi",
      services_label: "HİZMETLERİMİZ",
      services_title: "Uzman Olduğumuz <span class=\"text-accent\">Tedaviler</span>",
      services_desc: "En son teknoloji ve tekniklerle, her hastaya özel çözümler sunuyoruz.",
      srv_fue_title: "FUE Saç Ekimi",
      srv_fue_text: "Foliküler Ünite Ekstraksiyonu yöntemiyle iz bırakmadan, doğal sonuçlar elde edilir. En çok tercih edilen yöntemdir.",
      srv_popular: "En Popüler",
      srv_dhi_title: "DHI Saç Ekimi",
      srv_dhi_text: "Choi kalemi ile kanal açma ve ekim işlemi eş zamanlı yapılır. Daha yoğun ve doğal sonuç sağlar.",
      srv_premium: "Premium",
      srv_sapphire_title: "Safir FUE",
      srv_sapphire_text: "Safir uçlu bıçaklarla mikro kanallar açılır. Daha hızlı iyileşme ve minimum doku hasarı sağlar.",
      srv_advanced: "Gelişmiş",
      srv_beard_title: "Sakal & Bıyık Ekimi",
      srv_beard_text: "Seyrek veya boş bölgelere doğal görünümlü sakal ve bıyık ekimi yapılır. Kalıcı sonuçlar elde edilir.",
      srv_eyebrow_title: "Kaş Ekimi",
      srv_eyebrow_text: "Doğal kaş formuna uygun şekilde, tek tek folikül ekimi yapılır. Yüz ifadesini tamamlayan estetik sonuçlar.",
      srv_prp_title: "PRP & Mezoterapi",
      srv_prp_text: "Saç dökülmesini durduran ve mevcut saçları güçlendiren destekleyici tedaviler. Operasyon öncesi ve sonrası uygulanır.",
      journey_label: "SÜREÇ",
      journey_title: "Hasta <span class=\"text-accent\">Yolculuğunuz</span>",
      journey_desc: "İlk görüşmeden sonuca kadar her adımda yanınızdayız.",
      step1_title: "Online Konsültasyon",
      step1_text: "Fotoğraflarınızı gönderin, ücretsiz analiz ve kişiye özel tedavi planı oluşturalım.",
      step2_title: "Varış & Karşılama",
      step2_text: "VIP havaalanı transferi ve 5 yıldızlı otel konaklamanız hazır. Sizi karşılıyoruz.",
      step3_title: "Saç Çizgisi Tasarımı",
      step3_text: "Yüz yapınıza uygun, doğal saç çizgisi tasarımı birlikte planlanır.",
      step4_title: "Operasyon",
      step4_text: "Lokal anestezi altında, 6-8 saat süren konforlu operasyon. Ağrısız ve güvenli.",
      step5_title: "Sonuç & Takip",
      step5_text: "12 ay boyunca online takip ve kontrol. Doğal sonuçlarınızın keyfini çıkarın.",
      results_label: "SONUÇLARIMIZ",
      results_title: "Gerçek Hastalar, <span class=\"text-accent\">Gerçek Sonuçlar</span>",
      results_desc: "Önce ve sonra fotoğraflarıyla operasyonlarımızın sonuçlarını inceleyin.",
      case1_detail: "Vaka #1 — Erkek, Ön Bölge",
      case2_detail: "Vaka #2 — Kadın, Saç Çizgisi",
      case3_detail: "Vaka #3 — Erkek, Ön Bölge",
      case4_detail: "Vaka #4 — Erkek, Tepe Bölge",
      case5_detail: "Vaka #5 — Erkek, Ön Bölge",
      case6_detail: "Vaka #6 — Erkek, Ön Bölge",
      whyus_label: "NEDEN BİZ",
      whyus_title: "Visit Hair Clinic'i <span class=\"text-accent\">Tercih Etmeniz İçin</span>",
      why1_title: "Kişiye Özel Saç Çizgisi",
      why1_text: "Her hastanın yüz yapısına uygun, doğal görünümlü saç çizgisi tasarımı",
      why2_title: "En Son Teknoloji",
      why2_text: "FUE, DHI, Safir FUE — sektörün en güncel teknik ve ekipmanları",
      why3_title: "12 Ay Takip",
      why3_text: "Operasyon sonrası 12 ay boyunca düzenli online kontrol ve destek",
      why4_title: "3 Dilde Hizmet",
      why4_text: "Türkçe, İngilizce ve Arapça dillerinde iletişim ve destek",
      why5_title: "Uzman Doktor Ekibi",
      why5_text: "Anlaşmalı uzman doktorlarla güvenli ve profesyonel operasyonlar",
      why6_title: "%98 Memnuniyet",
      why6_text: "5.000'den fazla mutlu hasta ve doğal sonuç garantisi",
      tourism_label: "SAĞLIK TURİZMİ",
      tourism_title: "Türkiye'de <span class=\"text-accent\">All-Inclusive</span> Saç Ekimi",
      tourism_text: "Uluslararası hastalarımız için her şey dahil paketler sunuyoruz. Havaalanından ayrılana kadar her detay sizin için planlanır.",
      tour_f1: "VIP Havaalanı Transferi",
      tour_f2: "5 Yıldızlı Otel Konaklaması",
      tour_f3: "Operasyon & Tüm Malzemeler",
      tour_f4: "İlaçlar & Bakım Seti",
      tour_f5: "Tercüman Desteği",
      tour_f6: "12 Ay Online Takip",
      tour_cta: "Ücretsiz Fiyat Teklifi Al",
      tour_countries_title: "Hizmet Verdiğimiz Ülkeler",
      tour_map_text: "Dünyanın her yerinden hastalarımızı ağırlıyoruz",
      country_sa: "S. Arabistan",
      country_it: "İtalya",
      country_jo: "Ürdün",
      country_ae: "Dubai",
      test_label: "REFERANSLAR",
      test_title: "Hastalarımız <span class=\"text-accent\">Ne Diyor?</span>",
      test1_text: "\"Operasyon sürecinin başından sonuna kadar profesyonel bir deneyimdi. Sonuçlardan çok memnunum. Sedat Bey ve ekibi harika bir iş çıkardı.\"",
      test2_text: "\"Prosedür için İtalya'dan geldim. Otel, transfer ve operasyonun kendisi dahil her şey kusursuz organize edilmişti. Sonuçlar beklentilerimi aştı.\"",
      test3_text: "\"Baştan sona harika bir deneyimdi. Sonuçlar çok doğal ve ekip profesyonel. Kliniği ziyaret etmenizi şiddetle tavsiye ederim.\"",
      contact_label: "İLETİŞİM",
      contact_title: "Ücretsiz <span class=\"text-accent\">Konsültasyon</span>",
      contact_text: "Saç durumunuzu analiz edelim ve size özel tedavi planı oluşturalım. Fotoğraflarınızı gönderin, 24 saat içinde dönüş yapalım.",
      contact_wa_text: "Hızlı yanıt alın",
      contact_hours_title: "Çalışma Saatleri",
      contact_hours_text: "7/24 — Her zaman ulaşılabilir",
      form_name: "Ad Soyad",
      form_email: "E-posta",
      form_phone: "Telefon",
      form_country: "Ülke",
      form_country_select: "Seçiniz",
      form_country_other: "Diğer",
      form_message: "Mesajınız",
      form_submit: "Gönder",
      footer_tagline: "Yeni saçlarınız, yeni hayatınız.",
      footer_quick: "Hızlı Linkler",
      footer_services: "Hizmetlerimiz",
      footer_contact: "İletişim",
      footer_rights: "Tüm hakları saklıdır.",
      footer_privacy: "Gizlilik Politikası",
      footer_kvkk: "KVKK Aydınlatma Metni",
      footer_cookies: "Çerez Politikası",
      cookie_text: "Bu web sitesi, deneyiminizi iyileştirmek için çerezler kullanmaktadır. Sitemizi kullanarak <a href=\"privacy.html\">Gizlilik Politikası</a> ve <a href=\"kvkk.html\">KVKK Aydınlatma Metni</a>'ni kabul etmiş sayılırsınız.",
      cookie_accept: "Kabul Et",
      cookie_decline: "Reddet",
    },
    en: {
      nav_about: "About Us",
      nav_services: "Services",
      nav_journey: "Process",
      nav_results: "Results",
      nav_whyus: "Why Us",
      nav_tourism: "Health Tourism",
      nav_contact: "Contact",
      hero_badge: "Turkey's Trusted Hair Transplant Center",
      hero_title1: "Your New Hair,",
      hero_title2: "Your New Life.",
      hero_subtitle: "With 9 years of experience and over 5,000 successful operations, we deliver natural and lasting results.",
      hero_cta1: "Free Consultation",
      stat_years: "Years Experience",
      stat_ops: "Successful Operations",
      stat_countries: "Countries",
      stat_satisfaction: "Satisfaction",
      about_label: "ABOUT US",
      about_title: "Turkey's <span class=\"text-accent\">Trusted Hair Transplant Clinic</span>",
      about_text1: "Visit Hair Clinic is one of Turkey's leading hair transplant clinics, with over 9 years of field experience and more than 5,000 successful operations. At our modern center in Istanbul, we deliver natural and lasting results to guests from all around the world.",
      about_text2: "With the latest techniques — including FUE, DHI and Sapphire FUE — we provide personalized hairline design, an expert team and an end-to-end planned experience. Led by our founder and lead specialist Sedat Kuren, hygiene, trust and aesthetics are always our priority.",
      about_badge: "Years Experience",
      about_f1_title: "Modern Clinic & Hygiene",
      about_f1_text: "Sterile operating-room standards",
      about_f2_title: "Expert Medical Team",
      about_f2_text: "Experienced healthcare staff",
      about_f3_title: "5,000+ Operations",
      about_f3_text: "Happy guests from 7+ countries",
      about_f4_title: "Personalized Design",
      about_f4_text: "Natural hairline guarantee",
      services_label: "OUR SERVICES",
      services_title: "Treatments We <span class=\"text-accent\">Specialize In</span>",
      services_desc: "We offer personalized solutions with the latest technology and techniques.",
      srv_fue_title: "FUE Hair Transplant",
      srv_fue_text: "With the Follicular Unit Extraction method, natural results are achieved without scarring. It is the most preferred technique.",
      srv_popular: "Most Popular",
      srv_dhi_title: "DHI Hair Transplant",
      srv_dhi_text: "Canal opening and implantation are performed simultaneously with the Choi pen, providing denser and more natural results.",
      srv_premium: "Premium",
      srv_sapphire_title: "Sapphire FUE",
      srv_sapphire_text: "Micro-channels are opened with sapphire-tipped blades, ensuring faster healing and minimal tissue damage.",
      srv_advanced: "Advanced",
      srv_beard_title: "Beard & Moustache Transplant",
      srv_beard_text: "Natural-looking beard and moustache transplantation for sparse or empty areas, with permanent results.",
      srv_eyebrow_title: "Eyebrow Transplant",
      srv_eyebrow_text: "Follicles are implanted one by one in line with the natural brow shape — aesthetic results that complete your facial expression.",
      srv_prp_title: "PRP & Mesotherapy",
      srv_prp_text: "Supportive treatments that stop hair loss and strengthen existing hair, applied before and after the operation.",
      journey_label: "PROCESS",
      journey_title: "Your Patient <span class=\"text-accent\">Journey</span>",
      journey_desc: "We're with you every step — from first consultation to final result.",
      step1_title: "Online Consultation",
      step1_text: "Send your photos and let us prepare a free analysis and a personalized treatment plan.",
      step2_title: "Arrival & Welcome",
      step2_text: "Your VIP airport transfer and 5-star hotel stay are ready. We welcome you on arrival.",
      step3_title: "Hairline Design",
      step3_text: "A natural hairline suited to your facial structure is planned together.",
      step4_title: "The Operation",
      step4_text: "A comfortable 6–8 hour operation under local anesthesia. Painless and safe.",
      step5_title: "Result & Follow-up",
      step5_text: "Online follow-up and check-ups for 12 months. Enjoy your natural results.",
      results_label: "OUR RESULTS",
      results_title: "Real Patients, <span class=\"text-accent\">Real Results</span>",
      results_desc: "Explore our operation results with before and after photos.",
      case1_detail: "Case #1 — Male, Front Area",
      case2_detail: "Case #2 — Female, Hairline",
      case3_detail: "Case #3 — Male, Front Area",
      case4_detail: "Case #4 — Male, Crown Area",
      case5_detail: "Case #5 — Male, Front Area",
      case6_detail: "Case #6 — Male, Front Area",
      whyus_label: "WHY US",
      whyus_title: "Reasons to Choose <span class=\"text-accent\">Visit Hair Clinic</span>",
      why1_title: "Personalized Hairline",
      why1_text: "A natural-looking hairline designed to suit each patient's facial structure",
      why2_title: "Latest Technology",
      why2_text: "FUE, DHI, Sapphire FUE — the industry's most up-to-date techniques and equipment",
      why3_title: "12-Month Follow-up",
      why3_text: "Regular online check-ups and support for 12 months after the operation",
      why4_title: "Service in 3 Languages",
      why4_text: "Communication and support in Turkish, English and Arabic",
      why5_title: "Expert Medical Team",
      why5_text: "Safe and professional operations with partner specialist doctors",
      why6_title: "98% Satisfaction",
      why6_text: "Over 5,000 happy patients and a natural-result guarantee",
      tourism_label: "HEALTH TOURISM",
      tourism_title: "<span class=\"text-accent\">All-Inclusive</span> Hair Transplant in Turkey",
      tourism_text: "We offer all-inclusive packages for our international patients. Every detail is planned for you from airport arrival to departure.",
      tour_f1: "VIP Airport Transfer",
      tour_f2: "5-Star Hotel Accommodation",
      tour_f3: "Operation & All Supplies",
      tour_f4: "Medication & Care Kit",
      tour_f5: "Interpreter Support",
      tour_f6: "12-Month Online Follow-up",
      tour_cta: "Get a Free Quote",
      tour_countries_title: "Countries We Serve",
      tour_map_text: "We welcome patients from all over the world",
      country_sa: "Saudi Arabia",
      country_it: "Italy",
      country_jo: "Jordan",
      country_ae: "Dubai",
      test_label: "TESTIMONIALS",
      test_title: "What Our <span class=\"text-accent\">Patients Say</span>",
      test1_text: "\"It was a professional experience from start to finish. I'm very pleased with the results. Mr. Sedat and his team did a wonderful job.\"",
      test2_text: "\"I came from Italy for the procedure. Everything was perfectly organized — hotel, transfer, and the operation itself. The results exceeded my expectations.\"",
      test3_text: "\"A wonderful experience from beginning to end. The results are very natural and the team is professional. I highly recommend visiting the clinic.\"",
      contact_label: "CONTACT",
      contact_title: "Free <span class=\"text-accent\">Consultation</span>",
      contact_text: "Let us analyze your hair condition and create a personalized treatment plan. Send your photos and we'll respond within 24 hours.",
      contact_wa_text: "Get a quick reply",
      contact_hours_title: "Working Hours",
      contact_hours_text: "24/7 — Always reachable",
      form_name: "Full Name",
      form_email: "Email",
      form_phone: "Phone",
      form_country: "Country",
      form_country_select: "Select",
      form_country_other: "Other",
      form_message: "Your Message",
      form_submit: "Send",
      footer_tagline: "Your new hair, your new life.",
      footer_quick: "Quick Links",
      footer_services: "Our Services",
      footer_contact: "Contact",
      footer_rights: "All rights reserved.",
      footer_privacy: "Privacy Policy",
      footer_kvkk: "KVKK Disclosure",
      footer_cookies: "Cookie Policy",
      cookie_text: "This website uses cookies to improve your experience. By using our site, you accept our <a href=\"privacy.html\">Privacy Policy</a> and <a href=\"kvkk.html\">KVKK Disclosure</a>.",
      cookie_accept: "Accept",
      cookie_decline: "Decline",
    },
    ar: {
      nav_about: "من نحن",
      nav_services: "خدماتنا",
      nav_journey: "المراحل",
      nav_results: "النتائج",
      nav_whyus: "لماذا نحن",
      nav_tourism: "السياحة العلاجية",
      nav_contact: "اتصل بنا",
      hero_badge: "مركز زراعة الشعر الموثوق في تركيا",
      hero_title1: "شعرك الجديد،",
      hero_title2: "حياتك الجديدة.",
      hero_subtitle: "مع 9 سنوات من الخبرة وأكثر من 5000 عملية ناجحة، نقدم نتائج طبيعية ودائمة.",
      hero_cta1: "استشارة مجانية",
      stat_years: "سنوات خبرة",
      stat_ops: "عملية ناجحة",
      stat_countries: "دول",
      stat_satisfaction: "رضا العملاء",
      about_label: "من نحن",
      about_title: "العيادة <span class=\"text-accent\">الموثوقة لزراعة الشعر في تركيا</span>",
      about_text1: "تُعد Visit Hair Clinic من العيادات الرائدة في زراعة الشعر في تركيا، بخبرة ميدانية تتجاوز 9 سنوات وأكثر من 5000 عملية ناجحة. في مركزنا الحديث في إسطنبول، نقدم نتائج طبيعية ودائمة لضيوفنا من جميع أنحاء العالم.",
      about_text2: "بأحدث التقنيات — بما في ذلك FUE وDHI والياقوت FUE — نوفر تصميم خط شعر مخصص وفريقاً متخصصاً وتجربة مخطط لها من البداية إلى النهاية. بقيادة مؤسسنا وكبير الأخصائيين سيدات كورين، تظل النظافة والثقة والجمال أولويتنا دائماً.",
      about_badge: "سنوات الخبرة",
      about_f1_title: "عيادة حديثة ونظافة",
      about_f1_text: "معايير غرفة عمليات معقمة",
      about_f2_title: "فريق طبي متخصص",
      about_f2_text: "كادر صحي ذو خبرة",
      about_f3_title: "+5000 عملية",
      about_f3_text: "ضيوف سعداء من أكثر من 7 دول",
      about_f4_title: "تصميم مخصص",
      about_f4_text: "ضمان خط شعر طبيعي",
      services_label: "خدماتنا",
      services_title: "العلاجات التي <span class=\"text-accent\">نتخصص فيها</span>",
      services_desc: "نقدم حلولاً مخصصة بأحدث التقنيات والتكنولوجيا.",
      srv_fue_title: "زراعة الشعر FUE",
      srv_fue_text: "بتقنية اقتطاف الوحدات المسامية يتم الحصول على نتائج طبيعية دون ندوب. وهي الطريقة الأكثر تفضيلاً.",
      srv_popular: "الأكثر شيوعاً",
      srv_dhi_title: "زراعة الشعر DHI",
      srv_dhi_text: "يتم فتح القنوات والزراعة في آنٍ واحد باستخدام قلم تشوي، مما يوفر نتائج أكثف وأكثر طبيعية.",
      srv_premium: "بريميوم",
      srv_sapphire_title: "الياقوت FUE",
      srv_sapphire_text: "تُفتح قنوات دقيقة بشفرات من الياقوت، مما يضمن شفاءً أسرع وأقل ضرراً للأنسجة.",
      srv_advanced: "متقدم",
      srv_beard_title: "زراعة اللحية والشارب",
      srv_beard_text: "زراعة لحية وشارب بمظهر طبيعي للمناطق الخفيفة أو الفارغة، مع نتائج دائمة.",
      srv_eyebrow_title: "زراعة الحواجب",
      srv_eyebrow_text: "تُزرع البصيلات واحدة تلو الأخرى وفقاً للشكل الطبيعي للحاجب — نتائج جمالية تكمل ملامح وجهك.",
      srv_prp_title: "PRP والميزوثيرابي",
      srv_prp_text: "علاجات داعمة توقف تساقط الشعر وتقوي الشعر الموجود، تُطبَّق قبل العملية وبعدها.",
      journey_label: "المراحل",
      journey_title: "رحلة <span class=\"text-accent\">المريض</span>",
      journey_desc: "نحن معك في كل خطوة — من الاستشارة الأولى إلى النتيجة النهائية.",
      step1_title: "استشارة عبر الإنترنت",
      step1_text: "أرسل صورك ودعنا نعد لك تحليلاً مجانياً وخطة علاج مخصصة.",
      step2_title: "الوصول والاستقبال",
      step2_text: "نقلك من المطار VIP وإقامتك في فندق 5 نجوم جاهزة. نستقبلك عند وصولك.",
      step3_title: "تصميم خط الشعر",
      step3_text: "نخطط معاً لخط شعر طبيعي يناسب ملامح وجهك.",
      step4_title: "العملية",
      step4_text: "عملية مريحة تستغرق 6–8 ساعات تحت التخدير الموضعي. بلا ألم وآمنة.",
      step5_title: "النتيجة والمتابعة",
      step5_text: "متابعة ومراجعات عبر الإنترنت لمدة 12 شهراً. استمتع بنتائجك الطبيعية.",
      results_label: "نتائجنا",
      results_title: "مرضى حقيقيون، <span class=\"text-accent\">نتائج حقيقية</span>",
      results_desc: "استعرض نتائج عملياتنا بصور قبل وبعد.",
      case1_detail: "الحالة #1 — رجل، المنطقة الأمامية",
      case2_detail: "الحالة #2 — امرأة، خط الشعر",
      case3_detail: "الحالة #3 — رجل، المنطقة الأمامية",
      case4_detail: "الحالة #4 — رجل، منطقة التاج",
      case5_detail: "الحالة #5 — رجل، المنطقة الأمامية",
      case6_detail: "الحالة #6 — رجل، المنطقة الأمامية",
      whyus_label: "لماذا نحن",
      whyus_title: "أسباب لاختيار <span class=\"text-accent\">Visit Hair Clinic</span>",
      why1_title: "خط شعر مخصص",
      why1_text: "تصميم خط شعر بمظهر طبيعي يناسب ملامح وجه كل مريض",
      why2_title: "أحدث التقنيات",
      why2_text: "FUE وDHI والياقوت FUE — أحدث تقنيات ومعدات القطاع",
      why3_title: "متابعة 12 شهراً",
      why3_text: "مراجعات ودعم منتظم عبر الإنترنت لمدة 12 شهراً بعد العملية",
      why4_title: "خدمة بثلاث لغات",
      why4_text: "تواصل ودعم باللغات التركية والإنجليزية والعربية",
      why5_title: "فريق طبي متخصص",
      why5_text: "عمليات آمنة واحترافية مع أطباء متخصصين شركاء",
      why6_title: "رضا 98%",
      why6_text: "أكثر من 5000 مريض سعيد وضمان نتائج طبيعية",
      tourism_label: "السياحة العلاجية",
      tourism_title: "زراعة شعر <span class=\"text-accent\">شاملة</span> في تركيا",
      tourism_text: "نقدم باقات شاملة لمرضانا الدوليين. كل التفاصيل مخططة من وصولك إلى المطار حتى مغادرتك.",
      tour_f1: "نقل VIP من المطار",
      tour_f2: "إقامة في فندق 5 نجوم",
      tour_f3: "العملية وجميع المستلزمات",
      tour_f4: "الأدوية ومجموعة العناية",
      tour_f5: "دعم مترجم",
      tour_f6: "متابعة عبر الإنترنت 12 شهراً",
      tour_cta: "احصل على عرض سعر مجاني",
      tour_countries_title: "الدول التي نخدمها",
      tour_map_text: "نستقبل مرضى من جميع أنحاء العالم",
      country_sa: "السعودية",
      country_it: "إيطاليا",
      country_jo: "الأردن",
      country_ae: "دبي",
      test_label: "آراء العملاء",
      test_title: "ماذا يقول <span class=\"text-accent\">مرضانا</span>",
      test1_text: "\"كانت تجربة احترافية من البداية إلى النهاية. أنا سعيد جداً بالنتائج. قدّم السيد سيدات وفريقه عملاً رائعاً.\"",
      test2_text: "\"جئت من إيطاليا لإجراء العملية. كان كل شيء منظماً بشكل مثالي — الفندق والنقل والعملية نفسها. فاقت النتائج توقعاتي.\"",
      test3_text: "\"تجربة رائعة من البداية إلى النهاية. النتائج طبيعية جداً وفريق العمل محترف. أنصح بشدة بزيارة العيادة.\"",
      contact_label: "اتصل بنا",
      contact_title: "استشارة <span class=\"text-accent\">مجانية</span>",
      contact_text: "دعنا نحلل حالة شعرك ونضع خطة علاج مخصصة لك. أرسل صورك وسنرد خلال 24 ساعة.",
      contact_wa_text: "احصل على رد سريع",
      contact_hours_title: "ساعات العمل",
      contact_hours_text: "24/7 — متاح دائماً",
      form_name: "الاسم الكامل",
      form_email: "البريد الإلكتروني",
      form_phone: "الهاتف",
      form_country: "البلد",
      form_country_select: "اختر",
      form_country_other: "أخرى",
      form_message: "رسالتك",
      form_submit: "إرسال",
      footer_tagline: "شعرك الجديد، حياتك الجديدة.",
      footer_quick: "روابط سريعة",
      footer_services: "خدماتنا",
      footer_contact: "اتصل بنا",
      footer_rights: "جميع الحقوق محفوظة.",
      footer_privacy: "سياسة الخصوصية",
      footer_kvkk: "بيان KVKK",
      footer_cookies: "سياسة ملفات الارتباط",
      cookie_text: "يستخدم هذا الموقع ملفات تعريف الارتباط لتحسين تجربتك. باستخدامك للموقع فإنك توافق على <a href=\"privacy.html\">سياسة الخصوصية</a> و<a href=\"kvkk.html\">بيان KVKK</a>.",
      cookie_accept: "قبول",
      cookie_decline: "رفض",
    }
  };

  let currentLang = 'tr';

  const ogLocaleByLang = { tr: 'tr_TR', en: 'en_US', ar: 'ar_SA' };

  const switchLanguage = (lang, updateUrl = true) => {
    const t = translations[lang];
    if (!t) return;
    currentLang = lang;

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (/<[a-z]/i.test(t[key])) {
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

    // Persist choice + reflect in URL (helps SEO / hreflang and sharing)
    try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale && ogLocaleByLang[lang]) ogLocale.setAttribute('content', ogLocaleByLang[lang]);
    if (updateUrl && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url);
    }
  };

  // Bind language buttons
  document.querySelectorAll('.lang-btn, .lang-btn-sm').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.getAttribute('data-lang'));
    });
  });

  // ── Initial language: ?lang= param > saved choice > browser language > 'tr' ──
  const detectInitialLang = () => {
    const supported = ['tr', 'en', 'ar'];
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && supported.includes(urlLang)) return urlLang;
    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) { /* ignore */ }
    if (saved && supported.includes(saved)) return saved;
    const nav = (navigator.language || 'tr').slice(0, 2).toLowerCase();
    if (supported.includes(nav)) return nav;
    return 'tr';
  };

  const initialLang = detectInitialLang();
  if (initialLang !== 'tr') {
    switchLanguage(initialLang, false);
  } else {
    // ensure html lang/dir + og:locale are correct for default
    document.documentElement.lang = 'tr';
    document.documentElement.dir = 'ltr';
  }

});
