(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function clearFieldError(field) {
    field.classList.remove('input-invalid');
    const next = field.parentElement.querySelector('.field-error');
    if (next) next.remove();
  }

  function setFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('input-invalid');
    const div = document.createElement('div');
    div.className = 'field-error';
    div.textContent = message;
    field.parentElement.appendChild(div);
  }

  function getExpenseInputType() {
    return byId('expense-input-type')?.value || 'total';
  }

  function getTotalExpenses() {
    if (getExpenseInputType() === 'total') {
      return parseFloat(byId('total-monthly-expenses-input')?.value) || 0;
    }

    return [
      'housing', 'gas-home', 'electric', 'internet', 'insurance', 'groceries', 'eating-out', 'gas-car',
      'cell-phones', 'public-transit', 'tolls', 'entertainment', 'clothing', 'water-sewer', 'self-care',
      'gym', 'music', 'education', 'medical', 'gifts', 'charity', 'fees', 'misc'
    ].reduce((sum, id) => sum + (parseFloat(byId(id)?.value) || 0), 0);
  }

  function validateRetirementForm() {
    const issues = [];
    const fields = [
      byId('current-age'),
      byId('net-worth'),
      byId('total-monthly-expenses-input'),
      byId('ss-monthly-benefit'),
      byId('ss-birth-year'),
      byId('ss-years-worked'),
      byId('ss-avg-income')
    ].filter(Boolean);

    fields.forEach(clearFieldError);

    const currentAge = parseFloat(byId('current-age')?.value) || 0;
    const netWorth = parseFloat(byId('net-worth')?.value) || 0;
    const totalExpenses = getTotalExpenses();
    const withdrawalRate = parseFloat(byId('withdrawal-rate')?.value) || 0;
    const returnRate = parseFloat(byId('return-rate')?.value) || 0;
    const inflationRate = parseFloat(byId('inflation-rate')?.value) || 0;
    const ssEnabled = byId('ss-include')?.value === 'yes';
    const ssMethod = byId('ss-method')?.value;
    const claimingAge = parseFloat(byId('ss-claiming-age')?.value) || 67;

    if (!currentAge || currentAge < 18 || currentAge > 100) {
      issues.push('Enter a realistic current age between 18 and 100.');
      setFieldError(byId('current-age'), 'Age should be between 18 and 100.');
    }

    if (netWorth <= 0) {
      issues.push('Enter a current net worth greater than $0.');
      setFieldError(byId('net-worth'), 'Net worth must be greater than $0.');
    }

    if (totalExpenses <= 0) {
      issues.push('Enter monthly expenses greater than $0.');
      const field = getExpenseInputType() === 'total' ? byId('total-monthly-expenses-input') : byId('housing');
      if (field) setFieldError(field, 'Expenses must be greater than $0.');
    }

    if (withdrawalRate > 5) issues.push('Withdrawal rates above 5% can be aggressive for long retirements.');
    if (returnRate <= inflationRate) issues.push('Expected return is less than or equal to inflation, which creates a tough sustainability scenario.');

    if (ssEnabled) {
      if (claimingAge < currentAge) {
        issues.push('Social Security claiming age cannot be earlier than current age.');
        setFieldError(byId('ss-claiming-age'), 'Claiming age must be at least your current age.');
      }

      if (ssMethod === 'statement') {
        const benefit = parseFloat(byId('ss-monthly-benefit')?.value) || 0;
        if (benefit <= 0) {
          issues.push('Enter a monthly Social Security benefit or switch to the estimate mode.');
          setFieldError(byId('ss-monthly-benefit'), 'Enter a monthly Social Security benefit.');
        }
      }

      if (ssMethod === 'estimate') {
        const birthYear = parseFloat(byId('ss-birth-year')?.value) || 0;
        const yearsWorked = parseFloat(byId('ss-years-worked')?.value) || 0;
        const avgIncome = parseFloat(byId('ss-avg-income')?.value) || 0;
        if (!birthYear || birthYear < 1900 || birthYear > new Date().getFullYear()) {
          issues.push('Enter a valid birth year for the Social Security estimate.');
          setFieldError(byId('ss-birth-year'), 'Enter a valid birth year.');
        }
        if (yearsWorked < 1 || yearsWorked > 35) {
          issues.push('Years worked for Social Security estimate should be between 1 and 35.');
          setFieldError(byId('ss-years-worked'), 'Enter years worked between 1 and 35.');
        }
        if (avgIncome <= 0) {
          issues.push('Enter an average annual income for the Social Security estimate.');
          setFieldError(byId('ss-avg-income'), 'Enter an average annual income.');
        }
      }
    }

    return issues;
  }

  function renderValidationIssues(issues) {
    const summary = byId('validation-summary');
    const list = byId('validation-list');
    if (!summary || !list) return;
    list.innerHTML = '';
    if (!issues.length) {
      summary.classList.remove('visible');
      return;
    }
    issues.forEach((issue) => {
      const li = document.createElement('li');
      li.textContent = issue;
      list.appendChild(li);
    });
    summary.classList.add('visible');
  }

  function wireValidation() {
    const button = byId('calculate-btn');
    if (!button) return;

    button.addEventListener('click', function (event) {
      const issues = validateRetirementForm();
      renderValidationIssues(issues);
      if (issues.length) {
        event.preventDefault();
        event.stopImmediatePropagation();
        byId('validation-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, true);
  }

  function persistInputs() {
    const ids = Array.from(document.querySelectorAll('input, select'))
      .map((el) => el.id)
      .filter(Boolean);
    const storageKey = 'retirement-calculator:v2';

    ids.forEach((id) => {
      const el = byId(id);
      if (!el) return;
      const saved = localStorage.getItem(`${storageKey}:${id}`);
      if (saved !== null) el.value = saved;
      el.addEventListener('change', () => {
        localStorage.setItem(`${storageKey}:${id}`, el.value);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireValidation();
    try { persistInputs(); } catch (_) {}
  });
})();
