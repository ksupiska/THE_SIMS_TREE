import { useState } from 'react'
import { supabase } from '../../../src/SupabaseClient'

import '../../css/loginform.css';
const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage('Ошибка: ' + error.message)
    } else {
      setMessage('Вход выполнен!')
    }
  }

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2 className="text-center mb-4">Вход</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="form-control mb-3"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="form-control mb-3"
      />
      <button type="submit" className="btn btn-success w-100">
        Войти
      </button>
      {message && <p className="mt-3 text-center message-text">{message}</p>}
      <p className="text-center mt-3">
        Нет аккаунта? <a href="/signup">Зарегистрируйся</a>
      </p>

    </form>
  )
}

export default LoginForm
