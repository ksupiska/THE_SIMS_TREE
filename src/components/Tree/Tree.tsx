import React, { useState, useEffect, useRef } from "react";
import { supabase } from '../../SupabaseClient';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

//import { useNavigate } from 'react-router-dom';

import { Pencil, Save } from "lucide-react";
import { Button } from "react-bootstrap";
import { Node } from "./Node/Node";
// import Connectors from './Connectors';
import { styles } from './Tree.Styles';
import { NodeType, TreeProps, CharacterType, PartnerType, ServerNodeType } from './Tree.types';
import { useTreeDrag } from "./Tree.hooks";
import { calculateTreePositions, handleDeleteNode as deleteNode } from "../../utils/treeUtils";

import { CharacterModal } from "./Modals/CharacterModal";
import { PartnerModal } from "./Modals/PartnerModal";
import '../../css/treepage.css'
import { useNavigate } from "react-router-dom";

import Connectors from "./Connectors";


export const Tree: React.FC<TreeProps> = ({ treeId, treeName, initialNodes = [] }) => {
    const [nodes, setNodes] = useState<NodeType[]>(initialNodes.length ? initialNodes : [{
        id: uuidv4(),
        x: 0,
        y: 0,
        label: 'Начало',
        parent1_id: null,
        parent2_id: null,
        partner1_id: null,
        partner2_id: null,
        partnerType: undefined,
        characterId: null,
    }]);

    const [editMode, setEditMode] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { offset, scale, handlers } = useTreeDrag();

    // Текущий узел, для которого добавляем партнёра
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [characters, setCharacters] = useState<CharacterType[]>([]);
    const [selectedPartnerType, setSelectedPartnerType] = useState<PartnerType>('married');

    // Модалки
    const [showCharacterModal, setShowCharacterModal] = useState(false);
    const [showPartnerModal, setShowPartnerModal] = useState(false);

    const [rootId, setRootId] = useState<string | null>(null);
    useEffect(() => {
        if (nodes.length > 0 && !rootId) {
            const rootNode = getRootNode(nodes);
            if (rootNode) {
                setRootId(rootNode.id);
            }
        }
    }, [nodes, rootId]);


    const getRootNode = (nodes: NodeType[]): NodeType | undefined =>
        nodes.find(n => !n.parent1_id && !n.parent2_id);

    const handleAddPartner = async (
        targetNodeId: string,
        partnerCharacter: CharacterType,
        partner_type: PartnerType
    ) => {
        try {
            const newPartnerId = uuidv4();

            const partnerNode: NodeType = {
                id: newPartnerId,
                x: 0,
                y: 0,
                label: `${partnerCharacter.name} ${partnerCharacter.surname}`,
                character: partnerCharacter,
                characterId: partnerCharacter.id,
                parent1_id: null,
                parent2_id: null,
                partner1_id: targetNodeId, // Устанавливаем связь с основным узлом
                partner2_id: null,
                partnerType: partner_type,
            };

            const updatedNodes = nodes.map((node) => {
                if (node.id === targetNodeId) {
                    return {
                        ...node,
                        partner2_id: newPartnerId, // Устанавливаем связь с партнёром
                        partnerType: partner_type,
                    };
                }
                return node;
            }).concat(partnerNode);

            const rootNode = getRootNode(updatedNodes);
            if (!rootNode) {
                console.error("Корень дерева не найден");
                return;
            }

            const { nodes: positionedNodes } = calculateTreePositions(updatedNodes, rootNode.id, 0, 0);
            setNodes(positionedNodes);

            console.log('Партнёр успешно добавлен');
        } catch (error) {
            console.error('Ошибка при добавлении партнёра:', error);
        }
    };

    const handleAddChildNode = (parentId: string, childCharacter?: CharacterType) => {
        const parentNode = nodes.find(n => n.id === parentId);
        if (!parentNode) return;

        // Ищем партнёра через оба поля partner1_id и partner2_id
        const partnerId = parentNode.partner1_id || parentNode.partner2_id;
        const partnerNode = partnerId ? nodes.find(n => n.id === partnerId) : null;

        const newChildNode: NodeType = {
            id: uuidv4(),
            x: 0,
            y: 0,
            label: childCharacter
                ? `${childCharacter.name} ${childCharacter.surname}`
                : "Новый ребенок",
            character: childCharacter,
            characterId: childCharacter?.id || null, // Исправлено: явно указываем null
            parent1_id: parentNode.id,
            parent2_id: partnerNode?.id || null,
            partner1_id: null,
            partner2_id: null,
            partnerType: undefined,
        };

        const updatedNodes = [...nodes, newChildNode];
        const rootNode = getRootNode(updatedNodes);
        if (!rootNode) return;

        const { nodes: positionedNodes } = calculateTreePositions(updatedNodes, rootNode.id, 0, 0);
        setNodes(positionedNodes);
    };




    const handleDeleteNode = (id: string) => {
        setNodes(prevNodes => {
            const filteredNodes = deleteNode(prevNodes, id);
            const rootNode = filteredNodes.find(n => !n.parent1_id && !n.parent2_id);
            if (!rootNode) return filteredNodes;

            const { nodes: repositionedNodes } = calculateTreePositions(filteredNodes, rootNode.id, 0, 0);
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
                    ? {
                        ...node,
                        character,
                        characterId: character.id,
                        label: `${character.name} ${character.surname}`
                    }
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
            const nodesToSave = nodes.map(node => ({
                id: node.id,
                label: node.label,
                x: node.x,
                y: node.y,
                character_id: node.characterId || null,
                parent1_id: node.parent1_id || null,
                parent2_id: node.parent2_id || null,
                partner1_id: node.partner1_id || null,
                partner2_id: node.partner2_id || null,
                partner_type: node.partnerType === undefined ? null : node.partnerType,
            }));
            console.log("Отправляем на сервер:", nodesToSave);


            const response = await fetch("http://localhost:5000/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    treeId,
                    nodes: nodesToSave,
                }),
            });

            if (!response.ok) throw new Error("Ошибка сохранения");
            console.log("Дерево сохранено");
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
                    const transformedNodes = data.nodes.map((node: ServerNodeType) => ({
                        id: node.id,
                        label: node.label,
                        x: node.x,
                        y: node.y,
                        character: node.character,
                        characterId: node.characterId,
                        parent1_id: node.parent1_id,
                        parent2_id: node.parent2_id,
                        partner1_id: node.partner1_id,
                        partner2_id: node.partner2_id,
                        partnerType: node.partnerType,
                    }));

                    console.log("Получены и преобразованы узлы:", transformedNodes);
                    setNodes(transformedNodes);
                } else {
                    console.log("Дерево пустое, создаём стартовый узел");
                    setNodes([{
                        id: uuidv4(),
                        x: 0,
                        y: 0,
                        label: "Начните здесь",
                        parent1_id: null,
                        parent2_id: null,
                        partner1_id: null,
                        partner2_id: null,
                        characterId: null,
                    }]);
                }
            } catch (error) {
                console.error("Ошибка загрузки:", error);
                setNodes([{
                    id: uuidv4(),
                    x: 0,
                    y: 0,
                    label: "Ошибка загрузки",
                    parent1_id: null,
                    parent2_id: null,
                    partner1_id: null,
                    partner2_id: null,
                    characterId: null,
                }]);
            }
        };

        if (treeId) {
            loadTree();
        } else {
            console.error("treeId не определен!");
        }
    }, [treeId]);

    const navigate = useNavigate();
    const handleCreateNewCharacter = () => {
        navigate("/simcreateform"); // Переход на страницу создания персонажа
    };

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