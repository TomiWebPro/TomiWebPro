# Compatibility Journey (compatibility)

English only for now, expandable to other languages via `locales/*.json` + `?lang=xx`.

## Run
Just open `index.html` in a browser (double-click), or serve:
```powershell
cd "C:\Users\Tomi\Documents\compatibility"
python -m http.server 8000
# open http://localhost:8000
```

## Structure
- `index.html` — quiz shell + bottom-right completion % bar
- `friend.html` — beta friends-only redirect (friend request via mailto)
- `locales/en.json` — all UI chrome strings; copy to `de.json`/`hu.json`/`zh.json` to expand
- `js/questions.js` — 4 sections, 43 questions, neutral wording + emoji + SVG keys
- `js/scoring.js` — INTERNAL only: base 75 for a neutral pass, bonuses to 125, display min(100). Hard-fail/skip defers to section gate (no reason shown, no owner details in UI). Weights calibrated so a plain pass lands near 75 and only stacked "rate higher" answers reach 125. Language gate: none of English/German/Chinese at conversational+ fails basic (Hungarian earns bonus only); gambling fails at €100+ single-session stake (`l14.max_stake`); any drug use except `never` fails; `serious_resolved`/`current` criminal fails; `other` belief fails only if the write-in looks religious.
- `js/pdf.js` — client-side result PDF download (answers + score + GDPR notice)
- `js/app.js` — one-question-per-step flow, Back/Next/Skip, section gates, e3 requires 8values link or all 4 scores, w2/w4 track optional when a number is entered, l14 requires stake if gambling beyond rare, >75% contact form (name, ≤1000 words, contact, include-answers default on, PDF ≤25MB, GDPR modal, mailto TomiWebPro@gmail.com), ≤75% encouragement + email + PDF
- `css/style.css` — light colorful theme + animations

## Notes
- No live score estimation; only completion % bottom-right.
- Skip ("don't feel comfortable") marks fail at next section gate internally.
- Reference constants live only in `scoring.js` as opaque numbers with no PII comments (client-visible if inspected — move to server for production).
- Contact mailbox: `TomiWebPro@gmail.com` via mailto (static site, no backend — file must be re-attached manually in the mail app).
