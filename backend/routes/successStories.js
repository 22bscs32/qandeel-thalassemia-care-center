const express = require("express");
const router = express.Router();
const multer = require("multer");

const SuccessStory = require("../models/SuccessStory");

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// Add Success Story
router.post("/", upload.single("image"), async (req, res) => {
  try {

    const story = new SuccessStory({
      patientName: req.body.patientName,
      age: req.body.age,
      city: req.body.city,
      story: req.body.story,
      status: req.body.status,
      image: req.file ? `http://qandeel-thalassemia-care-center-production.up.railway.app/uploads/${req.file.filename}` : ""
    });

    await story.save();

    res.status(201).json({
      message: "Success Story Added",
      story
    });

  } catch (error) {
    res.status(500).json({
      message: "Error adding story",
      error: error.message
    });
  }
});


// Get All Stories
router.get("/", async (req, res) => {
  try {

    const stories = await SuccessStory.find()
      .sort({ createdAt: -1 });

    res.json(stories);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching stories"
    });
  }
});


// Delete Story
router.delete("/:id", async (req, res) => {
  try {

    await SuccessStory.findByIdAndDelete(req.params.id);

    res.json({
      message: "Story deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting story"
    });
  }
});

module.exports = router;