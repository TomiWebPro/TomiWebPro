# Compatibility Journey — Rules & Scoring

Source of truth for behavior. UI text must stay neutral; thresholds below live
only in `js/scoring.js` (never shown in the quiz).

## 1. Calculation method

1. Start at **75** (a profile with zero bonuses and zero penalties scores 75).
2. Add all bonuses / penalties from §3 (simple addition, order-independent).
3. Section gates: each question belongs to `basic` / `wealth` / `life` / `beliefs`.
   Any hard-fail (or any skipped question) flags its section.
4. If **any** section is flagged → `internal = 0` (whole score, applied at the
   next section gate, never mid-section, never with a reason shown).
5. Otherwise clamp and round: `internal = max(0, min(125, round(s)))`.
6. Displayed score: `display = min(100, internal)`. The site only ever says 0–100.
7. Contact form appears iff `internal > 75`. Everyone else gets the score,
   encouragement text, the `TomiWebPro@gmail.com` address, and the PDF download.

Calibration check: zero-bonus pass = 75 · typical slight-positive ≈ 76–77 ·
fully stacked bonuses hit the 125 cap (shown as 100) · unknown `w2`+`w4` ≈ 53.

## 2. Flow rules (not scoring)

- `b1 = friends_only` → friend-page redirect (`friend.html` beta), no fail.
- Skip (“I don't feel comfortable…”) → its section fails at the next gate.
- `w2`/`w4` track radio is optional when a number is entered.
- `l14` requires the `max_stake` number when gambling is `past`/`sometimes`.
- `e3` requires the 8values link OR all four 0–100 scores (screenshot optional,
  attachable in the contact step).
- Progress bar shows completion % only — never a live score estimate.
- No question may offer a “Depends — let's talk” escape option. Every question
  forces a concrete answer; the only way out is Skip, which fails the section.
- Result PDF contains all answers + score + GDPR notice + date; download is
  Safari-safe (anchor appended before click).

## 3. Per-question rules

### Basic (gate `basic`)

| ID | Hard fail | Points |
|----|-----------|--------|
| `b1` | none (friends_only redirects) | 0 |
| `b2` birthday | invalid date, or age < 18, or \|date − ref\| > 8.5 y | 0 |
| `b3` gender | anything except birth Female + journey “no change” + she/her pronouns | 0 |
| `b4` orientation | identity ≠ straight; or history changed/other / hints bi, gay, changed, “used to”, yes | 0 |
| `b5` height | `d > +12` or `d < −22` (d = cm − ref). Sweet spot `−12…−2` → **+5**; outer band neutral | +5 / 0 |
| `b6` BMI | `< 17` or `> 28`. Ideal `18.5–23` → **+3** | +3 / 0 |
| `b7` languages | **no English/German/Chinese at conversational+ → fail** (learning-only doesn't count; Hungarian gives bonus only). Bonus per row: native/fluent **+3**, conversational **+1**, cap **+6** | 0…+6 |
| `b8` skin/hair | skin `brown`/`deep`, or containing dark/black/african → fail. Hair + eye color: no effect | 0 |
| `b9` mental | anything except `no_diagnosis` (past-resolved and current both fail) | 0 |
| `b10` physical | any of limb / vision / hearing / speech = yes → fail | 0 |
| `b11` glasses | no effect | 0 |
| `b12` origin, `b13` location (each) | no fail. china/eu/europe **+3**; usa/australia/russia **+1**; africa/india/pakistan **−4**; else 0. Hong Kong / Taiwan / Macau count as china | −4…+3 each |

### Wealth (gate `wealth`)

| ID | Hard fail | Points |
|----|-----------|--------|
| `w1` employment | none | 0 |
| `w2` independence index | `< 1.3`. No number entered → **−12**. `≥ 2` → **+4**; `1.3–2` neutral | −12 / 0 / +4 |
| `w3` info source | none. browser/AI **+2**; youtube/instagram/tiktok **−3**; rest 0 | +2 / 0 / −3 |
| `w4` freedom ratio | `< 0`. No number entered → **−12**. `≥ 30` → **+3**; else 0 | −12 / 0 / +3 |

### Life (gate `life`)

| ID | Hard fail | Points |
|----|-----------|--------|
| `l1` personality, `l2` energy, `l4` new friends, `l11` history | none | 0 |
| `l3` sports | none. badminton weekly **+4** (else +2); table tennis / roller / skiing / swimming / skydiving / paragliding **+2** each; cap **+7** | 0…+7 |
| `l5` swim | none. can't (`comfortable_no`/`want_learn`) **−5**; learning **−2**; confident **+2**; basics 0 | −5…+2 |
| `l6` pets (want) | none. cat / can-have-or-not / no-opinion **+2**; none / must-have **−4**; dog person / want other pet neutral | +2 / 0 / −4 |
| `l7` cooking | none. can cook **+1**; take over all cooking **−4**; can't + prefers eating out **−1** | −4…+1 |
| `l8` diet | vegetarian / vegan / meat-only, or any food allergy → fail. Omnivore is baseline (+0) | 0 |
| `l9` spice/adventure | no spice at all → fail. medium/hot/extreme **+1**; familiar-only / averse **−3** | −3…+1 |
| `l10` sleep | won't share a bed at all → fail. own room **−4**; night owl / messed clock **+2** | −4…+2 |
| `l12` partners/kids | partners `9+` (or numeric > 8), has kid, or abortion history → fail. `6–8` → **−10**; `3–5` → **−5** | 0 / −5 / −10 |
| `l13` smoking | history former/social/regular, or future continue → fail | 0 |
| `l14` habits | max single-session stake `≥ €100` → fail; drugs past/occasional/regular/recovery → fail; sex-habit struggle → **−5** | 0 / −5 |
| `l15` alcohol | several-times-a-week / daily → fail. never/rare → **+2** | 0 / +2 |
| `l16` kids | none. max `3`/`4+` → **−5**; ideal `3`/`4+` → **−3** | 0 / −3 / −5 |
| `l17` publicity | none. totally private → **−8** | 0 / −8 |
| `l18` family views | abortion totally opposed → fail; rest no effect | 0 |
| `l19` criminal | `current` or `serious_resolved` → fail | 0 |
| `l20` phone | none. iPhone / GrapheneOS → **+2** | 0 / +2 |
| `l21` computer | none. linux/macOS → **+2**; barely uses a computer → **−8** | −8 / 0 / +2 |

### Beliefs (gate `beliefs`)

| ID | Hard fail | Points |
|----|-----------|--------|
| `e1` religion | present christian/muslim/jewish/hindu/buddhist → fail; `other` + religious write-in → fail; practice `regular` → fail; past `more`/`different` → fail. science worldview **+2**; parents/grandparents very/active **−3** | −3…+2 |
| `e2` education | none. bachelor/master **+3**; PhD **−2**; computer/engineering/social-science/science major **+2** | −2…+5 |
| `e3` 8values | none (input enforced separately) | 0 |
| `e4` voting | none. always/usually → **+2** | 0 / +2 |
| `e5` free text | none (intentional) | 0 |

## 4. Worked examples (from automated probes)

- Zero-bonus pass → 75 / 75, no flags.
- Cook-can bonus only → 76.
- Unknown `w2` + `w4` → ≈ 53 (contact blocked).
- Stake €99 → pass; €100+ → 0 (`life`).
- Hungarian-only → 0 (`basic`); English-learning-only → 0; English-conversational → pass.
- `other: humanist` → pass; `other: Catholic` → 0 (`beliefs`).
