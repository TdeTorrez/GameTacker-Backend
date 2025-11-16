import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/games.js";
import reviewRoutes from "./routes/reviews.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => res.send("GameTracker API"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch(err => {
    console.error("Error conectando a Mongo:", err);
    process.exit(1);
  });
