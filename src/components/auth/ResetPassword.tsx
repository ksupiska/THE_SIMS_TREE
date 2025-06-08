import { useState } from "react";
import { supabase } from "../../SupabaseClient";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import "../../css/resetpass.css";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setMessage("Пожалуйста, введите email")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://the-sims-tree.vercel.app/update-password",
    })

    setIsLoading(false)

    if (error) {
      setMessage("Ошибка: " + error.message)
      setMessageType("error")
    } else {
      setMessage("Письмо для сброса пароля отправлено!")
      setMessageType("success")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleResetPassword()
    }
  }

  return (
    <div className="sims-auth-container-res">
      <div className="sims-auth-decoration-res">
        <div className="sims-plumbob-res"></div>
        <div className="sims-plumbob-res sims-plumbob-alt-res"></div>
      </div>

      <div className="sims-auth-card-res">
        <div className="sims-auth-header-res">
          <div className="sims-diamond-res"></div>
          <h2>Сброс пароля</h2>
          <p className="sims-subtitle-res">Введите ваш email для получения ссылки</p>
        </div>

        <div className="sims-auth-form-res">
          <div className="sims-form-group-res">
            <div className="sims-input-icon-res">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Введите вашу почту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="sims-form-input-res"
              disabled={isLoading}
            />
          </div>

          <button
            className={`sims-button-res sims-button-primary-res ${isLoading ? "sims-button-loading-res" : ""}`}
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="sims-loading-spinner-res"></div>
                <span style={{ marginLeft: "8px" }}>Отправка...</span>
              </>
            ) : (
              "Отправить ссылку"
            )}
          </button>

          {message && (
            <div
              className={`sims-message-res ${messageType === "success" ? "sims-message-success-res" : "sims-message-error-res"}`}
            >
              {messageType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <p>{message}</p>
            </div>
          )}

          <div className="sims-auth-footer-res">
            <p>
              Вспомнили пароль?{" "}
              <a href="/login" className="sims-link-res">
                Войти
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestResetPassword