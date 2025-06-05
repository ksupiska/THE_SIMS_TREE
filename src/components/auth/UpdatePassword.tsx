import { useState } from "react";
import { supabase } from "../../SupabaseClient";
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import "../../css/updatepass.css";

const UpdatePassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleUpdatePassword = async () => {
    // Валидация
    if (!password.trim()) {
      setMessage("Пожалуйста, введите новый пароль")
      setMessageType("error")
      return
    }

    if (password.length < 6) {
      setMessage("Пароль должен содержать минимум 6 символов")
      setMessageType("error")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Пароли не совпадают")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setIsLoading(false)

    if (error) {
      setMessage("Ошибка: " + error.message)
      setMessageType("error")
    } else {
      setMessage("Пароль успешно обновлён! Теперь вы можете войти с новым паролем.")
      setMessageType("success")
      // Очищаем поля после успешного обновления
      setPassword("")
      setConfirmPassword("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdatePassword()
    }
  }

  return (
    <div className="sims-auth-container-upd">
      {/* Декоративные элементы */}
      <div className="sims-auth-decoration-upd">
        <div className="sims-plumbob-upd"></div>
        <div className="sims-plumbob-upd sims-plumbob-alt-upd"></div>
      </div>

      <div className="sims-auth-card-upd">
        <div className="sims-auth-header-upd">
          <div className="sims-diamond-upd"></div>
          <h2>Новый пароль</h2>
          <p className="sims-subtitle-upd">Создайте надежный пароль для вашего аккаунта</p>
        </div>

        <div className="sims-auth-form-upd">
          <div className="sims-form-group-upd">
            <div className="sims-input-icon-upd">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Введите новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="sims-form-input-upd"
              disabled={isLoading}
            />
            <button
              type="button"
              className="sims-password-toggle-upd"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="sims-form-group-upd">
            <div className="sims-input-icon-upd">
              <Lock size={18} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="sims-form-input-upd"
              disabled={isLoading}
            />
            <button
              type="button"
              className="sims-password-toggle-upd"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="sims-password-requirements-upd">
            <p>Требования к паролю:</p>
            <ul>
              <li className={password.length >= 6 ? "sims-requirement-met-upd" : ""}>Минимум 6 символов</li>
              <li className={/[A-Z]/.test(password) ? "sims-requirement-met-upd" : ""}>
                Одна заглавная буква (рекомендуется)
              </li>
              <li className={/[0-9]/.test(password) ? "sims-requirement-met-upd" : ""}>Одна цифра (рекомендуется)</li>
            </ul>
          </div>

          <button
            className={`sims-button-upd sims-button-primary-upd ${isLoading ? "sims-button-loading-upd" : ""}`}
            onClick={handleUpdatePassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="sims-loading-spinner-upd"></div>
                <span style={{ marginLeft: "8px" }}>Обновление...</span>
              </>
            ) : (
              "Обновить пароль"
            )}
          </button>

          {message && (
            <div
              className={`sims-message-upd ${messageType === "success" ? "sims-message-success-upd" : "sims-message-error-upd"}`}
            >
              {messageType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <p>{message}</p>
            </div>
          )}

          <div className="sims-auth-footer-upd">
            <p>
              Помните свой пароль?{" "}
              <a href="/login" className="sims-link-upd">
                Войти
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatePassword
