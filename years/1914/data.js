/**
 * 1914 — TODO: replace every placeholder below.
 * Copied from years/1857/ — see MAP.md for the full walkthrough.
 */
export const YEAR_DATA = {
  id: "1914",
  title: "1914",

  scene1: {
    video: "./years/1914/videos/scene1.mp4",
    options: [
      { id: "A", tag: "TODO", text: "TODO: option A shown after scene 1" },
      { id: "B", tag: "TODO", text: "TODO: option B shown after scene 1" },
    ],
  },

  scene2: {
    A: {
      video: "./years/1914/videos/scene2-a.mp4",
      options: [
        { id: "A1", tag: "TODO", text: "TODO: option A1 shown after scene 2 (path A)" },
        { id: "A2", tag: "TODO", text: "TODO: option A2 shown after scene 2 (path A)" },
      ],
    },
    B: {
      video: "./years/1914/videos/scene2-b.mp4",
      options: [
        { id: "B1", tag: "TODO", text: "TODO: option B1 shown after scene 2 (path B)" },
        { id: "B2", tag: "TODO", text: "TODO: option B2 shown after scene 2 (path B)" },
      ],
    },
  },

  endings: {
    "A-A1": { video: "./years/1914/videos/ending-a-a1.mp4", aftermath: "TODO: aftermath paragraph for A-A1." },
    "A-A2": { video: "./years/1914/videos/ending-a-a2.mp4", aftermath: "TODO: aftermath paragraph for A-A2." },
    "B-B1": { video: "./years/1914/videos/ending-b-b1.mp4", aftermath: "TODO: aftermath paragraph for B-B1." },
    "B-B2": { video: "./years/1914/videos/ending-b-b2.mp4", aftermath: "TODO: aftermath paragraph for B-B2." },
  },
};
