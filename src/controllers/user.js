const bcrypt = require("bcrypt");
const tasksModel = require("../models/tasks");
const validation = require("../libs/validation");
const { firebaseAuth } = require("../libs/firebase");

class userController {
  async post(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      if (!email || !validation.validateEmail(email)) {
        return res.status(400).json({ error: "E-mail is invalid" });
      }

      if (!password || !validation.validatePassword(password)) {
        return res.status(400).json({ error: "Password is invalid" });
      }

      const createdUser = await firebaseAuth.createUser({
        email,
        password,
        name,
      });

      return res.status(201).json(createdUser);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  get(req, res) {
    return req.user;
  }

  async put(req, res) {
    try {
      const { uid } = req.user;
      const { name, email } = req.body;

      const updatedUser = await firebaseAuth.updateUser(uid, { name, email });

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async delete(req, res) {
    try {
      const { uid } = req.user;

      const deletedUser = await firebaseAuth.delete(uid);

      return res.status(200).json(deletedUser);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new userController();
