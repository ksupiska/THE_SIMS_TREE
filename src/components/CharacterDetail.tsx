import React from 'react';
import { Card, ListGroup, Button, Modal } from 'react-bootstrap';

import '../css/simcard.css';

interface Props {
    character: {
        id: number;
        avatar?: string;
        name: string;
        surname: string;
        sex: string;
        city_living: string;
        state_of_life: string;
        cause_of_death?: string;
        kind: string;
        type: string;
    };
    onDelete: (id: number) => void; // функция удаления
}



const CharacterDetail: React.FC<Props> = ({ character, onDelete }) => {

    const [showModal, setShowModal] = React.useState(false);


    const handleDeleteConfirmation = () => {
        onDelete(character.id);
        setShowModal(false); // Этого достаточно!
    };


    return (
        <div>
            <Card className="character-card">
                {character.avatar && (
                    <Card.Img
                        variant="top"
                        src={`http://localhost:3001${character.avatar}`}
                        className="character-img"
                    />
                )}
                <Card.Body className="character-body">
                    <Card.Title className="character-title">
                        {character.name} {character.surname}
                    </Card.Title>
                    <ListGroup variant="flush" className="character-list mb-3">
                        <ListGroup.Item><strong>Пол:</strong> {character.sex}</ListGroup.Item>
                        <ListGroup.Item><strong>Город:</strong> {character.city_living}</ListGroup.Item>
                        <ListGroup.Item><strong>Состояние:</strong> {character.state_of_life}</ListGroup.Item>
                        <ListGroup.Item><strong>Черты:</strong> {character.kind}</ListGroup.Item>
                        <ListGroup.Item><strong>Форма жизни:</strong> {character.type}</ListGroup.Item>
                        {character.cause_of_death && (
                            <ListGroup.Item><strong>Причина смерти:</strong> {character.cause_of_death}</ListGroup.Item>
                        )}
                    </ListGroup>
                    <Button
                        variant="danger"
                        className="character-delete-btn"
                        onClick={() => setShowModal(true)}
                    >
                        Удалить
                    </Button>
                </Card.Body>
            </Card>


            {/* Модальное окно подтверждения */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтвердите удаление</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены, что хотите удалить этого персонажа?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отменить
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmation}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CharacterDetail;
