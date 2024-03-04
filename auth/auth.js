const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: async function (req, res, next) {
    const headerToken = req.headers.authorization;
    if (!headerToken || !headerToken.includes("Token")) {
      return res.status(400).json({ errMsg: "Token required" });
    }
    const token = headerToken.split(" ")[1];
    try {
      const payload = await jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      req.user = payload;
      return next();
    } catch (error) {
      next(error);
    }
  },
};
