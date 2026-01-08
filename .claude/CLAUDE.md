# Venezuela Travel Website

A gamified travel website showcasing Venezuela's beaches and natural wonders. Built with vanilla HTML5, CSS3, and JavaScript - no frameworks required.

## 🗂️ Project Structure

```
├── index.html          # Homepage with hero, particles, and section previews
├── beaches.html        # Beach destinations with flip cards & quiz system
├── attractions.html    # Natural wonders with 3D tilt effects
├── map.html            # Interactive SVG map with 6 clickable regions
├── passport.html       # Gamification hub (badges, progress, stats, export/import)
├── images/             # Badge images and assets
├── css/
│   ├── styles.css      # Global styles, animations, responsive design
│   ├── beaches.css     # Beach page (waves, cards, quiz styling)
│   ├── attractions.css # Attractions page (tilt effects, mist)
│   ├── map.css         # Map page (SVG regions, tooltips)
│   └── passport.css    # Passport page (stats, timeline, badges)
└── js/
    ├── gamification.js # Core system: points, 12 badges, 4 levels, streak multipliers
    ├── notifications.js# Toast notifications + confetti animations
    ├── universal.js    # Global interactions: navbar, scroll-to-top, footer updates
    ├── main.js         # Homepage: parallax, hero animations, CTA buttons
    ├── beaches.js      # Beach cards, quizzes, flip animations
    ├── attractions.js  # Wildlife tracking, image gallery
    ├── map.js          # SVG region interactions, progress tracking
    └── passport.js     # Stats display, timeline, export/import/reset
```

## 🎮 Gamification System

### Points & Multipliers
- Page visit: 10 pts
- Explore destination: 25 pts
- Read through page: 25 pts (80% scroll depth)
- Badge unlock: 100 pts
- **Streak Multipliers:** 1.2x (2-day), 1.5x (3-7 days), 2.0x (7+ days)

### 12 Achievement Badges
1. **First Steps** 👣 - Visit your first destination
2. **Beach Explorer** 🌊 - Visit all beach pages
3. **Mountain Climber** 🏔️ - Visit Angel Falls & Roraima
4. **Wildlife Spotter** 🦜 - Discover 5+ wildlife mentions
5. **Photographer** 📸 - View 10+ destination images
6. **History Buff** 📚 - Read about Venezuelan culture
7. **Adventure Seeker** 🗺️ - Explore 8+ destinations
8. **Night Owl** 🦉 - Visit site after 8 PM (20:00-06:00)
9. **Early Bird** 🐦 - Visit site before 8 AM (05:00-08:00)
10. **Map Master** 🧭 - Use the interactive map
11. **Passport Pro** 🛂 - Fill 50% of passport (8+ destinations)
12. **Completionist** 👑 - Earn all other badges

### 4 Player Levels
- **Explorer** 🧭 - 0-499 pts
- **Adventurer** ⛰️ - 500-1499 pts
- **Discoverer** 🔭 - 1500-2999 pts
- **Legend** 👑 - 3000+ pts

### Progress Tracking
- All progress saved to localStorage
- JSON export/import for backup and sharing
- Reset option (with confirmation)
- Streak tracking (current & longest)
- Time spent tracking
- Visit date history

## ✨ Features

### Visual Effects
- **Particle animations** on hero section
- **Wave animations** (3-layer parallax) on beach section
- **Mountain silhouette** parallax on attractions teaser
- **Flying sand particles** on beach pages
- **3D tilt effect** on attraction cards
- **Floating mist effects** on attraction backgrounds
- **Ripple effects** on all buttons
- **Fade-in animations** on scroll
- **Parallax scrolling** on homepage hero

### Interactive Elements
- **Mobile-responsive hamburger menu** with smooth transitions
- **Scroll-to-top button** (appears after 300px scroll)
- **Interactive SVG map** with 6 clickable Venezuelan regions
- **Flip cards** on beach destinations
- **Beach quizzes** with instant scoring and feedback
- **Wildlife/image gallery tracker** on attractions
- **Toast notifications** for all user actions
- **Confetti animation** on badge unlocks
- **Welcome modal** with adventure prompt

### User Experience
- **Smooth page transitions** with loading animation
- **Responsive grid layouts** across all pages
- **Active navigation highlighting** based on current page
- **Dark theme** with vibrant accent colors (#FF6B35, #0098D9)
- **Accessibility** with proper ARIA labels and semantic HTML
- **Mobile-first design** (tested at 375px+ widths)

## 🚀 Running Locally

Just open `index.html` in a browser - no server needed!

## 🔧 Tech Stack

- **HTML5** - Semantic structure with ARIA labels
- **CSS3** - Animations, transitions, CSS Grid, Flexbox, CSS custom properties
- **Vanilla JavaScript** (3,447 lines) - No frameworks or dependencies
- **localStorage** - Client-side persistence for gamification progress
- **SVG** - Interactive map visualization

## 🎨 Design System

### Color Palette
- **Primary Orange:** #FF6B35 (CTAs, accents)
- **Secondary Blue:** #0098D9 (highlights, links)
- **Green Accent:** #52B788 (gamification, positive)
- **Dark Background:** #1A1A1A (main bg)
- **Light Gray:** #E8E8E8 (text, borders)

### Typography
- **Headings:** Bold, large sizes (2rem-3rem)
- **Body:** Regular, readable (1rem-1.1rem)
- **Accent:** Emojis used throughout for visual appeal

### Responsive Breakpoints
- Mobile: 0-768px
- Tablet: 768px-1024px
- Desktop: 1024px+

## 📡 Gamification API

### Global Instance: `window.VenezuelaGame`

#### Methods
```javascript
// Points
VenezuelaGame.addPoints(amount, reason)

// Badges
VenezuelaGame.unlockBadge(badgeId)
VenezuelaGame.checkBadges()

// Tracking
VenezuelaGame.trackPageVisit(pageId)

// Progress
VenezuelaGame.getProgress()  // Returns full progress object

// Data Management
VenezuelaGame.exportProgress()
VenezuelaGame.importProgress(file)
VenezuelaGame.reset()

// Display
VenezuelaGame.updateDisplay()
```

#### Events
- `venezuela:notification` - Custom event fired on all actions
- `gamification-update` - Event for footer stats updates

## 📝 Development Notes

### Adding New Content
1. Add page to `index.html` navigation
2. Create new `.html` file with standard header/footer
3. Create page-specific CSS in `css/`
4. Track visits: `VenezuelaGame.trackPageVisit('page-id')`

### Adding New Badges
1. Add badge definition to `gamification.js` (badges object)
2. Include icon/image, name, description, and condition function
3. Badge unlocks automatically when condition is met
4. Add emoji + image in `images/badges/` (optional)

### Performance Notes
- All CSS animations use `transform` and `opacity` for smooth 60fps
- localStorage capped at ~5MB
- Images lazy-loaded where possible
- No external API calls required

## 🌍 Pages Overview

### index.html
Homepage with hero section, 3 preview sections (beaches, attractions, gamification), and footer with social links.

### beaches.html
Showcases 3 beach destinations with flip cards, wave animations, and quiz functionality for each location.

### attractions.html
Features natural wonders (Angel Falls, Roraima, Canaima) with 3D tilt cards and wildlife tracking.

### map.html
Interactive SVG map of Venezuela with 6 clickable regions. Each click reveals regional information and tracks map usage.

### passport.html
Gamification hub displaying player stats, collected badges, places visited, achievements timeline, and export/import controls.
