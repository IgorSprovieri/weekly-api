const express = require("express");
const router = express.Router();
const usersList = require("../schemas/usersList");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");
const tk = require("../tk");

function checkOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
    const token = req.header.token;
    const id = req.params.id;

    if (tk.checkToken(id, token) == false) {
      return res.status(403).json({ error: "aceess denied" });
    }

    const userDeleted = await usersList.findByIdAndRemove(id);
    return res.status(200).json(userDeleted);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const token = req.header.token;
    const id = req.params.id;

    if (tk.checkToken(id, token) == false) {
      return res.status(403).json({ error: "aceess denied" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const userUpdated = await usersList.findByIdAndUpdate(
      id,
      {
        name: name,
        email: email,
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

/*
    if (
      typeof name == "String" ||
      typeof email == "String" ||
      typeof password == "String"
    ) {
      res.status(400).json({
        error: "The body have 3 strings: name, email and password",
      });
    }

    if (checkOnlyNumbers(password) == false || password.length != 4) {
      res.status(400).json({
        error: "The password need to be 4 numbers and the type is string",
      });
    }

    if (email.length < 3 || !email.includes("@") || !email.includes(".")) {
      res.status(400).json({ error: "Invalid email" });
    }

    const checkAlreadyExist = await usersList.find({ email: email });

    if (checkAlreadyExist) {
      res.status(400).json({ error: "User already exist" });
    }
    */
