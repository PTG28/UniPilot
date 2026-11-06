# StudySync — HW1 Interactive Mockup

**Know if you'll be ready *before* the exam.**

StudySync is a mobile study companion for university students. Instead of just tracking study time, it **predicts how ready you will be on exam day** for each course, and **recommends what to study next and at which hour** you are likely to focus best.

> This is an interactive, clickable mockup. All data and predictions are simulated. Nothing is sent anywhere.

## How to run

No build step and no dependencies. Do one of these:

- Open `index.html` in any modern browser, **or**
- Serve the folder: `python3 -m http.server 8000`, then open <http://localhost:8000>

On a desktop the app appears inside a phone frame. On a phone it fills the screen.

## The AI / ML features

### 1. Predictive model: exam readiness forecast
For every course, StudySync predicts your readiness (0–100%) on exam day, with a confidence band.
- **Inputs (features):** topic mastery (self-ratings and quick quizzes), study consistency over the last 14 days, average focus rating during sessions, material remaining vs. days left, and each topic's exam weight.
- **Output:** predicted readiness on exam day, with ±uncertainty. Each course is labelled *On track* (≥80%), *At risk* (65–79%) or *Behind* (<65%).
- The band narrows as more sessions are logged.

### 2. Predictive model: personal focus forecast
After each session the user rates their focus (1–5). The model learns how focus varies by hour of day, weekday, session length and (optionally) sleep, and predicts today's focus **hour by hour**.

### 3. Recommender system: next best session + weekly plan
Every (course, topic) pair is ranked by:
- predicted shortfall below the 80% "ready" line
- exam urgency (days left)
- topic weakness × exam weight

The top recommendation is matched with the user's best upcoming focus slot. Each recommendation shows **"Why this?"** and the expected readiness gain. The same ranking drives an auto-generated **weekly study plan**.

## Things to try in the mockup

1. Go through onboarding (or tap **Skip**).
2. On **Today**, read the recommended session and tap **⋯** to see the other ranked options.
3. Tap a course card to see its **readiness trajectory** (history + dashed forecast + confidence band), its topics, and the factors driving the prediction.
4. Tap **Start now**, then **⏩ Skip (demo)**. Rate your focus and confidence, then tap **Update my predictions**. The forecast goes up, and the Today screen and recommendations update.
5. Open **Plan**: switch days, tap a session block, and change sessions/day or session length in settings (⚙).
6. Open **Insights** for the focus heatmap and model accuracy.
7. On **Courses**, tap **+** to add a new course.
8. The **?** buttons explain how each model works.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell + phone frame + project description panel |
| `styles.css` | All styling |
| `app.js` | Screens, navigation, simulated models, interactions |

## Roadmap (later in the semester)
- Replace the simulated models with real ones: e.g. gradient-boosted regression for readiness, and a time-series/contextual model for focus.
- A learned recommender (contextual bandit) that optimizes readiness gain per session.
- Backend, user accounts, e-class calendar import, notifications.
