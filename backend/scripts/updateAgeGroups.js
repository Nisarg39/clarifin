require("dotenv").config();
const mongoose = require("mongoose");
const Instrument = require("../models/Instrument");

// ideal_age_min / ideal_age_max = age group for which this instrument is BEST SUITED
// null = no upper/lower constraint for suitability
const AGE_GROUPS = {
  // Long-term equity — best started before 50 to get full compounding runway
  "mutual-fund-equity-large-cap": { min: 18, max: 55 },
  "elss":                         { min: 18, max: 55 },  // 3yr lock-in, equity — should reduce at 55+
  "nifty-50-index-etf":           { min: 18, max: 55 },  // passive equity, same reasoning
  "listed-equity-stock":          { min: 18, max: 50 },  // direct stock picking needs active attention; not ideal near retirement

  // Debt / safe instruments — suitable across all working ages
  "ppf":                          { min: 18, max: 45 },  // 15yr lock-in; starting after 45 limits compounding benefit
  "bank-fd":                      { min: 18, max: null },
  "tax-saver-fd":                 { min: 18, max: 57 },  // 5yr lock-in; starts at 57 → matures at 62, still fine
  "g-sec":                        { min: 18, max: null },
  "corporate-bond-ncd":           { min: 25, max: null },
  "mutual-fund-liquid":           { min: 18, max: null },

  // Gold / real assets — diversification benefit across all ages
  "sgb":                          { min: 18, max: null }, // 8yr maturity; early exit from yr5 gives flexibility

  // Real estate / infrastructure income — moderate tenure required
  "reit":                         { min: 25, max: null },
  "invit":                        { min: 25, max: null },

  // Pension — locked till 60; equity sub-scheme best started early
  "nps-tier1-e":                  { min: 18, max: 50 },  // equity NPS; too short runway if started after 50
  "nps-tier1-c":                  { min: 18, max: 58 },  // corporate bond NPS; moderate risk, fine till 58
  "nps-tier1-g":                  { min: 18, max: 60 },  // G-sec NPS; ultra-safe, even 1–2yr contribution counts

  // High-risk alternative — not suitable close to retirement
  "p2p-lending":                  { min: 25, max: 50 },

  // Age-restricted schemes
  "scss":                         { min: 60, max: null }, // senior citizens only (55+ for VRS)
  "sukanya-samriddhi-yojana":     { min: 0,  max: 10  }, // girl child age at account opening
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/clarifin");
  console.log("Connected to MongoDB\n");

  for (const [id, { min, max }] of Object.entries(AGE_GROUPS)) {
    const result = await Instrument.updateOne(
      { instrument_id: id },
      { $set: { ideal_age_min: min, ideal_age_max: max } }
    );
    const tag = min === null && max === null ? "any → any"
      : min === null ? `any → ${max}`
      : max === null ? `${min} → any`
      : `${min} → ${max}`;
    if (result.matchedCount === 0) console.log(`  ✗ Not found: ${id}`);
    else console.log(`  ✓ ${id.padEnd(36)} ${tag}`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
