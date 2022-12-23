const express = require("express");
const router = express.Router();
const usersList = require("../schemas/usersList");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");

function checkOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name == "String" ||
    typeof email == "String" ||
    typeof password == "String"
  ) {
    res.status(400).json({
      error: "The body have 3 strings: name, email and password",
    });
  }

  if (checkOnlyNumbers(password) === false || password.length != 4) {
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

  const hash = bcrypt.hashSync(password, 10);
  const token = randomToken(16);
  let today = new Date();
  let minutes = today.getMinutes + 15;
  today.setMinutes = minutes;
  const tokenVality = today;

  const newUser = await usersList.create({
    name: name,
    email: email,
    passwordHash: hash,
    token: token,
    tokenValidity: tokenVality,
  });

  return res.status(200).json(newUser);
  try {
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
