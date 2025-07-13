import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import HttpError from "../utils/HttpError.js";
import  User  from "../../models/user.js";

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let email;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    email = decoded.email;
  } catch (error) {
    throw HttpError(401, "Token is expired or invalid.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Очистити сесію (якщо використовуєш токени сесій — тоді видаляй/обнуляй)
  user.password = hashedPassword;
  user.token = null; // або sessionId = null
  await user.save();

  res.status(200).json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {},
  });
};
