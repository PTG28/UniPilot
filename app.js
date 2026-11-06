/* =========================================================================
   StudySync — interactive mockup
   All data is simulated. The "models" below are simple, deterministic
   stand-ins for the real predictive model and recommender we'll build later.
   ========================================================================= */

// ---------- Icons ----------
const I = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6.5A2.5 2.5 0 0 0 4 20.5 2.5 2.5 0 0 0 6.5 23H20"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  spark: '✦',
};

// ---------- Seed data ----------
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TODAY = new Date(2026, 10, 6); // Fri 6 Nov (demo "today")

function seedCourses() {
  return [
    { id: 'econ', name: 'Microeconomics', code: 'ECON-201', color: '#e1484d', daysLeft: 9, rate: 2.55, weight: 'Midterm · 40%',
      topics: [ { n: 'Elasticity', m: 55, w: 20 }, { n: 'Consumer Choice', m: 40, w: 30 }, { n: 'Production & Costs', m: 25, w: 30 }, { n: 'Market Structures', m: 20, w: 20 } ], hours: 6.5, sessions: 7 },
    { id: 'algo', name: 'Algorithms', code: 'INF-210', color: '#d98e04', daysLeft: 11, rate: 2.1, weight: 'Midterm · 30%',
      topics: [ { n: 'Sorting & Recurrences', m: 70, w: 20 }, { n: 'Graph Search (BFS/DFS)', m: 55, w: 25 }, { n: 'Dynamic Programming', m: 40, w: 35 }, { n: 'Greedy Algorithms', m: 27, w: 20 } ], hours: 9, sessions: 10 },
    { id: 'db', name: 'Databases', code: 'INF-302', color: '#5b5bd6', daysLeft: 18, rate: 1.22, weight: 'Final · 60%',
      topics: [ { n: 'ER Modeling', m: 85, w: 20 }, { n: 'SQL Joins', m: 72, w: 30 }, { n: 'Normalization', m: 48, w: 25 }, { n: 'Transactions', m: 43, w: 25 } ], hours: 12, sessions: 14 },
    { id: 'stats', name: 'Statistics II', code: 'STA-220', color: '#17a673', daysLeft: 25, rate: 0.68, weight: 'Final · 70%',
      topics: [ { n: 'Hypothesis Testing', m: 90, w: 25 }, { n: 'Confidence Intervals', m: 82, w: 25 }, { n: 'Linear Regression', m: 70, w: 30 }, { n: 'ANOVA', m: 58, w: 20 } ], hours: 15, sessions: 17 },
  ];
}

// Predicted focus (0-100) for each hour 8:00 → 23:00, learned from past focus ratings.
const FOCUS = [42, 55, 64, 60, 50, 38, 34, 46, 58, 70, 84, 90, 81, 66, 48, 32];
const FOCUS_START = 8;
const NOW_HOUR = 16;

const S = {
  screen: 'onboarding', params: {}, ob: 0, studyTimes: ['Evening'],
  courses: seedCourses(), sheet: null, toast: null, recSkip: 0,
  planDay: 0, prefs: { perDay: 2, len: 45 }, session: null, notifRead: false,
  lastResult: null, totalSessions: 48,
};

// ---------- "Models" (simulated) ----------
const readiness = c => Math.round(c.topics.reduce((s, t) => s + t.m * t.w, 0) / c.topics.reduce((s, t) => s + t.w, 0));
const predicted = c => Math.min(97, Math.round(readiness(c) + c.rate * c.daysLeft));
const band = c => Math.round(3 + c.daysLeft * 0.35);
const status = p => p >= 80 ? { label: 'On track', cls: 'green', col: 'var(--green)' }
  : p >= 65 ? { label: 'At risk', cls: 'amber', col: 'var(--amber)' }
  : { label: 'Behind', cls: 'red', col: 'var(--red)' };
const weakest = c => [...c.topics].sort((a, b) => a.m - b.m)[0];
const examDate = c => { const d = new Date(TODAY); d.setDate(d.getDate() + c.daysLeft); return d; };
const fmtDate = d => `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]}`;
const course = id => S.courses.find(c => c.id === id);

// Recommender: score = readiness gap at exam + urgency + topic weakness.
function recScore(c) {
  const gap = Math.max(0, 85 - predicted(c));
  const urgency = 100 / Math.max(c.daysLeft, 1);
  const weak = 100 - weakest(c).m;
  return Math.round(gap * 1.6 + urgency * 1.2 + weak * 0.25);
}
function recommendations() {
  return S.courses.map(c => {
    const t = weakest(c);
    const score = recScore(c);
    const gain = Math.max(2, Math.round((100 - t.m) * 0.09 + (c.daysLeft < 12 ? 2 : 0)));
    return { c, t, score, gain };
  }).sort((a, b) => b.score - a.score);
}
function bestSlot() {
  let best = NOW_HOUR, val = 0;
  FOCUS.forEach((v, i) => { const h = i + FOCUS_START; if (h >= NOW_HOUR && v > val) { val = v; best = h; } });
  return { hour: best, val };
}
function focusAt(h) { return FOCUS[h - FOCUS_START] ?? 30; }

function buildPlan() {
  const scores = Object.fromEntries(S.courses.map(c => [c.id, recScore(c)]));
  const slots = ['18:00', '10:30', '20:00'];
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(TODAY); d.setDate(d.getDate() + i);
    const blocks = [];
    const exams = S.courses.filter(c => c.daysLeft === i);
    for (let b = 0; b < S.prefs.perDay; b++) {
      const avail = S.courses.filter(c => c.daysLeft > i);
      if (!avail.length) break;
      const pick = avail.sort((a, b2) => scores[b2.id] - scores[a.id])[0];
      const topic = [...pick.topics].sort((a, b2) => a.m - b2.m)[(i + b) % 2];
      blocks.push({ c: pick, topic, time: slots[b], len: S.prefs.len, focus: focusAt(parseInt(slots[b])) });
      scores[pick.id] *= 0.55;
    }
    S.courses.forEach(c => { scores[c.id] = Math.min(recScore(c), scores[c.id] * 1.5); });
    days.push({ d, blocks: blocks.sort((a, b2) => a.time.localeCompare(b2.time)), exams });
  }
  return days;
}

// ---------- Small render helpers ----------
const h = (strings, ...vals) => strings.reduce((s, str, i) => s + str + (vals[i] ?? ''), '');

function ring(pct, color, size = 104, stroke = 10) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  return `<svg viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#eef0f6" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}" style="transition:stroke-dashoffset .8s"/></svg>`;
}

function readinessChart(c) {
  const W = 320, H = 170, padL = 26, padR = 10, top = 10, bot = 140;
  const past = 14, D = c.daysLeft, total = past + D;
  const x = d => padL + (d / total) * (W - padL - padR);
  const y = v => bot - (v / 100) * (bot - top);
  const r = readiness(c), p = predicted(c), start = Math.max(5, r - c.rate * 0.8 * past);
  const hist = Array.from({ length: past + 1 }, (_, i) => start + (r - start) * (i / past) + (i < past ? Math.sin(i * 1.7) * 2 : 0));
  const fc = Array.from({ length: D + 1 }, (_, i) => ({ v: r + (p - r) * (i / D), b: 2 + band(c) * (i / D) }));
  const histPath = hist.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const fcPath = fc.map((f, i) => `${i ? 'L' : 'M'}${x(past + i).toFixed(1)},${y(f.v).toFixed(1)}`).join('');
  const bandPath = fc.map((f, i) => `${i ? 'L' : 'M'}${x(past + i).toFixed(1)},${y(Math.min(100, f.v + f.b)).toFixed(1)}`).join('') +
    fc.slice().reverse().map((f, i) => `L${x(past + D - i).toFixed(1)},${y(Math.max(0, f.v - f.b)).toFixed(1)}`).join('') + 'Z';
  const st = status(p);
  return `<svg viewBox="0 0 ${W} ${H}">
    ${[0, 50, 100].map(v => `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}" stroke="#eef0f6"/><text x="0" y="${y(v) + 4}" font-size="9.5" fill="#9aa0b5">${v}%</text>`).join('')}
    <line x1="${padL}" x2="${W - padR}" y1="${y(80)}" y2="${y(80)}" stroke="var(--green)" stroke-dasharray="3 4" opacity=".7"/>
    <text x="${padL + 3}" y="${y(80) - 4}" font-size="9" fill="var(--green)" font-weight="700">READY 80%</text>
    <path d="${bandPath}" fill="${st.col}" opacity=".13"/>
    <path d="${histPath}" fill="none" stroke="${c.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${fcPath}" fill="none" stroke="${st.col}" stroke-width="2.4" stroke-dasharray="5 5" stroke-linecap="round"/>
    <line x1="${x(past)}" x2="${x(past)}" y1="${top}" y2="${bot}" stroke="#c9ccdb" stroke-dasharray="2 3"/>
    <circle cx="${x(past)}" cy="${y(r)}" r="5" fill="#fff" stroke="${c.color}" stroke-width="2.6"/>
    <circle cx="${x(total)}" cy="${y(p)}" r="5" fill="${st.col}"/>
    <text x="${x(past)}" y="${H - 14}" font-size="10" fill="#6b7085" text-anchor="middle" font-weight="600">Today</text>
    <text x="${x(0)}" y="${H - 14}" font-size="10" fill="#9aa0b5">2 wks ago</text>
    <text x="${x(total)}" y="${H - 14}" font-size="10" fill="${st.col}" text-anchor="end" font-weight="700">Exam ${p}%</text>
    <text x="${x(total)}" y="${H - 2}" font-size="9" fill="#9aa0b5" text-anchor="end">±${band(c)}%</text>
  </svg>`;
}

function focusChart() {
  const W = 320, H = 120, bw = W / FOCUS.length;
  const peak = Math.max(...FOCUS);
  return `<svg viewBox="0 0 ${W} ${H}">
    ${FOCUS.map((v, i) => {
      const hr = i + FOCUS_START, bh = (v / 100) * 86, past = hr < NOW_HOUR;
      const col = v >= 80 ? 'var(--primary)' : v >= 55 ? '#a9a9f0' : '#dcdcef';
      return `<rect x="${i * bw + 2.5}" y="${92 - bh}" width="${bw - 5}" height="${bh}" rx="4" fill="${col}" opacity="${past ? .35 : 1}"/>
        ${v === peak ? `<text x="${i * bw + bw / 2}" y="${86 - bh}" font-size="10" text-anchor="middle" fill="var(--primary)" font-weight="800">★</text>` : ''}
        ${hr % 3 === 2 ? `<text x="${i * bw + bw / 2}" y="${108}" font-size="9.5" text-anchor="middle" fill="#9aa0b5">${hr}:00</text>` : ''}`;
    }).join('')}
    <line x1="${(NOW_HOUR - FOCUS_START) * bw}" x2="${(NOW_HOUR - FOCUS_START) * bw}" y1="0" y2="95" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="2 2"/>
    <text x="${(NOW_HOUR - FOCUS_START) * bw + 3}" y="9" font-size="9.5" fill="var(--ink)" font-weight="700">now</text>
  </svg>`;
}

function tabbar(active) {
  const t = (id, label, icon) => `<button class="tab ${active === id ? 'on' : ''}" data-go="${id}">${I[icon]}${label}</button>`;
  return `<nav class="tabbar">${t('home', 'Today', 'home')}${t('courses', 'Courses', 'book')}
    <button class="tab-fab" data-action="quickstart" aria-label="Start recommended session">${I.play}</button>
    ${t('plan', 'Plan', 'cal')}${t('insights', 'Insights', 'chart')}</nav>`;
}

// ---------- Screens ----------
const screens = {};

screens.onboarding = () => {
  const steps = [
    { art: obArt1(), title: 'Know if you\'ll be ready — <span style="color:var(--primary)">before</span> the exam', text: 'StudySync learns from every study session you log and predicts how prepared you\'ll be on exam day.' },
    { art: obArt2(), title: 'Study the right thing at the right time', text: 'Our recommender picks your next best topic, and we predict the hours of the day when you focus best.' },
  ];
  if (S.ob < 2) {
    const s = steps[S.ob];
    return `<div class="ob screen-in">
      <button class="skip" data-action="ob-skip">Skip</button>
      <div class="ob-art">${s.art}</div>
      <h2>${s.title}</h2><p>${s.text}</p>
      <div class="dots">${[0, 1, 2].map(i => `<i class="${i === S.ob ? 'on' : ''}"></i>`).join('')}</div>
      <button class="btn btn-primary btn-block" data-action="ob-next">Continue</button>
    </div>`;
  }
  return `<div class="ob screen-in" style="overflow-y:auto">
    <h2 style="margin-top:6px">Let's set you up</h2>
    <p style="margin-bottom:18px">We found these courses in your AUEB e-class. Confirm your exam dates so we can start predicting.</p>
    ${S.courses.map(c => `<div class="ob-course"><div class="c-icon" style="background:${c.color};width:36px;height:36px;font-size:12px;border-radius:10px">${c.name.slice(0, 2).toUpperCase()}</div>
      <div class="grow"><div style="font-weight:600;font-size:14px">${c.name}</div><div class="small muted">${c.weight} · ${fmtDate(examDate(c))}</div></div><span style="color:var(--green);font-weight:800">✓</span></div>`).join('')}
    <div style="font-weight:700;font-size:14px;margin:18px 0 10px">When do you usually study?</div>
    <div class="chips">${['Morning', 'Afternoon', 'Evening', 'Late night'].map(t => `<button class="chip ${S.studyTimes.includes(t) ? 'on' : ''}" data-action="ob-time" data-v="${t}">${t}</button>`).join('')}</div>
    <p class="small" style="margin-top:10px">This is just a starting point — after ~5 sessions we predict your focus hours from your own ratings.</p>
    <div class="dots">${[0, 1, 2].map(i => `<i class="${i === 2 ? 'on' : ''}"></i>`).join('')}</div>
    <button class="btn btn-primary btn-block" data-action="ob-done">Start studying smarter</button>
  </div>`;
};

function obArt1() {
  return `<svg viewBox="0 0 260 200" width="260"><rect x="20" y="20" width="220" height="160" rx="22" fill="#fff" filter="drop-shadow(0 10px 20px rgba(91,91,214,.15))"/>
    <path d="M45 140 L80 125 L110 128 L140 100" fill="none" stroke="#5b5bd6" stroke-width="4" stroke-linecap="round"/>
    <path d="M140 100 L215 55" fill="none" stroke="#17a673" stroke-width="4" stroke-dasharray="7 7" stroke-linecap="round"/>
    <path d="M140 100 L215 40 L215 72 Z" fill="#17a673" opacity=".12"/>
    <line x1="40" x2="225" y1="62" y2="62" stroke="#17a673" stroke-dasharray="3 4" opacity=".6"/>
    <circle cx="140" cy="100" r="7" fill="#fff" stroke="#5b5bd6" stroke-width="4"/><circle cx="215" cy="55" r="8" fill="#17a673"/>
    <rect x="160" y="128" width="62" height="28" rx="14" fill="#e3f6ee"/><text x="191" y="147" text-anchor="middle" font-size="13" font-weight="800" fill="#17a673">86%</text></svg>`;
}
function obArt2() {
  return `<svg viewBox="0 0 260 200" width="260"><rect x="30" y="30" width="200" height="140" rx="22" fill="#fff" filter="drop-shadow(0 10px 20px rgba(91,91,214,.15))"/>
    ${[40, 55, 70, 62, 85, 92, 78, 50].map((v, i) => `<rect x="${52 + i * 21}" y="${150 - v}" width="14" height="${v}" rx="4" fill="${v > 80 ? '#5b5bd6' : '#d6d6f5'}"/>`).join('')}
    <circle cx="200" cy="40" r="26" fill="#5b5bd6"/><text x="200" y="47" text-anchor="middle" font-size="22" fill="#fff">✦</text></svg>`;
}

screens.home = () => {
  const recs = recommendations();
  const rec = recs[S.recSkip % recs.length];
  const slot = bestSlot();
  const st = status(predicted(rec.c));
  return `<div class="topbar screen-in"><div><div class="sub">${fmtDate(TODAY)}</div><h2>Hi Petros 👋</h2></div>
      <button class="icon-btn" data-action="notifs" aria-label="Notifications">${I.bell}${S.notifRead ? '' : '<span class="dot"></span>'}</button></div>
    <div class="scroll screen-in">
      <div class="hero">
        <div class="eyebrow">${I.spark} Recommended next session <button class="help" data-action="how" data-v="rec" aria-label="How recommendations work">?</button></div>
        <h3>${rec.c.name}: ${rec.t.n}</h3>
        <div class="meta">${S.prefs.len} min · best at <b>${slot.hour}:00</b> (predicted focus ${slot.val}%)</div>
        <div class="why"><b>Why this?</b> Exam in ${rec.c.daysLeft} days and you're predicted to reach only <b>${predicted(rec.c)}%</b>. ${rec.t.n} is your weakest topic (${rec.t.m}% mastery). This session should add <b>+${rec.gain}%</b> to your exam-day readiness.</div>
        <div class="actions">
          <button class="btn btn-white" data-action="start" data-c="${rec.c.id}" data-t="${rec.t.n}">${I.play.replace('<svg', '<svg width="14" height="14"')} Start now</button>
          <button class="btn btn-outline" data-action="schedule" data-c="${rec.c.id}" data-t="${rec.t.n}" data-h="${slot.hour}">⏰ ${slot.hour}:00</button>
          <button class="btn btn-outline" data-action="alts" aria-label="Show other suggestions" style="padding:0 12px">⋯</button>
        </div>
      </div>

      <div class="section-title"><h3>Exam readiness forecast <button class="help" data-action="how" data-v="pred">?</button></h3><button class="link" data-go="courses">See all</button></div>
      <div class="readiness-grid">
        ${S.courses.map(c => { const p = predicted(c), s = status(p), r = readiness(c); return `
          <button class="rcard" data-go="course" data-id="${c.id}">
            <div class="row between" style="width:100%"><span class="name">${c.name}</span></div>
            <span class="badge ${s.cls}">${s.label}</span>
            <div class="bar" style="width:100%"><i style="width:${r}%;background:${c.color}"></i><i style="left:${r}%;width:${p - r}%;background:${c.color};opacity:.25"></i><b style="left:80%"></b></div>
            <div class="predline" style="width:100%"><span class="muted">Now ${r}%</span><span>→ <strong style="color:${s.col}">${p}%</strong></span></div>
            <span class="days">Exam in ${c.daysLeft} days</span>
          </button>`; }).join('')}
      </div>

      <div class="section-title"><h3>Your focus forecast today <button class="help" data-action="how" data-v="focus">?</button></h3></div>
      <div class="card focus-chart">
        ${focusChart()}
        <div class="legend"><span><i style="background:var(--primary)"></i>Peak focus</span><span><i style="background:#a9a9f0"></i>Good</span><span><i style="background:#dcdcef"></i>Low</span></div>
        <p class="small muted" style="margin-top:8px">Based on 48 past sessions, you focus best between <b style="color:var(--ink)">18:00–20:00</b>. Hard topics are scheduled there.</p>
      </div>
    </div>
    ${tabbar('home')}`;
};

screens.courses = () => `
  <div class="topbar screen-in"><h2>Courses</h2><button class="icon-btn" data-action="add-course" aria-label="Add course">${I.plus}</button></div>
  <div class="scroll screen-in">
    <p class="small muted" style="margin:0 2px 12px">Sorted by recommended priority — the courses that need you most are at the top.</p>
    ${recommendations().map(({ c, score }) => { const p = predicted(c), s = status(p); return `
      <div class="card"><button class="course-item" data-go="course" data-id="${c.id}">
        <div class="c-icon" style="background:${c.color}">${c.name.slice(0, 2).toUpperCase()}</div>
        <div class="grow"><div style="font-weight:700">${c.name}</div><div class="small muted">${c.code} · ${c.weight} · ${c.daysLeft} days</div>
          <div class="row" style="margin-top:7px;gap:8px"><span class="badge ${s.cls}">${s.label}</span><span class="small muted">Predicted <b style="color:${s.col}">${p}%</b></span></div></div>
        <span class="chev">›</span></button></div>`; }).join('')}
    <button class="btn btn-light btn-block" style="margin-top:14px" data-action="add-course">${I.plus.replace('<svg', '<svg width="18" height="18"')} Add a course</button>
  </div>
  ${tabbar('courses')}`;

screens.course = ({ id }) => {
  const c = course(id), r = readiness(c), p = predicted(c), s = status(p);
  const needed = Math.max(0, Math.ceil((80 - p) / 2.5));
  return `<div class="topbar screen-in"><button class="back" data-go="${S.params.from || 'home'}">‹ Back</button><span class="badge ${s.cls}">${s.label}</span></div>
  <div class="scroll screen-in">
    <div class="course-head">
      <div class="ring">${ring(p, s.col)}<div class="val"><div><strong style="color:${s.col}">${p}%</strong><span>predicted<br>on exam day</span></div></div></div>
      <div><div class="small muted">${c.code} · ${c.weight}</div><h2 style="font-size:22px;margin:2px 0 4px">${c.name}</h2>
        <div class="small">Exam <b>${fmtDate(examDate(c))}</b> · ${c.daysLeft} days left</div></div>
    </div>
    <div class="stat-row"><div class="stat"><strong>${r}%</strong><span>Ready now</span></div><div class="stat"><strong>±${band(c)}%</strong><span>Confidence</span></div><div class="stat"><strong>${c.hours}h</strong><span>Studied</span></div></div>

    <div class="card" style="margin-top:14px">
      <div class="row between"><b style="font-size:14px">Readiness trajectory</b><button class="help" data-action="how" data-v="pred">?</button></div>
      <div style="margin-top:8px">${readinessChart(c)}</div>
      <p class="small muted" style="margin-top:6px">${p >= 80 ? `At your current pace you'll be ready. Keep ~${Math.max(2, Math.round(c.sessions / 2))} sessions/week.` : `To reach 80% you need about <b style="color:var(--ink)">${needed} more sessions</b> than your current pace. We've added them to your plan.`}</p>
    </div>

    <div class="section-title"><h3>Topics</h3><span class="small muted">mastery · exam weight</span></div>
    <div class="card" style="padding:4px 16px">
      ${[...c.topics].sort((a, b) => a.m - b.m).map((t, i) => `
        <div class="topic"><div class="grow"><div class="t-name">${t.n} ${i === 0 ? '<span class="badge purple">Recommended</span>' : ''}</div>
          <div class="bar" style="margin-top:7px"><i style="width:${t.m}%;background:${t.m >= 75 ? 'var(--green)' : t.m >= 50 ? 'var(--amber)' : 'var(--red)'}"></i></div>
          <div class="t-sub" style="margin-top:4px">${t.w}% of exam</div></div>
          <div class="pct">${t.m}%</div>
          <button class="btn btn-light btn-sm" data-action="start" data-c="${c.id}" data-t="${t.n}" aria-label="Study ${t.n}">${I.play.replace('<svg', '<svg width="12" height="12"')}</button></div>`).join('')}
    </div>

    <div class="section-title"><h3>What drives this prediction</h3></div>
    <div class="card">
      ${[['Topic mastery (quiz + self-rating)', 82, 'var(--primary)'], ['Study consistency (last 14 days)', Math.min(95, 40 + c.sessions * 3), 'var(--primary)'], ['Avg. focus during sessions', 64, 'var(--primary)'], ['Time remaining vs. material left', Math.max(15, 100 - c.daysLeft * 2), 'var(--amber)']]
        .map(([n, v, col]) => `<div class="factor"><span>${n}</span><span class="f-bar"><i style="width:${v}%;background:${col}"></i></span></div>`).join('')}
      <p class="small muted" style="margin-top:6px">Factors ranked by their influence on your forecast.</p>
    </div>
    <button class="btn btn-primary btn-block" style="margin-top:16px" data-action="start" data-c="${c.id}" data-t="${weakest(c).n}">Study ${weakest(c).n} now</button>
  </div>`;
};

screens.plan = () => {
  const plan = buildPlan(), day = plan[S.planDay];
  return `<div class="topbar screen-in"><div><div class="sub">Auto-generated · updates after each session</div><h2>This week</h2></div>
      <button class="icon-btn" data-action="plan-prefs" aria-label="Plan settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg></button></div>
    <div class="days-strip screen-in">
      ${plan.map((d, i) => `<button class="day-pill ${i === S.planDay ? 'on' : ''} ${d.exams.length ? 'exam' : ''}" data-action="plan-day" data-v="${i}">
        <div class="dw">${i === 0 ? 'Today' : DAY_NAMES[d.d.getDay()]}</div><div class="dn">${d.d.getDate()}</div>
        <div class="dd">${d.blocks.map(b => `<i style="background:${i === S.planDay ? '#fff' : b.c.color}"></i>`).join('')}</div></button>`).join('')}
    </div>
    <div class="scroll screen-in">
      ${day.exams.map(c => `<div class="card" style="background:var(--red-soft);box-shadow:none;margin-bottom:12px"><b style="color:var(--red)">📝 ${c.name} exam today</b><div class="small muted">Good luck! Predicted readiness ${predicted(c)}%.</div></div>`).join('')}
      ${day.blocks.length ? day.blocks.map((b, j) => `
        <button class="block" data-action="block" data-day="${S.planDay}" data-i="${j}">
          <div class="time">${b.time}</div>
          <div class="body" style="border-color:${b.c.color}">
            <div class="row between"><b style="font-size:14.5px">${b.c.name}</b><span class="small muted">${b.len} min</span></div>
            <div class="small" style="margin-top:3px">${b.topic.n}</div>
            <div class="row" style="gap:6px;margin-top:8px"><span class="badge purple">Focus ${b.focus}%</span><span class="badge ${status(predicted(b.c)).cls}">${status(predicted(b.c)).label}</span></div>
          </div></button>`).join('') : '<div class="timeline-empty">No sessions planned — rest day 🌿</div>'}
      <div class="card" style="margin-top:18px;background:var(--primary-soft);box-shadow:none">
        <div style="font-weight:700;font-size:14px;color:var(--primary)">${I.spark} How this plan was built</div>
        <p class="small" style="margin-top:6px;line-height:1.5">Courses furthest below the 80% "ready" line and with the closest exams get more sessions. Hardest topics are placed in your predicted peak-focus hours.</p>
      </div>
      <button class="btn btn-ghost btn-block" style="margin-top:12px" data-action="regen">↻ Regenerate plan</button>
    </div>
    ${tabbar('plan')}`;
};

screens.insights = () => {
  const heat = [[20, 35, 30, 15, 40, 60, 25], [30, 45, 40, 35, 50, 55, 40], [25, 30, 35, 30, 20, 45, 35], [70, 80, 75, 85, 60, 50, 65], [85, 90, 80, 88, 55, 40, 75], [40, 50, 45, 55, 30, 25, 45]];
  const labels = ['08', '11', '14', '17', '19', '22'];
  return `<div class="topbar screen-in"><h2>Insights</h2></div>
  <div class="scroll screen-in">
    <div class="stat-row" style="margin-top:0">
      <div class="stat" style="background:#fff;box-shadow:var(--shadow)"><strong>${S.totalSessions}</strong><span>Sessions logged</span></div>
      <div class="stat" style="background:#fff;box-shadow:var(--shadow)"><strong>3.9</strong><span>Avg focus /5</span></div>
      <div class="stat" style="background:#fff;box-shadow:var(--shadow)"><strong>🔥 6</strong><span>Day streak</span></div>
    </div>
    <div class="section-title"><h3>When you focus best</h3></div>
    <div class="card">
      <div class="heat"><span></span>${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<span>${d}</span>`).join('')}
        ${heat.map((row, i) => `<span>${labels[i]}h</span>${row.map(v => `<i style="background:rgba(91,91,214,${(v / 100).toFixed(2)})" title="${v}%"></i>`).join('')}`).join('')}
      </div>
      <p class="small muted" style="margin-top:10px">Learned from your post-session focus ratings. Weekday evenings are your strongest; weekend evenings drop by ~35%.</p>
    </div>
    <div class="section-title"><h3>How accurate are we?</h3></div>
    <div class="card">
      <div class="row"><div class="ring ring-sm">${ring(78, 'var(--primary)', 70, 8)}<div class="val"><strong style="font-size:16px">78%</strong></div></div>
      <div class="grow"><b style="font-size:14px">Model confidence</b><p class="small muted" style="margin-top:3px">Last semester your predicted vs. actual grades differed by only <b style="color:var(--ink)">0.6 points</b> on average. Confidence grows with every session you rate.</p></div></div>
    </div>
    <div class="section-title"><h3>Patterns we noticed</h3></div>
    <div class="card"><div class="notif" style="box-shadow:none;padding:0"><div class="ni" style="background:var(--amber-soft)">⏱</div><div class="small"><b>Sessions over 60 min</b> have 22% lower focus ratings. We cap recommended sessions at ${S.prefs.len} min.</div></div></div>
    <div class="card"><div class="notif" style="box-shadow:none;padding:0"><div class="ni" style="background:var(--green-soft)">📈</div><div class="small"><b>Spacing works for you:</b> topics reviewed on 3+ separate days gained 2× more mastery.</div></div></div>
    <button class="btn btn-ghost btn-block" style="margin-top:14px" data-action="how" data-v="all">How StudySync's models work</button>
  </div>
  ${tabbar('insights')}`;
};

screens.session = () => {
  const s = S.session, c = course(s.c);
  const total = s.len * 60, left = Math.max(0, total - s.elapsed);
  const R = 115, C = 2 * Math.PI * R;
  const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');
  return `<div class="session screen-in">
    <div class="top"><button data-action="end-early">✕ End</button><span class="small" style="opacity:.7">Focus mode · notifications muted</span></div>
    <div class="timer-ring"><svg viewBox="0 0 250 250"><circle cx="125" cy="125" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="10"/>
      <circle id="tr" cx="125" cy="125" r="${R}" fill="none" stroke="#8f8ff7" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - s.elapsed / total)}"/></svg>
      <div class="t"><div><strong id="tt">${mm}:${ss}</strong><span>${s.paused ? 'Paused' : 'remaining'}</span></div></div></div>
    <h3>${s.t}</h3><div class="s-sub">${c.name} · ${s.len} min session</div>
    <div class="tip">💡 <b>Recommended approach:</b> spend 10 min reviewing your notes on ${s.t}, then 35 min on practice problems. Active recall boosts your mastery score the most.</div>
    <div class="controls">
      <button class="btn btn-glass" data-action="pause">${s.paused ? '▶ Resume' : '❚❚ Pause'}</button>
      <button class="btn btn-white" data-action="finish">⏩ Skip (demo)</button>
    </div>
  </div>`;
};

screens.rate = () => {
  const s = S.session;
  return `<div class="topbar screen-in"><span></span><span class="small muted">Session complete</span><span></span></div>
  <div class="scroll screen-in">
    <div class="success-icon">✓</div>
    <h2 style="text-align:center;font-size:22px">Nice work!</h2>
    <p class="muted" style="text-align:center;margin:4px 0 20px">${s.len} min on ${s.t}. Two quick questions help us improve your predictions.</p>
    <div class="card">
      <b style="font-size:14px">How focused were you?</b>
      <div class="rate-row" style="margin-top:12px">${['😵', '😕', '😐', '🙂', '🤩'].map((e, i) => `<button class="${s.focus === i + 1 ? 'on' : ''}" data-action="rate" data-v="${i + 1}">${e}</button>`).join('')}</div>
      <div class="rate-labels"><span>Distracted</span><span>In the zone</span></div>
    </div>
    <div class="card">
      <div class="row between"><b style="font-size:14px">How confident are you on ${s.t} now?</b></div>
      <input type="range" min="0" max="100" value="${s.conf}" data-action="conf" style="margin-top:14px" />
      <div class="rate-labels"><span>Not at all</span><b id="confv" style="color:var(--primary)">${s.conf}%</b><span>Exam-ready</span></div>
    </div>
    <button class="btn btn-primary btn-block" style="margin-top:18px" data-action="submit-rating" ${s.focus ? '' : 'disabled'}>Update my predictions</button>
  </div>`;
};

screens.result = () => {
  const r = S.lastResult, c = course(r.c), s = status(r.p1);
  return `<div class="topbar screen-in"><span></span><span class="small muted">Predictions updated</span><span></span></div>
  <div class="scroll screen-in">
    <div class="success-icon" style="background:var(--primary-soft);color:var(--primary)">${I.spark}</div>
    <h2 style="text-align:center;font-size:22px">${c.name} forecast improved</h2>
    <p class="muted" style="text-align:center;margin:4px 0 18px">Predicted readiness on exam day (${fmtDate(examDate(c))})</p>
    <div class="card"><div class="delta"><div><div class="num muted">${r.p0}%</div><div class="small muted">before</div></div><div class="arrow">→</div>
      <div><div class="num" style="color:${s.col}">${r.p1}%</div><div class="small muted">now</div></div></div>
      <div style="text-align:center;margin-top:10px"><span class="badge ${s.cls}">+${r.p1 - r.p0}% · ${s.label}</span></div></div>
    <div class="card"><div class="row between small"><span>${r.topic} mastery</span><b>${r.m0}% → <span style="color:var(--green)">${r.m1}%</span></b></div>
      <div class="row between small" style="margin-top:8px"><span>Focus at ${NOW_HOUR}:00 (your rating)</span><b>${r.focus}/5</b></div>
      <div class="row between small" style="margin-top:8px"><span>Confidence band</span><b>±${band(c) + 1}% → ±${band(c)}%</b></div></div>
    <div class="card" style="background:var(--primary-soft);box-shadow:none"><b style="color:var(--primary);font-size:14px">Up next</b>
      <p class="small" style="margin-top:4px">${(() => { const n = recommendations()[0]; return `${n.c.name}: ${n.t.n} — tomorrow at ${bestSlot().hour}:00`; })()}</p></div>
    <button class="btn btn-primary btn-block" style="margin-top:16px" data-go="home">Back to Today</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" data-go="course" data-id="${c.id}">View ${c.name}</button>
  </div>`;
};

// ---------- Sheets (bottom modals) ----------
const sheets = {
  alts: () => `<h3>Other good options</h3><p class="small muted" style="margin-bottom:14px">Ranked by our recommender. Tap one to make it your next session.</p>
    ${recommendations().map((r, i) => `<button class="alt" data-action="pick-rec" data-v="${i}">
      <div class="c-icon" style="background:${r.c.color};width:38px;height:38px;font-size:12px">${r.c.name.slice(0, 2).toUpperCase()}</div>
      <div class="grow"><b style="font-size:14px">${r.t.n}</b><div class="small muted">${r.c.name} · exam in ${r.c.daysLeft}d · +${r.gain}% expected</div></div>
      <div class="score">${i === 0 ? 'Top pick' : `#${i + 1}`}</div></button>`).join('')}
    <button class="btn btn-ghost btn-block" style="margin-top:14px" data-action="close">Cancel</button>`,

  notifs: () => `<h3>Notifications</h3><div style="height:12px"></div>
    <div class="notif"><div class="ni" style="background:var(--primary-soft)">🎯</div><div class="small"><b>Focus window at 18:00</b><br><span class="muted">Your predicted focus peaks in under 2 hours — perfect for Production & Costs.</span></div></div>
    <div class="notif"><div class="ni" style="background:var(--red-soft)">⚠️</div><div class="small"><b>Microeconomics dropped to "Behind"</b><br><span class="muted">You haven't studied it in 4 days. 3 sessions added to your plan.</span></div></div>
    <div class="notif"><div class="ni" style="background:var(--green-soft)">🎉</div><div class="small"><b>Statistics II is on track</b><br><span class="muted">Predicted 92% on exam day. You can ease off a little.</span></div></div>
    <button class="btn btn-ghost btn-block" style="margin-top:14px" data-action="close">Close</button>`,

  how: (v) => {
    const parts = {
      pred: ['📈 Readiness prediction', 'A predictive model estimates how ready you\'ll be on exam day. It uses your topic mastery (self-ratings + quick quizzes), how often you\'ve studied lately, your focus during sessions, and how much material is left vs. days remaining. The shaded band shows uncertainty — it shrinks as you log more sessions. 80% = "ready".'],
      rec: ['✦ Study recommendations', 'The recommender ranks every (course, topic) pair by: how far the course is predicted to fall below 80%, how close the exam is, how weak the topic is and how much it weighs in the exam. It then pairs the top pick with your best upcoming focus slot. Over time it also learns which kinds of sessions raise your scores most.'],
      focus: ['🎯 Focus forecast', 'After each session you rate your focus (1–5). The model learns how your focus varies by hour, weekday, session length and recent sleep (optional, from your phone). It predicts today\'s focus hour by hour, so demanding topics land in your peak hours.'],
    };
    const list = v === 'all' ? Object.values(parts) : [parts[v]];
    return list.map(([t, d]) => `<h3>${t}</h3><p class="small" style="line-height:1.55;margin:6px 0 16px;color:#3c3f52">${d}</p>`).join('') +
      '<p class="small muted">In this mockup, all data and predictions are simulated.</p><button class="btn btn-primary btn-block" style="margin-top:14px" data-action="close">Got it</button>';
  },

  block: ({ day, i }) => {
    const b = buildPlan()[day].blocks[i];
    return `<div class="row" style="margin-bottom:10px"><div class="c-icon" style="background:${b.c.color}">${b.c.name.slice(0, 2).toUpperCase()}</div><div><h3>${b.topic.n}</h3><div class="small muted">${b.c.name} · ${b.time} · ${b.len} min</div></div></div>
      <div class="card"><div class="row between small"><span>Predicted focus at ${b.time}</span><b>${b.focus}%</b></div>
      <div class="row between small" style="margin-top:8px"><span>Current topic mastery</span><b>${b.topic.m}%</b></div>
      <div class="row between small" style="margin-top:8px"><span>Expected readiness gain</span><b style="color:var(--green)">+${Math.max(2, Math.round((100 - b.topic.m) * 0.09))}%</b></div></div>
      <button class="btn btn-primary btn-block" style="margin-top:14px" data-action="start" data-c="${b.c.id}" data-t="${b.topic.n}">Start this session now</button>
      <button class="btn btn-ghost btn-block" style="margin-top:8px" data-action="toast-close" data-v="Moved to tomorrow — plan re-balanced">Move to another day</button>`;
  },

  prefs: () => `<h3>Plan settings</h3><p class="small muted" style="margin-bottom:16px">The plan regenerates automatically when you change these.</p>
    <div style="font-weight:600;font-size:14px;margin-bottom:8px">Sessions per day</div>
    <div class="chips" style="margin-bottom:18px">${[1, 2, 3].map(n => `<button class="chip ${S.prefs.perDay === n ? 'on' : ''}" data-action="pref" data-k="perDay" data-v="${n}">${n}</button>`).join('')}</div>
    <div style="font-weight:600;font-size:14px;margin-bottom:8px">Session length</div>
    <div class="chips">${[25, 45, 60].map(n => `<button class="chip ${S.prefs.len === n ? 'on' : ''}" data-action="pref" data-k="len" data-v="${n}">${n} min</button>`).join('')}</div>
    <p class="small muted" style="margin-top:10px">Tip: your focus ratings drop after ~50 min, so 45 min is recommended.</p>
    <button class="btn btn-primary btn-block" style="margin-top:18px" data-action="close">Done</button>`,

  addCourse: () => `<h3>Add a course</h3><p class="small muted" style="margin-bottom:16px">We'll start predicting after your first session.</p>
    <div class="field"><label>Course name</label><input id="nc-name" placeholder="e.g. Operating Systems" /></div>
    <div class="field"><label>Exam date</label><input id="nc-date" type="date" value="2026-12-04" /></div>
    <div class="field"><label>How hard do you expect it to be?</label><select id="nc-diff"><option>Easy</option><option selected>Medium</option><option>Hard</option></select></div>
    <button class="btn btn-primary btn-block" style="margin-top:6px" data-action="save-course">Add course</button>`,

  endEarly: () => `<h3>End session early?</h3><p class="small muted" style="margin:6px 0 16px">You can still rate it — partial sessions count towards your predictions.</p>
    <button class="btn btn-primary btn-block" data-action="finish">Rate & save session</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" data-action="discard">Discard</button>`,
};

// ---------- Render ----------
const app = document.getElementById('app');
function render() {
  let html = screens[S.screen](S.params);
  if (S.sheet) html += `<div class="overlay" data-action="overlay"><div class="sheet"><div class="grab"></div>${sheets[S.sheet.type](S.sheet.data)}</div></div>`;
  if (S.toast) html += `<div class="toast">${S.toast}</div>`;
  const prevScroll = app.querySelector('.scroll')?.scrollTop;
  app.innerHTML = html;
  if (S.keepScroll && prevScroll) { const sc = app.querySelector('.scroll'); if (sc) sc.scrollTop = prevScroll; }
  S.keepScroll = false;
}
function go(screen, params = {}) { S.screen = screen; S.params = params; S.sheet = null; render(); }
function sheet(type, data) { S.sheet = { type, data }; S.keepScroll = true; render(); }
let toastTimer;
function toast(msg) { S.toast = msg; S.keepScroll = true; render(); clearTimeout(toastTimer); toastTimer = setTimeout(() => { S.toast = null; S.keepScroll = true; render(); }, 2600); }

// ---------- Session timer ----------
let tick;
function startSession(c, t) {
  clearInterval(tick);
  S.session = { c, t, len: S.prefs.len, elapsed: 0, paused: false, focus: 0, conf: 50 };
  go('session');
  tick = setInterval(() => {
    if (S.screen !== 'session' || S.session.paused || S.sheet) return;
    S.session.elapsed++;
    const total = S.session.len * 60, left = total - S.session.elapsed;
    const tt = document.getElementById('tt'), tr = document.getElementById('tr');
    if (tt) tt.textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
    if (tr) tr.style.strokeDashoffset = 2 * Math.PI * 115 * (1 - S.session.elapsed / total);
    if (left <= 0) { clearInterval(tick); go('rate'); }
  }, 1000);
}

// ---------- Events ----------
const actions = {
  'reset': () => { clearInterval(tick); Object.assign(S, { screen: 'onboarding', ob: 0, courses: seedCourses(), sheet: null, recSkip: 0, planDay: 0, prefs: { perDay: 2, len: 45 }, notifRead: false, totalSessions: 48, session: null }); render(); },
  'ob-next': () => { S.ob++; render(); },
  'ob-skip': () => { S.ob = 2; render(); },
  'ob-time': el => { const v = el.dataset.v; S.studyTimes = S.studyTimes.includes(v) ? S.studyTimes.filter(x => x !== v) : [...S.studyTimes, v]; S.keepScroll = true; render(); },
  'ob-done': () => go('home'),
  'notifs': () => { S.notifRead = true; sheet('notifs'); },
  'how': el => sheet('how', el.dataset.v),
  'alts': () => sheet('alts'),
  'pick-rec': el => { S.recSkip = +el.dataset.v; S.sheet = null; render(); toast('Next session updated'); },
  'start': el => startSession(el.dataset.c, el.dataset.t),
  'quickstart': () => { const r = recommendations()[S.recSkip % S.courses.length]; startSession(r.c.id, r.t.n); },
  'schedule': el => toast(`🔔 We'll remind you at ${el.dataset.h}:00 to study ${el.dataset.t}`),
  'pause': () => { S.session.paused = !S.session.paused; render(); },
  'end-early': () => sheet('endEarly'),
  'discard': () => { clearInterval(tick); go('home'); },
  'finish': () => { clearInterval(tick); go('rate'); },
  'rate': el => { S.session.focus = +el.dataset.v; S.keepScroll = true; render(); },
  'submit-rating': () => {
    const s = S.session; if (!s.focus) return;
    const c = course(s.c), t = c.topics.find(x => x.n === s.t);
    const p0 = predicted(c), m0 = t.m;
    t.m = Math.min(98, Math.round(t.m + 6 + s.focus * 2 + (s.conf - 50) / 10));
    c.rate = +(c.rate + 0.08 + s.focus * 0.02).toFixed(2);
    c.hours += s.len / 60; c.sessions++; S.totalSessions++; S.recSkip = 0;
    S.lastResult = { c: c.id, topic: t.n, p0, p1: Math.max(p0 + 1, predicted(c)), m0, m1: t.m, focus: s.focus };
    if (predicted(c) <= p0) c.rate += 0.15;
    S.lastResult.p1 = predicted(c);
    go('result');
  },
  'plan-day': el => { S.planDay = +el.dataset.v; render(); },
  'block': el => sheet('block', { day: +el.dataset.day, i: +el.dataset.i }),
  'plan-prefs': () => sheet('prefs'),
  'pref': el => { S.prefs[el.dataset.k] = +el.dataset.v; S.keepScroll = true; render(); },
  'regen': () => toast('✦ Plan regenerated with your latest predictions'),
  'toast-close': el => { S.sheet = null; toast(el.dataset.v); },
  'add-course': () => sheet('addCourse'),
  'save-course': () => {
    const name = document.getElementById('nc-name').value.trim() || 'Operating Systems';
    const date = new Date(document.getElementById('nc-date').value || '2026-12-04');
    const diff = document.getElementById('nc-diff').value;
    const days = Math.max(1, Math.round((date - TODAY) / 864e5));
    const base = diff === 'Easy' ? 35 : diff === 'Hard' ? 10 : 20;
    S.courses.push({ id: 'c' + Date.now(), name, code: 'NEW', color: '#8e5bd6', daysLeft: days, rate: diff === 'Hard' ? 1.2 : 1.6, weight: 'Exam',
      topics: [{ n: 'Lectures 1–3', m: base + 10, w: 35 }, { n: 'Lectures 4–6', m: base, w: 35 }, { n: 'Lectures 7–9', m: Math.max(5, base - 10), w: 30 }], hours: 0, sessions: 0 });
    S.sheet = null; go('courses'); toast(`${name} added — first prediction ready`);
  },
  'close': () => { S.sheet = null; S.keepScroll = true; render(); },
  'overlay': (el, e) => { if (e.target === el) actions.close(); },
};

document.addEventListener('click', e => {
  const goEl = e.target.closest('[data-go]');
  const actEl = e.target.closest('[data-action]');
  // innermost wins
  if (goEl && (!actEl || actEl.contains(goEl))) {
    const target = goEl.dataset.go;
    const params = goEl.dataset.id ? { id: goEl.dataset.id, from: S.screen === 'course' ? 'home' : S.screen } : {};
    go(target, params); return;
  }
  if (actEl && actEl.dataset.action !== 'conf') {
    const fn = actions[actEl.dataset.action];
    if (fn) fn(actEl, e);
  }
});
document.addEventListener('input', e => {
  if (e.target.dataset.action === 'conf') { S.session.conf = +e.target.value; const v = document.getElementById('confv'); if (v) v.textContent = e.target.value + '%'; }
});

render();
