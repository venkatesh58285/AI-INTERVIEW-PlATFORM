import express from "express"
import protect from "../middleware/authMiddleware.js";
import { testController } from "../controllers/testController.js";
const router =  express.Router();

router.post("/retrive",protect,testController)

export default router;