<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="content">
            <n-form
                ref="loginFormRef"
                :label-width="600"
                :model="loginForm"
                :rules="rules"
                class="loginForm"
                size="large"
            >
                <n-form-item label="用户名" path="uname">
                    <n-input v-model:value="loginForm.uname" placeholder="username" clearable />
                </n-form-item>
                <n-form-item label="密码" path="passwd">
                    <n-input
                        v-model:value="loginForm.passwd"
                        placeholder="password"
                        type="password"
                    />
                </n-form-item>
                <n-form-item>
                    <n-button
                        attr-type="button"
                        @click="handleValidateClick"
                        text-color="#fff"
                        color="#4f46e5"
                        bordered
                        strong
                        >登录</n-button
                    >
                </n-form-item>
            </n-form>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import type { FormInst, GlobalThemeOverrides } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useLoginStore } from '@/stores/login'
import { useRouter } from 'vue-router'
import type { ILoginForm } from '@/types'

const themeOverrides: GlobalThemeOverrides = {
    Input: {
        border: '1px solid #ccc',
        borderHover: '1px solid #4f46e5',
        borderFocus: '1px solid #4f46e5'
    },
    Radio: {
        dotColorActive: '#4f46e5'
    }
}

const store = useLoginStore()
const router = useRouter()
const message = useMessage()

const loginFormRef = ref<FormInst | null>(null)
// 表单
let loginForm = reactive<ILoginForm>({
    uname: '',
    passwd: ''
})
// 校验规则
const rules = {
    uname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    passwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 点击登录
const handleValidateClick = (e: MouseEvent) => {
    loginFormRef.value?.validate(async (errors) => {
        if (!errors) {
            const flag = await store.login(loginForm)
            if (flag) {
                router.push({ name: 'home' })
                message.success('登录成功')
            } else {
                message.warning('登录失败，请检查你的用户名或密码是否正确')
            }
        } else {
            message.warning('校验失败')
        }
    })
}
</script>

<style scoped lang="less">
.n-config-provider {
    height: 100%;
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 95%;
        .loginForm {
            display: flex;
            flex-direction: column;
            width: 440px;
            padding: 30px 40px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            .n-form-item {
                .n-input {
                    &:focus {
                        border: 1px solid #000;
                    }
                }
                .n-button {
                    width: 100%;
                    font-size: 20px;
                }
            }
        }
    }
}
</style>
