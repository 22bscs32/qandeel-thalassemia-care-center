const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");
const sendEmail = require("../utils/sendEmail");

// Add volunteer
router.post("/", async (req, res) => {
  try {
    const { fullName, phone, email, city, role, message } = req.body;

    const volunteer = new Volunteer({
      fullName,
      phone,
      email,
      city,
      role,
      message,
    });

    await volunteer.save();

    await sendEmail(
      "New Volunteer Application",
      `
New volunteer application submitted:

Name: ${fullName}
Phone: ${phone}
Email: ${email}
City: ${city}
Role: ${role}
Message: ${message}
      `
    );

    res.status(201).json({
      message: "Volunteer application submitted successfully",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting volunteer application",
      error: error.message,
    });
  }
});

// Get all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching volunteers",
      error: error.message,
    });
  }
});

// Delete volunteer
router.delete("/:id", async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting volunteer",
      error: error.message,
    });
  }
});

module.exports = router;