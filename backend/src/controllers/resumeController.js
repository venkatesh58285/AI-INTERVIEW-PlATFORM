import fs from "fs";
import { PDFParse } from "pdf-parse";
import User from "../models/User.js";
import asyncHandler from "../middleware/aysncHandler.js";
import embedResume from "../services/rag/embedResume.js";

const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "File not found" });

  const resumeURI = req.file.path;

  //read-pdf --> parse-pdf --> extract-text
  const dataBuffer = fs.readFileSync(resumeURI);
  const pdf = new PDFParse({ data: dataBuffer });
  const pdfData = await pdf.getText();
  const extractedText = pdfData.text;

  const user = await User.findById(req.user._id);
  user.resumeURI = resumeURI;
  user.resumeText = extractedText;

  await user.save();
  await embedResume(user._id.toString(),extractedText);

  return res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    resumeText: extractedText,
  });
});

export default uploadResume;
