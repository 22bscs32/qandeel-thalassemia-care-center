const mongoose = require("mongoose");

const successStorySchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Treatment Improved",
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuccessStory", successStorySchema);