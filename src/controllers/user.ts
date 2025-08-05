import bcrypt from "bcrypt";

import { validations } from "../libs/validation";
import { usersModel } from "../models/users";
import { tasksModel } from "../models/tasks";

import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth";

class UserController {
  async post(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      if (!email || !validations.validateEmail(email)) {
        return res.status(400).json({ error: "E-mail is invalid" });
      }

      if (!password || !validations.validatePassword(password)) {
        return res.status(400).json({ error: "Password is invalid" });
      }

      const alreadyExists = await usersModel.exists({ email: email });

      if (alreadyExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      const newUser = await usersModel.create({
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
      return res.status(500).json("Internal server error");
    }
  }

  async get(req: AuthRequest, res: Response) {
    try {
      const id = req.userId;

      if (!id || !validations.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      const userFound = await usersModel.findById(id);

      return res.status(200).json({
        user_id: userFound?._id,
        name: userFound?.name,
        email: userFound?.email,
      });
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }

  async put(req: AuthRequest, res: Response) {
    try {
      const id = req.userId;
      const { name, email: newEmail } = req.body;

      if (!id || !validations.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      if (newEmail) {
        if (!validations.validateEmail(newEmail)) {
          return res.status(400).json({ error: "E-mail is invalid" });
        }

        const alreadyExists = await usersModel.exists({ email: newEmail });

        if (alreadyExists) {
          return res.status(400).json({ error: "E-mail already exists" });
        }
      }

      const updatedUser = await usersModel.findByIdAndUpdate(
        id,
        {
          name: name,
          email: newEmail,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email,
      });
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = req.userId;
      const password = req.body.password;

      if (!id || !validations.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      if (!password || !validations.validatePassword(password)) {
        return res.status(401).json({ error: "Password is invalid" });
      }

      const userFound = await usersModel.findById(id);

      const checkPassword = await bcrypt.compareSync(
        password,
        userFound?.passwordHash || ""
      );

      if (!checkPassword) {
        return res.status(401).json({ error: "Password is invalid" });
      }

      await usersModel.findByIdAndRemove(id);
      await tasksModel.deleteMany({ user_id: id });

      return res.status(200).json({ success: "The user was deleted" });
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }
}

export const userController = new UserController();
