/**
 * Venezuela Interactive Map
 *
 * Features:
 * - Region hover/click interactions
 * - Info card display
 * - Gamification integration
 * - Progress tracking
 * - localStorage persistence
 */

class VenezuelaInteractiveMap {
    constructor() {
        // Region data
        this.regionData = {
            'caribbean-coast': {
                name: 'Caribbean Coast',
                image: 'images/region-caribbean.png',
                description: 'Experience pristine beaches, crystal-clear waters, and vibrant coral reefs along Venezuela\'s stunning Caribbean coastline.',
                attractions: ['Los Roques Archipelago', 'Morrocoy National Park', 'Coche Island', 'Tucacas Bay'],
                link: 'beaches.html'
            },
            'margarita-island': {
                name: 'Margarita Island',
                image: 'images/margarita-island.png',
                description: 'Discover the Pearl of the Caribbean with its beautiful beaches, duty-free shopping, and vibrant nightlife.',
                attractions: ['Playa El Agua', 'La Restinga Lagoon', 'Pampatar Castle', 'Macanao Peninsula'],
                link: 'beaches.html'
            },
            'andes-region': {
                name: 'Andes Mountains',
                image: 'images/region-andes.png',
                description: 'Explore majestic mountain peaks, charming colonial towns, and unique cloud forests in the Venezuelan Andes.',
                attractions: ['Mérida City', 'Pico Bolívar', 'Cable Car System', 'Sierra Nevada National Park'],
                link: 'attractions.html'
            },
            'los-llanos': {
                name: 'Los Llanos',
                image: 'images/region-los-llanos.png',
                description: 'Witness incredible wildlife in vast tropical plains where capybaras, anacondas, and caimans roam free.',
                attractions: ['Hato El Cedral', 'Wildlife Safaris', 'Apure River', 'Cattle Ranches'],
                link: 'attractions.html'
            },
            'orinoco-delta': {
                name: 'Orinoco Delta',
                image: 'images/region-orinoco.png',
                description: 'Navigate through labyrinthine waterways and experience indigenous Warao culture in this unique ecosystem.',
                attractions: ['Warao Villages', 'River Cruises', 'Mangrove Forests', 'Exotic Wildlife'],
                link: 'attractions.html'
            },
            'canaima-gran-sabana': {
                name: 'Canaima & Gran Sabana',
                image: 'images/canaima-national-park.png',
                description: 'Marvel at Angel Falls, the world\'s highest waterfall, and explore ancient tepuis in this UNESCO World Heritage site.',
                attractions: ['Angel Falls', 'Mount Roraima', 'Canaima National Park', 'Kavac Canyon'],
                link: 'attractions.html'
            }
        };

        // State management
        this.exploredRegions = new Set();
        this.currentInfoCard = null;

        // DOM elements
        this.elements = {};

        // Initialize
        this.init();
    }

    /**
     * Initialize the map
     */
    init() {
        console.log('🗺️ Interactive Map Initializing...');

        // Get DOM elements
        this.elements = {
            regions: document.querySelectorAll('.region'),
            markers: document.querySelectorAll('.marker'),
            tooltip: document.getElementById('mapTooltip'),
            infoPanel: document.getElementById('infoCardPanel'),
            closeButton: document.getElementById('closeInfoCard'),
            regionsExplored: document.getElementById('regionsExplored'),
            progressBar: document.getElementById('mapProgressBar'),
            infoCardImage: document.getElementById('infoCardImage'),
            infoCardTitle: document.getElementById('infoCardTitle'),
            infoCardDescription: document.getElementById('infoCardDescription'),
            infoCardAttractionsList: document.getElementById('infoCardAttractionsList'),
            infoCardButton: document.getElementById('infoCardButton')
        };

        // Load saved progress
        this.loadProgress();

        // Setup event listeners
        this.setupRegionListeners();
        this.setupMarkerListeners();
        this.setupCloseButton();

        // Update display
        this.updateProgress();

        // Track map usage for badge
        if (window.VenezuelaGame) {
            window.VenezuelaGame.userProgress.mapUsed = true;
            window.VenezuelaGame.saveProgress();
            window.VenezuelaGame.checkBadges();
        }

        console.log('✅ Interactive Map Ready!');
    }

    /**
     * Setup region click and hover listeners
     */
    setupRegionListeners() {
        this.elements.regions.forEach(region => {
            const regionId = region.getAttribute('data-region');
            const regionName = region.getAttribute('data-name');

            // Hover events
            region.addEventListener('mouseenter', (e) => {
                this.showTooltip(e, regionName);
            });

            region.addEventListener('mousemove', (e) => {
                this.updateTooltipPosition(e);
            });

            region.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            // Click event
            region.addEventListener('click', (e) => {
                this.handleRegionClick(regionId, region);
            });
        });
    }

    /**
     * Setup marker listeners
     */
    setupMarkerListeners() {
        this.elements.markers.forEach(marker => {
            const location = marker.getAttribute('data-location');

            marker.addEventListener('mouseenter', (e) => {
                this.showTooltip(e, location);
            });

            marker.addEventListener('mousemove', (e) => {
                this.updateTooltipPosition(e);
            });

            marker.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    /**
     * Setup close button
     */
    setupCloseButton() {
        this.elements.closeButton.addEventListener('click', () => {
            this.closeInfoCard();
        });

        // Close on outside click
        this.elements.infoPanel.addEventListener('click', (e) => {
            if (e.target === this.elements.infoPanel) {
                this.closeInfoCard();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.infoPanel.classList.contains('show')) {
                this.closeInfoCard();
            }
        });
    }

    /**
     * Show tooltip
     */
    showTooltip(event, text) {
        this.elements.tooltip.textContent = text;
        this.elements.tooltip.classList.add('show');
        this.updateTooltipPosition(event);
    }

    /**
     * Update tooltip position
     */
    updateTooltipPosition(event) {
        const tooltip = this.elements.tooltip;
        tooltip.style.left = event.pageX + 'px';
        tooltip.style.top = event.pageY + 'px';
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.elements.tooltip.classList.remove('show');
    }

    /**
     * Handle region click
     */
    handleRegionClick(regionId, regionElement) {
        console.log('Region clicked:', regionId);

        // Add pulse animation
        regionElement.classList.add('pulsing');
        setTimeout(() => {
            regionElement.classList.remove('pulsing');
        }, 600);

        // Mark as explored
        const isNewExploration = !this.exploredRegions.has(regionId);
        this.exploredRegions.add(regionId);
        regionElement.classList.remove('unexplored');
        regionElement.classList.add('explored');

        // Save progress
        this.saveProgress();
        this.updateProgress();

        // Award points if new region
        if (isNewExploration && window.VenezuelaGame) {
            window.VenezuelaGame.addPoints(10, `Explored ${this.regionData[regionId].name}`);

            // Check for Map Master badge
            if (this.exploredRegions.size === 6) {
                window.VenezuelaGame.unlockBadge('map_master');
            }
        }

        // Show info card
        this.showInfoCard(regionId);
    }

    /**
     * Show info card for region
     */
    showInfoCard(regionId) {
        const data = this.regionData[regionId];
        if (!data) return;

        this.currentInfoCard = regionId;

        // Update content
        this.elements.infoCardImage.src = data.image;
        this.elements.infoCardImage.alt = data.name;
        this.elements.infoCardTitle.textContent = data.name;
        this.elements.infoCardDescription.textContent = data.description;

        // Update attractions list
        this.elements.infoCardAttractionsList.innerHTML = '';
        data.attractions.forEach(attraction => {
            const li = document.createElement('li');
            li.textContent = attraction;
            this.elements.infoCardAttractionsList.appendChild(li);
        });

        // Update button link
        this.elements.infoCardButton.href = data.link;

        // Show panel
        this.elements.infoPanel.classList.add('show');

        // Hide tooltip
        this.hideTooltip();
    }

    /**
     * Close info card
     */
    closeInfoCard() {
        this.elements.infoPanel.classList.remove('show');
        this.currentInfoCard = null;
    }

    /**
     * Update progress display
     */
    updateProgress() {
        const explored = this.exploredRegions.size;
        const total = 6;
        const percentage = (explored / total) * 100;

        // Update counter
        this.elements.regionsExplored.textContent = explored;

        // Update progress bar
        this.elements.progressBar.style.width = percentage + '%';

        // Update region states
        this.elements.regions.forEach(region => {
            const regionId = region.getAttribute('data-region');
            if (this.exploredRegions.has(regionId)) {
                region.classList.add('explored');
                region.classList.remove('unexplored');
            } else {
                region.classList.add('unexplored');
                region.classList.remove('explored');
            }
        });
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const progress = {
                exploredRegions: Array.from(this.exploredRegions),
                lastUpdated: Date.now()
            };
            localStorage.setItem('venezuelaMapProgress', JSON.stringify(progress));
            console.log('Map progress saved');
        } catch (error) {
            console.error('Error saving map progress:', error);
        }
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('venezuelaMapProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.exploredRegions = new Set(progress.exploredRegions || []);
                console.log('Map progress loaded:', this.exploredRegions);
            }
        } catch (error) {
            console.error('Error loading map progress:', error);
        }
    }

    /**
     * Reset map progress (for testing)
     */
    reset() {
        if (confirm('Reset map exploration progress?')) {
            this.exploredRegions.clear();
            this.saveProgress();
            this.updateProgress();
            console.log('Map progress reset');
        }
    }

    /**
     * Get exploration statistics
     */
    getStats() {
        return {
            explored: this.exploredRegions.size,
            total: 6,
            percentage: Math.floor((this.exploredRegions.size / 6) * 100),
            regions: Array.from(this.exploredRegions),
            isComplete: this.exploredRegions.size === 6
        };
    }
}

// Initialize map when DOM is ready
let VenezuelaMap;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        VenezuelaMap = new VenezuelaInteractiveMap();
    });
} else {
    VenezuelaMap = new VenezuelaInteractiveMap();
}

// Expose globally for debugging
window.VenezuelaMap = VenezuelaMap;

// Developer console helpers
console.log('%c🗺️ Venezuela Interactive Map Loaded', 'color: #52B788; font-size: 14px; font-weight: bold;');
console.log('%cUse VenezuelaMap in console:', 'color: #95D5B2; font-size: 12px;');
console.log('%c  VenezuelaMap.getStats()', 'color: #95D5B2; font-size: 11px;');
console.log('%c  VenezuelaMap.reset()', 'color: #95D5B2; font-size: 11px;');
