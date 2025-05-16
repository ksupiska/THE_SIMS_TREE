import React, { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { Button } from 'react-bootstrap';

type NodeType = {
    id: number;
    x: number;
    y: number;
    label: string;
    characterId?: number;
    parentId?: number | null; //связь родителя
    partnerId?: number | null; //связь партнера
};
const NODE_WIDTH = 100;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 120;
const VERTICAL_GAP = 100;

const Tree: React.FC = () => {

    const [nodes, setNodes] = useState<NodeType[]>([
        { id: 1, x: 0, y: 0, label: "" }, // Пустой кружочек
    ]);
    const containerRef = useRef<HTMLDivElement>(null);

    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const lastTouchDistanceRef = useRef<number | null>(null);
    //храним активный узел
    const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
    //отслеживание наведения

    const [isHoveredLeft, setIsHoveredLeft] = useState(false);
    const [isHoveredRight, setIsHoveredRight] = useState(false);
    const [isHoveredTop, setIsHoveredTop] = useState(false);
    const [isHoveredBottom, setIsHoveredBottom] = useState(false);
    const handleMouseEnter = (side: string) => {
        if (side === "left") setIsHoveredLeft(true);
        if (side === "right") setIsHoveredRight(true);
        if (side === "top") setIsHoveredTop(true);
        if (side === "bottom") setIsHoveredBottom(true);
    };

    const handleMouseLeave = (side: string) => {
        if (side === "left") setIsHoveredLeft(false);
        if (side === "right") setIsHoveredRight(false);
        if (side === "top") setIsHoveredTop(false);
        if (side === "bottom") setIsHoveredBottom(false);
    };

    const menuButtonTop: React.CSSProperties = {
        backgroundColor: isHoveredTop ? "#ff6666" : "#e3e3e3", // меняем цвет при наведении
        transition: "background-color 0.3s ease", // плавное изменение цвета
        position: "absolute",
        border: "1px solid #ccc",
        borderRadius: "100px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
        top: -30,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
    };
    const menuButtonLeft: React.CSSProperties = {
        backgroundColor: isHoveredLeft ? "#259400" : "#e3e3e3", // меняем цвет при наведении
        transition: "background-color 0.3s ease", // плавное изменение цвета
        position: "absolute",
        border: "1px solid #ccc",
        borderRadius: "100px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
        left: -30,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
    };
    const menuButtonRight: React.CSSProperties = {
        backgroundColor: isHoveredRight ? "#ff66c2" : "#e3e3e3", // меняем цвет при наведении
        transition: "background-color 0.3s ease", // плавное изменение цвета
        position: "absolute",
        border: "1px solid #ccc",
        borderRadius: "100px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
        right: -30,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
    };
    const menuButtonBottom: React.CSSProperties = {
        backgroundColor: isHoveredBottom ? "#a3a3a3" : "#e3e3e3", // меняем цвет при наведении
        transition: "background-color 0.3s ease", // плавное изменение цвета
        position: "absolute",
        border: "1px solid #ccc",
        borderRadius: "100px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
        bottom: -30,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
    };

    // Функция для рекурсивного расчета позиций всех узлов в поддереве
    const calculateTreePositions = (
        nodes: NodeType[],
        nodeId: number,
        startX: number,
        startY: number
    ): { nodes: NodeType[]; width: number } => {
        // Получаем детей текущего узла
        const children = nodes.filter(node => node.parentId === nodeId);

        if (children.length === 0) {
            // Если детей нет — просто ставим узел в указанную позицию
            const node = nodes.find(n => n.id === nodeId);
            if (!node) return { nodes: [], width: 0 };
            return { nodes: [{ ...node, x: startX, y: startY }], width: NODE_WIDTH };
        }

        let currentX = startX;
        const updatedNodes: NodeType[] = [];

        // Рекурсивно рассчитываем положение каждого ребенка
        for (const child of children) {
            const subtree = calculateTreePositions(nodes, child.id, currentX, startY + NODE_HEIGHT + VERTICAL_GAP);
            const childWidth = subtree.width;

            updatedNodes.push(...subtree.nodes);
            currentX += childWidth + HORIZONTAL_GAP;
        }

        // Общая ширина всех детей (с учетом отступов)
        const totalWidth = currentX - startX - HORIZONTAL_GAP;

        // Позиция родителя — по центру над детьми
        const nodeX = startX + totalWidth / 2 - NODE_WIDTH / 2;

        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { nodes: updatedNodes, width: totalWidth };

        // Добавляем текущий узел в список с рассчитанной позицией
        updatedNodes.push({
            ...node,
            x: nodeX,
            y: startY,
        });

        return { nodes: updatedNodes, width: totalWidth };
    };
    //добавление дочерних узлов
    const handleAddChildNode = (parentId: number) => {
        const newNode: NodeType = {
            id: Date.now(),
            parentId,
            x: 0,
            y: 0,
            label: "",
        };

        const newNodes = [...nodes, newNode];

        // Фиксируем позицию корня в 0,0 — чтобы он не прыгал
        const { nodes: updatedNodes } = calculateTreePositions(newNodes, 1, 0, 0);

        setNodes(updatedNodes);
    };

    //удаление узлов древа
    const handleDeleteNode = (id: number) => {
        // Проверяем, можно ли удалять этот узел
        if (id === 1) {
            alert("Первый узел не может быть удален.");
            return;
        }

        setNodes(prevNodes => {
            // Находим удаляемый узел
            const nodeToDelete = prevNodes.find(node => node.id === id);
            if (!nodeToDelete) return prevNodes;

            // Удаляем узел
            const newNodes = prevNodes.filter(node => node.id !== id);

            // Если у узла нет родителя (или это корневой), просто возвращаем новый массив
            if (!nodeToDelete.parentId) return newNodes;

            // Находим всех детей этого же родителя (братьев/сестер удаленного узла)
            const siblings = newNodes.filter(node => node.parentId === nodeToDelete.parentId);

            // Если детей не осталось, ничего не перераспределяем
            if (siblings.length === 0) return newNodes;

            // Находим родительский узел
            const parentNode = newNodes.find(node => node.id === nodeToDelete.parentId);
            if (!parentNode) return newNodes;

            // Функция для перерасчета позиций
            const repositionNodes = (nodes: NodeType[]) => {
                const parentCenterX = parentNode.x + NODE_WIDTH / 2;
                const childY = parentNode.y + NODE_HEIGHT + VERTICAL_GAP;

                // Если остался только один ребенок - центрируем его
                if (siblings.length === 1) {
                    return nodes.map(node =>
                        node.id === siblings[0].id
                            ? { ...node, x: parentCenterX - NODE_WIDTH / 2, y: childY }
                            : node
                    );
                }

                // Рассчитываем новые позиции для нескольких детей
                const totalWidth = siblings.length * NODE_WIDTH + (siblings.length - 1) * HORIZONTAL_GAP;
                const startX = parentCenterX - totalWidth / 2;

                return nodes.map(node => {
                    const siblingIndex = siblings.findIndex(s => s.id === node.id);
                    if (siblingIndex === -1) return node;

                    return {
                        ...node,
                        x: startX + siblingIndex * (NODE_WIDTH + HORIZONTAL_GAP),
                        y: childY
                    };
                });
            };

            return repositionNodes(newNodes);
        });
    };

    useEffect(() => {
        const canvas = containerRef.current;
        if (canvas) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            setOffset({ x: centerX, y: centerY });
        }
        const disableZoom = (event: WheelEvent) => {
            if (event.ctrlKey) event.preventDefault();
        };
        document.addEventListener("wheel", disableZoom, { passive: false });
        return () => document.removeEventListener("wheel", disableZoom);
    }, []);

    const handleMouseDown = (event: React.MouseEvent) => {
        setIsDragging(true);
        setStartPos({ x: event.clientX - offset.x, y: event.clientY - offset.y });
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: event.clientX - startPos.x,
            y: event.clientY - startPos.y,
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (event: React.WheelEvent) => {
        setScale((prev) => Math.min(Math.max(prev + event.deltaY * -0.002, 0.5), 3));
    };

    const handleTouchStart = (event: React.TouchEvent) => {
        const touch = event.touches[0];
        setIsDragging(true);
        setStartPos({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        if (event.touches.length === 1 && isDragging) {
            const touch = event.touches[0];
            setOffset({
                x: touch.clientX - startPos.x,
                y: touch.clientY - startPos.y,
            });
        }

        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );

            if (lastTouchDistanceRef.current === null) {
                lastTouchDistanceRef.current = distance;
            } else {
                const delta = distance - lastTouchDistanceRef.current;
                lastTouchDistanceRef.current = distance;

                setScale((prev) => Math.min(Math.max(prev + delta * 0.005, 0.5), 3));
            }
        }

    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        lastTouchDistanceRef.current = null;
    };

    //открываем модальное окно по нажатию на кружок
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
            <button
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
                {/* {editMode ? "Завершить" : "Редактировать"} */}
            </button>

            <div
                style={styles.canvas}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div ref={containerRef}
                    style={{
                        ...styles.inner,
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    }}
                >

                    {nodes.map((node) => (
                        <div
                            key={node.id}
                            onMouseEnter={() => setHoveredNodeId(node.id)}
                            onMouseLeave={() => setHoveredNodeId(null)}

                            style={{ position: "absolute", left: node.x, top: node.y }}
                        >
                            <div style={{ position: "relative", width: 100, height: 100 }}>
                                {/* Контекстное меню */}
                                {editMode && hoveredNodeId === node.id && (
                                    <>
                                        <Button
                                            style={menuButtonLeft}
                                            onClick={() => handleNodeClick(node.id)}
                                            onMouseEnter={() => handleMouseEnter("left")}
                                            onMouseLeave={() => handleMouseLeave("left")}
                                        >
                                            <i className="bi bi-gear-fill"></i>
                                        </Button>
                                        <Button
                                            style={menuButtonRight}
                                            onMouseEnter={() => handleMouseEnter("right")}
                                            onMouseLeave={() => handleMouseLeave("right")}
                                        ><i className="bi bi-suit-heart-fill"></i></Button>
                                        {node.id !== 1 && (
                                            <Button
                                                style={menuButtonTop}
                                                onClick={() => handleDeleteNode(node.id)}
                                                onMouseEnter={() => handleMouseEnter("top")}
                                                onMouseLeave={() => handleMouseLeave("top")}
                                            ><i className="bi bi-trash-fill"></i></Button>
                                        )}
                                        <Button
                                            style={menuButtonBottom}
                                            onClick={() => handleAddChildNode(node.id)}
                                            onMouseEnter={() => handleMouseEnter("bottom")}
                                            onMouseLeave={() => handleMouseLeave("bottom")}
                                        ><i className="bi bi-plus-circle-fill"></i></Button>
                                    </>
                                )}

                                {/* Сам кружок */}
                                <div
                                    style={{
                                        ...styles.node,
                                        border: editMode ? "2px dashed #333" : "none",
                                        width: 100,
                                        height: 100,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {node.label || "+"}
                                </div>
                            </div>
                        </div>
                    ))}
                    <svg width="100000" height="100000">
                        {nodes.map((node) => {
                            const children = nodes.filter(child => child.parentId === node.id);
                            if (children.length === 0) return null;

                            const parentX = node.x + NODE_WIDTH / 2;
                            const parentY = node.y + NODE_HEIGHT;
                            const connectorY = parentY + VERTICAL_GAP / 2;

                            // Рассчитываем крайние точки для горизонтальной линии
                            const firstChildX = children[0].x + NODE_WIDTH / 2;
                            const lastChildX = children[children.length - 1].x + NODE_WIDTH / 2;

                            return (
                                <g key={`connector-${node.id}`}>
                                    {/* Линия от родителя к центру горизонтальной линии */}
                                    <line x1={parentX} y1={parentY} x2={parentX} y2={connectorY} stroke="black" />

                                    {/* Горизонтальная линия, покрывающая всех детей */}
                                    <line x1={firstChildX} y1={connectorY} x2={lastChildX} y2={connectorY} stroke="black" />

                                    {/* Линии к каждому ребенку */}
                                    {children.map(child => (
                                        <line
                                            key={`child-line-${child.id}`}
                                            x1={child.x + NODE_WIDTH / 2}
                                            y1={connectorY}
                                            x2={child.x + NODE_WIDTH / 2}
                                            y2={child.y}
                                            stroke="black"
                                        />
                                    ))}
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {showModal && ( //то что в модалке показывается
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


const styles = {

    canvas: {
        width: "100%",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        position: "relative",
        touchAction: "none",
    } as React.CSSProperties,

    inner: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100000px",
        height: "100000px",
        transformOrigin: "top left",
        transition: "transform 0.1s ease-out",
    } as React.CSSProperties,

    node: {
        position: "absolute",
        width: "120px",
        height: "120px",
        backgroundColor: "#fff",
        borderRadius: "50%",
        border: "2px solid #999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        userSelect: "none",
        cursor: "pointer",
        zIndex: 1,
    } as React.CSSProperties,

    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    } as React.CSSProperties,

    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "300px",
        textAlign: "center",
        maxHeight: "80vh",
        overflowY: "auto",
    } as React.CSSProperties,

    menu: {
        marginTop: "5px",
        display: "flex",
        justifyContent: "center",
        gap: "6px",
    },
};

export default Tree;
