import type { Dispatch, SetStateAction } from "react";

export type ControlBarState = {
    isLoading: boolean;
    nodeType: string[];
    tagOption: Array<
      string | { label: string; value: string; disabled: boolean }
    >;
  };
  
  export type ControlBarProps = {
    tagFilter: TagFilterState;
    setTagFilter: SetState<TagFilterState>;
  };
  
export type SetState<T> = Dispatch<SetStateAction<T>>;

export type ControlState = {
  params: string;
  filterNode: NodeType[];
};

export type NodeType = "IP" | "Cert" | "Domain";

export type TagFilterState = {
  IP: string;
  Cert: string;
  Domain: string;
  current: NodeType;
};
