# Retirement Calculator Audit

## Snapshot

The project is a useful static prototype with strong feature ambition, but it mixes product logic, UI logic, and documentation into a single HTML file. That made it easy to ship initially, but it also increased maintenance risk and made formula review harder.

## Key findings

### 1. Architecture risk: giant single file
**Observation:** The previous implementation placed markup, styles, event wiring, formulas, charts, tax logic, and PDF generation in one HTML file.

**Risk:**
- Harder to reason about changes
- Duplicate event registration is easy to introduce
- Business logic is difficult to test in isolation

**Action taken in this PR:** split assets into HTML/CSS/JS files and extract a testable calculations layer.

---

### 2. Input validation was too permissive
**Observation:** Many calculations would still run with `0` or inconsistent inputs.

**Risk:** Users can get polished-looking outputs from incomplete data.

**Action taken in this PR:** added a validation summary, field highlighting, and basic guardrails around age, net worth, expenses, and Social Security inputs.

---

### 3. Financial modeling is helpful but simplified
**Observation:** The calculator provides deterministic estimates for retirement longevity, Social Security, and tax brackets.

**Important caveats:**
- No sequence-of-returns risk modeling
- No state income taxes
- No RMD modeling
- Social Security benefit adjustments are simplified
- Social Security taxation is simplified
- Investment income is not split into ordinary income vs. LTCG / qualified dividends
- No Medicare / IRMAA / ACA interactions

**Recommendation:** keep the tool, but present it as an illustrative planning calculator rather than an authoritative retirement engine.

---

### 4. Trust/documentation gap
**Observation:** The old docs were strong on features but light on limitations and assumption boundaries.

**Action taken in this PR:** rewrote the README to better explain assumptions, limits, and practical next steps.

---

### 5. Testing gap
**Observation:** Core formulas were not covered by automated tests.

**Risk:** seemingly harmless refactors could change financial outputs without obvious breakage.

**Action taken in this PR:** added a small Node test suite for core retirement, Social Security, and tax functions.

## Highest-value next work

1. Replace `js/legacy-app.js` with a smaller unified app controller.
2. Improve tax handling around capital gains / dividends.
3. Improve Social Security spousal and claiming logic.
4. Add export/import for scenarios.
5. Add richer scenario analysis (best/base/worst case, or Monte Carlo mode).
