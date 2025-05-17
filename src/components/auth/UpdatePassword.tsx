import { useState } from "react";
import { supabase } from "../../SupabaseClient";
import "../../css/loginform.css";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage("Ошибка: " + error.message);
    } else {
      setMessage("Пароль успешно обновлён. Теперь вы можете войти.");
    }
  };

  return (
    <div className="sims-auth-container">
      <div className="sims-auth-card">
        <h2>Новый пароль</h2>
        <input
          type="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="sims-form-input"
        />
        <button
          className="sims-button sims-button-primary"
          onClick={handleUpdatePassword}
        >
          Обновить пароль
        </button>
        {message && <p className="sims-message">{message}</p>}
      </div>
    </div>
  );
};

export default UpdatePassword;
