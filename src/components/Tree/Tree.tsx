import React, { useState, useEffect, useRef } from "react";
import { supabase } from '../../SupabaseClient';
import { v4 as uuidv4 } from 'uuid';

import { Pencil, Save } from "lucide-react";
import { Button } from "react-bootstrap";
import { Node } from "./Node/Node";

import { styles } from './Tree.Styles';
import { NodeType, TreeProps, CharacterType, PartnerType } from './Tree.types';
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

    useEffect(() => {
        console.log('Nodes data:', nodes);
        console.log("treeId:", treeId);
    }, [nodes, treeId]);

    const navigate = useNavigate();
    const handleCreateNewCharacter = () => {
        navigate("/simcreateform", { state: { treeId } });
    };

    const [editMode, setEditMode] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { offset, scale, handlers } = useTreeDrag();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [characters, setCharacters] = useState<CharacterType[]>([]);
    const [selectedPartnerType, setSelectedPartnerType] = useState<PartnerType>('married');

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

    const handleDeleteNode = (id: string) => {
        setNodes(prevNodes => {
            const filteredNodes = deleteNode(prevNodes, id);
            const rootNode = filteredNodes.find(n => !n.parent1_id && !n.parent2_id);
            if (!rootNode) return filteredNodes;

            const { nodes: repositionedNodes } = calculateTreePositions(filteredNodes, rootNode.id, 0, 0);
            console.log("Filtered nodes:", filteredNodes);
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
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError || !userData.user) {
                console.error('Пользователь не авторизован');
                return;
            }

            const userId = userData.user.id;

            try {
                console.log("Запрос персонажей с userId:", userId);

                const { data: charactersData, error: charactersError } = await supabase
                    .from("characters")
                    .select("*")
                    .eq("user_id", userId);

                if (charactersError) {
                    console.error("Ошибка при получении персонажей:", charactersError);
                    return;
                }

                if (Array.isArray(charactersData)) {
                    setCharacters(charactersData);
                } else {
                    console.error("Данные не являются массивом:", charactersData);
                }
            } catch (error) {
                console.error('Ошибка при получении персонажей:', error);
            }
        };

        fetchCharacters();
    }, []);


    const handleAddPartner = (
        targetNodeId: string,
        partnerCharacter: CharacterType,
        partner_type: PartnerType
    ) => {
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
            partner1_id: targetNodeId,
            partner2_id: null,
            partnerType: partner_type,
        };

        const updatedNodes = nodes.map((node) => {
            if (node.id === targetNodeId) {
                return {
                    ...node,
                    partner2_id: newPartnerId,
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
        console.log("Positioned nodes:", positionedNodes);
        setIsSaved(false);
    };

    const handleAddChildNode = (parentId: string, childCharacter?: CharacterType) => {
        const parentNode = nodes.find(n => n.id === parentId);
        if (!parentNode) return;

        const partnerId = parentNode.partner1_id || parentNode.partner2_id;
        const partnerNode = partnerId ? nodes.find(n => n.id === partnerId) : null;

        const newChildNode: NodeType = {
            id: uuidv4(),
            x: 0,
            y: 0,
            label: childCharacter ? `${childCharacter.name} ${childCharacter.surname}` : "Новый ребенок",
            character: childCharacter,
            characterId: childCharacter?.id || null,
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
        console.log("Positioned nodes:", positionedNodes);
        setIsSaved(false);
    };

    const handleSaveTree = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!treeId) throw new Error("treeId отсутствует");

            const { error: deleteError } = await supabase
                .from("tree_nodes")
                .delete()
                .eq("tree_id", treeId);

            if (deleteError) throw deleteError;

            const nodesToInsert = nodes.map(node => ({
                id: node.id,
                tree_id: treeId,
                label: node.label,
                x: node.x,
                y: node.y,
                character_id: node.characterId || null,
                parent1_id: node.parent1_id || null,
                parent2_id: node.parent2_id || null,
                partner1_id: node.partner1_id || null,
                partner2_id: node.partner2_id || null,
                partner_type: node.partnerType ?? null,
            }));

            const { error: insertError } = await supabase
                .from("tree_nodes")
                .insert(nodesToInsert);

            if (insertError) throw insertError;

            setIsSaved(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                console.error("Ошибка:", err.message);
            } else {
                setError("Неизвестная ошибка");
                console.error("Неизвестная ошибка:", err);
            }
        }
    };


    useEffect(() => {
        const loadTree = async () => {
            try {
                console.log("Загрузка дерева напрямую из Supabase для treeId:", treeId);

                const { data, error } = await supabase
                    .from("tree_nodes")
                    .select(`
    id,
    label,
    x,
    y,
    character_id,
    parent1_id,
    parent2_id,
    partner1_id,
    partner2_id,
    partner_type,
    character:character_id (
      id,
      name,
      surname,
      kind,
      city,
      type,
      avatar,
      gender,
      state,
      biography,
      death
    )
  `)
                    .eq("tree_id", treeId);


                if (error) throw error;

                if (data && data.length > 0) {
                    const transformedNodes: NodeType[] = data.map((node) => ({
                        id: node.id,
                        label: node.label,
                        x: node.x,
                        y: node.y,
                        characterId: node.character_id,
                        character: Array.isArray(node.character) ? node.character[0] : node.character,
                        parent1_id: node.parent1_id,
                        parent2_id: node.parent2_id,
                        partner1_id: node.partner1_id,
                        partner2_id: node.partner2_id,
                        partnerType: node.partner_type,
                    }));

                    console.log("Успешно получены узлы:", transformedNodes);
                    setNodes(transformedNodes);
                } else {
                    console.log("Пустое дерево. Создаём стартовый узел.");
                    setNodes([
                        {
                            id: uuidv4(),
                            x: 0,
                            y: 0,
                            label: "Начните здесь",
                            characterId: null,
                            parent1_id: null,
                            parent2_id: null,
                            partner1_id: null,
                            partner2_id: null,
                            partnerType: undefined,
                        },
                    ]);
                }
            } catch (err) {
                console.error("Ошибка загрузки дерева:", err);
                setNodes([
                    {
                        id: uuidv4(),
                        x: 0,
                        y: 0,
                        label: "Ошибка загрузки",
                        characterId: null,
                        parent1_id: null,
                        parent2_id: null,
                        partner1_id: null,
                        partner2_id: null,
                        partnerType: undefined,
                    },
                ]);
            }
        };

        if (treeId) {
            loadTree();
        } else {
            console.error("treeId не определён");
        }
    }, [treeId]);

    if (error) return <div>{error}</div>;

    return (
        <>

            <h2 style={{ textAlign: "center", marginBottom: "1rem", color: 'black' }}>{treeName}</h2>
            <div style={{
                display: "flex",
                gap: "10px",
                position: "relative",
                zIndex: 10,
                margin: "10px 0"
            }}>
                <Button
                    onClick={() => setEditMode(!editMode)}
                    style={{
                        backgroundColor: editMode ? "#219600" : "#9e9e9e",
                        padding: "7px 12px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "all 0.3s ease",
                        color: "white",
                        fontWeight: "500",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        minWidth: "120px",
                        justifyContent: "center"
                    }}
                >
                    <Pencil size={18} />
                    {editMode ? "Режим редактирования" : "Редактировать"}
                </Button>

                <Button
                    onClick={handleSaveTree}
                    style={{
                        backgroundColor: isSaved ? "#4CAF50" : "#007bff",
                        padding: "7px 12px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "all 0.3s ease",
                        color: "white",
                        fontWeight: "500",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        minWidth: "120px",
                        justifyContent: "center"
                    }}
                    disabled={loading || isSaved}
                >
                    <Save size={18} />
                    { isSaved ? "Сохранено!" : "Сохранить"}
                </Button>

            </div>


            <div style={styles.canvas} {...handlers}>
                <div
                    ref={containerRef}
                    style={{
                        ...styles.inner,
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    }}
                >
                    {nodes.map((node) => {
                        return (
                            <Node
                                key={node.id}
                                node={node}
                                editMode={editMode}
                                onNodeClick={handleNodeClick}
                                onAddChild={handleAddChildNode}
                                onAddPartner={() => openPartnerModal(node.id)}
                                onDeleteNode={handleDeleteNode}
                            />
                        );
                    })}
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