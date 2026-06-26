const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const sendEmail = require("../utils/sendEmail");

// Add patient
router.post("/", async (req, res) => {
  try {
    const { patientName, age, bloodGroup, guardianName, phone, city } = req.body;

    const patient = new Patient({
      patientName,
      age,
      bloodGroup,
      guardianName,
      phone,
      city,
    });

    await patient.save();

    await sendEmail(
      "New Patient Registered",
      `
New patient registered:

Patient Name: ${patientName}
Age: ${age}
Blood Group: ${bloodGroup}
Guardian: ${guardianName}
Phone: ${phone}
City: ${city}
      `
    );

    res.status(201).json({
      message: "Patient registered successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering patient",
      error: error.message,
    });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching patients",
      error: error.message,
    });
  }
});

// Update patient treatment
router.put("/:id/treatment", async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        treatmentStatus: req.body.treatmentStatus,
        hospitalName: req.body.hospitalName,
        doctorName: req.body.doctorName,
        treatmentDate: req.body.treatmentDate,
        treatmentCompleted: req.body.treatmentCompleted,
      },
      { new: true }
    );

    res.json({
      message: "Treatment details updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating treatment details",
      error: error.message,
    });
  }
});

// Delete patient
router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting patient",
      error: error.message,
    });
  }
});

module.exports = router;