// LeetCode User Finder — modern design
// Live profile stats via a public LeetCode API (the original Heroku-hosted
// API shut down; this is a drop-in replacement with the same data).
// The acceptance rate is computed from the submission breakdown because
// the API has no ready-made field for it.
const API_BASE = "https://leetcode-api-faisalshohag.vercel.app";
const RING_CIRCUMFERENCE = 427.3; // 2 * PI * 68 (the SVG ring's radius)

const $ = (id) => document.getElementById(id);
const els = {
  form: $("searchForm"),
  input: $("usernameInput"),
  btn: $("searchBtn"),
  error: $("errorBanner"),
  status: $("statusLine"),
  card: $("resultCard"),
  ring: $("totalRing"),
  totalPercent: $("totalPercent"),
  profileName: $("profileName"),
  totalSolved: $("totalSolved"),
  totalQuestionsText: $("totalQuestionsText"),
  ranking: $("ranking"),
  contribution: $("contribution"),
  reputation: $("reputation"),
  acceptance: $("acceptance"),
  acceptanceBar: $("acceptanceBar"),
  submissions: $("submissions"),
  acceptedCount: $("acceptedCount"),
};

const fmt = (n) => (Number(n) || 0).toLocaleString("en-US");
const pct = (part, total) => (total > 0 ? (part / total) * 100 : 0);

function setDiff(prefix, solved, total) {
  $(prefix + "Solved").textContent = fmt(solved);
  $(prefix + "Total").textContent = fmt(total);
  const p = pct(solved, total);
  $(prefix + "Pct").textContent = p.toFixed(1).replace(/\.0$/, "") + "%";
  $(prefix + "Bar").style.width = p + "%";
}

function render(username, data) {
  const totalPct = pct(data.totalSolved, data.totalQuestions);

  els.profileName.textContent = username;
  els.totalSolved.textContent = fmt(data.totalSolved);
  els.totalQuestionsText.textContent = fmt(data.totalQuestions);
  els.totalPercent.textContent = totalPct.toFixed(1).replace(/\.0$/, "") + "%";
  els.ring.style.strokeDashoffset =
    RING_CIRCUMFERENCE * (1 - Math.min(totalPct, 100) / 100);

  els.ranking.textContent = data.ranking ? "#" + fmt(data.ranking) : "—";
  els.contribution.textContent = fmt(data.contributionPoint);
  els.reputation.textContent = fmt(data.reputation);

  setDiff("easy", data.easySolved, data.totalEasy);
  setDiff("medium", data.mediumSolved, data.totalMedium);
  setDiff("hard", data.hardSolved, data.totalHard);

  // Acceptance rate from the "All" row of totalSubmissions.
  const all = (data.totalSubmissions || []).find(
    (row) => row.difficulty === "All"
  );
  const acceptance = all ? pct(all.count, all.submissions) : 0;
  els.acceptance.textContent = acceptance.toFixed(1) + "%";
  els.acceptanceBar.style.width = acceptance + "%";
  els.submissions.textContent = all ? fmt(all.submissions) : "—";
  els.acceptedCount.textContent = all ? fmt(all.count) : "—";

  els.card.hidden = false;
  els.status.hidden = true;
}

function showError(message) {
  els.error.textContent = message;
  els.error.hidden = false;
}

function setLoading(loading) {
  els.card.classList.toggle("is-loading", loading);
  els.btn.disabled = loading;
  els.btn.textContent = loading ? "Searching…" : "Search";
}

async function search(rawUsername) {
  const username = (rawUsername ?? els.input.value).trim();
  if (!username) {
    showError("Please enter a LeetCode username first.");
    return;
  }
  els.error.hidden = true;
  setLoading(true);
  try {
    const response = await fetch(
      `${API_BASE}/${encodeURIComponent(username)}`
    );
    const data = await response.json();
    if (data.errors || typeof data.totalSolved !== "number") {
      showError(`No LeetCode user found for “${username}”. Check the spelling and try again.`);
      return;
    }
    els.input.value = "";
    render(username, data);
  } catch (err) {
    console.error(err);
    showError("Network error — please check your connection and try again.");
  } finally {
    setLoading(false);
  }
}

/* ---------------- events ---------------- */
els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  search();
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => search(chip.dataset.user));
});

/* ---------------- theme ---------------- */
const rootEl = document.documentElement;
function applyTheme(theme) {
  rootEl.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("luf-theme", theme);
  } catch (e) {
    /* storage unavailable (e.g. file://) — theme just won't persist */
  }
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("luf-theme");
} catch (e) {
  savedTheme = null;
}
applyTheme(
  savedTheme ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark")
);

$("themeToggle").addEventListener("click", () => {
  applyTheme(rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark");
});
