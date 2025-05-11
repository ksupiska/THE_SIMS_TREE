import React, { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { supabase } from '../SupabaseClient';
import axios from 'axios';

type NodeType = {
    id: number;
    x: number;
    y: number;
    label: string;
    characterId?: number;
};

type CharacterType = {
    id: number;
    name: string;
    surname: string;
    avatar?: string;
};


const Tree: React.FC = () => {
    const [characters, setCharacters] = useState<CharacterType[]>([]);

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
                            onClick={() => handleNodeClick(node.id)}
                            style={{
                                ...styles.node,
                                left: node.x,
                                top: node.y,
                                border: editMode ? "2px dashed #333" : "none",
                            }}
                        >
                            {node.label || "+"}
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Выберите персонажа</h3>
                        {characters.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {characters.map((char) => (
                                    <li key={char.id} style={{ marginBottom: "10px" }}>
                                        <button
                                            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                                            onClick={() =>
                                                handleSelectCharacter(`${char.name} ${char.surname}`)
                                            }
                                        >
                                            {char.avatar && (
                                                <img
                                                    src={char.avatar}
                                                    alt={`${char.name} ${char.surname}`}
                                                    width={40}
                                                    height={40}
                                                    style={{ borderRadius: "50%" }}
                                                />
                                            )}
                                            <span>{char.name} {char.surname}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Персонажи не найдены</p>
                        )}
                        <button onClick={() => handleSelectCharacter("Новый персонаж")} style={{ marginTop: "10px" }}>
                            Добавить нового
                        </button>
                        <button onClick={() => setShowModal(false)} style={{ marginTop: "5px" }}>
                            Отмена
                        </button>

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
};

export default Tree;
