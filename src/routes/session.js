const express = require("express");
const sessions = require("../lists/sessions");
const router = express.Router();
const sessionsList = require("../lists/sessions");

router.delete("/logout/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.params.email;

  if (!id) {
    return res.status(400).json({ error: "Id is mandatory" });
  }

  if (!email) {
    return res.status(400).json({ error: "User email is mandatory" });
  }

  try {
    const userFound = await usersList.find({ email: email });

    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessionFound = await sessionsList.findById(id);

    if (!sessionFound) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (userFound._id != sessionFound.user_id) {
      return res.status(403).json({ error: "Acces denied" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
  try {
    await sessionsList.findByIdAndDelete(id);

    return res.status(200).json({ success: "logout completed" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
