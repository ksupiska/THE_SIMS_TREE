import { NodeType } from "../components/Tree/Tree.types";

const NODE_WIDTH = 100;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 40;
const VERTICAL_GAP = 100;
const PARTNER_GAP = 60;

export const getRootNode = (nodes: NodeType[]) =>
  nodes.find((n) => !n.parent1_id && !n.parent2_id);

type PositionedNode = NodeType & { x: number; y: number };

export const calculateTreePositions = (
  nodes: NodeType[],
  rootId: string,
  startX = 0,
  startY = 0
): { nodes: PositionedNode[]; width: number } => {
  const positionedNodes: PositionedNode[] = [];

  // Хранилище ширин поддеревьев (кеш)
  const subtreeWidths: Record<string, number> = {};

  // Рекурсивно вычисляем ширину поддерева с учётом партнёров и потомков
  const calculateSubtreeWidth = (nodeId: string): number => {
    if (subtreeWidths[nodeId] !== undefined) return subtreeWidths[nodeId];

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return NODE_WIDTH; // fallback: считаем ширину узла

    const partners = nodes.filter(
      (n) => n.partner1_id === node.id || n.partner2_id === node.id
    );

    const parentCount = 1 + partners.length;
    const parentWidth =
      NODE_WIDTH * parentCount + PARTNER_GAP * (parentCount - 1);

    const parentIds = [node.id, ...partners.map((p) => p.id)];
    const children = nodes.filter(
      (n) =>
        (n.parent1_id && parentIds.includes(n.parent1_id)) ||
        (n.parent2_id && parentIds.includes(n.parent2_id))
    );

    if (children.length === 0) {
      subtreeWidths[nodeId] = parentWidth;
      return parentWidth;
    }

    const totalChildrenWidth =
      children.reduce(
        (acc, child) => acc + calculateSubtreeWidth(child.id),
        0
      ) +
      HORIZONTAL_GAP * (children.length - 1);

    const totalWidth = Math.max(parentWidth, totalChildrenWidth);
    subtreeWidths[nodeId] = totalWidth;
    return totalWidth;
  };

  const queue: Array<{ node: NodeType; x: number; y: number }> = [];

  const root = nodes.find((n) => n.id === rootId);
  if (!root) return { nodes: [], width: 0 };

  calculateSubtreeWidth(root.id);
  queue.push({ node: root, x: startX, y: startY });

  while (queue.length > 0) {
    const { node, x, y } = queue.shift()!;

    const partners = nodes.filter(
      (n) => n.partner1_id === node.id || n.partner2_id === node.id
    );

    const parentsCount = 1 + partners.length;
    const parentsWidth =
      NODE_WIDTH * parentsCount + PARTNER_GAP * (parentsCount - 1);

    let parentStartX = x - parentsWidth / 2;

    positionedNodes.push({ ...node, x: parentStartX, y });
    parentStartX += NODE_WIDTH + PARTNER_GAP;

    partners.forEach((partner) => {
      positionedNodes.push({ ...partner, x: parentStartX, y });
      parentStartX += NODE_WIDTH + PARTNER_GAP;
    });

    const parentIds = [node.id, ...partners.map((p) => p.id)];
    const children = nodes.filter(
      (n) =>
        (n.parent1_id && parentIds.includes(n.parent1_id)) ||
        (n.parent2_id && parentIds.includes(n.parent2_id))
    );

    // Располагаем детей на основе ширины поддеревьев
    const totalChildrenWidth =
      children.reduce((acc, child) => acc + subtreeWidths[child.id], 0) +
      HORIZONTAL_GAP * Math.max(0, children.length - 1);

    let childX = x - totalChildrenWidth / 2;

    children.forEach((child) => {
      const childWidth = subtreeWidths[child.id];
      const centerX = childX + childWidth / 2;

      queue.push({
        node: child,
        x: centerX,
        y: y + NODE_HEIGHT + VERTICAL_GAP,
      });

      childX += childWidth + HORIZONTAL_GAP;
    });
  }

  const xs = positionedNodes.map((n) => n.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const width = maxX - minX + NODE_WIDTH;

  return { nodes: positionedNodes, width };
};

export const handleDeleteNode = (nodes: NodeType[], id: string): NodeType[] => {
  //if (id === "1") return nodes; // Корень нельзя удалять

  const nodeToDelete = nodes.find((node) => node.id === id);
  if (!nodeToDelete) return nodes;

  let updatedNodes = [...nodes];

  // Получаем всех партнёров удаляемого узла
  const partnerIds = [
    nodeToDelete.partner1_id,
    nodeToDelete.partner2_id,
  ].filter(Boolean) as string[];

  // Получаем детей, у которых оба родителя — nodeToDelete и кто-либо из его партнёров
  const childrenToDelete = nodes.filter((n) =>
    partnerIds.some(
      (pid) =>
        (n.parent1_id === nodeToDelete.id && n.parent2_id === pid) ||
        (n.parent2_id === nodeToDelete.id && n.parent1_id === pid)
    )
  );

  // Удаляем самого узла и его общих детей
  updatedNodes = updatedNodes.filter(
    (n) =>
      n.id !== nodeToDelete.id &&
      !childrenToDelete.some((child) => child.id === n.id)
  );

  // Очищаем partner1_id / partner2_id у других узлов, где фигурировал удаляемый
  updatedNodes = updatedNodes.map((n) => {
    const updated = { ...n };
    if (updated.partner1_id === nodeToDelete.id) {
      updated.partner1_id = null;
    }
    if (updated.partner2_id === nodeToDelete.id) {
      updated.partner2_id = null;
    }
    return updated;
  });

  return updatedNodes;
};
