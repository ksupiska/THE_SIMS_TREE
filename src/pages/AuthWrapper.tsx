
import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
import SignupForm from "../components/auth/SignupForm"
import type { User } from "@supabase/supabase-js"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, ProgressBar, Button } from "react-bootstrap"
import {
    UserIcon,
    LogOut,
    TreesIcon as Tree,
    Heart,
    Brain,
    Coffee,
    Award,
    Settings,
    House,
    Users,
    BookOpen,
} from "lucide-react"
import '../css/userprofile.css'

const AuthWrapper = () => {
    const [user, setUser] = useState<User | null>(null)
    const [activeTab, setActiveTab] = useState("profile")
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    if (!user) {
        return (
            <div className="signup-container">
                <SignupForm />
            </div>
        )
    }

    const handleCreateTree = () => {
        navigate("/tree")
    }

    // Демо-данные для статистики в стиле Симс
    const stats = [
        { name: "Энергия", value: 75, color: "#4a8d56" },
        { name: "Настроение", value: 90, color: "#e3b02d" },
        { name: "Социальность", value: 60, color: "#4a7a9d" },
        { name: "Творчество", value: 85, color: "#b04a8d" },
    ]

    // Демо-достижения
    const achievements = [
        { name: "Первое древо", completed: true },
        { name: "Социальная бабочка", completed: true },
        { name: "Мастер генеалогии", completed: false },
    ]

    return (
        <Container fluid className="sims-profile-container p-0">
            {/* Заголовок в стиле Симс */}
            <div className="sims-header py-3 px-4 mb-4">
                <Row className="align-items-center">
                    <Col xs={8} className="d-flex align-items-center">
                        <div className="sims-avatar-container me-3">
                            <div className="sims-avatar-border">
                                <img
                                    src="/placeholder.svg?height=80&width=80"
                                    alt="Аватар пользователя"
                                    width={80}
                                    height={80}
                                    className="sims-avatar"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="sims-username mb-0">{user.email?.split("@")[0] || "Симс"}</h2>
                            <p className="sims-email mb-0 text-muted">{user.email}</p>
                        </div>
                    </Col>
                    <Col xs={4} className="text-end">
                        <Button variant="danger" className="sims-button logout-button" onClick={() => supabase.auth.signOut()}>
                            <LogOut size={18} className="me-2" />
                            Выйти
                        </Button>
                    </Col>
                </Row>
            </div>

            <Container>
                <Row>
                    {/* Левая боковая панель - Навигация */}
                    <Col lg={3} md={4} className="mb-4">
                        <Card className="sims-panel">
                            <Card.Header className="sims-panel-header">
                                <h5 className="mb-0">Меню</h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="sims-nav">
                                    <Button
                                        variant={activeTab === "profile" ? "success" : "outline-success"}
                                        className="sims-nav-item w-100 text-start mb-2"
                                        onClick={() => setActiveTab("profile")}
                                    >
                                        <UserIcon size={18} className="me-2" />
                                        Профиль
                                    </Button>
                                    <Button
                                        variant={activeTab === "trees" ? "success" : "outline-success"}
                                        className="sims-nav-item w-100 text-start mb-2"
                                        onClick={() => setActiveTab("trees")}
                                    >
                                        <Tree size={18} className="me-2" />
                                        Мои древа
                                    </Button>
                                    <Button
                                        variant={activeTab === "friends" ? "success" : "outline-success"}
                                        className="sims-nav-item w-100 text-start mb-2"
                                        onClick={() => setActiveTab("friends")}
                                    >
                                        <Users size={18} className="me-2" />
                                        Друзья
                                    </Button>
                                    <Button
                                        variant={activeTab === "messages" ? "success" : "outline-success"}
                                        className="sims-nav-item w-100 text-start mb-2"
                                        onClick={() => setActiveTab("messages")}
                                    >
                                        <House size={18} className="me-2" />
                                        Дома
                                    </Button>
                                    <Button
                                        variant={activeTab === "settings" ? "success" : "outline-success"}
                                        className="sims-nav-item w-100 text-start"
                                        onClick={() => setActiveTab("settings")}
                                    >
                                        <Settings size={18} className="me-2" />
                                        Настройки
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="sims-panel mt-4">
                            <Card.Header className="sims-panel-header">
                                <h5 className="mb-0">Достижения</h5>
                            </Card.Header>
                            <Card.Body>
                                {achievements.map((achievement, index) => (
                                    <div key={index} className="achievement-item d-flex align-items-center mb-2">
                                        <div className={`achievement-icon me-2 ${achievement.completed ? "completed" : "incomplete"}`}>
                                            <Award size={18} />
                                        </div>
                                        <span className={achievement.completed ? "text-success" : "text-muted"}>{achievement.name}</span>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Основная область контента */}
                    <Col lg={9} md={8}>
                        {activeTab === "profile" && (
                            <>
                                <Card className="sims-panel mb-4">
                                    <Card.Header className="sims-panel-header">
                                        <h5 className="mb-0">Характеристики</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            {stats.map((stat, index) => (
                                                <Col md={6} key={index} className="mb-3">
                                                    <div className="stat-label d-flex justify-content-between">
                                                        <span>{stat.name}</span>
                                                        <span>{stat.value}%</span>
                                                    </div>
                                                    <ProgressBar
                                                        now={stat.value}
                                                        variant="success"
                                                        style={{ height: "12px", backgroundColor: "#e9ecef" }}
                                                        className="sims-progress"
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card className="sims-panel mb-4">
                                    <Card.Header className="sims-panel-header">
                                        <h5 className="mb-0">Действия</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={4} sm={6} className="mb-3">
                                                <Button variant="success" className="sims-action-button w-100" onClick={handleCreateTree}>
                                                    <Tree size={24} className="mb-2" />
                                                    <div>Создать древо</div>
                                                </Button>
                                            </Col>
                                            <Col md={4} sm={6} className="mb-3">
                                                <Button variant="success" className="sims-action-button w-100">
                                                    <BookOpen size={24} className="mb-2" />
                                                    <div>Изучить историю</div>
                                                </Button>
                                            </Col>
                                            <Col md={4} sm={6} className="mb-3">
                                                <Button variant="success" className="sims-action-button w-100">
                                                    <Users size={24} className="mb-2" />
                                                    <div>Найти родственников</div>
                                                </Button>
                                            </Col>
                                            <Col md={4} sm={6} className="mb-3">
                                                <Button variant="success" className="sims-action-button w-100">
                                                    <Heart size={24} className="mb-2" />
                                                    <div>Отдохнуть</div>
                                                </Button>
                                            </Col>
                                            <Col md={4} sm={6} className="mb-3">
                                                <Button variant="success" className="sims-action-button w-100">
                                                    <Brain size={24} className="mb-2" />
                                                    <div>Изучить навык</div>
                                                </Button>
                                            </Col>
                                            <Col md={4} sm={6} className="mb-3">
                                                <Button variant="success" className="sims-action-button w-100">
                                                    <Coffee size={24} className="mb-2" />
                                                    <div>Выпить кофе</div>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </>
                        )}

                        {activeTab === "trees" && (
                            <Card className="sims-panel">
                                <Card.Header className="sims-panel-header">
                                    <h5 className="mb-0">Мои генеалогические древа</h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center py-4">
                                        <Tree size={48} className="mb-3 text-muted" />
                                        <p className="mb-3">У вас пока нет созданных древ</p>
                                        <Button variant="success" className="sims-button" onClick={handleCreateTree}>
                                            Создать первое древо
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Другие вкладки будут реализованы аналогично */}
                        {(activeTab === "friends" || activeTab === "messages" || activeTab === "settings") && (
                            <Card className="sims-panel">
                                <Card.Header className="sims-panel-header">
                                    <h5 className="mb-0">
                                        {activeTab === "friends" && "Друзья"}
                                        {activeTab === "messages" && "Сообщения"}
                                        {activeTab === "settings" && "Настройки"}
                                    </h5>
                                </Card.Header>
                                <Card.Body className="text-center py-5">
                                    <p>Этот раздел находится в разработке</p>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default AuthWrapper
