<template>
    <div>
        <n-layout has-sider>
            <SideBar />
            <n-layout>
                <!-- <n-layout-header bordered>颐和园路</n-layout-header> -->
                <AdminHeader />
                <n-layout-content content-style="padding: 24px;">
                    <n-dialog-provider>
                        <RouterView />
                    </n-dialog-provider>
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/common/AdminHeader.vue'
import SideBar from '@/components/common/SideBar.vue'
</script>

<style scoped></style>
