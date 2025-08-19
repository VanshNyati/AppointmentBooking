import jwt from "jsonwebtoken";

export function auth(requiredRole = null) {
  return (req, res, next) => {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;

    if (!token) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing_token" },
      });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // { id, role }

      // 🔎 Debug Logs
      console.log("Incoming token:", token);
      console.log("Decoded payload:", payload);
      console.log("Required role:", requiredRole);

      next();
    } catch (err) {
      return res.status(401).json({
        error: { code: "INVALID_TOKEN", message: "Invalid or expired token" },
      });
    }
  };
}
