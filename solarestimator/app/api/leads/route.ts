import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Email validation schema
const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  estimatedSavings: z.number().optional(),
  propertyType: z.string().optional(),
  ownership: z.string().optional(),
  roofAge: z.number().optional(),
  monthlyBill: z.number().optional(),
  utilityProvider: z.string().optional(),
});

type LeadData = z.infer<typeof leadSchema>;

// Constants from SavingsCalculator for accurate calculations
const AVERAGE_PANEL_OUTPUT_KW = 0.4; // 400W per panel
const BASE_INSTALLATION_COST_PER_KW = 3000; // Updated cost per kW
const PANEL_AREA_M2 = 1.7;
const PANEL_EFFICIENCY = 0.20; // 20% efficiency for modern panels
const PANEL_DEGRADATION_RATE = 0.005; // 0.5% per year
const UTILITY_RATE_INFLATION = 0.03; // 3% annual increase
const MAINTENANCE_COST_INFLATION = 0.02; // 2% annual increase
const KG_CO2_PER_KWH = 0.385;
const FEDERAL_TAX_CREDIT = 0.30; // 30% federal tax credit
const AVG_DAILY_SUN_HOURS = 4.5; // Average sun hours per day
const TYPICAL_SYSTEM_LOSSES = 0.14; // 14% system losses (inverter, wiring, etc.)

// Financing constants
const SOLAR_LOAN_RATE = 0.049; // 4.9% APR
const SOLAR_LOAN_TERM_YEARS = 25;
const SOLAR_LEASE_ESCALATOR = 0.029; // 2.9% annual increase
const SOLAR_LEASE_TERM_YEARS = 25;
const DEALER_FEE = 0.17; // 17% dealer fee for loans

interface FinancingOption {
  type: 'cash' | 'loan' | 'lease';
  monthlyPayment: number;
  totalCost: number;
  netSavings: number;
  upfrontCost: number;
  breakevenYears: number;
}

interface SystemMetrics {
  systemSizeKW: number;
  numberOfPanels: number;
  monthlySavings: number;
  totalSavings25Year: number;
  systemCost: number;
  netCostAfterTaxCredit: number;
  yearlyProduction: number;
  financingOptions: {
    cash: FinancingOption;
    loan: FinancingOption;
    lease: FinancingOption;
  };
}

function calculateFinancingOptions(systemCost: number, netCostAfterTaxCredit: number, monthlySavings: number): {
  cash: FinancingOption;
  loan: FinancingOption;
  lease: FinancingOption;
} {
  // Cash purchase
  const cashBreakeven = Math.ceil(netCostAfterTaxCredit / (monthlySavings * 12));
  const cash: FinancingOption = {
    type: 'cash',
    monthlyPayment: 0,
    totalCost: netCostAfterTaxCredit,
    netSavings: monthlySavings * 12 * 25 - netCostAfterTaxCredit,
    upfrontCost: netCostAfterTaxCredit,
    breakevenYears: cashBreakeven
  };

  // Solar loan
  const loanAmount = systemCost * (1 + DEALER_FEE);
  const monthlyRate = SOLAR_LOAN_RATE / 12;
  const numberOfPayments = SOLAR_LOAN_TERM_YEARS * 12;
  const monthlyLoanPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  let loanBreakeven = 0;
  let cumulativeSavings = -DEALER_FEE * systemCost; // Start with dealer fee as initial cost
  for (let month = 1; month <= 300; month++) { // Check up to 25 years
    cumulativeSavings += monthlySavings - monthlyLoanPayment;
    if (cumulativeSavings > 0 && loanBreakeven === 0) {
      loanBreakeven = Math.ceil(month / 12);
    }
  }

  const loan: FinancingOption = {
    type: 'loan',
    monthlyPayment: monthlyLoanPayment,
    totalCost: monthlyLoanPayment * numberOfPayments,
    netSavings: monthlySavings * 12 * 25 - (monthlyLoanPayment * numberOfPayments),
    upfrontCost: 0,
    breakevenYears: loanBreakeven
  };

  // Solar lease
  const baseLeasePayment = monthlySavings * 0.8; // Lease payment starts at 80% of savings
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

  const lease: FinancingOption = {
    type: 'lease',
    monthlyPayment: baseLeasePayment,
    totalCost: totalLeasePayments,
    netSavings: monthlySavings * 12 * 25 - totalLeasePayments,
    upfrontCost: 0,
    breakevenYears: leaseBreakeven
  };

  return { cash, loan, lease };
}

function calculateSystemMetrics(
  monthlyBill: number,
  sizeMultiplier: number,
  utilityRate: number,
  sunshineHours: number,
  tiltFactor: number,
  shadingFactor: number
): SystemMetrics {
  // Calculate required system size based on monthly bill
  const monthlyKwh = monthlyBill / utilityRate;
  const yearlyKwh = monthlyKwh * 12;
  const dailyKwh = yearlyKwh / 365;
  
  // Calculate required system size considering losses
  const requiredDailyKwh = dailyKwh / (1 - TYPICAL_SYSTEM_LOSSES);
  const baseSystemSizeKW = requiredDailyKwh / AVG_DAILY_SUN_HOURS;
  
  // Apply size multiplier and efficiency factors
  const systemSizeKW = baseSystemSizeKW * sizeMultiplier * tiltFactor * shadingFactor;
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
  
  // Calculate financing options
  const financingOptions = calculateFinancingOptions(systemCost, netCostAfterTaxCredit, monthlySavings);
  
  return {
    systemSizeKW,
    numberOfPanels,
    monthlySavings,
    totalSavings25Year: totalSavings,
    systemCost,
    netCostAfterTaxCredit,
    yearlyProduction,
    financingOptions
  };
}

// Initialize Resend with API key
const resend = new Resend('re_RLpWaTW5_MLo857XcLryR95cnvikfHotG');

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the input
    const data = leadSchema.parse(body);

    const monthlyBill = Number(data.monthlyBill) || 0;
    const utilityRate = 0.25; // $0.25/kWh for MA
    const sunshineHours = 1300; // Annual sunshine hours for MA
    const tiltFactor = 0.95; // Assuming good roof tilt
    const shadingFactor = 0.90; // Assuming minimal shading

    // Calculate metrics for three system options
    const economySystem = calculateSystemMetrics(monthlyBill, 0.75, utilityRate, sunshineHours, tiltFactor, shadingFactor);
    const recommendedSystem = calculateSystemMetrics(monthlyBill, 1.0, utilityRate, sunshineHours, tiltFactor, shadingFactor);
    const maxSavingsSystem = calculateSystemMetrics(monthlyBill, 1.25, utilityRate, sunshineHours, tiltFactor, shadingFactor);

    // Send confirmation email to user
    const emailHtml = `
      <h2>Your Solar Savings Estimate</h2>
      <p>Here's your personalized solar savings analysis for ${data.address}:</p>

      <div style="margin: 20px 0;">
        <h3 style="color: #2196f3;">Economy System (75% of Recommended)</h3>
        <ul>
          <li>System Size: ${economySystem.systemSizeKW.toFixed(1)} kW (${economySystem.numberOfPanels} panels)</li>
          <li>Monthly Savings: $${economySystem.monthlySavings.toFixed(2)}</li>
          <li>25-Year Total Savings: $${Math.round(economySystem.totalSavings25Year).toLocaleString()}</li>
          <li>System Cost: $${Math.round(economySystem.systemCost).toLocaleString()}</li>
          <li>Net Cost (after 30% tax credit): $${Math.round(economySystem.netCostAfterTaxCredit).toLocaleString()}</li>
        </ul>

        <h4 style="color: #1976d2;">Financing Options:</h4>
        <ul>
          <li>Cash Purchase:
            <ul>
              <li>Upfront Cost: $${Math.round(economySystem.financingOptions.cash.upfrontCost).toLocaleString()}</li>
              <li>Monthly Payment: $0</li>
              <li>Breakeven: ${economySystem.financingOptions.cash.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(economySystem.financingOptions.cash.netSavings).toLocaleString()}</li>
            </ul>
          </li>
          <li>Solar Loan (${(SOLAR_LOAN_RATE * 100).toFixed(1)}% APR, ${SOLAR_LOAN_TERM_YEARS} years):
            <ul>
              <li>Upfront Cost: $0</li>
              <li>Monthly Payment: $${Math.round(economySystem.financingOptions.loan.monthlyPayment).toLocaleString()}</li>
              <li>Breakeven: ${economySystem.financingOptions.loan.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(economySystem.financingOptions.loan.netSavings).toLocaleString()}</li>
            </ul>
          </li>
          <li>Solar Lease (${(SOLAR_LEASE_ESCALATOR * 100).toFixed(1)}% annual escalator):
            <ul>
              <li>Upfront Cost: $0</li>
              <li>Monthly Payment: $${Math.round(economySystem.financingOptions.lease.monthlyPayment).toLocaleString()}</li>
              <li>Breakeven: ${economySystem.financingOptions.lease.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(economySystem.financingOptions.lease.netSavings).toLocaleString()}</li>
            </ul>
          </li>
        </ul>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #4caf50;">Recommended System (100%)</h3>
        <ul>
          <li>System Size: ${recommendedSystem.systemSizeKW.toFixed(1)} kW (${recommendedSystem.numberOfPanels} panels)</li>
          <li>Monthly Savings: $${recommendedSystem.monthlySavings.toFixed(2)}</li>
          <li>25-Year Total Savings: $${Math.round(recommendedSystem.totalSavings25Year).toLocaleString()}</li>
          <li>System Cost: $${Math.round(recommendedSystem.systemCost).toLocaleString()}</li>
          <li>Net Cost (after 30% tax credit): $${Math.round(recommendedSystem.netCostAfterTaxCredit).toLocaleString()}</li>
        </ul>

        <h4 style="color: #1976d2;">Financing Options:</h4>
        <ul>
          <li>Cash Purchase:
            <ul>
              <li>Upfront Cost: $${Math.round(recommendedSystem.financingOptions.cash.upfrontCost).toLocaleString()}</li>
              <li>Monthly Payment: $0</li>
              <li>Breakeven: ${recommendedSystem.financingOptions.cash.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(recommendedSystem.financingOptions.cash.netSavings).toLocaleString()}</li>
            </ul>
          </li>
          <li>Solar Loan (${(SOLAR_LOAN_RATE * 100).toFixed(1)}% APR, ${SOLAR_LOAN_TERM_YEARS} years):
            <ul>
              <li>Upfront Cost: $0</li>
              <li>Monthly Payment: $${Math.round(recommendedSystem.financingOptions.loan.monthlyPayment).toLocaleString()}</li>
              <li>Breakeven: ${recommendedSystem.financingOptions.loan.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(recommendedSystem.financingOptions.loan.netSavings).toLocaleString()}</li>
            </ul>
          </li>
          <li>Solar Lease (${(SOLAR_LEASE_ESCALATOR * 100).toFixed(1)}% annual escalator):
            <ul>
              <li>Upfront Cost: $0</li>
              <li>Monthly Payment: $${Math.round(recommendedSystem.financingOptions.lease.monthlyPayment).toLocaleString()}</li>
              <li>Breakeven: ${recommendedSystem.financingOptions.lease.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(recommendedSystem.financingOptions.lease.netSavings).toLocaleString()}</li>
            </ul>
          </li>
        </ul>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #ff9800;">Maximum Savings System (125%)</h3>
        <ul>
          <li>System Size: ${maxSavingsSystem.systemSizeKW.toFixed(1)} kW (${maxSavingsSystem.numberOfPanels} panels)</li>
          <li>Monthly Savings: $${maxSavingsSystem.monthlySavings.toFixed(2)}</li>
          <li>25-Year Total Savings: $${Math.round(maxSavingsSystem.totalSavings25Year).toLocaleString()}</li>
          <li>System Cost: $${Math.round(maxSavingsSystem.systemCost).toLocaleString()}</li>
          <li>Net Cost (after 30% tax credit): $${Math.round(maxSavingsSystem.netCostAfterTaxCredit).toLocaleString()}</li>
        </ul>

        <h4 style="color: #1976d2;">Financing Options:</h4>
        <ul>
          <li>Cash Purchase:
            <ul>
              <li>Upfront Cost: $${Math.round(maxSavingsSystem.financingOptions.cash.upfrontCost).toLocaleString()}</li>
              <li>Monthly Payment: $0</li>
              <li>Breakeven: ${maxSavingsSystem.financingOptions.cash.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(maxSavingsSystem.financingOptions.cash.netSavings).toLocaleString()}</li>
            </ul>
          </li>
          <li>Solar Loan (${(SOLAR_LOAN_RATE * 100).toFixed(1)}% APR, ${SOLAR_LOAN_TERM_YEARS} years):
            <ul>
              <li>Upfront Cost: $0</li>
              <li>Monthly Payment: $${Math.round(maxSavingsSystem.financingOptions.loan.monthlyPayment).toLocaleString()}</li>
              <li>Breakeven: ${maxSavingsSystem.financingOptions.loan.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(maxSavingsSystem.financingOptions.loan.netSavings).toLocaleString()}</li>
            </ul>
          </li>
          <li>Solar Lease (${(SOLAR_LEASE_ESCALATOR * 100).toFixed(1)}% annual escalator):
            <ul>
              <li>Upfront Cost: $0</li>
              <li>Monthly Payment: $${Math.round(maxSavingsSystem.financingOptions.lease.monthlyPayment).toLocaleString()}</li>
              <li>Breakeven: ${maxSavingsSystem.financingOptions.lease.breakevenYears} years</li>
              <li>25-Year Net Savings: $${Math.round(maxSavingsSystem.financingOptions.lease.netSavings).toLocaleString()}</li>
            </ul>
          </li>
        </ul>
      </div>

      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <h3 style="color: #673ab7;">💡 Pro Tip</h3>
        <p>
          Each financing option has its benefits:
          <ul>
            <li>Cash Purchase: Highest long-term savings, no monthly payments</li>
            <li>Solar Loan: $0 down, own your system, federal tax credit eligible</li>
            <li>Solar Lease: $0 down, includes maintenance, lower savings but no responsibility</li>
          </ul>
          Our experts will help you choose the best financing option based on your goals and financial situation.
        </p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #009688;">Environmental Impact (Recommended System)</h3>
        <p>
          Your solar system will offset approximately ${Math.round(recommendedSystem.yearlyProduction * KG_CO2_PER_KWH)} kg of CO₂ per year.<br>
          That's equivalent to:
          <ul>
            <li>Planting ${Math.round(recommendedSystem.yearlyProduction * KG_CO2_PER_KWH / 21.7)} trees per year</li>
            <li>Taking ${Math.round(recommendedSystem.yearlyProduction * KG_CO2_PER_KWH / 4600)} cars off the road</li>
          </ul>
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "Solar Estimator <quotes@halcyox.com>",
      to: [data.email],
      subject: "Your Solar Energy Quote",
      html: emailHtml,
    });

    // Send email notification to admin
    await resend.emails.send({
      from: 'Solar Estimator <noreply@halcyox.com>',
      to: 'cubelocked@gmail.com',
      subject: 'New Solar Lead',
      html: `
        <h2>New Solar Lead from Solar Estimator</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ''}
        <p><strong>Estimated Monthly Savings:</strong> $${recommendedSystem.monthlySavings.toFixed(2)}</p>
        <p><strong>25-Year Savings:</strong> $${Math.round(recommendedSystem.totalSavings25Year).toLocaleString()}</p>
        <p><strong>Recommended System Size:</strong> ${recommendedSystem.systemSizeKW.toFixed(1)} kW</p>
        <p><strong>CO₂ Reduction:</strong> ${Math.round(recommendedSystem.yearlyProduction * KG_CO2_PER_KWH)} kg</p>
        <p><strong>Trees Equivalent:</strong> ${Math.round(recommendedSystem.yearlyProduction * KG_CO2_PER_KWH / 21.7)} trees</p>
        ${data.propertyType ? `<p><strong>Property Type:</strong> ${data.propertyType}</p>` : ''}
        ${data.ownership ? `<p><strong>Ownership:</strong> ${data.ownership}</p>` : ''}
        ${data.roofAge ? `<p><strong>Roof Age:</strong> ${data.roofAge} years</p>` : ''}
        ${data.monthlyBill ? `<p><strong>Monthly Bill:</strong> $${data.monthlyBill}</p>` : ''}
        ${data.utilityProvider ? `<p><strong>Utility Provider:</strong> ${data.utilityProvider}</p>` : ''}
      `,
    });

    return NextResponse.json(
      { message: 'Lead successfully submitted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process lead submission' },
      { status: 500 }
    );
  }
}
