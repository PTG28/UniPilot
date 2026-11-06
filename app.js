/* =========================================================================
   Uni Students + Smart Advisor — interactive mockup
   An extension for the "Uni Students" app (which shows passed/failed courses).
   Adds: (1) a RECOMMENDER for next-semester courses and
         (2) a PREDICTIVE "Retake Coach" that estimates pass probability for
             failed courses and tells you where to focus, based on past exams
             and feedback from students who passed.
   All data is simulated.
   ========================================================================= */

const I = {
  grades: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
};

// ---------- Seed data ----------
const SEMESTERS = [
  { n: 1, label: '1st semester · Winter 2024', courses: [
    { id: 'prog', name: 'Intro to Programming', g: 8.5, ects: 7.5 }, { id: 'calc', name: 'Calculus I', g: 6, ects: 7.5 },
    { id: 'disc', name: 'Discrete Mathematics', g: 7.5, ects: 7.5 }, { id: 'cs', name: 'Intro to Computer Science', g: 9, ects: 7.5 } ] },
  { n: 2, label: '2nd semester · Spring 2025', courses: [
    { id: 'oop', name: 'Object-Oriented Programming', g: 8, ects: 7.5 }, { id: 'linalg', name: 'Linear Algebra', g: 4, ects: 7.5 },
    { id: 'prob', name: 'Probability', g: 5.5, ects: 7.5 }, { id: 'digital', name: 'Digital Design', g: 7, ects: 7.5 } ] },
  { n: 3, label: '3rd semester · Winter 2025', courses: [
    { id: 'ds', name: 'Data Structures', g: 7.5, ects: 7.5 }, { id: 'arch', name: 'Computer Architecture', g: 6.5, ects: 7.5 },
    { id: 'stats', name: 'Statistics', g: 3, ects: 7.5 }, { id: 'eng', name: 'English for CS', g: 8, ects: 7.5 } ] },
  { n: 4, label: '4th semester · Spring 2026', courses: [
    { id: 'algo', name: 'Algorithms', g: 6, ects: 7.5 }, { id: 'db', name: 'Databases', g: 8.5, ects: 7.5 },
    { id: 'os', name: 'Operating Systems', g: 4.5, ects: 7.5 }, { id: 'net', name: 'Computer Networks', g: 6.5, ects: 7.5 } ] },
];

const RECS = [
  { id: 'se', name: 'Software Engineering', match: 94, pred: 8.2, ects: 7.5, hours: 8, prof: 'Prof. Diomidis', type: 'Core',
    because: ['You got 8 in Object-Oriented Programming', 'You got 8.5 in Databases'], prereq: [['Object-Oriented Programming', true]],
    similar: 312, passRate: 91, warn: null },
  { id: 'web', name: 'Web Programming', match: 90, pred: 8.4, ects: 6, hours: 7, prof: 'Prof. Lazaridis', type: 'Elective',
    because: ['Strong in programming courses (avg 8.0)', 'Students like you rated it 4.6/5'], prereq: [['Intro to Programming', true], ['Databases', true]],
    similar: 248, passRate: 88, warn: null },
  { id: 'is', name: 'Information Systems Analysis', match: 84, pred: 7.6, ects: 6, hours: 6, prof: 'Prof. Giakoumakis', type: 'Elective',
    because: ['Pairs well with Software Engineering', 'Low workload, balances your semester'], prereq: [],
    similar: 190, passRate: 93, warn: null },
  { id: 'sec', name: 'Computer Security', match: 78, pred: 7.0, ects: 6, hours: 9, prof: 'Prof. Gritzalis', type: 'Elective',
    because: ['You got 6.5 in Computer Networks', 'Builds on Operating Systems concepts'], prereq: [['Computer Networks', true], ['Operating Systems', false]],
    similar: 176, passRate: 74, warn: 'Students who hadn\'t passed Operating Systems scored ~1.2 points lower.' },
  { id: 'ai', name: 'Artificial Intelligence', match: 61, pred: 5.9, ects: 7.5, hours: 11, prof: 'Prof. Androutsopoulos', type: 'Core',
    because: ['Interest match: you chose "AI & data" in your profile'], prereq: [['Probability', true], ['Linear Algebra', false]],
    similar: 265, passRate: 69, warn: 'Linear Algebra is still open. We suggest passing it first — similar students had a 41% higher pass rate.' },
  { id: 'dm', name: 'Data Mining', match: 52, pred: 5.4, ects: 6, hours: 10, prof: 'Prof. Vazirgiannis', type: 'Elective',
    because: ['Interest match: "AI & data"'], prereq: [['Statistics', false], ['Databases', true]],
    similar: 158, passRate: 63, warn: 'Heavily based on Statistics, which you haven\'t passed yet. Better next year.' },
];

const COACH = {
  stats: { name: 'Statistics', grade: 3, attempts: 1, nextExam: 'Feb 2027 exam period', prob: 38, examTopics: [
      { n: 'Hypothesis testing (t-test, z-test)', freq: 10, pts: 30 }, { n: 'Confidence intervals', freq: 9, pts: 20 },
      { n: 'Linear regression', freq: 8, pts: 25 }, { n: 'Chi-square tests', freq: 6, pts: 15 }, { n: 'ANOVA', freq: 3, pts: 10 } ],
    tips: [ { who: 'Passed with 7 · Feb 2026', t: 'Every single exam has a hypothesis-testing problem worth ~30%. Learn the 5-step template by heart and you\'re halfway there.', up: 142 },
            { who: 'Passed with 6 · Sep 2025', t: 'Do the past papers from the last 4 years — the exercises repeat with different numbers.', up: 118 },
            { who: 'Passed with 8.5 · Feb 2025', t: 'Bring a clean formula sheet; you\'re allowed one. Practise using the z/t tables quickly.', up: 77 } ],
    plan: [ { t: 'Master the hypothesis-testing template', gain: 14 }, { t: 'Solve 4 past exams (2022–2025)', gain: 12 },
            { t: 'Practise confidence intervals (10 problems)', gain: 7 }, { t: 'Prepare your formula sheet', gain: 4 }, { t: 'Attend the tutoring session (Thu 18:00)', gain: 5 } ] },
  os: { name: 'Operating Systems', grade: 4.5, attempts: 1, nextExam: 'Feb 2027 exam period', prob: 56, examTopics: [
      { n: 'CPU scheduling algorithms', freq: 10, pts: 25 }, { n: 'Synchronisation & semaphores', freq: 9, pts: 25 },
      { n: 'Virtual memory & paging', freq: 9, pts: 20 }, { n: 'Deadlocks (Banker\'s algorithm)', freq: 7, pts: 15 }, { n: 'File systems', freq: 4, pts: 15 } ],
    tips: [ { who: 'Passed with 7.5 · Jun 2026', t: 'Scheduling Gantt charts are free points — practise until you can do one in 5 minutes.', up: 96 },
            { who: 'Passed with 6 · Feb 2026', t: 'The semaphore problem is the hardest. Study the producer–consumer and readers–writers patterns.', up: 88 } ],
    plan: [ { t: 'Practise scheduling Gantt charts (FCFS, SJF, RR)', gain: 10 }, { t: 'Study producer–consumer & readers–writers', gain: 11 },
            { t: 'Solve 3 past exams', gain: 9 }, { t: 'Review paging & page-replacement examples', gain: 6 } ] },
  linalg: { name: 'Linear Algebra', grade: 4, attempts: 2, nextExam: 'Feb 2027 exam period', prob: 44, examTopics: [
      { n: 'Eigenvalues & eigenvectors', freq: 10, pts: 30 }, { n: 'Gaussian elimination & rank', freq: 10, pts: 20 },
      { n: 'Determinants', freq: 8, pts: 15 }, { n: 'Vector spaces & bases', freq: 7, pts: 20 }, { n: 'Diagonalisation', freq: 6, pts: 15 } ],
    tips: [ { who: 'Passed with 6.5 · Feb 2026', t: 'Eigenvalues come up every time. If you can diagonalise a 3×3 matrix reliably, you pass.', up: 131 },
            { who: 'Passed with 5 · Sep 2025', t: 'Theory questions repeat a lot — make flashcards for the definitions.', up: 64 } ],
    plan: [ { t: 'Drill eigenvalues & diagonalisation (15 problems)', gain: 15 }, { t: 'Solve 4 past exams', gain: 11 },
            { t: 'Flashcards for theory definitions', gain: 6 }, { t: 'Join the study group (Tue 17:00)', gain: 5 } ] },
};

const S = { screen: 'intro', params: {}, plan: [], done: {}, sheet: null, toast: null, filter: 'all', quiz: null, history: {} };

// ---------- Helpers ----------
const all = () => SEMESTERS.flatMap(s => s.courses);
const passed = () => all().filter(c => c.g >= 5);
const failed = () => all().filter(c => c.g < 5);
const gpa = () => { const p = passed(); return (p.reduce((s, c) => s + c.g * c.ects, 0) / p.reduce((s, c) => s + c.ects, 0)).toFixed(2); };
const ectsDone = () => passed().reduce((s, c) => s + c.ects, 0);
const gradeCol = g => g >= 8.5 ? 'var(--green)' : g >= 6.5 ? 'var(--primary)' : g >= 5 ? 'var(--amber)' : 'var(--red)';
const probNow = id => Math.min(95, COACH[id].prob + COACH[id].plan.reduce((s, p, i) => s + (S.done[id + i] ? p.gain : 0), 0));
const probMax = id => Math.min(95, COACH[id].prob + COACH[id].plan.reduce((s, p) => s + p.gain, 0));
const probStatus = p => p >= 70 ? { cls: 'green', col: 'var(--green)', l: 'Likely to pass' } : p >= 50 ? { cls: 'amber', col: 'var(--amber)', l: 'Borderline' } : { cls: 'red', col: 'var(--red)', l: 'At risk' };
const planEcts = () => S.plan.reduce((s, id) => s + (RECS.find(r => r.id === id)?.ects || 7.5), 0);

function ring(pct, color, size = 104, stroke = 10) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  return `<svg viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#eef0f6" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}" style="transition:stroke-dashoffset .8s"/></svg>`;
}

function tabbar(active) {
  const t = (id, label, icon, badge) => `<button class="tab ${active === id ? 'on' : ''}" data-go="${id}" style="position:relative">${I[icon]}${label}${badge ? `<span class="tab-badge">${badge}</span>` : ''}</button>`;
  return `<nav class="tabbar" style="grid-template-columns:repeat(3,1fr)">${t('next', 'Choose Courses', 'spark')}${t('coach', 'Exam Coach', 'target', failed().length)}${t('revision', 'AI Revision', 'quiz', 'NEW')}</nav>`;
}

// ---------- Screens ----------
const screens = {};

screens.intro = () => `<div class="ob screen-in">
  <button class="skip" data-go="next">Skip</button>
  <div class="ob-art"><svg viewBox="0 0 260 210" width="250">
    <rect x="20" y="20" width="220" height="170" rx="24" fill="#fff" filter="drop-shadow(0 10px 20px rgba(91,91,214,.15))"/>
    <rect x="40" y="44" width="120" height="12" rx="6" fill="#e3f6ee"/><rect x="40" y="44" width="90" height="12" rx="6" fill="#17a673"/>
    <rect x="40" y="68" width="120" height="12" rx="6" fill="#ececfd"/><rect x="40" y="68" width="70" height="12" rx="6" fill="#5b5bd6"/>
    <rect x="40" y="92" width="120" height="12" rx="6" fill="#fde8e8"/><rect x="40" y="92" width="35" height="12" rx="6" fill="#e1484d"/>
    <circle cx="198" cy="74" r="28" fill="#5b5bd6"/><path d="M198 58l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" fill="#fff"/>
    <rect x="40" y="124" width="180" height="46" rx="14" fill="#f5f6fb"/><text x="54" y="146" font-size="12" font-weight="700" fill="#181a2a">Software Engineering</text>
    <text x="54" y="161" font-size="10.5" fill="#6b7085">94% match · predicted grade 8.2</text></svg></div>
  <span class="badge purple" style="align-self:flex-start;margin-bottom:10px">EXTENSION FOR UNI STUDENTS</span>
  <h2>Meet your <span style="color:var(--primary)">Smart Advisor</span></h2>
  <p>We read the grades you already have in Uni Students to <b>recommend which courses to choose</b>, show you <b>where to focus</b> to pass your exams, and give you an <b>AI revision test</b> that shows how ready you are before you go.</p>
  <div class="card row" style="margin-top:16px;padding:12px"><span style="color:var(--green);font-weight:800;font-size:18px">✓</span><div class="small"><b>Connected to Uni Students</b><br><span class="muted">16 courses · 4 semesters imported · GPA ${gpa()}</span></div></div>
  <div class="dots"><i class="on"></i></div>
  <button class="btn btn-primary btn-block" data-go="next">Get started</button>
</div>`;

screens.next = () => {
  const list = RECS.filter(r => S.filter === 'all' || (S.filter === 'core' ? r.type === 'Core' : r.type === 'Elective'));
  const e = planEcts();
  return `<div class="topbar screen-in"><div><div class="sub">Recommended for Winter 2026</div><h2>Choose Courses</h2></div>
    <button class="help" data-action="how" data-v="rec" style="width:28px;height:28px;font-size:14px">?</button></div>
  <div class="scroll screen-in">
    <div class="card" style="background:var(--primary-soft);box-shadow:none">
      <div class="row between"><b style="font-size:14px;color:var(--primary)">Your semester plan</b><b style="font-size:14px">${e} / 30 ECTS</b></div>
      <div class="bar" style="margin-top:8px;background:#fff"><i style="width:${Math.min(100, e / 30 * 100)}%;background:${e > 30 ? 'var(--red)' : 'var(--primary)'}"></i></div>
      <p class="small" style="margin-top:8px">${e === 0 ? 'Add courses to build your 30-ECTS plan.' : e >= 30 ? '<b style="color:var(--green)">Plan complete ✓</b> Ready for registration.' : `Add ${30 - e} more ECTS.`} <span class="muted">+ ${failed().length} retake exams (no attendance needed).</span></p>
    </div>
    <div class="chips" style="margin:14px 0 4px">${[['all', 'All'], ['core', 'Core'], ['el', 'Electives']].map(([k, l]) => `<button class="chip ${S.filter === k ? 'on' : ''}" data-action="filter" data-v="${k}">${l}</button>`).join('')}</div>
    <p class="small muted" style="margin:8px 2px 10px">Ranked by how well each course fits your transcript, based on ${'1,240'} students with similar grades.</p>
    ${list.map((r, i) => { const inPlan = S.plan.includes(r.id); const col = r.match >= 80 ? 'var(--green)' : r.match >= 65 ? 'var(--amber)' : 'var(--red)'; return `
      <div class="card">
        <button class="row" style="width:100%;text-align:left;align-items:flex-start" data-go="rec" data-id="${r.id}">
          <div class="ring ring-xs">${ring(r.match, col, 52, 6)}<div class="val"><strong style="font-size:13px">${r.match}%</strong></div></div>
          <div class="grow"><div class="row between"><b style="font-size:14.5px">${r.name}</b></div>
            <div class="small muted">${r.type} · ${r.ects} ECTS · ~${r.hours}h/week</div>
            <div class="small" style="margin-top:5px">Predicted grade <b style="color:${gradeCol(r.pred)}">${r.pred}</b> · ${r.because[0]}</div>
            ${r.warn ? `<div class="small" style="margin-top:5px;color:var(--red)">⚠ Missing prerequisite</div>` : ''}</div></button>
        <button class="btn btn-sm ${inPlan ? 'btn-light' : 'btn-ghost'} btn-block" style="margin-top:10px" data-action="toggle-plan" data-v="${r.id}">${inPlan ? '✓ In my plan' : '+ Add to plan'}</button>
      </div>`; }).join('')}
  </div>
  ${tabbar('next')}`;
};

screens.rec = ({ id }) => {
  const r = RECS.find(x => x.id === id), inPlan = S.plan.includes(r.id);
  const col = r.match >= 80 ? 'var(--green)' : r.match >= 65 ? 'var(--amber)' : 'var(--red)';
  const dist = [[5, 4], [6, 12], [7, 26], [8, 34], [9, 18], [10, 6]];
  return `<div class="topbar screen-in"><button class="back" data-go="next">‹ Back</button><span class="badge purple">${r.type}</span></div>
  <div class="scroll screen-in">
    <div class="course-head">
      <div class="ring">${ring(r.match, col)}<div class="val"><div><strong style="color:${col}">${r.match}%</strong><span>match</span></div></div></div>
      <div><h2 style="font-size:21px;margin-bottom:4px">${r.name}</h2><div class="small muted">${r.prof} · ${r.ects} ECTS</div></div>
    </div>
    <div class="stat-row"><div class="stat"><strong style="color:${gradeCol(r.pred)}">${r.pred}</strong><span>Your predicted grade</span></div><div class="stat"><strong>${r.passRate}%</strong><span>Similar students passed</span></div><div class="stat"><strong>${r.hours}h</strong><span>per week</span></div></div>
    ${r.warn ? `<div class="card" style="margin-top:12px;background:var(--red-soft);box-shadow:none"><b style="color:var(--red);font-size:14px">⚠ Heads up</b><p class="small" style="margin-top:4px">${r.warn}</p></div>` : ''}
    <div class="section-title"><h3>Why we recommend it</h3></div>
    <div class="card">${r.because.map(b => `<div class="factor"><span>✓ ${b}</span></div>`).join('')}
      <p class="small muted" style="margin-top:4px">Based on ${r.similar} past students whose transcripts look like yours.</p></div>
    <div class="section-title"><h3>Prerequisites</h3></div>
    <div class="card">${r.prereq.length ? r.prereq.map(([n, ok]) => `<div class="factor"><span>${n}</span><span class="badge ${ok ? 'green' : 'red'}">${ok ? 'Passed' : 'Not passed'}</span></div>`).join('') : '<p class="small muted">None</p>'}</div>
    <div class="section-title"><h3>Grades of students like you</h3></div>
    <div class="card"><div style="display:flex;align-items:flex-end;gap:8px;height:110px">${dist.map(([g, v]) => `<div style="flex:1;text-align:center"><div style="height:${v * 2.6}px;background:${Math.round(r.pred) === g ? 'var(--primary)' : '#d6d6f5'};border-radius:6px"></div><div class="small muted" style="margin-top:4px">${g}</div></div>`).join('')}</div>
      <p class="small muted" style="margin-top:8px">The highlighted bar is where we predict you'll land.</p></div>
    <button class="btn ${inPlan ? 'btn-light' : 'btn-primary'} btn-block" style="margin-top:16px" data-action="toggle-plan" data-v="${r.id}">${inPlan ? '✓ In my plan — tap to remove' : '+ Add to my semester plan'}</button>
  </div>`;
};

screens.coach = () => `
  <div class="topbar screen-in"><div><div class="sub">Next exam period: Feb 2027</div><h2>Exam Coach</h2></div>
    <button class="help" data-action="how" data-v="pred" style="width:28px;height:28px;font-size:14px">?</button></div>
  <div class="scroll screen-in">
    <p class="small muted" style="margin:0 2px 12px">For each course you didn't pass, we predict your chance of passing and show exactly where to focus.</p>
    ${failed().map(c => { const p = probNow(c.id), st = probStatus(p); return `
      <div class="card"><button class="row" style="width:100%;text-align:left" data-go="course" data-id="${c.id}">
        <div class="ring ring-xs">${ring(p, st.col, 52, 6)}<div class="val"><strong style="font-size:13px">${p}%</strong></div></div>
        <div class="grow"><b style="font-size:14.5px">${c.name}</b><div class="small muted">Last grade ${c.g} · attempt ${COACH[c.id].attempts}</div>
          <div class="row" style="gap:6px;margin-top:6px"><span class="badge ${st.cls}">${st.l}</span><span class="small muted">up to ${probMax(c.id)}% with plan</span></div></div>
        <span class="chev">›</span></button></div>`; }).join('')}
  </div>
  ${tabbar('coach')}`;

screens.course = ({ id }) => {
  const c = COACH[id], p = probNow(id), st = probStatus(p);
  return `<div class="topbar screen-in"><button class="back" data-go="${S.params.from === 'quizResult' ? 'revision' : 'coach'}">‹ Back</button><span class="badge ${st.cls}">${st.l}</span></div>
  <div class="scroll screen-in">
    <div class="course-head">
      <div class="ring">${ring(p, st.col)}<div class="val"><div><strong style="color:${st.col}">${p}%</strong><span>chance to<br>pass</span></div></div></div>
      <div><div class="small muted">Retake · ${c.nextExam}</div><h2 style="font-size:21px;margin:2px 0 4px">${c.name}</h2>
        <div class="small">Last grade <b style="color:var(--red)">${c.grade}</b> · ${c.attempts} attempt${c.attempts > 1 ? 's' : ''}</div></div>
    </div>
    <div class="card" style="margin-top:14px;background:var(--primary-soft);box-shadow:none">
      <div class="row between"><b style="font-size:14px;color:var(--primary)">Your focus plan</b><span class="small"><b>${c.prob}%</b> → <b style="color:var(--green)">${probMax(id)}%</b> if completed</span></div>
      <p class="small" style="margin-top:4px">Tick items as you finish them — your pass probability updates.</p></div>
    <div class="card" style="padding:4px 16px">${c.plan.map((x, i) => `
      <button class="topic" style="width:100%;text-align:left" data-action="check" data-v="${id + i}">
        <span class="check ${S.done[id + i] ? 'on' : ''}">${S.done[id + i] ? '✓' : ''}</span>
        <div class="grow"><div class="t-name" style="${S.done[id + i] ? 'text-decoration:line-through;color:var(--muted)' : ''}">${x.t}</div></div>
        <span class="badge green">+${x.gain}%</span></button>`).join('')}</div>

    <button class="btn btn-light btn-block" style="margin-top:12px" data-action="quiz" data-v="${id}">${I.quiz.replace('<svg', '<svg width="18" height="18"')} Test my readiness with AI</button>
    <div class="section-title"><h3>What the exam asks</h3><span class="small muted">last 10 exams</span></div>
    <div class="card">${c.examTopics.map((t, i) => `
      <div style="padding:8px 0;${i ? 'border-top:1px solid var(--line)' : ''}"><div class="row between"><span class="t-name" style="font-size:13.5px">${t.n}</span><b class="small">${t.pts}% of marks</b></div>
        <div class="row" style="gap:8px;margin-top:6px"><div style="display:flex;gap:3px;flex:1">${Array.from({ length: 10 }, (_, k) => `<i style="flex:1;height:8px;border-radius:3px;background:${k < t.freq ? (t.freq >= 9 ? 'var(--red)' : 'var(--amber)') : '#eef0f6'}"></i>`).join('')}</div>
        <span class="small muted" style="width:52px;text-align:right">${t.freq}/10</span></div></div>`).join('')}
      <p class="small muted" style="margin-top:6px">Red = appears almost every time. Start there.</p></div>

    <div class="section-title"><h3>Tips from students who passed</h3></div>
    ${c.tips.map((t, i) => `<div class="card"><p class="small" style="line-height:1.5">"${t.t}"</p>
      <div class="row between" style="margin-top:10px"><span class="small muted">🎓 ${t.who}</span><button class="badge purple" data-action="upvote" data-v="${id}-${i}">▲ ${t.up + (S.done['up' + id + i] ? 1 : 0)} helpful</button></div></div>`).join('')}

    <div class="section-title"><h3>Past exam papers</h3></div>
    <div class="card" style="padding:4px 16px">${['Jun 2026', 'Feb 2026', 'Sep 2025', 'Feb 2025'].map(d => `<button class="topic" style="width:100%;text-align:left" data-action="toast" data-v="Opening ${c.name} — ${d} (with solutions)">📄 <div class="grow"><div class="t-name">${d} exam</div><div class="t-sub">with solutions from students</div></div><span class="chev">›</span></button>`).join('')}</div>
  </div>`;
};


// ---------- AI Revision (quiz) ----------
const QUIZ = {
  stats: [
    { topic: 'Hypothesis testing', q: 'You test H₀: μ = 50 and get p = 0.03. At α = 0.05 you should…', o: ['Accept H₀', 'Reject H₀', 'Increase the sample size', 'Nothing can be concluded'], a: 1, ex: 'p < α, so the result is significant: reject H₀.' },
    { topic: 'Confidence intervals', q: 'If you increase the sample size n, a 95% confidence interval becomes…', o: ['Wider', 'Narrower', 'Unchanged', 'A 99% interval'], a: 1, ex: 'The margin of error is proportional to 1/√n, so the interval gets narrower.' },
    { topic: 'Linear regression', q: 'In ŷ = 3 + 2x, what does the 2 mean?', o: ['ŷ when x = 0', 'Change in ŷ for each 1-unit increase in x', 'The correlation coefficient', 'The error term'], a: 1, ex: 'The slope is the change in ŷ for each one-unit increase in x.' },
    { topic: 'Hypothesis testing', q: 'σ is unknown and n = 15. Which test do you use for the mean?', o: ['z-test', 't-test', 'Chi-square test', 'F-test'], a: 1, ex: 'Small sample, unknown σ → t-test with n − 1 = 14 degrees of freedom.' },
    { topic: 'Chi-square tests', q: 'A chi-square test of independence is used for…', o: ['Two means', 'Two categorical variables', 'A regression slope', 'Three or more means'], a: 1, ex: 'It tests whether two categorical variables are associated.' },
  ],
  os: [
    { topic: 'CPU scheduling', q: 'Which scheduling algorithm can cause starvation of long jobs?', o: ['FCFS', 'Round Robin', 'SJF', 'FIFO'], a: 2, ex: 'SJF keeps picking short jobs, so long ones may wait forever.' },
    { topic: 'Synchronisation', q: 'A binary semaphore initialised to 1 is mainly used for…', o: ['Counting resources', 'Mutual exclusion', 'Paging', 'Scheduling'], a: 1, ex: 'A binary semaphore = mutex lock for a critical section.' },
    { topic: 'Virtual memory', q: 'A page fault happens when…', o: ['The CPU overheats', 'The page is not in RAM', 'The TLB is full', 'A process ends'], a: 1, ex: 'The referenced page must be loaded from disk.' },
    { topic: 'Deadlocks', q: 'The Banker\'s algorithm is used for deadlock…', o: ['Detection', 'Avoidance', 'Recovery', 'Ignoring'], a: 1, ex: 'It only grants requests that keep the system in a safe state.' },
  ],
  linalg: [
    { topic: 'Eigenvalues', q: 'For A = [[2,0],[0,3]], the eigenvalues are…', o: ['0 and 5', '2 and 3', '6 and 1', '1 and 1'], a: 1, ex: 'For a diagonal matrix the eigenvalues are the diagonal entries.' },
    { topic: 'Determinants', q: 'If det(A) = 0 then A is…', o: ['Invertible', 'Not invertible', 'Orthogonal', 'Symmetric'], a: 1, ex: 'A zero determinant means the matrix is singular.' },
    { topic: 'Rank', q: 'A 3×3 matrix with rank 2 has a null space of dimension…', o: ['0', '1', '2', '3'], a: 1, ex: 'Rank–nullity: 3 − 2 = 1.' },
    { topic: 'Diagonalisation', q: 'A 3×3 matrix with 3 distinct eigenvalues is…', o: ['Always diagonalisable', 'Never diagonalisable', 'Always symmetric', 'Singular'], a: 0, ex: 'Distinct eigenvalues give independent eigenvectors, so the matrix is diagonalisable.' },
  ],
};

function startQuiz(c) { S.quiz = { c, i: 0, sel: null, checked: false, answers: [] }; go('quiz'); }
function finishQuiz() {
  const q = S.quiz, qs = QUIZ[q.c], correct = q.answers.filter(Boolean).length;
  const ready = Math.round(20 + (correct / qs.length) * 70 + Math.min(10, (probNow(q.c) - 30) / 5));
  const topics = {};
  qs.forEach((x, i) => { topics[x.topic] = topics[x.topic] || { ok: 0, n: 0 }; topics[x.topic].n++; if (q.answers[i]) topics[x.topic].ok++; });
  const prev = S.history[q.c]?.ready;
  S.history[q.c] = { ready, correct, total: qs.length, topics, prev };
  go('quizResult');
}
const readyStatus = r => r >= 75 ? { cls: 'green', col: 'var(--green)', l: 'Ready for the exam' } : r >= 55 ? { cls: 'amber', col: 'var(--amber)', l: 'Almost ready' } : { cls: 'red', col: 'var(--red)', l: 'Not ready yet' };

screens.revision = () => `
  <div class="topbar screen-in"><div><div class="sub">Test yourself before the exam</div><h2>AI Revision</h2></div>
    <button class="help" data-action="how" data-v="quiz" style="width:28px;height:28px;font-size:14px">?</button></div>
  <div class="scroll screen-in">
    <div class="hero"><div class="eyebrow">${I.spark.replace('<svg', '<svg width="12" height="12"')} How it works</div>
      <h3>A 5-minute mock exam, made by AI</h3>
      <div class="meta">Questions are generated from the topics that appear most in your professor's past exams. You'll get a readiness score and a predicted grade.</div></div>
    <div class="section-title"><h3>Choose an exam</h3><span class="small muted">Feb 2027 period</span></div>
    ${failed().map(c => { const h = S.history[c.id]; const st = h && readyStatus(h.ready); return `
      <div class="card"><div class="row">
        <div class="c-icon" style="background:var(--primary)">${c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
        <div class="grow"><b style="font-size:14.5px">${c.name}</b>
          <div class="small muted">${QUIZ[c.id].length} questions · ~${QUIZ[c.id].length + 1} min</div>
          ${h ? `<div style="margin-top:5px"><span class="badge ${st.cls}">${h.ready}% · ${st.l}</span></div>` : '<div class="small" style="margin-top:5px;color:var(--primary)">Not tested yet</div>'}</div>
        <button class="btn btn-primary btn-sm" data-action="quiz" data-v="${c.id}">${h ? 'Retry' : 'Start'}</button></div></div>`; }).join('')}
  </div>
  ${tabbar('revision')}`;

screens.quiz = () => {
  const q = S.quiz, qs = QUIZ[q.c], x = qs[q.i];
  return `<div class="topbar screen-in"><button class="back" data-action="quit-quiz">✕ Quit</button><span class="small muted">${COACH[q.c].name}</span><b class="small">${q.i + 1}/${qs.length}</b></div>
  <div style="padding:0 18px"><div class="bar"><i style="width:${((q.i + (q.checked ? 1 : 0)) / qs.length) * 100}%;background:var(--primary)"></i></div></div>
  <div class="scroll screen-in" style="padding-top:18px">
    <span class="badge purple">${x.topic}</span>
    <h2 style="font-size:19px;line-height:1.35;margin:12px 0 18px">${x.q}</h2>
    ${x.o.map((o, i) => { let st = ''; if (q.checked) { if (i === x.a) st = 'correct'; else if (i === q.sel) st = 'wrong'; } else if (i === q.sel) st = 'sel'; return `
      <button class="opt ${st}" data-action="answer" data-v="${i}"><span class="opt-l">${'ABCD'[i]}</span>${o}</button>`; }).join('')}
    ${q.checked ? `<div class="card" style="margin-top:14px;background:${q.sel === x.a ? 'var(--green-soft)' : 'var(--red-soft)'};box-shadow:none">
      <b style="color:${q.sel === x.a ? 'var(--green)' : 'var(--red)'}">${q.sel === x.a ? '✓ Correct' : '✗ Not quite'}</b><p class="small" style="margin-top:4px">${x.ex}</p></div>` : ''}
    <button class="btn btn-primary btn-block" style="margin-top:18px" data-action="${q.checked ? 'next-q' : 'check-answer'}" ${q.sel == null ? 'disabled' : ''}>${q.checked ? (q.i + 1 === qs.length ? 'See my readiness' : 'Next question') : 'Check answer'}</button>
  </div>`;
};

screens.quizResult = () => {
  const c = S.quiz.c, h = S.history[c], st = readyStatus(h.ready), grade = Math.max(2, Math.min(9.5, h.ready / 10)).toFixed(1);
  const weak = Object.entries(h.topics).filter(([, t]) => t.ok < t.n).map(([n]) => n);
  return `<div class="topbar screen-in"><span></span><span class="small muted">Readiness report</span><span></span></div>
  <div class="scroll screen-in">
    <div style="display:flex;justify-content:center;margin-top:6px"><div class="ring" style="width:150px;height:150px">${ring(h.ready, st.col, 150, 12).replace('<svg', '<svg style="width:150px;height:150px"')}<div class="val"><div><strong style="color:${st.col};font-size:34px">${h.ready}%</strong><span>ready</span></div></div></div></div>
    <h2 style="text-align:center;font-size:21px;margin-top:10px">${st.l}</h2>
    <p class="muted" style="text-align:center;margin:4px 0 16px">${COACH[c].name} · ${h.correct}/${h.total} correct${h.prev != null ? ` · was ${h.prev}% last time` : ''}</p>
    <div class="stat-row" style="margin-top:0"><div class="stat card-stat"><strong style="color:${gradeCol(+grade)}">${grade}</strong><span>Predicted grade today</span></div>
      <div class="stat card-stat"><strong>${Math.min(97, Math.round(h.ready * 0.9 + 10))}%</strong><span>Chance to pass</span></div>
      <div class="stat card-stat"><strong>${weak.length}</strong><span>Topics to review</span></div></div>
    <div class="section-title"><h3>By topic</h3></div>
    <div class="card" style="padding:4px 16px">${Object.entries(h.topics).map(([n, t]) => `<div class="topic"><div class="grow"><div class="t-name">${n}</div>
      <div class="bar" style="margin-top:7px"><i style="width:${t.ok / t.n * 100}%;background:${t.ok === t.n ? 'var(--green)' : 'var(--red)'}"></i></div></div><div class="pct">${t.ok}/${t.n}</div></div>`).join('')}</div>
    ${weak.length ? `<div class="card" style="background:var(--primary-soft);box-shadow:none;margin-top:12px"><b style="color:var(--primary);font-size:14px">${I.spark.replace('<svg', '<svg width="12" height="12"')} AI suggestion</b>
      <p class="small" style="margin-top:4px">Review <b>${weak.join(', ')}</b> before the exam. Students who fixed these topics raised their grade by ~1.5 points on average.</p></div>` :
      '<div class="card" style="background:var(--green-soft);box-shadow:none;margin-top:12px"><b style="color:var(--green)">🎉 You\'re in great shape</b><p class="small" style="margin-top:4px">Do one full past paper under time pressure to confirm.</p></div>'}
    <button class="btn btn-primary btn-block" style="margin-top:16px" data-go="course" data-id="${c}">Open my focus plan</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" data-action="quiz" data-v="${c}">Retake test</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" data-go="revision">Back to AI Revision</button>
  </div>`;
};

// ---------- Sheets ----------
const sheets = {
  how: v => {
    const parts = {
      rec: ['✦ Course recommender', 'We compare your transcript with ~1,240 past students. Courses are ranked by (1) how students with similar grades in related courses performed, (2) whether you passed the prerequisites, (3) your interests and (4) workload balance. For each course we also predict your grade.'],
      quiz: ['🧠 AI revision test', 'The AI generates questions in the style of your professor, from the topics that appear most often in past exams. Your answers, how long you take and your past grades go into a model that predicts your readiness and your likely grade if you sat the exam today.'],
      pred: ['🎯 Pass-probability model', 'A predictive model estimates your chance of passing a retake from your previous grade, number of attempts, your grades in related courses and what past students did before they passed. We also analyse past exam papers to find the topics that appear most often and carry the most marks.'],
    };
    const list = v === 'all' ? Object.values(parts) : [parts[v]];
    return list.map(([t, d]) => `<h3>${t}</h3><p class="small" style="line-height:1.55;margin:6px 0 16px;color:#3c3f52">${d}</p>`).join('') +
      '<p class="small muted">In this mockup, all data and predictions are simulated.</p><button class="btn btn-primary btn-block" style="margin-top:14px" data-action="close">Got it</button>';
  },
};

// ---------- Render ----------
const app = document.getElementById('app');
function render() {
  let html = screens[S.screen](S.params);
  if (S.sheet) html += `<div class="overlay" data-action="overlay"><div class="sheet"><div class="grab"></div>${sheets[S.sheet.type](S.sheet.data)}</div></div>`;
  if (S.toast) html += `<div class="toast">${S.toast}</div>`;
  const prev = app.querySelector('.scroll')?.scrollTop;
  app.innerHTML = html;
  if (S.keep && prev) { const sc = app.querySelector('.scroll'); if (sc) sc.scrollTop = prev; }
  S.keep = false;
}
const rerender = () => { S.keep = true; render(); };
function go(screen, params = {}) { S.screen = screen; S.params = params; S.sheet = null; render(); }
let tt;
function toast(m) { S.toast = m; rerender(); clearTimeout(tt); tt = setTimeout(() => { S.toast = null; rerender(); }, 2400); }

const actions = {
  reset: () => { Object.assign(S, { screen: 'intro', plan: [], done: {}, sheet: null, filter: 'all', quiz: null, history: {} }); render(); },
  quiz: el => startQuiz(el.dataset.v),
  answer: el => { if (S.quiz.checked) return; S.quiz.sel = +el.dataset.v; rerender(); },
  'check-answer': () => { const q = S.quiz; if (q.sel == null) return; q.checked = true; q.answers.push(q.sel === QUIZ[q.c][q.i].a); rerender(); },
  'next-q': () => { const q = S.quiz; if (q.i + 1 >= QUIZ[q.c].length) { finishQuiz(); return; } q.i++; q.sel = null; q.checked = false; render(); },
  'quit-quiz': () => go('revision'),
  'toggle-sem': el => { S.open[el.dataset.v] = !S.open[el.dataset.v]; rerender(); },
  'toggle-plan': el => {
    const id = el.dataset.v, r = RECS.find(x => x.id === id);
    if (S.plan.includes(id)) { S.plan = S.plan.filter(x => x !== id); rerender(); return; }
    if (planEcts() + r.ects > 36) { toast('⚠ That would go over the 36 ECTS limit. Remove a course first.'); return; }
    S.plan.push(id); toast(r.warn ? `Added — but check the prerequisite warning` : `✓ ${r.name} added to your plan`);
  },
  filter: el => { S.filter = el.dataset.v; rerender(); },
  check: el => { const k = el.dataset.v; S.done[k] = !S.done[k]; if (S.done[k]) toast('Pass probability updated ↑'); else rerender(); },
  upvote: el => { const [id, i] = el.dataset.v.split('-'); S.done['up' + id + i] = !S.done['up' + id + i]; rerender(); },
  how: el => { S.sheet = { type: 'how', data: el.dataset.v }; rerender(); },
  toast: el => toast(el.dataset.v),
  chip: el => el.classList.toggle('on'),
  close: () => { S.sheet = null; rerender(); },
  overlay: (el, e) => { if (e.target === el) actions.close(); },
};

document.addEventListener('click', e => {
  const goEl = e.target.closest('[data-go]'), actEl = e.target.closest('[data-action]');
  if (goEl && (!actEl || actEl.contains(goEl))) {
    go(goEl.dataset.go, goEl.dataset.id ? { id: goEl.dataset.id, from: S.screen } : {}); return;
  }
  if (actEl) { const fn = actions[actEl.dataset.action]; if (fn) fn(actEl, e); }
});

render();
