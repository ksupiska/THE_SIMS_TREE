const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("characters").select("*");

      if (error) {
        console.error("Ошибка при получении данных:", error);
        return res.status(500).json({ error: "Ошибка сервера" });
      }

      return res.status(200).json(data);
    } else if (req.method === "POST") {
      const { name, surname, gender, biography, city, kind, state, type, avatar, death } = req.body;

      // Логирование полученных данных
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

      if (!name || !surname || !gender) {
        return res.status(400).json({ error: "Имя, фамилия и пол обязательны." });
      }

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
        console.error("Ошибка при добавлении:", error);
        return res.status(500).json({ error: "Ошибка сервера при добавлении" });
      }

      res.status(201).json(data);
    } else {
      // Обработка неподдерживаемых методов
      return res.status(405).json({ error: "Метод не поддерживается" });
    }
  } catch (err) {
    console.error("Ошибка на сервере:", err);
    return res.status(500).json({ error: "Неизвестная ошибка сервера" });
  }
};
