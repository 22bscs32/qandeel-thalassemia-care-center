const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  guardianName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },

  treatmentStatus: {
    type: String,
    default: "Registered",
  },
  hospitalName: {
    type: String,
    default: "",
  },
  doctorName: {
    type: String,
    default: "",
  },
  treatmentDate: {
    type: String,
    default: "",
  },
  treatmentCompleted: {
    type: String,
    default: "No",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Patient", patientSchema);