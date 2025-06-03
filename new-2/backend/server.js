const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const stationRoutes = require("./routes/stations");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//Public API Endpoint (no authentication)
app.get("/api/public-test", (req, res) => {
  res.json({
    status: "success",
    message: "Public API endpoint is working",
    timestamp: new Date().toISOString(),
  });
});

//Middleware
app.use(cors());
app.use(express.json());

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);

//Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connection established");
    app.listen(PORT, () =>
      console.log(`🚀 Backend server is running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
