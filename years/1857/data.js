/**
 * 1857 — the Revolt at Meerut.
 * This is the fully worked template. Copy this folder + its loader HTML
 * to build the other four years (see MAP.md).
 */
export const YEAR_DATA = {
  id: "1857",
  title: "1857 — Meerut Cantonment",

  scene1: {
    video: "./years/1857/videos/scene1.mp4",
    options: [
      { id: "A", tag: "rebel", text: "Join the sepoys marching to overthrow the Company's garrison." },
      { id: "B", tag: "loyalist", text: "Report the unrest to your British commanding officer." },
    ],
  },

  scene2: {
    A: {
      video: "./years/1857/videos/scene2-a.mp4",
      options: [
        { id: "A1", tag: "unify", text: "Urge Bahadur Shah II to lead a unified, coordinated uprising." },
        { id: "A2", tag: "local", text: "Focus only on holding Delhi — coordination can wait." },
      ],
    },
    B: {
      video: "./years/1857/videos/scene2-b.mp4",
      options: [
        { id: "B1", tag: "harsh", text: "Push for swift, harsh reprisals to crush the revolt outright." },
        { id: "B2", tag: "lenient", text: "Argue for negotiated terms to avoid needless bloodshed." },
      ],
    },
  },

  endings: {
    "A-A1": {
      video: "./years/1857/videos/ending-a-a1.mp4",
      aftermath:
        "Word of a unified banner under Bahadur Shah II spreads faster than the Company can respond. The revolt holds longer and costs the British far more to put down — but it is still put down. What outlives the defeat is the idea: for the first time, princely states, sepoys, and peasants fought under one cause. Historians a century later will trace India's national movement back to this fragile, short-lived unity."
    },
    "A-A2": {
      video: "./years/1857/videos/ending-a-a2.mp4",
      aftermath:
        "Without word reaching the other garrisons in time, Delhi's defenders fight alone. The city falls faster than it should have, and the reprisals that follow are brutal. Yet the stories of those who held the walls travel by word of mouth for decades, becoming folk memory long before they become history — scattered sparks that nationalist writers will later gather into a single flame."
    },
    "B-B1": {
      video: "./years/1857/videos/ending-b-b1.mp4",
      aftermath:
        "The revolt is crushed in months, not years. But the harshness of the reprisals shocks even London — Parliament dissolves the East India Company and places India directly under the Crown within a year of the ending, rather than the historical 1858 aftermath being merely a formality. The peace is fast, and it is cold; resentment simply moves underground instead of disappearing."
    },
    "B-B2": {
      video: "./years/1857/videos/ending-b-b2.mp4",
      aftermath:
        "Negotiation buys time and lives. Fewer villages burn, fewer sepoys hang. But mercy is read by the Company's directors as weakness, and colonial administration hardens elsewhere to compensate. The path to full self-rule is no shorter — if anything, a gentler 1857 removes some of the urgency that, in your original timeline, hastened the demand for independence."
    },
  },
};
