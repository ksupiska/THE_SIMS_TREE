import React, { useState, useEffect, useRef } from "react";
import { supabase } from '../../SupabaseClient';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { Pencil } from "lucide-react";
import { Button } from "react-bootstrap";
import { Node } from "./Node/Node";
import Connectors from './Connectors';
import { styles } from "./Tree.Styles";
import { NodeType, TreeProps, CharacterType } from "./Tree.types";
import { useTreeDrag } from "./Tree.hooks";
import { calculateTreePositions, handleDeleteNode as deleteNode } from "../../utils/treeUtils";

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

    const [characters, setCharacters] = useState<Character[]>([]);
    //const renderedNodeIds = new Set<number>();

    const navigate = useNavigate();

    useEffect(() => {
        const canvas = containerRef.current;
        if (canvas) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            setOffset({ x: centerX, y: centerY });
        }
    }, []);

    //добавление партнера
    const handleAddPartner = (targetNodeId: number) => {
        const partnerNode: NodeType = {
            id: Date.now(),
            parentId: undefined, // партнёр — не ребёнок
            x: 0,
            y: 0,
            label: "",
            partnerId: targetNodeId,
        };

        const updatedNodes = [
            ...nodes.map(n =>
                n.id === targetNodeId ? { ...n, partnerId: partnerNode.id } : n
            ),
            partnerNode
        ];

        const { nodes: positionedNodes } = calculateTreePositions(updatedNodes, 1, 0, 0);
        setNodes(positionedNodes);
    };

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
        setNodes(prevNodes => deleteNode(prevNodes, id));
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
                            onAddPartner={handleAddPartner}
                            onDeleteNode={handleDeleteNode}
                        />
                    ))}
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Connectors nodes={nodes} />
                        {/* Остальной код */}
                    </div>
                </div>
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Выберите персонажа</h3>

                        {/* Список существующих персонажей */}
                        {characters.map(character => (
                            <div
                                key={character.id}
                                style={styles.characterItem}
                                onClick={() => handleSelectCharacter(character)}
                            >
                                <img
                                    src={character.avatar}
                                    alt={`${character.name} ${character.surname}`}
                                    style={styles.characterAvatar}
                                />
                                <span>{character.name} {character.surname}</span>
                            </div>
                        ))}

                        <Button
                            onClick={() => handleCreateNewCharacter()}
                            style={{ marginTop: "10px" }}
                        >
                            Добавить нового
                        </Button>
                        <Button onClick={() => setShowModal(false)} style={{ marginTop: "5px" }}>
                            Отмена
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};