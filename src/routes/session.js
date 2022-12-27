const express = require("express");
const router = express.Router();
const usersList = require("../lists/users");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");

function checkOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Missing information: email or password" });
    }

    if (checkOnlyNumbers(password) == false || password.length != 4) {
      return res.status(400).json({
        error: "The password need to be 4 numbers and the type is string",
      });
    }

    if (email.length < 3 || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Invalid email" });
    }

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

router.put("/logout/:id", async (req, res) => {
  try {
    const token = req.headers.token;
    const id = req.params.id;

    if (!id || !token) {
      return res
        .status(400)
        .json({ error: "Missing information: id or token" });
    }

    const userFound = await usersList.findById(id);

    if (!userFound[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkTokenResponse = await checkToken(id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const newToken = randomToken(16);

    await usersList.findByIdAndUpdate(id, {
      token: newToken,
    });

    return res.status(200).json({ success: "logout completed" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
