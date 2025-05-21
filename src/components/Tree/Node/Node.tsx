import React, { useState } from "react";
import { NodeProps } from "./Node.types";
import { NodeControls } from "./NodeControls";
import { nodeStyles } from "./Node.styles";

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
                        isRoot={node.id === 1}
                        onEdit={() => onNodeClick(node.id)}
                        onAddChild={() => onAddChild(node.id)}
                        onAddPartner={() => onAddPartner(node.id)}
                        onDelete={() => onDeleteNode(node.id)}
                    />
                )}
                <div
                    style={{
                        ...nodeStyles.node,
                        border: editMode ? "2px dashed #333" : "none",
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        cursor: "default", // не показываем "ручку"
                    }}
                >
                    {node.character ? (
                        <>
                            <img
                                src={node.character.avatar}
                                alt="Avatar"
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: 12,
                                    textAlign: "center",
                                    marginTop: 5,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "90%",
                                    zIndex: 100,
                                }}
                            >
                                
                            </span>
                        </>
                    ) : (
                        <span style={{ fontSize: 28, color: "#999" }}>+</span>
                    )}
                </div>

            </div>
        </div>
    );
};
