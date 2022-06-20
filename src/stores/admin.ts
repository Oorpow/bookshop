import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { adminLogin } from '@/api/admin'
import type { AdminType, AdminItem } from '@/types'
import { checkCode } from '@/utils'

export const useAdminLoginStore = defineStore({
    id: 'adminLogin',
    state: () => ({
        backstageToken: ref(''),
        adminInfo: reactive<AdminItem>({
            id: 0,
            name: '',
            passwd: '',
            permissionList: []
        })
    }),
    // 持久化
    persist: {
        enabled: true,
        strategies: [
            { key: 'admin', storage: localStorage, paths: ['backstageToken', 'adminInfo'] },
        ]
    },
    getters: {
        getBackstageToken: (state) => state.backstageToken,
        getAdminInfo: (state) => state.adminInfo
    },
    actions: {
        // 后台登录
        async adminLogin(loginForm: AdminType) {
            const res = await adminLogin(loginForm)
            const code = checkCode((res as any).code)
            if (code === 200) {
                this.adminInfo = res.data
                this.backstageToken = Cookies.get('token') as string
                return true
            } else {
                return false
            }
        },
        clearAdminInfo() {
            localStorage.removeItem('user')
            localStorage.removeItem('admin')
            Cookies.remove('token')
        }
    }
})
