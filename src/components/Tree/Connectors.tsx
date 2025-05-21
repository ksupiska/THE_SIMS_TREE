import React, { JSX } from "react";

import { TbCirclesRelation } from "react-icons/tb"; //married женаты
import { LiaRingSolid } from "react-icons/lia";//divorced в разводе
import { GiBigDiamondRing } from "react-icons/gi"; //engaged помолвлены
import { BsChatHeart } from "react-icons/bs";//flirting флирт
import { FaHeartBroken } from "react-icons/fa";//former бывшие
import { FaHeart } from "react-icons/fa";//partner партнер
import { GiHeartWings } from "react-icons/gi"; //widow вдовцы
import { FaUserFriends } from "react-icons/fa"; //friends друзья


type NodeType = {
    id: number;
    partnerId?: number;
    parentId?: number;
    x: number;
    y: number;
    partnerType?: 'married' | 'divorced' | 'engaged' | 'flirting' | 'former' | 'partner' | 'widow' | 'friends';//женаты, в разводе, помолвлены, флирт, бывшие, партнер, вдова(вдовец), друзья
};

type ConnectorsProps = {
    nodes: NodeType[];
};

const NODE_WIDTH = 100;
const NODE_HEIGHT = 100;
//const PARTNER_GAP = 60;
const VERTICAL_GAP = 100;

const Connectors: React.FC<ConnectorsProps> = ({ nodes }) => {
    // Функция для поиска партнёра узла
    const findPartner = (node: NodeType) =>
        node.partnerId !== undefined
            ? nodes.find((n) => n.id === node.partnerId)
            : nodes.find((n) => n.partnerId === node.id);

    // Группируем детей по парам родителей (ключ — id родителя или пары)
    // Чтобы у каждого узла можно было быстро получить детей пары
    const childrenByParents: Record<number, NodeType[]> = {};

    nodes.forEach((node) => {
        if (node.parentId !== undefined) {
            if (!childrenByParents[node.parentId]) childrenByParents[node.parentId] = [];
            childrenByParents[node.parentId].push(node);
        }
    });

    const connectors: JSX.Element[] = [];

    // Пробегаем по всем узлам, которые могут быть родителями
    // 🔗 1. Линии родитель -> дети
    nodes.forEach((node) => {
        const partner = findPartner(node);

        // Чтобы не дублировать линии для партнёров, отрисовываем линии только для "старшего" узла пары
        if (partner && partner.id < node.id) return;

        // Находим всех детей пары
        let children: NodeType[] = [];

        if (partner) {
            const children1 = childrenByParents[node.id] || [];
            const children2 = childrenByParents[partner.id] || [];
            children = [...children1, ...children2];
        } else {
            children = childrenByParents[node.id] || [];
        }

        if (children.length === 0) return;

        const parentsCenterX = partner
            ? (node.x + NODE_WIDTH / 2 + partner.x + NODE_WIDTH / 2) / 2
            : node.x + NODE_WIDTH / 2;
        const parentsBottomY = node.y + NODE_HEIGHT;

        if (children.length === 1) {
            const child = children[0];
            const childCenterX = child.x + NODE_WIDTH / 2;
            const childTopY = child.y;
            const verticalStep = 20;

            connectors.push(
                <polyline
                    key={`connector-${node.id}-${child.id}`}
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
            const childLeftX = Math.min(...children.map((c) => c.x + NODE_WIDTH / 2));
            const childRightX = Math.max(...children.map((c) => c.x + NODE_WIDTH / 2));
            const childrenLineY = parentsBottomY + VERTICAL_GAP / 2;

            connectors.push(
                <line
                    key={`connector-vert-${node.id}`}
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
                    key={`connector-horiz-${node.id}`}
                    x1={childLeftX}
                    y1={childrenLineY}
                    x2={childRightX}
                    y2={childrenLineY}
                    stroke="black"
                    strokeWidth={2}
                />
            );

            children.forEach((child) => {
                const childCenterX = child.x + NODE_WIDTH / 2;
                const childTopY = child.y;

                connectors.push(
                    <line
                        key={`connector-child-${node.id}-${child.id}`}
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

    // 💞 2. Иконки партнёрства
    nodes.forEach((node) => {
        const partner = findPartner(node);
        if (!partner || partner.id < node.id) return;

        const x = (node.x + NODE_WIDTH / 2 + partner.x + NODE_WIDTH / 2) / 2;
        const y = (node.y + NODE_HEIGHT / 2 + partner.y + NODE_HEIGHT / 2) / 2;

        let icon: JSX.Element | null = null;
        switch (node.partnerType) {
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
                icon = <BsChatHeart color="#8a8a8a" />
                break;
            case "former":
                icon = <FaHeartBroken color="#8a8a8a" />
                break;
            case "partner":
                icon = <FaHeart color="#8a8a8a" />
                break;
            case "widow":
                icon = <GiHeartWings color="#8a8a8a" />
                break;
            case "friends":
                icon = <FaUserFriends color="#8a8a8a" />
                break;

        }

        if (icon) {
            connectors.push(
                <foreignObject
                    key={`partner-icon-${node.id}-${partner.id}`}
                    x={x - 16}
                    y={y - 16}
                    width={32}
                    height={32}
                >
                    <div style={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20  // чтобы увеличить размер иконки (если она реагирует на fontSize)
                    }}>
                        {icon}
                    </div>
                </foreignObject>


            );
        }
    });

    return (
        <svg
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
            pointerEvents="none"
        >
            {connectors}
        </svg>
    );
};

export default Connectors;
