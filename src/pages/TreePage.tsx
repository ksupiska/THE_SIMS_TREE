"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Tree } from "../components/Tree/Tree"
import { supabase } from "../SupabaseClient"

import "../css/treepage.css"

interface TreeItem {
  id: string
  name: string
}

const TreePage: React.FC = () => {
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [allTrees, setAllTrees] = useState<TreeItem[]>([])
  const [dynastyName, setDynastyName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [treeId, setTreeId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Загружаем дерево при первом заходе
  useEffect(() => {
    const fetchTree = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        alert("Вы не авторизованы")
        return
      }

      const { data, error } = await supabase.from("trees").select("*").eq("user_id", user.id).limit(1)

      if (error) {
        console.error("Ошибка при получении древа:", error.message)
        return
      }

      if (data && data.length > 0) {
        setAllTrees(data)
        setTreeId(data[0].id)
      } else {
        setIsModalOpen(true)
      }
    }

    fetchTree()
  }, [])

  const handleSaveDynasty = async () => {
    if (!dynastyName.trim()) return
    setIsLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert("Ошибка авторизации")
      setIsLoading(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from("trees")
      .insert([{ name: dynastyName, user_id: user.id }])
      .select()
      .single()

    if (insertError || !data) {
      console.error("Ошибка при создании древа:", insertError?.message)
      alert("Не удалось создать древо.")
    } else {
      setAllTrees((prev) => [...prev, data])
      setTreeId(data.id)
      setIsModalOpen(false)
    }

    setIsLoading(false)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="tree-container">
      {/* Кнопка-гамбургер для мобильных устройств */}
      <button className="mobile-menu-toggle" onClick={toggleSidebar} aria-label="Открыть меню">
        <span className={`hamburger-line ${isSidebarOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isSidebarOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isSidebarOpen ? "open" : ""}`}></span>
      </button>

      {/* Overlay для закрытия sidebar при клике вне его */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Введите название династии</h2>
            <input
              type="text"
              value={dynastyName}
              onChange={(e) => setDynastyName(e.target.value)}
              placeholder="Название династии"
            />
            <div className="modal-buttons">
              <button onClick={handleSaveDynasty} disabled={isLoading || !dynastyName.trim()}>
                {isLoading ? "Сохраняем..." : "Сохранить"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className="tree-wrapper">
        {treeId && <Tree treeId={treeId} treeName={allTrees.find((t) => t.id === treeId)?.name ?? ""} />}
      </div>

      <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {/* Кнопка закрытия внутри sidebar */}
        <button className="sidebar-close" onClick={closeSidebar}>
          ✕
        </button>

        <h3>Династия</h3>
        <select
          value={treeId ?? ""}
          onChange={(e) => {
            setTreeId(e.target.value)
            closeSidebar() // Закрываем sidebar после выбора
          }}
        >
          {allTrees.map((tree) => (
            <option key={tree.id} value={tree.id}>
              {tree.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setIsModalOpen(true)
            closeSidebar()
          }}
        >
          Новая династия
        </button>

        <button
          onClick={() => {
            navigate("/simcreateform")
            closeSidebar()
          }}
        >
          Создать персонажа
        </button>

        <button
          onClick={() => {
            navigate("/list")
            closeSidebar()
          }}
        >
          Список персонажей
        </button>

        <button
          onClick={() => {
            navigate("/profile")
            closeSidebar()
          }}
        >
          Редактировать древо
        </button>

        <button
          onClick={() => {
            navigate("/auth")
            closeSidebar()
          }}
        >
          Инструкция
        </button>
      </div>
    </div>
  )
}

export default TreePage
