<template>
    <n-layout-header bordered>
        <div class="adminInfo">
            <div class="search">
                <n-icon :component="Search" size="20" :depth="1" />
            </div>
            <n-dropdown :options="options" @select="handleSelect">
                <n-avatar round :size="40"> {{ store.getAdminInfo.name.split('')[0] }}</n-avatar>
            </n-dropdown>
        </div>
    </n-layout-header>
</template>

<script setup lang="ts">
import { type Component, h } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import {
    PersonCircleOutline as UserIcon,
    Pencil as EditIcon,
    LogOutOutline as LogoutIcon
} from '@vicons/ionicons5'
import { useAdminLoginStore } from '@/stores/admin'

const router = useRouter()
const store = useAdminLoginStore()

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
