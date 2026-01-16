const express = require("express");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");

const router = express.Router();

// Solo usuarios autenticados
router.get("/perfil", auth, (req, res) => {
    res.json({ message: "Acceso permitido", user: req.user });
});

// Solo admin
router.get("/admin", auth, allowRoles("admin"), (req, res) => {
    res.json({ message: "Panel admin: OK" });
});

// Admin y docente
router.get("/docente", auth, allowRoles("admin", "docente"), (req, res) => {
    res.json({ message: "Área docente: OK" });
});

module.exports = router;
