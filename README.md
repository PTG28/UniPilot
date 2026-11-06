# UniPilot — interactive mockup (extension for Uni Students)

UniPilot is an extension for the existing **Uni Students** app. Uni Students shows which courses a student passed or failed each semester. UniPilot reads those grades and adds AI guidance. Emile is its mascot. It recommends courses from a student's interests and strengths, helps them shape a semester plan, and turns a short exam check-in into a focused study suggestion.

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

This is a front-end prototype. All student details, course data, match scores, and exam feedback are sample content; no university account or AI service is connected. The provided mascot images are stored alongside the mockup as `emile.webp` and `emile_hi.webp`.
