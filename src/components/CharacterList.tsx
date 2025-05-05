import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/charaterlist.css'; // Подключим стили

interface Character {
  id: string;
  name: string;
  surname: string;
  gender: string;
  avatar?: string; // можно будет добавить позже
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const navigate = useNavigate();

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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/characters/${id}`);
      setCharacters(characters.filter((character) => character.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении персонажа:', error);
    }
  };

  const handleCreateNew = () => {
    navigate('/simcreateform'); // путь к форме создания персонажа
  };

  return (
    <div className="character-list-container">
      <h2>Список персонажей</h2>
      {characters.length === 0 ? (
        <div className="no-characters">
          <p>Персонажи не найдены</p>
          <button onClick={handleCreateNew}>Создать нового персонажа</button>
        </div>
      ) : (
        <div className="character-list">
          {characters.map((character) => (
            <div key={character.id} className="character-card">
              <img
                src={character.avatar || '/default-avatar.png'}
                alt="Аватар"
                className="avatar"
              />

              <h3>{character.name} {character.surname}</h3>
              <p>Пол: {character.gender}</p>
              <button onClick={() => handleDelete(character.id)}>Удалить</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
