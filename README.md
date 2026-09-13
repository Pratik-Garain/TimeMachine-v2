# TIME MACHINE — GitHub Pages hosting guide

See `MAP.md` for the full folder map, the branching model, and exactly how
the year-page flow works (darkness → blink → 2 scenes → MCQs → ending →
aftermath). This file only covers hosting.

## Hosting on GitHub Pages

**File naming:**

- All lowercase, hyphens instead of spaces or underscores
  (`ending-a-a1.mp4`, not `Ending A A1.mp4`).
- No spaces in any path segment — spaces in URLs get encoded to `%20`
  and are a common source of broken links on Pages.
- Year loader pages live at the **repo root**, named exactly
  `1857.html`, `1914.html`, `1941.html`, `1971.html`, `1999.html`, since
  that's what `destinations.js` links to.
- `index.html` at the root is required — it's what GitHub Pages serves
  at your site's base URL.

**Two files to enable it:**

- `.nojekyll` (empty file, repo root) — stops GitHub's default Jekyll
  build step from running. You don't need Jekyll for a plain static site
  like this, and skipping it avoids Jekyll silently ignoring folders or
  files that start with `_`.
- `README.md` (this file) — not required for Pages to work, but GitHub
  displays it on the repo's main page.

**Turning it on:** push this repo to GitHub, then in the repo go to
**Settings → Pages → Build and deployment → Source: Deploy from a
branch**, pick `main` (or whichever branch) and `/ (root)`, save. Your
site will be live at `https://<username>.github.io/<repo-name>/`.

**Video file size — worth knowing before you push:**

- GitHub hard-blocks any single file over 100 MB.
- GitHub's own guidance recommends keeping files under ~50 MB and repos
  under ~1 GB total; Pages sites are also soft-capped around 1 GB with a
  fair-use bandwidth limit.
- 8-second clips are usually well under this, but 5 years × 7 videos
  each (35 total) adds up fast. If you get close to these limits, either
  compress the MP4s (`ffmpeg -crf 28`), use **Git LFS** for the
  `videos/` folders, or host the videos on an external CDN/bucket and
  point `video:` in each `data.js` at that full `https://` URL instead
  of a local path — the engine doesn't care which.
