import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BsPlus, BsTrash, BsEye, BsPencil, BsCheck, BsX, BsPencilSquare, BsImage, BsCamera } from "react-icons/bs"
import { Button } from "react-bootstrap";

import { supabase } from "../SupabaseClient";
import '../css/admin.css';
import '../css/replymodal.css';

interface Article {
  id: string;
  title: string;
  content: string;
  image: string | null;
  status: "draft" | "published" | "pending";
  created_at: string;
}
type SupportMessage = {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  created_at: string;
  status: "pending" | "replied";
};


export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    image: "",
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)


  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("support_messages")
        .select(`id, subject, message, created_at, status, user_id`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ошибка при загрузке сообщений:", error);
      } else if (data) {
        // Приведение поля status к нужному типу, если нужно
        const normalized = data.map((msg) => ({
          ...msg,
          status: msg.status as "pending" | "replied",
        }));
        setSupportMessages(normalized);

      }
    };

    fetchMessages();
  }, []);



  //состояния для ответа пользователю
  const [replyingMessage, setReplyingMessage] = useState<SupportMessage | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSendReply = async () => {
    if (!replyingMessage || !replyContent.trim()) {
      alert("Введите ответ.");
      return;
    }

    const { error: replyError } = await supabase.from("support_replies").insert({
      message_id: replyingMessage.id,
      reply: replyContent.trim(),
    });

    const { error: statusError } = await supabase
      .from("support_messages")
      .update({ status: "replied" })
      .eq("id", replyingMessage.id);

    if (!replyError && !statusError) {
      alert("Ответ отправлен.");
      setReplyingMessage(null);
      setReplyContent("");

      // Обновить статус сообщения локально
      const updated = supportMessages.map((msg) =>
        msg.id === replyingMessage.id
          ? { ...msg, status: "replied" as const }
          : msg
      );
      setSupportMessages(updated);

    } else {
      console.error("Ошибка при отправке ответа:", replyError || statusError);
      alert("Ошибка при отправке ответа.");
    }
  };



  // Загрузка статей из Supabase
  useEffect(() => {
    const fetchProfileAndArticles = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "admin") {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      setIsAdmin(true)

      // Получаем статьи с любым статусом, чтобы показать и "pending"
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })

      const articlesData = data as Article[]

      if (error) {
        console.error("Ошибка загрузки статей:", error)
      } else {
        setArticles(articlesData || [])
      }

      setIsLoading(false)
    }

    fetchProfileAndArticles()
  }, [])

  //для сохранения отредактированной статьи
  const handleUpdateArticle = async () => {
    if (!currentArticle) return;

    const { error } = await supabase
      .from("articles")
      .update({
        title: currentArticle.title,
        content: currentArticle.content,
        image: currentArticle.image,
      })
      .eq("id", currentArticle.id);

    if (error) {
      alert("Ошибка при обновлении статьи: " + error.message);
      return;
    }

    setArticles(articles.map(a =>
      a.id === currentArticle.id ? currentArticle : a
    ));
  };


  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (!isAdmin) {
    return <p>У вас нет доступа к этой странице.</p>
  }

  // Создание статьи — сохраняем в Supabase с статусом draft (или pending, если хочешь)
  const handleCreateArticle = async () => {
    if (!newArticle.title || !newArticle.content) return

    const { data, error } = await supabase
      .from("articles")
      .insert({
        title: newArticle.title,
        content: newArticle.content,
        image: newArticle.image || null,
        status: "draft", // или "pending", если статья отправляется на проверку
      })
      .select()
      .single()

    if (error) {
      alert("Ошибка при создании статьи: " + error.message)
      return
    }

    setArticles([data, ...articles])
    setNewArticle({ title: "", content: "", image: "" })
    setIsCreating(false)
  }

  // Удаление статьи из Supabase и локально
  const handleDeleteArticle = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id)
    if (error) {
      alert("Ошибка при удалении статьи: " + error.message)
      return
    }
    setArticles(articles.filter(article => article.id !== id))
  }

  // Переключение статуса статьи в Supabase и локально
  const handleToggleStatus = async (id: string) => {
    const article = articles.find(a => a.id === id)
    if (!article) return

    // меняем статус draft <-> published
    const newStatus = article.status === "draft" ? "published" : "draft"

    const { error } = await supabase
      .from("articles")
      .update({ status: newStatus })
      .eq("id", id)

    if (error) {
      alert("Ошибка при обновлении статуса: " + error.message)
      return
    }

    setArticles(
      articles.map(a => (a.id === id ? { ...a, status: newStatus } : a))
    )
  }

  const handleOpenModal = (article: Article) => {
    setCurrentArticle(article)
    setShowModal(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewArticle({ ...newArticle, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="admin-container-adm">
      {/* Заголовок админки */}
      <div className="admin-header-adm">
        <div className="admin-header-overlay-adm" />
        <div className="admin-header-content-adm">
          <motion.div
            className="admin-title-section-adm"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="admin-title-wrapper-adm">
              <h1 className="admin-main-title-adm">Панель администратора</h1>
            </div>
            <p className="admin-subtitle-adm">Управление статьями и контентом</p>
          </motion.div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="admin-content-adm">
        <div className="admin-wrapper-adm">
          {/* Кнопка создания новой статьи */}
          <motion.div
            className="create-section-adm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {!isCreating ? (
              <button className="create-button-adm" onClick={() => setIsCreating(true)}>
                <BsPlus className="create-icon-adm" />
                Создать новую статью
              </button>
            ) : (
              <div className="create-form-adm">
                <div className="form-header-adm">
                  <div className="form-title-section-adm">
                    <BsPencilSquare className="form-title-icon-adm" />
                    <h2 className="form-title">Новая статья</h2>
                  </div>
                  <div className="form-actions-adm">
                    <button className="save-button-adm" onClick={handleCreateArticle}>
                      <BsCheck className="button-icon-adm" />
                      Сохранить
                    </button>
                    <button className="cancel-button-adm" onClick={() => setIsCreating(false)}>
                      <BsX className="button-icon-adm" />
                      Отмена
                    </button>
                  </div>
                </div>

                <div className="form-content-adm">
                  <div className="form-group-adm">
                    <label className="form-label-adm">Заголовок статьи</label>
                    <input
                      type="text"
                      className="form-input-adm"
                      placeholder="Введите заголовок статьи..."
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group-adm">
                    <label className="form-label-adm">Изображение статьи</label>
                    <div className="image-upload-container-adm">
                      {newArticle.image ? (
                        <div className="image-preview-container-adm">
                          <img
                            src={newArticle.image || "/placeholder.svg"}
                            alt="Предпросмотр"
                            className="image-preview-adm"
                          />
                          <div className="image-overlay-adm">
                            <Button
                              type="button"
                              className="remove-image-btn-adm"
                              onClick={() => setNewArticle({ ...newArticle, image: "" })}
                            >
                              <BsTrash />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="upload-placeholder-adm">
                          <BsImage className="upload-icon-adm" />
                          <p>Добавьте изображение к статье</p>
                        </div>
                      )}

                      <div className="upload-options-adm">
                        <label className="upload-btn-adm">
                          <BsCamera className="btn-icon-adm" />
                          Загрузить файл
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                          />
                        </label>

                        <div className="url-input-container-adm">
                          <input
                            type="url"
                            className="url-input-adm"
                            placeholder="или вставьте ссылку на изображение"
                            value={newArticle.image}
                            onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group-adm">
                    <label className="form-label-adm">Содержание статьи</label>
                    <textarea
                      className="form-textarea-adm"
                      placeholder="Напишите содержание статьи..."
                      rows={8}
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    />
                    <div className="character-count">{newArticle.content.length} символов</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Список статей */}
          <div className="articles-section-adm">
            <h2 className="section-title-adm">Все статьи ({articles.length})</h2>
            <div className="articles-grid-adm">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="article-card-adm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="article-image-wrapper-adm">
                    <img src={article.image || "/placeholder.svg"} alt={article.title} className="article-image-adm" />
                    <div className={`article-status-adm ${article.status}`}>
                      {article.status === "published" && "Опубликовано"}
                      {article.status === "draft" && "Черновик"}
                      {article.status === "pending" && "На проверке"}
                    </div>
                  </div>

                  <div className="article-content-adm">
                    <h3 className="article-title-adm">{article.title}</h3>
                    <p className="article-excerpt-adm">{article.content.substring(0, 100)}...</p>
                    <div className="article-meta-adm">
                      <span className="article-date-adm">{article.created_at.split("T")[0]}</span>
                    </div>
                  </div>

                  <div className="article-actions-adm">
                    <Button className="action-button edit-adm" onClick={() => handleOpenModal(article)}>
                      <BsPencil className="action-icon-adm" />
                    </Button>
                    <Button className="action-button view-adm" onClick={() => handleToggleStatus(article.id)}>
                      <BsEye className="action-icon-adm" />
                    </Button>
                    <Button className="action-button-adm delete" onClick={() => handleDeleteArticle(article.id)}>
                      <BsTrash className="action-icon-adm" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Блок сообщений поддержки */}
          <div className="support-section">
            <h2 className="section-title">Сообщения в поддержку ({supportMessages.length})</h2>

            {supportMessages.length === 0 ? (
              <div className="empty-support-state">
                <BsPencilSquare className="empty-support-icon" />
                <h3>Нет сообщений</h3>
                <p>Пока нет сообщений от пользователей</p>
              </div>
            ) : (
              <div className="support-messages-grid">
                {supportMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    className={`support-message-card ${msg.status}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="support-message-header">
                      <div className="support-message-info">
                        <h3 className="support-message-subject">{msg.subject}</h3>
                        <p className="support-message-from">
                          Уникальный номер пользователя: {msg.user_id || "Неизвестно"}
                        </p>
                      </div>
                      <div className={`support-message-status ${msg.status}`}>
                        {msg.status === "replied" ? "Отвечено" : "Ожидает ответа"}
                      </div>
                    </div>

                    <div className="support-message-content">
                      <p className="support-message-text">{msg.message}</p>
                      <div className="support-message-meta">
                        <span className="support-message-date">
                          {new Date(msg.created_at).toLocaleString("ru-RU")}
                        </span>
                      </div>
                    </div>

                    {msg.status !== "replied" && (
                      <div className="support-message-actions">
                        <button className="reply-button" onClick={() => setReplyingMessage(msg)}>
                          <BsPencilSquare className="reply-icon" />
                          Ответить
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}

              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && currentArticle && (
        <div className="modal-overlay-adm" onClick={() => setShowModal(false)}>
          <div className="modal-content-adm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-adm">
              <div className="modal-title-section-adm">
                <BsPencilSquare className="modal-icon-adm" />
                <h3>Редактировать статью</h3>
              </div>
              <Button className="close-btn-adm" onClick={() => setShowModal(false)}>
                <BsX size={24} />
              </Button>
            </div>

            <div className="modal-body-adm">
              <div className="form-group-adm">
                <label htmlFor="edit-title" className="form-label-adm">
                  Заголовок статьи
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className="form-input-adm"
                  placeholder="Введите заголовок статьи..."
                  value={currentArticle.title}
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group-adm">
                <label className="form-label-adm">Изображение статьи</label>
                <div className="image-upload-container-adm">
                  {currentArticle.image ? (
                    <div className="image-preview-container-adm">
                      <img
                        src={currentArticle.image || "/placeholder.svg"}
                        alt="Предпросмотр"
                        className="image-preview-adm"
                      />
                      <div className="image-overlay-adm">
                        <Button
                          type="button"
                          className="remove-image-btn-adm"
                          onClick={() =>
                            setCurrentArticle({
                              ...currentArticle,
                              image: "",
                            })
                          }
                        >
                          <BsTrash />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder-adm">
                      <BsImage className="upload-icon-adm" />
                      <p>Добавьте изображение к статье</p>
                    </div>
                  )}

                  <div className="upload-options-adm">
                    <label className="upload-btn-adm">
                      <BsCamera className="btn-icon-adm" />
                      Загрузить файл
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              setCurrentArticle({
                                ...currentArticle,
                                image: event.target?.result as string,
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>

                    <div className="url-input-container-adm">
                      <input
                        type="url"
                        className="url-input-adm"
                        placeholder="или вставьте ссылку на изображение"
                        value={currentArticle.image || ""}
                        onChange={(e) =>
                          setCurrentArticle({
                            ...currentArticle,
                            image: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group-adm">
                <label htmlFor="edit-content" className="form-label-adm">
                  Содержание статьи
                </label>
                <textarea
                  id="edit-content"
                  className="form-textarea-adm"
                  rows={8}
                  placeholder="Напишите содержание статьи..."
                  value={currentArticle.content}
                  onChange={(e) =>
                    setCurrentArticle({
                      ...currentArticle,
                      content: e.target.value,
                    })
                  }
                />
                <div className="character-count-adm">{currentArticle.content.length} символов</div>
              </div>
            </div>

            <div className="modal-footer-adm">
              <button className="btn-cancel-adm" onClick={() => setShowModal(false)}>
                <BsX className="btn-icon-adm" />
                Отмена
              </button>
              <button
                className="btn-save-adm"
                onClick={async () => {
                  await handleUpdateArticle()
                  setShowModal(false)
                }}
              >
                <BsCheck className="btn-icon-adm" />
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}

      {replyingMessage && (
        <div className="modal-overlay-mod" onClick={() => setReplyingMessage(null)}>
          <div className="modal-content-mod reply-modal-mod" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-mod">
              <div className="modal-title-section-mod">
                <BsPencilSquare className="modal-icon-mod" />
                <h3>Ответ на сообщение</h3>
              </div>
              <Button className="close-btn-mod" onClick={() => setReplyingMessage(null)}>
                <BsX size={24} />
              </Button>
            </div>

            <div className="modal-body-mod">
              <div className="original-message-mod">
                <h4>Исходное сообщение:</h4>
                <div className="original-message-content-mod">
                  <p>
                    <strong>Тема:</strong> {replyingMessage.subject}
                  </p>
                  <p>
                    <strong>ID пользователя:</strong> {replyingMessage.user_id}
                  </p>
                  <p>
                    <strong>Сообщение:</strong>
                  </p>
                  <div className="original-text-mod">{replyingMessage.message}</div>
                </div>
              </div>

              <div className="form-group-mod">
                <label className="form-label-mod">Ваш ответ</label>
                <textarea
                  className="form-textarea-mod"
                  rows={6}
                  placeholder="Введите ответ пользователю..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="character-count-mod">{replyContent.length} символов</div>
              </div>
            </div>

            <div className="modal-footer-mod">
              <button className="btn-cancel-mod" onClick={() => setReplyingMessage(null)}>
                <BsX className="btn-icon-mod" />
                Отмена
              </button>
              <button className="btn-save-mod" onClick={handleSendReply} disabled={!replyContent.trim()}>
                <BsCheck className="btn-icon-mod" />
                Отправить ответ
              </button>
            </div>
          </div>
        </div>
      )}

    </main>


  )
}
