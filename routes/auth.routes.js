const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ message: "Email ya registrado" });

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            passwordHash,
            role: role || "estudiante",
        });

        res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (e) {
        res.status(500).json({ message: "Error en registro", error: e.message });
    }
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Credenciales incorrectas" });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: "Credenciales incorrectas" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        res.json({ token });
    } catch (e) {
        res.status(500).json({ message: "Error en login", error: e.message });
    }
});

module.exports = router;
