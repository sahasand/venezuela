/**
 * Venezuela Travel Website - Attractions Page
 *
 * Features:
 * - Page visit tracking (+10 pts first time)
 * - Intersection Observer for scroll reveal
 * - 3D tilt effect handler
 * - Modal open/close functionality
 * - Wildlife click tracking (Wildlife Spotter badge)
 * - Tooltip hover for animal facts
 * - Quiz system (50 pts per correct)
 * - Difficulty meter scroll animation
 * - Mountain Climber badge progress
 */

class AttractionsPage {
    constructor() {
        this.wildlifeSpotted = new Set();
        this.quizScore = 0;
        this.answeredQuestions = new Set();
        this.attractionData = {
            'angel-falls': {
                title: 'Angel Falls',
                subtitle: 'Salto Ángel - World\'s Highest Waterfall',
                description: `
                    <h3>The Magnificent Angel Falls</h3>
                    <p>Plunging 979 meters (3,212 feet) from the Auyán-tepui mountain, Angel Falls is the world's highest uninterrupted waterfall. Named after American aviator Jimmie Angel who was the first to fly over the falls in 1933, this natural wonder is located in the heart of Canaima National Park.</p>
                    <p>The falls are so high that water turns to mist before reaching the ground during the dry season. The best time to visit is during the rainy season (May to November) when the waterfall is at its most spectacular.</p>
                    <h4>How to Get There:</h4>
                    <ul>
                        <li>Flight to Canaima camp from Ciudad Bolívar or Santa Elena</li>
                        <li>Boat journey up the Churún River (4-5 hours)</li>
                        <li>Guided trek through the jungle</li>
                    </ul>
                `,
                icon: '💧'
            },
            'mount-roraima': {
                title: 'Mount Roraima',
                subtitle: 'The Lost World - Ancient Tabletop Mountain',
                description: `
                    <h3>The Legendary Mount Roraima</h3>
                    <p>Rising 2,810 meters (9,219 feet) above sea level, Mount Roraima is the highest of the Pakaraima chain of tepuis (table-top mountains). This otherworldly landscape inspired Sir Arthur Conan Doyle's novel "The Lost World" and is shared by Venezuela, Brazil, and Guyana.</p>
                    <p>The summit plateau spans 31 square kilometers and features unique rock formations, crystal valleys, and endemic species found nowhere else on Earth. The journey to the top is a challenging 6-8 day trek.</p>
                    <h4>Unique Features:</h4>
                    <ul>
                        <li>Black rock formations over 2 billion years old</li>
                        <li>Carnivorous plants unique to the summit</li>
                        <li>Crystal Valley with quartz formations</li>
                        <li>Endemic black frogs and insects</li>
                    </ul>
                `,
                icon: '⛰️'
            },
            'canaima': {
                title: 'Canaima National Park',
                subtitle: 'UNESCO World Heritage Site',
                description: `
                    <h3>Canaima National Park</h3>
                    <p>Spanning 30,000 square kilometers, Canaima National Park is one of the largest national parks in the world. Approximately 65% of the park is covered by tepuis - unique table-top mountains that are among the oldest geological formations on Earth.</p>
                    <p>The park is home to indigenous Pemón people who have lived in harmony with this landscape for thousands of years. The stunning lagoon at Canaima camp offers pink sandy beaches and views of several tepuis.</p>
                    <h4>Highlights:</h4>
                    <ul>
                        <li>Over 100 tepuis (table-top mountains)</li>
                        <li>Stunning pink sand beaches</li>
                        <li>Indigenous Pemón villages</li>
                        <li>Unique flora and fauna</li>
                        <li>Multiple waterfalls including Angel Falls</li>
                    </ul>
                `,
                icon: '🏞️'
            }
        };

        this.init();
    }

    init() {
        console.log('%c🏔️ Attractions Page Initializing...', 'color: #52B788; font-size: 16px; font-weight: bold;');

        // Track page visit
        this.trackPageVisit();

        // Setup intersection observers for scroll animations
        this.setupScrollAnimations();

        // Setup 3D tilt effects
        this.setup3DTilt();

        // Setup modal functionality
        this.setupModal();

        // Setup wildlife tracking
        this.setupWildlifeTracking();

        // Setup quiz
        this.setupQuiz();

        // Setup difficulty meters
        this.setupDifficultyMeters();

        console.log('%c✅ Attractions Page Ready!', 'color: #95D5B2; font-size: 14px;');
    }

    /**
     * Track page visit and award points
     */
    trackPageVisit() {
        if (window.VenezuelaGame) {
            const visited = window.VenezuelaGame.userProgress.placesVisited.includes('attractions');

            if (!visited) {
                window.VenezuelaGame.trackPageVisit('attractions');
                console.log('🎉 First visit to Attractions page! +10 points');
            }
        }
    }

    /**
     * Setup scroll reveal animations using Intersection Observer
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animate difficulty meters when they come into view
                    if (entry.target.classList.contains('difficulty-item')) {
                        this.animateDifficultyMeter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe attraction cards
        document.querySelectorAll('.attraction-card').forEach(card => {
            observer.observe(card);
        });

        // Observe difficulty items
        document.querySelectorAll('.difficulty-item').forEach(item => {
            observer.observe(item);
        });
    }

    /**
     * Setup 3D tilt effect on attraction cards
     */
    setup3DTilt() {
        const cards = document.querySelectorAll('.attraction-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5; // -5 to 5 degrees
                const rotateY = ((x - centerX) / centerX) * 5;  // -5 to 5 degrees

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * Setup modal functionality for attraction details
     */
    setupModal() {
        const modal = document.getElementById('attractionModal');
        const modalBody = document.getElementById('modalBody');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        const cards = document.querySelectorAll('.attraction-card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const attractionId = card.getAttribute('data-attraction');
                const attraction = this.attractionData[attractionId];

                if (attraction) {
                    modalBody.innerHTML = `
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <div style="font-size: 5rem; margin-bottom: 1rem;">${attraction.icon}</div>
                            <h2 style="color: #2D5016; margin-bottom: 0.5rem;">${attraction.title}</h2>
                            <p style="color: #666; font-size: 1.1rem;">${attraction.subtitle}</p>
                        </div>
                        <div style="text-align: left; line-height: 1.8;">
                            ${attraction.description}
                        </div>
                        <div style="margin-top: 2rem; text-align: center;">
                            <button onclick="attractionsPage.closeModal()" style="
                                padding: 1rem 2rem;
                                background: linear-gradient(135deg, #52B788 0%, #2D5016 100%);
                                color: white;
                                border: none;
                                border-radius: 10px;
                                font-size: 1.1rem;
                                cursor: pointer;
                                font-weight: 600;
                            ">
                                Close
                            </button>
                        </div>
                    `;

                    modal.classList.add('show');

                    // Track exploration
                    this.trackAttractionExplored(attractionId);
                }
            });
        });

        // Close modal handlers
        modalClose.addEventListener('click', () => this.closeModal());
        modalOverlay.addEventListener('click', () => this.closeModal());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('attractionModal');
        modal.classList.remove('show');
    }

    /**
     * Track when user explores an attraction
     */
    trackAttractionExplored(attractionId) {
        if (window.VenezuelaGame) {
            const key = `attraction_${attractionId}_explored`;
            const explored = localStorage.getItem(key);

            if (!explored) {
                localStorage.setItem(key, 'true');
                window.VenezuelaGame.addPoints(25, `Explored ${attractionId}`);

                // Check for Mountain Climber badge progress
                this.checkMountainClimberProgress();
            }
        }
    }

    /**
     * Check progress towards Mountain Climber badge
     */
    checkMountainClimberProgress() {
        if (window.VenezuelaGame) {
            const angelFalls = localStorage.getItem('attraction_angel-falls_explored');
            const roraima = localStorage.getItem('attraction_mount-roraima_explored');

            if (angelFalls && roraima) {
                // User has explored both, track for badge
                window.VenezuelaGame.userProgress.placesVisited.push('angel-falls');
                window.VenezuelaGame.userProgress.placesVisited.push('roraima');
                window.VenezuelaGame.saveProgress();
                window.VenezuelaGame.checkBadges();
            }
        }
    }

    /**
     * Setup wildlife tracking
     */
    setupWildlifeTracking() {
        const wildlifeCards = document.querySelectorAll('.wildlife-card');
        const wildlifeCounter = document.querySelector('.wildlife-spotted');

        wildlifeCards.forEach(card => {
            card.addEventListener('click', () => {
                const animal = card.getAttribute('data-animal');

                if (!this.wildlifeSpotted.has(animal)) {
                    this.wildlifeSpotted.add(animal);
                    card.classList.add('spotted');

                    // Update counter
                    wildlifeCounter.textContent = this.wildlifeSpotted.size;

                    // Award points
                    if (window.VenezuelaGame) {
                        window.VenezuelaGame.addPoints(15, `Spotted ${animal}`);

                        // Update wildlife spotted count for badge
                        window.VenezuelaGame.userProgress.wildlifeSpotted = this.wildlifeSpotted.size;
                        window.VenezuelaGame.saveProgress();
                        window.VenezuelaGame.checkBadges();
                    }

                    // Check if all spotted
                    if (this.wildlifeSpotted.size === 6) {
                        if (window.VenezuelaNotifications) {
                            window.VenezuelaNotifications.show('success',
                                '🎉 Amazing! You\'ve spotted all the wildlife! Wildlife Spotter badge progress!',
                                5000);
                        }
                    }
                }
            });
        });
    }

    /**
     * Setup quiz functionality
     */
    setupQuiz() {
        const questions = document.querySelectorAll('.quiz-question');
        const scoreValue = document.querySelector('.score-value');

        questions.forEach(question => {
            const questionNum = question.getAttribute('data-question');
            const options = question.querySelectorAll('.quiz-option');
            const feedback = question.querySelector('.quiz-feedback');

            options.forEach(option => {
                option.addEventListener('click', () => {
                    // Check if already answered
                    if (this.answeredQuestions.has(questionNum)) {
                        return;
                    }

                    const isCorrect = option.getAttribute('data-correct') === 'true';

                    // Mark as answered
                    this.answeredQuestions.add(questionNum);

                    // Disable all options
                    options.forEach(opt => opt.disabled = true);

                    if (isCorrect) {
                        option.classList.add('correct');
                        this.quizScore++;
                        scoreValue.textContent = this.quizScore;

                        // Show feedback
                        feedback.textContent = '✅ Correct! Great job!';
                        feedback.classList.add('correct', 'show');

                        // Award points
                        if (window.VenezuelaGame) {
                            window.VenezuelaGame.addPoints(50, 'Correct quiz answer!');
                        }

                        // Check if all correct
                        if (this.quizScore === 3) {
                            setTimeout(() => {
                                if (window.VenezuelaNotifications) {
                                    window.VenezuelaNotifications.show('badge',
                                        '🎉 Perfect Score! You\'re a nature expert!',
                                        5000);
                                }
                                this.triggerConfetti();
                            }, 500);
                        }
                    } else {
                        option.classList.add('wrong');

                        // Highlight correct answer
                        options.forEach(opt => {
                            if (opt.getAttribute('data-correct') === 'true') {
                                opt.classList.add('correct');
                            }
                        });

                        // Show feedback
                        feedback.textContent = '❌ Not quite. The correct answer is highlighted in green.';
                        feedback.classList.add('wrong', 'show');
                    }
                });
            });
        });
    }

    /**
     * Animate difficulty meters
     */
    setupDifficultyMeters() {
        // Meters will be animated when they come into view via intersection observer
    }

    animateDifficultyMeter(item) {
        const meterFill = item.querySelector('.meter-fill');
        const targetWidth = meterFill.getAttribute('data-target');

        setTimeout(() => {
            meterFill.style.width = targetWidth + '%';
        }, 300);
    }

    /**
     * Trigger confetti animation
     */
    triggerConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confettiPieces = [];
        const colors = ['#52B788', '#2D5016', '#FFB347', '#FF6B35', '#4FC3F7'];

        // Create confetti pieces
        for (let i = 0; i < 100; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                velocityY: Math.random() * 3 + 2,
                velocityX: Math.random() * 2 - 1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confettiPieces.forEach(piece => {
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
                ctx.restore();

                piece.y += piece.velocityY;
                piece.x += piece.velocityX;
                piece.rotation += piece.rotationSpeed;

                if (piece.y > canvas.height) {
                    piece.y = -10;
                    piece.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Stop after 3 seconds
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 3000);
    }
}

// Initialize attractions page
const attractionsPage = new AttractionsPage();

// Expose globally for modal close button
window.attractionsPage = attractionsPage;

console.log('%c🏔️ Attractions Page JavaScript Loaded', 'color: #52B788; font-size: 14px; font-weight: bold;');
