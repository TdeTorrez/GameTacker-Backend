import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("API funcionando");
});

app.listen(4000, () => console.log("Servidor en puerto 4000"));
