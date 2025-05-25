import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tree } from "../components/Tree/Tree";
import { supabase } from "../SupabaseClient";

import "../css/treepage.css";

const TreePage: React.FC = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dynastyName, setDynastyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [treeId, setTreeId] = useState<string | null>(null);

  // Загружаем дерево при первом заходе
  useEffect(() => {
    const fetchTree = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Вы не авторизованы");
        return;
      }

      const { data, error } = await supabase
        .from("trees")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      if (error) {
        console.error("Ошибка при получении древа:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setTreeId(data[0].id);
      } else {
        setIsModalOpen(true); // нет древа — открываем модалку
      }
    };

    fetchTree();
  }, []);

  const handleSaveDynasty = async () => {
    if (!dynastyName.trim()) return;
    setIsLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Ошибка авторизации. Пожалуйста, войдите.");
      setIsLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("trees")
      .insert([
        {
          name: dynastyName,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (insertError || !data) {
      console.error("Ошибка при сохранении древа:", insertError?.message);
      alert("Не удалось сохранить древо.");
    } else {
      setTreeId(data.id);
      setIsModalOpen(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="tree-container">
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
            <button
              onClick={handleSaveDynasty}
              disabled={isLoading || !dynastyName.trim()}
            >
              {isLoading ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      <div className="tree-wrapper">
        {treeId && <Tree treeId={treeId} />}
      </div>

      <div className="sidebar">
        <button onClick={() => navigate("/simcreateform")}>Создать</button>
        <button onClick={() => navigate("/list")}>Список</button>
        <button onClick={() => navigate("/profile")}>Редактировать</button>
        <button onClick={() => navigate("/auth")}>Инструкция</button>
      </div>
    </div>
  );
};

export default TreePage;
