// server/index.ts (или app.ts)
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';  // Импортируем dotenv для загрузки переменных окружения

dotenv.config({ path: '../.env' });  // Загружаем переменные из .env файла

const app = express();
const port = process.env.PORT || 5000;  // Убедись, что порт правильно настроен

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Key:', process.env.SUPABASE_KEY);

// Supabase клиент
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

// Маршрут для создания персонажа (POST)
app.post('/api/characters', async (req, res) => {
  const { name, surname, gender } = req.body;

  if (!name || !surname || !gender) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    // Вставляем данные персонажа в таблицу characters
    const { data, error } = await supabase
      .from('characters')
      .insert([
        { name, surname, gender }
      ])
      .single();  // Получаем одну вставленную запись

    if (error) {
      throw error;
    }

    console.log('Создан персонаж:', data);
    res.status(201).json({ message: 'Персонаж добавлен', character: data });
  } catch (error) {
    console.error('Ошибка при добавлении персонажа:', error);
    res.status(500).json({ error: 'Ошибка при добавлении персонажа в базу данных' });
  }
});

// Маршрут для получения списка персонажей (GET)
app.get('/api/characters', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);  // Отправляем список персонажей
  } catch (error) {
    console.error('Ошибка при получении списка персонажей:', error);
    res.status(500).json({ error: 'Ошибка при получении данных из базы данных' });
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
app.delete('/api/characters/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);  // Удаляем персонажа по id

    if (error) {
      throw error;
    }

    console.log('Персонаж удален:', data);
    res.status(200).json({ message: 'Персонаж удален' });
  } catch (error) {
    console.error('Ошибка при удалении персонажа:', error);
    res.status(500).json({ error: 'Ошибка при удалении персонажа из базы данных' });
  }
});
