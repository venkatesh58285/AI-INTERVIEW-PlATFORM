import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./aysncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = User.findById(decoded.id).select("-password");
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;
