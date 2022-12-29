const express = require("express");
const router = express.Router();
const usersList = require("../lists/users");
const tasksList = require("../lists/tasks");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");
const checkToken = require("../checkToken");

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const token = randomToken(16);

  try {
    await usersList.validate({
      name: name,
      email: email,
      password: password,
      passwordHash: hash,
      token: token,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  const checkAlreadyExists = await usersList.exists({ email: email });

  if (checkAlreadyExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  try {
    const newUser = await usersList.create({
      name: name,
      email: email,
      password: "0000",
      passwordHash: hash,
      token: token,
    });

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  const { email, password } = req.body;
  const token = req.headers.token;
  const id = req.params.id;

  try {
    await usersList.validate({
      _id: id,
      email: email,
      password: password,
      passwordHash: bcrypt.hashSync(password, 10),
      token: token,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const cTkRes = await checkToken(id, token);

    if (cTkRes.access == false) {
      return res.status(cTkRes.status).json({ error: cTkRes.message });
    }

    const userFound = await usersList.findById(id);
    const checkPassword = await bcrypt.compareSync(
      password,
      userFound.passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    await usersList.findByIdAndRemove(id);
    await tasksList.deleteMany({ user_id: id });

    return res.status(200).json({ success: "User deleted" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  const { newName, newEmail, newPassword, password } = req.body;
  const token = req.headers.token;
  const id = req.params.id;

  try {
    await usersList.validate({
      _id: id,
      name: newName || "my name test",
      email: newEmail || "test@test.com",
      password: newPassword || password,
      passwordHash: bcrypt.hashSync(newPassword || password, 10),
      token: token,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const cTkRes = await checkToken(id, token);

    if (cTkRes.access == false) {
      return res.status(cTkRes.status).json({ error: cTkRes.message });
    }

    const userFound = await usersList.findById(id);

    const checkPassword = await bcrypt.compareSync(
      password,
      userFound.passwordHash
    );

    if (!checkPassword) {
      return res.status(403).json({ error: "Password is invalid" });
    }

    if (newEmail) {
      const checkAlreadyExists = await usersList.exists({ email: newEmail });

      if (checkAlreadyExists) {
        return res.status(400).json({ error: "New e-mail already exists" });
      }
    }

    const hash = bcrypt.hashSync(newPassword || password, 10);
    const userUpdated = await usersList.findByIdAndUpdate(
      id,
      {
        name: newName || userFound.name,
        email: newEmail || userFound.email,
        password: "xxxxxxxxxx",
        passwordHash: hash,
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
