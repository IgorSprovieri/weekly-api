import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { mail } from "../libs/mail";
import { validations } from "../libs/validation";
import { usersModel } from "../models/users";
import { differenceInMinutes } from "date-fns";
import { commonErrors } from "../libs/commonErrors";
import { randomToken } from "../libs/randomToken";

import type { Request, Response } from "express";
import { enviroment } from "../config/enviroment";

class SessionController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !validations.validateEmail(email)) {
        return res.status(403).json({ error: "E-mail or password is invalid" });
      }

      if (!password || !validations.validatePassword(password)) {
        return res.status(403).json({ error: "E-mail or password is invalid" });
      }

      const userFound = await usersModel.findOne({ email: email });
      if (!userFound) {
        return res.status(403).json({ error: "E-mail or password is invalid" });
      }

      const checkPassword = await bcrypt.compareSync(
        password,
        userFound.passwordHash || ""
      );

      if (!checkPassword) {
        return res.status(403).json({ error: "E-mail or password is invalid" });
      }

      const token = jwt.sign({ userId: userFound._id }, enviroment.JWT_HASH, {
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

  async forgotPassword(req: Request, res: Response) {
    try {
      const email = req.body.email;

      if (!email || !validations.validateEmail(email)) {
        return res.status(400).json({ error: "E-mail or password is invalid" });
      }

      const userFound = await usersModel.findOne({ email: email });
      if (!userFound) {
        return res.status(404).json({ error: "User not found" });
      }

      const resetPasswordToken = randomToken({ length: 6 });
      const resetPasswordTokenHash = bcrypt.hashSync(resetPasswordToken, 10);

      await usersModel.findByIdAndUpdate(userFound._id, {
        resetPasswordToken: resetPasswordTokenHash,
        resetPasswordTokenCratedAt: Date.now(),
      });

      mail.sendForgotPasswordEmail({
        name: userFound.name,
        email: email,
        token: resetPasswordToken,
      });

      return res.status(200).json({ sucess: true });
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, email, password } = req.body.token;

      if (!token) {
        return res.status(400).json({ error: "Token is missing" });
      }

      if (!password || !validations.validatePassword(password)) {
        return res.status(400).json({ error: "E-mail or password is invalid" });
      }

      if (!email || !validations.validateEmail(email)) {
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
        const timeDifference = differenceInMinutes(
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

export const sessionController = new SessionController();
