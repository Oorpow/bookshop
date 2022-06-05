import request from './request'
import type { AdminFormType, AdminType } from '@/types'

// 管理员登录
export const adminLogin = (loginForm: AdminType) =>
    request({
        url: '/admin/login',
        method: 'post',
        data: loginForm
    })

// 管理员注销
export const adminLogout = () =>
    request({
        url: '/admin/logout'
    })

// 根据ID查询管理员信息
export const queryAdminById = (id: number) =>
    request({
        url: `/admin/select/${id}`
    })

// 查询全部管理员
export const queryAllAdmin = () =>
    request({
        url: `/admin/select`
    })

// 添加管理员
export const addAdmin = (adminForm: AdminFormType) =>
    request({
        url: '/admin/add',
        method: 'post',
        data: adminForm
    })

// 更新管理员信息
export const updateAdmin = (adminForm: AdminFormType) =>
    request({
        url: '/admin/update',
        method: 'put',
        data: adminForm
    })

// 删除管理员
export const deleteAdmin = (id: number) =>
    request({
        url: `/admin/delete/${id}`,
        method: 'delete'
    })
