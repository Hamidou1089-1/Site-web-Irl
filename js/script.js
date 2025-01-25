document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to set theme
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    };

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') ||
        (prefersDarkScheme.matches ? 'dark' : 'light');
    setTheme(savedTheme);

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Handle system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Smooth Scroll Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Add smooth scrolling
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without reload
                history.pushState(null, '', targetId);

                // Update active state in sidebar
                document.querySelectorAll('.sidebar-nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Intersection Observer for scroll spy
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.sidebar-nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');

            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Envoi en cours...';

                const formData = new FormData(contactForm);
                const formDataObject = Object.fromEntries(formData.entries());

                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1000));

                contactForm.reset();
                alert('Message envoyé avec succès !');
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Envoyer';
            }
        });
    }

    // Add hover effect for touch devices
    if ('ontouchstart' in window) {
        document.querySelectorAll('.project-card, .content-box, .modern-button')
            .forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.style.transform = 'translateY(-5px)';
                }, { passive: true });

                element.addEventListener('touchend', function() {
                    this.style.transform = '';
                }, { passive: true });
            });
    }
});