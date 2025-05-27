import { NodeType } from "../Tree.types";

export type NodeProps = {
    node: NodeType;
    editMode: boolean;
    onNodeClick: (id: string) => void;
    onAddChild: (parentId: string) => void;
    onDeleteNode: (id: string) => void;
    onAddPartner: (id: string) => void;
};

export type NodeControlsProps = {
    nodeId: string;
    isRoot: boolean;
    onEdit: () => void;
    onAddChild: () => void;
    onDelete: () => void;
    onAddPartner: () => void;
};