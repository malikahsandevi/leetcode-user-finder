# LeetCode User Finder

Look up any LeetCode profile in one clean, modern view — enter a username
and see their solved problems, acceptance rate, ranking and reputation.

## Features

- Search any LeetCode username and see their stats in one glass dashboard
- Animated SVG progress ring for total solved, plus Easy / Medium / Hard
  bars in LeetCode's own difficulty colours
- Global ranking, contribution points and reputation
- Acceptance rate and total submissions, computed from the submission stats
- Quick-try chips for well-known profiles
- Dark / light themes (follows your system preference; the toggle remembers
  your choice)
- Friendly error messages for empty input, unknown users and network errors

Design: glassmorphism dashboard, Space Grotesk + Inter, animated ambient
background, fully responsive.

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- LeetCode stats via the public API at
  [leetcode-api-faisalshohag.vercel.app](https://leetcode-api-faisalshohag.vercel.app)
  (the original Heroku-hosted stats API shut down; this is a drop-in
  replacement with the same data)

## Run Locally

No build step needed. Either open `index.html` in a browser, or serve the
folder with any static server, for example:

```bash
npx serve .
```

## Live Demo

**https://malikahsandevi.github.io/leetcode-user-finder/**

## Disclaimer

This is an unofficial tool built for learning and portfolio purposes. It is
not affiliated with or endorsed by LeetCode.

## Author

**Ahsan Ali** — MERN Stack Developer
- Portfolio: https://ahsan-ali-protfolio.vercel.app
- GitHub: https://github.com/malikahsandevi
- LinkedIn: https://www.linkedin.com/in/ahsan-ali-468453440
