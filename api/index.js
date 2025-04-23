const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      // Запрос на получение всех персонажей
      const { data, error } = await supabase.from("characters").select("*");

      if (error) {
        console.error("Ошибка при получении данных:", error);
        return res.status(500).json({ error: "Ошибка сервера при получении данных" });
      }

      return res.status(200).json(data);
    } else if (req.method === "POST") {
      // Получаем данные из тела запроса
      const { name, surname, gender, biography, city, kind, state, type, avatar, death } = req.body;

      // Логируем полученные данные для отладки
      console.log("Полученные данные для добавления персонажа:", {
        name,
        surname,
        gender,
        biography,
        city,
        kind,
        state,
        type,
        avatar,
        death
      });

      // Проверка обязательных полей
      if (!name || !surname || !gender) {
        return res.status(400).json({ error: "Имя, фамилия и пол обязательны." });
      }

      // Вставка данных в таблицу "characters"
      const { data, error } = await supabase.from("characters").insert([
        {
          name,
          surname,
          gender,
          biography,
          city,
          kind,
          state,
          type,
          avatar,
          death,
        },
      ]);

      if (error) {
        console.error("Ошибка при добавлении персонажа:", error);
        return res.status(500).json({ error: "Ошибка сервера при добавлении персонажа" });
      }

      return res.status(201).json(data); // Возвращаем успешный ответ с добавленными данными
    } else {
      // Обработка неподдерживаемых методов
      return res.status(405).json({ error: "Метод не поддерживается" });
    }
  } catch (err) {
    console.error("Ошибка на сервере:", err);
    return res.status(500).json({ error: "Неизвестная ошибка сервера" });
  }
};
