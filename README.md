# UniPilot — interactive mockup (extension for Uni Students)

UniPilot is an extension for the existing **Uni Students** app. Uni Students shows which courses a student passed or failed each semester. UniPilot reads those grades and adds AI guidance. Emile is its mascot. It recommends courses from a student's interests and strengths, helps them shape a semester plan, and turns a short exam check-in into a focused study suggestion.

## Why this idea: go-to-market strategy
We chose to build UniPilot as an **extension of Uni Students** rather than as a standalone app. The main reason is distribution.

- **No cold start.** A new app normally spends a lot of time and money on marketing before it has enough users. UniPilot would launch inside an app that hundreds of students already use, so it has an audience from day one.
- **Partnership instead of an ad budget.** Instead of paying for promotion, we would offer Uni Students a **share of UniPilot's profits**. They get a new revenue stream and a more useful app, and we get their existing user base.
- **The data is already there.** Uni Students already holds each student's passed and failed courses and grades. These are exactly the inputs our recommender and predictive models need, so students don't have to enter anything by hand.
- **Better models, faster.** More users from the start means more grades, quiz results and feedback from students who passed. That improves our course recommendations and pass predictions much sooner than a standalone app could.

## AI features
- **Recommender system (Course explorer, AI advisor, Overview):** ranks courses by a *fit score* computed from the student's grades in related courses, their chosen pathway (Cybersecurity, Software, Data & AI) and their interests. Every match explains why it fits.
- **Predictive model (Exam coach):** a short check-in built from the topics that appear most in past exams predicts the student's **readiness**, their **likely grade if the exam were today** and their **chance to pass**. It shows how often each topic appeared in the last 10 exams, says where to focus, and adds **tips from students who passed** the course.

## Open the mockup

Open `index.html` in a browser. No installation or server is required.

## Clickable flows

- Use the sidebar or mobile navigation to move between Overview, Course explorer, AI advisor, Semester planner, and Exam coach.
- In Course explorer, search by course or skill, filter by pathway or difficulty, open course details, and add courses to the planner.
- In AI advisor, choose a pathway and interests, then refresh the ranked course matches.
- In Semester planner, add and remove courses and see the ECTS total update.
- In Exam coach, answer three sample Computer Networks questions to get a readiness score, a predicted grade, a chance to pass, topic frequency in past exams, a focus suggestion and tips from students who passed.

This is a front-end prototype. All student details, course data, match scores, and exam feedback are sample content; no university account or AI service is connected. The provided mascot images are in the `assets/` folder (`assets/emile.webp`, `assets/emile_hi.webp`). Keep that folder next to `index.html`.
