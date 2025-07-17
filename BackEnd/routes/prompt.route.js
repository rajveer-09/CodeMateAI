import express from "express";
import { createPrompt } from "../controllers/prompt.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/prompt", authenticate, createPrompt);

export default router;
