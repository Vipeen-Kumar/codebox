import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pistonRoutes from "./routes/piston.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/piston", pistonRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
