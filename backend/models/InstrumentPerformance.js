const mongoose = require("mongoose");

const instrumentPerformanceSchema = new mongoose.Schema(
  {
    instrument_id: { type: String, required: true, trim: true },
    fy:            { type: String, required: true, trim: true },
    return_pct:    { type: Number, default: null },
    return_type: {
      type: String, required: true,
      enum: ["statutory_rate", "benchmark_index", "category_median", "gold_price_change", "inflation_cpi"],
    },
    benchmark_name: { type: String, default: null },
    is_estimated:   { type: Boolean, required: true },
    data_source:    { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "instrument_performance",
  }
);

instrumentPerformanceSchema.index({ instrument_id: 1, fy: 1 }, { unique: true });
instrumentPerformanceSchema.index({ fy: 1 });

module.exports = mongoose.model("InstrumentPerformance", instrumentPerformanceSchema);
