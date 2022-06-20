export interface ILoginForm {
    uname: string
    passwd: string
}

export interface IRegisteForm {
    uname: string
    passwd: string
    phone?: string
    sex?: string
    nickname: string
    portrait?: string
    cargoName?: string
    cargoPhone?: string
    cargoAddress?: string
}

export interface IBookItem {
    bookDescription: string
    bookImg: string
    bookName: string
    bookPrice: number
    bookSales: number
    bookStock: number
    createTime: number
    deleted: number
    id: number
    updateTime: number
}

export interface IAddBook {
    bookImg: string
    bookName: string
    bookPrice: number
    bookStock: number
    bookDescription: string
    bookSales?: number
}

export type NewBookFormType = {
    id: string
    bookName: string
    bookImg: string
    bookPrice: string
    bookStock: string
    bookSales: string
    bookDescription: string
}

// 书籍过滤
export type BookFilterType = {
    bookName?: string
    bookPriceBegin?: number
    bookPriceEnd?: number
    bookStock?: number
    bookSales?: number
    bookDescription?: string
}

export interface IUserInfo {
    deleted?: number
    createTime?: number
    updateTime?: number
    id: number
    uname: string
    passwd: string
    phone?: string
    sex?: string
    nickname: string
    portrait?: string
    cargoName?: string
    cargoPhone?: string
    cargoAddress?: string
}

export interface ICartItem {
    deleted: number
    createTime: number
    updateTime: number
    id: number
    bookName: string
    bookImg: string
    bookPrice: number
    bookStock: number
    bookSales: number
    bookDescription: string
    bookNumber: number
}

export type ICreateBookList = {
    id: number
}

export type ICreateOrder = {
    bookList: Array<ICreateBookList>
    bookNumber: number[]
}

export type ICargo = {
    cargoName: string
    cargoPhone: string
    cargoAddress: string
}

export type IOrderItem = {
    bookList: Array<IBookItem>
    bookNumber: Array<number>
    isPay: number
    orderSerial: string
    payTime?: string
}

export type Admin = {
    createTime?: string
    deleted?: number
    id: number
    name: string
    passwd: string
    updateTime?: string
}

export type Announcement = {
    admin: Admin
    createTime?: string
    deleted?: number
    updateTime: number
    details: string
    id: number
    title: string
}

export type AnnouncementItem = {
    id?: number
    title: string
    details: string
}

export type AdminType = {
    name: string
    passwd: string
}

export type AdminItem = {
    id: number
    name: string
    passwd: string
    permissionList: Array<string>
}

export type AdminFormType = {
    id?: number
    name: string
    passwd: string
    permissionList: Array<string>
}

export type BookType = {
    bookDescription: string
    bookImg: string
    bookName: string
    bookNumber: number
    bookPrice: number
    bookSales: number
    bookStock: number
    id: number
}

export type CarouselList = {
    id: number
    title: string | null
    description: string | null
    image: string
}

export type CarouselForm = {
    id?: number
    title?: string | null
    image: string
    description?: string | null
}

export type MailForm = {
    id?: number
    title?: string
    subject: string
    content: string
}
