# Venezuela Travel Website

A gamified travel website showcasing Venezuela's beaches and natural wonders.

## 🗂️ Project Structure

```
├── index.html          # Homepage with hero and section previews
├── beaches.html        # Beach destinations (Los Roques, Morrocoy, Margarita)
├── attractions.html    # Natural wonders (Angel Falls, Roraima, Canaima)
├── map.html            # Interactive SVG map with 6 regions
├── passport.html       # Gamification hub (badges, stamps, progress)
├── css/
│   ├── styles.css      # Global styles + animations
│   ├── beaches.css     # Beach page styles
│   ├── attractions.css # Attractions styles
│   ├── map.css         # Map styles
│   └── passport.css    # Passport styles
└── js/
    ├── main.js         # Homepage logic
    ├── gamification.js # Points, badges, levels system
    ├── notifications.js# Toast notifications + confetti
    ├── universal.js    # Global interactions
    ├── beaches.js      # Beach interactions + quiz
    ├── attractions.js  # Attractions + wildlife tracking
    ├── map.js          # Map region interactions
    └── passport.js     # Stats, timeline, export
```

## 🎮 Gamification System

### Points
- Page visit: 10 pts
- Explore destination: 25 pts
- Quiz correct answer: 50 pts
- Badge unlock: 100 pts

### 12 Badges
- First Steps, Beach Explorer, Mountain Climber
- Wildlife Spotter, Photographer, History Buff
- Adventure Seeker, Night Owl, Early Bird
- Map Master, Passport Pro, Completionist

### 4 Levels
- Explorer (0-499 pts)
- Adventurer (500-1499 pts)
- Discoverer (1500-2999 pts)
- Legend (3000+ pts)

### Persistence
- All progress saved to localStorage
- Export/import JSON backup
- Reset option available

## 🌊 Features

- **Animated waves** on beach sections
- **Flying birds** across screens
- **Floating mist** on attractions
- **Interactive SVG map** with clickable regions
- **Flip cards** on beaches
- **3D tilt effect** on attractions
- **Confetti** on achievements
- **Toast notifications** for feedback
- **Quizzes** with instant scoring

## 🚀 Running Locally

Just open `index.html` in a browser - no server needed!

## 🔧 Tech Stack

- HTML5
- CSS3 (animations, grid, flexbox)
- Vanilla JavaScript (no frameworks)
- localStorage for persistence
