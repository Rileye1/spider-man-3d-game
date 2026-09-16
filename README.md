# 🕷️ Spider-Man: No Way Home - 3D Fighting Game

A browser-based 3D fighting game featuring Spider-Man taking on increasingly challenging waves of enemies!

## 🎮 Features

- **Real-time 3D Combat** - Built with Three.js for smooth browser-based gameplay
- **Wave-based Difficulty** - Each wave brings stronger and faster enemies
- **Multiple Attack Types** - Web attacks, punches, and spinning attacks
- **Dynamic Combo System** - Build combos for score multipliers
- **Progressive Difficulty** - Enemies scale with each wave
- **Dynamic Camera** - Smooth camera follows the player
- **Particle Effects** - Visual feedback for attacks and impacts
- **Health System** - Manage your health while fighting enemies
- **Score Tracking** - Compete for high scores

## 🕹️ Controls

| Key | Action |
|-----|--------|
| **W/A/S/D** | Move Spider-Man |
| **SPACE** | Jump |
| **Q** | Web Attack (15 damage) |
| **E** | Punch Attack (20 damage) |
| **R** | Spin Attack (25 damage) |
| **Mouse** | Rotate Camera |

## 🎯 Gameplay

1. **Survive Waves** - Defeat all enemies in each wave to progress
2. **Manage Health** - Monitor your health bar; reach 0 and game over
3. **Build Combos** - Successive hits within a short time multiply your score
4. **Wave Progression** - Each new wave spawns more enemies with increased stats

### Wave Mechanics

- **Wave 1**: 2 weak enemies
- **Wave 2**: 3 medium enemies
- **Wave 3+**: Progressively stronger enemies with:
  - Higher health
  - Increased damage output
  - Faster movement speed
  - More frequent attacks

## 💻 Technical Stack

- **Three.js** - 3D graphics rendering
- **JavaScript (ES6+)** - Game logic and AI
- **WebGL** - Hardware-accelerated graphics
- **HTML5/CSS3** - UI and styling

## 🚀 How to Play

1. Open `index.html` in a modern web browser
2. Use controls to move Spider-Man around the arena
3. Attack enemies using Q, E, or R keys
4. Defeat all enemies in the wave to advance
5. Try to reach the highest wave possible!

## 🎨 Game Features

### Visual Design
- Dark, cyberpunk-style arena
- Red and blue color scheme (Spider-Man themed)
- Yellow enemy variants for wave difficulty indication
- Real-time shadow rendering
- Smooth lighting effects

### AI System
- **Idle State** - Enemies patrol randomly
- **Chase State** - Enemies pursue when player is nearby
- **Attack State** - Enemies deal damage when close
- **Difficulty Scaling** - AI improves with each wave

### Combat System
- Three unique attack types
- Attack cooldown management
- Damage calculation
- Knockback physics
- Hit detection

## 📊 Scoring

- **Defeating Enemy**: 100 × Wave Level points
- **Successful Hit**: 10 × Combo Multiplier points
- **Combo Bonus**: Successive hits multiply your score
- **Combo Decay**: Miss or get hit to lose combo

## 🔧 Installation

No installation required! Simply:

```bash
git clone https://github.com/Rileye1/spider-man-3d-game.git
cd spider-man-3d-game
# Open index.html in your browser
```

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires WebGL support and modern JavaScript (ES6+)

## 🎯 Tips & Tricks

1. **Use Spin Attack for Groups** - R key damage increases when surrounded
2. **Jump to Dodge** - Use spacebar to avoid incoming attacks
3. **Manage Stamina** - Each attack has a cooldown; plan your strategy
4. **Watch for Tells** - Enemies telegraph attacks, giving you time to dodge
5. **Combo Chains** - Keep hitting to maintain your combo multiplier

## 🚀 Future Enhancements

- [ ] Multiple playable Spider-Man variants
- [ ] Boss encounters
- [ ] Power-up items
- [ ] Sound effects and music
- [ ] Leaderboard system
- [ ] Mobile touch controls
- [ ] Different arena environments
- [ ] Enemy variations with unique abilities

## 📝 License

MIT License - Feel free to use and modify!

## 🎬 References

Inspired by Spider-Man: No Way Home and classic Spider-Man fighting games.

---

**Ready to save the city?** 🌃 Jump in and start fighting!
