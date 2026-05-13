require("dotenv").config();
const mongoose = require("mongoose");
const Instrument = require("../models/Instrument");

const DESCRIPTIONS = {
  "ppf": "PPF is a government-backed long-term savings scheme offering guaranteed, tax-free returns at a fixed rate set quarterly by the Finance Ministry. It runs for a 15-year term (extendable in 5-year blocks indefinitely), making it one of the most reliable instruments for retirement and long-term goals. The investment, interest earned, and maturity proceeds are all fully exempt from tax (EEE status), giving it unmatched tax efficiency. It carries sovereign guarantee from the Government of India with zero default risk.",

  "bank-fd": "A bank fixed deposit lets you park a lump sum with a bank for a fixed tenure at a predetermined interest rate known upfront, making returns fully predictable regardless of market conditions. The principal is partially insured by DICGC (Deposit Insurance and Credit Guarantee Corporation) up to ₹5 lakh per depositor per bank. Interest income is added to your annual income and taxed at your applicable slab rate, making FDs less efficient for investors in higher tax brackets. They suit anyone who prioritises capital safety and short-to-medium term liquidity over return maximisation.",

  "elss": "ELSS (Equity Linked Savings Scheme) is an open-ended equity mutual fund that qualifies for Section 80C tax deductions up to ₹1.5 lakh per year under the old tax regime, with a mandatory 3-year lock-in — the shortest among all 80C instruments. The fund must invest at least 80% of its corpus in equity and equity-related instruments, giving it high long-term return potential alongside market volatility. Returns are not guaranteed; long-term capital gains above ₹1.25 lakh are taxed at 12.5% without indexation. Best suited for investors with a minimum 5–7 year horizon who want equity growth with a tax-saving overlay.",

  "sgb": "A Sovereign Gold Bond (SGB) is a RBI-issued bond denominated in grams of gold, letting investors gain gold price exposure without the cost and risk of physically storing gold. Each bond pays a 2.5% annual coupon (semi-annually) on top of gold price appreciation, and matures in 8 years with an early exit window from year 5 on RBI interest payment dates. For original subscribers holding to maturity, capital gains are fully exempt from tax; however, Budget 2026 restricted this exemption — secondary market buyers and premature redemptions now attract 12.5% LTCG. The redemption value is backed by a Government of India sovereign guarantee.",

  "nifty-50-index-etf": "A Nifty 50 ETF is a passively managed exchange-traded fund that replicates the Nifty 50 index — India's 50 largest companies by free-float market capitalisation on NSE. Unlike actively managed mutual funds, it simply mirrors the index composition with no fund manager discretion, resulting in ultra-low expense ratios as low as 0.03%. It trades on NSE and BSE like a regular stock and requires a demat account. Offering broad diversification across sectors with minimal cost, it is one of the most efficient ways for long-term investors to participate in India's equity market growth.",
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/clarifin");
  console.log("Connected to MongoDB");

  for (const [id, description] of Object.entries(DESCRIPTIONS)) {
    const result = await Instrument.updateOne(
      { instrument_id: id },
      { $set: { description } }
    );
    if (result.matchedCount === 0) {
      console.log(`  ✗ Not found: ${id}`);
    } else {
      console.log(`  ✓ Updated: ${id}`);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch(err => { console.error(err); process.exit(1); });
