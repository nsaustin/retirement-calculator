const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../js/calculations.js');

test('required savings uses annual expenses divided by withdrawal rate', () => {
  assert.equal(core.calculateRequiredSavings(60000, 0.04), 1500000);
});

test('real return rate is inflation adjusted', () => {
  const result = core.calculateRealReturnRate(0.07, 0.025);
  assert.ok(Math.abs(result - 0.043902439) < 1e-6);
});

test('money duration lasts forever when withdrawal rate is under real return rate', () => {
  const result = core.calculateMoneyDuration(1000000, 30000, 0.03, 0.07, 0.02);
  assert.equal(result.lastsForever, true);
});

test('money duration depletes when withdrawals outpace growth', () => {
  const result = core.calculateMoneyDuration(1000000, 80000, 0.04, 0.05, 0.03);
  assert.equal(result.lastsForever, false);
  assert.ok(result.years > 0);
});

test('social security benefit adjustment lowers early and raises late claiming', () => {
  const fra = 2000;
  assert.ok(core.calculateSSBenefit(fra, 62) < fra);
  assert.ok(core.calculateSSBenefit(fra, 70) > fra);
});

test('taxable social security percentage follows married thresholds', () => {
  assert.equal(core.getTaxableSocialSecurityPercentage(30000, 'married'), 0);
  assert.equal(core.getTaxableSocialSecurityPercentage(40000, 'married'), 0.5);
  assert.equal(core.getTaxableSocialSecurityPercentage(50000, 'married'), 0.85);
});

test('federal tax returns marginal rate and bracket data', () => {
  const result = core.calculateFederalTax(100000, 'single');
  assert.ok(result.totalTax > 0);
  assert.equal(result.marginalRate, 0.22);
  assert.ok(result.bracketData.length >= 3);
});
