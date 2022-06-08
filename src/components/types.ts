import { StringColumn } from 'lineupjs';
import type { Dispatch, SetStateAction } from 'react';

export type SetState<T> = Dispatch<SetStateAction<T>>;

/////////////////////////////Control Bar Type
export type NodeType = 'IP' | 'Cert' | 'Domain';
export type TagType = 'id' | 'name' | 'community';

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
  currentGraph: CurrentNetworkState;
  setCurrentGraph: SetState<CurrentNetworkState>;
  range: RangeState;
  setRange: SetState<RangeState>;
};

/////////////////////////////Network Type
export type CurrentNetworkState = {
  current: 'allCommunity' | 'searchStr' | 'communities';
  communities?: number[];
};

export type NetworkProps = {
  currentGragh: CurrentNetworkState;
  setCurrentGraph: SetState<CurrentNetworkState>;
  data: DataState;
  setData: SetState<DataState>;
  searchParams: string;
  filterNode: NodeType[];
  tagFilter: TagFilterState;
  selectNode: string[];
  setSelectKeyNode: SetState<Set<any>>;
  selectKeyNode: Set<any>;
  range: RangeState;
  selectPaths: Set<any>;
  setSelectPaths: SetState<Set<any>>;
  currentNode: string;
  setCurrentNode: SetState<string>;
  selectCommunities: number[];
  isFinish: boolean;
  setIsFinish: SetState<boolean>;
};

export type DataState = {
  nodes: any[];
  links: any[];
};

export type RangeState = {
  select: string;
  min: number;
  max: number;
  currMin: number;
  currMax: number;
};

export type nodeType = {
  type: string;
  num: number;
  color?: string;
};

export type currentNode = {
  community: number;
  node_num: number;
  wrongList: nodeType[];
}

export type currentNodeself = {
  community:number;
  node_num: number;
  step:number;
  wrongList:nodeType[];
}