"use client"

import React, { useEffect, useState } from "react"
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
  const [dynastyName, setDynastyName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tree, setTree] = useState<TreeItem | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

      const { data, error } = await supabase.from("trees").select("*").eq("user_id", user.id).limit(1).single()

      if (error && error.code !== "PGRST116") {
        console.error("Ошибка при получении древа:", error.message)
        return
      }

      if (data) {
        setTree(data)
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
      setTree(data)
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
      <button className="mobile-menu-toggle" onClick={toggleSidebar} aria-label="Открыть меню">
        <span className={`hamburger-line ${isSidebarOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isSidebarOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isSidebarOpen ? "open" : ""}`}></span>
      </button>

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
            </div>
          </div>
        </div>
      )}

      <div className="tree-wrapper">{tree && <Tree treeId={tree.id} treeName={tree.name} />}</div>

      <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>

        <h3>Панель навигации</h3>
        <button
          onClick={() => {
            navigate("/simcreateform", { state: { treeId: tree?.id } })
            closeSidebar()
          }}
          disabled={!tree}
        >
          Создать персонажа
        </button>

        <button
          onClick={() => {
            navigate("/list")
            closeSidebar()
          }}
          disabled={!tree}
        >
          Список персонажей
        </button>

        <button
          onClick={() => {
            navigate("/instruction")
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
