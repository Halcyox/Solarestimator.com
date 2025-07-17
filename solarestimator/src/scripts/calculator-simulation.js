// Calculator Simulation Script
// Tests various extreme scenarios to verify calculation accuracy

// Constants from the API route
const AVERAGE_PANEL_OUTPUT_KW = 0.4;
const BASE_INSTALLATION_COST_PER_KW = 3000;
const PANEL_DEGRADATION_RATE = 0.005;
const UTILITY_RATE_INFLATION = 0.03;
const FEDERAL_TAX_CREDIT = 0.30;
const AVG_DAILY_SUN_HOURS = 4.5;
const TYPICAL_SYSTEM_LOSSES = 0.14;
const SOLAR_LOAN_RATE = 0.049;
const SOLAR_LOAN_TERM_YEARS = 25;
const SOLAR_LEASE_ESCALATOR = 0.029;
const DEALER_FEE = 0.17;
const KG_CO2_PER_KWH = 0.385;

function calculateSystemMetrics(
  monthlyBill,
  sizeMultiplier,
  utilityRate,
  sunshineHours,
  tiltFactor,
  shadingFactor
) {
  // Input validation
  if (monthlyBill <= 0 || utilityRate <= 0 || sunshineHours <= 0) {
    throw new Error("Invalid input parameters: Monthly bill, utility rate, and sunshine hours must be positive values");
  }
  // Calculate required system size based on monthly bill
  const monthlyKwh = monthlyBill / utilityRate;
  const yearlyKwh = monthlyKwh * 12;
  const dailyKwh = yearlyKwh / 365;
  const requiredDailyKwh = dailyKwh / (1 - TYPICAL_SYSTEM_LOSSES);
  const baseSystemSizeKW = requiredDailyKwh / AVG_DAILY_SUN_HOURS;
  // Apply size multiplier and efficiency factors
  let systemSizeKW = baseSystemSizeKW * sizeMultiplier * tiltFactor * shadingFactor;
  // Apply realistic system size limits for residential installations
  const MAX_RESIDENTIAL_SYSTEM_KW = 20;
  const MIN_RESIDENTIAL_SYSTEM_KW = 1;
  if (systemSizeKW > MAX_RESIDENTIAL_SYSTEM_KW) {
    systemSizeKW = MAX_RESIDENTIAL_SYSTEM_KW;
  } else if (systemSizeKW < MIN_RESIDENTIAL_SYSTEM_KW) {
    systemSizeKW = MIN_RESIDENTIAL_SYSTEM_KW;
  }
  const numberOfPanels = Math.round(systemSizeKW / AVERAGE_PANEL_OUTPUT_KW);
  // Calculate yearly production
  const yearlyProduction = systemSizeKW * sunshineHours * (1 - TYPICAL_SYSTEM_LOSSES);
  // Calculate monthly savings
  const monthlySavings = (yearlyProduction / 12) * utilityRate;
  // Calculate 25-year savings with degradation and inflation
  let totalSavings = 0;
  let yearlyDegradation = 1;
  for (let year = 1; year <= 25; year++) {
    const yearlyInflation = Math.pow(1 + UTILITY_RATE_INFLATION, year);
    yearlyDegradation *= (1 - PANEL_DEGRADATION_RATE);
    totalSavings += monthlySavings * 12 * yearlyInflation * yearlyDegradation;
  }
  // Calculate system cost and payback period
  const systemCost = systemSizeKW * BASE_INSTALLATION_COST_PER_KW;
  const netCostAfterTaxCredit = systemCost * (1 - FEDERAL_TAX_CREDIT);
  return {
    systemSizeKW,
    numberOfPanels,
    monthlySavings,
    totalSavings25Year: totalSavings,
    systemCost,
    netCostAfterTaxCredit,
    yearlyProduction
  };
}

function calculateFinancingOptions(systemCost, netCostAfterTaxCredit, monthlySavings) {
  let cashBreakeven = Math.ceil(netCostAfterTaxCredit / (monthlySavings * 12));
  // Apply realistic breakeven limits
  const MAX_BREAKEVEN_YEARS = 25;
  const MIN_BREAKEVEN_YEARS = 1;
  if (cashBreakeven > MAX_BREAKEVEN_YEARS) {
    cashBreakeven = MAX_BREAKEVEN_YEARS;
  } else if (cashBreakeven < MIN_BREAKEVEN_YEARS) {
    cashBreakeven = MIN_BREAKEVEN_YEARS;
  }
  // Solar loan
  const loanAmount = systemCost * (1 + DEALER_FEE);
  const monthlyRate = SOLAR_LOAN_RATE / 12;
  const numberOfPayments = SOLAR_LOAN_TERM_YEARS * 12;
  const monthlyLoanPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  let loanBreakeven = 0;
  let cumulativeSavings = -DEALER_FEE * systemCost;
  for (let month = 1; month <= 300; month++) {
    cumulativeSavings += monthlySavings - monthlyLoanPayment;
    if (cumulativeSavings > 0 && loanBreakeven === 0) {
      loanBreakeven = Math.ceil(month / 12);
    }
  }
  if (loanBreakeven > MAX_BREAKEVEN_YEARS) {
    loanBreakeven = MAX_BREAKEVEN_YEARS;
  } else if (loanBreakeven < MIN_BREAKEVEN_YEARS) {
    loanBreakeven = MIN_BREAKEVEN_YEARS;
  }
  // Solar lease
  const baseLeasePayment = monthlySavings * 0.8;
  let totalLeasePayments = 0;
  let leaseBreakeven = 0;
  let cumulativeLeaseAdvantage = 0;
  for (let year = 0; year < 25; year++) {
    const yearlyLeasePayment = baseLeasePayment * 12 * Math.pow(1 + SOLAR_LEASE_ESCALATOR, year);
    const yearlyUtilitySavings = monthlySavings * 12 * Math.pow(1 + UTILITY_RATE_INFLATION, year);
    totalLeasePayments += yearlyLeasePayment;
    cumulativeLeaseAdvantage += yearlyUtilitySavings - yearlyLeasePayment;
    if (cumulativeLeaseAdvantage > 0 && leaseBreakeven === 0) {
      leaseBreakeven = year + 1;
    }
  }
  if (leaseBreakeven > MAX_BREAKEVEN_YEARS) {
    leaseBreakeven = MAX_BREAKEVEN_YEARS;
  } else if (leaseBreakeven < MIN_BREAKEVEN_YEARS) {
    leaseBreakeven = MIN_BREAKEVEN_YEARS;
  }
  return {
    cash: {
      breakevenYears: cashBreakeven
    },
    loan: {
      breakevenYears: loanBreakeven
    },
    lease: {
      breakevenYears: leaseBreakeven
    }
  };
}

function runSimulation(scenario, monthlyBill, utilityRate, sunshineHours) {
  const tiltFactor = 0.95;
  const shadingFactor = 0.90;
  let result, financingOptions, co2Reduction, treesEquivalent;
  const issues = [];
  let isValid = true;
  try {
    result = calculateSystemMetrics(monthlyBill, 1.0, utilityRate, sunshineHours, tiltFactor, shadingFactor);
    financingOptions = calculateFinancingOptions(result.systemCost, result.netCostAfterTaxCredit, result.monthlySavings);
    co2Reduction = result.yearlyProduction * KG_CO2_PER_KWH;
    treesEquivalent = co2Reduction / 21.7;
    // Validation checks
    if (result.systemSizeKW <= 0 || isNaN(result.systemSizeKW)) {
      issues.push("Invalid system size (≤ 0 kW or NaN)");
      isValid = false;
    }
    if (result.numberOfPanels <= 0 || isNaN(result.numberOfPanels)) {
      issues.push("Invalid panel count (≤ 0 or NaN)");
      isValid = false;
    }
    if (result.systemCost <= 0 || isNaN(result.systemCost)) {
      issues.push("Invalid system cost (≤ $0 or NaN)");
      isValid = false;
    }
    if (result.monthlySavings <= 0 || isNaN(result.monthlySavings)) {
      issues.push("No monthly savings calculated");
      isValid = false;
    }
    if (financingOptions.cash.breakevenYears <= 0 || financingOptions.cash.breakevenYears > 50 || isNaN(financingOptions.cash.breakevenYears)) {
      issues.push("Unrealistic cash breakeven period");
      isValid = false;
    }
    if (result.systemSizeKW > 50) {
      issues.push("System size exceeds typical residential limits (>50 kW)");
    }
    if (result.numberOfPanels > 200) {
      issues.push("Panel count exceeds typical residential limits (>200 panels)");
    }
  } catch (error) {
    isValid = false;
    issues.push(`Calculation error: ${error.message}`);
    result = { systemSizeKW: 0, numberOfPanels: 0, systemCost: 0, netCostAfterTaxCredit: 0, monthlySavings: 0, totalSavings25Year: 0, yearlyProduction: 0 };
    financingOptions = { cash: { breakevenYears: 0 }, loan: { breakevenYears: 0 }, lease: { breakevenYears: 0 } };
    co2Reduction = 0;
    treesEquivalent = 0;
  }
  return {
    scenario,
    monthlyBill,
    utilityRate,
    sunshineHours,
    systemSizeKW: result.systemSizeKW,
    numberOfPanels: result.numberOfPanels,
    systemCost: result.systemCost,
    netCostAfterTaxCredit: result.netCostAfterTaxCredit,
    monthlySavings: result.monthlySavings,
    totalSavings25Year: result.totalSavings25Year,
    cashBreakeven: financingOptions.cash.breakevenYears,
    loanBreakeven: financingOptions.loan.breakevenYears,
    leaseBreakeven: financingOptions.lease.breakevenYears,
    co2Reduction,
    treesEquivalent,
    isValid,
    issues
  };
}

// Define test scenarios
const scenarios = [
  // Normal scenarios
  { name: "Typical Home (MA)", monthlyBill: 150, utilityRate: 0.25, sunshineHours: 1300 },
  { name: "High Usage Home", monthlyBill: 300, utilityRate: 0.25, sunshineHours: 1300 },
  { name: "Low Usage Home", monthlyBill: 50, utilityRate: 0.25, sunshineHours: 1300 },
  // Extreme monthly bills
  { name: "Very Low Bill", monthlyBill: 10, utilityRate: 0.25, sunshineHours: 1300 },
  { name: "Extremely High Bill", monthlyBill: 1000, utilityRate: 0.25, sunshineHours: 1300 },
  { name: "Zero Bill", monthlyBill: 0, utilityRate: 0.25, sunshineHours: 1300 },
  { name: "Negative Bill", monthlyBill: -50, utilityRate: 0.25, sunshineHours: 1300 },
  // Extreme utility rates
  { name: "Very Low Rate", monthlyBill: 150, utilityRate: 0.05, sunshineHours: 1300 },
  { name: "Very High Rate", monthlyBill: 150, utilityRate: 0.50, sunshineHours: 1300 },
  { name: "Zero Rate", monthlyBill: 150, utilityRate: 0, sunshineHours: 1300 },
  { name: "Negative Rate", monthlyBill: 150, utilityRate: -0.10, sunshineHours: 1300 },
  // Extreme sunshine hours
  { name: "Low Sunshine (Alaska)", monthlyBill: 150, utilityRate: 0.25, sunshineHours: 800 },
  { name: "High Sunshine (Arizona)", monthlyBill: 150, utilityRate: 0.25, sunshineHours: 2000 },
  { name: "Zero Sunshine", monthlyBill: 150, utilityRate: 0.25, sunshineHours: 0 },
  { name: "Negative Sunshine", monthlyBill: 150, utilityRate: 0.25, sunshineHours: -500 },
  // Combined extremes
  { name: "Worst Case", monthlyBill: 10, utilityRate: 0.05, sunshineHours: 800 },
  { name: "Best Case", monthlyBill: 300, utilityRate: 0.50, sunshineHours: 2000 },
  { name: "Impossible Case", monthlyBill: 0, utilityRate: 0, sunshineHours: 0 },
  // Real-world scenarios
  { name: "California High Rate", monthlyBill: 200, utilityRate: 0.35, sunshineHours: 1800 },
  { name: "Texas Low Rate", monthlyBill: 150, utilityRate: 0.12, sunshineHours: 1600 },
  { name: "Hawaii High Rate", monthlyBill: 250, utilityRate: 0.40, sunshineHours: 1900 },
  { name: "Washington Low Rate", monthlyBill: 100, utilityRate: 0.10, sunshineHours: 1200 },
];

console.log("=== SOLAR CALCULATOR SIMULATION RESULTS ===\n");

let validScenarios = 0;
let invalidScenarios = 0;

scenarios.forEach(scenario => {
  const result = runSimulation(scenario.name, scenario.monthlyBill, scenario.utilityRate, scenario.sunshineHours);
  console.log(`📊 ${result.scenario}`);
  console.log(`   Input: $${scenario.monthlyBill}/month, $${scenario.utilityRate}/kWh, ${scenario.sunshineHours} hours/year`);
  if (result.isValid) {
    console.log(`   System: ${result.systemSizeKW.toFixed(1)} kW (${result.numberOfPanels} panels)`);
    console.log(`   Cost: $${result.systemCost.toLocaleString()} (Net: $${result.netCostAfterTaxCredit.toLocaleString()})`);
    console.log(`   Monthly Savings: $${result.monthlySavings.toFixed(2)}`);
    console.log(`   25-Year Savings: $${result.totalSavings25Year.toLocaleString()}`);
    console.log(`   Breakeven: Cash ${result.cashBreakeven}y, Loan ${result.loanBreakeven}y, Lease ${result.leaseBreakeven}y`);
    console.log(`   CO₂ Reduction: ${result.co2Reduction.toFixed(0)} kg/year (${result.treesEquivalent.toFixed(1)} trees)`);
    console.log(`   ✅ VALID`);
    validScenarios++;
  } else {
    console.log(`   ❌ INVALID: ${result.issues.join(", ")}`);
    invalidScenarios++;
  }
  console.log("");
});

console.log("=== SUMMARY ===");
console.log(`Valid scenarios: ${validScenarios}`);
console.log(`Invalid scenarios: ${invalidScenarios}`);
console.log(`Total scenarios: ${scenarios.length}`);
console.log(`Success rate: ${((validScenarios / scenarios.length) * 100).toFixed(1)}%`);

// Edge case analysis
console.log("\n=== EDGE CASE ANALYSIS ===");

// Test division by zero scenarios
const edgeCases = [
  { name: "Zero Bill + Zero Rate", monthlyBill: 0, utilityRate: 0, sunshineHours: 1300 },
  { name: "Zero Bill + Normal Rate", monthlyBill: 0, utilityRate: 0.25, sunshineHours: 1300 },
  { name: "Normal Bill + Zero Rate", monthlyBill: 150, utilityRate: 0, sunshineHours: 1300 },
  { name: "Zero Sunshine", monthlyBill: 150, utilityRate: 0.25, sunshineHours: 0 },
];

edgeCases.forEach(scenario => {
  try {
    const result = runSimulation(scenario.name, scenario.monthlyBill, scenario.utilityRate, scenario.sunshineHours);
    console.log(`🔍 ${result.scenario}: ${result.isValid ? "HANDLED" : "FAILED"} - ${result.issues.join(", ")}`);
  } catch (error) {
    console.log(`🔍 ${scenario.name}: CRASHED - ${error}`);
  }
});

// Realistic range validation
console.log("\n=== REALISTIC RANGE VALIDATION ===");

const realisticScenarios = scenarios.filter(s => 
  s.monthlyBill > 0 && s.monthlyBill <= 500 &&
  s.utilityRate > 0 && s.utilityRate <= 0.50 &&
  s.sunshineHours > 0 && s.sunshineHours <= 2500
);

realisticScenarios.forEach(scenario => {
  const result = runSimulation(scenario.name, scenario.monthlyBill, scenario.utilityRate, scenario.sunshineHours);
  
  // Check for realistic ranges
  const realisticChecks = [];
  
  if (result.systemSizeKW < 1 || result.systemSizeKW > 30) {
    realisticChecks.push(`System size ${result.systemSizeKW.toFixed(1)} kW outside typical range (1-30 kW)`);
  }
  
  if (result.numberOfPanels < 4 || result.numberOfPanels > 100) {
    realisticChecks.push(`Panel count ${result.numberOfPanels} outside typical range (4-100 panels)`);
  }
  
  if (result.cashBreakeven < 3 || result.cashBreakeven > 20) {
    realisticChecks.push(`Cash breakeven ${result.cashBreakeven} years outside typical range (3-20 years)`);
  }
  
  if (result.monthlySavings < 0) {
    realisticChecks.push(`Negative monthly savings $${result.monthlySavings.toFixed(2)}`);
  }
  
  if (realisticChecks.length > 0) {
    console.log(`⚠️  ${result.scenario}: ${realisticChecks.join(", ")}`);
  } else {
    console.log(`✅ ${result.scenario}: All values in realistic ranges`);
  }
});

// Mathematical validation
console.log("\n=== MATHEMATICAL VALIDATION ===");

// Test a known scenario with manual calculation
const testScenario = { monthlyBill: 150, utilityRate: 0.25, sunshineHours: 1300 };
const testResult = runSimulation("Mathematical Test", testScenario.monthlyBill, testScenario.utilityRate, testScenario.sunshineHours);

console.log("Manual calculation verification:");
console.log(`Monthly kWh: ${testScenario.monthlyBill} / ${testScenario.utilityRate} = ${testScenario.monthlyBill / testScenario.utilityRate} kWh`);
console.log(`Yearly kWh: ${(testScenario.monthlyBill / testScenario.utilityRate) * 12} kWh`);
console.log(`Daily kWh: ${((testScenario.monthlyBill / testScenario.utilityRate) * 12) / 365} kWh`);
console.log(`Required daily kWh (with losses): ${(((testScenario.monthlyBill / testScenario.utilityRate) * 12) / 365) / (1 - TYPICAL_SYSTEM_LOSSES)} kWh`);
console.log(`Base system size: ${(((testScenario.monthlyBill / testScenario.utilityRate) * 12) / 365) / (1 - TYPICAL_SYSTEM_LOSSES) / AVG_DAILY_SUN_HOURS} kW`);
console.log(`Final system size: ${testResult.systemSizeKW.toFixed(2)} kW`);
console.log(`Calculated system size: ${testResult.systemSizeKW.toFixed(2)} kW`);
console.log(`Match: ${Math.abs(testResult.systemSizeKW - (((testScenario.monthlyBill / testScenario.utilityRate) * 12) / 365) / (1 - TYPICAL_SYSTEM_LOSSES) / AVG_DAILY_SUN_HOURS * 0.95 * 0.90) < 0.01 ? "✅ PASS" : "❌ FAIL"}`); 