// src/pages/SimCreateForm.tsx
import React, { useEffect, useState } from 'react';

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'C:/Users/kspiska/Desktop/DIPLOM/family-tree/node_modules/bootstrap-icons/font/bootstrap-icons.css';

import CharacterDetail from '../components/CharacterDetail';


type CharacterDetailType = {
    id: number;
    name: string;
    surname: string;
    sex: string;
    avatar?: string;
    city_living: string;
    state_of_life: string;
    cause_of_death?: string;
    kind: string;

};

type Human = {
    id: number;
    name: string;
    surname: string;
    sex: string;
    avatar?: string;
};





const SimCreateForm = () => {
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);


    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [sex, setSex] = useState('');
    const [city_living, setCity] = useState('');
    const [state_of_life, setStateOfLife] = useState('');
    const [cause_of_death, setCauseOfDeath] = useState('');
    const [kind, setKind] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [members, setMembers] = useState<Human[]>([]);

    //для модального окна после удаления персонажа
    const [showModal, setShowModal] = useState(false);
    const [deletedCharacterName, setDeletedCharacterName] = useState<string | null>(null);

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
            setAvatar(null);

            fetchPersonalities();
        } catch (error) {
            console.error('Ошибка при добавлении персонажа:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const deletedCharacter = members.find(m => m.id === id);
            await axios.delete(`http://localhost:3001/personalities/${id}`);

            setDeletedCharacterName(`${deletedCharacter?.name} ${deletedCharacter?.surname}`);
            setShowModal(true); // Показать модалку

            fetchPersonalities(); // Обновить список
        } catch (error) {
            console.error('Ошибка при удалении персонажа:', error);
        }
    };

    return <div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Удаление</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Персонаж <strong>{deletedCharacterName}</strong> успешно удалён.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => setShowModal(false)}>
                    ОК
                </Button>
            </Modal.Footer>
        </Modal>

        <div className='form-wrapper'>
            <Form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <h2 className='d-flex justify-content-center'>Создание персонажа</h2>
                <Form.Group className='mb-3'>
                    <Form.Label>Выберите аватар</Form.Label>
                    <Form.Control
                        type='file'
                        onChange={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0] || null;
                            setAvatar(file);
                        }}
                    />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label>Введите имя</Form.Label>
                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} type='name' placeholder='Введите имя' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicSurname'>
                    <Form.Label>Введите фамилию</Form.Label>
                    <Form.Control value={surname} onChange={(e) => setSurname(e.target.value)} type='surname' placeholder='Введите фамилию' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicSex'>
                    <Form.Label>Введите пол</Form.Label>
                    <Form.Control value={sex} onChange={(e) => setSex(e.target.value)} type='sex' placeholder='Введите пол' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicCity'>
                    <Form.Label>Выберите город проживания</Form.Label>
                    <Form.Select value={city_living} onChange={(e) => setCity(e.target.value)}>
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
                <Form.Group className='mb-3' controlId='formBasicCity'>
                    <Form.Label>Выберите состояние персонажа</Form.Label>
                    <Form.Select value={state_of_life} onChange={(e) => setStateOfLife(e.target.value)} required>
                        <option value="Жив">Жив</option>
                        <option value="Мертв">Мертв</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicKind'>
                    <Form.Label>Введите черты характера</Form.Label>
                    <Form.Control value={kind} onChange={(e) => setKind(e.target.value)} type='kind' placeholder='Введите черты характера' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicKind'>
                    <Form.Label>Введите причину смерти</Form.Label>
                    <Form.Control value={cause_of_death} onChange={(e) => setCauseOfDeath(e.target.value)} type='cause_of_death' placeholder='Введите причину смерти' />
                </Form.Group>
                <Button type="submit">Сохранить</Button>
            </Form>
        </div>
        <div className='mt-4'>
            <h3>Персонажи:</h3>
            {!selectedCharacterId ? (
                <div className='d-flex flex-wrap gap-3 mt-4'>
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className='card p-2 text-center'
                            style={{
                                width: '10rem',
                                cursor: 'pointer',
                                border: '1px solid #ccc',
                                borderRadius: '1rem',
                                backgroundColor: '#fff',
                            }}
                            onClick={() => setSelectedCharacterId(member.id)}
                        >
                            {member.avatar && (
                                <img
                                    src={`http://localhost:3001${member.avatar}`}
                                    alt='avatar'
                                    width={80}
                                    height={80}
                                    style={{ borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }}
                                />
                            )}
                            <div style={{ fontWeight: 'bold' }}>
                                {member.name} {member.surname}
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
                        character={members.find((m) => m.id === selectedCharacterId) as CharacterDetailType}
                        onDelete={handleDelete}
                    />

                </div>
            )}

        </div>
    </div>;
};

export default SimCreateForm;
