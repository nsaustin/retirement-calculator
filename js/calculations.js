(function (global) {
  const taxBrackets2025 = {
    single: [
      { rate: 0.1, bracket: 0 },
      { rate: 0.12, bracket: 11925 },
      { rate: 0.22, bracket: 48500 },
      { rate: 0.24, bracket: 103400 },
      { rate: 0.32, bracket: 197450 },
      { rate: 0.35, bracket: 250800 },
      { rate: 0.37, bracket: 626950 }
    ],
    married: [
      { rate: 0.1, bracket: 0 },
      { rate: 0.12, bracket: 23850 },
      { rate: 0.22, bracket: 97000 },
      { rate: 0.24, bracket: 206800 },
      { rate: 0.32, bracket: 394900 },
      { rate: 0.35, bracket: 501600 },
      { rate: 0.37, bracket: 752350 }
    ],
    head: [
      { rate: 0.1, bracket: 0 },
      { rate: 0.12, bracket: 17025 },
      { rate: 0.22, bracket: 64950 },
      { rate: 0.24, bracket: 103400 },
      { rate: 0.32, bracket: 197450 },
      { rate: 0.35, bracket: 250800 },
      { rate: 0.37, bracket: 626950 }
    ],
    separate: [
      { rate: 0.1, bracket: 0 },
      { rate: 0.12, bracket: 11925 },
      { rate: 0.22, bracket: 48500 },
      { rate: 0.24, bracket: 103400 },
      { rate: 0.32, bracket: 197450 },
      { rate: 0.35, bracket: 250800 },
      { rate: 0.37, bracket: 376175 }
    ]
  };

  const standardDeductions2025 = {
    single: 15000,
    married: 30000,
    head: 22550,
    separate: 15000
  };

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function calculateRequiredSavings(annualExpenses, withdrawalRate) {
    return withdrawalRate > 0 ? annualExpenses / withdrawalRate : Infinity;
  }

  function calculateRealReturnRate(nominalReturnRate, inflationRate) {
    return (1 + nominalReturnRate) / (1 + inflationRate) - 1;
  }

  function calculateMoneyDuration(principal, annualExpenses, withdrawalRate, nominalReturnRate, inflationRate) {
    const realReturnRate = calculateRealReturnRate(nominalReturnRate, inflationRate);

    if (withdrawalRate <= realReturnRate) {
      return { lastsForever: true, years: 200, realReturnRate };
    }

    let currentBalance = principal;
    let years = 0;
    let currentAnnualWithdrawal = annualExpenses;
    const maxYears = 200;

    while (currentBalance > 0 && years < maxYears) {
      const investmentReturns = currentBalance * nominalReturnRate;
      currentBalance = currentBalance + investmentReturns - currentAnnualWithdrawal;
      currentAnnualWithdrawal *= 1 + inflationRate;
      years += 1;
    }

    return {
      lastsForever: years >= maxYears,
      years,
      realReturnRate
    };
  }

  function calculateFuturePurchasingPower(amount, inflationRate, years) {
    return amount / Math.pow(1 + inflationRate, years);
  }

  function calculateSSBenefit(fraBenefit, claimingAge) {
    let percentOfFull = 100;
    if (claimingAge < 67) percentOfFull = 100 - (67 - claimingAge) * 6.67;
    if (claimingAge > 67) percentOfFull = 100 + (claimingAge - 67) * 8;
    return fraBenefit * percentOfFull / 100;
  }

  function estimateSocialSecurityBenefit({ birthYear, yearsWorked, averageAnnualIncome }) {
    const aime = averageAnnualIncome / 12;
    let pia = 0;
    if (aime <= 996) pia = aime * 0.9;
    else if (aime <= 6002) pia = 896.4 + (aime - 996) * 0.32;
    else pia = 2501.82 + (aime - 6002) * 0.15;
    if (yearsWorked < 35) pia *= yearsWorked / 35;

    let fra = 67;
    if (birthYear <= 1937) fra = 65;
    else if (birthYear <= 1942) fra = 65 + (birthYear - 1937) * 2 / 12;
    else if (birthYear <= 1954) fra = 66;
    else if (birthYear <= 1959) fra = 66 + (birthYear - 1954) * 2 / 12;

    return { fra, monthlyBenefitAtFra: Math.round(pia) };
  }

  function getTaxableSocialSecurityPercentage(combinedIncome, filingStatus) {
    if (filingStatus === 'married') {
      if (combinedIncome < 32000) return 0;
      if (combinedIncome < 44000) return 0.5;
      return 0.85;
    }
    if (combinedIncome < 25000) return 0;
    if (combinedIncome < 34000) return 0.5;
    return 0.85;
  }

  function getMarginalRate(taxableIncome, brackets) {
    for (let i = brackets.length - 1; i >= 0; i -= 1) {
      if (taxableIncome >= brackets[i].bracket) return brackets[i].rate;
    }
    return 0;
  }

  function calculateFederalTax(taxableIncome, filingStatus) {
    const brackets = taxBrackets2025[filingStatus];
    let tax = 0;
    const bracketData = [];

    for (let i = 0; i < brackets.length; i += 1) {
      const current = brackets[i];
      const nextThreshold = i < brackets.length - 1 ? brackets[i + 1].bracket : Infinity;
      const incomeInBracket = Math.min(Math.max(0, taxableIncome - current.bracket), nextThreshold - current.bracket);
      const taxInBracket = incomeInBracket * current.rate;
      tax += taxInBracket;
      if (incomeInBracket > 0) bracketData.push({ rate: current.rate, incomeInBracket, taxInBracket });
    }

    return { totalTax: tax, bracketData, marginalRate: getMarginalRate(taxableIncome, brackets) };
  }

  const api = {
    taxBrackets2025,
    standardDeductions2025,
    formatCurrency,
    calculateRequiredSavings,
    calculateRealReturnRate,
    calculateMoneyDuration,
    calculateFuturePurchasingPower,
    calculateSSBenefit,
    estimateSocialSecurityBenefit,
    getTaxableSocialSecurityPercentage,
    calculateFederalTax,
    getMarginalRate
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.RetirementCalculatorCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
