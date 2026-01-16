const express = require("express");
require("dotenv").config();

const sequelize = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);

app.get("/", (req, res) => res.send("API Roles OK"));

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // en prod se usa migraciones
        app.listen(process.env.PORT, () =>
            console.log(`Servidor en http://localhost:${process.env.PORT}`)
        );
    } catch (e) {
        console.error("Error al iniciar:", e.message);
    }
}

start();
