// CampusConnect – main.js. Sample data now; swap getEvents() for fetch('/api/events') once Spring Boot is ready.
const SAMPLE_EVENTS = [
  { id: 1, title: 'TechFest 2026 Hackathon', category: 'tech', date: '2026-12-05', time: '9:00 AM', venue: 'Main Auditorium', description: '24-hour hackathon with prizes, mentors and industry judges.', image: 'images/Hackathon.png' },
  { id: 2, title: 'Annual Cultural Night', category: 'cultural', date: '2026-12-12', time: '6:00 PM', venue: 'Open Air Theatre', description: 'Music, dance and drama performances by student clubs.', image: 'images/Cultural.png' },
  { id: 3, title: 'Inter-Department Cricket Cup', category: 'sports', date: '2026-12-08', time: '8:00 AM', venue: 'College Ground', description: 'Knockout cricket tournament across all departments.', image: 'images/Cricket.png' },
  { id: 4, title: 'Intro to Spring Boot Workshop', category: 'workshop', date: '2026-12-03', time: '2:00 PM', venue: 'Computer Lab 3', description: 'Hands-on session building your first REST API.', image: 'images/Spring.png' },
  { id: 5, title: 'AI & Data Science Seminar', category: 'tech', date: '2026-12-15', time: '11:00 AM', venue: 'Seminar Hall B', description: 'Guest lecture on machine learning careers and projects.', image: 'images/AI.png' },
  { id: 6, title: 'Photography Walk', category: 'cultural', date: '2026-12-18', time: '4:00 PM', venue: 'Campus Gardens', description: 'Capture the campus with the Photography Club.', image: 'images/Photo.png' }];
const SAMPLE_NOTICES = ['Semester exam timetable will be released on 1 December.', 'Library hours extended during exam season (8 AM – 10 PM).', 'Registrations for TechFest close on 30 November.'];
const NAV = [['index.html', 'Home'], ['events.html', 'Events'], ['dashboard.html', 'Dashboard'], ['login.html', 'Login'], ['register.html', 'Register']];
const getEvents = () => Promise.resolve(SAMPLE_EVENTS); // TODO: return fetch('/api/events').then(r=>r.json())
const fmt = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const $ = (s, r = document) => r.querySelector(s);

function renderLayout() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const h = $('#site-header');
  if (h) h.innerHTML = `
    <div class="container nav">
        <a class="logo" href="index.html">
            <img src="images/College_logo.png" alt="College Logo" class="college-logo">
            Campus<b>Connect</b>
        </a>

        <button class="menu-btn" aria-label="Menu">&#9776;</button>

        <nav>
            <ul>
                ${NAV.map(([u, t]) => `<li><a class="link ${u === page ? 'active' : ''}" href="${u}">${t}</a></li>`).join('')}
            </ul>
        </nav>
    </div>`;
  const f = $('#site-footer');
  if (f) f.innerHTML = `<div class="container footer-grid"><div><h3>CampusConnect</h3><p>One portal for college events, registrations and announcements.</p></div><div><h3>Quick Links</h3><ul>${NAV.map(([u, t]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul></div><div><h3>Contact</h3><p>Email: Vesit@gmail.com<br>Phone: +91 8693005670</p></div></div><div class="container copy">&copy; 2026 CampusConnect. All rights reserved.</div>`;
  const b = $('.menu-btn'); if (b) b.onclick = () => $('.nav ul').classList.toggle('open');
}
const cardHTML = e => `<article class="card"><div class="card-img"> <img src ="${e.image}" alt="${e.title}"><span>${e.category}</span></div><div class="card-body"><h3>${e.title}</h3><p class="meta">${fmt(e.date)} · ${e.time}<br>${e.venue}</p><p>${e.description}</p><a class="btn btn-sm" href="login.html">Register Now</a></div></article>`;
const dateHTML = e => { const d = new Date(e.date); return `<div class="date-item"><div class="date-box">${d.getDate()}<small>${d.toLocaleString('en', { month: 'short' })}</small></div><div><h3>${e.title}</h3><p class="meta">${e.time} · ${e.venue}</p></div></div>` };
const noticeHTML = n => `<div class="notice">${n}</div>`;
const fill = (sel, items, fn) => { const el = $(sel); if (el) el.innerHTML = items.map(fn).join('') };

function initHome(events) { fill('#featured', events.slice(0, 3), cardHTML); fill('#upcoming', [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4), dateHTML); fill('#notices', SAMPLE_NOTICES, noticeHTML) }
function initEvents(events) {
  const grid = $('#event-grid'), q = $('#search'); let cat = 'all';
  const draw = () => { const t = q.value.toLowerCase(); const list = events.filter(e => (cat === 'all' || e.category === cat) && (e.title + e.venue + e.description).toLowerCase().includes(t)); grid.innerHTML = list.length ? list.map(cardHTML).join('') : '<p class="empty">No events found.</p>' };
  q.oninput = draw;
  document.querySelectorAll('.chip').forEach(c => c.onclick = () => { document.querySelectorAll('.chip').forEach(x => x.classList.remove('active')); c.classList.add('active'); cat = c.dataset.cat; draw() });
  draw();
}
function initDashboard(events) {
  fill('#d-upcoming', events.slice(0, 3), dateHTML);
  fill('#d-recent', events.slice(3, 6), e => `<div class="list-item"><span>${e.title}</span><span class="badge">Registered</span></div>`);
  fill('#d-notices', SAMPLE_NOTICES, noticeHTML);
  const n = $('#stat-total'); if (n) n.textContent = events.length - 2;
}
function initForms() {
  document.querySelectorAll('.toggle').forEach(t => t.onclick = () => { const i = t.parentElement.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; t.textContent = i.type === 'password' ? 'Show' : 'Hide' });
  document.querySelectorAll('form[data-validate]').forEach(form => form.onsubmit = ev => {
    ev.preventDefault(); let ok = true;
    const fail = (el, m) => { ok = false; el.closest('.field').classList.add('invalid'); el.closest('.field').querySelector('.error').textContent = m };
    form.querySelectorAll('.field').forEach(f => { f.classList.remove('invalid'); f.querySelector('.error').textContent = '' });
    form.querySelectorAll('[required]').forEach(el => { if (!el.value.trim()) fail(el, 'This field is required.') });
    const em = form.querySelector('[type=email]'); if (em && em.value && !/^\S+@\S+\.\S+$/.test(em.value)) fail(em, 'Enter a valid email.');
    const pw = form.querySelector('[name=password]'), cf = form.querySelector('[name=confirm]');
    if (cf && pw.value && pw.value.length < 8) fail(pw, 'Use at least 8 characters.');
    if (cf && cf.value && pw.value !== cf.value) fail(cf, 'Passwords do not match.');
    if (ok) { const m = form.querySelector('.msg'); m.style.display = 'block'; m.textContent = 'Form valid. Connect your API here (POST /api/auth/...).'; }
  });
}
document.addEventListener('DOMContentLoaded', async () => {
  renderLayout(); initForms();
  const events = await getEvents(), p = document.body.dataset.page;
  if (p === 'home') initHome(events); if (p === 'events') initEvents(events); if (p === 'dashboard') initDashboard(events);
});
