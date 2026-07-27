This folder is only needed if you want to use a LOCAL video file
instead of a YouTube link.

1. Add your video here, e.g.:  memory.mp4
   (MP4/H.264 is the safest choice for playing everywhere)
2. In js/config.js, add an entry to video.items:

     { type: "local", src: "videos/memory.mp4",
       poster: "images/video-poster.svg", caption: "Our trip" }

If you'd rather embed a YouTube video, you don't need this folder
at all — just add a "youtube" entry instead. See the example already
commented out in js/config.js under video.items.
