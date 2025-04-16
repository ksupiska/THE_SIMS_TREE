const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001; // не 5173, чтобы не мешать Vite

// Разрешаем CORS для клиента
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Конфигурация Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Подключение к базе PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "family-tree",
  password: "postgres",
  port: 5432,
});

// Тестовый маршрут
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

// Добавить персонажа
app.post("/personalities", upload.single("avatar"), async (req, res) => {
  const {
    name,
    surname,
    sex,
    city_living,
    state_of_life,
    cause_of_death,
    kind,
  } = req.body;

  const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;
  if (!name || !surname || !sex) {
    return res.status(400).send("Не хватает данных");
  }

  try {
    await pool.query(
      "INSERT INTO human (name, surname, sex, city_living, state_of_life, cause_of_death, kind, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        name,
        surname,
        sex,
        city_living,
        state_of_life,
        cause_of_death,
        kind,
        avatarPath,
      ]
    );
    res.status(201).send("Персонаж добавлен!");
  } catch (err) {
    console.error("Ошибка при добавлении персонажа:", err);
    res.status(500).send("Ошибка сервера");
  }
});

// Получить всех персонажей
app.get("/personalities", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM human ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении персонажей:", err);
    res.status(500).send("Ошибка сервера");
  }
});

// Удалить персонажа по ID
app.delete("/personalities/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send("Некорректный ID");
  }

  console.log("Удаляем персонажа с ID:", id);

  try {
    await pool.query("DELETE FROM human WHERE id = $1", [id]);
    res.status(200).send("Персонаж удалён");
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    res.status(500).send("Ошибка при удалении");
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
