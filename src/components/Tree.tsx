import React, { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { Button } from 'react-bootstrap';

type NodeType = {
    id: number;
    x: number;
    y: number;
    label: string;
    characterId?: number;
};
const Tree: React.FC = () => {

    const [nodes, setNodes] = useState<NodeType[]>([
        { id: 1, x: 400, y: 300, label: "" }, // Пустой кружочек
    ]);
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

    useEffect(() => {
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
                <div
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
                                        <Button
                                            style={menuButtonTop}
                                            onMouseEnter={() => handleMouseEnter("top")}
                                            onMouseLeave={() => handleMouseLeave("top")}
                                        ><i className="bi bi-trash-fill"></i></Button>
                                        <Button
                                            style={menuButtonBottom}
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
