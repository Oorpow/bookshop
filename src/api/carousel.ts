import type { CarouselForm } from '@/types'
import request from './request'

// 查询全部轮播图
export const getCarouselList = () =>
    request({
        url: '/carousel/selectAll'
    })

// 根据ID查询轮播图
export const getCarouselById = (id: number) =>
    request({
        url: `/carousel/select/${id}`
    })

// 添加轮播
export const addCarousel = (carouselForm: CarouselForm) =>
    request({
        url: '/carousel/addCarousel',
        method: 'post',
        data: carouselForm
    })

// 修改轮播
export const editCarousel = (carouselForm: CarouselForm) =>
    request({
        url: '/carousel/updateCarousel',
        method: 'put',
        data: carouselForm
    })
// 删除轮播
export const deleteCarouselById = (id: number) =>
    request({
        url: `/carousel/deleteCarousel/${id}`,
        method: 'delete'
    })
