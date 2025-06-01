import { useEffect, useState } from 'react';
import axios from 'axios';
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
        <div className="modal-overlay-list" onClick={() => { setSelectedCharacter(null); setIsEditing(false); }}>
          <div className="modal-content-list" onClick={(e) => e.stopPropagation()}>
            {!isEditing ? (
              <>
                <div className="modal-header-list">
                  <img src={selectedCharacter.avatar || '/default-avatar.png'} alt="Аватар" className="modal-avatar-list" />
                  <h2>{selectedCharacter.name} {selectedCharacter.surname}</h2>
                </div>

                <div className="modal-body-list">
                  <div className="info-section-list">
                    <h4>Основная информация</h4>
                    <p><strong>Пол:</strong> {selectedCharacter.gender}</p>
                    <p><strong>Город:</strong> {selectedCharacter.city}</p>
                  </div>
                  <div className="info-section-list">
                    <h4>Дополнительно</h4>
                    <p><strong>Тип:</strong> {selectedCharacter.type}</p>
                    <p><strong>Состояние:</strong> {selectedCharacter.state}</p>
                    <p><strong>Черты характера:</strong> {selectedCharacter.kind}</p>
                  </div>
                  <div className="info-section-list">
                    <h4>Биография</h4>
                    <p>{selectedCharacter.biography}</p>
                  </div>
                </div>

                <div className="modal-footer-list">
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
                <div className="modal-header-list">
                  <h2>Редактирование персонажа</h2>
                </div>
                <div className="modal-body-list">
                  <Form>
                    <Form.Group className="mb-2">
                      <Form.Label>Аватар</Form.Label>
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

                    <Form.Group className="mb-2">
                      <Form.Label>Имя</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={editFormData?.name || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Фамилия</Form.Label>
                      <Form.Control
                        type="text"
                        name="surname"
                        value={editFormData?.surname || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Город</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={editFormData?.city || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Тип</Form.Label>
                      <Form.Control
                        type="text"
                        name="type"
                        value={editFormData?.type || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Статус</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={editFormData?.state || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Черты характера</Form.Label>
                      <Form.Control
                        type="text"
                        name="kind"
                        value={editFormData?.kind || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Причина смерти (только если указано: мертв)</Form.Label>
                      <Form.Control
                        type="text"
                        name="death"
                        value={editFormData?.death || ''}
                        onChange={handleInputChange}
                        disabled={editFormData?.state?.toLowerCase() !== 'мертв'}
                      />
                    </Form.Group>

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

                <div className="modal-footer-list ">
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