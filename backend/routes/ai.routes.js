import express from "express";
import { getAIResponse } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", getAIResponse);

export default router;
