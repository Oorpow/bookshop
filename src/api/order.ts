import request from './request'
import type { IBookItem, ICreateOrder } from '@/types'

// 添加订单
export const createOrder = (list: ICreateOrder) =>
    request({
        url: '/order/addOrder',
        method: 'put',
        data: list
    })

// 查询用户所有订单
export const getAllOrder = () =>
    request({
        url: '/order/selectAll'
    })

// 根据订单编号查询订单
export const getOrderByOrderId = (orderSerial: string) =>
    request({
        url: `/order/select/orderSerial/${orderSerial}`
    })

// 根据订单编号支付订单
export const payOrderByOrderId = (orderSerial: string) =>
    request({
        url: '/order/payOrder',
        method: 'put',
        data: {
            orderSerial
        }
    })

// 根据订单编号删除订单
export const deleteOrderByOrderId = (orderSerial: string) =>
    request({
        url: 'order/deleteOrder',
        method: 'delete',
        data: {
            orderSerial
        }
    })

// 根据分页查询订单
export const getOrderListByPage = (current: number, limit: number) =>
    request({
        url: `/order/${current}/${limit}`
    })
