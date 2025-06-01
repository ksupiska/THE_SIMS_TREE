import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";

import { motion } from "framer-motion";
import { BsDiamond, BsPencilSquare, BsImage, BsCheck, BsX, BsEye } from "react-icons/bs";

import { Button } from "react-bootstrap";

import '../css/createarticle.css';
export default function CreateArticlePage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id || null);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) return alert("Вы не авторизованы");

        const { error } = await supabase.from("articles").insert([
            {
                title,
                content,
                image,
                author_id: userId,
                status: "pending", // статья на модерации
            },
        ]);

        if (error) {
            alert("Ошибка при создании статьи: " + error.message);
        } else {
            alert("Статья отправлена на модерацию! А пока, можете ознакомиться со всеми доступными статьями");
            navigate("/blog");
        }
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setImage(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }
    const [isPreview, setIsPreview] = useState(false)
    return (
        <div className="create-article-container-art">
            {/* Заголовок страницы */}
            <section className="article-header-art">
                <div className="article-header-overlay-art"></div>
                <div className="article-header-content-art">
                    <motion.div
                        className="header-text-art"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="header-title-wrapper-art">

                            <h1 className="header-title-art">Написать статью</h1>

                        </div>
                        <p className="header-subtitle-art">Поделитесь своими историями или опытом с сообществом</p>
                        <p className="header-subtitle-art">Напишите о своих мыслях, своих правилах игры и тому подобное!</p>
                    </motion.div>
                </div>
            </section>

            {/* Основной контент */}
            <section className="article-content-art">
                <div className="content-wrapper-art">
                    <div className="form-container-art">
                        {!isPreview ? (
                            <motion.div
                                className="article-form-art"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="form-header-art">
                                    <h2 className="form-title-art">
                                        <BsPencilSquare className="form-icon-art" />
                                        Создание статьи
                                    </h2>
                                    <button
                                        type="button"
                                        className="preview-button-art"
                                        onClick={() => setIsPreview(true)}
                                        disabled={!title || !content}
                                    >
                                        <BsEye className="button-icon-art" />
                                        Предпросмотр
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="article-form-content-art">
                                    <div className="form-group-art">
                                        <label className="form-label-art">Заголовок статьи</label>
                                        <input
                                            type="text"
                                            placeholder="Введите заголовок статьи..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="form-input-art title-input-art"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-art">
                                        <label className="form-label-art">Изображение</label>
                                        <div className="image-upload-section-art">
                                            {image ? (
                                                <div className="image-preview-art">
                                                    <img src={image || "/placeholder.svg"} alt="Предпросмотр" className="preview-image-art" />
                                                    <Button type="button" className="remove-image-art" onClick={() => setImage("")}>
                                                        <BsX />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="upload-area-art">
                                                    <BsImage className="upload-icon-art" />
                                                    <p>Добавьте изображение к статье</p>
                                                    <div className="upload-options-art">
                                                        <label className="upload-button-art">
                                                            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                                                            Загрузить файл
                                                        </label>
                                                        <span className="upload-divider-art">или</span>
                                                        <input
                                                            type="url"
                                                            placeholder="Вставьте ссылку на изображение"
                                                            value={image}
                                                            onChange={(e) => setImage(e.target.value)}
                                                            className="url-input-art"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label-art">Содержание статьи</label>
                                        <textarea
                                            placeholder="Напишите содержание вашей статьи..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="form-textarea-art"
                                            rows={12}
                                            required
                                        />
                                        <div className="character-count-art">{content.length} символов</div>
                                    </div>

                                    <div className="form-actions-art">
                                        <button type="button" className="cancel-button-art">
                                            Отмена
                                        </button>
                                        <button type="submit" className="submit-button-art">
                                            <BsCheck className="button-icon-art" />
                                            Отправить на модерацию
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="article-preview-art"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="preview-header-art">
                                    <h2 className="preview-title-art">Предпросмотр статьи</h2>
                                    <button type="button" className="back-to-edit-art" onClick={() => setIsPreview(false)}>
                                        <BsPencilSquare className="button-icon-art" />
                                        Редактировать
                                    </button>
                                </div>

                                <div className="preview-content-art">
                                    <article className="preview-article-art">
                                        <h1 className="preview-article-title-art">{title || "Заголовок статьи"}</h1>
                                        {image && (
                                            <div className="preview-article-image-art">
                                                <img src={image || "/placeholder.svg"} alt={title} />
                                            </div>
                                        )}
                                        <div className="preview-article-content-art">
                                            {content.split("\n").map((paragraph, index) => (
                                                <p key={index}>{paragraph}</p>
                                            ))}
                                        </div>
                                    </article>
                                </div>

                                <div className="preview-actions-art">
                                    <button type="button" className="cancel-button-art" onClick={() => setIsPreview(false)}>
                                        Редактировать
                                    </button>
                                    <button type="button" className="submit-button-art" onClick={handleSubmit}>
                                        <BsCheck className="button-icon-art" />
                                        Отправить на модерацию
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Декоративные элементы */}
            <div className="decoration decoration-left-art">
                <BsDiamond className="decoration-diamond purple" />
            </div>
            <div className="decoration decoration-right-art">
                <BsDiamond className="decoration-diamond green" />
            </div>
        </div>
    );
}
