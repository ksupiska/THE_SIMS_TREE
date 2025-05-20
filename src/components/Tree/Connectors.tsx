import React, { JSX } from "react";

type NodeType = {
    id: number;
    partnerId?: number;
    parentId?: number;
    x: number;
    y: number;
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

    // // Вспомогательная функция для рисования линии SVG (горизонтальная и вертикальная части)
    // const renderConnector = (
    //     x1: number,
    //     y1: number,
    //     x2: number,
    //     y2: number,
    //     key: string
    // ) => {
    //     // Линия из (x1,y1) вниз на y2, потом горизонтально к x2
    //     // Или прямая линия, если x1===x2
    //     const midY = y2;

    //     if (x1 === x2) {
    //         return (
    //             <line
    //                 key={key}
    //                 x1={x1}
    //                 y1={y1}
    //                 x2={x2}
    //                 y2={y2}
    //                 stroke="black"
    //                 strokeWidth={2}
    //             />
    //         );
    //     }

    //     return (
    //         <g key={key} stroke="black" strokeWidth={2} fill="none">
    //             <line x1={x1} y1={y1} x2={x1} y2={midY} />
    //             <line x1={x1} y1={midY} x2={x2} y2={midY} />
    //             <line x1={x2} y1={midY} x2={x2} y2={y2} />
    //         </g>
    //     );
    // };

    const connectors: JSX.Element[] = [];

    // Пробегаем по всем узлам, которые могут быть родителями
    nodes.forEach((node) => {
        const partner = findPartner(node);

        // Чтобы не дублировать линии для партнёров, отрисовываем линии только для "старшего" узла пары
        if (partner && partner.id < node.id) return;

        // Находим всех детей пары (учитывая партнёра)
        let children: NodeType[] = [];

        if (partner) {
            const children1 = childrenByParents[node.id] || [];
            const children2 = childrenByParents[partner.id] || [];
            children = [...children1, ...children2];
        } else {
            children = childrenByParents[node.id] || [];
        }

        if (children.length === 0) return; // Нет детей — линии не рисуем

        // Вычисляем центр родителей
        const parentsCenterX = partner
            ? (node.x + NODE_WIDTH / 2 + partner.x + NODE_WIDTH / 2) / 2
            : node.x + NODE_WIDTH / 2;
        const parentsBottomY = node.y + NODE_HEIGHT;

        if (children.length === 1) {
            const child = children[0];
            const childCenterX = child.x + NODE_WIDTH / 2;
            const childTopY = child.y;

            const parentsCenterX = partner
                ? (node.x + NODE_WIDTH / 2 + partner.x + NODE_WIDTH / 2) / 2
                : node.x + NODE_WIDTH / 2;
            const parentsBottomY = node.y + NODE_HEIGHT;

            const verticalStep = 20; // длина первой вертикальной линии вниз

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
        }
        else {
            // Несколько детей — линия вниз от родителей, затем горизонтальная линия, затем линии к детям

            // Центрируем горизонтальную линию по детям
            const childLeftX = Math.min(...children.map((c) => c.x + NODE_WIDTH / 2));
            const childRightX = Math.max(...children.map((c) => c.x + NODE_WIDTH / 2));
            const childrenLineY = parentsBottomY + VERTICAL_GAP / 2;

            // Вертикальная линия от родителей вниз
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

            // Горизонтальная линия, соединяющая детей
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

            // Вертикальные линии к каждому ребенку
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

    return (
        <svg
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            pointerEvents="none"
        >
            {connectors}
        </svg>
    );
};

export default Connectors;
