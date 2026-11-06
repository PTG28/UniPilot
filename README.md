# Uni Students + Smart Advisor: HW1 Interactive Mockup

**Pick the right courses. Pass the ones you missed.**

**Uni Students** is an existing app that shows students which courses they passed or failed each semester, and their grades. It only *displays* the transcript.

**Smart Advisor** is a new extension that reads the grades already in Uni Students and adds three features:

1. **Choose Courses (recommender system):** recommends which courses to take next semester, based on your grades, prerequisites, interests and the outcomes of past students with similar transcripts.
2. **Exam Coach (predictive model):** predicts your chance of passing an exam and shows where to focus. It uses the topics that appear most in past exams and tips from students who passed.
3. **AI Revision (predictive model):** an AI-generated mock test in the style of past exams. From your answers it predicts how ready you are, your likely grade if you sat the exam today, and which topics to review.

> This is a clickable mockup. All data and predictions are simulated.

## How to run
No build step and no dependencies.
- Open `index.html` in a browser, **or**
- Run `python3 -m http.server 8000` in this folder, then open <http://localhost:8000>

On a desktop the app appears inside a phone frame. On a phone it fills the screen.

## The AI / ML features

### 1. Course recommender (Choose Courses tab)
Each available course gets a **match score**. Inputs:
- **Collaborative filtering:** grades of ~1,240 past students whose transcripts resemble yours, and how they did in each course
- **Prerequisites:** passed or not passed, with a warning when one is missing (e.g. AI needs Linear Algebra)
- **Content match:** your grades in related courses (e.g. OOP + Databases → Software Engineering)
- **Your interests** (Profile tab) and **workload balance** (hours/week)

**Output:** a ranked list, each course with a *predicted grade*, a "Why we recommend it" explanation, prerequisite status and the grade distribution of similar students. You can add courses to a semester plan (30 ECTS target).

### 2. Pass-probability model (Exam Coach tab)
For every failed course the app predicts the **chance of passing the next exam**. Inputs:
- previous grade and number of attempts
- grades in related courses
- what successful past students did before they passed

It also analyses **past exam papers** to show which topics appear most often (e.g. "Hypothesis testing: 10/10 exams, 30% of marks"). It then builds a **focus plan**: ticking off each item raises the predicted pass probability (e.g. Statistics 38% → 80%). Underneath are **tips from students who passed**, which can be upvoted, and past exam papers.

### 3. Readiness prediction (AI Revision tab)
The AI generates multiple-choice questions from the most frequent past-exam topics. Your results, combined with your previous grades, give:
- a **readiness score** (Ready / Almost ready / Not ready yet)
- a **predicted grade** and chance to pass if you sat the exam today
- a **per-topic breakdown** and an AI suggestion of what to review, linking to the Exam Coach focus plan

## Things to try
1. On the intro screen, Smart Advisor shows it's connected to Uni Students. Tap **Get started**.
2. **Choose Courses:** add courses to your plan until you reach 30 ECTS. Open **Artificial Intelligence** to see a missing-prerequisite warning.
3. **Exam Coach → Statistics:** tick items in the focus plan and watch the pass probability rise. Scroll down for exam-topic frequency, student tips and past papers.
4. **AI Revision → Statistics → Start:** answer the questions to get your readiness report, predicted grade and weak topics.
5. The **?** buttons explain how each model works.

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
