# 🧠 Brain Sharp - Prototype

**Critical Thinking & Survival Decision Game**

## 📖 Overview

Brain Sharp is an educational brain puzzle game that tests your critical thinking and decision-making skills in realistic emergency scenarios. Face nature disasters, medical emergencies, wildlife encounters, and extreme conditions - then learn from expert feedback.

## ✨ Features

### Current (MVP - Prototype)
- ✅ 10 diverse scenarios across categories:
  - 🏔️ Nature (mountain blizzard, quicksand, rip current)
  - 🌊 Disasters (flash flood, avalanche, lightning)
  - 🐻 Wildlife (grizzly bear encounter)
  - 🏥 Medical (snake bite, hypothermia)
  - 🏜️ Extreme (desert heat stroke)

- ✅ Smart scoring system (optimal/good/poor/fatal outcomes)
- ✅ Lives system (3 lives - fatal mistakes cost a life)
- ✅ Expert explanations for every choice
- ✅ Difficulty levels (beginner/intermediate/expert)
- ✅ Educational expert tips
- ✅ Beautiful UI (similar to AG Sudoku style)
- ✅ Mobile-responsive design
- ✅ Score tracking

## 🎮 How to Play

1. **Open `brain-sharp.html`** in any modern browser
2. **Read the scenario** carefully - pay attention to conditions, resources, and time limits
3. **Make your decision** - choose A, B, C, or D
4. **Learn from feedback** - get expert analysis on your choice
5. **Continue or Game Over** - survive to keep playing!

## 🎯 Scoring System

| Outcome | Points | Description |
|---------|--------|-------------|
| **Optimal** | +100 | Perfect decision, textbook response |
| **Good** | +60-70 | Acceptable choice, reasonable approach |
| **Poor** | +10-40 | Risky decision, not recommended |
| **Fatal** | -50 to -100 | Critical error, loses a life |

## 🏗️ Technical Stack

### Prototype
- Pure HTML + React (via CDN)
- No build process - just open and play!
- Self-contained single file
- Works offline

### Future (Production)
- React + TypeScript
- AI-powered scenario generation (Claude API)
- Backend for leaderboards (Firebase/Supabase)
- User accounts and progress tracking

## 📁 Files

```
Brain Sharp/
├── brain-sharp.html          # Playable prototype (OPEN THIS!)
├── BrainSharp.tsx            # React component (for integration)
└── README.md                 # This file
```

## 🚀 Next Steps

### Phase 1: Content Expansion (1 week)
- [ ] Add 20+ more scenarios
- [ ] Create category selection menu
- [ ] Add difficulty selection
- [ ] Implement daily challenge mode

### Phase 2: AI Integration (2 weeks)
- [ ] Claude API for dynamic scenario generation
- [ ] Adaptive difficulty based on performance
- [ ] Personalized learning paths
- [ ] Infinite unique scenarios

### Phase 3: Social Features (2 weeks)
- [ ] User accounts
- [ ] Global leaderboard
- [ ] Share scores
- [ ] Challenge friends
- [ ] Achievement badges

### Phase 4: Monetization (1 week)
- [ ] Freemium model
  - Free: 20 scenarios
  - Premium ($2.99/month): Unlimited AI scenarios
- [ ] Stripe integration
- [ ] Premium features

## 💡 AI Enhancement Ideas

```typescript
// Example: AI-Generated Scenario
const generateScenario = async (category: string, difficulty: string) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Generate a ${difficulty} survival scenario in ${category} 
                 with 4 choices (1 optimal, 2 decent, 1 dangerous).
                 Format as JSON with expert explanations.`
      }]
    })
  });
  return await response.json();
};
```

## 🎨 Design Philosophy

- **Educational first**: Real survival knowledge
- **Engaging gameplay**: Not preachy, actually fun
- **Expert-backed**: All scenarios researched
- **Beautiful UI**: Clean, modern, mobile-friendly
- **Accessible**: Clear text, good contrast

## 📊 Scenario Categories

### 🏔️ Nature
- Mountain survival
- Quicksand
- Rip currents
- *Future: Dehydration, altitude sickness, river crossing*

### 🌊 Disasters
- Flash floods
- Avalanche
- Lightning storms
- *Future: Earthquake, tornado, tsunami*

### 🐻 Wildlife
- Bear encounters
- *Future: Snake encounters, shark, wild boar, bees*

### 🏥 Medical
- Snake bites
- Hypothermia
- *Future: Heat stroke, broken bones, allergic reaction*

### 🏜️ Extreme Conditions
- Desert survival
- *Future: Arctic survival, jungle, ocean survival*

## 🔥 What Makes This Different?

### vs. Traditional Quiz Games:
- ✅ Real survival knowledge (not trivia)
- ✅ Expert feedback (learn why)
- ✅ Consequences matter (lives system)

### vs. Survival Sims:
- ✅ Quick sessions (2-5 min per scenario)
- ✅ Mobile-friendly
- ✅ Educational focus
- ✅ Text-based (no complex graphics needed)

### Unique Features:
- ✅ AI-generated infinite content (planned)
- ✅ Adaptive difficulty
- ✅ Real expert knowledge
- ✅ Educational + entertaining

## 🎯 Target Audience

- **Primary**: 18-45 year olds interested in survival/outdoors
- **Secondary**: Students (educational use)
- **Tertiary**: Preppers and outdoor enthusiasts

## 💰 Monetization Potential

### Freemium Model
- **Free Tier**: 20 scenarios, basic categories
- **Premium ($2.99/month)**:
  - Unlimited AI-generated scenarios
  - All difficulty levels
  - Detailed statistics
  - No ads
  - Expert mode with real-time decisions

### Alternative Revenue
- Educational partnerships (schools)
- Outdoor gear sponsor integrations
- Survival course affiliates

## 📈 Success Metrics

### MVP (Week 1)
- [ ] 50+ people play the prototype
- [ ] Average 5+ scenarios completed per session
- [ ] 70%+ say they learned something new

### Month 1
- [ ] 500+ users
- [ ] 10% conversion to premium
- [ ] 30% return within 7 days

## 🤝 Integration Ideas

### AG Games Platform
Could be part of "AG Games" alongside AG Sudoku:
- Shared user accounts
- Combined leaderboards  
- Cross-promotion
- Bundle subscription

## 🐛 Known Issues (Prototype)

- [ ] No scenario filtering yet
- [ ] No persistence (progress lost on refresh)
- [ ] Limited to 10 scenarios
- [ ] No sound effects
- [ ] No animations

## 🎓 Educational Value

### Real Learning Outcomes:
- ✅ Survival decision-making
- ✅ Risk assessment skills
- ✅ Emergency preparedness
- ✅ Critical thinking under pressure
- ✅ Science-backed survival techniques

### Potential Partnerships:
- Outdoor education programs
- Wilderness survival schools
- Boy Scouts / Girl Scouts
- Emergency preparedness organizations

## 📝 Notes

**Development Time**: ~3 hours for this prototype
**Next Version**: 2-3 days for 50 scenarios + polished UI
**Full Launch**: 4-6 weeks with AI integration

## 🎉 Try It Now!

Just open `brain-sharp.html` in your browser and start playing!

---

**Created**: December 2025  
**Developer**: Alex Goikoetxea  
**Status**: Playable Prototype ✅