const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Разрешаем CORS
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Создаём папку для загрузок
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "api/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const pool = new Pool({
  user: "postgres",
  host: "localhost", // ⚠️ Это НЕ будет работать на Vercel — см. ниже!
  database: "family-tree",
  password: "postgres",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

app.post("/personalities", upload.single("avatar"), async (req, res) => {
  const {
    name,
    surname,
    sex,
    city_living,
    state_of_life,
    cause_of_death,
    kind,
    type,
    biography,
  } = req.body;

  const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !surname || !sex) {
    return res.status(400).send("Не хватает данных");
  }

  try {
    await pool.query(
      "INSERT INTO human (name, surname, sex, city_living, state_of_life, cause_of_death, kind, type, biography, avatar) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [
        name,
        surname,
        sex,
        city_living,
        state_of_life,
        cause_of_death,
        kind,
        type,
        biography,
        avatarPath,
      ]
    );
    res.status(201).send("Персонаж добавлен!");
  } catch (err) {
    console.error("Ошибка при добавлении:", err);
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/personalities", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM human ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении:", err);
    res.status(500).send("Ошибка сервера");
  }
});

app.delete("/personalities/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send("Некорректный ID");
  }

  try {
    await pool.query("DELETE FROM human WHERE id = $1", [id]);
    res.status(200).send("Персонаж удалён");
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    res.status(500).send("Ошибка при удалении");
  }
});

// ВАЖНО: экспортируем express-приложение для Vercel
module.exports = app;
