import jwt from "jsonwebtoken";

const generateToken = async (id) => {
  await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export default generateToken;
