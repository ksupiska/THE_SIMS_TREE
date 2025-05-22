// SimCreateForm.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import { supabase } from '../SupabaseClient';

import '../css/simform.css'

import { Button, Form } from 'react-bootstrap'

import { motion, AnimatePresence } from 'framer-motion'

import Cropper, { Area } from 'react-easy-crop';
import Modal from 'react-bootstrap/Modal';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


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

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  //обязательные поля для заполнения
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  //успешное добавление персонажа
  const [successMessage, setSuccessMessage] = useState("");

  //обработка аватара и открытие модального окна
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCropModalOpen(true);
      };
    }
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // чтобы не было CORS проблем
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<File | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
        } else {
          resolve(null);
        }
      }, 'image/jpeg');
    });
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (croppedImageFile) {
      setAvatar(croppedImageFile);
    }
    setCropModalOpen(false);
  };

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

    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Имя обязательно";
    if (!surname.trim()) newErrors.surname = "Фамилия обязательна";
    if (!gender) newErrors.gender = "Пол обязателен";
    if (!city.trim()) newErrors.city = "Город обязателен";
    if (!kind.trim()) newErrors.kind = "Черты характера обязательны";
    if (!state.trim()) newErrors.state = "Состояние обязательно";
    if (!type.trim()) newErrors.type = "Форма жизни обязательна";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // не отправляем форму, если есть ошибки
    }

    setErrors({}); // очистить ошибки перед отправкой

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
      setSuccessMessage("Персонаж успешно добавлен!");

      // Очистка формы — сброс всех стейтов
      setName("");
      setSurname("");
      setGender("");
      setCity("");
      setKind("");
      setState("");
      setType("");
      setBiography("");
      setDeath("");
      setAvatar(null);

      setErrors({});
    } catch (error) {
      console.error('Ошибка при добавлении персонажа:', error);
    }
  };


  return (
    <div className='sims-form-container'>
      <div className='sims-plunbob'></div>
      <Form onSubmit={handleSubmit} className='sims-form'>
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

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
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                  className="sims-input"
                  required />
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
                className="sims-input"
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicSurname'>
              <Form.Label className="sims-label">Фамилия</Form.Label>
              <Form.Control
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                type='text'
                placeholder='Введите фамилию'
                className="sims-input"
                isInvalid={!!errors.surname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.surname}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className='form-column'>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicGender'>
              <div className="sex-toggle-wrapper">
                <Form.Label className="sims-label">Пол</Form.Label>
                <div className={`sex-toggle ${errors.gender ? "error" : ""}`}>
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
                {errors.gender && <div className="text-danger">{errors.gender}</div>}
              </div>
            </Form.Group>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicType'>
              <Form.Label className="sims-label">Форма жизни</Form.Label>
              <div className={`lifeform-toggle-group ${errors.type ? "error" : ""}`}>
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
              {errors.type && <div className="text-danger">{errors.type}</div>}
            </Form.Group>

            <Form.Group className='mb-4 sims-form-group' controlId='formBasicCity'>
              <Form.Label className="sims-label">Город проживания</Form.Label>
              <Form.Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`sims-select ${errors.city ? "is-invalid" : ""}`}
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
              {errors.city && <div className="invalid-feedback">{errors.city}</div>}
            </Form.Group>
            <Form.Group className='mb-4 sims-form-group' controlId='formBasicState'>
              <Form.Label className="sims-label">Состояние персонажа</Form.Label>
              <Form.Select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`sims-select ${errors.state ? "is-invalid" : ""}`}
              >
                <option value="" disabled hidden>Выберите состояние</option>
                <option value="Жив">Жив</option>
                <option value="Мертв">Мертв</option>
              </Form.Select>
              {errors.state && <div className="invalid-feedback">{errors.state}</div>}
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
            className={`sims-input ${errors.kind ? "is-invalid" : ""}`}
          />
          {errors.kind && <div className="invalid-feedback">{errors.kind}</div>}
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
            className={`sims-input auto-resize-textarea ${errors.biography ? "is-invalid" : ""}`}
          />
          {errors.biography && <div className="invalid-feedback">{errors.biography}</div>}
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

      <Modal show={cropModalOpen} onHide={() => setCropModalOpen(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Обрезка изображения</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ position: 'relative', width: '100%', height: 400 }}>
            <Cropper
              image={imageSrc || ''}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(value) => setZoom(value as number)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCropModalOpen(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleCropSave}>Сохранить</Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
}
