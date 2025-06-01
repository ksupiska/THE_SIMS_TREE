import { useEffect, useState } from 'react';
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

  type EditCharacterData = Character & {
    avatarFile?: File | null;
  };

  const [editFormData, setEditFormData] = useState<EditCharacterData | null>(null);
  //сохранение результатов
  const saveChanges = async () => {
    if (!editFormData) return;

    try {
      const {
        id,
        name,
        surname,
        gender,
        avatarFile,
        city,
        kind,
        state,
        type,
        biography,
        death,
      } = editFormData;

      if (!id) {
        console.error('Нет id для обновления');
        return;
      }

      let avatarUrl = editFormData.avatar || null;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatars/${id}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('Ошибка загрузки аватара:', uploadError);
          return;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarUrl = data.publicUrl;
      }

      const updateData = {
        name,
        surname,
        gender,
        avatar: avatarUrl,
        city,
        kind,
        state,
        type,
        biography,
        death,
      };

      const { data: updatedCharacter, error } = await supabase
        .from('characters')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Ошибка при обновлении:', error);
        return;
      }

      if (!updatedCharacter) {
        console.warn('Обновление прошло, но данных нет в ответе');
        return;
      }

      setCharacters((prev) =>
        prev.map((char) => (char.id === updatedCharacter.id ? updatedCharacter : char))
      );
      setSelectedCharacter(updatedCharacter);
      setIsEditing(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError('Пользователь не авторизован');
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const { data, error: charactersError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId);

      if (charactersError) {
        setError(charactersError.message);
        setLoading(false);
        return;
      }

      setCharacters(data ?? []);
      setLoading(false);
    };

    fetchCharacters();
  }, []);


  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelEditing();
                    }}
                    disabled={loading}
                  >
                    Отмена
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveChanges();
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Сохраняем...' : 'Сохранить'}
                  </button>
                  {error && <div style={{ color: 'red' }}>{error}</div>}
                </div>
              </>
            )}
          </div>
        </div>
      )}


    </div>
  );
}