const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Waiting", "Sent to Karachi", "Under Treatment", "Recovered", "Follow-up"],
      default: "Waiting",
    },
    treatmentCity: {
      type: String,
      default: "",
    },
    lastCheckupDate: {
      type: String,
      default: "",
    },
    nextCheckupDate: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Treatment", treatmentSchema);