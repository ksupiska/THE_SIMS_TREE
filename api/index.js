// server/index.ts (или app.ts)
import express from "express";
import cors from "cors";

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"; // Импортируем dotenv для загрузки переменных окружения

import multer from "multer";
import path from "path";

dotenv.config({ path: "../.env" }); // Загружаем переменные из .env файла

const app = express();
const port = process.env.PORT || 5000; // Убедись, что порт правильно настроен

console.log("Supabase URL:", process.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", process.env.VITE_SUPABASE_KEY);

// Supabase клиент
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

// Настройка Multer для обработки multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Маршрут для создания персонажа (POST)
app.post("/api/characters", upload.single("avatar"), async (req, res) => {
  const { name, surname, gender } = req.body;
  const file = req.file;

  if (!name || !surname || !gender) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }

  let avatar = null;
  if (file) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error("Ошибка при загрузке файла:", uploadError.message);
      return res.status(500).json({ error: "Ошибка при загрузке аватара" });
    }

    avatar = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
  }

  try {
    const { data, error } = await supabase
      .from("characters")
      .insert([{ name, surname, gender, avatar }])
      .single();

    if (error) throw error;

    console.log("Создан персонаж:", data);
    res.status(201).json({ message: "Персонаж добавлен", character: data });
  } catch (error) {
    console.error("Ошибка при добавлении персонажа:", error);
    res
      .status(500)
      .json({ error: "Ошибка при добавлении персонажа в базу данных" });
  }
});

// Маршрут для получения списка персонажей (GET)
app.get("/api/characters", async (req, res) => {
  try {
    const { data, error } = await supabase.from("characters").select("*");

    if (error) {
      throw error;
    }

    res.json(data); // Отправляем список персонажей
  } catch (error) {
    console.error("Ошибка при получении списка персонажей:", error);
    res
      .status(500)
      .json({ error: "Ошибка при получении данных из базы данных" });
  }
});

// Главная страница
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});

// Маршрут для удаления персонажа (DELETE)
app.delete("/api/characters/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("characters")
      .delete()
      .eq("id", id); // Удаляем персонажа по id

    if (error) {
      throw error;
    }

    console.log("Персонаж удален:", data);
    res.status(200).json({ message: "Персонаж удален" });
  } catch (error) {
    console.error("Ошибка при удалении персонажа:", error);
    res
      .status(500)
      .json({ error: "Ошибка при удалении персонажа из базы данных" });
  }
});
