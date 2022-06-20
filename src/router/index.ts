import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
    type NavigationGuardNext,
    type RouteLocationNormalized
} from 'vue-router'
import Layout from '@/components/common/Layout.vue'
import { useAdminLoginStore } from '@/stores/admin'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    // history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('@/views/Login.vue'),
        },
        {
            path: '/index',
            redirect: { name: 'home' }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/Register.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/Home.vue')
        },
        {
            path: '/products',
            name: 'products',
            component: () => import('@/views/Products.vue')
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/Cart.vue'),
            meta: {
                needLogin: true
            }
        },
        {
            path: '/user',
            name: 'user',
            component: () => import('@/views/UserCenter.vue')
        },
        {
            path: '/adminLogin',
            name: 'adminLogin',
            component: () => import('@/views/Admin/AdminLogin.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: Layout,
            redirect: { name: 'BackstageHome' },
            beforeEnter: (to, from, next) => {
                checkAuth(to, next)
            },
            children: [
                {
                    path: 'Home',
                    name: 'BackstageHome',
                    component: () => import('@/views/Admin/AdminHome.vue')
                },
                {
                    path: 'BackstageOrder',
                    name: 'BackstageOrder',
                    component: () => import('@/views/Admin/AdminOrderManage.vue')
                },
                {
                    path: 'BackstageProduct',
                    name: 'BackstageProduct',
                    component: () => import('@/views/Admin/AdminProductManage.vue')
                },
                {
                    path: 'BackstageAnnouncement',
                    name: 'BackstageAnnouncement',
                    component: () => import('@/views/Admin/AdminNotifyManage.vue')
                },
                {
                    path: 'BackstageUserFront',
                    name: 'BackstageUserFront',
                    component: () => import('@/views/Admin/AdminUserFront.vue')
                },
                {
                    path: 'BackstageUserBackstage',
                    name: 'BackstageUserBackstage',
                    component: () => import('@/views/Admin/AdminUserBackstage.vue')
                },
                {
                    path: 'BackstageCarousel',
                    name: 'BackstageCarousel',
                    component: () => import('@/views/Admin/AdminCarousel.vue')
                },
                {
                    path: 'BackstageMail',
                    name: 'BackstageMail',
                    component: () => import('@/views/Admin/AdminMail.vue')
                }
            ]
        },
        {
            path: '/:catchAll(.*)',
            name: 'notFound',
            component: () => import('@/views/NotFound.vue')
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        return { top: 0 }
    }
})

// 检查用户权限
function checkAuth(to: RouteLocationNormalized, next: NavigationGuardNext) {
    const store = useAdminLoginStore()
    // 用户未登录
    if (store.getAdminInfo.name === '') {
        next({ path: '/adminLogin' })
    } else {
        const permissionList = store.getAdminInfo.permissionList
        // 拥有访问权限、或者访问的是首页时放行
        if (permissionList.includes(to.name as string) || to.name === 'BackstageHome') {
            next()
        } else {
            // 若没有权限访问某个页面时，跳回首页
            next({ path: '/admin/Home' })
        }
    }
}

export default router
