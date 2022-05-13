import type { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

/////////////////////////////Control Bar Type
export type NodeType = "IP" | "Cert" | "Domain";
export type TagType = "Id" | "Name" | "Community";

export type Node = NodeType[];
export type Tag = TagType[];


export type ControlState = {
  searchParams: string;
  filterNode: NodeType[];
};

export type TagFilterState = {
  IP: string;
  Cert: string;
  Domain: string;
  current: NodeType;
};

export type ControlBarProps = {
  searchParams: string;
  setSearchParams: SetState<string>;
  filterNode: NodeType[];
  setFilterNode: SetState<NodeType[]>;
  tagFilter: TagFilterState;
  setTagFilter: SetState<TagFilterState>;
};

/////////////////////////////Network Type
export type CurrentNetworkState = {
  current: 'allCommunity' | 'searchStr' | 'communities';
  communities?: number[];
}

export type NetworkProps = {
  currentGragh: CurrentNetworkState;
  searchParams: string;
  filterNode: NodeType[];
  tagFilter: TagFilterState;
}

export type DataState = {
  nodes: any[];
  links: any[];
}