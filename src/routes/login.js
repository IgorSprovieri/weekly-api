const express = require("express");
const router = express.Router();
const usersList = require("../schemas/usersList");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await usersList.find({ email: email });

    if (!userFound[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFound[0].passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    const token = randomToken(16);

    const userUpdated = await usersList.findByIdAndUpdate(
      userFound[0].id,
      {
        name: userFound[0].name,
        email: userFound[0].email,
        passwordHash: userFound[0].passwordHash,
        token: token,
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
