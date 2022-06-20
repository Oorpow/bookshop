import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { userLogin } from '@/api/user'
import type { ILoginForm, IUserInfo } from '@/types'
import { checkCode } from '@/utils'

export const useLoginStore = defineStore({
    id: 'login',
    state: () => ({
        token: ref(''),
        userInfo: reactive<IUserInfo>({
            deleted: 0,
            createTime: 0,
            updateTime: 0,
            id: 0,
            uname: '',
            passwd: '',
            phone: '',
            sex: '',
            nickname: '',
            portrait: '',
            cargoName: '',
            cargoPhone: '',
            cargoAddress: ''
        })
    }),
    // 持久化
    persist: {
        enabled: true,
        strategies: [{ key: 'user', storage: localStorage, paths: ['userInfo'] }]
    },
    getters: {
        getToken: (state) => state.token,
        getUserInfo: (state) => state.userInfo
    },
    actions: {
        // 前台登录
        async login(loginForm: ILoginForm): Promise<boolean> {
            const res = await userLogin(loginForm)
            const code = checkCode((res as any).code)
            if (code === 200) {
                this.userInfo = res.data
                localStorage.setItem('user', JSON.stringify(res.data))
                return true
            } else {
                return false
            }
        },
        clearUserInfo() {
            localStorage.removeItem('user')
            localStorage.removeItem('admin')
            Cookies.remove('token')
        }
    }
})
