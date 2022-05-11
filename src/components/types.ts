import type { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type ControlState = {
  params: string;
  filterNode: string[];
};

export type NodeType = "IP" | "Cert" | "Domain";

export type TagFilterState = {
  IP: string;
  Cert: string;
  Domain: string;
  current: NodeType;
};
