import { NodeType } from "../components/Tree/Tree.types";

const NODE_WIDTH = 100;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 120;
const VERTICAL_GAP = 100;

export const calculateTreePositions = (
    nodes: NodeType[],
    nodeId: number,
    startX: number,
    startY: number
): { nodes: NodeType[]; width: number } => {
    const children = nodes.filter((node) => node.parentId === nodeId);

    if (children.length === 0) {
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return { nodes: [], width: 0 };
        return { nodes: [{ ...node, x: startX, y: startY }], width: NODE_WIDTH };
    }

    let currentX = startX;
    const updatedNodes: NodeType[] = [];

    for (const child of children) {
        const subtree = calculateTreePositions(nodes, child.id, currentX, startY + NODE_HEIGHT + VERTICAL_GAP);
        const childWidth = subtree.width;
        updatedNodes.push(...subtree.nodes);
        currentX += childWidth + HORIZONTAL_GAP;
    }

    const totalWidth = currentX - startX - HORIZONTAL_GAP;
    const nodeX = startX + totalWidth / 2 - NODE_WIDTH / 2;

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { nodes: updatedNodes, width: totalWidth };

    updatedNodes.push({
        ...node,
        x: nodeX,
        y: startY,
    });

    return { nodes: updatedNodes, width: totalWidth };
};

export const handleDeleteNode = (nodes: NodeType[], id: number): NodeType[] => {
    if (id === 1) return nodes;

    const nodeToDelete = nodes.find((node) => node.id === id);
    if (!nodeToDelete) return nodes;

    let newNodes = nodes.filter((node) => node.id !== id);
    if (!nodeToDelete.parentId) return newNodes;

    const siblings = newNodes.filter((node) => node.parentId === nodeToDelete.parentId);
    if (siblings.length === 0) return newNodes;

    const parentNode = newNodes.find((node) => node.id === nodeToDelete.parentId);
    if (!parentNode) return newNodes;

    return repositionNodes(newNodes, siblings, parentNode);
};

const repositionNodes = (nodes: NodeType[], siblings: NodeType[], parentNode: NodeType): NodeType[] => {
    const parentCenterX = parentNode.x + NODE_WIDTH / 2;
    const childY = parentNode.y + NODE_HEIGHT + VERTICAL_GAP;

    if (siblings.length === 1) {
        return nodes.map((node) =>
            node.id === siblings[0].id
                ? { ...node, x: parentCenterX - NODE_WIDTH / 2, y: childY }
                : node
        );
    }

    const totalWidth = siblings.length * NODE_WIDTH + (siblings.length - 1) * HORIZONTAL_GAP;
    const startX = parentCenterX - totalWidth / 2;

    return nodes.map((node) => {
        const siblingIndex = siblings.findIndex((s) => s.id === node.id);
        if (siblingIndex === -1) return node;

        return {
            ...node,
            x: startX + siblingIndex * (NODE_WIDTH + HORIZONTAL_GAP),
            y: childY,
        };
    });
};