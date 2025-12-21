
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password required"
    });
  }

  if (username !== process.env.OWNER_USERNAME) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const isPasswordValid = password === process.env.OWNER_PASSWORD;

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { role: "owner" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    success: true,
    token
  });
};
