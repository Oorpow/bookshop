<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="menuContainer">
            <div class="logo">
                <span>LOGO</span>
            </div>
            <ul>
                <li v-for="(rt, index) in routeList" :key="index">
                    <router-link
                        :to="rt.path"
                        :class="rt.path === currentRoutePath ? 'active' : ''"
                        >{{ rt.title }}</router-link
                    >
                    <div :class="currentRoutePath === rt.path ? 'slideBlock' : ''"></div>
                </li>
            </ul>
            <!-- 已登录 -->
            <div class="userInfo" v-if="store.getUserInfo.uname !== ''">
                <n-dropdown :options="normalOptions" :show-arrow="true" @select="handleSelect">
                    <n-avatar
                        round
                        size="large"
                        :src="getAvatar()"
                        @click="toUserCenter"
                        style="cursor: pointer"
                    />
                </n-dropdown>
            </div>
            <!-- 未登录 -->
            <div class="operator" v-else>
                <div class="operatorItem">
                    <n-icon size="30" @click="toLogin" style="cursor: pointer">
                        <IosLogIn />
                    </n-icon>
                </div>
            </div>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import type { GlobalThemeOverrides } from 'naive-ui'
import { useLoginStore } from '@/stores/login'
import { userLogout } from '@/api/user'
import { IosLogIn } from '@vicons/ionicons4'

const themeOverrides: GlobalThemeOverrides = {
    Button: {
        border: '1px solid #ccc',
        borderHover: '1px solid #4338ca',
        textColorHover: '#4338ca'
    }
}

const router = useRouter()
const route = useRoute()
const store = useLoginStore()

// 下拉菜单配置项
const normalOptions = [
    {
        label: '退出',
        key: 'log-out'
    }
]

// 获取用户头像
const getAvatar = () => {
    if (store.getUserInfo.portrait === '') {
        // 默认头像
        return 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
    }
    return store.getUserInfo.portrait
}

// 路由表
const routeList = reactive([
    { path: '/home', title: '首页' },
    { path: '/products', title: '商品' },
    { path: '/cart', title: '购物车' },
    { path: '/contact', title: '联系我们' }
])

const currentRoutePath = ref<string>('')

// 监听路由变化
watch(
    () => {
        return router.currentRoute.value
    },
    (newVal, oldVal) => {
        currentRoutePath.value = newVal.path
    },
    { immediate: true }
)

// 注销
const handleSelect = async (key: string) => {
    if (key === 'log-out') {
        store.clearUserInfo()
        await userLogout()
        router.push({ name: 'login' })
    }
}

// 登录
const toLogin = () => {
    router.push({ name: 'login' })
}

// 去个人中心
const toUserCenter = () => {
    router.push({ name: 'user' })
}
</script>

<style scoped lang="less">
.menuContainer {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 25px 20px;
    border-bottom: 1px solid #b9b9b9;
    position: fixed;
    z-index: 10;
    top: 0;
    background-color: #fff;
    ul {
        display: flex;
        flex: 1;
        justify-content: center;
        li {
            list-style-type: none;
            text-align: left;
            align-items: center;
            margin: 0 30px;
            position: relative;
            a {
                color: #6b7280;
                font-size: 23px;
                padding: 0 0 23px 0;
                &:hover {
                    color: #4338ca;
                }
            }
            // 下滑块
            .slideBlock {
                width: 25px;
                height: 5px;
                border-radius: 5px;
                position: absolute;
                left: 50%;
                bottom: -15px;
                transition: all 1s;
                background-color: #4338ca;
                transform: translateX(-50%);
            }
            .active {
                font-weight: bold;
            }
        }
    }
    .operator {
        display: flex;
        margin: 0 40px 0 0;
        .operatorItem {
            flex: 1;
            text-align: right;
            a {
                font-size: 20px;
                color: #6b7280;
                padding: 8px 15px;
            }
        }
    }
    .userInfo {
        margin: 0 40px 0 0;
        .drop {
            margin: 0 10px 0 0;
        }
        a {
            background: #4338ca;
            border-radius: 8px;
            font-size: 24px;
            color: #fff;
            padding: 8px 15px;
        }
    }
}
</style>
