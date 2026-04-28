(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function updateThemeLabel() {
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre');
    themeToggle.innerHTML = '<span aria-hidden="true">' + (theme === 'dark' ? '☀︎' : '◐') + '</span>';
  }

  if (themeToggle) {
    updateThemeLabel();
    themeToggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateThemeLabel();
    });
  }

  const counters = document.querySelectorAll('.counter');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1200;
    const start = performance.now();

    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  if (!reduceMotion) {
    const heroCard = document.querySelector('.hero-card');

    if (heroCard) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counters.forEach(animateCounter);
            observer.disconnect();
          }
        });
      }, { threshold: 0.45 });

      counterObserver.observe(heroCard);
    }
  } else {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.target;
    });
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove('is-selected'));
      button.classList.add('is-selected');

      projectCards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        card.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.site-nav a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.55 });

  sections.forEach((section) => navObserver.observe(section));

  const revealElements = document.querySelectorAll('.reveal');

  if (!reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form && feedback) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email || !message) {
        feedback.textContent = 'Merci de remplir tous les champs.';
        return;
      }

      if (!emailIsValid) {
        feedback.textContent = 'Merci de saisir une adresse email valide.';
        return;
      }

      feedback.textContent = 'Message prêt à être envoyé. Tu peux maintenant brancher ce formulaire à un vrai service.';
      form.reset();
    });
  }
})();