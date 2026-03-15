document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu toggle ---
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- Scroll-triggered animations (lightweight AOS replacement) ---
  const animateElements = document.querySelectorAll('[data-aos]');
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // --- Counter animation ---
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
          const current = eased * target;

          if (isDecimal) {
            el.textContent = current.toFixed(1);
          } else if (target >= 1000) {
            el.textContent = Math.floor(current).toLocaleString();
          } else {
            el.textContent = Math.floor(current);
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Earning bar animation ---
  const earningFill = document.querySelector('.earning-fill');
  if (earningFill) {
    const earningObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          earningFill.style.width = earningFill.style.width || '0%';
          setTimeout(() => { earningFill.style.width = '78%'; }, 300);
          earningObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    earningObserver.observe(earningFill);
  }

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- Honnavar detail slide (modal panel) ---
  const honnavarCard = document.querySelector('[data-destination="honnavar"]');
  const honnavarSlide = document.getElementById('honnavarSlide');
  const honnavarBackdrop = document.getElementById('honnavarBackdrop');
  const honnavarClose = document.getElementById('honnavarClose');

  const openHonnavarSlide = () => {
    honnavarSlide.classList.add('open');
    honnavarSlide.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    honnavarClose?.focus();
  };

  const closeHonnavarSlide = () => {
    honnavarSlide.classList.remove('open');
    honnavarSlide.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (honnavarCard && honnavarSlide && honnavarBackdrop && honnavarClose) {
    honnavarCard.addEventListener('click', openHonnavarSlide);
    honnavarClose.addEventListener('click', closeHonnavarSlide);
    honnavarBackdrop.addEventListener('click', closeHonnavarSlide);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && honnavarSlide.classList.contains('open')) {
        closeHonnavarSlide();
      }
    });
  }

  // --- Translator (text + voice) ---
  const langOptions = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'mr', label: 'Marathi' },
    { code: 'kn', label: 'Kannada' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
    { code: 'fr', label: 'French' },
    { code: 'es', label: 'Spanish' },
    { code: 'de', label: 'German' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'it', label: 'Italian' }
  ];

  const sourceLang = document.getElementById('sourceLang');
  const targetLang = document.getElementById('targetLang');
  const sourceText = document.getElementById('sourceText');
  const targetText = document.getElementById('targetText');
  const translateBtn = document.getElementById('translateBtn');
  const startSpeech = document.getElementById('startSpeech');
  const playOutput = document.getElementById('playOutput');
  const copyOutput = document.getElementById('copyOutput');
  const clearInput = document.getElementById('clearInput');

  const fillLanguageSelects = () => {
    if (!sourceLang || !targetLang) return;
    langOptions.forEach(lang => {
      const opt1 = document.createElement('option');
      opt1.value = lang.code;
      opt1.textContent = lang.label;
      sourceLang.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = lang.code;
      opt2.textContent = lang.label;
      targetLang.appendChild(opt2);
    });

    sourceLang.value = 'en';
    targetLang.value = 'hi';
  };

  const setStatus = (message) => {
    if (!translateBtn) return;
    translateBtn.textContent = message;
  };

  const translateText = async () => {
    if (!sourceText || !targetText) return;
    const text = sourceText.value.trim();
    if (!text) return;

    const source = sourceLang?.value || 'en';
    const target = targetLang?.value || 'hi';

    setStatus('Translating...');

    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source,
          target,
          format: 'text'
        })
      });

      const data = await response.json();
      if (data && data.translatedText) {
        targetText.value = data.translatedText;
      } else {
        targetText.value = 'Translation failed. Please try again.';
      }
    } catch (error) {
      targetText.value = 'Translation error. Check your network and try again.';
    } finally {
      setStatus('Translate');
    }
  };

  const speakText = (text, lang) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = window.speechSynthesis.getVoices();
    const matching = voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    if (matching) utterance.voice = matching;

    window.speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang?.value || 'en';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (sourceText) sourceText.value = transcript;
    };

    recognition.onerror = () => {
      // ignore errors silently
    };

    recognition.start();
  };

  const copyToClipboard = async () => {
    if (!targetText) return;
    try {
      await navigator.clipboard.writeText(targetText.value);
    } catch (err) {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = targetText.value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
  };

  fillLanguageSelects();

  translateBtn?.addEventListener('click', translateText);
  startSpeech?.addEventListener('click', startVoiceInput);
  playOutput?.addEventListener('click', () => {
    if (!targetText) return;
    speakText(targetText.value, targetLang?.value || 'ta');
  });
  copyOutput?.addEventListener('click', copyToClipboard);
  clearInput?.addEventListener('click', () => {
    if (sourceText) sourceText.value = '';
    if (targetText) targetText.value = '';
  });

  const openTranslatorLink = document.getElementById('openTranslator');
  const translatorSection = document.getElementById('translator');

  const openTranslator = () => {
    if (!translatorSection) return;
    sourceLang.value = 'en';
    targetLang.value = 'ta';
    if (sourceText) sourceText.focus();
    translatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  openTranslatorLink?.addEventListener('click', (event) => {
    event.preventDefault();
    openTranslator();
  });

  // --- Localee guide profile (Vignesh Kanna) ---
  const openLocaleeBtn = document.getElementById('openLocaleeBtn');
  const guideSlide = document.getElementById('guideSlide');
  const guideBackdrop = document.getElementById('guideBackdrop');
  const guideClose = document.getElementById('guideClose');
  const guideBackBtn = document.getElementById('guideBackBtn');

  const openGuideSlide = () => {
    if (!guideSlide) return;
    guideSlide.classList.add('open');
    guideSlide.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeGuideSlide = () => {
    if (!guideSlide) return;
    guideSlide.classList.remove('open');
    guideSlide.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openLocaleeBtn?.addEventListener('click', () => {
    closeHonnavarSlide();
    openGuideSlide();
  });

  guideClose?.addEventListener('click', () => {
    closeGuideSlide();
    openHonnavarSlide();
  });

  guideBackdrop?.addEventListener('click', () => {
    closeGuideSlide();
    openHonnavarSlide();
  });

  guideBackBtn?.addEventListener('click', () => {
    closeGuideSlide();
    openHonnavarSlide();
  });

  // --- Hero search behavior ---
  const searchLocation = document.getElementById('searchLocation');
  const searchDate = document.getElementById('searchDate');
  const searchGuests = document.getElementById('searchGuests');
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  const tripDate = document.getElementById('tripDate');
  const tripGuests = document.getElementById('tripGuests');

  const setSearchDefaults = () => {
    if (searchDate) {
      const today = new Date().toISOString().split('T')[0];
      searchDate.min = today;
      if (!searchDate.value) searchDate.value = today;
    }
    if (searchGuests) {
      searchGuests.min = '1';
      if (!searchGuests.value) searchGuests.value = '1';
    }
  };

  const openHonnavarFromSearch = () => {
    openHonnavarSlide();
    if (tripDate && searchDate) {
      tripDate.textContent = searchDate.value || 'Any date';
    }
    if (tripGuests && searchGuests) {
      tripGuests.textContent = searchGuests.value || '1';
    }
  };

  const triggerSearch = () => {
    const query = searchLocation?.value.trim().toLowerCase() || '';

    if (query.includes('honnavar')) {
      openHonnavarFromSearch();
    } else {
      const dest = document.getElementById('destinations');
      if (dest) dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  heroSearchBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    triggerSearch();
  });

  [searchLocation, searchDate, searchGuests].forEach((input) => {
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        triggerSearch();
      }
    });
  });

  setSearchDefaults();
});
