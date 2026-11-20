# LeetCode User Finder

Look up any LeetCode profile in one clean view — enter a username and see
their solved problems, acceptance rate and reputation as animated rings.

## Features

- Search any LeetCode username (click the search icon or press Enter)
- Rings for Total Solved, Easy, Medium and Hard — with solved / total counts
- Acceptance rate computed from the user's submission stats
- Reputation score display
- Dark / light theme toggle (follows your system preference by default)
- Friendly error messages for empty input or unknown users

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

_Link will be added after deployment._

## Disclaimer

This is an unofficial tool built for learning and portfolio purposes. It is
not affiliated with or endorsed by LeetCode.

## Author

**Ahsan Ali** — MERN Stack Developer
- Portfolio: https://ahsan-ali-protfolio.vercel.app
- GitHub: https://github.com/malikahsandevi
- LinkedIn: https://www.linkedin.com/in/ahsan-ali-468453440
