import React from "react";
import Tree from "./Tree"; // путь к твоему компоненту дерева
import { useNavigate } from "react-router-dom";

import '../css/treepage.css';

const TreePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="tree-container">
      <div className="tree-wrapper">
        <Tree />
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
