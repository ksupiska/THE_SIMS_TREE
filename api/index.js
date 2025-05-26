
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

import saveTreeRoute from "./routes/savetree.js";

dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 5000;

console.log("Supabase URL:", process.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", process.env.VITE_SUPABASE_KEY);

// Supabase клиент
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

app.use(cors());
app.use(express.json());
// подключаем маршрут сохранения дерева
app.use(saveTreeRoute);

const storage = multer.memoryStorage();
const upload = multer({ storage });

//создание персонажа
app.post("/api/characters", upload.single("avatar"), async (req, res) => {
  const {
    name,
    surname,
    gender,
    city,
    kind,
    state,
    type,
    biography,
    death,
    user_id, //получаем user_id из клиента
    tree_id,
  } = req.body;

  const file = req.file;

  if (!name || !surname || !gender || !user_id) {
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
      .insert([
        {
          name,
          surname,
          gender,
          avatar,
          city,
          kind,
          state,
          type,
          biography,
          death,
          user_id, //user_id в базу
          tree_id,
        },
      ])
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

//получение только своих персонажей
app.get("/api/characters", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId обязателен" });
  }

  console.log("Получен userId:", userId); //логирование userId

  try {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Ошибка при запросе из Supabase:", error); //лог ошибки при запросе
      throw error;
    }

    console.log("Данные из базы:", data); //логирование данных из базы
    res.json(data);
  } catch (error) {
    console.error("Ошибка при получении персонажей:", error);
    res.status(500).json({ error: "Ошибка при получении данных" });
  }
});

//удаление персонажа
app.delete("/api/characters/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("characters")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    console.log("Персонаж удален:", data);
    res.status(200).json({ message: "Персонаж удален" });
  } catch (error) {
    console.error("Ошибка при удалении персонажа:", error);
    res.status(500).json({ error: "Ошибка при удалении персонажа" });
  }
});

// обновление персонажа
app.put("/api/characters/:id", upload.single("avatar"), async (req, res) => {
  const { id } = req.params;
  const { name, surname, gender, city, kind, state, type, biography, death } =
    req.body;

  const file = req.file;
  let avatar = req.body.avatar || null; // если не обновляем — оставить текущий

  if (file) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error("Ошибка при загрузке аватара:", uploadError.message);
      return res.status(500).json({ error: "Ошибка при загрузке аватара" });
    }

    avatar = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
  }

  try {
    const { data, error } = await supabase
      .from("characters")
      .update({
        name,
        surname,
        gender,
        city,
        kind,
        state,
        type,
        biography,
        death,
        avatar,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    console.log("Персонаж обновлён:", data);
    res.status(200).json({ message: "Персонаж обновлён", character: data });
  } catch (error) {
    console.error("Ошибка при обновлении персонажа:", error);
    res.status(500).json({ error: "Ошибка при обновлении персонажа" });
  }
});

// Главная
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
