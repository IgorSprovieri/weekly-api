const express = require("express");
const router = express.Router();
const usersList = require("../schemas/usersList");
const tasksList = require("../schemas/tasksList");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");
const checkToken = require("../checkToken");

function checkOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing information" });
    }

    if (name.length < 3) {
      return res.status(400).json({
        error: "The name need to be grater than 2 characters",
      });
    }

    if (checkOnlyNumbers(password) == false || password.length != 4) {
      return res.status(400).json({
        error: "The password need to be 4 numbers and the type is string",
      });
    }

    if (email.length < 3 || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const checkAlreadyExists = await usersList.exists({ email: email });

    if (checkAlreadyExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const token = randomToken(16);

    const newUser = await usersList.create({
      name: name,
      email: email,
      passwordHash: hash,
      token: token,
    });

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = req.header.token;
    const id = req.params.id;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Current email and password is necessary on body" });
    }

    if (!id || !token) {
      return res
        .status(400)
        .json({ error: "Missing information: id or token" });
    }

    if (checkOnlyNumbers(password) == false || password.length != 4) {
      return res.status(400).json({
        error: "The password need to be 4 numbers and the type is string",
      });
    }

    if (email.length < 3 || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const userFound = await usersList.findById(id);

    if (!userFound[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkTokenResponse = await checkToken(id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFound[0].passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    await usersList.findByIdAndRemove(id);
    await tasksList.find({ user_id: id });

    return res.status(200).json({ success: "User deleted" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { newName, newEmail, newPassword, email, password } = req.body;
    const token = req.header.token;
    const id = req.params.id;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Current email and password is necessary on body" });
    }

    if (!id || !token) {
      return res
        .status(400)
        .json({ error: "Missing information: id or token" });
    }

    if (checkOnlyNumbers(password) == false || password.length != 4) {
      return res.status(400).json({
        error: "The password need to be 4 numbers and the type is string",
      });
    }

    if (email.length < 3 || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (newName) {
      if (newName.length < 3) {
        return res.status(400).json({ error: "New name is inavlid" });
      }
    }

    if (newEmail) {
      if (
        newEmail.length < 3 ||
        !newEmail.includes("@") ||
        !newEmail.includes(".")
      ) {
        return res.status(400).json({ error: "New email is invalid" });
      }
    }

    if (newPassword) {
      if (checkOnlyNumbers(newPassword) == false || newPassword.length != 4) {
        return res.status(400).json({
          error: "The new password need to be 4 numbers and the type is string",
        });
      }
    }

    const userFound = await usersList.findById(id);

    if (!userFound[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkTokenResponse = await checkToken(id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFound[0].passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    const hash = () => {
      if (newPassword) {
        return bcrypt.hashSync(newPassword, 10);
      } else {
        return bcrypt.hashSync(password, 10);
      }
    };

    const userUpdated = await usersList.findByIdAndUpdate(
      id,
      {
        name: newName,
        email: newEmail,
        passwordHash: hash,
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
