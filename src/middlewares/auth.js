const { firebaseAuth } = require("../libs/firebase");

class AuthMiddleware {
  async validate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const user = await firebaseAuth.validateToken(token);

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
}

module.exports = new AuthMiddleware();
