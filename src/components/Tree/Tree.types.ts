
export type NodeType = {
  id: number;
  x: number;
  y: number;
  label: string;
  character?: CharacterType;
  parentId?: number | undefined;
  partnerId?: number | undefined;
  CharacterId?: number | undefined;
  partnerType?: PartnerType; //тип связи партнера
};

export type TreeProps = {
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

export type PartnerType = 'married' | 'divorced' | 'engaged' | 'flirting' | 'former' | 'partner' | 'widow';