import type { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type NodeType = "IP" | "Cert" | "Domain";
export type TagType = "Id" | "Name" | "Community";

export type Node = NodeType[];
export type Tag = TagType[];

export type ControlBarProps = {
  searchParams: string;
  setSearchParams: SetState<string>;
  filterNode: NodeType[];
  setFilterNode: SetState<NodeType[]>;
  tagFilter: TagFilterState;
  setTagFilter: SetState<TagFilterState>;
};

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
