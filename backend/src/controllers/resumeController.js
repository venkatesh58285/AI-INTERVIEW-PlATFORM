import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import User from "../models/User.js";
import asyncHandler from "../middleware/aysncHandler.js";

const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "File not found" });

  const resumeURI = req.file.path;

  //read-pdf --> parse-pdf --> extract-text
  const dataBuffer = fs.readFileSync(resumeURI);
  const pdfData = await pdfParse(dataBuffer);
  const extractedText = pdfData.text;

  const user = await User.findById(req.user._id);
  user.resumeURI = resumeURI;
  user.resumeText = extractedText;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    resumeText: extractedText,
  });
});

export default uploadResume;
