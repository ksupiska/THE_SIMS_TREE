import { useState } from 'react'
import { supabase } from '../../../src/SupabaseClient';
import '../../css/signupform.css';

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage('Ошибка: ' + error.message)
    } else {
      setMessage('Письмо для подтверждения отправлено! Проверь почту.')
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSignup}>
      <h2 className="text-center mb-4">Регистрация</h2>
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
        Зарегистрироваться
      </button>
      {message && <p className="mt-3 text-center message-text">{message}</p>}
      <p className="text-center mt-3">
        Есть аккаунт? <a href="/login">Войди</a>
      </p>

    </form>
  )
}

export default SignupForm
