const jwt = require("jsonwebtoken");
const usersList = require("../models/users");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await jwt.verify(token, process.env.JWT_HASH);

    const userFound = await usersList.findById(decoded?.userId);
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    req.userId = decoded?.userId;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

module.exports = auth;
