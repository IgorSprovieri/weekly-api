const express = require("express");
const router = express.Router();
const usersList = require("../lists/users");
const sessionsList = require("../lists/sessions");

router.get("/", async (req, res) => {
  try {
    const session_id = req.headers.session_id;
    const user_id = req.headers.user_id;
    if (!session_id || !user_id) {
      return res
        .status(400)
        .json({ error: "Session id and user id is required" });
    }

    await sessionsList.validate({
      _id: session_id,
      user_id: user_id,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const sessionFound = await sessionsList.findById(session_id);

    if (!sessionFound) {
      res.status(404).json({ error: "Session not found" });
    }

    if (sessionFound.user_id != user_id) {
      res.status(403).json({ error: "Session is invalid" });
    }

    res.status(200).json(sessionFound);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/logout/:id", async (req, res) => {
  const session_id = req.params.id;
  const user_id = req.headers.user_id;

  if (!session_id || !user_id) {
    return res
      .status(400)
      .json({ error: "Session id and user id is required" });
  }

  try {
    await sessionsList.validate({
      _id: session_id,
      user_id: user_id,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const userExists = await usersList.exists({ _id: user_id });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessionFound = await sessionsList.findById(session_id);

    if (!sessionFound) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (user_id != sessionFound.user_id) {
      return res.status(403).json({ error: "Acces denied" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    await sessionsList.findByIdAndDelete(session_id);

    return res.status(200).json({ success: "logout completed" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
