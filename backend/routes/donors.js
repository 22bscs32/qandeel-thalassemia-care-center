const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const sendEmail = require("../utils/sendEmail");

// Add donor
router.post("/", async (req, res) => {
  try {
    const { fullName, bloodGroup, phone, city } = req.body;

    const donor = new Donor({
      fullName,
      bloodGroup,
      phone,
      city,
    });

    await donor.save();

    // Send Email Notification
    await sendEmail(
      "New Blood Donor Registered",
      `
New donor registered:

Name: ${fullName}
Blood Group: ${bloodGroup}
Phone: ${phone}
City: ${city}
      `
    );

    res.status(201).json({
      message: "Donor registered successfully",
      donor,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error registering donor",
      error: error.message,
    });
  }
});

// Get all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching donors",
      error: error.message,
    });
  }
});

// Delete donor
router.delete("/:id", async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);

    res.json({
      message: "Donor deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting donor",
      error: error.message,
    });
  }
});

module.exports = router;