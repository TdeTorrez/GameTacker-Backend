import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  plataforma: { type: String },
  portadaUrl: { type: String },
  descripcion: { type: String },
  horasJugadas: { type: Number, default: 0 },
  completado: { type: Boolean, default: false },
  puntuacionPromedio: { type: Number, default: 0 },
  creador: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Game", gameSchema);
