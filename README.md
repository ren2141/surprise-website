# ⏳ Countdown Redirect System (Option 2)

This project uses a **Countdown → Automatic Redirect** approach to create a timed surprise experience.

## How It Works

1. The QR code points to the repository's root URL.
2. Visitors first see a countdown page.
3. The countdown continuously checks the current date and time.
4. When the configured release date and time is reached, the page automatically redirects to the actual surprise website.

## Folder Structure

```text
/
├── index.html          # Countdown page
├── countdown.css       # Countdown styles
├── countdown.js        # Countdown logic
│
└── surprise/
    ├── index.html      # Main surprise website
    ├── css/
    ├── js/
    ├── assets/
    └── ...
```

## Redirect Flow

```text
QR Code
   │
   ▼
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
   │
   ▼
Countdown Page
   │
   ├── Before release time
   │       │
   │       └── Display live countdown
   │
   └── After release time
           │
           ▼
Automatically redirect to

https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/surprise/
```

## Configure the Release Time

Open **countdown.js** and update the release date:

```javascript
const releaseDate = new Date("2026-07-27T23:58:00+05:30");
```

Use the following format:

```javascript
YYYY-MM-DDTHH:MM:SS+05:30
```

Example:

```javascript
const releaseDate = new Date("2026-12-25T00:00:00+05:30");
```

## Redirect Code

When the countdown reaches zero, the following code runs:

```javascript
window.location.href = "surprise/";
```

This automatically opens the Memory Journey website.

## Notes

* The countdown updates every second.
* No manual refresh is required.
* The redirect happens automatically when the target date and time is reached.
* This solution works perfectly with GitHub Pages because it requires only HTML, CSS, and JavaScript.

## Limitation

GitHub Pages is a **static hosting service**. The countdown page prevents normal visitors from seeing the surprise early, but anyone who already knows the direct URL to the `/surprise/` folder could still access it before the release time.

If you need to completely prevent early access, you'll need a hosting platform that supports server-side logic (such as Cloudflare Workers, Netlify Functions, or Vercel Functions).

## Best Use Cases

* 🎂 Birthday surprises
* ❤️ Anniversary gifts
* 🎉 Proposal websites
* 🎓 Graduation memories
* 🎄 Holiday greetings
* 🎁 QR code surprise experiences
