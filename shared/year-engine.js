/**
 * TIME MACHINE — shared year-page engine
 *
 * Drives the entire in-page cinematic flow for a single year:
 *   2s darkness -> 3 blinks -> Scene 1 video (auto, full sound) -> pause -> MCQ
 *   -> Scene 2 video (depends on Scene-1 choice) -> pause -> MCQ
 *   -> Ending video (depends on the exact 2-choice combo) -> Aftermath paragraph
 *
 * The ONLY control ever shown during video playback is "Return to Time Machine".
 * There is no play/pause, no stereo/format toggle, no recenter, no scrubber.
 *
 * Per-year content (video paths, option text, endings, aftermath copy) lives
 * entirely in years/<year>/data.js — this file never changes when you add a
 * new year or rewrite a year's story.
 */
import * as THREE from "three";

const DARKNESS_MS = 2000;
const BLINK_COUNT = 3;
const BLINK_CLOSE_MS = 220;
const BLINK_HOLD_MS = 90;
const BLINK_OPEN_MS = 220;

export function runYear(yearData, opts = {}) {
  const homeUrl = opts.homeUrl || "./index.html";

  const root = document.createElement("div");
  root.className = "yy-root";
  root.innerHTML = `
    <div class="yy-stage" id="yyStage"></div>
    <div class="yy-darkness" id="yyDarkness"></div>
    <div class="yy-eyelid yy-eyelid-top" id="yyLidTop"></div>
    <div class="yy-eyelid yy-eyelid-bottom" id="yyLidBottom"></div>
    <div class="yy-scene-label" id="yySceneLabel"></div>
    <button class="yy-return" id="yyReturn" type="button">&larr; Return to Time Machine</button>

    <div class="yy-tapgate" id="yyTapgate">
      <div class="yy-tapgate-card">
        <p>${escapeHtml(yearData.title || yearData.id)}</p>
        <button id="yyTapBtn" type="button">Tap to Step Through Time</button>
      </div>
    </div>

    <div class="yy-mcq" id="yyMcq"></div>

    <div class="yy-missing" id="yyMissing">
      <div class="yy-missing-card">
        <p id="yyMissingText"></p>
        <button id="yyMissingContinue" type="button">Continue anyway</button>
      </div>
    </div>

    <div class="yy-aftermath" id="yyAftermath">
      <div class="yy-aftermath-card">
        <h2>${escapeHtml(yearData.title || yearData.id)} — Aftermath</h2>
        <p id="yyAftermathText"></p>
        <button id="yyAftermathReturn" type="button">Return to Time Machine</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const $ = (id) => root.querySelector("#" + id);
  const stageEl = $("yyStage");
  const darknessEl = $("yyDarkness");
  const lidTop = $("yyLidTop");
  const lidBottom = $("yyLidBottom");
  const sceneLabel = $("yySceneLabel");
  const returnBtn = $("yyReturn");
  const tapgate = $("yyTapgate");
  const tapBtn = $("yyTapBtn");
  const mcqEl = $("yyMcq");
  const missingEl = $("yyMissing");
  const missingText = $("yyMissingText");
  const missingContinue = $("yyMissingContinue");
  const aftermathEl = $("yyAftermath");
  const aftermathText = $("yyAftermathText");
  const aftermathReturn = $("yyAftermathReturn");

  function goHome() {
    window.location.href = homeUrl;
  }
  returnBtn.addEventListener("click", goHome);
  aftermathReturn.addEventListener("click", goHome);

  const player = createPanoramaPlayer(stageEl);

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function checkVideoExists(url) {
    return fetch(url, { method: "HEAD" })
      .then((r) => r.ok)
      .catch(() => false);
  }

  function showTapGate() {
    return new Promise((res) => {
      tapgate.classList.add("show");
      tapBtn.onclick = () => {
        tapgate.classList.remove("show");
        res();
      };
    });
  }

  function showMissing(url) {
    return new Promise((res) => {
      missingText.textContent = `Video not found yet: ${url}`;
      missingEl.classList.add("show");
      missingContinue.onclick = () => {
        missingEl.classList.remove("show");
        res();
      };
    });
  }

  function showMcq(options) {
    return new Promise((res) => {
      mcqEl.innerHTML = options
        .map((o, i) => `<button class="yy-mcq-btn" data-i="${i}">${escapeHtml(o.text)}</button>`)
        .join("");
      mcqEl.classList.add("show");
      Array.from(mcqEl.querySelectorAll(".yy-mcq-btn")).forEach((btn) => {
        btn.addEventListener(
          "click",
          () => {
            mcqEl.classList.remove("show");
            mcqEl.innerHTML = "";
            res(options[Number(btn.dataset.i)]);
          },
          { once: true },
        );
      });
    });
  }

  async function playVideoStep(url) {
    const exists = await checkVideoExists(url);
    if (!exists) await showMissing(url);

    await player.load(url);
    const ended = new Promise((res) => player.onEnded(res));
    const playedWithSound = await player.play({ muted: false });
    if (!playedWithSound) {
      await showTapGate();
      player.unmute();
    }
    await ended;
    player.pause();
  }

  function blink() {
    return new Promise(async (res) => {
      for (let i = 0; i < BLINK_COUNT; i++) {
        lidTop.classList.add("closed");
        lidBottom.classList.add("closed");
        await wait(BLINK_CLOSE_MS + BLINK_HOLD_MS);
        lidTop.classList.remove("closed");
        lidBottom.classList.remove("closed");
        await wait(BLINK_OPEN_MS);
      }
      res();
    });
  }

  async function sequence() {
    darknessEl.classList.add("show");
    await wait(DARKNESS_MS);
    await blink();
    darknessEl.classList.remove("show");

    sceneLabel.textContent = "SCENE 1 OF 2";
    sceneLabel.style.display = "block";
    await playVideoStep(yearData.scene1.video);
    const choice1 = await showMcq(yearData.scene1.options);

    const scene2 = yearData.scene2[choice1.id];
    sceneLabel.textContent = "SCENE 2 OF 2";
    await playVideoStep(scene2.video);
    const choice2 = await showMcq(scene2.options);

    sceneLabel.style.display = "none";
    const key = `${choice1.id}-${choice2.id}`;
    const ending = yearData.endings[key] || yearData.endings.default;
    await playVideoStep(ending.video);

    aftermathText.textContent = ending.aftermath;
    aftermathEl.classList.add("show");
  }

  sequence();
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/* ---------------- minimal equirectangular-video sphere viewer ----------------
 * Look-around only (pointer drag). No dock, no play/pause, no stereo/format,
 * no recenter, no VR button — by design, per the spec for the year flow.
 */
function createPanoramaPlayer(mountEl) {
  let W = mountEl.clientWidth || window.innerWidth;
  let H = mountEl.clientHeight || window.innerHeight;
  let lon = 0,
    lat = 0;
  let dragging = false,
    startX = 0,
    startY = 0,
    lonStart = 0,
    latStart = 0;
  let texture = null;
  let sphere = null;
  let endedCb = null;

  const video = document.createElement("video");
  video.loop = false;
  video.playsInline = true;
  video.setAttribute("webkit-playsinline", "");
  video.crossOrigin = "anonymous";
  video.style.display = "none";
  document.body.appendChild(video);
  video.addEventListener("ended", () => {
    if (endedCb) endedCb();
  });

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  mountEl.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(80, W / H, 0.1, 1000);

  window.addEventListener("resize", () => {
    W = mountEl.clientWidth || window.innerWidth;
    H = mountEl.clientHeight || window.innerHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  });

  renderer.domElement.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    lonStart = lon;
    latStart = lat;
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    lon = lonStart - (e.clientX - startX) * 0.18;
    lat = Math.max(-85, Math.min(85, latStart + (e.clientY - startY) * 0.18));
  });
  window.addEventListener("pointerup", () => (dragging = false));

  function animate() {
    requestAnimationFrame(animate);
    if (texture) texture.needsUpdate = true;
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);
    camera.position.set(0, 0, 0);
    camera.lookAt(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta),
    );
    renderer.render(scene, camera);
  }
  animate();

  function buildSphereIfNeeded() {
    if (sphere) return;
    const geo = new THREE.SphereGeometry(500, 60, 40);
    geo.scale(-1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);
  }

  return {
    load(url) {
      return new Promise((resolve, reject) => {
        video.pause();
        video.removeAttribute("src");
        video.src = url;
        video.currentTime = 0;
        const onLoaded = () => {
          video.removeEventListener("loadeddata", onLoaded);
          if (!texture) texture = new THREE.VideoTexture(video);
          buildSphereIfNeeded();
          sphere.material.map = texture;
          resolve();
        };
        video.addEventListener("loadeddata", onLoaded, { once: true });
        video.addEventListener("error", () => reject(new Error("video load error")), { once: true });
        video.load();
      });
    },
    play({ muted = false } = {}) {
      video.muted = muted;
      return video
        .play()
        .then(() => !video.muted)
        .catch(() => {
          video.muted = true;
          return video
            .play()
            .then(() => false)
            .catch(() => false);
        });
    },
    unmute() {
      video.muted = false;
    },
    pause() {
      video.pause();
    },
    onEnded(cb) {
      endedCb = cb;
    },
  };
}
