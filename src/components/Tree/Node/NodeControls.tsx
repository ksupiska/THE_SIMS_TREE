import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { getControlButtonStyle } from "./Node.styles";
import { NodeControlsProps } from "./Node.types";

export const NodeControls: React.FC<NodeControlsProps> = ({
    //nodeId,
    isRoot,
    onEdit,
    onAddChild,
    onDelete,
}) => {
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

    return (
        <>
            <Button
                style={{
                    ...getControlButtonStyle(isHoveredLeft, "#259400"),
                    left: -30,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
                onClick={onEdit}
                onMouseEnter={() => handleMouseEnter("left")}
                onMouseLeave={() => handleMouseLeave("left")}
            >
                <i className="bi bi-gear-fill"></i>
            </Button>
            <Button
                style={{
                    ...getControlButtonStyle(isHoveredRight, "#ff66c2"),
                    right: -30,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
                onMouseEnter={() => handleMouseEnter("right")}
                onMouseLeave={() => handleMouseLeave("right")}
            >
                <i className="bi bi-suit-heart-fill"></i>
            </Button>
            {!isRoot && (
                <Button
                    style={{
                        ...getControlButtonStyle(isHoveredTop, "#ff6666"),
                        top: -30,
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                    onClick={onDelete}
                    onMouseEnter={() => handleMouseEnter("top")}
                    onMouseLeave={() => handleMouseLeave("top")}
                >
                    <i className="bi bi-trash-fill"></i>
                </Button>
            )}
            <Button
                style={{
                    ...getControlButtonStyle(isHoveredBottom, "#a3a3a3"),
                    bottom: -30,
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
                onClick={onAddChild}
                onMouseEnter={() => handleMouseEnter("bottom")}
                onMouseLeave={() => handleMouseLeave("bottom")}
            >
                <i className="bi bi-plus-circle-fill"></i>
            </Button>
        </>
    );
};