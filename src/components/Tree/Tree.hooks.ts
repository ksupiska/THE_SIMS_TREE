import { useState, useRef } from "react";

export const useTreeDrag = () => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const lastTouchDistanceRef = useRef<number | null>(null);

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

    return {
        offset,
        scale,
        setOffset, // Добавляем setOffset в возвращаемый объект
        handlers: {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
            onWheel: handleWheel,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
    };
};