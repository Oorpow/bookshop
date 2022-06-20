import request from './request'
import type { ICargo, ILoginForm, IRegisteForm } from '@/types'

export const userLogin = (userInfo: ILoginForm) =>
    request({
        url: '/login',
        method: 'post',
        data: userInfo
    })
// 用户注销
export const userLogout = () =>
    request({
        url: '/logout'
    })

export const userRegister = (registerForm: IRegisteForm) =>
    request({
        url: '/register',
        method: 'post',
        data: registerForm
    })

// 检查是否重名
export const userRegisterCheckSameUname = (uname: string) =>
    request({
        url: `/user/selectUname/${uname}`
    })
// 查询所有用户
export const getAllUser = () =>
    request({
        url: '/user/selectAll'
    })

// 添加用户收货信息
export const addCargo = (cargo: ICargo) =>
    request({
        url: '/user/addCargo',
        method: 'put',
        data: cargo
    })

// 查询当前用户信息
export const getUserInfo = () =>
    request({
        url: '/user/select'
    })

// 修改用户信息
export const updateUserInfo = (userInfo: IRegisteForm) =>
    request({
        url: '/user/update',
        method: 'put',
        data: userInfo
    })
// 用户分页查询
export const getUserByPage = (current: number, limit: number) =>
    request({
        url: `/user/${current}/${limit}`
    })
// 删除用户
export const deleteUserById = (id: number) =>
    request({
        url: `/user/delete/${id}`,
        method: 'delete'
    })

