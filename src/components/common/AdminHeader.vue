<template>
    <n-layout-header bordered>
        <div class="adminInfo">
            <n-switch v-model:value="isDark" :rail-style="railStyle" @update:value="changeTheme">
                <template #checked-icon>
                    <n-icon :component="WeatherMoon16Filled" />
                </template>
                <template #unchecked-icon>
                    <n-icon :component="WeatherSunny28Regular" />
                </template>
            </n-switch>
            <n-dropdown :options="options" @select="handleSelect">
                <n-avatar round :size="40"> {{ store.getAdminInfo.name.split('')[0] }}</n-avatar>
            </n-dropdown>
        </div>
    </n-layout-header>
</template>

<script setup lang="ts">
import { type Component, type CSSProperties, h } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import {
    PersonCircleOutline as UserIcon,
    Pencil as EditIcon,
    LogOutOutline as LogoutIcon
} from '@vicons/ionicons5'
import { WeatherSunny28Regular, WeatherMoon16Filled } from '@vicons/fluent'
import { useAdminLoginStore } from '@/stores/admin'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const store = useAdminLoginStore()
const themeStore = useThemeStore()

const renderIcon = (icon: Component) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}
const options = [{ label: '退出', key: 0, icon: renderIcon(LogoutIcon) }]
const handleSelect = async (key: number) => {
    if (key === 0) {
        store.clearAdminInfo()
        router.push({ name: 'adminLogin' })
    }
}

// 黑夜模式
type Rail = {
    checked: boolean
}

const railStyle = ({ checked }: Rail) => {
    const style: CSSProperties = {}
    if (checked) {
        style.background = '#2f2f2f'
    }
    return style
}

let isDark = ref(false)
const changeTheme = () => {
    themeStore.changeTheme()
}
</script>

<style scoped lang="less">
.adminInfo {
    width: 95%;
    height: 60px;
    display: flex;
    margin: auto;
    justify-content: space-between;
    align-items: center;
}
</style>
