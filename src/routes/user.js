const express = require("express");
const router = express.Router();
const validation = require("../validation");
const usersList = require("../models/users");
const tasksList = require("../models/tasks");
const sessionsList = require("../models/sessions");
const bcrypt = require("bcrypt");

router.get("/sessions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const currentEmail = req.headers.email;

    if (!id || !validation.validateIdObject(id)) {
      return res.status(400).json({ error: "Id is invalid" });
    }

    if (!currentEmail || !validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!userFound[0]._id.equals(id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const sessions = await sessionsList.find({ user_id: userFound[0]._id });

    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    const password = req.query.password;
    const device = req.headers.device;

    if (!email || !validation.validateEmail(email)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    if (!password || !validation.validatePassword(password)) {
      return res.status(400).json({ error: "Password is invalid" });
    }

    if (!device) {
      return res
        .status(400)
        .json({ error: "Device name is required to open the session" });
    }

    const userFound = await usersList.find({ email: email });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFound[0].passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    const sessionCreated = await sessionsList.create({
      user_id: userFound[0]._id,
      device: device,
      createdOn: new Date(),
    });

    return res.status(200).json({
      user_id: userFound[0]._id,
      name: userFound[0].name,
      email: userFound[0].email,
      session_createdOn: sessionCreated.createdOn,
      session_id: sessionCreated._id,
      session_device: sessionCreated.device,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const device = req.headers.device;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email || !validation.validateEmail(email)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    if (!password || !validation.validatePassword(password)) {
      return res.status(400).json({ error: "Password is invalid" });
    }

    if (!device) {
      return res
        .status(400)
        .json({ error: "Device name is required to open the session" });
    }

    const alreadyExists = await usersList.exists({ email: email });

    if (alreadyExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = bcrypt.hashSync(password, 10);

    const newUser = await usersList.create({
      name: name,
      email: email,
      passwordHash: hash,
    });

    const sessionCreated = await sessionsList.create({
      user_id: newUser._id,
      device: device,
      createdOn: new Date(),
    });

    return res.status(200).json({
      user_id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      session_createdOn: sessionCreated.createdOn,
      session_id: sessionCreated._id,
      session_device: sessionCreated.device,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const currentEmail = req.headers.email;
    const password = req.query.password;
    const id = req.params.id;

    if (!id || !validation.validateIdObject(id)) {
      return res.status(400).json({ error: "Id is invalid" });
    }

    if (!currentEmail || !validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    if (!password || !validation.validatePassword(password)) {
      return res.status(400).json({ error: "Password is invalid" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!userFound[0]._id.equals(id)) {
      return res.status(403).json({ error: "Id is invalid" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFound[0].passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    await usersList.findByIdAndRemove(id);
    await tasksList.deleteMany({ user_id: id });
    await sessionsList.deleteMany({ user_id: id });

    return res.status(200).json({ success: "User deleted" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const currentEmail = req.headers.email;
    const id = req.params.id;
    const password = req.query.password;
    const { newName, newEmail } = req.body;

    if (!id || !validation.validateIdObject(id)) {
      return res.status(400).json({ error: "Id is invalid" });
    }

    if (!currentEmail || !validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    if (newEmail) {
      if (!validation.validateEmail(newEmail)) {
        return res.status(400).json({ error: "New e-mail is invalid" });
      }

      const alreadyExists = await usersList.exists({ email: newEmail });

      if (alreadyExists) {
        return res.status(400).json({ error: "New e-mail already exists" });
      }
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!userFound[0]._id.equals(id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFound[0].passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    const userUpdated = await usersList.findByIdAndUpdate(
      id,
      {
        name: newName,
        email: newEmail,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      user_id: userUpdated._id,
      name: userUpdated.name,
      email: userUpdated.email,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
