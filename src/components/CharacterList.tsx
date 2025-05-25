import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/charaterlist.css'; // Подключим стили
import { supabase } from '../SupabaseClient';
import { Form, Container, Col, Row } from 'react-bootstrap'
import { CropModal } from './Tree/Modals/CropModal';
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

  //для фильтрации
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  //для изменения данны персонажей
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Character | null>(null);

  //для обрезки аватара
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const startEditing = () => {
    setEditFormData(selectedCharacter);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  //сохранение результатов
  const saveChanges = async () => {
    if (!editFormData) return;

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(editFormData)) {
        if (key === "avatarFile" && value instanceof File) {
          formData.append("avatar", value); // сервер ожидает "avatar"
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      }

      const response = await axios.put(
        `http://localhost:5000/api/characters/${editFormData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedCharacter = response.data.character;

      setCharacters((prev) =>
        prev.map((char) => (char.id === updatedCharacter.id ? updatedCharacter : char))
      );
      setSelectedCharacter(updatedCharacter);
      setIsEditing(false);
      setEditFormData(null);
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };




  useEffect(() => {
    const fetchCharacters = async () => {
      const { data, error } = await supabase.auth.getUser(); // Получаем текущего пользователя

      if (error || !data.user) {
        console.error('Пользователь не авторизован');
        return;
      }

      const userId = data.user.id; // Получаем user_id текущего пользователя

      try {
        // Логирование запроса
        console.log("Запрос к серверу с userId:", userId);
        const response = await axios.get(`http://localhost:5000/api/characters?userId=${userId}`);
        console.log("Ответ от сервера:", response.data); // Логируем ответ от сервера

        // Проверка структуры данных
        if (Array.isArray(response.data)) {
          setCharacters(response.data);
        } else {
          console.error("Данные не являются массивом:", response.data);
        }
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

      <Container className='p-1 justify-content-center'>
        <Row>
          <Col>
            <h4 className='d-flex justify-content-center p-4'>Поиск</h4>
            <div className="search-container">
              <span className="search-icon">
                <i className="bi bi-search"></i> {/* Иконка лупы */}
              </span>
              <Form.Group className='mb-4'>
                <Form.Control
                  className="search-input"
                  type="text"
                  placeholder="Поиск по имени или фамилии"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </div>
          </Col>
          <Col>
            <h4 className='d-flex justify-content-center p-3'>Фильтр</h4>
            <div className="filters-container">
              <Form.Group className="mb-4 filter-group">
                <Form.Select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Выберите пол</option>
                  <option value="мужской">Мужской</option>
                  <option value="женский">Женский</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4 filter-group">
                <Form.Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Выберите тип</option>
                  <option value="Человек">Человек</option>
                  <option value="Вампир">Вампир</option>
                  <option value="Русалка">Русалка</option>
                  <option value="Чародей">Чародей</option>
                  <option value="Пришелец">Пришелец</option>
                  <option value="Призрак">Призрак</option>
                  <option value="Оборотень">Оборотень</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Col>
          <Col className='p-5'>
            <button className="create-button" onClick={handleCreateNew}>
              Создать нового персонажа
            </button></Col>
        </Row>
      </Container>




      {characters.length === 0 ? (
        <div className="no-characters">
          <p>Персонажи не найдены</p>
        </div>
      ) : (
        <div className="character-list">
          {characters
            .filter((character) => {
              // Объединяем имя и фамилию для поиска
              const fullName = (character.name + " " + character.surname).toLowerCase();
              // Убираем пробелы и приводим к нижнему регистру для корректного сравнения
              const gender = character.gender.toLowerCase().trim();
              const filterGender = genderFilter.toLowerCase().trim();

              return (
                // Проверяем поиск по имени или фамилии
                (!searchTerm || fullName.includes(searchTerm.toLowerCase())) &&
                // Проверяем фильтр по полу
                (!genderFilter || gender === filterGender) &&
                // Проверяем фильтр по типу
                (!typeFilter || character.type === typeFilter)
              );
            })
            .map((character) => (
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
                <p>Тип: {character.type}</p>
              </div>
            ))}


        </div>
      )}

      {selectedCharacter && (
        <div className="modal-overlay" onClick={() => { setSelectedCharacter(null); setIsEditing(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {!isEditing ? (
              <>
                <div className="modal-header">
                  <img src={selectedCharacter.avatar || '/default-avatar.png'} alt="Аватар" className="modal-avatar" />
                  <h2>{selectedCharacter.name} {selectedCharacter.surname}</h2>
                </div>

                <div className="modal-body">
                  <div className="info-section">
                    <h4>Основная информация</h4>
                    <p><strong>Пол:</strong> {selectedCharacter.gender}</p>
                    <p><strong>Город:</strong> {selectedCharacter.city}</p>
                  </div>
                  <div className="info-section">
                    <h4>Дополнительно</h4>
                    <p><strong>Тип:</strong> {selectedCharacter.type}</p>
                    <p><strong>Состояние:</strong> {selectedCharacter.state}</p>
                    <p><strong>Черты характера:</strong> {selectedCharacter.kind}</p>
                  </div>
                  <div className="info-section">
                    <h4>Биография</h4>
                    <p>{selectedCharacter.biography}</p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button onClick={() => setSelectedCharacter(null)}>Закрыть</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedCharacter.id);
                    setSelectedCharacter(null);
                  }}>Удалить</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    startEditing();
                  }}>Редактировать</button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Редактирование персонажа</h2>
                </div>
                <div className="modal-body">
                  <Form>
                    <Form.Group className="mb-2">
                      <Form.Label>Avatar</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;
                          const file = target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setCropImage(reader.result as string);
                              setShowCropper(true);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}

                      />
                    </Form.Group>

                    {showCropper && cropImage && (
                      <CropModal
                        imageSrc={cropImage}
                        onClose={() => setShowCropper(false)}
                        onCropComplete={(croppedFile) => {
                          setEditFormData((prev) => prev ? { ...prev, avatarFile: croppedFile } : null);
                        }}
                      />
                    )}

                    {['name', 'surname', 'city', 'type', 'state', 'kind', 'death'].map((field) => (
                      <Form.Group className="mb-2" key={field}>
                        <Form.Label>{field === 'kind' ? 'Черты характера' : field[0].toUpperCase() + field.slice(1)}</Form.Label>
                        <Form.Control
                          type="text"
                          name={field}
                          value={(editFormData as Partial<Character>)[field as keyof Character] || ''}
                          onChange={handleInputChange}
                          disabled={field === 'death' && editFormData?.state?.toLowerCase() !== 'мертв'}
                        />
                      </Form.Group>
                    ))}

                    <Form.Group className="mb-2">
                      <Form.Label>Пол</Form.Label>
                      <Form.Select name="gender" value={editFormData?.gender || ''} onChange={handleInputChange}>
                        <option value="мужской">Мужской</option>
                        <option value="женский">Женский</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Биография</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="biography"
                        value={editFormData?.biography || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
                </div>

                <div className="modal-footer">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    cancelEditing();
                  }}>Отмена</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    saveChanges();
                  }}>Сохранить</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


    </div>
  );
}