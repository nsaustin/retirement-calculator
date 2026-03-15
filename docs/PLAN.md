# Retirement Calculator Improvement Plan

## Goals

1. Make the calculator easier to maintain and review.
2. Improve trust by documenting assumptions and adding user guardrails.
3. Extract core formulas into a testable calculation layer.
4. Prepare the project for cleaner future work without forcing a framework migration.

## This PR delivers

- Split the single-file app into:
  - `index.html`
  - `styles.css`
  - `js/legacy-app.js`
  - `js/calculations.js`
  - `js/enhancements.js`
- Added a validation summary + per-field validation styling.
- Added lightweight persistence via `localStorage` so inputs survive refreshes.
- Added Node-based tests for core finance/tax functions.
- Rewrote the README to better explain scope, assumptions, and known limitations.
- Added an audit document to capture technical and modeling recommendations.
- Added `.gitignore` and a compatibility redirect from `retirement-calculator.html` to `index.html`.

## Next recommended phases

### Phase 2 — Reduce logic duplication
- Replace the legacy UI script with a clean `app.js` flow.
- Centralize input parsing, validation, calculation, and rendering.
- Remove duplicate event handlers and repeated `DOMContentLoaded` wiring.

### Phase 3 — Model quality improvements
- Improve Social Security claiming logic and spousal handling.
- Separate ordinary income, qualified dividends, and long-term capital gains.
- Document tax-year assumptions in the UI.
- Add scenario-based / Monte Carlo planning as an optional advanced mode.

### Phase 4 — UX improvements
- Add scenario save/load/export/import controls.
- Add more contextual explanation near assumptions and outputs.
- Add tests around rendering helpers if the UI layer is split further.
