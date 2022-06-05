<template>
    <Header v-if="route.path === '/' || route.path === '/register'" />
    <n-dialog-provider>
        <MeunSearch v-if="isShowHeader()"></MeunSearch>
    </n-dialog-provider>
    <n-message-provider>
        <RouterView />
    </n-message-provider>
    <Footer v-show="isShowFooter()" />
</template>

<script setup lang="ts">
import { useRoute, RouterView } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import MeunSearch from '@/components/common/MenuSearch.vue'

const route = useRoute()

const listNeedHeader = ['/home', '/products', '/cart', '/user']
const listNeedFooter = ['/home', '/products', '/cart', '/user']

const isShowHeader = () => {
    if (listNeedHeader.includes(route.path)) {
        return true
    }
    return false
}
const isShowFooter = () => {
    if (listNeedFooter.includes(route.path)) {
        return true
    }
    return false
}
</script>

<style lang="less">
html,
body,
#app {
    height: 100%;
    font-family: v-sans, v-mono, other-fallbacks;
}
</style>
