import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/charaterlist.css'; // Подключим стили

interface Character {
  id: string;
  name: string;
  surname: string;
  gender: string;
  avatar?: string;
  city: string;
  kind: string;
  state: string;
  type: string;
  biography: string;
  death: string;
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
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
    navigate('/simcreateform');
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
            <div
              key={character.id}
              className="character-card"
              onClick={() => setSelectedCharacter(character)}
            >
              <img
                src={character.avatar || '/default-avatar.png'}
                alt="Аватар"
                className="avatar"
              />
              <h3>{character.name} {character.surname}</h3>
              <p>Пол: {character.gender}</p>
              <button onClick={(e) => {
                e.stopPropagation();
                handleDelete(character.id);
              }}>Удалить</button>
            </div>
          ))}
        </div>
      )}

      {selectedCharacter && (
        <div className="modal-overlay" onClick={() => setSelectedCharacter(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedCharacter.avatar || '/default-avatar.png'}
              alt="Аватар"
              className="modal-avatar"
            />
            <h3>{selectedCharacter.name} {selectedCharacter.surname}</h3>
            <p><strong>Пол:</strong> {selectedCharacter.gender}</p>
            <p><strong>Город:</strong> {selectedCharacter.city}</p>
            <p><strong>Тип:</strong> {selectedCharacter.type}</p>
            <p><strong>Состояние:</strong> {selectedCharacter.state}</p>
            <p><strong>Вид:</strong> {selectedCharacter.kind}</p>
            <p><strong>Биография:</strong> {selectedCharacter.biography}</p>
            <p><strong>Смерть:</strong> {selectedCharacter.death}</p>
            <button onClick={() => setSelectedCharacter(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
