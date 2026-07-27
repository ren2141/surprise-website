/**
 * ============================================================
 *  SURPRISE_CONFIG
 * ============================================================
 *  Every word, photo, and setting on this site is read from
 *  this one object. To personalize the site, you only ever
 *  need to edit THIS file — never index.html or script.js.
 *
 *  Quick map:
 *    friendName   → used anywhere you see {{name}} in the text below
 *    theme        → the site's color palette
 *    music        → background audio track
 *    timeline     → the vertical story of your memories
 *    gallery      → the photo grid
 *    wishes       → typewriter quotes
 *    video        → embedded video memory (YouTube or local file)
 *    funFacts     → "just us" trivia cards
 *    memoryWall   → the tilted photo collage
 *    countdown    → optional birthday / event timer
 *    finalLetter  → the handwritten-style closing letter
 *
 *  See README.md for full step-by-step instructions.
 * ============================================================
 */

const SURPRISE_CONFIG = {

  // The name that replaces every {{name}} placeholder below.
  friendName: "DR. KCR Kaushik",

  meta: {
    pageTitle: "A Surprise For You",
    description: "A little digital gift, made just for you.",
  },

  // ---- Color palette -----------------------------------------------
  // Changing these updates every gradient, button, and glow on the site.
  theme: {
    paper: "#FBF9FF",       // page background
    paperDeep: "#F1ECFB",   // alternate section background
    dusk: "#7C93E0",        // soft blue
    lavender: "#B7A4E3",    // lavender / purple
    plum: "#372C56",        // primary text
    plumSoft: "#6B6288",    // secondary / muted text
    gold: "#CE9F5C",        // gold accent
    goldLight: "#EAD3A0",   // light gold accent
    glow: "#C9B6FF",        // particle + glow color
  },

  // ---- Landing screen -------------------------------------------------
  landing: {
    eyebrow: "A little something for {{name}}",
    heading: "Someone made something special just for you \u2764\uFE0F",
    subheading: "Tap below to begin your surprise.",
    buttonLabel: "Open My Surprise",
  },

  // ---- Background music -------------------------------------------------
  // `default` plays from the very start if a section doesn't have its own
  // track below. Add entries to `tracks` (any section id from `nav`, plus
  // "landing") to change music per section as the person scrolls — leave a
  // section out entirely (or set its enabled to false) and whatever track
  // was already playing just keeps looping through it instead of stopping.
  music: {
    enabled: true,
    // default: { src: "music/Seasons_Bow.mp3", title: "Our song" },
    tracks: {
      landing: { src: "music/Seasons_Bow.mp3",  title: "Opening theme" },
      gallery: { src: "music/Through_The_Tall_Grass.mp3",   title: "The letter" },
      wishes: { src: "music/Through_The_Tall_Grass.mp3",   title: "wall song" },
      wall: { src: "music/Morning_Milestone.mp3",   title: "The letter" },
      final: { src: "music/Beyond_the_Tennis_Shoes.mp3",   title: "HBTY" },
      //timeline: { src: "music/Seasons_Bow.mp3", title: "Our story" },
    },
  },

  // ---- Floating section navigation (desktop/tablet) -------------------
  // Any id without a matching visible section is skipped automatically,
  // so turning countdown.enabled off also removes it from this list.
  nav: [
    { id: "timeline", label: "Memories" },
    { id: "quiz", label: "Question" },
    { id: "gallery", label: "Gallery" },
    { id: "wishes", label: "Wishes" },
    { id: "video", label: "Video" },
    { id: "funfacts", label: "Us" },
    { id: "wall", label: "Wall" },
    { id: "countdown", label: "Countdown" },
    { id: "letter", label: "Letter" },
    { id: "final", label: "Thank You" },
  ],

  // ---- Memory timeline --------------------------------------------------
  timeline: {
    heading: "Our Story So Far",
    subheading: "Every memory, right where it happened.",
    items: [
      {
        photo: "images/Snapchat-2028909414.jpg",
        title: "Where It Started",
        date: "September 2022",
        text: "The first time we met, It was just random Blued interaction but we never knew it will lead to this.",
      },
      {
        photo: "images/Snapchat-964811325.jpg",
        title: "lets be frineds in snapchat",
        date: "October 2022",
        text: "This is the memory that made us actual friends, not just acquaintances. Swap in the moment that still makes you both laugh.",
      },
      {
        photo: "images/Snapchat-1501571499.jpg",
        title: "The long Break",
        date: "March 2023",
        text: "You desupiered as you came just left without saying anything, but you came back after exams and we started talking again.",
      },
      {
        photo: "images/Snapchat-1273364708.jpg",
        title: "The First meeting",
        date: "April 2023",
        text: "The visit to the temple and the conversation we had made us realize this friendship was for keeps. Tell it here.",
      },
      {
        photo: "images/IMG20230618200847.jpg",
        title: "Celebrating Together",
        date: "June 2023",
        text: "Our 1st visit to festa the level of nerveousness and excitement we had was unmatched, and the memories we made that day are still fresh in our minds.",
      },
      {
        photo: "images/IMG20240401003414_BURST004.jpg",
        title: "Birthday Together",
        date: "April 2024",
        text: "Birthday i celebrated with you, the joy and happiness we shared that day was unmatched, and the memories we made that day are still fresh in my minds.",
      },
      {
        photo: "images/IMG20240609194742.jpg",
        title: "Celebrating Together Two",
        date: "June 2024",
        text: "Lets be honest second time is the best time we had and you are being ganged by your friends and you are being forced to dance",
      },
      {
        photo: "images/IMG20240630185934.jpg",
        title: "Clubbing Together",
        date: "July 2024",
        text: "Lets not forget the time we spent together in the club, dancing and enjoying the music. It was a night to remember.",
      },
      {
        photo: "images/IMG20241008135223.jpg",
        title: "The one day trip together",
        date: "October 2024",
        text: "Did you remember the kick from monkey you got, and the strugle we have back on those steps with heat",
      },
    ],
  },

  // ---- Video + question (must be answered to unlock the rest of the site) --
  // Either answer — right or wrong — unlocks the Continue button below the
  // feedback message, so no one gets stuck. Set enabled to false to remove
  // this whole gate and leave the site freely scrollable, like before.
  quiz: {
    enabled: true,
    heading: "One Quick Question\u2026",
    subheading: "Just a little memory check.",
    video: {
      // type: "youtube" (needs id) or "local" (needs src). Leave id/src
      // empty to hide the video and show only the question.
      type: "local",
      id: "",
      src: "videos/97334e37ff507bcb67d101a2001a4ef2.mp4",
      poster: "images/video-poster.svg",
    },
    question: "What are searching for in this video?",
    placeholder: "Type your answer\u2026",
    submitLabel: "Submit",
    // Accepted answers — list a few natural phrasings so close-enough
    // typing still counts. Matching ignores case, punctuation, and
    // extra spaces, so "College!" and "college" both match "college".
    correctAnswers: ["Condom", "condom", "Condoms", "condoms"],
    // Shown only if they get it right. Wrong answers show no message
    // and no reveal of the correct one \u2014 just a Continue button.
    correctMessage: "Yes! Exactly right \u2014 I'm impressed you remembered that.",
    continueLabel: "Lol..! Lets continue \u2192",
  },

  // ---- Photo gallery (masonry grid) --------------------------------------
  gallery: {
    heading: "A Few Favorite Moments",
    subheading: "Tap any photo to see it up close.",
    items: [
      { src: "images/IMG_1233.CR3.jpg", alt: "Bavagaruuuu" },
      { src: "images/IMG-20231205-WA0003.jpg", alt: "" },
      { src: "images/IMG-20240117-WA0010.jpg", alt: "Strong Together" },
      { src: "images/IMG-20250722-WA0030.jpg", alt: "Baby's Day out" },
      { src: "images/IMG-20250719-WA0011.jpg", alt: "Curies Together" },
      { src: "images/IMG-20260419-WA0066.jpg", alt: "Cheers" },
      { src: "images/Snapchat-255176589.jpg", alt: "Trip" },
      { src: "images/Snapchat-465701963.jpg", alt: "" },
      { src: "images/IMG_20240326_175947_070.jpg", alt: "Doctor's Day Out" },
      { src: "images/IMG-20240217-WA0003.jpg", alt: "Friends for ever" },
      { src: "images/IMG_20210214_212257_746.jpg", alt: "Cafe Hopping" },
      { src: "images/IMG_20210113_105725.jpg", alt: "Knight's Together" },
      { src: "images/IMG20230515183848.jpg", alt: "ISKCON" },
      { src: "images/Snapchat-576882958.jpg", alt: "Family Boy" },
    ],
  },

  // ---- Wishes (typewriter quotes) ----------------------------------------
  wishes: {
    heading: "A Few Wishes For You",
    // Each wish is either a plain string, or an object with a video that
    // plays when this wish is hovered (desktop) or tapped (mobile) —
    // muted and looping, no click needed. Leave video out for a wish
    // with no video; hovering those does nothing.
    items: [
      {
        text: "May this year bring you exactly what you've been hoping for.",
        video: { type: "local", src: "videos/VID-20240217-WA0035.mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
      {
        text: "Never stop laughing at your own jokes \u2014 they're the best ones.",
        video: { type: "local", src: "videos/Snapchat-721147245.mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
      {
        text: "I hope you know how loved you are, today and every day.",
        video: { type: "local", src: "videos/Snapchat-2067897610 - Trim.mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
      {
        text: "Here's to more adventures, more memories, and more us.",
        video: { type: "local", src: "videos/Snapchat-379340707~2.mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
      {
        text: "Thank you for being exactly who you are. Don't ever change that.",
        video: { type: "local", src: "videos/Snapchat-1606518857.mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
      {
        text: "You have this rare and amazing ability to make everyone around you feel special.",
        video: { type: "local", src: "videos/Snapchat-1832982400.mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
      {
        text: "I am constantly in awe of your strength, your spirit, and your kind heart.",
        video: { type: "local", src: "videos/Snapchat-360987251.mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
      {
        text: "Never lose that spark that makes you, you—even the slightly chaotic parts.",
        video: { type: "local", src: "videos/VID-20231202-WA0010(1).mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
      {
        text: "Here is to celebrating you today, tomorrow, and long after the party is over.",
        video: { type: "local", src: "videos/VID-20250310-WA0000.mp4" }, // add a YouTube id, or use { type: "local", src: "videos/…" }
      },
    ],
  },

  // ---- Video memory ---------------------------------------------------
  // type: "youtube" (needs id) or "local" (needs src, an mp4 in /videos).
  // Leave items as [] to show a friendly "add a video" placeholder instead.
  video: {
    heading: "One More Memory",
    subheading: "Tap to play \u2014 nothing autoplays.",
    items: [
      // Example once you have a real video:
      // { type: "youtube", id: "dQw4w9WgXcQ", caption: "That night out" },
      { type: "local", src: "videos/VID_20240106_215109771.mp4", poster: "images/video-poster.svg", caption: "Your trip to Hospital" },
    ],
  },

  // ---- Fun facts grid -------------------------------------------------
  funFacts: {
    heading: "Just Us",
    items: [
      { icon: "\uD83D\uDC4B", label: "First Meeting", value: "Trust me my first opinion on you when I first saw you is 'He is damn CUTE'." },
      { icon: "\uD83D\uDE02", label: "Funniest Memory", value: "Lets be honest, the day out clubbing night got canclled due to rain we've had our fair share of laughs!" },
      { icon: "\uD83C\uDF7D\uFE0F", label: "Favorite Food", value: "We are soo different but i'll always prefer your pallet for ordering food" },
      { icon: "\uD83E\uDDCF", label: "Best Time Together", value: "For me Sleep Overs are the best" },
      { icon: "\u2728", label: "Nickname", value: "Youll be always be my 'Rodnoy💙'" },
      { icon: "\uD83C\uDFAF", label: "Shared Hobby", value: "The only thing we have in common 'Watching Anime'" },
    ],
  },

  // ---- Memory wall (tilted photo collage) --------------------------------
  memoryWall: {
    heading: "The Memory Wall",
    subheading: "A little collage, just because.",
    items: [
      { src: "images/IMG_1231.CR3.jpg", alt: "Mr. Handsome" },
      { src: "images/IMG-20230730-WA0293.jpg", alt: "YoYo Boy" },
      { src: "images/IMG_20210114_120722.jpg", alt: "Pink Boy" },
      { src: "images/IMG-20240210-WA0002.jpg", alt: "Rock Boy" },
      { src: "images/IMG-20240409-WA0017.jpg", alt: "Sampradhaeni Suppini" },
      { src: "images/IMG-20240405-WA0019.jpg", alt: "Old Money" },
      { src: "images/IMG-20251123-WA0000.jpg", alt: "Fit Check" },
      { src: "images/IMG-20240114-WA0007.jpg", alt: "Hands UP" },
      { src: "images/IMG-20250216-WA0011.jpg", alt: "Sun Kissed" },
      { src: "images/IMG-20250413-WA0002.jpg", alt: "Devotional" },
      { src: "images/IMG-20260203-WA0012.jpg", alt: "Star Boy" },
      { src: "images/IMG_20240214_131037_733.jpg", alt: "Hapyyyyyy....!" },
      { src: "images/IMG-20240203-WA0010.jpg", alt: "Rememberr how hard your studies are" },
      { src: "images/IMG-20251226-WA0004.jpg", alt: "Why not you Favorite" },
      { src: "images/IMG_20231208_231103_361.jpg", alt: "Soo damn Kissable" },
      { src: "images/IMG-20240108-WA0000.jpg", alt: "2 KGs" },
      { src: "images/IMG-20250420-WA0027.jpg", alt: "Mr. Crack-Head" },
      { src: "images/IMG-20260203-WA0019.jpg", alt: "Mr. Cool" },
      { src: "images/IMG-20260203-WA0008.jpg", alt: "Hey handsone Hey handsome" },
      { src: "images/IMG-20260523-WA0004.jpg", alt: "Divine" },
      { src: "images/IMG-20251020-WA0024.jpg", alt: "A Smile that lights up the room" },
      { src: "images/Snapchat-86996674.jpg", alt: "Sleeping Beauty" },
      { src: "images/IMG-20260317-WA0068.jpg", alt: "Clearly Flowers Lossed" },
      { src: "images/Screenshot_2023.jpg", alt: "Finally you have some one" },
    ],
  },

  // ---- Countdown (optional) ----------------------------------------------
  // Set enabled to false to remove this section (and its nav dot) entirely.
  countdown: {
    enabled: false,
    heading: "Counting Down To\u2026",
    label: "{{name}}'s Birthday",
    targetDate: "2026-09-14T00:00:00",
  },

  // ---- Celebration moment (confetti / fireworks / hearts trigger) -------
  celebration: {
    heading: "A Little Celebration \uD83C\uDF89",
    subheading: "Because you deserve one too.",
  },

  // ---- Final handwritten letter -------------------------------------------
  finalLetter: {
    heading: "One Last Thing\u2026",
    paragraphs: [
      "Thank you for being part of my life.",
      "Every memory we've shared means the world to me.",
      "I hope this little surprise makes you smile.",
      "Wishing you endless happiness and unforgettable moments.",
      "\u2764\uFE0F",
    ],
    signature: "\u2014 With love",
  },

  // ---- Final screen -----------------------------------------------------
  final: {
    heading: "\uD83C\uDF89 Happy Birth Day to You \uD83C\uDF89",
    subheading: "Made with love just for you.",
    footerNote: "Made with \u2764\uFE0F for {{name}}.",
  },
};
