/*
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE COPY LIVES HERE.
 *  Edit text, links and projects in this one file — the UI
 *  picks everything up automatically.
 * ─────────────────────────────────────────────────────────────
 */

export const person = {
  name: 'Sharan Soni',
  first: 'Sharan',
  last: 'Soni',
  role: 'AI/ML Engineer & Frontend Developer',
  location: 'Vellore, Tamil Nadu, India',
  timezone: 'Asia/Kolkata',
  email: 'imsharansoni@gmail.com',
  phone: '+91 79905 88077',
  phoneRaw: '+917990588077',
  whatsapp: 'https://wa.me/917990588077',
  linkedin: 'https://www.linkedin.com/in/sharan-soni-/',
  github: 'https://github.com/quirky-sharan',
  education: {
    school: 'Vellore Institute of Technology',
    short: 'VIT Vellore',
    degree: 'B.Tech CSE — AI & ML',
    year: '2029',
  },
}

/* The name, in every script Sharan speaks — used by the loader. */
export const scripts = [
  { lang: 'GU', label: 'Gujarati', text: 'શરણ સોની', className: 'font-gu' },
  { lang: 'HI', label: 'Hindi', text: 'शरण सोनी', className: 'font-hi' },
  { lang: 'JA', label: 'Japanese', text: 'シャラン・ソニ', className: 'font-ja' },
  { lang: 'EN', label: 'English', text: 'SHARAN SONI', className: 'font-display' },
]

/* “Hello” in every language — used by the contact headline. */
export const hellos = [
  { text: "Let's talk", className: 'font-display' },
  { text: 'नमस्ते', className: 'font-hi' },
  { text: 'કેમ છો', className: 'font-gu' },
  { text: 'こんにちは', className: 'font-ja' },
]

export const hero = {
  kicker: 'Portfolio ©2026',
  statement: ['Half', 'model.', 'Half', 'motion.'],
  intro:
    'Second-year CSE (AI & ML) student at VIT Vellore building AI-driven, full-stack products with RAG and LLMs — and the interfaces that make them feel alive.',
  facts: [
    { k: 'Now', v: 'B.Tech CSE (AI & ML), VIT Vellore' },
    { k: 'Next', v: 'AI/ML Engineer Intern, AMNEX — Summer ’27' },
    { k: 'Status', v: 'Open to internships & collabs' },
  ],
}

/* Wrap words in *asterisks* to set them in the italic serif. */
export const manifesto =
  'I build AI that *remembers context* instead of hallucinating it — then I obsess over the frontend until it *moves like it means it.* Hackathon winner, patent applicant, and a firm believer that great models deserve *great interfaces.*'

export const stats = [
  { value: 3, pad: 2, suffix: '', label: 'Hackathon podiums' },
  { value: 1, pad: 2, suffix: '', label: 'Patent filed' },
  { value: 20, pad: 0, prefix: '₹', suffix: 'K', label: 'Prize money won' },
  { value: 4, pad: 2, suffix: '', label: 'Languages spoken' },
]

/*
 * Projects. `brief` is the short intro revealed by the BRIEF switch.
 * `cover` picks the visual: 'image' uses `images`, anything else is a
 * generative cover drawn in code (swap to real screenshots any time).
 */
export const projects = [
  {
    id: 'equinox',
    index: '01',
    title: 'Equinox',
    subtitle: 'Multilingual AI Health Assistant',
    result: 'Best in Healthcare Track',
    event: 'Equinox Hackathon · Robovitics',
    role: 'AI/ML · Frontend · Backend',
    team: 'With Devatman Pal',
    color: '#9EE6C6',
    ink: '#0B3B2B',
    cover: 'image',
    images: [
      { src: '/work/equinox-landing', alt: 'Equinox landing page — “Medicine that reads between the lines.”' },
      { src: '/work/equinox-inference', alt: 'Equinox inference report showing a low-risk result' },
      { src: '/work/equinox-assesment', alt: 'Equinox conversational symptom assessment' },
    ],
    brief: [
      'Tackles AI-chatbot hallucination and missing context by factoring in a user’s previous health records, mental health and typing patterns — in multiple languages.',
      'It keeps asking follow-ups until symptoms converge on a probable condition, then returns do’s and don’ts, a diet plan and a doctor-ready PDF report. Nearby doctors are booked in one click by an AI agent that phones the receptionist.',
    ],
    stack: ['RAG', 'ChromaDB', 'LLM Fine-Tuning', 'Llama 3.3 70B · Groq', 'FastAPI', 'React', 'Firebase Auth'],
    links: [{ label: 'GitHub', href: 'https://github.com/quirky-sharan/equinox' }],
  },
  {
    id: 'f1',
    index: '02',
    title: 'F1 Race Prediction',
    titleAlt: '& Masked Collider',
    subtitle: 'Race-outcome ML + particle physics',
    result: '2nd Place · ~900 teams',
    event: 'Ascent Hackathon · Scaler School of Technology',
    role: 'ML · Python',
    team: 'Hackathon build',
    color: '#FF5A36',
    ink: '#2A0A03',
    cover: 'f1',
    brief: [
      'Built an ML model on the provided F1 dataset to predict each car’s position at any given time — and how the race concludes.',
      'For Masked Collider, modelled particle collisions and their space–time equation at a given time or position.',
    ],
    stack: ['Python', 'Machine Learning', 'Pandas', 'Physics modelling'],
    links: [],
  },
  {
    id: 'docdesk',
    index: '03',
    title: 'DocDesk',
    subtitle: 'A front desk that runs itself',
    result: 'Personal project',
    event: 'Full-stack + AI layer',
    role: 'Frontend · Backend · Database · AI',
    team: 'Solo',
    color: '#D4F25A',
    ink: '#1F2A00',
    cover: 'docdesk',
    brief: [
      'Designed to replace a receptionist: automates text and reminder messaging, generates bills, and handles the routine tasks small businesses otherwise spread across multiple tools.',
      'Unifies data across formats in one system — PostgreSQL, MySQL, NoSQL, Excel, Word and CSV — with an AI/ML layer that improves the system and gives advice.',
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'RAG', 'LLMs', 'Firebase Auth'],
    links: [{ label: 'GitHub', href: 'https://github.com/quirky-sharan/DocDesk' }],
  },
  {
    id: 'versa',
    index: '04',
    title: 'V.E.R.S.A',
    subtitle: 'Active-recall analytics',
    result: 'Patent filed · pending grant',
    event: 'Innovation Design Project · VIT Vellore',
    role: 'AI/ML · Frontend',
    team: 'Co-inventor: Devatman Pal',
    color: '#C7B8FF',
    ink: '#1C1240',
    cover: 'versa',
    brief: [
      'A course quiz and recall-analytics system with timestamps, built on active-recall techniques.',
      'Patent application filed — pending grant.',
    ],
    stack: ['Active recall', 'Analytics', 'AI/ML', 'Frontend'],
    links: [],
  },
]

/* Smaller builds from GitHub — shown under the main projects. */
export const sideQuests = [
  {
    title: 'OrbitLex',
    note: 'Satellite compliance, deorbit prediction & debris-risk analyser',
    tags: 'React · FastAPI · Three.js · Groq + RAG',
    href: 'https://github.com/quirky-sharan/erebus',
  },
  {
    title: 'JARVIS',
    note: 'Personal RAG assistant with realtime context',
    tags: 'FastAPI · LangChain · Groq · FAISS',
    href: 'https://github.com/quirky-sharan/JARVIS',
  },
]

/* Skills → physics chips in the Toolbox. `group` picks the colour. */
export const toolbox = {
  groups: {
    ai: { label: 'AI / ML', color: '#D4F25A' },
    lang: { label: 'Languages', color: '#A9D2F5' },
    web: { label: 'Web', color: '#F6B8E0' },
    tools: { label: 'Tools & Core', color: '#F3D68C' },
  },
  items: [
    ['Machine Learning', 'ai'],
    ['RAG', 'ai'],
    ['LLMs', 'ai'],
    ['LLM Fine-Tuning', 'ai'],
    ['Vector DBs', 'ai'],
    ['NLP Pipelines', 'ai'],
    ['Pandas', 'ai'],
    ['ChromaDB', 'ai'],
    ['Python', 'lang'],
    ['Java', 'lang'],
    ['C', 'lang'],
    ['JavaScript', 'lang'],
    ['TypeScript', 'lang'],
    ['Ruby', 'lang'],
    ['React', 'web'],
    ['Node.js', 'web'],
    ['FastAPI', 'web'],
    ['Framer Motion', 'web'],
    ['GSAP', 'web'],
    ['Three.js', 'web'],
    ['Git & GitHub', 'tools'],
    ['Figma', 'tools'],
    ['Vercel', 'tools'],
    ['PostgreSQL', 'tools'],
    ['DSA', 'tools'],
    ['System Design', 'tools'],
  ],
}

/* Hackathons & recognitions — rendered as a timing board. */
export const results = [
  { pos: 'P1', event: 'Equinox Hackathon', org: 'Robovitics', note: 'Best in Healthcare Track', prize: '₹10,000' },
  {
    pos: 'P2',
    event: 'Ascent Hackathon',
    org: 'Scaler School of Technology',
    note: '2nd of ~900 across India',
    prize: '₹10,000',
  },
  { pos: 'P2', event: 'Hack Battle', org: '', note: 'Runner-Up', prize: '—' },
  { pos: 'PAT', event: 'V.E.R.S.A', org: 'VIT Vellore', note: 'Patent application filed', prize: 'Pending' },
  { pos: 'FIN', event: 'Samsung PRISM', org: '', note: 'Participant', prize: '—' },
  { pos: 'FIN', event: 'Cultrix Hackathon', org: '', note: 'Participant', prize: '—' },
  { pos: 'FIN', event: 'Dev Soc Hackathon', org: '', note: 'Participant', prize: '—' },
]

/* Internships, open source, clubs. */
export const path = [
  { when: 'Summer 2027', what: 'AI/ML Engineer Intern', where: 'AMNEX, Ahmedabad', tag: 'Accepted' },
  { when: 'Summer 2026', what: 'Full-Stack Developer Intern', where: 'Plotline', tag: 'Offer received' },
  { when: 'Ongoing', what: 'Open-Source Contributor', where: 'GirlScript Summer of Code', tag: 'GSSoC' },
  { when: 'Member', what: 'UX/UI & Web Development', where: 'IEEE Computer Society, VIT', tag: 'Club' },
  { when: 'Member', what: 'Publicity & Digital Marketing', where: 'Gujarat Literature Association, VIT', tag: 'Club' },
  { when: 'Class of 2029', what: 'B.Tech CSE — AI & ML', where: 'VIT Vellore', tag: 'Education' },
]

export const languages = [
  { name: 'English', level: 'Fluent', hello: 'Hello', className: 'serif italic' },
  { name: 'Hindi', level: 'Fluent', hello: 'नमस्ते', className: 'font-hi' },
  { name: 'Gujarati', level: 'Fluent', hello: 'કેમ છો', className: 'font-gu' },
  { name: 'Japanese', level: 'Learning', hello: 'こんにちは', className: 'font-ja' },
]

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Toolbox', href: '#toolbox' },
  { label: 'Contact', href: '#contact' },
]
