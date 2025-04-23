const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("characters").select("*");

    if (error) {
      console.error("Ошибка при получении данных:", error);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    return res.status(200).json(data);
  } else {
    return res.status(405).json({ error: "Метод не поддерживается" });
  }
};

app.post("/people", async (req, res) => {
  const { name, surname, gender, biography, city, kind, state, type, avatar, death } = req.body;

  if (!name || !surname || !sex) {
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
});
