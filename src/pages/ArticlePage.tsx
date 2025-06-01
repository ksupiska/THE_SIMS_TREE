import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";
import { Button } from "react-bootstrap";

import { motion } from "framer-motion"
import { BsArrowLeft, BsCalendar } from "react-icons/bs"

import '../css/article.css';
interface Article {
    id: string
    title: string
    content: string
    image: string | null
    created_at: string
}

export default function ArticlePage() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    //const [readingTime, setReadingTime] = useState(0)

    useEffect(() => {
        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Ошибка при загрузке статьи:", error.message);
                navigate("/blog", { replace: true });
            } else {
                setArticle(data);
            }
            setLoading(false);
        };

        fetchArticle();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="loading-container-full-article">
                <div className="loading-spinner-full-article"></div>
                <p>Загрузка статьи...</p>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="error-container-full-article">
                <h2>Статья не найдена</h2>
                <p>Запрашиваемая статья не существует или была удалена.</p>
                <Button href="/blog" className="back-button-full-article">
                    <BsArrowLeft /> Вернуться к блогу
                </Button>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString("ru-RU", options)
    }


    return (
        <div className="article-page-container-full-article">
            {/* Навигация */}
            <motion.div
                className="article-navigation-full-article"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Button href="/blog" className="back-link-full-article">
                    <BsArrowLeft className="back-icon-full-article" />
                    <span>Назад к блогу</span>
                </Button>
            </motion.div>

            {/* Основной контент */}
            <motion.article
                className="article-content-full-article"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {/* Заголовок статьи */}
                <header className="article-header-full-article">
                    <h1 className="article-title-full-article">{article.title}</h1>

                    <div className="article-meta-full-article">
                        <div className="meta-item-full-article">
                            <BsCalendar className="meta-icon-full-article" />
                            <span>{formatDate(article.created_at)}</span>
                        </div>
                    </div>
                </header>

                {/* Изображение статьи */}
                {article.image && (
                    <motion.div
                        className="article-image-container-full-article"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <img src={article.image || "/placeholder.svg"} alt={article.title} className="article-image-full-article" />
                    </motion.div>
                )}

                {/* Текст статьи */}
                <motion.div
                    className="article-text-full-article"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    {article.content.split("\n").map((paragraph, index) => (
                        <p key={index} className="article-paragraph-full-article">
                            {paragraph}
                        </p>
                    ))}
                </motion.div>

                
            </motion.article>
        </div>
    );
}