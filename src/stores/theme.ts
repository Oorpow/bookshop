import { defineStore } from 'pinia'
import type { GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'

export const useThemeStore = defineStore({
    id: 'theme',
    state: () => ({
        theme: null as (GlobalTheme | null)  
    }),
    persist: {
        enabled: true,
        strategies: [
            { storage: localStorage, paths: ['theme'] }
        ]
    },
    getters: {
        getTheme: state => state.theme
    },
    actions: {
        changeTheme() {
            if (this.theme == null) {
                this.theme = darkTheme
            } else {
                this.theme = null
            }
        }
    }
})