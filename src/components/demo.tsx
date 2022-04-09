import React from "react";

//React FC 写法 推荐写这种
const demo: React.FC<{}> = () => {
  return <div style={{ width: "100%", height: "100%" }}>demo111</div>;
};

//React Component 写法
// import React, {Component} from 'react'

// class demo extends Component<any, any> {
//     constructor(props: any){
//         super(props);
//     }

//     render(){
//         return(
//             <div style={{width:'100%', height:'100%'}}></div>
//         )
//     }
// }

export default demo;
