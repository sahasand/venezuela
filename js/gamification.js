/**
 * Venezuela Travel Website - Comprehensive Gamification System
 *
 * Features:
 * - Points system with streak multipliers
 * - 12 achievement badges
 * - Progress tracking and levels
 * - localStorage persistence
 * - Export/import functionality
 * - Global API for other pages
 */

class VenezuelaGamificationSystem {
    constructor() {
        // Badge definitions
        this.badges = {
            first_steps: {
                id: 'first_steps',
                name: 'First Steps',
                icon: '👣',
                image: 'images/badges/badge_first_steps.png',
                description: 'Visit your first destination',
                condition: (progress) => progress.placesVisited.length >= 1
            },
            beach_explorer: {
                id: 'beach_explorer',
                name: 'Beach Explorer',
                icon: '🌊',
                image: 'images/badges/badge_beach_explorer.png',
                description: 'Visit all beach pages',
                condition: (progress) => {
                    const beachPages = ['beaches', 'los-roques', 'morrocoy', 'coche'];
                    return beachPages.every(page => progress.placesVisited.includes(page));
                }
            },
            mountain_climber: {
                id: 'mountain_climber',
                name: 'Mountain Climber',
                icon: '🏔️',
                image: 'images/badges/badge_mountain_climber.png',
                description: 'Visit Angel Falls and Roraima pages',
                condition: (progress) => {
                    return progress.placesVisited.includes('angel-falls') &&
                        progress.placesVisited.includes('roraima');
                }
            },
            wildlife_spotter: {
                id: 'wildlife_spotter',
                name: 'Wildlife Spotter',
                icon: '🦜',
                image: 'images/badges/badge_wildlife_spotter.png',
                description: 'Discover 5 animals/wildlife mentions',
                condition: (progress) => progress.wildlifeSpotted >= 5
            },
            photographer: {
                id: 'photographer',
                name: 'Photographer',
                icon: '📸',
                image: 'images/badges/badge_photographer.png',
                description: 'View 10 destination images',
                condition: (progress) => progress.imagesViewed >= 10
            },
            history_buff: {
                id: 'history_buff',
                name: 'History Buff',
                icon: '📚',
                image: 'images/badges/badge_history_buff.png',
                description: 'Read about Venezuelan culture',
                condition: (progress) => progress.cultureRead === true
            },
            adventure_seeker: {
                id: 'adventure_seeker',
                name: 'Adventure Seeker',
                icon: '🗺️',
                image: 'images/badges/badge_adventure_seeker.png',
                description: 'Explore 8+ destinations',
                condition: (progress) => progress.placesVisited.length >= 8
            },
            night_owl: {
                id: 'night_owl',
                name: 'Night Owl',
                icon: '🦉',
                image: 'images/badges/badge_night_owl.png',
                description: 'Visit site after 8 PM',
                condition: (progress) => progress.nightVisits >= 1
            },
            early_bird: {
                id: 'early_bird',
                name: 'Early Bird',
                icon: '🐦',
                image: 'images/badges/badge_early_bird.png',
                description: 'Visit site before 8 AM',
                condition: (progress) => progress.earlyVisits >= 1
            },
            map_master: {
                id: 'map_master',
                name: 'Map Master',
                icon: '🧭',
                image: 'images/badges/badge_map_master.png',
                description: 'Use the interactive map',
                condition: (progress) => progress.mapUsed === true
            },
            passport_pro: {
                id: 'passport_pro',
                name: 'Passport Pro',
                icon: '🛂',
                image: 'images/badges/badge_passport_pro.png',
                description: 'Fill 50% of passport',
                condition: (progress) => {
                    const totalDestinations = 15; // Adjust based on actual destinations
                    return progress.placesVisited.length >= (totalDestinations * 0.5);
                }
            },
            completionist: {
                id: 'completionist',
                name: 'Completionist',
                icon: '👑',
                image: 'images/badges/badge_completionist.png',
                description: 'Earn all other badges',
                condition: (progress) => {
                    const otherBadges = Object.keys(this.badges).filter(id => id !== 'completionist');
                    return otherBadges.every(badgeId => progress.badges.includes(badgeId));
                }
            }
        };

        // Level definitions
        this.levels = [
            { name: 'Explorer', minPoints: 0, icon: '🧭' },
            { name: 'Adventurer', minPoints: 500, icon: '⛰️' },
            { name: 'Discoverer', minPoints: 1500, icon: '🔭' },
            { name: 'Legend', minPoints: 3000, icon: '👑' }
        ];

        // Default user progress
        this.defaultProgress = {
            points: 0,
            badges: [],
            placesVisited: [],
            wildlifeSpotted: 0,
            imagesViewed: 0,
            cultureRead: false,
            nightVisits: 0,
            earlyVisits: 0,
            mapUsed: false,
            timeSpent: 0, // in seconds
            visitDates: [], // for streak calculation
            lastVisitDate: null,
            currentStreak: 0,
            longestStreak: 0,
            firstVisit: null,
            pointsHistory: []
        };

        this.userProgress = { ...this.defaultProgress };
        this.sessionStartTime = Date.now();
        this.notificationQueue = [];
    }

    /**
     * Initialize the gamification system
     */
    init() {
        console.log('%c🎮 Venezuela Gamification System Initializing...',
            'color: #52B788; font-size: 16px; font-weight: bold;');

        this.loadProgress();
        this.trackTimeOfDay();
        this.setupEventListeners();
        this.startTimeTracking();
        this.updateStreak();
        this.updateDisplay();

        console.log('%c✅ Gamification System Ready!',
            'color: #95D5B2; font-size: 14px;');
    }

    /**
     * Load user progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('venezuelaGameProgress');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.userProgress = { ...this.defaultProgress, ...parsed };
                console.log('📊 Progress loaded:', this.userProgress);
            } else {
                // First time visitor
                this.userProgress.firstVisit = Date.now();
                this.saveProgress();
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            localStorage.setItem('venezuelaGameProgress', JSON.stringify(this.userProgress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    /**
     * Track time of day visits (Night Owl / Early Bird)
     */
    trackTimeOfDay() {
        const hour = new Date().getHours();

        if (hour >= 20 || hour < 6) {
            // Night Owl (8 PM - 6 AM)
            this.userProgress.nightVisits++;
        } else if (hour >= 5 && hour < 8) {
            // Early Bird (5 AM - 8 AM)
            this.userProgress.earlyVisits++;
        }

        this.saveProgress();
        this.checkBadges();
    }

    /**
     * Update streak based on visit dates
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.userProgress.lastVisitDate
            ? new Date(this.userProgress.lastVisitDate).toDateString()
            : null;

        if (lastVisit !== today) {
            // New day
            if (!this.userProgress.visitDates.includes(today)) {
                this.userProgress.visitDates.push(today);
            }

            if (lastVisit) {
                const lastDate = new Date(this.userProgress.lastVisitDate);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - lastDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day
                    this.userProgress.currentStreak++;
                } else if (diffDays > 1) {
                    // Streak broken
                    this.userProgress.currentStreak = 1;
                }
            } else {
                // First visit
                this.userProgress.currentStreak = 1;
            }

            // Update longest streak
            if (this.userProgress.currentStreak > this.userProgress.longestStreak) {
                this.userProgress.longestStreak = this.userProgress.currentStreak;
            }

            this.userProgress.lastVisitDate = Date.now();
            this.saveProgress();
        }
    }

    /**
     * Get current streak multiplier
     */
    getStreakMultiplier() {
        const streak = this.userProgress.currentStreak;
        if (streak >= 7) return 2.0;
        if (streak >= 3) return 1.5;
        if (streak >= 2) return 1.2;
        return 1.0;
    }

    /**
     * Add points to user account with animation
     */
    addPoints(amount, reason = 'Activity completed') {
        const multiplier = this.getStreakMultiplier();
        const finalAmount = Math.floor(amount * multiplier);

        this.userProgress.points += finalAmount;

        // Track in history
        this.userProgress.pointsHistory.push({
            amount: finalAmount,
            reason,
            multiplier,
            timestamp: Date.now()
        });

        this.saveProgress();

        // Show notification
        const message = multiplier > 1
            ? `+${finalAmount} points! (${multiplier}x streak bonus) ${reason}`
            : `+${finalAmount} points! ${reason}`;

        this.showNotification('points', message);

        this.checkLevelUp();
        this.checkBadges();
        this.updateDisplay();
    }

    /**
     * Track page visit
     */
    trackPageVisit(pageId) {
        if (!this.userProgress.placesVisited.includes(pageId)) {
            this.userProgress.placesVisited.push(pageId);
            this.addPoints(10, `Visited ${pageId}`);
            this.saveProgress();
            this.checkBadges();
        }
    }

    /**
     * Unlock a badge
     */
    unlockBadge(badgeId) {
        if (!this.userProgress.badges.includes(badgeId)) {
            const badge = this.badges[badgeId];
            if (badge) {
                this.userProgress.badges.push(badgeId);
                this.addPoints(100, `Unlocked badge: ${badge.name}`);
                this.saveProgress();
                this.showNotification('badge', `${badge.icon} Badge Unlocked: ${badge.name}!`);
                this.checkBadges(); // Check for Completionist
                this.updateDisplay();
            }
        }
    }

    /**
     * Check all badge conditions
     */
    checkBadges() {
        Object.keys(this.badges).forEach(badgeId => {
            const badge = this.badges[badgeId];
            if (!this.userProgress.badges.includes(badgeId)) {
                if (badge.condition(this.userProgress)) {
                    this.unlockBadge(badgeId);
                }
            }
        });
    }

    /**
     * Get current level
     */
    getCurrentLevel() {
        const points = this.userProgress.points;
        let currentLevel = this.levels[0];

        for (let level of this.levels) {
            if (points >= level.minPoints) {
                currentLevel = level;
            }
        }

        return currentLevel;
    }

    /**
     * Check if user should level up
     */
    checkLevelUp() {
        const currentLevel = this.getCurrentLevel();
        const previousPoints = this.userProgress.points - (this.userProgress.pointsHistory[this.userProgress.pointsHistory.length - 1]?.amount || 0);

        // Find what level they were at before the last point addition
        let previousLevel = this.levels[0];
        for (let level of this.levels) {
            if (previousPoints >= level.minPoints) {
                previousLevel = level;
            }
        }

        if (currentLevel.name !== previousLevel.name) {
            this.showNotification('levelup',
                `${currentLevel.icon} Level Up! You're now a ${currentLevel.name}!`);
        }
    }

    /**
     * Show notification (will be handled by notifications.js)
     */
    showNotification(type, message) {
        // If notifications system is available, use it
        if (window.VenezuelaNotifications) {
            window.VenezuelaNotifications.show(type, message);
        } else {
            // Fallback to console
            console.log(`[${type.toUpperCase()}] ${message}`);
        }

        // Also dispatch custom event for other systems to listen
        window.dispatchEvent(new CustomEvent('venezuela:notification', {
            detail: { type, message }
        }));
    }

    /**
     * Get user progress and stats
     */
    getProgress() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.levels[this.levels.indexOf(currentLevel) + 1];
        const explorationPercentage = (this.userProgress.placesVisited.length / 15) * 100; // 15 total destinations

        return {
            points: this.userProgress.points,
            badges: this.userProgress.badges.length,
            badgesList: this.userProgress.badges.map(id => this.badges[id]),
            placesVisited: this.userProgress.placesVisited.length,
            placesVisitedList: this.userProgress.placesVisited,
            level: currentLevel.name,
            levelIcon: currentLevel.icon,
            nextLevel: nextLevel?.name || 'Max Level',
            pointsToNextLevel: nextLevel ? (nextLevel.minPoints - this.userProgress.points) : 0,
            explorationPercentage: Math.floor(explorationPercentage),
            timeSpent: this.formatTime(this.userProgress.timeSpent),
            currentStreak: this.userProgress.currentStreak,
            longestStreak: this.userProgress.longestStreak,
            streakMultiplier: this.getStreakMultiplier(),
            allBadges: Object.values(this.badges),
            totalDestinations: 15
        };
    }

    /**
     * Format time in human-readable format
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    /**
     * Start tracking time spent
     */
    startTimeTracking() {
        // Update time every minute
        setInterval(() => {
            const timeSpent = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            this.userProgress.timeSpent += 60; // Add 1 minute
            this.saveProgress();
        }, 60000); // Every minute

        // Save time on page unload
        window.addEventListener('beforeunload', () => {
            const sessionTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            this.userProgress.timeSpent += sessionTime;
            this.saveProgress();
        });
    }

    /**
     * Setup event listeners for tracking
     */
    setupEventListeners() {
        // Track image views
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                this.userProgress.imagesViewed++;
                this.saveProgress();
                this.checkBadges();
            }
        });

        // Track scroll depth for reading
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercentage > maxScroll) {
                maxScroll = scrollPercentage;

                if (scrollPercentage > 80 && !this.scrollMilestoneReached) {
                    this.scrollMilestoneReached = true;
                    this.addPoints(25, 'Read through page content');
                }
            }
        });

        // Reset scroll milestone for each page
        this.scrollMilestoneReached = false;
    }

    /**
     * Update display elements
     */
    updateDisplay() {
        const progress = this.getProgress();

        // Update stats display
        const pointsDisplay = document.querySelector('.stat-value[data-stat="points"]');
        const badgesDisplay = document.querySelector('.stat-value[data-stat="badges"]');
        const placesDisplay = document.querySelector('.stat-value[data-stat="places"]');

        if (pointsDisplay) {
            this.animateNumber(pointsDisplay, parseInt(pointsDisplay.textContent) || 0, progress.points);
        }
        if (badgesDisplay) {
            this.animateNumber(badgesDisplay, parseInt(badgesDisplay.textContent) || 0, progress.badges);
        }
        if (placesDisplay) {
            this.animateNumber(placesDisplay, parseInt(placesDisplay.textContent) || 0, progress.placesVisited);
        }

        // Update badge showcase
        const badgeShowcase = document.querySelector('.badge-showcase');
        if (badgeShowcase) {
            this.updateBadgeDisplay(badgeShowcase, progress);
        }
    }

    /**
     * Animate number changes
     */
    animateNumber(element, from, to, duration = 1000) {
        const start = performance.now();
        const difference = to - from;

        const step = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(from + difference * progress);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    /**
     * Update badge display
     */
    updateBadgeDisplay(container, progress) {
        container.innerHTML = '';

        progress.allBadges.forEach(badge => {
            const isUnlocked = progress.badgesList.some(b => b.id === badge.id);
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;

            // Check if badge has an image image
            let iconContent;
            if (badge.image) {
                iconContent = `<img src="${badge.image}" alt="${badge.name}" class="badge-img" data-emoji="${badge.icon}" onerror="this.outerHTML='<div class=badge-icon>'+this.dataset.emoji+'</div>'">`;
            } else {
                iconContent = `<div class="badge-icon">${badge.icon}</div>`;
            }

            badgeElement.innerHTML = `
                ${iconContent}
                <div class="badge-name">${badge.name}</div>
            `;
            container.appendChild(badgeElement);
        });
    }

    /**
     * Export progress
     */
    exportProgress() {
        const dataStr = JSON.stringify(this.userProgress, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'venezuela-progress.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import progress
     */
    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                this.userProgress = { ...this.defaultProgress, ...imported };
                this.saveProgress();
                this.updateDisplay();
                this.showNotification('success', 'Progress imported successfully!');
            } catch (error) {
                console.error('Error importing progress:', error);
                this.showNotification('error', 'Failed to import progress');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Reset progress (for testing)
     */
    reset() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
            this.userProgress = { ...this.defaultProgress };
            this.userProgress.firstVisit = Date.now();
            this.saveProgress();
            this.updateDisplay();
            this.showNotification('info', 'Progress reset');
            console.log('🔄 Progress reset');
        }
    }
}

// Create global instance
const VenezuelaGame = new VenezuelaGamificationSystem();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VenezuelaGame.init());
} else {
    VenezuelaGame.init();
}

// Expose globally
window.VenezuelaGame = VenezuelaGame;

// Developer console helpers
console.log('%c🎮 Venezuela Gamification System Loaded', 'color: #52B788; font-size: 14px; font-weight: bold;');
console.log('%cUse VenezuelaGame in console:', 'color: #95D5B2; font-size: 12px;');
console.log('%c  VenezuelaGame.addPoints(100, "Testing")', 'color: #95D5B2; font-size: 11px;');
console.log('%c  VenezuelaGame.getProgress()', 'color: #95D5B2; font-size: 11px;');
console.log('%c  VenezuelaGame.exportProgress()', 'color: #95D5B2; font-size: 11px;');
console.log('%c  VenezuelaGame.reset()', 'color: #95D5B2; font-size: 11px;');
