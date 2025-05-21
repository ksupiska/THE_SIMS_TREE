import React, { useState, useEffect, useRef, JSX } from "react";
import { supabase } from '../../SupabaseClient';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { Pencil } from "lucide-react";
import { Button } from "react-bootstrap";
import { Node } from "./Node/Node";
import Connectors from './Connectors';
import { styles } from './Tree.Styles';
import { NodeType, TreeProps, CharacterType, PartnerType } from "./Tree.types";
import { useTreeDrag } from "./Tree.hooks";
import { calculateTreePositions, handleDeleteNode as deleteNode } from "../../utils/treeUtils";


import { TbCirclesRelation } from "react-icons/tb"; //married женаты
import { LiaRingSolid } from "react-icons/lia";//divorced в разводе
import { GiBigDiamondRing } from "react-icons/gi"; //engaged помолвлены
import { BsChatHeart } from "react-icons/bs";//flirting флирт
import { FaHeartBroken } from "react-icons/fa";//former бывшие
import { FaHeart } from "react-icons/fa";//partner партнер
import { GiHeartWings } from "react-icons/gi"; //widow вдовцы
import { FaUserFriends } from "react-icons/fa"; //friends друзья


const partnerTypes: Array<{
    type: PartnerType;
    label: string;
    icon: JSX.Element;
}> = [
        { type: "married", label: "Супруги", icon: <TbCirclesRelation /> },
        { type: "divorced", label: "В разводе", icon: <LiaRingSolid /> },
        { type: "engaged", label: "Помолвлены", icon: <GiBigDiamondRing /> },
        { type: "flirting", label: "Флирт", icon: <BsChatHeart /> },
        { type: "former", label: "Бывшие", icon: <FaHeartBroken /> },
        { type: "partner", label: "Партнер", icon: <FaHeart /> },
        { type: "widow", label: "Вдовец/Вдова", icon: <GiHeartWings /> },
        { type: "friends", label: "Друзья", icon: <FaUserFriends /> },
    ];

interface Character {
    id: string;
    name: string;
    surname: string;
    gender: string;
    avatar?: string;
    city: string;
    kind: string;
    state: string;
    type: string;
    biography: string;
    death: string;
}

export const Tree: React.FC<TreeProps> = ({ initialNodes = [{ id: 1, x: 0, y: 0, label: "" }] }) => {
    const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { offset, scale, setOffset, handlers } = useTreeDrag();

    // Состояние для показа модалки
    const [showPartnerModal, setShowPartnerModal] = useState(false);

    // Текущий узел, для которого добавляем партнёра
    const [currentNodeId, setCurrentNodeId] = useState<number | null>(null);

    const [characters, setCharacters] = useState<Character[]>([]);

    const [selectedPartnerType, setSelectedPartnerType] = useState<PartnerType>('married');

    // Открыть модалку и задать текущего персонажа
    const openPartnerModal = (nodeId: number) => {
        setCurrentNodeId(nodeId);
        setShowPartnerModal(true);
    };

    // Обработчик выбора персонажа из модалки
    const handleAddPartner = (
        targetNodeId: number,
        partnerCharacter: CharacterType,
        partnerType: PartnerType
    ) => {
        const partnerNode: NodeType = {
            id: Date.now(),
            parentId: undefined,
            x: 0,
            y: 0,
            label: `${partnerCharacter.name} ${partnerCharacter.surname}`,
            partnerId: targetNodeId,
            character: partnerCharacter,
            partnerType, // сохраняем тип связи
        };

        const updatedNodes = nodes.map(n =>
            n.id === targetNodeId ? { ...n, partnerId: partnerNode.id, partnerType } : n
        ).concat(partnerNode);

        const { nodes: positionedNodes } = calculateTreePositions(updatedNodes, 1, 0, 0);
        setNodes(positionedNodes);
    };

    const handleSelectPartner = (partnerCharacter: CharacterType) => {
        if (currentNodeId === null) return;

        handleAddPartner(currentNodeId, partnerCharacter, selectedPartnerType);

        setShowPartnerModal(false);
        setCurrentNodeId(null);
    };

    const navigate = useNavigate();

    useEffect(() => {
        const canvas = containerRef.current;
        if (canvas) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            setOffset({ x: centerX, y: centerY });
        }
    }, []);

    //добавление ребенка
    const handleAddChildNode = (parentId: number) => {
        const parentNode = nodes.find(n => n.id === parentId);
        if (!parentNode) return;

        const partner = parentNode.partnerId
            ? nodes.find(n => n.id === parentNode.partnerId)
            : null;

        // Всегда используем одного родителя, но учитываем пару в логике позиционирования
        const effectiveParentId = partner
            ? Math.min(parentId, partner.id) // Всегда выбираем "меньший" id, чтобы было стабильно
            : parentId;

        const newNode: NodeType = {
            id: Date.now(),
            parentId: effectiveParentId,
            x: 0,
            y: 0,
            label: "",
        };

        const newNodes = [...nodes, newNode];
        const { nodes: updatedNodes } = calculateTreePositions(newNodes, 1, 0, 0);
        setNodes(updatedNodes);
    };


    const handleDeleteNode = (id: number) => {
        setNodes(prevNodes => {
            const filteredNodes = deleteNode(prevNodes, id); // Удаляем узел
            const { nodes: repositionedNodes } = calculateTreePositions(filteredNodes, 1, 0, 0); // Пересчитываем позиции
            return repositionedNodes;
        });
    };


    const handleNodeClick = (nodeId: number) => {
        if (!editMode) return;
        setSelectedNodeId(nodeId);
        setShowModal(true);
    };

    const handleSelectCharacter = (character: CharacterType) => {
        setNodes(prev =>
            prev.map(node =>
                node.id === selectedNodeId
                    ? { ...node, character }
                    : node
            )
        );
        setShowModal(false);
    };

    const handleCreateNewCharacter = () => {
        navigate('/simcreateform');
    };
    useEffect(() => {
        const fetchCharacters = async () => {
            const { data, error } = await supabase.auth.getUser(); // Получаем текущего пользователя

            if (error || !data.user) {
                console.error('Пользователь не авторизован');
                return;
            }

            const userId = data.user.id; // Получаем user_id текущего пользователя

            try {
                // Логирование запроса
                console.log("Запрос к серверу с userId:", userId);
                const response = await axios.get(`http://localhost:5000/api/characters?userId=${userId}`);
                console.log("Ответ от сервера:", response.data); // Логируем ответ от сервера

                // Проверка структуры данных
                if (Array.isArray(response.data)) {
                    setCharacters(response.data);
                } else {
                    console.error("Данные не являются массивом:", response.data);
                }
            } catch (error) {
                console.error('Ошибка при получении персонажей:', error);
            }
        };

        fetchCharacters();
    }, []);
    return (
        <>
            <Button
                onClick={() => setEditMode(!editMode)}
                style={{
                    position: "relative",
                    zIndex: 10,
                    backgroundColor: editMode ? "#219600" : "#9e9e9e",
                    padding: "7px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                }}
            >
                <Pencil size={18} />
            </Button>

            <div style={styles.canvas} {...handlers}>
                <div
                    ref={containerRef}
                    style={{
                        ...styles.inner,
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    }}
                >
                    {nodes.map((node) => (
                        <Node
                            key={node.id}
                            node={node}
                            editMode={editMode}
                            onNodeClick={handleNodeClick}
                            onAddChild={handleAddChildNode}
                            onAddPartner={() => openPartnerModal(node.id)}
                            onDeleteNode={handleDeleteNode}
                        />
                    ))}
                    <Connectors nodes={nodes} />
                </div>
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>

                        <h3 style={{ textAlign: "center", marginBottom: "16px" }}>Выберите персонажа</h3>

                        {/* Сетка персонажей */}
                        <div style={styles.characterGrid}>
                            {characters.map(character => (
                                <div
                                    key={character.id}
                                    style={styles.characterItem}
                                    onClick={() => handleSelectCharacter(character)}
                                    onMouseEnter={e =>
                                        (e.currentTarget.style.borderColor = "#2196f3")
                                    }
                                    onMouseLeave={e =>
                                        (e.currentTarget.style.borderColor = "transparent")
                                    }
                                >
                                    <img
                                        src={character.avatar}
                                        alt={`${character.name} ${character.surname}`}
                                        style={styles.characterAvatar}
                                    />
                                    <span style={{ fontSize: "14px", textAlign: "center" }}>
                                        {character.name} {character.surname}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
                            <Button onClick={handleCreateNewCharacter}>Добавить нового</Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Отмена</Button>
                        </div>
                    </div>
                </div>

            )}

            {showPartnerModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={{ textAlign: "center", marginBottom: "16px" }}>Выберите тип связи</h3>

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "10px",
                            marginBottom: "16px",
                            flexWrap: "wrap"
                        }}>
                            {partnerTypes.map(({ type, label, icon }) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedPartnerType(type)}
                                    style={{
                                        padding: "10px 16px",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        border: selectedPartnerType === type ? "2px solid rgb(59, 161, 0)" : "1px solid #ccc",
                                        backgroundColor: selectedPartnerType === type ? "rgba(59, 161, 0, 0.1)" : "#f9f9f9",
                                        color: "#333",
                                        fontSize: "15px",
                                        fontWeight: 500,
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                        transition: "all 0.2s ease-in-out",
                                        cursor: "pointer",
                                        minWidth: "140px",
                                        justifyContent: "center",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(59, 161, 0, 0.15)")}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = selectedPartnerType === type ? "rgba(59, 161, 0, 0.1)" : "#f9f9f9")}

                                >
                                    {icon} {label}
                                </button>
                            ))}
                        </div>

                        <h3 style={{ textAlign: "center", marginBottom: "16px" }}>Выберите партнёра</h3>
                        <div style={styles.characterGrid}>
                            {characters.map(character => (
                                <div
                                    key={character.id}
                                    style={styles.characterItem}
                                    onClick={() => handleSelectPartner(character)}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgb(59, 161, 0)")}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
                                >
                                    <img
                                        src={character.avatar}
                                        alt={`${character.name} ${character.surname}`}
                                        style={styles.characterAvatar}
                                    />
                                    <span style={{ fontSize: "14px", textAlign: "center" }}>
                                        {character.name} {character.surname}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
                            <Button onClick={handleCreateNewCharacter}>Добавить нового</Button>
                            <Button variant="secondary" onClick={() => setShowPartnerModal(false)}>Отмена</Button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};