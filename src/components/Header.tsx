import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Nav, Container, Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="header">
            <Navbar expand="lg" className="sticky-top bg-white border-bottom py-2" style={{ backdropFilter: "blur(8px)" }}>
                <Container>
                    <Navbar.Brand href="/" className="d-flex align-items-center me-4">
                        <div className="position-relative" style={{ width: "40px", height: "40px" }}>
                            <div className="position-absolute" style={{ width: "40px", height: "40px" }}>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#69d45b",
                                        opacity: 0.8,
                                        clipPath: "polygon(50% 0%, 70% 50%, 50% 100%, 30% 50%)",
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
                        <Nav className="mx-auto gap-3">
                            <Nav.Link href="/" className="fw-medium" style={{ color: "#4a8d56" }}>
                                Главная
                            </Nav.Link>
                            <Nav.Link href="/tree" className="fw-medium text-secondary">
                                Древо
                            </Nav.Link>
                            <Nav.Link href="/instruction" className="fw-medium text-secondary">
                                Инструкция
                            </Nav.Link>
                            <Nav.Link href="/blog" className="fw-medium text-secondary">
                                Блог
                            </Nav.Link>
                        </Nav>

                        <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                            <Button
                                className="rounded-pill"
                                style={{ backgroundColor: "#4a8d56", borderColor: "#4a8d56" }}
                                onClick={() => navigate('/auth')}
                            >
                                Войти
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div>
    );
};

export default Header;
