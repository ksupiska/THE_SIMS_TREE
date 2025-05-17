import { useState } from 'react'
import { supabase } from '../../../src/SupabaseClient'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import '../../css/signupform.css';

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [showLoginButton, setShowLoginButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage('Ошибка: ' + error.message)
        setMessageType('error')
        setShowLoginButton(false)
      } else {
        setMessage('Письмо для подтверждения отправлено! Проверьте почту.')
        setMessageType('success')
        setShowLoginButton(true)
      }
    } catch (err) {
      setMessage('Произошла непредвиденная ошибка')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="sims-auth-container">
      <div className="sims-auth-card">
        <div className="sims-auth-header">
          <div className="sims-diamond"></div>
          <h2>Регистрация</h2>
        </div>

        <form className="sims-auth-form" onSubmit={handleSignup}>
          <div className="sims-form-group">
            <div className="sims-input-icon">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
              required
              className="sims-form-input"
            />
          </div>

          <button
            type="submit"
            className={`sims-button sims-button-primary ${isLoading ? 'sims-button-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="sims-loading-spinner"></span>
            ) : (
              <>
                Зарегистрироваться
                <User size={16} className="ms-2" />
              </>
            )}
          </button>

          {message && (
            <div className={`sims-message ${messageType === 'success' ? 'sims-message-success' : 'sims-message-error'}`}>
              {messageType === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <p>{message}</p>
            </div>
          )}

          {showLoginButton && (
            <button
              type="button"
              className="sims-button sims-button-secondary"
              onClick={goToLogin}
            >
              Перейти ко входу
              <ArrowRight size={16} className="ms-2" />
            </button>
          )}

          <div className="sims-auth-footer">
            <p>
              Есть аккаунт? <a href="/login" className="sims-link">Войти</a>
            </p>
          </div>
        </form>
      </div>

      <div className="sims-auth-decoration">
        <div className="sims-plumbob"></div>
      </div>
    </div>
  )
}

export default SignupForm
