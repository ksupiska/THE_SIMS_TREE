export type NodeType = {
    id: number;
    x: number;
    y: number;
    label: string;
    characterId?: number;
    parentId?: number | null;
    partnerId?: number | null;
};

export type TreeProps = {
    initialNodes?: NodeType[];
};