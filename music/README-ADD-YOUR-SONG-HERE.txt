Add your background music here.

BASIC (one song for the whole site):
1. Find an MP3 you have the rights to use (a song you own, or a
   royalty-free track — see README.md at the project root for ideas).
2. Rename it to:  background-music.mp3
3. Drop it in this folder. That's the file js/config.js -> music.default
   points to by default.

DIFFERENT MUSIC PER SECTION (optional):
Add more MP3s here (e.g. timeline.mp3, letter.mp3), then in
js/config.js add matching entries under music.tracks, e.g.:

  tracks: {
    timeline: { src: "music/timeline.mp3", title: "Our story" },
    letter:   { src: "music/letter.mp3",   title: "The letter" },
  }

As the person scrolls into a section with its own entry, the music
crossfades to it. Any section you *don't* list just keeps whichever
track was already playing, looping — nothing ever cuts out. You can
also add enabled: false to a track entry to switch it off temporarily
without deleting it; that section will behave as if it were never
listed.

Either way, the play/pause button stays hidden until a real audio
file is found, so nothing looks broken if you haven't added music yet.
Reload the page after adding files.
