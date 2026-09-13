# TIME MACHINE — year pages: folder map

## Where everything lives

```
project root/
├── index.html                 ← cockpit homepage (unchanged)
├── vr-viewer.html              ← standalone tool: drop in any raw clip to eyeball it
│                                  before wiring it into a year. NOT used by the
│                                  year pages themselves (see "Why two viewers" below).
├── 1857.html                  ← thin loader page for 1857 (fully worked example)
├── 1914.html / 1941.html / 1971.html / 1999.html  ← stub loaders, TODO content
│
├── shared/
│   ├── year-engine.js          ← drives darkness → blink → 2 scenes → MCQs → ending
│   └── year.css                ← all visual styling for year pages (sepia/historical)
│
└── years/
    └── 1857/
        ├── data.js             ← scene prompts, MCQ options, endings, aftermath text
        └── videos/             ← this year's 7 video files go here
            ├── scene1.mp4
            ├── scene2-a.mp4
            ├── scene2-b.mp4
            ├── ending-a-a1.mp4
            ├── ending-a-a2.mp4
            ├── ending-b-b1.mp4
            └── ending-b-b2.mp4
```

`src/config/destinations.js` points each year button at `./1857.html`,
`./1914.html`, etc. — nothing else needs to change when adding a year.

## Why two viewers, not one

`vr-viewer.html` is your file-picker tool for previewing a raw 8s clip from
Flow before it's wired into a story — full manual dock (play/pause, stereo
format, recenter, VR mode). It's for YOU, at your desk.

`shared/year-engine.js` has its own minimal 360-video renderer built in —
same math, but with none of that manual UI. It plays automatically, with
sound, and the only control it ever shows is "Return to Time Machine". These
two are deliberately separate: reusing `vr-viewer.html` itself for the game
flow (e.g. via an iframe) would fight browser autoplay-with-sound rules,
since the click that "unlocks" audio has to happen in the same document
that owns the `<video>` element.

## The branching model (per year, 2 scenes)

- **Scene 1**: one fixed video, then 2 MCQ options.
- **Scene 2**: **2 different videos** — which one plays depends on your
  Scene-1 choice. Each has its own 2 MCQ options.
- **Ending**: **4 videos** — one for every exact combination of your two
  choices (`A-A1`, `A-A2`, `B-B1`, `B-B2`). Each ending carries its own
  aftermath paragraph, shown as text once the ending video finishes.

That's **7 video files per year** (1 + 2 + 4) → **35 total across 5 years**.

`years/<year>/data.js` is the only file with year-specific content:
`scene1.options` (2 entries, each with an `id`), `scene2.<scene1-option-id>`
(each with its own video + 2 options), and `endings["<id1>-<id2>"]` (video +
aftermath text) for all 4 combinations.

## The on-page flow, exactly as built

1. Page loads → **2s of darkness**.
2. **3 blinks** (eyelids close/open three times).
3. Scene 1 video plays automatically, unmuted, once, full screen. Only
   look-around (drag / gyro) and the "Return to Time Machine" button work —
   nothing else.
4. Video ends → it pauses on the last frame → 2 MCQ options slide in.
5. Your pick loads and plays the matching Scene 2 video the same way.
6. Same pattern for the ending video.
7. Ending video finishes → the video fades out and the aftermath paragraph
   for your exact path is shown, with a "Return to Time Machine" button.

**Sound-autoplay note:** browsers sometimes block autoplay with sound even
right after a click on the *previous* page. If that happens, a one-time
"Tap to Step Through Time" prompt appears before that video (only once per
page load, never again for Scene 2 or the ending) — this isn't a manual
playback control, just a one-time consent tap some browsers require.

## Testing before your videos exist

Serve the folder with a real HTTP server (ES module imports don't work over
`file://`):

```
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Any missing video file shows an on-screen notice with a "Continue anyway"
button, so you can validate the whole branching/MCQ flow before a single
clip is rendered.

## Copy-pasting this setup for the other 4 years

For each of 1914 / 1941 / 1971 / 1999 (stub loaders + placeholder `data.js`
already exist at the paths above):

1. Open `years/<year>/data.js` and replace every `"TODO"` — the 2 scenes'
   `video` paths, `options` text, and the 4 `endings[...].aftermath` texts.
2. Drop that year's 7 rendered clips into `years/<year>/videos/` using the
   exact filenames already referenced in `data.js`.
3. Nothing else needs touching — `destinations.js` already links to
   `./<year>.html`, and the loader HTML already imports the right
   `data.js`.

You never need to touch `shared/year-engine.js` or `shared/year.css` for a
new year — only if you want to change the shared flow/theme for all 5 at
once (e.g. change blink timing, darkness duration, or the color palette).
