import request from './request'

export const getUserCart = () =>
    request({
        url: '/cart/selectAll'
    })

// 加入购物车
export const addProductToCart = (id: number) =>
    request({
        url: `/cart/add/${id}`,
        method: 'post'
    })

// 修改商品数量
export const updateProductNum = (bid: string, bookNumber: string) =>
    request({
        url: '/cart/update',
        method: 'put',
        data: {
            bid,
            bookNumber
        }
    })

// 根据ID删除商品
export const deleteProductById = (id: number) =>
    request({
        url: `/cart/delete/${id}`,
        method: 'delete'
    })
