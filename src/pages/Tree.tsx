import React, { useState, useEffect, useRef } from "react";

type NodeType = {
    id: number;
    x: number;
    y: number;
    label: string;
};

const initialNodes: NodeType[] = [
    { id: 1, x: 300, y: 300, label: "Основатель" },
    { id: 2, x: 500, y: 500, label: "Ребёнок" },
];

const Tree: React.FC = () => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const lastTouchDistanceRef = useRef<number | null>(null);


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

        setScale((prev) => {
            const newScale = prev + event.deltaY * -0.002;
            return Math.min(Math.max(newScale, 0.5), 3);
        });
    };

    /*для мобилок*/
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

                setScale((prev) => {
                    const newScale = prev + delta * 0.005;
                    return Math.min(Math.max(newScale, 0.5), 3);
                });
            }
        }
    };


    const handleTouchEnd = () => {
        setIsDragging(false);
        lastTouchDistanceRef.current = null;
    };


    return (
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
                {initialNodes.map((node) => (
                    <div
                        key={node.id}
                        style={{
                            ...styles.node,
                            left: node.x,
                            top: node.y,
                        }}
                    >
                        {node.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    canvas: {
        width: "100%",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        position: "relative",
        cursor: "grab",
    } as React.CSSProperties,

    inner: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100000px",
        height: "100000px",
        transformOrigin: "top left",
        transition: "transform 0.1s ease-out", // плавность
    } as React.CSSProperties,

    node: {
        position: "absolute",
        width: "120px",
        height: "120px",
        backgroundColor: "#4A90E2",
        color: "white",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        userSelect: "none",
    } as React.CSSProperties,
};

export default Tree;
