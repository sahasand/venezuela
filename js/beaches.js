/**
 * Beaches Page - Interactive Features & Gamification Integration
 *
 * Features:
 * - Card flip interactions
 * - Beach exploration tracking
 * - Quiz system with confetti
 * - Photo gallery interactions
 * - Progress tracking
 * - Points awards
 */

class BeachesPage {
    constructor() {
        this.exploredBeaches = new Set();
        this.quizAnswers = new Map();
        this.quizScore = 0;
        this.photosViewed = new Set();
        this.pageVisited = false;

        // Quiz fun facts
        this.funFacts = {
            1: {
                wrong: "Actually, Los Roques has over 350 islands and cays! It's one of the largest archipelagos in the Caribbean.",
                correct: "Correct! Los Roques is made up of over 350 islands and cays, making it a paradise for island hoppers!"
            },
            2: {
                wrong: "Close, but Margarita Island is known as the 'Pearl of the Caribbean' due to its historic pearl fishing industry!",
                correct: "Perfect! Margarita Island earned the name 'Pearl of the Caribbean' from its famous pearl diving heritage."
            },
            3: {
                wrong: "Not quite! Morrocoy is famous for its beautiful mangrove forests, which provide crucial ecosystems for marine life.",
                correct: "Excellent! The mangrove forests in Morrocoy National Park are a vital ecosystem that supports diverse wildlife."
            }
        };
    }

    init() {
        console.log('🏖️ Beaches Page Initializing...');

        // Wait for gamification system to be ready
        if (window.VenezuelaGame) {
            this.gamificationReady();
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.gamificationReady(), 500);
            });
        }

        this.setupCardFlips();
        this.setupQuiz();
        this.setupGallery();
        this.loadProgress();
        this.updateUI();

        console.log('✅ Beaches Page Ready!');
    }

    gamificationReady() {
        // Award points for visiting beaches page (first time only)
        if (!this.pageVisited && window.VenezuelaGame) {
            window.VenezuelaGame.trackPageVisit('beaches');
            this.pageVisited = true;
            this.saveProgress();
        }
    }

    /**
     * Setup Beach Card Flip Interactions
     */
    setupCardFlips() {
        const cards = document.querySelectorAll('.beach-card');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't flip if clicking the explore button
                if (e.target.closest('.explore-beach-btn')) {
                    return;
                }

                card.classList.toggle('flipped');
            });
        });

        // Setup explore buttons
        const exploreButtons = document.querySelectorAll('.explore-beach-btn');

        exploreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const beachId = button.getAttribute('data-beach-id');
                this.exploreBeach(beachId);
            });
        });
    }

    /**
     * Handle Beach Exploration
     */
    exploreBeach(beachId) {
        if (this.exploredBeaches.has(beachId)) {
            console.log(`Beach ${beachId} already explored`);
            return;
        }

        this.exploredBeaches.add(beachId);

        // Update button UI
        const button = document.querySelector(`[data-beach-id="${beachId}"]`);
        if (button) {
            button.classList.add('explored');
        }

        // Award points
        if (window.VenezuelaGame) {
            window.VenezuelaGame.trackPageVisit(beachId);
        }

        // Update checklist
        this.updateChecklist();
        this.updateProgress();
        this.saveProgress();

        console.log(`✅ Explored: ${beachId}`);
    }

    /**
     * Update Beach Checklist
     */
    updateChecklist() {
        const checklistItems = document.querySelectorAll('.checklist-item');

        checklistItems.forEach(item => {
            const beach = item.getAttribute('data-beach');
            if (this.exploredBeaches.has(beach)) {
                item.classList.add('checked');
                const icon = item.querySelector('.check-icon');
                if (icon) {
                    icon.textContent = '☑';
                }
            }
        });
    }

    /**
     * Update Progress Bar
     */
    updateProgress() {
        const totalBeaches = 3;
        const explored = this.exploredBeaches.size;
        const percentage = Math.floor((explored / totalBeaches) * 100);

        const percentageDisplay = document.querySelector('.progress-percentage');
        const progressFill = document.querySelector('.progress-fill');
        const progressMessage = document.querySelector('.progress-message');

        if (percentageDisplay) {
            percentageDisplay.textContent = `${percentage}%`;
        }

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        if (progressMessage && percentage === 100) {
            progressMessage.textContent = '🎉 Congratulations! You unlocked the Beach Explorer badge!';
            progressMessage.style.color = '#52B788';
            progressMessage.style.fontWeight = '600';
        }
    }

    /**
     * Setup Quiz System
     */
    setupQuiz() {
        const quizQuestions = document.querySelectorAll('.quiz-question');

        quizQuestions.forEach(question => {
            const questionNum = question.getAttribute('data-question');
            const options = question.querySelectorAll('.quiz-option');

            options.forEach(option => {
                option.addEventListener('click', () => {
                    this.answerQuestion(questionNum, option, options);
                });
            });
        });
    }

    /**
     * Handle Quiz Answer
     */
    answerQuestion(questionNum, selectedOption, allOptions) {
        // Check if already answered
        if (this.quizAnswers.has(questionNum)) {
            return;
        }

        const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
        const feedback = selectedOption.closest('.quiz-question').querySelector('.quiz-feedback');

        // Disable all options
        allOptions.forEach(opt => opt.disabled = true);

        // Mark the selected answer
        if (isCorrect) {
            selectedOption.classList.add('correct');
            this.quizScore++;

            // Award points
            if (window.VenezuelaGame) {
                window.VenezuelaGame.addPoints(50, 'Answered quiz question correctly');
            }

            // Show success feedback
            feedback.textContent = this.funFacts[questionNum].correct;
            feedback.classList.add('show', 'correct');

            // Trigger confetti
            this.triggerConfetti();
        } else {
            selectedOption.classList.add('wrong');

            // Show correct answer
            allOptions.forEach(opt => {
                if (opt.getAttribute('data-correct') === 'true') {
                    opt.classList.add('correct');
                }
            });

            // Show learning feedback
            feedback.textContent = this.funFacts[questionNum].wrong;
            feedback.classList.add('show', 'wrong');
        }

        // Record answer
        this.quizAnswers.set(questionNum, isCorrect);
        this.updateQuizScore();
        this.saveProgress();

        // Check if all questions answered
        if (this.quizAnswers.size === 3 && this.quizScore === 3) {
            setTimeout(() => {
                this.triggerBigConfetti();
                if (window.VenezuelaGame) {
                    window.VenezuelaGame.addPoints(100, 'Perfect score on beach quiz!');
                }
            }, 1000);
        }
    }

    /**
     * Update Quiz Score Display
     */
    updateQuizScore() {
        const scoreValue = document.querySelector('.score-value');
        if (scoreValue) {
            scoreValue.textContent = this.quizScore;
        }
    }

    /**
     * Setup Photo Gallery
     */
    setupGallery() {
        const photos = document.querySelectorAll('.gallery-photo');

        photos.forEach(photo => {
            photo.addEventListener('click', () => {
                const photoId = photo.getAttribute('data-photo');
                this.viewPhoto(photoId, photo);
            });
        });
    }

    /**
     * Handle Photo View
     */
    viewPhoto(photoId, photoElement) {
        if (this.photosViewed.has(photoId)) {
            return;
        }

        this.photosViewed.add(photoId);

        // Add flash animation
        photoElement.classList.add('clicked');
        setTimeout(() => photoElement.classList.remove('clicked'), 500);

        // Update photographer progress
        if (window.VenezuelaGame) {
            window.VenezuelaGame.userProgress.imagesViewed++;
            window.VenezuelaGame.saveProgress();
            window.VenezuelaGame.checkBadges();
        }

        this.updatePhotographerProgress();
        this.saveProgress();
    }

    /**
     * Update Photographer Progress
     */
    updatePhotographerProgress() {
        const photosViewedDisplay = document.querySelector('.photos-viewed');
        if (photosViewedDisplay) {
            photosViewedDisplay.textContent = this.photosViewed.size;
        }
    }

    /**
     * Confetti Animation (Small)
     */
    triggerConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#0077B6', '#00B4D8', '#90E0EF', '#F4D35E', '#FF6B6B'];

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -10,
                size: Math.random() * 5 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360
            });
        }

        // Animate
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();

                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += 5;

                if (p.y > canvas.height) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * Big Confetti Animation (Perfect Score)
     */
    triggerBigConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#0077B6', '#00B4D8', '#90E0EF', '#F4D35E', '#FF6B6B', '#52B788'];

        // Create more particles for big celebration
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 4 + 3,
                speedX: Math.random() * 4 - 2,
                rotation: Math.random() * 360
            });
        }

        // Animate
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();

                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += 5;

                if (p.y > canvas.height + 50) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * Save Progress to LocalStorage
     */
    saveProgress() {
        const progress = {
            exploredBeaches: Array.from(this.exploredBeaches),
            quizAnswers: Array.from(this.quizAnswers),
            quizScore: this.quizScore,
            photosViewed: Array.from(this.photosViewed),
            pageVisited: this.pageVisited
        };

        localStorage.setItem('venezuelaBeachesProgress', JSON.stringify(progress));
    }

    /**
     * Load Progress from LocalStorage
     */
    loadProgress() {
        const saved = localStorage.getItem('venezuelaBeachesProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.exploredBeaches = new Set(progress.exploredBeaches || []);
                this.quizAnswers = new Map(progress.quizAnswers || []);
                this.quizScore = progress.quizScore || 0;
                this.photosViewed = new Set(progress.photosViewed || []);
                this.pageVisited = progress.pageVisited || false;
            } catch (error) {
                console.error('Error loading beaches progress:', error);
            }
        }
    }

    /**
     * Update UI Based on Loaded Progress
     */
    updateUI() {
        // Update explored buttons
        this.exploredBeaches.forEach(beachId => {
            const button = document.querySelector(`[data-beach-id="${beachId}"]`);
            if (button) {
                button.classList.add('explored');
            }
        });

        // Update checklist
        this.updateChecklist();
        this.updateProgress();

        // Update quiz score
        this.updateQuizScore();

        // Update quiz UI
        this.quizAnswers.forEach((isCorrect, questionNum) => {
            const question = document.querySelector(`[data-question="${questionNum}"]`);
            if (question) {
                const options = question.querySelectorAll('.quiz-option');
                options.forEach(opt => opt.disabled = true);

                // Show correct answer
                options.forEach(opt => {
                    if (opt.getAttribute('data-correct') === 'true') {
                        opt.classList.add('correct');
                    }
                });
            }
        });

        // Update photographer progress
        this.updatePhotographerProgress();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const beachesPage = new BeachesPage();
        beachesPage.init();
        window.BeachesPage = beachesPage;
    });
} else {
    const beachesPage = new BeachesPage();
    beachesPage.init();
    window.BeachesPage = beachesPage;
}

console.log('🏖️ Beaches Page Script Loaded');
