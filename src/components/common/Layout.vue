<template>
    <n-config-provider :theme="store.theme">
        <div class="layoutMain">
            <n-layout has-sider>
                <SideBar />
                <n-layout>
                    <AdminHeader />
                    <n-layout-content content-style="padding: 24px;">
                        <n-dialog-provider>
                            <RouterView />
                        </n-dialog-provider>
                    </n-layout-content>
                </n-layout>
            </n-layout>
        </div>
        <n-global-style />
    </n-config-provider>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/common/AdminHeader.vue'
import SideBar from '@/components/common/SideBar.vue'
import { useThemeStore } from '@/stores/theme'

const store = useThemeStore()
</script>

<style scoped lang="less"></style>
