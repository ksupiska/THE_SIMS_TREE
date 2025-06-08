"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "../../../src/SupabaseClient"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import "../../css/loginform.css";

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const errorMessagesMap: Record<string, string> = {
    'Invalid login credentials': 'Неверный email или пароль',
    'Invalid email format': 'Неверный формат email',
    'Password should be at least 6 characters': 'Пароль должен быть не менее 6 символов',
    'User already registered': 'Пользователь с таким email уже зарегистрирован',
  }
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setMessageType("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const ruMessage = errorMessagesMap[error.message] || error.message
        setMessage('Ошибка: ' + ruMessage)
        setMessageType('error')
        setLoggedIn(false)
      } else {
        setMessage("Вход выполнен успешно!")
        setMessageType("success")
        setLoggedIn(true)
      }
    } catch (err) {
      console.error(err)
      setMessage("Произошла непредвиденная ошибка")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const goToProfile = () => {
    navigate("/profile")
  }

  const handleForgotPassword = () => {
    navigate("/reset-password")
  }

  return (
    <div className="sims-auth-container">
      <div className="sims-auth-card">
        <div className="sims-auth-header">
          <div className="sims-diamond"></div>
          <h2>Вход</h2>
        </div>

        <form className="sims-auth-form" onSubmit={handleLogin}>
          <div className="sims-form-group">
            <div className="sims-input-icon">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="sims-form-input"
            />
          </div>

          <div className="sims-form-group">
            <div className="sims-input-icon">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="sims-form-input"
            />
          </div>

          <div className="sims-forgot-password">
            <button type="button" className="sims-text-button" onClick={handleForgotPassword}>
              Забыли пароль?
            </button>
          </div>

          <button
            type="submit"
            className={`sims-button sims-button-primary ${isLoading ? "sims-button-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="sims-loading-spinner"></span>
            ) : (
              <>
                Войти
                <ArrowRight size={16} className="ms-2" />
              </>
            )}
          </button>

          {message && (
            <div
              className={`sims-message ${messageType === "success" ? "sims-message-success" : "sims-message-error"}`}
            >
              {messageType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <p>{message}</p>
            </div>
          )}

          {loggedIn && (
            <button type="button" className="sims-button sims-button-secondary" onClick={goToProfile}>
              Перейти в профиль
              <User size={16} className="ms-2" />
            </button>
          )}

          <div className="sims-auth-footer">
            <p>
              Нет аккаунта?{" "}
              <a href="/signup" className="sims-link">
                Зарегистрируйтесь
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="sims-auth-decoration">
        <div className="sims-plumbob"></div>
        <div className="sims-plumbob sims-plumbob-alt"></div>
      </div>
    </div>
  )
}

export default LoginForm
