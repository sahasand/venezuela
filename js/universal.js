/**
 * Universal JavaScript for all pages
 * Handles: Loading animation, Scroll-to-top, Footer stats, Scroll animations
 */

// ===================================
// Page Loader
// ===================================
window.addEventListener('load', () => {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        // Hide loader after page loads
        setTimeout(() => {
            pageLoader.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                pageLoader.remove();
            }, 500);
        }, 500);
    }
});

// ===================================
// Scroll-to-Top Button
// ===================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Update Footer Gamification Stats
// ===================================
function updateFooterStats() {
    // Get stats from gamification system
    const stats = window.gamification?.getStats() || { points: 0, level: 'Explorer', badges: 0 };

    // Update footer display
    const footerPoints = document.getElementById('footer-points');
    const footerLevel = document.getElementById('footer-level');
    const footerBadges = document.getElementById('footer-badges');

    if (footerPoints) footerPoints.textContent = stats.points || 0;
    if (footerLevel) footerLevel.textContent = stats.level || 'Explorer';
    if (footerBadges) footerBadges.textContent = `${stats.badges || 0}/12`;
}

// Update footer stats on page load
window.addEventListener('load', () => {
    // Wait a bit for gamification.js to initialize
    setTimeout(updateFooterStats, 100);
});

// Listen for gamification updates
window.addEventListener('gamification-update', updateFooterStats);

// ===================================
// Scroll-Triggered Fade-In Animations
// ===================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.scroll-fade-in');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => observer.observe(element));
}

// Initialize scroll animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// ===================================
// Enhanced Navigation Highlighting
// ===================================
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Highlight current page on load
window.addEventListener('load', highlightCurrentPage);

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===================================
// Add Ripple Effect to Buttons
// ===================================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple-effect');

    const existingRipple = button.querySelector('.ripple-effect');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple to all buttons
document.querySelectorAll('button, .cta-button, .explore-button, .action-button').forEach(button => {
    button.addEventListener('click', createRipple);
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🌴 Welcome to Discover Venezuela! 🌴', 'font-size: 20px; font-weight: bold; color: #FF6B35;');
console.log('%cExplore stunning beaches, majestic mountains, and earn badges!', 'font-size: 14px; color: #0098D9;');
console.log('%cHappy exploring! 🗺️', 'font-size: 14px; color: #52B788;');
