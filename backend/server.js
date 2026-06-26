const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const Donor = require("./models/Donor");
const Patient = require("./models/Patient");
const Volunteer = require("./models/Volunteer");
const Donation = require("./models/Donation");

const successStoriesRoute = require("./routes/successStories");
const adminRoutes = require("./routes/admin");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Qandeel Backend Running");
});

app.use("/api/donors", require("./routes/donors"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/volunteers", require("./routes/volunteers"));
app.use("/api/donations", require("./routes/donations"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/events", require("./routes/events"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/success-stories", successStoriesRoute);
app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/api/stats", async (req, res) => {
  try {
    const donors = await Donor.countDocuments();
    const patients = await Patient.countDocuments();
    const volunteers = await Volunteer.countDocuments();
    const donations = await Donation.countDocuments();

    res.json({
      donors,
      patients,
      volunteers,
      donations,

      totalPatients: 300,
      treatedPatients: 150,
      improvedChildren: 146,
      successRate: "97.3%",
      waitingPatients: 150,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching stats",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});