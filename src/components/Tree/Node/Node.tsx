import React, { useState } from "react";
import { NodeProps } from "./Node.types";
import { NodeControls } from "./NodeControls";
import { nodeStyles } from "./Node.styles";

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
                        isRoot={node.id === uuidv4()} // Изменено на сравнение со string
                        onEdit={() => onNodeClick(node.id)}
                        onAddChild={() => onAddChild(node.id)}
                        onAddPartner={() => onAddPartner(node.id)}
                        onDelete={() => onDeleteNode(node.id)}
                    />
                )}
                <div
                    style={{
                        ...nodeStyles.node,
                        border: editMode ? "2px dashed #333" : nodeStyles.node.border,
                        cursor: "default",
                        backgroundColor: "transparent",
                    }}
                >
                    {node.character ? (
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={node.character.avatar}
                                alt="Avatar"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    borderRadius: "50%",
                                }}
                            />
                        </div>
                    ) : (
                        <span style={{ fontSize: 28, color: "#999" }}>+</span>
                    )}
                </div>
            </div>
        </div>
    );
};