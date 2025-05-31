import React, { useState } from "react";
import { NodeProps } from "./Node.types";
import { NodeControls } from "./NodeControls";
import { v4 as uuidv4 } from 'uuid';

export const Node: React.FC<NodeProps> = ({
    node,
    editMode,
    onNodeClick,
    onAddChild,
    onDeleteNode,
    onAddPartner,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: "absolute", left: node.x, top: node.y }}
        >
            <div style={{ position: "relative", width: 100, height: 100 }}>
                {editMode && isHovered && (
                    <NodeControls
                        nodeId={node.id}
                        isRoot={node.id === uuidv4()}
                        onEdit={() => onNodeClick(node.id)}
                        onAddChild={() => onAddChild(node.id)}
                        onAddPartner={() => onAddPartner(node.id)}
                        onDelete={() => onDeleteNode(node.id)}
                    // Убрали onAvatarClick отсюда, так как он теперь в основном компоненте
                    />
                )}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                    onClick={() => onNodeClick?.(node.id)}
                >
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid #999999",
                            transition: "border 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.border = "2px solid #595959")}
                        onMouseLeave={(e) => (e.currentTarget.style.border = "2px solid #ccc")}
                    >
                        {node.character?.avatar ? (
                            <img
                                src={node.character.avatar}
                                alt="Avatar"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    display: "block",
                                    cursor: !editMode ? "pointer" : "default",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Предотвращаем всплытие клика
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#eee",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: 28,
                                    color: "#999",
                                }}
                            >
                                +
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 14, textAlign: "center", color: "#333" }}>
                        {node.character?.name} {node.character?.surname}
                    </div>
                </div>
            </div>
        </div>
    );
};