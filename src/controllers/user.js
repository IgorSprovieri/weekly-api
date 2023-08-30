const bcrypt = require("bcrypt");
const usersList = require("../models/users");
const tasksList = require("../models/tasks");
const validation = require("../libs/validation");

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

      const alreadyExists = await usersList.exists({ email: email });

      if (alreadyExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      const newUser = await usersList.create({
        name: name,
        email: email,
        passwordHash: passwordHash,
      });

      return res.status(201).json({
        user_id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async get(req, res) {
    try {
      const id = req.userId;

      if (!id || !validation.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      const userFound = await usersList.findById(id);

      return res.status(200).json({
        user_id: userFound._id,
        name: userFound.name,
        email: userFound.email,
      });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async put(req, res) {
    try {
      const id = req.userId;
      const { name, email } = req.body;

      if (!id || !validation.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      if (email) {
        if (!validation.validateEmail(email)) {
          return res.status(400).json({ error: "E-mail is invalid" });
        }

        const alreadyExists = await usersList.exists({ email: newEmail });

        if (alreadyExists) {
          return res.status(400).json({ error: "E-mail already exists" });
        }
      }

      const updatedUser = await usersList.findByIdAndUpdate(
        id,
        {
          name: name,
          email: email,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.userId;
      const password = req.body.password;

      if (!id || !validation.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      if (!password || !validation.validatePassword(password)) {
        return res.status(401).json({ error: "Password is invalid" });
      }

      const userFound = await usersList.findById(id);

      const checkPassword = await bcrypt.compareSync(
        password,
        userFound.passwordHash
      );

      if (!checkPassword) {
        return res.status(401).json({ error: "Password is invalid" });
      }

      await usersList.findByIdAndRemove(id);
      await tasksList.deleteMany({ user_id: id });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new userController();
