/**
 * Venezuela Travel Website - Main JavaScript
 * Handles scroll behavior, animations, and interactive effects
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initCTAButton();
    initNavbar();
    initAnimations();
    initWelcomeModal();
});

/**
 * Initialize scroll-based effects
 */
function initScrollEffects() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');

        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateStats(entry.target);
            }
        });
    }, observerOptions);

    // Observe all preview sections
    document.querySelectorAll('.preview-section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize CTA Button functionality
 */
function initCTAButton() {
    const ctaButton = document.getElementById('startJourney');

    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const firstSection = document.querySelector('.beach-section');

            if (firstSection) {
                firstSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Add ripple effect on click
        ctaButton.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

/**
 * Initialize navbar behavior
 */
function initNavbar() {
    const navbar = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Highlight active section in navbar
    const sections = document.querySelectorAll('section[class*="section"]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('class').split(' ')[1];
            }
        });

        // Update active state (currently only highlights home)
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === 'index.html' && window.pageYOffset < window.innerHeight) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Initialize custom animations
 */
function initAnimations() {
    // Add dynamic particle generation
    const particlesContainer = document.querySelector('.particles');

    if (particlesContainer) {
        // Create additional random particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Animate feature items on hover
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Animate badges on hover
    const badges = document.querySelectorAll('.badge-item');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.badge-icon');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(15deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        badge.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.badge-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

/**
 * Animate statistics counters
 */
function animateStats(section) {
    if (!section.classList.contains('gamification-section')) return;

    const statValues = section.querySelectorAll('.stat-value');
    const hasAnimated = section.dataset.animated;

    if (!hasAnimated) {
        statValues.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let currentValue = 0;
            const increment = Math.ceil(finalValue / 50);
            const duration = 1500;
            const stepTime = duration / (finalValue / increment);

            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue;
                    clearInterval(counter);
                } else {
                    stat.textContent = currentValue;
                }
            }, stepTime);
        });

        section.dataset.animated = 'true';
    }
}

/**
 * Add ripple effect CSS dynamically
 */
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    .cta-button {
        position: relative;
        overflow: hidden;
    }

    .visible {
        animation: section-fade-in 1s ease forwards;
    }

    @keyframes section-fade-in {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

/**
 * Initialize welcome modal for first-time visitors
 */
function initWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const startButton = document.getElementById('startAdventure');

    if (!modal || !startButton) return;

    // Check if user is a first-time visitor
    const hasVisited = localStorage.getItem('venezuelaHasVisited');

    if (!hasVisited) {
        // Show welcome modal after a short delay
        setTimeout(() => {
            modal.classList.add('show');
        }, 500);

        // Handle start button click
        startButton.addEventListener('click', () => {
            // Mark as visited
            localStorage.setItem('venezuelaHasVisited', 'true');

            // Hide modal
            modal.classList.remove('show');

            // Award First Steps badge if gamification is loaded
            if (window.VenezuelaGame) {
                setTimeout(() => {
                    window.VenezuelaGame.addPoints(50, 'Starting your adventure');

                    // Show a welcome notification
                    if (window.VenezuelaNotifications) {
                        window.VenezuelaNotifications.success('Your adventure has begun! 🌴');
                    }
                }, 500);
            }

            // Scroll to first section
            const firstSection = document.querySelector('.beach-section');
            if (firstSection) {
                setTimeout(() => {
                    firstSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });

        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                localStorage.setItem('venezuelaHasVisited', 'true');
            }
        });
    }
}

/**
 * Console message for developers
 */
console.log('%c🌴 Welcome to Discover Venezuela! 🌴', 'color: #006994; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with passion for adventure and exploration', 'color: #FF6B35; font-size: 14px;');
