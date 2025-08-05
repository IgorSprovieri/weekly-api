const usersModel = require("../models/users");
const validation = require("../libs/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randomToken = require("random-token");
const Mail = require("../libs/Mail");
const DateFNS = require("date-fns");
const commonErrors = require("../libs/commonErrors");

class SessionController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !validation.validateEmail(email)) {
        return res.status(403).json({ error: "E-mail or password is invalid" });
      }

      if (!password || !validation.validatePassword(password)) {
        return res.status(403).json({ error: "E-mail or password is invalid" });
      }

      const userFound = await usersModel.findOne({ email: email });
      if (!userFound) {
        return res.status(403).json({ error: "E-mail or password is invalid" });
      }

      const checkPassword = await bcrypt.compareSync(
        password,
        userFound.passwordHash
      );

      if (!checkPassword) {
        return res.status(403).json({ error: "E-mail or password is invalid" });
      }

      const token = jwt.sign({ userId: userFound._id }, process.env.JWT_HASH, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        user_id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        token: token,
      });
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }

  async forgotPassword(req, res) {
    try {
      const email = req.body.email;

      if (!email || !validation.validateEmail(email)) {
        return res.status(400).json({ error: "E-mail or password is invalid" });
      }

      const userFound = await usersModel.findOne({ email: email });
      if (!userFound) {
        return res.status(404).json({ error: "User not found" });
      }

      const resetPasswordToken = randomToken(6);
      const resetPasswordTokenHash = bcrypt.hashSync(resetPasswordToken, 10);

      await usersModel.findByIdAndUpdate(userFound._id, {
        resetPasswordToken: resetPasswordTokenHash,
        resetPasswordTokenCratedAt: Date.now(),
      });

      Mail.sendForgotPasswordEmail(
        userFound.email,
        userFound.name,
        resetPasswordToken
      );

      return res.status(200).json({ sucess: true });
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, email, password } = body.token;

      if (!token) {
        return res.status(400).json({ error: "Token is missing" });
      }

      if (!password || !validation.validatePassword(password)) {
        return res.status(400).json({ error: "E-mail or password is invalid" });
      }

      if (!email || !validation.validateEmail(email)) {
        return res.status(400).json({ error: "E-mail or password is invalid" });
      }

      const userFound = await usersModel.findOne({ email: email });
      if (!userFound) {
        return res.status(404).json({ error: "User not found" });
      }

      const checkToken = await bcrypt.compareSync(
        token,
        userFound.resetPasswordToken
      );

      const isValidToken = () => {
        const timeDifference = DateFNS.differenceInMinutes(
          userFound.resetPasswordTokenCratedAt,
          Date.now()
        );

        return timeDifference < 15;
      };

      if (!checkToken || !isValidToken) {
        return res.status(401).json({ error: "Token is invalid" });
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      await usersModel.findByIdAndUpdate(userFound._id, {
        passwordHash: passwordHash,
      });

      return res.status(200).json({ sucess: true });
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }
}

module.exports = new SessionController();
