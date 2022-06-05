<template>
    <header>
        <span class="avatar">LOGO</span>
        <div class="login">
            <router-link to="/home">首页</router-link>
            <router-link to="/">登录</router-link>
            <router-link to="/register">注册</router-link>
        </div>
    </header>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #111828;
    padding: 10px 2.5%;
    .avatar {
        color: #e5e8ee;
    }
    .login {
        a {
            background: transparent;
            outline: none;
            color: #e5e8ee;
            font-size: 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin: 0 20px;
            opacity: 0.6;
            &:nth-child(2) {
                margin: 0;
            }
            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>