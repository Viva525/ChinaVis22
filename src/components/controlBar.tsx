import { Select, Segmented } from "antd";
import Search from "antd/lib/input/Search";
import React, { useState } from "react";
<<<<<<< HEAD
import type { SetState, TagFilterState, NodeType } from "./types";
=======
>>>>>>> e6d1b9e2049ec1236198e106e8173cec631adcc4

type ControlBarState = {
  isLoading: boolean;
  nodeType: string[];
  tagOption: Array<
    string | { label: string; value: string; disabled: boolean }
  >;
};

<<<<<<< HEAD
type ControlBarProps = {
  tagFilter: TagFilterState;
  setTagFilter: SetState<TagFilterState>;
};

const ControlBar: React.FC<ControlBarProps> = (props) => {
  const { tagFilter, setTagFilter } = props;
  const { IP, Cert, Domain, current } = tagFilter;
  const [ControlBarState, setControlBarState] = useState<ControlBarState>({
    isLoading: false,
    nodeType: ["IP", "Cert", "Domain"],
    tagOption: ["id", "name", "community"],
  });

  const getResult = (value: string) => {
    console.log(value);
=======
const ControlBar: React.FC<{}> = () => {
  const [ControlBarState, setControlBarState] = useState<ControlBarState>({
    isLoading: false,
    nodeType: ["IP", "Cert", "Domain"],
    tagOption: ["id", "name", "community"],
  });

  const getResult = () => {
>>>>>>> e6d1b9e2049ec1236198e106e8173cec631adcc4
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
<<<<<<< HEAD
        onChange={(value) => {
          setTagFilter((prevState) => ({
            ...prevState,
            current: value as NodeType,
          }));
        }}
        value={current}
=======
>>>>>>> e6d1b9e2049ec1236198e106e8173cec631adcc4
        style={{ marginTop: "8px" }}
      ></Segmented>
      <Segmented
        options={ControlBarState.tagOption}
        block
<<<<<<< HEAD
        onChange={(value) => {
          setTagFilter((prevState) => ({ ...prevState, [current]: value }));
        }}
        value={tagFilter[current]}
=======
>>>>>>> e6d1b9e2049ec1236198e106e8173cec631adcc4
        style={{ marginTop: "8px" }}
      ></Segmented>
    </div>
  );
};

export default ControlBar;
