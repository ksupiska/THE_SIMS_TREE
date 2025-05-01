import { useState } from 'react'
import { supabase } from '../../../src/SupabaseClient';

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
    <form onSubmit={handleSignup}>
      <h2>Регистрация</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Зарегистрироваться</button>
      <p>{message}</p>
    </form>
  )
}

export default SignupForm
