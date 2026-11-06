# Uni Students + Smart Advisor: HW1 Interactive Mockup

**Pick the right courses. Pass the ones you missed.**

**Uni Students** is an existing app that shows students which courses they passed or failed each semester, and their grades. It only *displays* the transcript.

**Smart Advisor** is a new extension that turns the transcript into personalised guidance:

1. **Next Semester (recommender system):** suggests which courses to choose next semester, based on your grades, prerequisites, interests and the outcomes of past students with similar transcripts.
2. **Retake Coach (predictive model):** for each failed course, predicts your chance of passing the next exam and tells you where to focus. It uses past exam papers and tips from students who passed.

> This is a clickable mockup. All data and predictions are simulated.

## How to run
No build step and no dependencies.
- Open `index.html` in a browser, **or**
- Run `python3 -m http.server 8000` in this folder, then open <http://localhost:8000>

On a desktop the app appears inside a phone frame. On a phone it fills the screen.

## The AI / ML features

### 1. Course recommender (Next Semester tab)
Each available course gets a **match score**. Inputs:
- **Collaborative filtering:** grades of ~1,240 past students whose transcripts resemble yours, and how they did in each course
- **Prerequisites:** passed or not passed, with a warning when one is missing (e.g. AI needs Linear Algebra)
- **Content match:** your grades in related courses (e.g. OOP + Databases → Software Engineering)
- **Your interests** (Profile tab) and **workload balance** (hours/week)

**Output:** a ranked list, each course with a *predicted grade*, a "Why we recommend it" explanation, prerequisite status and the grade distribution of similar students. You can add courses to a semester plan (30 ECTS target).

### 2. Pass-probability model (Retake Coach tab)
For every failed course the app predicts the **chance of passing the next exam**. Inputs:
- previous grade and number of attempts
- grades in related courses
- what successful past students did before they passed

It also analyses **past exam papers** to show which topics appear most often (e.g. "Hypothesis testing: 10/10 exams, 30% of marks"). It then builds a **focus plan**: ticking off each item raises the predicted pass probability (e.g. Statistics 38% → 80%). Underneath are **tips from students who passed**, which can be upvoted, and past exam papers.

## Things to try
1. Tap **Show me** on the intro screen. **My Grades** is the existing Uni Students view, with semesters you can expand and collapse.
2. Tap the purple banner or the **Next Semester** tab. Add courses to your plan until you reach 30 ECTS.
3. Open **Artificial Intelligence** to see a missing-prerequisite warning and a low predicted grade.
4. Open **Retake Coach → Statistics**. Tick items in the focus plan and watch the pass probability go up.
5. Scroll down to the exam-topic frequency bars, the student tips and the past papers.
6. The **?** buttons explain how each model works.

## Files
| File | Purpose |
|---|---|
| `index.html` | Page shell, phone frame, project description |
| `styles.css` | Styling |
| `app.js` | Screens, navigation, simulated data and models |

## Roadmap
- Real recommender (matrix factorisation / k-NN over anonymised transcripts)
- Real pass-probability model (logistic regression / gradient boosting)
- NLP over past exam papers to extract topics automatically
- Integration with the real Uni Students app data and university registration
