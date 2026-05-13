const Instrument = require("../models/Instrument");
const InstrumentDerived = require("../models/InstrumentDerived");
const InstrumentPerformance = require("../models/InstrumentPerformance");

const getUserStatus = (_req, res) => {
  res.json({ success: true, message: "User API operational" });
};

const getInstruments = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
    const skip  = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const exactFields = [
      "asset_class", "risk_level", "instrument_type",
      "return_nature", "liquidity_level", "recommended_horizon",
    ];
    for (const field of exactFields) {
      if (req.query[field]) filter[field] = req.query[field];
    }

    if (req.query.suitable_for_80c !== undefined) {
      filter.suitable_for_80c = req.query.suitable_for_80c === "true";
    }

    if (req.query.goal_tags) {
      filter.goal_tags = { $in: req.query.goal_tags.split(",") };
    }

    const [instruments, total] = await Promise.all([
      Instrument.find(
        filter,
        "-__v -description -special_features -ideal_age_min -ideal_age_max -tax_deduction_section"
      )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Instrument.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: instruments,
      pagination: { page, limit, total, pages, hasMore: page < pages },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const getInstrumentDetail = async (req, res) => {
  try {
    const id = req.params.id;

    const [instrument, derived, performance] = await Promise.all([
      Instrument.findOne({ instrument_id: id }, "-__v").lean(),
      InstrumentDerived.findOne({ instrument_id: id }, "-__v -_id")
        .sort({ as_of_fy: -1 })
        .lean(),
      InstrumentPerformance.find({ instrument_id: id }, "-__v -_id")
        .sort({ fy: -1 })
        .limit(10)
        .lean(),
    ]);

    if (!instrument) {
      return res.status(404).json({ success: false, message: "Instrument not found" });
    }

    res.json({ success: true, data: { instrument, derived, performance } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const getDashboardSummary = async (_req, res) => {
  try {
    const stats = await Instrument.aggregate([
      {
        $facet: {
          asset_class: [
            { $group: { _id: "$asset_class", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          risk_level: [
            { $group: { _id: "$risk_level", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          return_nature: [
            { $group: { _id: "$return_nature", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          recommended_horizon: [
            { $group: { _id: "$recommended_horizon", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ]
        }
      }
    ]);

    res.json({ success: true, data: stats[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getUserStatus, getInstruments, getInstrumentDetail, getDashboardSummary };
