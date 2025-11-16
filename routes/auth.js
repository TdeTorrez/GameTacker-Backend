import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SALT_ROUNDS = 10;

// Registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) return res.status(400).json({ msg: "Faltan datos" });

    const existe = await User.findOne({ correo });
    if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ nombre, correo, password: hash });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

    res.status(201).json({ token, user: { id: user._id, nombre: user.nombre, correo: user.correo } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ msg: "Faltan datos" });

    const user = await User.findOne({ correo });
    if (!user) return res.status(400).json({ msg: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

    res.json({ token, user: { id: user._id, nombre: user.nombre, correo: user.correo } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

export default router;
