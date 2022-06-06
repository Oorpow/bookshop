import request from './request'
import type { BookFilterType, IAddBook, NewBookFormType } from '@/types'

// 获取全部书籍
export const bookGetList = () =>
    request({
        url: '/book/selectAll'
    })

// 添加书籍
export const bookAdd = (bookForm: IAddBook) =>
    request({
        url: '/book/addBook',
        method: 'post',
        data: bookForm
    })

// 根据ID查询书籍
export const getBookById = (id: number) =>
    request({
        url: `/book/select/${id}`
    })

// 根据书名查询书籍
export const getBookByBookName = (bookName: string) =>
    request({
        url: '/book/select',
        method: 'post',
        data: {
            bookName
        }
    })

// 更新书籍信息
export const updateBookById = (bookForm: NewBookFormType) =>
    request({
        url: '/book/updateBook',
        method: 'put',
        data: bookForm
    })

// 根据ID删除书籍
export const deleteBookById = (id: number) =>
    request({
        url: `/book/delete/${id}`,
        method: 'delete'
    })

// 分页查询书籍
export const getBookByPage = (current: number, limit: number, condition?: BookFilterType) =>
    request({
        url: `/book/${current}/${limit}`,
        method: 'post',
        data: condition
    })

// 根据书名查询书籍
export const getBookByKeywords = (bookName: string) =>
    request({
        url: '/book/select',
        method: 'post',
        data: {
            bookName
        }
    })

// 导出排行榜
export const outputRankSales = () =>
    request({
        url: '/book/download',
        responseType: 'blob'
    })
