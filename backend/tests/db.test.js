const mongoose = require("mongoose");
const connectDB = require("../config/db");

(async () => {
  try {
    await connectDB();
    console.log("✓ Connection state:", mongoose.connection.readyState === 1 ? "connected" : "not connected");
    console.log("✓ DB name:", mongoose.connection.name);
  } catch (err) {
    console.error("✗ Test failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("✓ Disconnected cleanly");
  }
})();
