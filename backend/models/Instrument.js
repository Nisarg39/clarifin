const mongoose = require("mongoose");

const GOAL_TAGS = [
  "emergency_fund", "tax_saving_80c", "retirement", "wealth_creation",
  "regular_income", "child_education", "short_term_parking",
  "gold_exposure", "real_estate_exposure", "inflation_hedge",
];

const instrumentSchema = new mongoose.Schema(
  {
    // ── IDENTITY ──
    instrument_id: { type: String, required: true, unique: true, trim: true },
    name:          { type: String, required: true, trim: true },
    description:   { type: String, default: "", trim: true },
    instrument_type: { type: String, required: true, trim: true, lowercase: true },
    asset_class:     { type: String, required: true, trim: true, lowercase: true },

    // ── RETURNS ──
    return_nature: {
      type: String, required: true,
      enum: ["fixed", "market_linked", "mixed"],
    },
    indicative_return_min_pct_pa: { type: Number, default: null },
    indicative_return_max_pct_pa: { type: Number, default: null },

    // ── RISK ──
    risk_level: {
      type: String, required: true,
      enum: ["low", "low_to_moderate", "moderate", "moderately_high", "high", "very_high"],
    },
    capital_protection: {
      type: String, required: true,
      enum: ["full", "partial_insured", "none"],
    },

    // ── LIQUIDITY ──
    liquidity_level: {
      type: String, required: true,
      enum: ["instant", "t1", "t2_t3", "low", "very_low", "locked"],
    },
    lock_in_years: { type: Number, default: null },

    // ── COST ──
    typical_cost_pct_pa: { type: Number, required: true },

    // ── TAXATION ──
    tax_treatment: {
      type: String, required: true,
      enum: ["EEE", "EET", "ETT", "TET", "TTT", "complex"],
    },
    suitable_for_80c:     { type: Boolean, required: true },
    tax_deduction_section: { type: String, default: null },

    // ── HORIZON & GOALS ──
    recommended_horizon: {
      type: String, required: true,
      enum: ["short", "medium", "long", "very_long"],
    },
    goal_tags: {
      type: [{ type: String, enum: GOAL_TAGS }],
      default: [],
    },
    inflation_beat_potential: {
      type: String, required: true,
      enum: ["high", "moderate", "low", "negative"],
    },

    // ── ELIGIBILITY ──
    ideal_age_min: { type: Number, default: null },
    ideal_age_max: { type: Number, default: null },

    // ── QUALITATIVE ──
    special_features: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: "instruments",
  }
);

instrumentSchema.index({ instrument_type: 1 });
instrumentSchema.index({ asset_class: 1 });
instrumentSchema.index({ risk_level: 1 });
instrumentSchema.index({ goal_tags: 1 });
instrumentSchema.index({ suitable_for_80c: 1 });

module.exports = mongoose.model("Instrument", instrumentSchema);
