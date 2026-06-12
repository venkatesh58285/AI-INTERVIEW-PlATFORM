import asyncHandler from "../middleware/aysncHandler.js";
import retrieveResumeContext from "../services/rag/retriveResumeContext.js";

export const testController = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const context = await retrieveResumeContext(req.user?._id.toString(), query);
  res.status(200).json({
    success: true,
    context,
  });
});
