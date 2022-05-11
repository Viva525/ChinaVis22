import { post } from "./http"

export const getNodeById = (NodeType:string, id:string) => {
    return post('getNodeById',{
        NodeType: id
    })
}