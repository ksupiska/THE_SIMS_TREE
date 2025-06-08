import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
import SignupForm from "../components/auth/SignupForm"
import type { User } from "@supabase/supabase-js"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
    LogOut,
} from "lucide-react"
import {
    BsPeople,
    BsTree,
    BsPencilSquare,
    BsGear,
    BsCheck,
    BsX,
    BsEnvelope,
    BsBell,
} from "react-icons/bs"
import '../css/userprofile.css';
import '../css/userprofilemodals.css';
import { Button } from "react-bootstrap";

const AuthWrapper = () => {
    const [user, setUser] = useState<User | null>(null)
    const [activeTab, setActiveTab] = useState("profile")
    const navigate = useNavigate()
    const [role, setRole] = useState<string | null>(null)

    //модальное окно поддержки
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportSubject, setSupportSubject] = useState("");
    const [supportMessage, setSupportMessage] = useState("");

    //модальное окно уведомлений
    type SupportReply = {
        id: number;
        reply: string;
        message_id: number;
        created_at: string;
        support_messages?: {
            subject: string;
        };
    };

    const [loadingNotifications, setLoadingNotifications] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [supportReplies, setSupportReplies] = useState<SupportReply[]>([]);

    //загрузка уведомлений
    const fetchSupportReplies = async () => {
        setLoadingNotifications(true);

        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;

        if (!userId) {
            setLoadingNotifications(false);
            return;
        }

        const { data, error } = await supabase
            .from("support_replies")
            .select("*, support_messages(id, subject, user_id)")
            .order("created_at", { ascending: false });

        if (!error && data) {
            const filteredReplies = data.filter(
                reply => reply.support_messages?.user_id === userId
            );
            setSupportReplies(filteredReplies);
        }

        setLoadingNotifications(false);
    };

    const handleOpenNotifications = async () => {
        await fetchSupportReplies();
        setNotificationsOpen(true);
    };

    useEffect(() => {
        if (!user) return

        const fetchProfile = async () => {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile) {
                setRole(profile.role)
            }
            if (error) {
                console.error("Ошибка при получении роли пользователя:", error.message)
            }
        }

        fetchProfile()
    }, [user])


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

    const handleSendSupportMessage = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Вы должны быть авторизованы.");
            return;
        }

        const { error } = await supabase.from("support_messages").insert({
            user_id: user.id,
            subject: supportSubject,
            message: supportMessage,
            status: "pending",
        });

        if (!error) {
            alert("Письмо отправлено!");
            setShowSupportModal(false);
            setSupportSubject("");
            setSupportMessage("");
        } else {
            console.error(error);
            alert("Ошибка при отправке письма.");
        }
    };

    return (
        <div className="profile-container">
            <section className="profile-header">
                <div className="profile-header-overlay"></div>
                <div className="profile-header-content">
                    <motion.div
                        className="profile-info"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="user-details">
                            <h1 className="user-nickname">{user.email?.split("@")[0] || "Симс"}</h1>
                            <p className="user-email">{user.email}</p>
                            <p className="user-email">{role}</p>
                        </div>
                        <div className="profile-buttons">
                            <button className="edit-profile-button" onClick={() => supabase.auth.signOut()}>
                                <LogOut size={18} className="me-2" />
                                Выйти
                            </button>
                            {role === "admin" && (
                                <button
                                    className="edit-profile-button admin-button"
                                    onClick={() => navigate("/admin")}
                                    style={{ marginTop: "0.5rem" }}
                                >
                                    <BsGear size={18} className="me-2" />
                                    Админ панель
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
            <section className="profile-navigation">
                <div className="nav-container">
                    <div className="nav-tabs">
                        {[
                            { id: "profile", label: "Профиль", icon: <BsPeople /> },
                            { id: "trees", label: "Древа", icon: <BsTree /> },
                            { id: "articles", label: "Статьи", icon: <BsPencilSquare /> },
                            { id: "settings", label: "Настройки", icon: <BsGear /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon}
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="profile-content">
                <div className="content-container">
                    {activeTab === "profile" && (
                        <motion.div
                            className="profile-tab"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >

                            <div className="actions-section">
                                <h2 className="section-title">Быстрые действия</h2>
                                <div className="actions-grid">
                                    <motion.button
                                        className="action-card create-tree"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate("/tree")}
                                    >
                                        <BsTree className="action-icon" />
                                        <span>Создать древо</span>
                                    </motion.button>
                                    <motion.button
                                        className="action-card write-article"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate("/createarticle")}
                                    >
                                        <BsPencilSquare className="action-icon" />
                                        <span>Написать статью</span>
                                    </motion.button>
                                    <motion.button
                                        className="action-card find-friends"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowSupportModal(true)}
                                    >
                                        <BsPeople className="action-icon" />
                                        <span>Написать письмо в поддержку</span>
                                    </motion.button>
                                    <motion.button
                                        className="action-card share-tree"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleOpenNotifications}
                                    >
                                        <BsBell className="action-icon" />
                                        <span>Уведомления</span>
                                    </motion.button>

                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "trees" && (
                        <motion.div
                            className="trees-tab"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="empty-state-auth">
                                <BsTree className="empty-icon-auth" />
                                <h3>У вас пока нет древ династий</h3>
                                <p>Создайте свое первое древо и начните отслеживать историю семьи</p>
                                <button className="create-button-auth">
                                    <BsTree className="button-icon-auth" />
                                    Создать первое древо
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "articles" && (
                        <motion.div
                            className="articles-tab"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="empty-state-auth">
                                <BsPencilSquare className="empty-icon-auth" />
                                <h3>У вас пока нет статей</h3>
                                <p>Поделитесь своими историями и опытом с сообществом</p>
                                <button className="create-button-auth">
                                    <BsPencilSquare className="button-icon-auth" />
                                    Написать первую статью
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "settings" && (
                        <motion.div
                            className="settings-tab"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="settings-content">
                                <h2 className="section-title">Настройки профиля</h2>
                                <div className="settings-grid">
                                    <div className="setting-item">
                                        <h3>Приватность</h3>
                                        <p>Управление видимостью профиля</p>
                                    </div>
                                    <div className="setting-item">
                                        <h3>Уведомления</h3>
                                        <p>Настройка уведомлений</p>
                                    </div>
                                    <div className="setting-item">
                                        <h3>Безопасность</h3>
                                        <p>Изменение пароля</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {showSupportModal && (
                <div className="modal-overlay-sup" onClick={() => setShowSupportModal(false)}>
                    <div className="modal-content-sup" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-sup">
                            <h2 className="modal-title-sup">
                                <BsEnvelope className="modal-icon-sup" />
                                Обратиться в поддержку
                            </h2>
                            <Button className="close-btn-sup" onClick={() => setShowSupportModal(false)}>
                                <BsX size={20} />
                            </Button>
                        </div>

                        <div className="modal-body-sup">
                            <div className="form-group-sup">
                                <label htmlFor="support-subject" className="form-label-sup">
                                    Тема сообщения
                                </label>
                                <input
                                    id="support-subject"
                                    className="form-input-sup"
                                    placeholder="Введите тему письма..."
                                    type="text"
                                    value={supportSubject}
                                    onChange={(e) => setSupportSubject(e.target.value)}
                                />
                            </div>

                            <div className="form-group-sup">
                                <label htmlFor="support-message" className="form-label-sup">
                                    Сообщение
                                </label>
                                <textarea
                                    id="support-message"
                                    className="form-textarea-sup"
                                    rows={6}
                                    placeholder="Опишите вашу проблему или вопрос подробно..."
                                    value={supportMessage}
                                    onChange={(e) => setSupportMessage(e.target.value)}
                                />
                                <div className="character-count-sup">{supportMessage.length} символов</div>
                            </div>
                        </div>

                        <div className="modal-footer-sup">
                            <button className="btn-cancel-sup" onClick={() => setShowSupportModal(false)}>
                                <BsX className="btn-icon-sup" />
                                Отмена
                            </button>
                            <button
                                className="btn-send-sup"
                                onClick={handleSendSupportMessage}
                                disabled={!supportSubject.trim() || !supportMessage.trim()}
                            >
                                <BsCheck className="btn-icon-sup" />
                                Отправить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notificationsOpen && (
                <div className="modal-overlay-notif" onClick={() => setNotificationsOpen(false)}>
                    <div className="modal-content-notif" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-notif">
                            <h3 className="modal-title-notif">
                                <BsBell className="modal-icon-notif" />
                                Уведомления
                            </h3>
                            <Button className="close-btn-notif" onClick={() => setNotificationsOpen(false)}>
                                <BsX size={20} />
                            </Button>
                        </div>

                        <div className="modal-body-notif">
                            {loadingNotifications ? (
                                <div className="loading-notifications-notif">
                                    <div className="loading-spinner-notif"></div>
                                    <p className="loading-text-notif">Загрузка уведомлений...</p>
                                </div>
                            ) : supportReplies.length === 0 ? (
                                <div className="empty-notifications-notif">
                                    <BsBell className="empty-icon-notif" />
                                    <h3>Нет новых уведомлений</h3>
                                    <p>Здесь будут отображаться ответы от службы поддержки</p>
                                </div>
                            ) : (
                                supportReplies.map((reply, index) => (
                                    <div key={reply.id} className={`notification-item-notif ${index === 0 ? "new" : ""}`}>
                                        <div className="notification-header-notif">
                                            <h4 className="notification-subject-notif">
                                                Ответ на: {reply.support_messages?.subject || "Без темы"}
                                            </h4>
                                            <span className="notification-date-notif">
                                                {new Date(reply.created_at).toLocaleString("ru-RU")}
                                            </span>
                                        </div>
                                        <p className="notification-content-notif">{reply.reply}</p>
                                        {index === 0 && <div className="notification-badge-notif">Новое</div>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AuthWrapper
