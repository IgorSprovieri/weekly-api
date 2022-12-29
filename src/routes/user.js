const express = require("express");
const router = express.Router();
const usersList = require("../lists/users");
const tasksList = require("../lists/tasks");
const sessionsList = require("../lists/sessions");
const bcrypt = require("bcrypt");

router.get("/sessions/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.headers.email;

  if (!id) {
    return res.status(400).json({ error: "Id is mandatory" });
  }

  if (!email) {
    return res.status(400).json({ error: "User email is mandatory" });
  }

  try {
    const userFound = await usersList.find({ email: email });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userFound[0]._id != id) {
      return res.status(403).json({ error: "Access denied" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const sessions = await sessionsList.find({ user_id: id });

    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    await usersList.validate({
      email: email,
      password: password,
    });
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
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
    });

    return res.status(200).json({
      user_id: userFound[0]._id,
      name: userFound[0].name,
      email: userFound[0].email,
      session_id: sessionCreated._id,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (name.length < 3) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    await usersList.validate({
      name: name,
      email: email,
      password: password,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  const alreadyExists = await usersList.exists({ email: email });

  if (alreadyExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hash = bcrypt.hashSync(password, 10);

  try {
    const newUser = await usersList.create({
      name: name,
      email: email,
      password: "0000",
      passwordHash: hash,
    });

    const sessionCreated = await sessionsList.create({
      user_id: newUser._id,
    });

    return res.status(200).json({
      user_id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      session_id: sessionCreated._id,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  const email = req.headers.email;
  const password = req.body.password;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Id is mandatory" });
  }

  try {
    await usersList.validate({
      _id: id,
      email: email,
      password: password,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const userFound = await usersList.findById(id);

    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userFound.email != email) {
      return res.status(403).json({ error: "Email is invalid" });
    }
    const checkPassword = await bcrypt.compareSync(
      password,
      userFound.passwordHash
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
  const email = req.headers.email;
  const { newName, newEmail, newPassword, password } = req.body;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Id is mandatory" });
  }

  try {
    await usersList.validate({
      _id: id,
      email: email,
      password: password,
    });
    await usersList.validate({
      name: newName,
      email: newEmail || email,
      password: newPassword || password,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const userFound = await usersList.findById(id);

    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userFound.email != email) {
      return res.status(403).json({ error: "Email is invalid" });
    }

    const checkPassword = await bcrypt.compareSync(
      password,
      userFound.passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    if (newEmail) {
      const alreadyExists = await usersList.exists({ email: newEmail });

      if (alreadyExists) {
        return res.status(400).json({ error: "New e-mail already exists" });
      }
    }

    const hash = bcrypt.hashSync(newPassword || password, 10);
    const userUpdated = await usersList.findByIdAndUpdate(
      id,
      {
        name: newName,
        email: newEmail,
        password: "0000",
        passwordHash: hash,
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
