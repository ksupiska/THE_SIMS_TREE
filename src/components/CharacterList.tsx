import { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
  id: string;
  name: string;
  surname: string;
  gender: string;
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);

  // Получаем список персонажей
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/characters');
        setCharacters(response.data);
      } catch (error) {
        console.error('Ошибка при получении персонажей:', error);
      }
    };

    fetchCharacters();
  }, []);

  // Удаление персонажа
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/characters/${id}`);
      setCharacters(characters.filter((character) => character.id !== id));  // Обновляем список после удаления
      console.log('Персонаж удален');
    } catch (error) {
      console.error('Ошибка при удалении персонажа:', error);
    }
  };

  return (
    <div>
      <h2>Список персонажей</h2>
      <div className="character-list">
        {characters.map((character) => (
          <div key={character.id} className="character-card">
            <h3>{character.name} {character.surname}</h3>
            <p>Пол: {character.gender}</p>
            <button onClick={() => handleDelete(character.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
