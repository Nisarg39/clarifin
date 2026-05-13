const mongoose = require("mongoose");

const instrumentDerivedSchema = new mongoose.Schema(
  {
    instrument_id: {
      type: String,
      required: true,
      trim: true,
    },
    as_of_fy: {
      type: String,
      required: true,
      trim: true,
      // Format: "FY2025" — the latest FY this was computed from
    },

    // ── RETURN AVERAGES ──
    avg_return_3yr_pct: {
      type: Number,
      default: null,
    },
    avg_return_5yr_pct: {
      type: Number,
      default: null,
    },
    avg_return_10yr_pct: {
      type: Number,
      default: null,
    },

    // ── CAGR ──
    cagr_3yr_pct: {
      type: Number,
      default: null,
    },
    cagr_5yr_pct: {
      type: Number,
      default: null,
    },
    cagr_10yr_pct: {
      type: Number,
      default: null,
    },

    // ── REAL RETURN ──
    avg_real_return_5yr_pct: {
      type: Number,
      default: null,
    },

    // ── RISK INDICATORS ──
    volatility_std_dev_pct: {
      type: Number,
      default: null,
    },
    best_year_return_pct: {
      type: Number,
      default: null,
    },
    worst_year_return_pct: {
      type: Number,
      default: null,
    },
    positive_return_rate_pct: {
      type: Number,
      default: null,
    },

    // ── COST-ADJUSTED ──
    avg_net_return_5yr_pct: {
      type: Number,
      default: null,
    },

    data_as_of_date: {
      type: Date,
      required: true,
    },
    compliance_note: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "instrument_derived",
  }
);

// One derived record per instrument per FY snapshot
instrumentDerivedSchema.index({ instrument_id: 1, as_of_fy: 1 }, { unique: true });

module.exports = mongoose.model("InstrumentDerived", instrumentDerivedSchema);
