import { post } from "./http";

/**
 * 根据显示节点数量展示网络
 * @param nodeNum 显示节点数量
 */
export const getNetWorkByCommunity = (communityId: number) => {
    return post('getNetworkByLimit',{
        communityId: communityId
    });
}

/**
 * 根据搜索参数查找子图
 * @param params 
 * @returns 
 */
export const getNetWorkByParams = (params: string) => {
    return post('getNetworkByParams',{
        searchParams: params
    })
}