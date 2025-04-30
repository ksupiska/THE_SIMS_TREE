// SimCreateForm.tsx
import { useState } from 'react';
import axios from 'axios';

export default function SimCreateForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCharacter = {
      name: name,
      surname: surname,
      gender: gender,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/characters', newCharacter);
      console.log('Успешно!', response.data);
    } catch (error) {
      console.error('Ошибка при добавлении персонажа:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Фамилия"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        required
      />
      <select value={gender} onChange={(e) => setGender(e.target.value)} required>
        <option value="">Выберите пол</option>
        <option value="male">Мужской</option>
        <option value="female">Женский</option>
      </select>
      <button type="submit">Создать</button>
    </form>
  );
}
