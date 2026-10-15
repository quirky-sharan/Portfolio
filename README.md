# Sharan Soni — Portfolio

> **Half model. Half motion.**
> AI/ML engineer & frontend developer. This is the site.

Built with **React 19 · Vite · Tailwind v4 · GSAP (ScrollTrigger, SplitText) · Lenis · Motion (Framer Motion) · Three.js / React Three Fiber · matter-js**.

---

## What's inside

| Section | What it does |
| --- | --- |
| **Loader** | The name resolves through Gujarati → Hindi → Japanese → English, then *Tok* (the little token-bot) shoves the black curtain off-screen to reveal the hero. Plays short on repeat visits in the same tab. |
| **Hero** | Full-bleed name on Archivo's variable `wght`/`wdth` axes — letters thin out and widen under the cursor. “Half *model.* Half *motion.*” rendered as LLM tokens. Live Vellore clock. |
| **About** | Manifesto that lights up word-by-word as you scroll. The **Human ⇄ Tokens** switch re-renders it the way a language model reads it. Slot-machine stats, four scripts. |
| **Work** | Pinned, one project per scroll. Grid-cell wipes between projects, rolling index, generative covers. The **Visual ⇄ Brief** switch flips the card to show the short intro. On phones the brief opens underneath. |
| **Side quests** | Smaller builds pulled from GitHub. |
| **Toolbox** (3D) | Every skill as a glossy 3D chip with real 2D physics — drag, throw, shake (tap to flick on phones). |
| **Results** | Hackathons as an F1 timing board. |
| **The path** | Internships, open source, clubs, school. |
| **Contact** (3D) | “Let's talk” in every language, click-to-copy email, call/WhatsApp, and a 3D **hanko** (Japanese name seal) you can click to stamp シャラン onto the page. |

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

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the build locally
npm run lint
npm run format
```

Node 20+.

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
    three/                 ← ToolboxScene (physics chips), HankoScene (3D seal)
    ui/                    ← Mascot, Switch, Token, RollNumber, Magnetic, Cursor…
  lib/                     ← gsap setup, Lenis, hooks, tokenizer
public/                    ← favicon, og image, project screenshots
```
