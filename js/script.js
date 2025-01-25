document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des différentes fonctionnalités
    initializeTheme();
    initializeNavigation();
    initializeScrollSpy();
    initializeAnimations();
    initializeContactForm();
    initializeProjectFilters();
});

// Gestion du thème
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Fonction pour définir le thème
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';

        // Ajouter une classe temporaire pour l'animation de transition
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    };

    // Initialiser le thème
    const savedTheme = localStorage.getItem('theme') ||
        (prefersDarkScheme.matches ? 'dark' : 'light');
    setTheme(savedTheme);

    // Gérer le changement de thème
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Gérer les changements de préférences système
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Navigation fluide
function initializeNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Défilement fluide
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Mettre à jour l'URL sans recharger
                history.pushState(null, '', targetId);

                // Mettre à jour l'état actif dans la sidebar
                updateActiveNavItem(targetId);
            }
        });
    });
}

// Scroll Spy amélioré
function initializeScrollSpy() {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const id = entry.target.getAttribute('id');
                updateActiveNavItem(`#${id}`);
            }
        });
    }, observerOptions);

    // Observer toutes les sections
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });
}

// Mise à jour de l'élément de navigation actif
function updateActiveNavItem(targetId) {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Animations
function initializeAnimations() {
    // Observer pour les animations d'entrée
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observer les éléments à animer
    document.querySelectorAll('.content-box, .project-card, .skill-item').forEach(element => {
        element.classList.add('pre-animation');
        animationObserver.observe(element);
    });
}

// Gestion du formulaire de contact
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');

            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Envoi en cours...';

                // Simulation d'envoi (à remplacer par votre logique d'envoi réelle)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Réinitialiser le formulaire et afficher un message de succès
                contactForm.reset();
                showNotification('Message envoyé avec succès!', 'success');
            } catch (error) {
                showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Envoyer';
            }
        });
    }
}

// Filtres des projets
function initializeProjectFilters() {
    const projectFilters = document.querySelector('.project-filters');
    if (projectFilters) {
        projectFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-button')) {
                const filter = e.target.dataset.filter;

                // Mettre à jour les boutons de filtre
                document.querySelectorAll('.filter-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Filtrer les projets
                document.querySelectorAll('.project-card').forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    }
}

// Système de notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Gestion de la performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}