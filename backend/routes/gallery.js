const express = require("express");
const router = express.Router();
const multer = require("multer");
const Gallery = require("../models/Gallery");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { title, description } = req.body;

   const fileUrl = req.file
  ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
  : "";

    const fileType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";

    const gallery = new Gallery({
      title,
      description,
      fileUrl,
      fileType,
    });

    await gallery.save();

    res.status(201).json({
      message: "Gallery item added successfully",
      gallery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding gallery item",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching gallery",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting gallery item",
      error: error.message,
    });
  }
});

module.exports = router;