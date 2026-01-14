import express from "express";
import { runCode } from "../controllers/piston.controller.js";

const router = express.Router();

router.post("/execute", runCode);

export default router;
