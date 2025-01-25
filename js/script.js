document.addEventListener('DOMContentLoaded', () => {
    // Gestion du thème
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');

    // Appliquer le thème sauvegardé
    if (storedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // Gestion du changement de thème
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Navigation fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Mise à jour de l'URL sans rechargement
                history.pushState(null, '', targetId);
            }
        });
    });

    // Surligner la section active dans la sidebar
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Retirer la classe active de tous les liens
                document.querySelectorAll('.sidebar-nav a').forEach(link => {
                    link.classList.remove('active');
                });

                // Ajouter la classe active au lien correspondant
                const correspondingLink = document.querySelector(`.sidebar-nav a[href="#${entry.target.id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observer toutes les sections
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const formDataObject = Object.fromEntries(formData.entries());

            // Simulation d'envoi (à remplacer par votre logique d'envoi réelle)
            try {
                // Animation de chargement
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Envoi en cours...';
                submitButton.disabled = true;

                // Simuler un délai réseau
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Réinitialisation du formulaire et message de succès
                contactForm.reset();
                alert('Message envoyé avec succès !');

                // Restaurer le bouton
                submitButton.textContent = originalText;
                submitButton.disabled = false;

            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    }

    // Animation des cartes de projet au scroll
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Une seule animation par élément
            }
        });
    };

    const projectObserver = new IntersectionObserver(animateOnScroll, {
        threshold: 0.1
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        projectObserver.observe(card);
    });

    // Ajout des styles pour l'animation
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 0.6s ease forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .sidebar-nav a.active {
            background-color: var(--primary-color);
            color: white;
        }
    `;
    document.head.appendChild(style);
});