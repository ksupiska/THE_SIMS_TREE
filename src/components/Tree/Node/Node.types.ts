import { NodeType } from "../Tree.types";

export type NodeProps = {
    node: NodeType;
    editMode: boolean;
    onNodeClick: (id: number) => void;
    onAddChild: (parentId: number) => void;
    onDeleteNode: (id: number) => void;
};

export type NodeControlsProps = {
    nodeId: number;
    isRoot: boolean;
    onEdit: () => void;
    onAddChild: () => void;
    onDelete: () => void;
};