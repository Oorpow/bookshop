<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="user">
            <div class="user-card">
                <h1>用户中心</h1>
                <n-tabs type="line" size="large" class="userTabs">
                    <n-tab-pane name="oasis" tab="个人信息">
                        <UserInfoCom />
                    </n-tab-pane>
                    <n-tab-pane name="the beatles" tab="所有订单">
                        <OrderInfo />
                    </n-tab-pane>
                </n-tabs>
            </div>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import UserInfoCom from '@/components/content/UserInfo/index.vue'
import OrderInfo from '@/components/content/OrderInfo/index.vue'
import { NConfigProvider } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
    Tabs: {
        tabTextColorActiveLine: '#4338ca',
        barColor: '#4338ca',
        tabTextColorHoverLine: '#4338ca',
        tabFontWeightActive: '600'
    }
}
</script>

<style scoped lang="less">
.user {
    margin: 100px auto;
    &-card {
        width: 90%;
        margin: 150px auto;
        h1 {
            font-size: 25px;
        }
        .userTabs {
            margin-top: 20px;
        }
    }
}
</style>
