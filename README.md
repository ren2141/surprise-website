# A Surprise For You 💌

A premium, single-page "digital gift" website — built to be opened from a
QR code and feel like unwrapping a present. Glassmorphism cards, a soft
blue/lavender/gold palette, a scroll-triggered memory timeline, a photo
gallery with lightbox, typewriter wishes, a confetti + fireworks finale,
and a handwritten-style closing letter.

No backend, no build step, no dependencies to install — just static
files you can open directly or deploy in a couple of minutes.

---

## 1. Project structure

```
/
├── index.html                 the whole page (content-free — see config.js)
├── css/
│   └── style.css              every style, animation, and color token
├── js/
│   ├── config.js              ← YOU EDIT THIS. All text/photos/settings.
│   └── script.js              site logic (rendering + interactions)
├── images/                    placeholder photos (SVG) — replace these
├── music/                     put your background track here
├── videos/                    put a local video here (optional)
├── assets/                    optional: QR code, source files, etc.
└── README.md                  you are here
```

**The rule of thumb: everything you want to change lives in `js/config.js`.**
You should never need to touch `index.html`, `style.css`, or `script.js`
just to personalize the content.

---

## 2. Preview it right now

The site works by opening `index.html` directly in a browser — but a few
browsers restrict local file access enough to affect things like the
video facade, so a tiny local server is the more reliable option:

```bash
cd surprise-website
python3 -m http.server 8000
# then open http://localhost:8000
```

(No Python? `npx serve` works the same way if you have Node installed.)

---

## 3. Personalize it — `js/config.js`

Open `js/config.js`. It's one big object with clearly labeled sections.
A few things worth knowing:

- **`friendName`** — set this once. Anywhere in the text you'll see
  `{{name}}`, it gets swapped in automatically (e.g. the countdown label,
  the footer note).
- **Every section has a `heading`/`subheading`** you can rewrite freely.
- **Arrays are safe to add to or shorten** — `timeline.items`,
  `gallery.items`, `wishes.items`, `funFacts.items`, and
  `memoryWall.items` can all have more or fewer entries than the
  placeholder set. The layout adapts automatically.
- **`countdown.enabled: false`** removes that whole section (and its nav
  dot) if you don't need it.
- **`video.items: []`** (the default) shows a friendly placeholder card
  instead of an empty section — add entries when you have a real video.

### Replacing photos

Each photo is just a path, e.g. `"images/timeline-1.svg"`. To replace one:

1. Add your photo to the `images/` folder (JPG or PNG both work — WebP
   too, if you're comfortable converting).
2. Update the matching path in `js/config.js`, e.g.
   `photo: "images/timeline-1.jpg"`.
3. Keep photos reasonably compressed for a fast QR-scan experience —
   [squoosh.app](https://squoosh.app) is a good free option. Aiming for
   roughly 150–400KB per photo is plenty for a phone screen.

The gallery and memory wall crop photos to fit their frames
(`object-fit: cover`), so you don't need to pre-crop anything.

### Adding your music

See `music/README-ADD-YOUR-SONG-HERE.txt` — short version: drop an MP3
named `background-music.mp3` into the `music/` folder. The play button
on the site stays hidden automatically until it finds a real file, so
nothing looks broken if you deploy before adding one.

Make sure it's a track you own or have the rights to use — a personal
recording, something royalty-free, or a licensed download.

**About autoplay.** The site tries to start music the instant the page
loads, and falls back to starting on the very first tap/click/key press
anywhere if the browser blocks that first attempt — this is a real
browser security policy (every major browser blocks audio-with-sound
before any interaction on a first visit), not something any site can
turn off. In practice this means: for someone opening the link fresh,
music starts the moment they touch the screen at all — most likely
right as they tap "Open My Surprise," since that's the only thing to
interact with on the landing screen.

**Different music per section (optional).** Add more MP3s to `music/`
and list them in `js/config.js` under `music.tracks`:

```js
music: {
  default: { src: "music/background-music.mp3", title: "Our song" },
  tracks: {
    timeline: { src: "music/timeline.mp3", title: "Our story" },
    letter:   { src: "music/letter.mp3",   title: "The letter" },
  },
},
```

As the person scrolls into a section listed in `tracks`, the music
crossfades to that track. Any section left out — or given
`enabled: false` — just keeps whatever track was already playing,
looping, instead of cutting out. Sky's the limit on how many sections
you assign; sections with none just inherit the mood of whatever came
before them.

### Adding a video

See `videos/README-ADD-YOUR-VIDEO-HERE.txt`. You can either embed a
YouTube video (just its ID, nothing to upload) or use a local file.
Nothing autoplays; videos only load once tapped.

### The question gate (right after the timeline)

Right after "Our Story So Far", the site shows a short video and asks a
question with a plain text box to answer in — no multiple choice.
Submitting is what reveals the rest of the page, whatever they type.
There's no "wrong answer" screen and the correct answer is never shown
on screen — it's a fun beat, not a real test.

Everything about it lives in `js/config.js` under `quiz`:

```js
quiz: {
  enabled: true,               // set false to remove this gate entirely
  question: "Where did we first meet?",
  placeholder: "Type your answer here…",
  correctAnswers: ["college", "first day of college"],  // accepted variations
  correctMessage: "...",        // shown ONLY if they match one of the above
  video: { type: "youtube", id: "…" }  // or type: "local", src: "videos/…"
}
```

Matching ignores case, punctuation, and extra spaces, so `"College!"`,
`"college"`, and `"  College "` all count. List a few natural phrasings
in `correctAnswers` so close-enough typing still matches.

If what they typed doesn't match anything in `correctAnswers`, the site
shows no message at all — just the Continue button, so a "wrong" answer
never feels like a wrong answer. Either way, submitting always reveals
the Continue button. Set `enabled: false` if you'd rather skip this and
let the page scroll freely like the rest of the site.

### Videos on individual wishes

Any wish in `wishes.items` can carry its own short video that plays
when it's hovered (desktop) or tapped (mobile) — muted and looping, no
click-to-play needed. A wish with no video assigned just stays plain
text.

```js
wishes: {
  items: [
    "A plain wish with no video \u2014 stays a simple string.",
    {
      text: "A wish with a video attached.",
      video: { type: "youtube", id: "…" }, // or { type: "local", src: "videos/…" }
    },
  ],
}
```

Wishes with a video get a small gold play icon once their typewriter
text finishes — that's the cue that it's interactive.

### Theme colors

Also in `js/config.js`, under `theme`. Six colors control the entire
palette — change any hex value and every gradient, button, and glow
updates to match:

```js
theme: {
  dusk: "#7C93E0",       // soft blue
  lavender: "#B7A4E3",   // lavender / purple
  gold: "#CE9F5C",       // gold accent
  // ...
}
```

---

## 4. Deployment

All three options below are free and need no backend.

### GitHub Pages
1. Create a new GitHub repository and push this folder to it.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`,
   pick your main branch and the `/ (root)` folder, then save.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`
   within a minute or two.

### Netlify
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole `surprise-website` folder onto the page.
3. Netlify gives you a live URL immediately — you can rename it (and add
   a custom domain) from the site settings.

### Vercel
1. Install the CLI: `npm i -g vercel`
2. From inside the `surprise-website` folder, run `vercel`.
3. Follow the prompts (defaults are fine — no framework, no build
   command) and it'll give you a live URL.

---

## 5. Turning the link into a QR code

Once deployed, you'll have a URL like `https://your-site.netlify.app`.
Paste that URL into any free QR generator (a web search for "QR code
generator" turns up several) to get a scannable code — save the image
into `assets/` if you want to keep a copy. Print it, put it on a card,
or text it — scanning it opens the site straight to the landing screen.

---

## 6. Notes

- **No dependencies.** Fonts load from Google Fonts (Fraunces, Manrope,
  Caveat); everything else is plain HTML/CSS/JS.
- **Accessibility.** Keyboard-navigable gallery and lightbox, visible
  focus states, and full support for "reduce motion" system settings.
- **Performance.** Placeholder images are lightweight SVGs, real photos
  lazy-load as you scroll, and the YouTube embed only loads after a tap.
- **Browser support.** Modern versions of Chrome, Safari, Firefox, and
  Edge — desktop and mobile.

Made to be opened, scrolled, and smiled at. Enjoy building it. 🎁
