const express = require("express");
const router = express.Router();

const usersList = require("../schemas/usersList");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFounded = await usersList.find({ email: email });

    if (!userFounded) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFounded.passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    const token = randomToken(16);
    let today = new Date();
    let minutes = today.getMinutes + 15;
    today.setMinutes = minutes;
    const tokenVality = today;

    const userUpdated = await usersList.findByIdAndUpdate(
      userFounded.id,
      {
        token: token,
        tokenValidity: tokenVality,
      },
      {
        new: true,
      }
    );

    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
