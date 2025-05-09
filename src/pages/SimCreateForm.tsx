// SimCreateForm.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import { supabase } from '../SupabaseClient';

import '../css/simform.css'

import { Button, Form } from 'react-bootstrap'

import { motion, AnimatePresence } from 'framer-motion'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function SimCreateForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [death, setDeath] = useState('');
  const [kind, setKind] = useState('');
  const [type, setType] = useState('');
  const [biography, setBiography] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);

  const [userId, setUserId] = useState<string | null>(null);//юз пользователя

  //получаем пользователя из бд
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      } else {
        console.error("Ошибка получения пользователя:", error);
      }
    };

    fetchUser();
  }, []);

  const [state, setState] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("Вы должны быть авторизованы, чтобы создать персонажа.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('gender', gender);
    formData.append('city', city);
    formData.append('kind', kind);
    formData.append('state', state);
    formData.append('type', type);
    formData.append('biography', biography);
    formData.append('death', death);

    formData.append('user_id', userId);

    if (avatar) formData.append('avatar', avatar);

    try {
      const response = await axios.post('http://localhost:5000/api/characters', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Успешно!', response.data);
    } catch (error) {
      console.error('Ошибка при добавлении персонажа:', error);
    }
  };


  return (
    <div className='sims-form-container'>
      <div className='sims-plunbob'></div>
      <Form onSubmit={handleSubmit} className='sims-form'>
        <h2 className="sims-form-title">
          <span className="sims-green">Создание</span> <span className="sims-blue">персонажа</span>
        </h2>

        <div className='form-grid'>
          {/*левая колонка*/}
          <div className='form-column'>
            <Form.Group className='mb-4 sims-form-group'>
              <Form.Label className='sims-label'>Выберите аватар</Form.Label>
              <div className='sims-file-input'>
                <Form.Control
                  type='file'
                  onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0] || null;
                    setAvatar(file);
                  }} className='sims-input' />
                <div className="sims-file-preview">
                  {avatar ? (
                    <img src={URL.createObjectURL(avatar)} alt="Avatar preview" className="sims-avatar-preview" />
                  ) : (
                    <div className="sims-avatar-placeholder">👤</div>
                  )}
                </div>
              </div>
            </Form.Group>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicName'>
              <Form.Label className="sims-label">Имя</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                type='text'
                placeholder='Введите имя'
                required
                className="sims-input"
              />
            </Form.Group>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicSurname'>
              <Form.Label className="sims-label">Фамилия</Form.Label>
              <Form.Control
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                type='text'
                placeholder='Введите фамилию'
                required
                className="sims-input"
              />
            </Form.Group>
          </div>
          <div className='form-column'>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicGender'>
              <div className="sex-toggle-wrapper">
                <Form.Label className="sims-label">Пол</Form.Label>
                <div className="sex-toggle">
                  <button
                    type="button"
                    className={`sex-toggle-button ${gender === "Мужской" ? "active" : ""}`}
                    onClick={() => setGender("Мужской")}
                  >
                    Мужской
                  </button>
                  <button
                    type="button"
                    className={`sex-toggle-button ${gender === "Женский" ? "active" : ""}`}
                    onClick={() => setGender("Женский")}
                  >
                    Женский
                  </button>
                </div>
              </div>
            </Form.Group>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicType'>
              <Form.Label className="sims-label">Форма жизни</Form.Label>
              <div className="lifeform-toggle-group">
                {["Человек", "Вампир", "Русалка", "Чародей", "Пришелец", "Призрак", "Оборотень"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`lifeform-toggle-button ${type === option ? "active" : ""}`}
                    onClick={() => setType(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Form.Group>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicCity'>
              <Form.Label className="sims-label">Город проживания</Form.Label>
              <Form.Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="sims-select"
              >
                <option value="" disabled hidden>Выберите город</option>
                <option value="Виллоу Крик">Виллоу Крик</option>
                <option value="Оазис Спрингс">Оазис Спрингс</option>
                <option value="Ньюкрест">Ньюкрест</option>
                <option value="Магнолия променейд">Магнолия променейд</option>
                <option value="Винденбург">Винденбург</option>
                <option value="Сан Мишуно">Сан Мишуно</option>
                <option value="Форготн Холлоу">Форготн Холлоу</option>
                <option value="Бриндлтон-Бей">Бриндлтон-Бей</option>
                <option value="Дель-Соль-Вэлли">Дель-Соль-Вэлли</option>
                <option value="Стрейнджервилль">Стрейнджервилль</option>
                <option value="Сулани">Сулани</option>
                <option value="Глиммербрук">Глиммербрук</option>
                <option value="Бритчестер">Бритчестер</option>
                <option value="Эвергрин-Харбор">Эвергрин-Харбор</option>
                <option value="Вранбург">Вранбург</option>
                <option value="Нордхавен">Нордхавен</option>
                <option value="Сиусад-Энаморада">Сиусад-Энаморада</option>
                <option value="Томаранг">Томаранг</option>
                <option value="Сан-Секвойя">Сан-Секвойя</option>
                <option value="Батуу">Батуу</option>
                <option value="Сельвадорада">Сельвадорада</option>
                <option value="Гора Комореби">Гора Комореби</option>
                <option value="Гранит-Фоллз">Гранит-Фоллз</option>
                <option value="Тартоза">Тартоза</option>
                <option value="Коппердейл">Коппердейл</option>
                <option value="Хэнфорд-он-Бэгли">Хэнфорд-он-Бэгли</option>
                <option value="Мунвуд Милл">Мунвуд Милл</option>
                <option value="Честнад Ридж">Честнад Ридж</option>
                <option value="Эвергрин Харбор">Эвергрин Харбор</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicState'>
              <Form.Label className="sims-label">Состояние персонажа</Form.Label>
              <Form.Select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="sims-select"
              >
                <option value="" disabled hidden>Выберите состояние</option>
                <option value="Жив">Жив</option>
                <option value="Мертв">Мертв</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>
        <Form.Group className='mb-4 sims-form-group' controlId='formBasicKind'>
          <Form.Label className="sims-label">Черты характера</Form.Label>
          <Form.Control
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            type='text'
            placeholder='Введите черты характера'
            required
            className="sims-input"
          />
          <div className="sims-traits-hint">Например: Добрый, Весёлый, Гений</div>
        </Form.Group>
        <Form.Group className='mb-4 sims-form-group' controlId='formBasicBiography'>
          <Form.Label className="sims-label">Биография</Form.Label>
          <Form.Control
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            as='textarea'
            rows={3}
            placeholder='Введите биографию персонажа, или его историю'
            className="sims-input auto-resize-textarea"
          />
        </Form.Group>
        <AnimatePresence>
          {state === "Мертв" && (
            <motion.div
              key="death-cause"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Form.Group className='mb-4 sims-form-group' controlId='formBasicDeath'>
                <Form.Label className="sims-label">Причина смерти</Form.Label>
                <Form.Control
                  value={death}
                  onChange={(e) => setDeath(e.target.value)}
                  type='text'
                  placeholder='Введите причину смерти'
                  className="sims-input"
                />
              </Form.Group>
            </motion.div>
          )}
        </AnimatePresence>
        <Button type="submit" className="sims-submit-btn">
          <span className="sims-btn-icon">✓</span>
          <span className="sims-btn-text">Сохранить персонажа</span>
        </Button>
      </Form>

    </div>
  );
}
