import express from "express";
import Review from "../models/Review.js";
import Game from "../models/Game.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const game = req.query.game;
    const filter = game ? { juego: game } : {};
    const reviews = await Review.find(filter).populate("autor", "nombre");
    res.json(reviews);
  } catch (err) { res.status(500).json({ msg: "Error servidor" }); }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { juego, contenido, estrellas, titulo } = req.body;
    if (!juego || !contenido || estrellas == null) return res.status(400).json({ msg: "Faltan datos" });

    const review = await Review.create({ juego, contenido, estrellas, titulo, autor: req.userId });

    const reviews = await Review.find({ juego });
    const avg = reviews.reduce((s, r) => s + r.estrellas, 0) / reviews.length;
    await Game.findByIdAndUpdate(juego, { puntuacionPromedio: avg });

    res.status(201).json(review);
  } catch (err) { res.status(500).json({ msg: "Error servidor" }); }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const rev = await Review.findById(req.params.id);
    if (!rev) return res.status(404).json({ msg: "No encontrado" });
    if (rev.autor.toString() !== req.userId) return res.status(403).json({ msg: "No autorizado" });

    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const reviews = await Review.find({ juego: updated.juego });
    const avg = reviews.reduce((s, r) => s + r.estrellas, 0) / reviews.length;
    await Game.findByIdAndUpdate(updated.juego, { puntuacionPromedio: avg });

    res.json(updated);
  } catch (err) { res.status(500).json({ msg: "Error servidor" }); }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const rev = await Review.findById(req.params.id);
    if (!rev) return res.status(404).json({ msg: "No encontrado" });
    if (rev.autor.toString() !== req.userId) return res.status(403).json({ msg: "No autorizado" });

    const juegoId = rev.juego;
    await rev.remove();

    const reviews = await Review.find({ juego: juegoId });
    const avg = reviews.length ? reviews.reduce((s, r) => s + r.estrellas, 0) / reviews.length : 0;
    await Game.findByIdAndUpdate(juegoId, { puntuacionPromedio: avg });

    res.json({ msg: "Eliminado" });
  } catch (err) { res.status(500).json({ msg: "Error servidor" }); }
});

export default router;
