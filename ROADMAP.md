# Roadmap

This project has been refactored into a cleaner static-site structure so future improvements are easier to ship and review.

## Near-term priorities

1. **Simplify the UI/controller layer**
   - reduce duplicated event wiring
   - consolidate calculation + rendering flow
   - make future changes easier to reason about

2. **Improve model accuracy where it matters most**
   - better Social Security handling
   - better retirement tax handling
   - clearer assumptions shown in the UI

3. **Improve usability**
   - scenario save/load/export/import
   - clearer explanations around assumptions and outputs
   - more guardrails for edge cases

4. **Expand testing**
   - broaden formula coverage
   - add regression tests as the app logic gets cleaner

## Current philosophy

Keep the tool:
- fast
- static/simple to deploy
- useful for planning conversations
- honest about its assumptions and limitations
