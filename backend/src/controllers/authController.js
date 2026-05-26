import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
import asyncHandler from "../middleware/aysncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, pass } = req.body;

  if (!name || !email || !pass)
    return res.status(400).json({ message: "All fields are required" });
  const isUserExist = await User.findOne({ email });
   if (isUserExist) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = await generateToken(user._id);

  res.status(201).json({
    message: "User Registered",
    token,
    user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      msg: "User not authorized",
    });
  }
  const cmp = bcrypt.compare(password, user.password);
  if (!cmp) return res.status(400).json({ msg: "password incorrect" });

  const token = await generateToken(user._id);

  res.status(200).json({
    message: "Login Successful",
    token,
    user,
  });
});
