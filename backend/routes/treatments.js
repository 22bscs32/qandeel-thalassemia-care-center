const express = require("express");
const router = express.Router();
const Treatment = require("../models/Treatment");

// Add treatment patient
router.post("/", async (req, res) => {
  try {
    const treatment = new Treatment(req.body);
    await treatment.save();

    res.status(201).json({
      message: "Treatment record added successfully",
      treatment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding treatment record",
      error: error.message,
    });
  }
});

// Get all treatment records
router.get("/", async (req, res) => {
  try {
    const treatments = await Treatment.find().sort({ createdAt: -1 });
    res.json(treatments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching treatment records",
      error: error.message,
    });
  }
});

// Delete treatment record
router.delete("/:id", async (req, res) => {
  try {
    await Treatment.findByIdAndDelete(req.params.id);

    res.json({
      message: "Treatment record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting treatment record",
      error: error.message,
    });
  }
});

// Update treatment status
router.put("/:id", async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Treatment record updated successfully",
      treatment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating treatment record",
      error: error.message,
    });
  }
});

// Treatment stats
router.get("/stats/summary", async (req, res) => {
  try {
    const totalPatients = await Treatment.countDocuments();

    const waitingPatients = await Treatment.countDocuments({
      status: "Waiting",
    });

    const sentToKarachi = await Treatment.countDocuments({
      status: "Sent to Karachi",
    });

    const underTreatment = await Treatment.countDocuments({
      status: "Under Treatment",
    });

    const recoveredPatients = await Treatment.countDocuments({
      status: "Recovered",
    });

    const followUpPatients = await Treatment.countDocuments({
      status: "Follow-up",
    });

    res.json({
      totalPatients,
      waitingPatients,
      sentToKarachi,
      underTreatment,
      recoveredPatients,
      followUpPatients,
      treatedPatients: sentToKarachi + underTreatment + recoveredPatients + followUpPatients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching treatment stats",
      error: error.message,
    });
  }
});

module.exports = router;