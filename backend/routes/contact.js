const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// Add contact message
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;

    const contact = new Contact({
      fullName,
      email,
      phone,
      message,
    });

    await contact.save();

    await sendEmail(
      "New Contact Message Received",
      `
New contact message:

Name: ${fullName}
Email: ${email}
Phone: ${phone}

Message:
${message}
      `
    );

    res.status(201).json({
      message: "Message sent successfully",
      contact,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching messages",
      error: error.message,
    });
  }
});

// Delete message
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      message: "Message deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting message",
      error: error.message,
    });
  }
});

module.exports = router;