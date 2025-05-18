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
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => editMode && onNodeClick(node.id)}
                >
                    {node.label || "+"}
                </div>
            </div>
        </div>
    );
};