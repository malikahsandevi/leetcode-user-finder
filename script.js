// LeetCode User Finder — profile stats for any LeetCode username.
// Data API: see API_BASE in the search section below (the original
// Heroku-hosted API shut down; a drop-in replacement is used instead).
let modeicon = document.querySelector(".darkmood .bx");
let errormsg = document.querySelector(".errormsg");
const root = document.documentElement;

function setnight() {
  modeicon.classList.remove("bxs-moon");
  modeicon.classList.add("bx-moon");
}

function setday() {
  modeicon.classList.remove("bx-moon");
  modeicon.classList.add("bxs-moon");
}

function seterror(massage) {
  errormsg.innerText = massage;
  errormsg.style.display = "flex";
  setTimeout(() => {
    errormsg.style.display = "none";
  }, 4000);
}
function resetuser() {
  document.querySelector(".username").innerText = `Find A User Details Now👋`;
}
function setdark() {
  root.style.setProperty("--sc1", "#211e1e");
  root.style.setProperty("--sc2", "#363333");
  root.style.setProperty("--sc3", "#4c4949");
  root.style.setProperty("--sc4", "#636060");
  root.style.setProperty("--sc5", "#7b7979");
  root.style.setProperty("--sc6", "#949292");

  root.style.setProperty("--pr1", "#ffa200");
  root.style.setProperty("--pr2", "#ffac34");
  root.style.setProperty("--pr3", "#ffb652");
  root.style.setProperty("--pr4", "#ffc16b");
  root.style.setProperty("--pr5", "#ffcb84");
  root.style.setProperty("--pr6", "#ffd59d");
}
function setlight() {
  root.style.setProperty("--pr1", "#282A35");
  root.style.setProperty("--pr2", "#282A35");
  root.style.setProperty("--pr3", "#282A35");
  root.style.setProperty("--pr4", "#000");
  root.style.setProperty("--pr5", "#282A35");
  root.style.setProperty("--pr6", "#000000");

  root.style.setProperty("--sc1", "#fff");
  root.style.setProperty("--sc2", "#E7E9EB");
  root.style.setProperty("--sc3", "#E7E9EB");
  root.style.setProperty("--sc4", "#E7E9EB");
  root.style.setProperty("--sc5", "#282A35");
  root.style.setProperty("--sc6", "#282A35");
}

function setpi(selector, setcolor, deg) {
  document.querySelector(selector).style = `
  background: radial-gradient(
    circle at 50% 50%,
      var(--sc1) 64%,
      transparent 65%,
      transparent 70%,
      var(--sc3) 71%,
      var(--sc3) 100%
   ),
   conic-gradient(
     from 210deg at 50% 50%,
     ${setcolor} ${deg * 3}deg /* mutilpe of 3deg to 1% ....*/,
     white 0deg,
     white 300deg,
     gray 10deg
   );
 `;
}

function setvalue(obt, total, selector) {
  let setcolor = "";
  if (selector == ".easypi") {
    setcolor = "green";
  } else if (selector == ".mediumpi") {
    setcolor = "blue";
  } else if (selector == ".hardpi") {
    setcolor = "red";
  } else {
    setcolor = "var(--pr1)";
  }

  let deg = 0;
  if (obt != 0 && total != 0) {
    deg = Math.floor((obt / total) * 100);
    if (deg == 100) {
      deg = 99;
    }
    if (deg < 10) {
      deg = "0" + deg;
      document.querySelector(selector).children[0].innerText = deg;
    } else {
      document.querySelector(selector).children[0].innerText = deg;
    }
  } else {
    document.querySelector(selector).children[0].innerText = "00";
  }

  let cal = obt + " / " + total;
  document.querySelector(selector).nextElementSibling.innerText = cal;

  setpi(selector, setcolor, deg);
}

function setper(value, selector) {
  let deg = Math.floor(value);
  let setcolor = "var(--pr1)";

  setpi(selector, setcolor, deg);

  if (deg == 100) {
    deg = 99;
  }
  if (deg < 10) {
    deg = "0" + deg;
    document.querySelector(selector).children[0].innerText = deg;
  } else {
    document.querySelector(selector).children[0].innerText = deg;
  }
}

function reset() {
  setvalue(0, 0, ".easypi");
  setvalue(0, 0, ".mediumpi");
  setvalue(0, 0, ".hardpi");
  setvalue(0, 0, ".solvepi");
  setper(0, ".accratepi");
  setper(0, ".repupi");
}

const API_BASE = "https://leetcode-api-faisalshohag.vercel.app";

let user = document.querySelector(".search");
let search = document.querySelector(".searchicon");

function setrep(value) {
  // Reputation is a plain score, not a percentage: show the number itself
  // and fill the ring proportionally (capped so big scores stay readable).
  let num = Number(value) || 0;
  document.querySelector(".repupi").children[0].innerText =
    num.toLocaleString("en-US");
  let deg = num >= 100 ? 99 : Math.floor(num);
  setpi(".repupi", "var(--pr1)", deg);
}

async function findUser() {
  let finduser = user.value.trim();

  if (!finduser) {
    seterror("Error ⚠️ : Please Enter Username 😡");
    reset();
    resetuser();
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/${encodeURIComponent(finduser)}`
    );
    const data = await response.json();

    if (data.errors || typeof data.totalSolved !== "number") {
      seterror("Error ⚠️ : User Not Found 😌");
      reset();
      resetuser();
      return;
    }

    document.querySelector(".username").innerText = `Welcome ${finduser} 👋`;
    setvalue(data.easySolved, data.totalEasy, ".easypi");
    setvalue(data.mediumSolved, data.totalMedium, ".mediumpi");
    setvalue(data.hardSolved, data.totalHard, ".hardpi");
    setvalue(data.totalSolved, data.totalQuestions, ".solvepi");

    // This API has no ready-made acceptance rate, so compute it from the
    // "All" row of totalSubmissions (accepted / total submissions).
    let all = (data.totalSubmissions || []).find(
      (row) => row.difficulty === "All"
    );
    let acceptance =
      all && all.submissions > 0 ? (all.count / all.submissions) * 100 : 0;
    setper(acceptance, ".accratepi");

    setrep(data.reputation);
  } catch (error) {
    console.error(error);
    seterror("Error ⚠️ : Could not load data — please try again.");
    reset();
    resetuser();
  }
}

search.addEventListener("click", findUser);
user.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    findUser();
  }
});

if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  setlight();
  setday();
} else {
  setdark();
  setnight();
}

let theme = window.matchMedia("(prefers-color-scheme: light)").matches;
document.querySelector(".darkmood").addEventListener("click", () => {
  if (theme) {
    setdark();
    setnight();
    theme = false;
  } else {
    setlight();
    setday();
    theme = true;
  }
});
