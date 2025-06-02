"use client"

import { motion } from "framer-motion"
import { BsShieldX, BsHouse } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import "../css/accessdenied.css"

interface AccessDeniedProps {
    message?: string
    showBackButton?: boolean
    showHomeButton?: boolean
}

export default function AccessDenied({
    message = "У вас нет доступа к этой странице",
    showHomeButton = true,
}: AccessDeniedProps) {
    const navigate = useNavigate()

    return (
        <div className="access-denied-container">
            {/* Фоновый градиент */}
            <div className="access-denied-background"></div>

            {/* Основной контент */}
            <div className="access-denied-content">
                <motion.div
                    className="access-denied-card"
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Иконка */}
                    <motion.div
                        className="access-denied-icon-wrapper"
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <BsShieldX className="access-denied-icon" />
                    </motion.div>

                    {/* Заголовок */}
                    <motion.h1
                        className="access-denied-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Доступ запрещен
                    </motion.h1>

                    {/* Сообщение */}
                    <motion.p
                        className="access-denied-message"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {message}
                    </motion.p>

                    {/* Дополнительная информация */}
                    <motion.div
                        className="access-denied-info"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <p>Возможные причины:</p>
                        <ul>
                            <li>У вас недостаточно прав для просмотра этой страницы</li>
                            <li>Ваша сессия могла истечь</li>
                            <li>Страница предназначена только для администраторов</li>
                        </ul>
                    </motion.div>

                    {/* Кнопки действий */}
                    <motion.div
                        className="access-denied-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        {showHomeButton && (
                            <button className="access-denied-button home-button" onClick={() => navigate('/')}>
                                <BsHouse className="button-icon" />
                                На главную
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Декоративные элементы */}
            <div className="access-denied-decoration decoration-1">
                <BsShieldX className="decoration-icon" />
            </div>
            <div className="access-denied-decoration decoration-2">
                <BsShieldX className="decoration-icon" />
            </div>
            <div className="access-denied-decoration decoration-3">
                <BsShieldX className="decoration-icon" />
            </div>
        </div>
    )
}
