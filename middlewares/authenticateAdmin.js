const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthenticated", code: 401 });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied", code: 403 });
    }


    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token", code: 403 });
  }
};

module.exports = authenticateAdmin;
