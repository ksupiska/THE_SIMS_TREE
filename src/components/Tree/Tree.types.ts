
export type NodeType = {
  id: string;
  x: number;
  y: number;
  label: string;
  character?: CharacterType;
  parentId?: string | undefined;
  partnerId?: string | undefined;
  characterId?: string | undefined;
  partnerType?: PartnerType; //тип связи партнера
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
  avatar?: string;
  city: string;
  kind: string;
  state: string;
  type: string;
  biography: string;
  death: string;
};

export type PartnerType = 'married' | 'divorced' | 'engaged' | 'flirting' | 'former' | 'partner' | 'widow' | 'friends';