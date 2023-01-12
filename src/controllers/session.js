const usersList = require("../models/users");
const validation = require("../libs/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");
const Mail = require("../libs/Mail");

class sessionController {
  async login(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      if (!email || !validation.validateEmail(email)) {
        return res.status(400).json({ error: "E-mail or password is invalid" });
      }

      if (!password || !validation.validatePassword(password)) {
        return res.status(400).json({ error: "E-mail or password is invalid" });
      }

      const userFound = await usersList.find({ email: email });

      if (!userFound[0]) {
        return res.status(401).json({ error: "E-mail or password is invalid" });
      }

      const checkPassword = await bcrypt.compareSync(
        password,
        userFound[0].passwordHash
      );

      if (!checkPassword) {
        return res.status(401).json({ error: "E-mail or password is invalid" });
      }

      const token = jwt.sign({ id: userFound._id }, process.env.JWT_HASH, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        user_id: userFound[0]._id,
        name: userFound[0].name,
        email: userFound[0].email,
        token: token,
      });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const email = req.body.email;

      if (!email || !validation.validateEmail(email)) {
        return res.status(400).json({ error: "E-mail or password is invalid" });
      }

      const userFound = await usersList.find({ email: email });

      if (!userFound[0]) {
        return res.status(404).json({ error: "User not found" });
      }

      const resetPasswordToken = randomToken(6);
      const resetPasswordTokenHash = bcrypt.hashSync(resetPasswordToken, 10);

      usersList.findByIdAndUpdate(userFound[0]._id, {
        resetPasswordToken: resetPasswordTokenHash,
        resetPasswordTokenCratedAt: Date.now(),
      });

      const mailResponse = Mail.sendForgotPasswordEmail(
        userFound[0].email,
        userFound[0].name,
        resetPasswordToken
      );

      return res.status(200).json({ mailResponse });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new sessionController();
