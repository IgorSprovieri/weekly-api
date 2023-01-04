const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const validation = require("../validation");
const usersList = require("../models/users");
const sessionsList = require("../models/sessions");

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const currentEmail = req.headers.email;

    if (!validation.validateIdObject(id)) {
      return res.status(400).json({ error: "Id is invalid" });
    }

    if (!validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessionFound = await sessionsList.findById(id);

    if (!sessionFound) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (!sessionFound.user_id.equals(userFound[0]._id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json(sessionFound);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/logout/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const currentEmail = req.headers.email;

    if (!validation.validateIdObject(id)) {
      return res.status(400).json({ error: "Id is invalid" });
    }

    if (!validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    const userFound = usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      res.status(404).json({ error: "User not found" });
    }

    const sessionFound = await sessionsList.findById(id);

    if (!sessionFound) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (!sessionFound.user_id.equals(userFound[0]._id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    await sessionsList.findByIdAndDelete(id);

    return res.status(200).json({ success: "logout completed" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
