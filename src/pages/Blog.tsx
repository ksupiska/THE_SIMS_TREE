import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../SupabaseClient"

import { Button } from "react-bootstrap"

import { motion } from "framer-motion"
import { BsDiamond, BsPencilSquare, BsCalendar, BsArrowRight, BsSearch } from "react-icons/bs";

import '../css/blog.css';

interface Article {
    id: string
    title: string
    content: string
    image: string | null
    created_at: string
}

export default function BlogPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublishedArticles = async () => {
            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .eq("status", "published")
                .order("created_at", { ascending: false })

            if (error) {
                console.error("Ошибка при загрузке статей:", error.message)
            } else {
                setArticles(data || [])
            }

            setLoading(false)
        }

        fetchPublishedArticles()
    }, [])

    if (loading) return <p>Загрузка...</p>


    // Фильтрация статей по поисковому запросу
    const filteredArticles = articles.filter(
        (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    // Форматирование даты
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString("ru-RU", options)
    }
    return (
        <div className="blog-container">
            {/* Заголовок блога */}
            <section className="blog-header">
                <div className="blog-header-overlay"></div>
                <div className="blog-header-content">
                    <motion.div
                        className="blog-header-text"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="blog-title-wrapper">
                            <h1 className="blog-title">Блог</h1>
                        </div>
                        <p className="blog-subtitle">Статьи, советы и истории о генеалогии и семейных династиях</p>
                    </motion.div>
                </div>
            </section>

            {/* Панель действий */}
            <section className="blog-actions">
                <div className="blog-actions-container">
                    <div className="search-container-blog">
                        <BsSearch className="search-icon-blog" />
                        <input
                            type="text"
                            placeholder="Поиск статей..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input-blog"
                        />
                    </div>
                    <button
                        type="button"
                        className="create-article-button-blog"
                        onClick={() => navigate("/createarticle")}>
                        <BsPencilSquare className="button-icon-blog" />
                        Написать статью
                    </button>
                </div>
            </section>

            {/* Список статей */}
            <section className="blog-content">
                <div className="blog-content-container">
                    {loading ? (
                        <div className="loading-container-blog">
                            <div className="loading-spinner-blog"></div>
                            <p className="loading-text-blog">Загрузка статей...</p>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="empty-state-blog">
                            <BsPencilSquare className="empty-icon-blog" />
                            <h3>Статьи не найдены</h3>
                            {searchQuery ? (
                                <p>По запросу "{searchQuery}" ничего не найдено. Попробуйте изменить запрос.</p>
                            ) : (
                                <p>Пока нет опубликованных статей. Будьте первым, кто напишет статью!</p>
                            )}
                            <button
                                type="button"
                                className="create-article-button-blog"
                                onClick={() => navigate("/createarticle")}>
                                <BsPencilSquare className="button-icon-blog" />
                                Написать статью
                            </button>
                        </div>
                    ) : (
                        <div className="articles-grid-blog">
                            {filteredArticles.map((article, index) => (
                                <motion.article
                                    key={article.id}
                                    className="article-card-blog"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                                >
                                    <div className="article-image-container-blog">
                                        <img
                                            src={article.image || "/placeholder.svg?height=300&width=600"}
                                            alt={article.title}
                                            className="article-image-blog"
                                        />
                                        <div className="article-date-blog">
                                            <BsCalendar className="date-icon-blog" />
                                            <span>{formatDate(article.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="article-content-blog">
                                        <h2 className="article-title-blog">{article.title}</h2>
                                        <p className="article-excerpt-blog">{article.content.substring(0, 150)}...</p>
                                        <Button 
                                        variant="link" 
                                        className="read-more-blog"
                                         onClick={() => navigate(`/article/${article.id}`)}
                                        >
                                            <span>Читать далее</span>
                                            <BsArrowRight className="arrow-icon-blog" />
                                        </Button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Секция призыва к действию */}
            <section className="blog-cta-blog">
                <div className="cta-overlay-blog"></div>
                <div className="cta-container-blog">
                    <motion.div
                        className="cta-content-blog"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="cta-title-blog">Поделитесь своей историей</h2>
                        <p className="cta-description-blog">
                            У вас есть интересная история о вашей семье или советы по генеалогическим исследованиям? Поделитесь ими с
                            нашим сообществом!
                        </p>
                        <Button type="button" className="cta-button-blog" onClick={() => navigate("/createarticle")}>
                            <BsPencilSquare className="button-icon-blog" />
                            Написать статью
                        </Button>
                        
                    </motion.div>
                </div>
            </section>

            {/* Декоративные элементы */}
            <div className="decoration decoration-top-left">
                <BsDiamond className="decoration-diamond pink" />
            </div>
            <div className="decoration decoration-bottom-right">
                <BsDiamond className="decoration-diamond blue" />
            </div>
        </div>
    )
}
