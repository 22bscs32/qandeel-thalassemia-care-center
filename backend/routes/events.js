const express = require("express");
const router = express.Router();
const multer = require("multer");
const Event = require("../models/Event");

// Image storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Add Event with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, date, location, description } = req.body;

    const imagePath = req.file
      ? `http://qandeel-thalassemia-care-center-production.up.railway.app/uploads/${req.file.filename}`
      : "";

    const event = new Event({
      title,
      date,
      location,
      description,
      image: imagePath,
    });

    await event.save();

    res.status(201).json({
      message: "Event added successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding event",
      error: error.message,
    });
  }
});

// Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
});

// Delete Event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting event",
      error: error.message,
    });
  }
});

module.exports = router;