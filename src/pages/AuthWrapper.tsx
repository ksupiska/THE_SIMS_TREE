
import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
import SignupForm from "../components/auth/SignupForm"
import type { User } from "@supabase/supabase-js"
//import { useNavigate } from "react-router-dom"
// import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { motion } from "framer-motion"
import {
    LogOut,
} from "lucide-react"
import {
    BsPeople,
    BsTree,
    BsPencilSquare,
    BsGear,
    BsShare,
} from "react-icons/bs"
import '../css/userprofile.css'

const AuthWrapper = () => {
    const [user, setUser] = useState<User | null>(null)
    const [activeTab, setActiveTab] = useState("profile")
    //const navigate = useNavigate()
    const [role, setRole] = useState<string | null>(null)


    useEffect(() => {
        if (!user) return

        const fetchProfile = async () => {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile) {
                setRole(profile.role) // создаёшь useState role
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

    // const handleCreateTree = () => {
    //     navigate("/tree")
    // }


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
                        </div>
                        <button className="edit-profile-button" onClick={() => supabase.auth.signOut()}>
                            <LogOut size={18} className="me-2" />
                            Выйти
                        </button>
                    </motion.div>
                </div>
            </section>
            {/* Навигация */}
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

            {/* Основной контент */}
            <section className="profile-content">
                <div className="content-container">
                    {activeTab === "profile" && (
                        <motion.div
                            className="profile-tab"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Быстрые действия */}
                            <div className="actions-section">
                                <h2 className="section-title">Быстрые действия</h2>
                                <div className="actions-grid">
                                    <motion.button
                                        className="action-card create-tree"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <BsTree className="action-icon" />
                                        <span>Создать древо</span>
                                    </motion.button>
                                    <motion.button
                                        className="action-card write-article"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <BsPencilSquare className="action-icon" />
                                        <span>Написать статью</span>
                                    </motion.button>
                                    <motion.button
                                        className="action-card find-friends"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <BsPeople className="action-icon" />
                                        <span>Найти друзей</span>
                                    </motion.button>
                                    <motion.button
                                        className="action-card share-tree"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <BsShare className="action-icon" />
                                        <span>Поделиться</span>
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



        </div>
    )
}

export default AuthWrapper
