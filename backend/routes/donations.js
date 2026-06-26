const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const sendEmail = require("../utils/sendEmail");

// Add donation
router.post("/", async (req, res) => {
  try {
    const { fullName, phone, email, amount, donationType, message } = req.body;

    const donation = new Donation({
      fullName,
      phone,
      email,
      amount,
      donationType,
      message,
    });

    await donation.save();

    await sendEmail(
      "New Donation Received",
      `
New donation submitted:

Name: ${fullName}
Phone: ${phone}
Email: ${email}
Amount: ${amount}
Donation Type: ${donationType}
Message: ${message}
      `
    );

    res.status(201).json({
      message: "Donation submitted successfully",
      donation,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error submitting donation",
      error: error.message,
    });
  }
});

// Get all donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching donations",
      error: error.message,
    });
  }
});

// Delete donation
router.delete("/:id", async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);

    res.json({
      message: "Donation deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting donation",
      error: error.message,
    });
  }
});

module.exports = router;