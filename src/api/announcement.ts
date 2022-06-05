import type { AnnouncementItem } from '@/types'
import request from './request'

// 获取全部公告
export const getAnnouncement = () =>
    request({
        url: '/notice/selectAll'
    })
// 添加公告
export const createAnnouncement = (content: AnnouncementItem) =>
    request({
        url: '/notice/addNotice',
        method: 'post',
        data: content
    })
// 根据ID查询公告
export const getAnnouncementById = (id: number) =>
    request({
        url: `/notice/select/${id}`
    })
// 更新公告
export const updateAnnouncementById = (content: AnnouncementItem) =>
    request({
        url: '/notice/updateNotice',
        method: 'put',
        data: content
    })
// 删除公告
export const deleteAnnouncementById = (id: number) =>
    request({
        url: `/notice/deleteNotice/${id}`,
        method: 'delete'
    })
