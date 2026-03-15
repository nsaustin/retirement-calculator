# Retirement Calculator

A static browser-based retirement planning calculator for quick what-if analysis around:

- retirement readiness
- portfolio longevity
- inflation impact
- Social Security timing
- basic federal retirement tax estimates
- printable PDF summaries

![Screenshot](screen.png)

## Overview

This project helps answer practical planning questions like:

- How much do I need saved to support my spending?
- How long might my portfolio last under a given withdrawal rate?
- How much does Social Security reduce portfolio pressure?
- What does my retirement income mix do to my estimated federal taxes?

The calculator runs entirely client-side in the browser.

## Scope and limitations

This is a simplified planning tool, not a full financial-planning engine.

It does **not** currently model all of the following:

- sequence-of-returns risk / Monte Carlo outcomes
- state income taxes
- required minimum distributions (RMDs)
- Medicare premiums / IRMAA
- ACA subsidy interactions
- detailed qualified-dividend / long-term capital gains handling
- changing spending by life stage
- long-term care shocks
- survivor / spousal Social Security edge cases in full detail
- future tax-law changes

Treat the results as **illustrative estimates**, not tax, legal, or investment advice.

## Project structure

- `index.html` — main app entry
- `retirement-calculator.html` — compatibility redirect to `index.html`
- `styles.css` — styling
- `js/legacy-app.js` — browser/UI behavior
- `js/calculations.js` — core calculation helpers
- `js/enhancements.js` — validation and UX helpers
- `tests/calculations.test.js` — automated checks for core formulas
- `ROADMAP.md` — future directions

## Running locally

Because this is a static app, you can either open `index.html` directly or run a tiny local server.

### Option 1: open directly

Open `index.html` in your browser.

### Option 2: run a local server

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Or with `serve`:

```bash
npx serve .
```

## Testing

Run the calculation tests with:

```bash
node --test tests/calculations.test.js
```

## Core modeling assumptions

### Retirement readiness

The required savings estimate uses:

```text
Required savings = annual expenses / withdrawal rate
```

This is a useful planning heuristic, but it is not a guarantee of portfolio safety.

### Portfolio longevity

Portfolio longevity is estimated using a deterministic year-by-year simulation:

1. start with current portfolio balance
2. apply annual investment return
3. subtract annual spending
4. increase spending by inflation each year
5. continue until depletion or an upper cap is reached

This keeps the calculator simple and easy to reason about, but it does not model variable market returns.

### Real return rate

The calculator uses inflation-adjusted return math:

```text
Real return = ((1 + nominal return) / (1 + inflation)) - 1
```

### Social Security

Social Security claiming adjustments are simplified:

- early claiming reduces benefits using an approximate linear adjustment
- delayed claiming increases benefits using an approximate delayed-retirement-credit assumption
- the estimator is an approximation, not an SSA-grade benefits calculator

### Taxes

The tax section is best understood as a **basic federal estimate**.

Current limits include:

- no state tax handling
- simplified Social Security taxation thresholds
- investment income not fully separated into qualified dividends / LTCG vs ordinary income
- no RMD, IRMAA, or advanced retirement-tax planning logic

## Future directions

Some natural next steps for the project:

- simplify the UI/controller layer
- improve tax accuracy around investment income
- improve Social Security logic
- add save/load/export/import scenarios
- add richer scenario analysis
