// src/pages/Home.tsx
import { Button, Container, Col, Row, Card } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../css/home.css';

const Home = () => {

  const navigate = useNavigate();

  const handleStart = () =>{
    navigate('/profile');
  };
  const handleRegister = () => {
    navigate('/signup');
  };

  return <div className='home'>
    <section className="py-5 py-md-7" style={{ background: "linear-gradient(to bottom, #e4f2ff, #ffffff)" }}>
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={7} className="d-flex flex-column justify-content-center">
            <div>
              <h1 className="fw-bold display-4" style={{ color: "#4a8d56" }}>
                Добро пожаловать в мир The Sims Tree
              </h1>
              <p className="fs-5 text-secondary mb-4">
                Исследуйте генеалогические древа, создавайте свои истории и делитесь ими с сообществом.
              </p>
            </div>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Button
                className="d-inline-flex align-items-center"
                style={{ backgroundColor: "#4a8d56", borderColor: "#4a8d56" }}
                onClick={handleStart}
              >
                Начать
              </Button>
              <Button
                variant="outline-secondary"
                className="d-inline-flex align-items-center"
                style={{ borderColor: "#4a8d56", color: "#4a8d56" }}
              >
                Узнать больше
              </Button>
            </div>
          </Col>
          <Col lg={5} className="d-flex align-items-center justify-content-center">
            <div className="position-relative rounded overflow-hidden" style={{ height: "350px", width: "100%" }}>
              <img src="sss" alt="sss" />
              <div className="position-absolute bottom-0 end-0 m-3" style={{ width: "64px", height: "64px" }}>
                <div
                  style={{
                    width: "160px",  // ширина
                    height: "160px",  // высота
                    backgroundColor: "#69d45b",
                    opacity: 0.8,
                    clipPath: "polygon(50% 0%, 70% 50%, 50% 100%, 30% 50%)", // создаёт ромб
                    margin: "-150px",  // отступы
                  }}
                ></div>

              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    {/* Features Section */}
    <section className="py-5 py-md-7 bg-white">
      <Container>
        <div className="text-center mb-5">
          <span
            className="d-inline-block px-3 py-1 rounded-pill fs-6 mb-2"
            style={{ backgroundColor: "#e4f2ff", color: "#4a8d56" }}
          >
            Возможности
          </span>
          <h2 className="display-5 fw-bold mb-3" style={{ color: "#4a8d56" }}>
            Создавайте свою историю
          </h2>
          <p className="fs-5 text-secondary mx-auto" style={{ maxWidth: "900px" }}>
            The Sims Tree предлагает множество инструментов для создания и отслеживания генеалогических древ ваших
            симов.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          <Col md={6} lg={4}>
            <Card
              className="h-100 border-2 transition-all"
              style={{ borderColor: "#e4f2ff" }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#69d45b")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e4f2ff")}
            >
              <Card.Body className="p-4 text-center d-flex flex-column align-items-center">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center mb-3"
                  style={{ backgroundColor: "#e4f2ff", width: "64px", height: "64px" }}
                >
                  <i className="bi bi-tree" style={{ fontSize: "32px", color: "#4a8d56" }}></i>
                </div>
                <Card.Title className="fs-4 fw-bold" style={{ color: "#4a8d56" }}>
                  Генеалогические древа
                </Card.Title>
                <Card.Text className="text-secondary">
                  Создавайте и управляйте сложными семейными древами для ваших симов.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card
              className="h-100 border-2 transition-all"
              style={{ borderColor: "#e4f2ff" }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#69d45b")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e4f2ff")}
            >
              <Card.Body className="p-4 text-center d-flex flex-column align-items-center">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center mb-3"
                  style={{ backgroundColor: "#e4f2ff", width: "64px", height: "64px" }}
                >
                  <i className="bi bi-people" style={{ fontSize: "32px", color: "#4a8d56" }}></i>
                </div>
                <Card.Title className="fs-4 fw-bold" style={{ color: "#4a8d56" }}>
                  Профили персонажей
                </Card.Title>
                <Card.Text className="text-secondary">
                  Детальные профили для каждого персонажа с историей, чертами и отношениями.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card
              className="h-100 border-2 transition-all"
              style={{ borderColor: "#e4f2ff" }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#69d45b")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e4f2ff")}
            >
              <Card.Body className="p-4 text-center d-flex flex-column align-items-center">
              <div
                  className="rounded-circle d-flex justify-content-center align-items-center mb-3"
                  style={{ backgroundColor: "#e4f2ff", width: "64px", height: "64px" }}
                >
                  <i className="bi bi-houses" style={{ fontSize: "32px", color: "#4a8d56" }}></i>
                </div>
                <Card.Title className="fs-4 fw-bold" style={{ color: "#4a8d56" }}>
                  Дома и участки
                </Card.Title>
                <Card.Text className="text-secondary">Каталогизируйте дома и участки, где живут ваши симы.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
    {/* Community Section */}
    <section className="py-5 py-md-7" style={{ backgroundColor: "#e4f2ff" }}>
      <Container>
        <Row className="g-5">
          <Col lg={6} className="d-flex flex-column justify-content-center">
            <span
              className="d-inline-block px-3 py-1 rounded-pill fs-6 mb-2 bg-white"
              style={{ color: "#4a8d56", width: "fit-content" }}
            >
              Сообщество
            </span>
            <h2 className="display-5 fw-bold mb-3" style={{ color: "#4a8d56" }}>
              Присоединяйтесь к сообществу
            </h2>
            <p className="fs-5 text-secondary mb-4">
              Делитесь своими историями, находите вдохновение и общайтесь с другими фанатами The Sims.
            </p>
            <div>
              <Button style={{ backgroundColor: "#4a8d56", borderColor: "#4a8d56" }}>Присоединиться</Button>
            </div>
          </Col>
          <Col lg={6}>
            <Row className="g-3">
              <Col xs={6}>
                <Row className="g-3">
                  <Col xs={12}>
                    <div className="rounded overflow-hidden">
                      <img src="sss" alt="sss" />
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="rounded overflow-hidden">
                      <img src="sss" alt="sss" />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={6}>
                <Row className="g-3">
                  <Col xs={12}>
                    <div className="rounded overflow-hidden">
                      <img src="sss" alt="sss" />
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="rounded overflow-hidden">
                      <img src="sss" alt="sss" />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Latest Updates */}
    <section className="py-5 py-md-7 bg-white">
      <Container>
        <div className="text-center mb-5">
          <span
            className="d-inline-block px-3 py-1 rounded-pill fs-6 mb-2"
            style={{ backgroundColor: "#e4f2ff", color: "#4a8d56" }}
          >
            Новости
          </span>
          <h2 className="display-5 fw-bold mb-3" style={{ color: "#4a8d56" }}>
            Последние обновления
          </h2>
          <p className="fs-5 text-secondary mx-auto" style={{ maxWidth: "900px" }}>
            Будьте в курсе последних новостей и обновлений The Sims Tree.
          </p>
        </div>

        <Row className="g-4">
          {[1, 2, 3].map((i) => (
            <Col key={i} md={4}>
              <Card
                className="h-100 border-2 transition-all"
                style={{ borderColor: "#e4f2ff" }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#69d45b")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e4f2ff")}
              >
                <div className="position-relative" style={{ height: "200px" }}>
                  <img src="sss" alt="sss" />
                </div>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-2 text-secondary mb-2">
                    <i className="bi bi-calendar-event"></i>
                    <small>30 апреля 2025</small>
                  </div>
                  <Card.Title className="fs-4 fw-bold" style={{ color: "#4a8d56" }}>
                    Новое обновление {i}
                  </Card.Title>
                  <Card.Text className="text-secondary">
                    Краткое описание обновления и новых функций, которые были добавлены.
                  </Card.Text>
                  <Button variant="link" className="p-0 d-flex align-items-center" style={{ color: "#4a8d56" }}>
                    Читать далее
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
    {/* CTA Section */}
    <section className="py-5 py-md-7 text-white" style={{ backgroundColor: "#4a8d56" }}>
      <Container>
        <div className="text-center">
          <h2 className="display-5 fw-bold mb-3">Начните свое путешествие сегодня</h2>
          <p className="fs-5 mx-auto mb-4" style={{ maxWidth: "700px" }}>
            Присоединяйтесь к тысячам игроков, которые уже создают свои уникальные истории в The Sims Tree.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Button variant="light" className="fw-medium" style={{ color: "#4a8d56" }} onClick={handleRegister}>
              Зарегистрироваться
            </Button>
            <Button variant="outline-light" className="fw-medium">
              Узнать больше
            </Button>
          </div>
        </div>
      </Container>
    </section>
  </div>;
};

export default Home;
