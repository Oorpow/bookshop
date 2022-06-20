import request from './request'

// 用户收藏商品
export const userCollect = (id: number) =>
    request({
        url: `/collect/add/${id}`,
        method: 'post'
    })

// 查询用户全部收藏
export const getUserCollection = () =>
    request({
        url: `/collect/selectAll`
    })

// 查询用户已经收藏过的书的ID
export const getCollectionId = () =>
    request({
        url: '/collect/selectAllBid'
    })

// 取消收藏
export const userCancelCollect = (id: number) =>
    request({
        url: `/collect/delete/${id}`,
        method: 'delete'
    })
