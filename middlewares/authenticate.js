const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token) {
    token = token.split(" ")[1]; 
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { email:decoded.email, id:decoded.id , role: decoded.role};
      next();
    } catch (err) {
      return res.status(403).send({
        message: "invalid or expired token",
        code: 403,
      });
    }
  } else {
    return res.status(401).send({
      message: "unauthenticated",
      code: 401,
    });
  }
};

module.exports = authenticate;
