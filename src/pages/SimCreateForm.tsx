// src/pages/SimCreateForm.tsx
import React, { useEffect, useState } from 'react';

import axios from 'axios';

import '../css/simform.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { motion, AnimatePresence } from "framer-motion";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import CharacterDetail from '../components/CharacterDetail';


interface Human {
    id: number;
    name: string;
    surname: string;
    sex: string;
    avatar?: string;
    city_living: string;
    state_of_life: string;
    cause_of_death?: string;
    kind: string;
    type: string;
    biography: string;
}


const SimCreateForm = () => {
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);


    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [sex, setSex] = useState('');
    const [city_living, setCity] = useState('');
    const [state_of_life, setStateOfLife] = useState('');
    const [cause_of_death, setCauseOfDeath] = useState('');
    const [kind, setKind] = useState('');
    const [type, setType] = useState('');
    const [biography, setBiography] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [members, setMembers] = useState<Human[]>([]);


    const fetchPersonalities = async () => {
        try {
            const response = await axios.get('http://localhost:3001/personalities');
            setMembers(response.data);

        } catch (error) {
            console.error('Ошибка при получении персонажей:', error);
        }
    };

    useEffect(() => {
        fetchPersonalities();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('surname', surname);
            formData.append('sex', sex);
            formData.append('city_living', city_living);
            formData.append('state_of_life', state_of_life);
            formData.append('cause_of_death', cause_of_death);
            formData.append('kind', kind);
            formData.append('type', type);
            formData.append('biography', biography);
            if (avatar) {
                formData.append('avatar', avatar);
            }

            await axios.post('http://localhost:3001/personalities', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setName('');
            setSurname('');
            setSex('');
            setCity('');
            setStateOfLife('');
            setCauseOfDeath('');
            setKind('');
            setType('');
            setBiography('');
            setAvatar(null);

            fetchPersonalities();
        } catch (error) {
            console.error('Ошибка при добавлении персонажа:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3001/personalities/${id}`);
            // Обновляем список после удаления
            await fetchPersonalities();
            setSelectedCharacterId(null); // если показывается detail — вернуться к списку
        } catch (error) {
            console.error('Ошибка при удалении персонажа:', error);
        }
    };


    return <div>

        <div className='sims-form-container'>
            <div className="sims-plumbob"></div>

            <Form onSubmit={handleSubmit} className="sims-form">
                <h2 className="sims-form-title">
                    <span className="sims-green">Создание</span> <span className="sims-blue">персонажа</span>
                </h2>

                <div className="form-grid">
                    {/* Левая колонка */}
                    <div className="form-column">
                        <Form.Group className='mb-4 sims-form-group'>
                            <Form.Label className="sims-label">Выберите аватар</Form.Label>
                            <div className="sims-file-input">
                                <Form.Control
                                    type='file'
                                    onChange={(e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0] || null;
                                        setAvatar(file);
                                    }}
                                    className="sims-input"
                                />
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

                    {/* Правая колонка */}
                    <div className="form-column">
                        <Form.Group className='mb-4 sims-form-group' controlId='formBasicSex'>
                            <div className="sex-toggle-wrapper">
                                <Form.Label className="sims-label">Пол</Form.Label>
                                <div className="sex-toggle">
                                    <button
                                        type="button"
                                        className={`sex-toggle-button ${sex === "Мужской" ? "active" : ""}`}
                                        onClick={() => setSex("Мужской")}
                                    >
                                        Мужской
                                    </button>
                                    <button
                                        type="button"
                                        className={`sex-toggle-button ${sex === "Женский" ? "active" : ""}`}
                                        onClick={() => setSex("Женский")}
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
                                value={city_living}
                                onChange={(e) => setCity(e.target.value)}
                                className="sims-select"
                            >
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
                                value={state_of_life}
                                onChange={(e) => setStateOfLife(e.target.value)}
                                required
                                className="sims-select"
                            >
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
                    {state_of_life === "Мертв" && (
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
                                    value={cause_of_death}
                                    onChange={(e) => setCauseOfDeath(e.target.value)}
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
        <div className='mt-4 text'>
            <h3 className='mb-4 text-center'>Персонажи</h3>
            {!selectedCharacterId ? (
                <div className='d-flex flex-wrap justify-content-center gap-4'>
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className='d-flex flex-column align-items-center'
                            style={{ width: '120px', cursor: 'pointer' }}
                            onClick={() => setSelectedCharacterId(member.id)}
                        >
                            <div className='position-relative'>
                                {member.avatar && (
                                    <img
                                        src={`http://localhost:3001${member.avatar}`}
                                        alt='avatar'
                                        className='rounded-circle object-fit-cover shadow'
                                        width={100}
                                        height={100}
                                    />
                                )}
                                <div className='position-absolute bottom-0 end-0 bg-primary rounded-circle p-1 border border-2 border-white'></div>
                            </div>
                            <div className='mt-2 text-center'>
                                <div className='fw-semibold'>{member.name}</div>
                                <div className='text-muted small'>{member.surname}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-4">
                    <Button variant="secondary" className="mb-3" onClick={() => setSelectedCharacterId(null)}>
                        Назад к списку
                    </Button>

                    <CharacterDetail
                        character={members.find((m) => m.id === selectedCharacterId)!}
                        onDelete={handleDelete}
                    />
                </div>

            )}

        </div>
    </div>;
};

export default SimCreateForm;


{/*  */ }