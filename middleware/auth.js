import jwt from "jsonwebtoken";

export const verifyAuth = (req, res, next) => {
  const token = req.cookies?.token;
  console.log(token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No authentication token found",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = decoded;
    next();
  });
};
