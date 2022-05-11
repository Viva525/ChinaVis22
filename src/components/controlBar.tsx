import { Select, Segmented } from "antd";
import Search from "antd/lib/input/Search";
import React, { useState } from "react";
import type {
  ControlBarState,
  ControlBarProps,
  TagFilterState,
  NodeType,
} from "./types";

const ControlBar: React.FC<ControlBarProps> = (props) => {
  const { filterNode, setFilterNode, tagFilter, setTagFilter } = props;
  const { IP, Cert, Domain, current } = tagFilter;
  const [ControlBarState, setControlBarState] = useState<ControlBarState>({
    isLoading: false,
    nodeType: ["IP", "Cert", "Domain"],
    tagOption: ["id", "name", "community"],
  });

  const getResult = (value: string) => {
    console.log(value);
    setControlBarState((prevstate) => ({ ...prevstate, isLoading: true }));
  };

  const handleChange = (nodes: string) => {
    console.log(`${nodes}`);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Search
        placeholder='input node or link want to search'
        style={{ width: "100%" }}
        enterButton='Search'
        loading={ControlBarState.isLoading}
        onSearch={getResult}
      />
      <Select
        mode='multiple'
        allowClear
        placeholder='filter node'
        //@ts-ignore
        value={filterNode}
        onChange={handleChange}
        style={{ width: "100%", marginTop: "8px" }}
      >
        {ControlBarState.nodeType?.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      <Segmented
        options={["IP", "Cert", "Domain"]}
        block
        onChange={(value) => {
          setTagFilter((prevState) => ({
            ...prevState,
            current: value as NodeType,
          }));
        }}
        value={current}
        style={{ marginTop: "8px" }}
      ></Segmented>
      <Segmented
        options={ControlBarState.tagOption}
        block
        onChange={(value) => {
          setTagFilter((prevState) => ({ ...prevState, [current]: value }));
        }}
        value={tagFilter[current]}
        style={{ marginTop: "8px" }}
      ></Segmented>
    </div>
  );
};

export default ControlBar;
