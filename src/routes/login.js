const express = require("express");
const router = express.Router();

const usersList = require("../schemas/usersList");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFounded = await usersList.find({ email: email });

    if (!userFounded[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFounded[0].passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    const token = randomToken(16);
    let today = new Date();
    let minutes = today.getMinutes + 15;
    today.setMinutes = minutes;
    const tokenValidity = today;

    const userUpdated = await usersList.findByIdAndUpdate(
      userFounded[0].id,
      {
        name: userFounded[0].name,
        email: userFounded[0].email,
        passwordHash: userFounded[0].passwordHash,
        token: token,
        tokenValidity: tokenValidity,
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
