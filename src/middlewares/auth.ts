import { usersModel } from "../models/users";
import { JwtPayload, verify } from "jsonwebtoken";
import { enviroment } from "../config/enviroment";

import type { RequestHandler, Request } from "express";

export interface AuthRequest extends Request {
  userId: string;
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, enviroment.JWT_HASH) as JwtPayload;

    if (!decoded?.userId) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    const userFound = await usersModel.findById(decoded.userId);
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    // 👇 você pode fazer type assertion diretamente no `req`
    (req as AuthRequest).userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid Token" });
  }
};
