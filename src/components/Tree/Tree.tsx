import React, { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { Button } from "react-bootstrap";
import { Node } from "./Node/Node";
import { Connectors } from "./Connectors";
import { styles } from "./Tree.Styles";
import { NodeType, TreeProps } from "./Tree.types";
import { useTreeDrag } from "./Tree.hooks";
import { calculateTreePositions, handleDeleteNode as deleteNode } from "../../utils/treeUtils";

export const Tree: React.FC<TreeProps> = ({ initialNodes = [{ id: 1, x: 0, y: 0, label: "" }] }) => {
    const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { offset, scale, setOffset, handlers } = useTreeDrag();

    useEffect(() => {
        const canvas = containerRef.current;
        if (canvas) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            setOffset({ x: centerX, y: centerY });
        }
    }, []);

    const handleAddChildNode = (parentId: number) => {
        const newNode: NodeType = {
            id: Date.now(),
            parentId,
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

    const handleSelectCharacter = (characterName: string) => {
        setNodes((prev) =>
            prev.map((node) =>
                node.id === selectedNodeId
                    ? { ...node, label: characterName }
                    : node
            )
        );
        setShowModal(false);
    };

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
                            onDeleteNode={handleDeleteNode}
                        />
                    ))}
                    <Connectors nodes={nodes} />
                </div>
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Выберите персонажа</h3>
                        <Button onClick={() => handleSelectCharacter("Новый персонаж")} style={{ marginTop: "10px" }}>
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