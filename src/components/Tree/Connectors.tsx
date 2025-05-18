import React from "react";
import { NodeType } from "./Tree.types";

type ConnectorsProps = {
    nodes: NodeType[];
    nodeWidth?: number;
    nodeHeight?: number;
    verticalGap?: number;
};

export const Connectors: React.FC<ConnectorsProps> = ({
    nodes,
    nodeWidth = 100,
    nodeHeight = 100,
    verticalGap = 100,
}) => {
    return (
        <svg width="100000" height="100000">
            {nodes.map((node) => {
                const children = nodes.filter((child) => child.parentId === node.id);
                if (children.length === 0) return null;

                const parentX = node.x + nodeWidth / 2;
                const parentY = node.y + nodeHeight;
                const connectorY = parentY + verticalGap / 2;

                const firstChildX = children[0].x + nodeWidth / 2;
                const lastChildX = children[children.length - 1].x + nodeWidth / 2;

                return (
                    <g key={`connector-${node.id}`}>
                        <line x1={parentX} y1={parentY} x2={parentX} y2={connectorY} stroke="black" />
                        <line x1={firstChildX} y1={connectorY} x2={lastChildX} y2={connectorY} stroke="black" />
                        {children.map((child) => (
                            <line
                                key={`child-line-${child.id}`}
                                x1={child.x + nodeWidth / 2}
                                y1={connectorY}
                                x2={child.x + nodeWidth / 2}
                                y2={child.y}
                                stroke="black"
                            />
                        ))}
                    </g>
                );
            })}
        </svg>
    );
};