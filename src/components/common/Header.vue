<template>
    <header>
        <span class='avatar'>LOGO</span>
        <div class='login'>
            <router-link to='/home'>Home</router-link>
            <router-link to='/'>Login</router-link>
            <router-link to='/register'>Register</router-link>
        </div>
        <div class='dropDown'>
            <n-dropdown
                :options='options'
                placement='bottom-start'
                trigger='click'
                :show-arrow='true'
                size='huge'
                @select='handleSelect'
            >
                <n-icon :component='MenuSharp' size='40' color='#fff' />
            </n-dropdown>
        </div>
    </header>
</template>

<script setup lang='ts'>
import { MenuSharp } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

const router = useRouter()
const options = [
    {
        label: 'Home',
        key: 'home'
    },
    {
        label: 'Register',
        key: 'register'
    },
    {
        label: 'Login',
        key: '/'
    }]

function handleSelect(key: string) {
    router.push({ path: key })
}
</script>

<style scoped lang='less'>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #111828;
    padding: 10px 30px;

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

    .dropDown {
        display: none;
    }
}

@media screen and (max-width: 768px) {
    header {
        .login {
            display: none;
        }

        .dropDown {
            display: block;
        }
    }
}
</style>