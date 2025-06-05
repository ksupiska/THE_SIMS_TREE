//Header.tsx
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

import '../css/header.css';

const Footer = () => {
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
                                            width: "40px",  // ширина
                                            height: "40px",  // высота
                                            backgroundColor: "#69d45b",
                                            opacity: 0.8,
                                            clipPath: "polygon(50% 0%, 70% 50%, 50% 100%, 30% 50%)", // создаёт ромб
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
                                <i className="bi bi-github"></i>
                                <span className="visually-hidden">Facebook</span>
                            </Button>
                            <Button variant="light" className="p-2 rounded-circle" style={{ color: "#4a8d56" }}>
                                <i className="bi bi-telegram"></i>
                                <span className="visually-hidden">Twitter</span>
                            </Button>
                            <Button variant="light" className="p-2 rounded-circle" style={{ color: "#4a8d56" }}>
                                <i className="bi bi-instagram"></i>
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
                                        <Link to="/tree" className="text-decoration-none text-secondary">
                                            Древо
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/instruction" className="text-decoration-none text-secondary">
                                            Инструкция
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={4}>
                                <h5 className="fw-bold mb-3" style={{ color: "#4a8d56" }}>
                                    Сообщество
                                </h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/blog" className="text-decoration-none text-secondary">
                                            Блог
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

export default Footer;
