import express from "express";
import * as feedbackController from "../controllers/feedback";
import { validate } from "../middleware/zod_validate";
import { CreateFeedbackSchema } from "../dtos/feedback.schema";
import * as Authotization from "../middleware/authorized";


const router = express.Router();

router.post("/add", validate(CreateFeedbackSchema), feedbackController.createFeedback);
router.get("/all", Authotization.verifyAuthenticationSuperAdmin, feedbackController.getAllFeedbacks);
router.get("/each/:id", feedbackController.getFeedbackById);
router.put("/update/:id", feedbackController.updateFeedbackState);

export default router;