import React, { useState, useEffect, useRef } from "react";
import { supabase } from '../../SupabaseClient';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { useNavigate } from 'react-router-dom';

import { Pencil, Save } from "lucide-react";
import { Button } from "react-bootstrap";
import { Node } from "./Node/Node";
import Connectors from './Connectors';
import { styles } from './Tree.Styles';
import { NodeType, TreeProps, CharacterType, PartnerType } from "./Tree.types";
import { useTreeDrag } from "./Tree.hooks";
import { calculateTreePositions, handleDeleteNode as deleteNode } from "../../utils/treeUtils";

import { CharacterModal } from "./Modals/CharacterModal";
import { PartnerModal } from "./Modals/PartnerModal";
import '../../css/treepage.css'


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

export const Tree: React.FC<TreeProps> = ({ treeId, treeName, initialNodes = [{ id: '1', x: 0, y: 0, label: "" }] }) => {
    const [nodes, setNodes] = useState<NodeType[]>(initialNodes);

    const [editMode, setEditMode] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { offset, scale, setOffset, handlers } = useTreeDrag();

    // Текущий узел, для которого добавляем партнёра
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedPartnerType, setSelectedPartnerType] = useState<PartnerType>('married');

    // Модалки
    const [showCharacterModal, setShowCharacterModal] = useState(false);
    const [showPartnerModal, setShowPartnerModal] = useState(false);


    const handleAddPartner = async (
        targetNodeId: string,
        partnerCharacter: CharacterType,
        partnerType: PartnerType
    ) => {
        try {
            const newId = uuidv4();

            const partnerNode: NodeType = {
                id: newId,
                x: 0,
                y: 0,
                label: `${partnerCharacter.name} ${partnerCharacter.surname}`,
                character: partnerCharacter,
                characterId: partnerCharacter.id,
                partnerId: targetNodeId,       // ← указывает на target
                partnerType,
            };

            const updatedNodes = nodes.map(node => {
                if (node.id === targetNodeId) {
                    return { ...node, partnerId: newId, partnerType };
                }
                return node;
            }).concat(partnerNode); // ← добавляем нового партнёра

            const rootNode = updatedNodes[0]; // если ты знаешь, что корень — первый
            const rootId = rootNode.id;

            const { nodes: positionedNodes } = calculateTreePositions(updatedNodes, rootId, 0, 0);
            setNodes(positionedNodes);

            await handleSaveTree();

            console.log('Партнёр успешно добавлен', {
                targetNodeId,
                partnerNodeId: newId,
            });
            console.log("После добавления партнёра, узлы:", updatedNodes);

        } catch (error) {
            console.error('Ошибка при добавлении партнёра:', error);
        }
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
    const handleAddChildNode = (parentId: string) => { // changed to string
        const parentNode = nodes.find(n => n.id === parentId);
        if (!parentNode) return;

        const partner = parentNode.partnerId
            ? nodes.find(n => n.id === parentNode.partnerId)
            : null;

        const effectiveParentId = partner
            ? [parentId, partner.id].sort()[0] // Sort string IDs to get consistent parent
            : parentId;

        const newNode: NodeType = {
            id: uuidv4(), // changed to UUID
            parentId: effectiveParentId,
            x: 0,
            y: 0,
            label: "",
        };

        const newNodes = [...nodes, newNode];
        const { nodes: updatedNodes } = calculateTreePositions(newNodes, '1', 0, 0);
        setNodes(updatedNodes);
    };
    const handleDeleteNode = (id: string) => {
        setNodes(prevNodes => {
            const filteredNodes = deleteNode(prevNodes, id); // Удаляем узел
            const { nodes: repositionedNodes } = calculateTreePositions(filteredNodes, '1', 0, 0); // Пересчитываем позиции
            return repositionedNodes;
        });
    };
    const handleNodeClick = (nodeId: string) => {
        if (!editMode) return;
        setSelectedNodeId(nodeId);
        setShowCharacterModal(true);
    };

    const handleSelectCharacter = (character: CharacterType) => {
        setNodes(prev =>
            prev.map(node =>
                node.id === selectedNodeId
                    ? { ...node, character }
                    : node
            )
        );
        setShowCharacterModal(false);
    };
    const openPartnerModal = (nodeId: string) => {
        setCurrentNodeId(nodeId);
        setShowPartnerModal(true);
    };

    const handleSelectPartner = (partnerCharacter: CharacterType) => {
        if (currentNodeId === null) return;
        handleAddPartner(currentNodeId, partnerCharacter, selectedPartnerType);
        setShowPartnerModal(false);
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

    //сохранение древа
    const handleSaveTree = async () => {
        try {

            const nodesToSave = nodes.map(node => {
                // Получаем id персонажа партнёра, если есть
                const partnerCharacterId = node.partnerId
                    ? nodes.find(n => n.id === node.partnerId)?.character?.id || null
                    : null;

                return {
                    id: node.id,
                    x: node.x,
                    y: node.y,
                    label: node.label || "",
                    parentId: node.parentId || null,
                    character_id: node.character?.id || null,
                    partnerId: partnerCharacterId,  // Вот тут id персонажа, а не узла
                    partnerType: node.partnerType || null,
                };
            });

            const response = await fetch("http://localhost:5000/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    treeId,
                    nodes: nodesToSave,
                }),
            });
            localStorage.setItem('treeId', treeId);
            console.log("Отправляем узлы:", nodesToSave);


            const result = await response.json();
            if (!response.ok) throw result;

            console.log("Дерево сохранено:", result);
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        }
    };

    useEffect(() => {
        const loadTree = async () => {
            try {
                console.log("Начинаем загрузку дерева для treeId:", treeId);

                const response = await fetch(`http://localhost:5000/api/tree?treeId=${treeId}`);
                const data = await response.json();

                console.log("Ответ сервера:", data);

                if (response.ok && data?.nodes?.length > 0) {
                    console.log("Получены узлы:", data.nodes);
                    setNodes(data.nodes); // Используем данные с сервера напрямую
                } else {
                    console.log("Дерево пустое, создаём стартовый узел");
                    setNodes([{
                        id: uuidv4(),
                        x: 0,
                        y: 0,
                        label: "Начните здесь",
                        parentId: undefined,
                        partnerId: undefined,
                        partnerType: undefined,
                        characterId: undefined,
                    }]);
                }
            } catch (error) {
                console.error("Ошибка загрузки:", error);
                setNodes([{
                    id: uuidv4(),
                    x: 0,
                    y: 0,
                    label: "Ошибка загрузки",
                    parentId: undefined,
                    partnerId: undefined,
                    partnerType: undefined,
                    characterId: undefined,
                }]);
            }
        };

        if (treeId) {
            loadTree();
        } else {
            console.error("treeId не определен!");
        }
    }, [treeId]);


    return (
        <>
            <h2 style={{ textAlign: "center", marginBottom: "1rem", color: 'black' }}>{treeName}</h2>
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
            <Button
                onClick={handleSaveTree}
                style={{
                    position: "relative",
                    zIndex: 10,
                    backgroundColor: "#007bff",
                    padding: "7px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                }}
            >
                <Save size={18} />
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
            <CharacterModal
                show={showCharacterModal}
                characters={characters}
                onSelectCharacter={handleSelectCharacter}
                onCreateNewCharacter={handleCreateNewCharacter}
                onClose={() => setShowCharacterModal(false)}
            />
            <PartnerModal
                show={showPartnerModal}
                characters={characters}
                selectedPartnerType={selectedPartnerType}
                onSelectPartner={handleSelectPartner}
                onCreateNewCharacter={handleCreateNewCharacter}
                onClose={() => setShowPartnerModal(false)}
                onSelectPartnerType={setSelectedPartnerType}
            />
        </>);
};