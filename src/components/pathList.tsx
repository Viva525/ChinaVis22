import { List } from 'antd';
import React, { useEffect, useState } from 'react';
import { arrayBuffer } from 'stream/consumers';
import { SetState } from './types';

type PathListProps = {
  pathList: any[];
  selectKeyNode: Set<any>;
  setPathList: SetState<any[]>;
};

const PathList: React.FC<PathListProps> = (props) => {
  const { pathList, selectKeyNode } = props;
  const [listDataState, setListDataState] = useState<any[]>([]);

  useEffect(() => {
    const keyNode = Array.from(selectKeyNode);
    let res: { id: number; type: string; name: string }[][] = [];
    let startNode = { id: 123, type: 'Cert', name: '123' };
    if (keyNode.length != 0) {
      startNode = {
        id: keyNode[0].id,
        type: keyNode[0].group,
        name: keyNode[0].properties.name,
      };
    }
    let arr: { id: number; type: string; name: string }[] = [startNode];
    for (let i = 0; i < pathList.length; i++) {
      pathList[i].nodes.forEach((node: any) => {
        arr.push({ id: node.id, type: node.group, name: node.properties.name });
      });
      res.push(arr);
    }
    setListDataState((prevState) => {
      return [...prevState, ...res];
    });
  }, [pathList]);

  useEffect(() => {}, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <List
        dataSource={listDataState}
        style={{ height: '410px', overflowY: 'scroll' }}
        renderItem={(item: any) => {
          if (item.length == 0) {
            return;
          }
          debugger;
          return (
            <List.Item>
              {item.nodes.map((node: any) => {
                let color = '#6fb971';
                switch (node.type) {
                  case 'Domain':
                    color = '#5d85cf';
                    break;
                  case 'IP':
                    color = '#da7847';
                    break;
                  case 'Cert':
                    color = '#6fb971';
                    break;
                }
                return (
                  <div
                    style={{
                      background: `${color}`,
                    }}>
                    {node.properties.name}
                  </div>
                );
              })}
            </List.Item>
          );
        }}></List>
    </div>
  );
};

export default PathList;
