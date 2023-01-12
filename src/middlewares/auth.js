const jwt = require("jsonwebtoken");
const validation = require("../libs/validation");
const usersList = require("../models/users");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const currentEmail = req.headers.email;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    await jwt.verify(token, process.env.JWT_HASH);

    if (!validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail on headers is invalid" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    req.userId = userFound[0]._id;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = auth;
