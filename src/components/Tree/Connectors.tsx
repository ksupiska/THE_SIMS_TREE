import { JSX } from "react";
import React from "react";

import { TbCirclesRelation } from "react-icons/tb"; // married
import { LiaRingSolid } from "react-icons/lia"; // divorced
import { GiBigDiamondRing } from "react-icons/gi"; // engaged
import { BsChatHeart } from "react-icons/bs"; // flirting
import { FaHeartBroken, FaHeart, FaUserFriends } from "react-icons/fa"; // former, partner, friends
import { GiHeartWings } from "react-icons/gi"; // widow

import { NodeType } from "./Tree.types";

type ConnectorsProps = {
    nodes: NodeType[];
    nodeWidth?: number;
    nodeHeight?: number;
    verticalGap?: number;
    scale?: number;
};

const Connectors: React.FC<ConnectorsProps> = ({
    nodes,
    nodeWidth = 100,
    nodeHeight = 100,
    verticalGap = 100,
    scale = 1,
}) => {
    const connectors: JSX.Element[] = [];
    //console.log('все узлы: ', nodes);

    const childrenByParentPair: Record<string, NodeType[]> = {};
    nodes.forEach((child) => {
        const { parent1_id, parent2_id } = child;
        if (parent1_id || parent2_id) {
            const key = [parent1_id, parent2_id]
                .sort((a, b) => (a || "").localeCompare(b || ""))
                .join("|");
            if (!childrenByParentPair[key]) childrenByParentPair[key] = [];
            childrenByParentPair[key].push(child);
        }
    });

    // console.log('группировка детей по родителям:', childrenByParentPair)
    Object.entries(childrenByParentPair).forEach(([key, children]) => {
        const [p1_id, p2_id] = key.split("|"); // Используем тот же разделитель

        const parent1 = p1_id !== "null" ? nodes.find((n) => n.id === p1_id) : null;
        const parent2 = p2_id !== "null" ? nodes.find((n) => n.id === p2_id) : null;
        if (!parent1 && !parent2) return;

        const parentsCenterX = parent1 && parent2
            ? (parent1.x + nodeWidth / 2 + parent2.x + nodeWidth / 2) / 2
            : (parent1 || parent2)!.x + nodeWidth / 2;
        const parentsBottomY = (parent1 || parent2)!.y + nodeHeight;

        if (children.length === 1) {
            const child = children[0];
            const childCenterX = child.x + nodeWidth / 2;
            const childTopY = child.y;
            const verticalStep = 20;

            connectors.push(
                <polyline
                    key={`connector-${key}-${child.id}`}
                    points={`
                        ${parentsCenterX},${parentsBottomY}
                        ${parentsCenterX},${parentsBottomY + verticalStep}
                        ${childCenterX},${parentsBottomY + verticalStep}
                        ${childCenterX},${childTopY}
                    `}
                    fill="none"
                    stroke="black"
                    strokeWidth={2}
                />
            );
        } else {
            const childLeftX = Math.min(...children.map((c) => c.x + nodeWidth / 2));
            const childRightX = Math.max(...children.map((c) => c.x + nodeWidth / 2));
            const childrenLineY = parentsBottomY + verticalGap / 2;

            connectors.push(
                <line
                    key={`vert-${key}`}
                    x1={parentsCenterX}
                    y1={parentsBottomY}
                    x2={parentsCenterX}
                    y2={childrenLineY}
                    stroke="black"
                    strokeWidth={2}
                />
            );

            connectors.push(
                <line
                    key={`horiz-${key}`}
                    x1={childLeftX}
                    y1={childrenLineY}
                    x2={childRightX}
                    y2={childrenLineY}
                    stroke="black"
                    strokeWidth={2}
                />
            );

            children.forEach((child) => {
                const childCenterX = child.x + nodeWidth / 2;
                const childTopY = child.y;

                connectors.push(
                    <line
                        key={`child-${key}-${child.id}`}
                        x1={childCenterX}
                        y1={childrenLineY}
                        x2={childCenterX}
                        y2={childTopY}
                        stroke="black"
                        strokeWidth={2}
                    />
                );
            });
        }
    });

    const partnerIcons: { n1: NodeType; n2: NodeType; partnerType?: string }[] = [];
    const renderedPartnerPairs = new Set<string>();

    nodes.forEach((node) => {
        const partnerId = node.partner1_id || node.partner2_id;
        if (!partnerId) return;

        const partnerNode = nodes.find((n) => n.id === partnerId);
        if (!partnerNode) return;

        const partnerReciprocates =
            partnerNode.partner1_id === node.id || partnerNode.partner2_id === node.id;
        if (!partnerReciprocates) return;

        const key = [node.id, partnerNode.id].sort().join("-");
        if (renderedPartnerPairs.has(key)) return;
        renderedPartnerPairs.add(key);

        partnerIcons.push({
            n1: node,
            n2: partnerNode,
            partnerType: node.partnerType || partnerNode.partnerType,
        });
    });

    partnerIcons.forEach(({ n1, n2, partnerType }) => {
        const x = (n1.x + nodeWidth / 2 + n2.x + nodeWidth / 2) / 2;
        const y = (n1.y + nodeHeight / 2 + n2.y + nodeHeight / 2) / 2;

        let icon: JSX.Element | null = null;
        switch (partnerType) {
            case "married":
                icon = <TbCirclesRelation color="#8a8a8a" />;
                break;
            case "divorced":
                icon = <LiaRingSolid color="#8a8a8a" />;
                break;
            case "engaged":
                icon = <GiBigDiamondRing color="#8a8a8a" />;
                break;
            case "flirting":
                icon = <BsChatHeart color="#8a8a8a" />;
                break;
            case "former":
                icon = <FaHeartBroken color="#8a8a8a" />;
                break;
            case "partner":
                icon = <FaHeart color="#8a8a8a" />;
                break;
            case "widow":
                icon = <GiHeartWings color="#8a8a8a" />;
                break;
            case "friends":
                icon = <FaUserFriends color="#8a8a8a" />;
                break;
            default:
                icon = null;
        }

        if (icon) {
            const size = 32 / scale;
            connectors.push(
                <foreignObject
                    key={`partner-icon-${n1.id}-${n2.id}`}
                    x={x - size / 2}
                    y={y - size / 2}
                    width={size}
                    height={size}
                    pointerEvents="auto"
                >
                    <div
                        style={{
                            width: size,
                            height: size,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: `scale(${1 / scale})`,
                            transformOrigin: "center",
                        }}
                    >
                        {icon}
                    </div>
                </foreignObject>
            );
        }
    });

    return (
        <svg
            style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}
            width="100%"
            height="100%"
        >
            {connectors}
        </svg>
    );
};

export default Connectors;