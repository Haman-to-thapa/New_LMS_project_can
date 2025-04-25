import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  res
  .cookie("token", token, {
    httpOnly: true,  // Prevent access from JavaScript
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
  .status(200)
  .json({ success: true, message, user });
};
