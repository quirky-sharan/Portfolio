# Sharan Soni — Portfolio

> **Half model. Half motion.**
> AI/ML engineer & frontend developer. This is the site.

Built with **React 19 · Vite · Tailwind v4 · GSAP (ScrollTrigger, SplitText) · Lenis · Motion (Framer Motion) · Three.js / React Three Fiber · matter-js**.

---

## What's inside

| Section | What it does |
| --- | --- |
| **Loader** | The name resolves through Gujarati → Hindi → Japanese → English, then a cat in a vermilion hoodie and shades shoves the black curtain off-screen to reveal the hero. Plays short on repeat visits in the same tab. |
| **Hero** | Full-bleed name on Archivo's variable `wght`/`wdth` axes — letters thin out and widen under the cursor. “Half *model.* Half *motion.*” rendered as LLM tokens. Live Vellore clock. |
| **About** | Manifesto that streams in as you scroll, each word flashing as a coloured token behind a blinking caret. The **Human ⇄ Tokens** switch re-renders it the way a language model reads it. Slot-machine stats, four scripts. |
| **Work** | Pinned, one project per scroll. Grid-cell wipes between projects, rolling index, generative covers. The **Visual ⇄ Brief** switch flips the card to show the short intro. On phones the brief opens underneath. |
| **Side quests** | Smaller builds pulled from GitHub. |
| **Toolbox** (3D) | Every skill as a glossy 3D chip with real 2D physics — drag, throw, shake (tap to flick on phones). Scroll fast and the chips rattle. |
| **Results** | Hackathons as an F1 timing board — five start lights come on as you scroll in, then lights out and the rows race onto the board. |
| **The path** | Internships, open source, clubs, school — dealt from a deck of cards as you scroll. |
| **Everywhere** | Big type leans into your scroll speed, headings rise word by word, the logo's pixels re-render on hover, and a tiny cat walks the bottom edge as a scroll-progress bar. |
| **Contact** (3D) | “Let's talk” in English, Hindi and Gujarati, click-to-copy email, call/WhatsApp, and a 3D **lanyard ID card** you can grab and fling (its QR code opens a WhatsApp chat). |

---

## Edit the content

**Everything you'd want to change is in one file: [`src/data/content.js`](src/data/content.js).**

- `person` — name, email, phone, links
- `hero`, `manifesto` (wrap words in `*asterisks*` for the italic serif), `stats`
- `projects` — title, result, tags, links and the **`brief`** text shown by the BRIEF switch
  - `cover: 'image'` uses screenshots from `public/work/` (see Equinox). The others use the generative covers in `src/components/covers/` — swap any project to `'image'` once you have screenshots.
- `sideQuests`, `toolbox`, `results`, `path`, `languages`, `nav`

### Adding real screenshots to a project

1. Export two WebP sizes into `public/work/`, e.g. `docdesk-home-1600.webp` and `docdesk-home-800.webp`.
2. In `content.js` set `cover: 'image'` and `images: [{ src: '/work/docdesk-home', alt: '…' }, { src: '/work/docdesk-other', alt: '…' }]`.

---

## Run it on your computer

You need **Node.js 22.12 or newer** — the LTS from [nodejs.org](https://nodejs.org) is perfect. Check with `node -v`.

### The easy way — double-click

| Windows | macOS | Linux |
| --- | --- | --- |
| Double-click **`start.bat`** | Double-click **`start.command`** | `bash start.command` |

It checks your Node version, installs packages the first time (and again whenever they change), starts the site and opens your browser. Keep the window open while you use it; **Ctrl + C** stops it.

> If macOS blocks it the first time, open **System Settings → Privacy & Security** and click **Open Anyway** — or open Terminal in the folder and run `bash start.command`.

### The terminal way

```bash
git clone https://github.com/quirky-sharan/Portfolio.git
cd Portfolio
git checkout claude/clever-ptolemy-g46bgo
npm install
npm run dev
```

Then open http://localhost:5173. (The `git checkout` line is only needed until this branch is merged into `main`.)

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload — http://localhost:5173 |
| `npm start` | Same, and opens the browser for you |
| `npm run dev:phone` | Also serves on your Wi-Fi — open the **Network** URL it prints on your phone (same Wi-Fi). On Windows allow Node.js in the firewall prompt and set your Wi-Fi to *Private*. |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build — http://localhost:4173 |
| `npm run lint` / `npm run format` | ESLint / Prettier |

### If something goes wrong

- **`npm` is "not recognized"** — Node isn't installed, or the terminal was open before you installed it. Install the LTS and open a new terminal.
- **PowerShell: "running scripts is disabled on this system"** — use **Command Prompt** or `start.bat` instead, or run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **"Vite requires Node.js version 20.19+ or 22.12+"** or **EBADENGINE** warnings — update Node to the current LTS from nodejs.org.
- **Port 5173 already in use** — Vite picks the next free port; use the URL it prints.
- **Windows: `EACCES: permission denied … 5173`** — Hyper-V/WSL/Docker reserved that port. Run `npm run dev -- --port 3000`.
- **Windows on ARM: "Required DLL was not found"** — install the [Visual C++ runtime for ARM64](https://aka.ms/vs/17/release/vc_redist.arm64.exe).
- **Weird install errors after switching branches** — delete `node_modules` and run `npm install` again.
- **3D sections look blank** — your browser has WebGL/hardware acceleration turned off; the rest of the site still works and the 3D falls back gracefully.

---

## Deploy

The site is a static build (`dist/`), so it runs anywhere.

**Vercel (recommended)** — import the repo, framework preset *Vite*, done. `vercel.json` adds long-term caching for hashed assets. The production domain is picked up automatically for social-share cards.

**Netlify** — import the repo; `netlify.toml` already sets the build command and publish dir.

**Anything else** — `npm run build` and upload `dist/`.

### Social-share cards

Set `VITE_SITE_URL` (see `.env.example`) to your live URL so the Open Graph / Twitter image and canonical links are absolute. The share image is `public/og.jpg`.

---

## Performance notes

- 3D scenes are code-split and only load when you scroll near them; they stop rendering when off-screen.
- Japanese / Hindi / Gujarati fonts are subset to just the glyphs used (~9 KB total).
- Smooth scrolling (Lenis) and every scroll animation share GSAP's single ticker.
- `prefers-reduced-motion` is respected (no smooth scroll, instant loader, no cursor effects).
- If WebGL isn't available the 3D sections fall back to flat versions.

---

## Structure

```
src/
  data/content.js          ← all copy & links
  components/
    sections/              ← Loader, Header, Hero, About, Work, Toolbox, Results, Path, Contact, Footer…
    covers/                ← generative project covers (SVG)
    three/                 ← ToolboxScene (physics chips), LanyardScene (ID card + rope physics)
    ui/                    ← Cat, ScrollCat, Logo, Switch, Token, RollNumber, Magnetic, Cursor…
  lib/                     ← gsap setup, Lenis, hooks, tokenizer
public/                    ← favicon, og image, project screenshots
```
