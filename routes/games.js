import express from "express";
import Game from "../models/Game.js";
import Review from "../models/Review.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "";
    const filter = q ? { titulo: { $regex: q, $options: "i" } } : {};
    const games = await Game.find(filter).sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ msg: "Error servidor" });
  }
});

router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const games = await Game.find({ creador: req.userId }).sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ msg: "Error servidor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ msg: "Juego no encontrado" });
    const reviews = await Review.find({ juego: game._id }).populate("autor", "nombre correo");
    res.json({ game, reviews });
  } catch (err) { res.status(500).json({ msg: "Error servidor" }); }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    data.creador = req.userId;
    const game = await Game.create(data);
    res.status(201).json(game);
  } catch (err) { res.status(500).json({ msg: "Error servidor" }); }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ msg: "No encontrado" });
    if (game.creador && game.creador.toString() !== req.userId) return res.status(403).json({ msg: "No autorizado" });

    const updated = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ msg: "Error servidor" }); }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ msg: "No encontrado" });

    await game.deleteOne();
    await Review.deleteMany({ juego: req.params.id });
    res.json({ msg: "Eliminado" });
  } catch (err) { res.status(500).json({ msg: "Error servidor" }); }
});

export default router;
