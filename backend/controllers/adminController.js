const Instrument = require("../models/Instrument");

const getAdminStatus = (_req, res) => {
  res.json({ success: true, message: "Admin API operational" });
};

const createInstrument = async (req, res) => {
  try {
    const instrument = new Instrument(req.body);
    await instrument.save();
    res.status(201).json({ success: true, data: instrument });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `instrument_id "${req.body.instrument_id}" already exists`,
      });
    }
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const listInstruments = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip  = (page - 1) * limit;

    const [instruments, total] = await Promise.all([
      Instrument.find({}, "-__v").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Instrument.countDocuments(),
    ]);

    res.json({
      success: true,
      data: instruments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const getInstrument = async (req, res) => {
  try {
    const instrument = await Instrument.findOne({ instrument_id: req.params.id }, "-__v").lean();
    if (!instrument) return res.status(404).json({ success: false, message: "Instrument not found" });
    res.json({ success: true, data: instrument });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getAdminStatus, createInstrument, listInstruments, getInstrument };
