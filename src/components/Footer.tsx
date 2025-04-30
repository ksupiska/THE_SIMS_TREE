//Header.tsx
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

import '../css/header.css';

const Header = () => {
    return <div className='header'>
        <footer className="py-5 bg-white border-top">
            <Container>
                <Row className="g-4">
                    <Col lg={6}>
                        <div className="mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="position-relative" style={{ width: "32px", height: "32px" }}>
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            transform: "rotate(45deg)",
                                            backgroundColor: "#69d45b",
                                        }}
                                    ></div>
                                </div>
                                <span className="ms-2 fw-bold fs-5" style={{ color: "#4a8d56" }}>
                                    The Sims Tree
                                </span>
                            </div>
                            <p className="text-secondary" style={{ maxWidth: "350px" }}>
                                Создавайте, исследуйте и делитесь генеалогическими древами ваших симов.
                            </p>
                        </div>
                        <div className="d-flex gap-2 mb-4">
                            <Button variant="light" className="p-2 rounded-circle" style={{ color: "#4a8d56" }}>
                                {/* <Facebook size={20} /> */}
                                <span className="visually-hidden">Facebook</span>
                            </Button>
                            <Button variant="light" className="p-2 rounded-circle" style={{ color: "#4a8d56" }}>
                                {/* <Twitter size={20} /> */}
                                <span className="visually-hidden">Twitter</span>
                            </Button>
                            <Button variant="light" className="p-2 rounded-circle" style={{ color: "#4a8d56" }}>
                                {/* <Instagram size={20} /> */}
                                <span className="visually-hidden">Instagram</span>
                            </Button>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <Row>
                            <Col sm={4}>
                                <h5 className="fw-bold mb-3" style={{ color: "#4a8d56" }}>
                                    Навигация
                                </h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Главная
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Персонажи
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Семьи
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Дома
                                        </Link>
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={4}>
                                <h5 className="fw-bold mb-3" style={{ color: "#4a8d56" }}>
                                    Сообщество
                                </h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Форум
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Блог
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            События
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Галерея
                                        </Link>
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={4}>
                                <h5 className="fw-bold mb-3" style={{ color: "#4a8d56" }}>
                                    Поддержка
                                </h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Помощь
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            FAQ
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Контакты
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/" className="text-decoration-none text-secondary">
                                            Политика
                                        </Link>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="text-center text-secondary pt-4 mt-4 border-top">
                    <p>© 2025 The Sims Tree. Все права защищены.</p>
                </div>
            </Container>
        </footer>
    </div>;
};

export default Header;
