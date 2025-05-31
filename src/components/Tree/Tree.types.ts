export type NodeType = {
  id: string;
  x: number;
  y: number;
  label: string;
  character?: CharacterType;
  characterId?: string | null;
  parent1_id?: string | null;
  parent2_id?: string | null;
  partner1_id?: string | null;
  partner2_id?: string | null;
  partnerType?: PartnerType;
};

export type ServerNodeType = {
    id: string;
    label: string;
    x: number;
    y: number;
    character: CharacterType;
    characterId: string | null;
    parent1_id: string | null;
    parent2_id: string | null;
    partner1_id: string | null;
    partner2_id: string | null;
    partnerType: PartnerType;
};


export type TreeProps = {
  treeId: string;
  treeName: string;
  initialNodes?: NodeType[];
};

export type CharacterType = {
  id: string;
  name: string;
  surname: string;
  gender: string;
  avatar: string;
  city: string;
  kind: string;
  state: string;
  type: string;
  biography: string;
  death: string;
};

export type PartnerType = 'married' | 'divorced' | 'engaged' | 'flirting' | 'former' | 'partner' | 'widow' | 'friends';