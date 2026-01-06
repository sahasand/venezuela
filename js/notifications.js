/**
 * Venezuela Travel Website - Toast Notification System
 *
 * Features:
 * - Animated toast notifications
 * - Notification queue system
 * - Different styles for different types
 * - Confetti effect for major achievements
 * - Auto-dismiss with progress bar
 */

class VenezuelaNotificationSystem {
    constructor() {
        this.queue = [];
        this.activeNotifications = [];
        this.maxVisible = 3;
        this.container = null;
        this.confettiContainer = null;
        this.init();
    }

    /**
     * Initialize the notification system
     */
    init() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('notification-container');
        }

        // Create confetti container
        if (!document.getElementById('confetti-container')) {
            this.confettiContainer = document.createElement('div');
            this.confettiContainer.id = 'confetti-container';
            this.confettiContainer.className = 'confetti-container';
            document.body.appendChild(this.confettiContainer);
        } else {
            this.confettiContainer = document.getElementById('confetti-container');
        }

        console.log('%c🔔 Notification System Ready', 'color: #FFB347; font-size: 12px;');
    }

    /**
     * Show a notification
     * @param {string} type - Type of notification: 'points', 'badge', 'levelup', 'success', 'info', 'error'
     * @param {string} message - The message to display
     * @param {number} duration - How long to show (default: 4000ms)
     */
    show(type, message, duration = 4000) {
        const notification = {
            id: Date.now() + Math.random(),
            type,
            message,
            duration
        };

        this.queue.push(notification);
        this.processQueue();
    }

    /**
     * Process the notification queue
     */
    processQueue() {
        if (this.activeNotifications.length >= this.maxVisible) {
            return; // Wait for a slot to open
        }

        if (this.queue.length === 0) {
            return; // Nothing to show
        }

        const notification = this.queue.shift();
        this.displayNotification(notification);
    }

    /**
     * Display a notification
     */
    displayNotification(notification) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.setAttribute('data-id', notification.id);

        // Get icon based on type
        const icon = this.getIcon(notification.type);

        // Create toast HTML
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-message">${notification.message}</div>
                <div class="toast-progress"></div>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        // Add to container
        this.container.appendChild(toast);
        this.activeNotifications.push(notification.id);

        // Trigger animation
        setTimeout(() => toast.classList.add('toast-show'), 10);

        // Handle close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.dismissNotification(toast, notification.id));

        // Auto-dismiss with progress bar
        const progressBar = toast.querySelector('.toast-progress');
        progressBar.style.transition = `width ${notification.duration}ms linear`;
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 50);

        // Auto-dismiss
        setTimeout(() => {
            this.dismissNotification(toast, notification.id);
        }, notification.duration);

        // Show confetti for special achievements
        if (notification.type === 'badge' || notification.type === 'levelup') {
            this.showConfetti();
        }
    }

    /**
     * Dismiss a notification
     */
    dismissNotification(toast, id) {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }

            // Remove from active notifications
            const index = this.activeNotifications.indexOf(id);
            if (index > -1) {
                this.activeNotifications.splice(index, 1);
            }

            // Process next in queue
            this.processQueue();
        }, 300);
    }

    /**
     * Get icon for notification type
     */
    getIcon(type) {
        const icons = {
            points: '⭐',
            badge: '🏅',
            levelup: '🎉',
            success: '✅',
            info: 'ℹ️',
            error: '❌',
            warning: '⚠️'
        };
        return icons[type] || 'ℹ️';
    }

    /**
     * Show confetti animation
     */
    showConfetti() {
        const colors = ['#FF6B35', '#FFB347', '#52B788', '#4FC3F7', '#006994'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            // Random rotation
            const rotation = Math.random() * 360;
            confetti.style.transform = `rotate(${rotation}deg)`;

            this.confettiContainer.appendChild(confetti);

            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => {
            const id = parseInt(toast.getAttribute('data-id'));
            this.dismissNotification(toast, id);
        });
        this.queue = [];
    }

    /**
     * Show success message
     */
    success(message, duration) {
        this.show('success', message, duration);
    }

    /**
     * Show info message
     */
    info(message, duration) {
        this.show('info', message, duration);
    }

    /**
     * Show error message
     */
    error(message, duration) {
        this.show('error', message, duration);
    }

    /**
     * Show warning message
     */
    warning(message, duration) {
        this.show('warning', message, duration);
    }

    /**
     * Show points notification
     */
    points(amount, reason) {
        this.show('points', `+${amount} points! ${reason}`);
    }

    /**
     * Show badge unlock notification
     */
    badge(badgeName, badgeIcon) {
        this.show('badge', `${badgeIcon} Badge Unlocked: ${badgeName}!`, 5000);
    }

    /**
     * Show level up notification
     */
    levelup(levelName, levelIcon) {
        this.show('levelup', `${levelIcon} Level Up! You're now a ${levelName}!`, 5000);
    }
}

// Create global instance
const VenezuelaNotifications = new VenezuelaNotificationSystem();

// Expose globally
window.VenezuelaNotifications = VenezuelaNotifications;

// Listen for custom notification events
window.addEventListener('venezuela:notification', (e) => {
    const { type, message } = e.detail;
    VenezuelaNotifications.show(type, message);
});

console.log('%c🔔 Venezuela Notification System Loaded', 'color: #FFB347; font-size: 14px; font-weight: bold;');
console.log('%cUse VenezuelaNotifications in console:', 'color: #FFB347; font-size: 12px;');
console.log('%c  VenezuelaNotifications.success("Test!")', 'color: #FFB347; font-size: 11px;');
console.log('%c  VenezuelaNotifications.badge("Beach Explorer", "🌊")', 'color: #FFB347; font-size: 11px;');
