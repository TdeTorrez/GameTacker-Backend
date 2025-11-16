import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  juego: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  titulo: { type: String },
  contenido: { type: String, required: true },
  estrellas: { type: Number, min: 0, max: 5, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);
