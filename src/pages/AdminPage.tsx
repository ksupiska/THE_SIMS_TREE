import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BsDiamond, BsPlus, BsTrash, BsEye, BsPencil, BsCheck, BsX } from "react-icons/bs"
import { Button } from "react-bootstrap";

import { supabase } from "../SupabaseClient";
import '../css/admin.css';

interface Article {
  id: string
  title: string
  content: string
  image: string | null
  status: "draft" | "published" | "pending"
  created_at: string // поля из Supabase обычно snake_case
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    image: "",
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
      const { data: articlesData, error } = await supabase
        .from<Article>("articles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Ошибка загрузки статей:", error)
      } else {
        setArticles(articlesData || [])
      }

      setIsLoading(false)
    }

    fetchProfileAndArticles()
  }, [])

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

  return (
    <main className="admin-container">
      {/* Заголовок админки */}
      <div className="admin-header">
        <div className="admin-header-overlay" />
        <div className="admin-header-content">
          <motion.div
            className="admin-title-section"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="admin-title-wrapper">
              <BsDiamond className="admin-diamond left" />
              <h1 className="admin-main-title">Панель администратора</h1>
              <BsDiamond className="admin-diamond right" />
            </div>
            <p className="admin-subtitle">Управление статьями и контентом</p>
          </motion.div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="admin-content">
        <div className="admin-wrapper">
          {/* Кнопка создания новой статьи */}
          <motion.div
            className="create-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {!isCreating ? (
              <button className="create-button" onClick={() => setIsCreating(true)}>
                <BsPlus className="create-icon" />
                Создать новую статью
              </button>
            ) : (
              <div className="create-form">
                <div className="form-header">
                  <h2 className="form-title">Новая статья</h2>
                  <div className="form-actions">
                    <button className="save-button" onClick={handleCreateArticle}>
                      <BsCheck className="button-icon" />
                      Сохранить
                    </button>
                    <button className="cancel-button" onClick={() => setIsCreating(false)}>
                      <BsX className="button-icon" />
                      Отмена
                    </button>
                  </div>
                </div>

                <div className="form-content">
                  <div className="form-group">
                    <label className="form-label">Заголовок статьи</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Введите заголовок..."
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Изображение (URL)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                      value={newArticle.image}
                      onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Содержание статьи</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Напишите содержание статьи..."
                      rows={8}
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Список статей */}
          <div className="articles-section">
            <h2 className="section-title">Все статьи ({articles.length})</h2>
            <div className="articles-grid">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="article-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="article-image-wrapper">
                    <img src={article.image || "/placeholder.svg"} alt={article.title} className="article-image" />
                    <div className={`article-status ${article.status}`}>
                      {article.status === "published" && "Опубликовано"}
                      {article.status === "draft" && "Черновик"}
                      {article.status === "pending" && "На проверке"}
                    </div>
                  </div>

                  <div className="article-content">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.content.substring(0, 100)}...</p>
                    <div className="article-meta">
                      <span className="article-date">{article.created_at.split("T")[0]}</span>
                    </div>
                  </div>

                  <div className="article-actions">
                    <Button
                      className="action-button edit"
                      onClick={() => setEditingId(editingId === article.id ? null : article.id)}
                    >
                      <BsPencil className="action-icon" />
                    </Button>
                    <Button className="action-button view" onClick={() => handleToggleStatus(article.id)}>
                      <BsEye className="action-icon" />
                    </Button>
                    <Button className="action-button delete" onClick={() => handleDeleteArticle(article.id)}>
                      <BsTrash className="action-icon" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="admin-decoration admin-decoration-left">
        <BsDiamond className="admin-decoration-diamond purple" />
      </div>
      <div className="admin-decoration admin-decoration-right">
        <BsDiamond className="admin-decoration-diamond green" />
      </div>
    </main>
  )
}
