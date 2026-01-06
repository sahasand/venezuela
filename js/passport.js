/**
 * Venezuela Passport Page - Gamification Hub
 *
 * Displays user achievements, badges, visited places, and progress
 */

class PassportPage {
    constructor() {
        this.gamification = window.VenezuelaGame;
        this.destinations = [
            { id: 'los-roques', name: 'Los Roques', icon: '🏝️', category: 'beach' },
            { id: 'morrocoy', name: 'Morrocoy', icon: '🌊', category: 'beach' },
            { id: 'coche', name: 'Isla de Coche', icon: '🏖️', category: 'beach' },
            { id: 'margarita', name: 'Margarita Island', icon: '⛱️', category: 'beach' },
            { id: 'angel-falls', name: 'Angel Falls', icon: '💧', category: 'attraction' },
            { id: 'roraima', name: 'Mount Roraima', icon: '⛰️', category: 'attraction' },
            { id: 'canaima', name: 'Canaima', icon: '🌿', category: 'attraction' },
            { id: 'los-llanos', name: 'Los Llanos', icon: '🦙', category: 'attraction' },
            { id: 'beaches', name: 'Beaches Hub', icon: '🏝️', category: 'hub' },
            { id: 'attractions', name: 'Attractions Hub', icon: '🗺️', category: 'hub' },
            { id: 'map', name: 'Interactive Map', icon: '🗾', category: 'hub' },
            { id: 'passport', name: 'My Passport', icon: '🛂', category: 'hub' },
        ];
    }

    /**
     * Initialize the passport page
     */
    init() {
        console.log('%c🛂 Passport Page Initializing...', 'color: #2B6CB0; font-size: 16px; font-weight: bold;');

        // Wait for gamification system to be ready
        if (!this.gamification) {
            console.error('Gamification system not found!');
            return;
        }

        this.loadPassportData();
        this.setupEventListeners();
        this.checkForNewBadges();

        console.log('%c✅ Passport Page Ready!', 'color: #38A169; font-size: 14px;');
    }

    /**
     * Load and display all passport data
     */
    loadPassportData() {
        const progress = this.gamification.getProgress();

        // Update stats dashboard
        this.updateStatsDashboard(progress);

        // Render badges
        this.renderBadges(progress);

        // Render visited places
        this.renderPlaceStamps(progress);

        // Render timeline
        this.renderTimeline();

        // Update level progress
        this.updateLevelProgress(progress);
    }

    /**
     * Update stats dashboard with animated counters
     */
    updateStatsDashboard(progress) {
        // Total Points
        this.animateCounter('total-points', 0, progress.points, 2000);

        // Current Level
        const currentLevelEl = document.getElementById('current-level');
        if (currentLevelEl) {
            currentLevelEl.innerHTML = `<span class="level-icon">${progress.levelIcon}</span>${progress.level}`;
        }

        // Badges Earned
        const badgesCount = progress.badges;
        const totalBadges = progress.allBadges.length;
        this.animateCounter('badges-earned', 0, badgesCount, 1500);
        document.getElementById('badges-total').textContent = `/ ${totalBadges}`;

        // Places Visited
        this.animateCounter('places-visited', 0, progress.placesVisited, 1500);

        // Streak
        this.animateCounter('streak-days', 0, progress.currentStreak, 1000);

        // Time Exploring
        const timeEl = document.getElementById('time-exploring');
        if (timeEl) {
            timeEl.textContent = progress.timeSpent;
        }

        // Exploration Percentage
        this.animateCounter('exploration-percent', 0, progress.explorationPercentage, 1500);

        // Progress to next level
        const nextLevelEl = document.getElementById('next-level-info');
        if (nextLevelEl && progress.nextLevel !== 'Max Level') {
            nextLevelEl.textContent = `${progress.pointsToNextLevel} pts to ${progress.nextLevel}`;
        } else if (nextLevelEl) {
            nextLevelEl.textContent = 'Max Level Reached!';
        }
    }

    /**
     * Animate a counter from start to end
     */
    animateCounter(elementId, start, end, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    /**
     * Easing function for smooth animations
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Render all badges in the grid
     */
    renderBadges(progress) {
        const badgesGrid = document.getElementById('badges-grid');
        if (!badgesGrid) return;

        badgesGrid.innerHTML = '';

        progress.allBadges.forEach((badge, index) => {
            const isUnlocked = progress.badgesList.some(b => b.id === badge.id);
            const badgeProgress = this.calculateBadgeProgress(badge, progress);

            const badgeCard = document.createElement('div');
            badgeCard.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            badgeCard.style.animationDelay = `${index * 0.05}s`;
            badgeCard.dataset.badgeId = badge.id;

            badgeCard.innerHTML = `
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-description">${badge.description}</div>
                ${!isUnlocked && badgeProgress < 100 ? `
                    <div class="badge-progress-bar">
                        <div class="badge-progress-fill" style="width: ${badgeProgress}%"></div>
                    </div>
                ` : ''}
            `;

            badgesGrid.appendChild(badgeCard);
        });
    }

    /**
     * Calculate badge progress percentage
     */
    calculateBadgeProgress(badge, progress) {
        const userProgress = this.gamification.userProgress;

        switch (badge.id) {
            case 'first_steps':
                return Math.min((userProgress.placesVisited.length / 1) * 100, 100);
            case 'beach_explorer':
                const beachPages = ['beaches', 'los-roques', 'morrocoy', 'coche'];
                const visitedBeaches = beachPages.filter(p => userProgress.placesVisited.includes(p)).length;
                return (visitedBeaches / beachPages.length) * 100;
            case 'mountain_climber':
                let mountainCount = 0;
                if (userProgress.placesVisited.includes('angel-falls')) mountainCount++;
                if (userProgress.placesVisited.includes('roraima')) mountainCount++;
                return (mountainCount / 2) * 100;
            case 'wildlife_spotter':
                return Math.min((userProgress.wildlifeSpotted / 5) * 100, 100);
            case 'photographer':
                return Math.min((userProgress.imagesViewed / 10) * 100, 100);
            case 'adventure_seeker':
                return Math.min((userProgress.placesVisited.length / 8) * 100, 100);
            case 'passport_pro':
                return Math.min((userProgress.placesVisited.length / 7.5) * 100, 100); // 50% of 15
            default:
                return userProgress.badges.includes(badge.id) ? 100 : 0;
        }
    }

    /**
     * Render place stamps
     */
    renderPlaceStamps(progress) {
        const stampsGrid = document.getElementById('stamps-grid');
        if (!stampsGrid) return;

        stampsGrid.innerHTML = '';

        this.destinations.forEach((destination, index) => {
            const isVisited = progress.placesVisitedList.includes(destination.id);

            const stampCard = document.createElement('div');
            stampCard.className = `stamp-card ${isVisited ? 'visited' : 'empty'}`;
            stampCard.style.animationDelay = `${index * 0.05}s`;

            const visitDate = isVisited ? this.getVisitDate(destination.id) : null;

            stampCard.innerHTML = `
                <div class="stamp-border">
                    <div class="stamp-icon">${destination.icon}</div>
                    <div class="stamp-name">${destination.name}</div>
                    ${isVisited ? `
                        <div class="stamp-date">${visitDate}</div>
                        <div class="stamp-ink">VISITED</div>
                    ` : `
                        <div class="stamp-date">Not visited</div>
                    `}
                </div>
            `;

            stampsGrid.appendChild(stampCard);
        });
    }

    /**
     * Get visit date for a destination
     */
    getVisitDate(destinationId) {
        const history = this.gamification.userProgress.pointsHistory;
        const visitEntry = history.find(entry =>
            entry.reason && entry.reason.toLowerCase().includes(destinationId)
        );

        if (visitEntry) {
            const date = new Date(visitEntry.timestamp);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        return 'Recently';
    }

    /**
     * Render timeline of activities
     */
    renderTimeline() {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        const history = this.gamification.userProgress.pointsHistory;
        const recentHistory = history.slice(-15).reverse(); // Last 15 activities

        timeline.innerHTML = '';

        recentHistory.forEach((entry, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.style.animationDelay = `${index * 0.1}s`;

            const icon = this.getTimelineIcon(entry.reason);
            const timestamp = this.formatTimestamp(entry.timestamp);

            timelineItem.innerHTML = `
                <div class="timeline-icon">${icon}</div>
                <span class="timeline-text">${entry.reason}</span>
                <span class="timeline-points">+${entry.amount} pts</span>
                ${entry.multiplier > 1 ? `<span class="timeline-points">(${entry.multiplier}x)</span>` : ''}
                <div class="timeline-timestamp">${timestamp}</div>
            `;

            timeline.appendChild(timelineItem);
        });

        if (recentHistory.length === 0) {
            timeline.innerHTML = '<p style="color: white; text-align: center;">Start exploring to see your journey!</p>';
        }
    }

    /**
     * Get appropriate icon for timeline entry
     */
    getTimelineIcon(reason) {
        if (reason.includes('badge') || reason.includes('Badge')) return '🏆';
        if (reason.includes('Visited')) return '📍';
        if (reason.includes('Level')) return '⬆️';
        if (reason.includes('Read')) return '📖';
        return '✨';
    }

    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    /**
     * Update level progress display
     */
    updateLevelProgress(progress) {
        const currentLevelDisplay = document.getElementById('level-display-name');
        if (currentLevelDisplay) {
            currentLevelDisplay.innerHTML = `<span class="level-icon" style="font-size: 3rem;">${progress.levelIcon}</span> ${progress.level}`;
        }

        // Progress bar
        const progressBar = document.getElementById('level-progress-bar');
        if (progressBar) {
            const currentLevel = this.gamification.getCurrentLevel();
            const nextLevel = this.gamification.levels[this.gamification.levels.indexOf(currentLevel) + 1];

            if (nextLevel) {
                const pointsInCurrentLevel = progress.points - currentLevel.minPoints;
                const pointsNeededForNext = nextLevel.minPoints - currentLevel.minPoints;
                const percentage = (pointsInCurrentLevel / pointsNeededForNext) * 100;

                progressBar.style.width = `${percentage}%`;
                progressBar.textContent = `${Math.floor(percentage)}%`;
            } else {
                progressBar.style.width = '100%';
                progressBar.textContent = 'MAX!';
            }
        }

        // Next level preview
        const nextLevelPreview = document.getElementById('next-level-preview');
        if (nextLevelPreview && progress.nextLevel !== 'Max Level') {
            nextLevelPreview.innerHTML = `
                <div class="next-level-title">Next: ${progress.nextLevel}</div>
                <div class="next-level-text">Need ${progress.pointsToNextLevel} more points to level up!</div>
            `;
        } else if (nextLevelPreview) {
            nextLevelPreview.innerHTML = `
                <div class="next-level-title">Legendary Status!</div>
                <div class="next-level-text">You've reached the highest level! Keep exploring Venezuela!</div>
            `;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Badge click to show details
        document.addEventListener('click', (e) => {
            const badgeCard = e.target.closest('.badge-card');
            if (badgeCard) {
                const badgeId = badgeCard.dataset.badgeId;
                this.showBadgeModal(badgeId);
            }
        });

        // Export progress button
        const exportBtn = document.getElementById('export-progress');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportProgress());
        }

        // Share journey button
        const shareBtn = document.getElementById('share-journey');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareJourney());
        }

        // Reset progress button
        const resetBtn = document.getElementById('reset-progress');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetProgress());
        }
    }

    /**
     * Show badge details in modal
     */
    showBadgeModal(badgeId) {
        const badge = this.gamification.badges[badgeId];
        if (!badge) return;

        const isUnlocked = this.gamification.userProgress.badges.includes(badgeId);
        const progress = this.gamification.getProgress();
        const badgeProgress = this.calculateBadgeProgress(badge, progress);

        // Create modal if it doesn't exist
        let modal = document.getElementById('badge-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'badge-modal';
            modal.className = 'badge-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="badge-modal-content">
                <button class="modal-close" onclick="document.getElementById('badge-modal').classList.remove('show')">×</button>
                <div class="modal-badge-icon">${badge.icon}</div>
                <div class="modal-badge-name">${badge.name}</div>
                <div class="modal-badge-description">${badge.description}</div>
                <div class="modal-badge-status ${isUnlocked ? 'unlocked' : 'locked'}">
                    ${isUnlocked ? '✅ Unlocked!' : `🔒 Locked - ${Math.floor(badgeProgress)}% Complete`}
                </div>
            </div>
        `;

        setTimeout(() => modal.classList.add('show'), 10);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    /**
     * Export progress as JSON
     */
    exportProgress() {
        this.gamification.exportProgress();

        if (window.VenezuelaNotifications) {
            window.VenezuelaNotifications.show('success', '📥 Progress exported successfully!');
        }
    }

    /**
     * Share journey (generate shareable card)
     */
    shareJourney() {
        const progress = this.gamification.getProgress();

        const shareText = `🌴 My Venezuela Journey 🌴\n\n` +
            `Level: ${progress.level} ${progress.levelIcon}\n` +
            `Points: ${progress.points}\n` +
            `Badges: ${progress.badges}/${progress.allBadges.length}\n` +
            `Places Visited: ${progress.placesVisited}\n` +
            `Streak: ${progress.currentStreak} days 🔥\n\n` +
            `Discover Venezuela with me!`;

        // Try to use Web Share API
        if (navigator.share) {
            navigator.share({
                title: 'My Venezuela Journey',
                text: shareText
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    /**
     * Fallback share method (copy to clipboard)
     */
    fallbackShare(text) {
        navigator.clipboard.writeText(text).then(() => {
            if (window.VenezuelaNotifications) {
                window.VenezuelaNotifications.show('success', '📋 Journey copied to clipboard!');
            }
        }).catch(() => {
            alert(text);
        });
    }

    /**
     * Reset progress
     */
    resetProgress() {
        if (confirm('Are you sure you want to reset ALL your progress?\n\nThis will delete:\n- All points\n- All badges\n- All visited places\n- Your entire journey\n\nThis action cannot be undone!')) {
            this.gamification.reset();

            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    /**
     * Check for newly earned badges and celebrate
     */
    checkForNewBadges() {
        const lastCheckKey = 'lastBadgeCheck';
        const lastCheck = localStorage.getItem(lastCheckKey);
        const currentBadges = this.gamification.userProgress.badges;

        if (lastCheck) {
            const previousBadges = JSON.parse(lastCheck);
            const newBadges = currentBadges.filter(b => !previousBadges.includes(b));

            if (newBadges.length > 0) {
                // Show confetti!
                this.showConfetti();
            }
        }

        // Update last check
        localStorage.setItem(lastCheckKey, JSON.stringify(currentBadges));
    }

    /**
     * Show confetti celebration
     */
    showConfetti() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Create confetti elements
            for (let i = 0; i < particleCount; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
                confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';

                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 5000);
            }
        }, 250);
    }
}

// Initialize passport page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const passport = new PassportPage();
        passport.init();
    });
} else {
    const passport = new PassportPage();
    passport.init();
}
