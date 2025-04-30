//Header.tsx

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Nav, Container, Navbar, Button } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";



const Header = () => {
    return <div className='header'>
        <Navbar expand="lg" className="sticky-top bg-white border-bottom" style={{ backdropFilter: "blur(8px)" }}>
            <Container>
                <Navbar.Brand href="#" className="d-flex align-items-center">
                    <div className="position-relative" style={{ width: "40px", height: "40px" }}>
                        <div className="position-absolute" style={{ width: "40px", height: "40px" }}>
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    transform: "rotate(45deg)",
                                    backgroundColor: "#69d45b",
                                }}
                            ></div>
                        </div>
                    </div>
                    <span className="ms-2 fw-bold fs-4" style={{ color: "#4a8d56" }}>
                        The Sims Tree
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="/" className="fw-medium" style={{ color: "#4a8d56" }}>
                            Главная
                        </Nav.Link>
                        <Nav.Link href="/list" className="fw-medium text-secondary">
                            Персонажи
                        </Nav.Link>
                        <Nav.Link href="/list" className="fw-medium text-secondary">
                            Семьи
                        </Nav.Link>
                        <Nav.Link href="/" className="fw-medium text-secondary">
                            Дома
                        </Nav.Link>
                        <Nav.Link href="/simcreateform" className="fw-medium text-secondary">
                            Сообщество
                        </Nav.Link>
                    </Nav>
                    <div className="d-flex align-items-center gap-3">
                        <Button variant="link" className="p-1" style={{ color: "#4a8d56" }}>
                            <i className="bi bi-search"></i>
                            <span className="visually-hidden">Поиск</span>
                        </Button>
                        <Button className="rounded-pill" style={{ backgroundColor: "#4a8d56", borderColor: "#4a8d56" }}>
                            Войти
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    </div>;
};

export default Header;
