import { NodeType } from "../components/Tree/Tree.types";

const NODE_WIDTH = 100;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 40;
const VERTICAL_GAP = 100;
const PARTNER_GAP = 60;

type PositionedNode = NodeType & { x: number; y: number };

export const calculateTreePositions = (
  nodes: NodeType[],
  rootId: number,
  startX = 0,
  startY = 0
): { nodes: PositionedNode[]; width: number } => {
  const root = nodes.find((n) => n.id === rootId);
  if (!root) return { nodes: [], width: 0 };

  const partner =
    root.partnerId !== undefined
      ? nodes.find((n) => n.id === root.partnerId)
      : nodes.find((n) => n.partnerId === root.id);

  const children = nodes.filter(
    (n) => n.parentId === root.id || (partner && n.parentId === partner.id)
  );

  // Рекурсивно вычисляем поддеревья детей
  const subtrees = children.map((child) =>
    calculateTreePositions(nodes, child.id, 0, 0)
  );

  // Массив для хранения координат и ширин уже размещённых поддеревьев
  const placedSubtrees: { left: number; right: number }[] = [];

  // Здесь мы будем накапливать смещения для каждого поддерева
  let currentX = 0;

  // Массив с позиционированными узлами детей (с учётом смещений)
  const positionedChildren: PositionedNode[] = [];

  subtrees.forEach((subtree, i) => {
    // Начальное смещение X для текущего поддерева — максимально из currentX и необходимого,
    // чтобы не было пересечений с уже размещёнными поддеревьями
    let subtreeX = currentX;

    if (i > 0) {
      // Проверяем пересечения с предыдущими поддеревьями
      for (let j = 0; j < placedSubtrees.length; j++) {
        const placed = placedSubtrees[j];

        // Если следующий поддерево налезает на размещённое, сдвигаем его вправо
        if (
          subtreeX < placed.right + HORIZONTAL_GAP &&
          subtreeX + subtree.width > placed.left
        ) {
          subtreeX = placed.right + HORIZONTAL_GAP;
        }
      }
    }

    // Размещаем текущие узлы поддерева с учётом subtreeX и вертикального сдвига
    subtree.nodes.forEach((node) => {
      positionedChildren.push({
        ...node,
        x: node.x + subtreeX,
        y: node.y + NODE_HEIGHT + VERTICAL_GAP,
      });
    });

    // Получаем границы размещенного поддерева
    const bounds = {
      left: subtreeX,
      right: subtreeX + subtree.width,
    };

    placedSubtrees.push(bounds);

    // Обновляем currentX для следующего поддерева — правый край текущего
    currentX = bounds.right;
  });

  // Общая ширина всех детей вместе с промежутками
  const totalChildrenWidth =
    placedSubtrees.length > 0
      ? placedSubtrees[placedSubtrees.length - 1].right - placedSubtrees[0].left
      : 0;

  // Ширина родителей (с учётом партнёров)
  const parentsWidth = partner ? NODE_WIDTH * 2 + PARTNER_GAP : NODE_WIDTH;

  // Итоговая ширина поддерева — максимум ширины родителей и детей
  const width = Math.max(totalChildrenWidth, parentsWidth);

  // Центрируем родителей по центру итоговой ширины
  const parentsCenterX = startX + width / 2;

  // Центр детей (сдвиг для выравнивания по родителям)
  const childrenCenterX = startX + totalChildrenWidth / 2;

  const childrenShiftX = parentsCenterX - childrenCenterX;

  // Сдвигаем всех детей, чтобы центр детей совпадал с центром родителей
  const finalChildren = positionedChildren.map((node) => ({
    ...node,
    x: node.x + childrenShiftX,
  }));

  // Позиционируем родителей (и партнёров) относительно центра
  const result: PositionedNode[] = [...finalChildren];

  if (partner) {
    result.push({
      ...root,
      x: parentsCenterX - NODE_WIDTH - PARTNER_GAP / 2,
      y: startY,
    });
    result.push({
      ...partner,
      x: parentsCenterX + PARTNER_GAP / 2,
      y: startY,
    });
  } else {
    result.push({
      ...root,
      x: parentsCenterX - NODE_WIDTH / 2,
      y: startY,
    });
  }

  return { nodes: result, width };
};

export const handleDeleteNode = (nodes: NodeType[], id: number): NodeType[] => {
  if (id === 1) return nodes; // Корень нельзя удалять

  const nodeToDelete = nodes.find((node) => node.id === id);
  if (!nodeToDelete) return nodes;

  let updatedNodes = [...nodes];

  if (nodeToDelete.partnerId !== undefined) {
    const partner = nodes.find((n) => n.id === nodeToDelete.partnerId);
    if (partner) {
      // Удаляем узел и детей, у которых parentId == nodeToDelete.id или partner.id
      const childrenToDelete = nodes.filter(
        (n) =>
          (n.parentId === nodeToDelete.id && n.partnerId === partner.id) ||
          (n.parentId === partner.id && n.partnerId === nodeToDelete.id)
      );

      updatedNodes = updatedNodes.filter(
        (n) =>
          n.id !== nodeToDelete.id &&
          !childrenToDelete.some((child) => child.id === n.id)
      );
    } else {
      updatedNodes = updatedNodes.filter((n) => n.id !== nodeToDelete.id);
    }
  } else {
    updatedNodes = updatedNodes.filter((n) => n.id !== nodeToDelete.id);
  }

  return updatedNodes;
};
