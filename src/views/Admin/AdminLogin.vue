<template>
    <div class="content">
        <n-card class="loginCard" hoverable>
            <n-tabs default-value="signin" size="large" justify-content="space-evenly">
                <n-tab-pane name="signin" tab="后台登录">
                    <n-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
                        <n-form-item-row label="用户名" path="name">
                            <n-input v-model:value="loginForm.name" />
                        </n-form-item-row>
                        <n-form-item-row label="密码" path="passwd">
                            <n-input type="password" v-model:value="loginForm.passwd" />
                        </n-form-item-row>
                    </n-form>
                    <n-button
                        type="success"
                        round
                        style="width: 100%"
                        @click="handleValidateButtonClick"
                    >
                        登录
                    </n-button>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import type { AdminType } from '@/types'
import { useAdminLoginStore } from '@/stores/admin'

const message = useMessage()
const router = useRouter()
const store = useAdminLoginStore()

const loginFormRef = ref<FormInst | null>(null)

// 表单
let loginForm = reactive<AdminType>({
    name: '',
    passwd: ''
})
// 校验规则
const loginFormRules: FormRules = {
    name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    passwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 校验并登录
const handleValidateButtonClick = (e: MouseEvent) => {
    e.preventDefault()
    loginFormRef.value?.validate(async (errors) => {
        if (!errors) {
            const flag = await store.adminLogin(loginForm)
            if (flag) {
                router.push({ name: 'BackstageHome' })
                message.success('登录成功')
            } else {
                message.warning('登录失败')
            }
        } else {
            message.error('校验失败')
        }
    })
}
</script>

<style scoped lang="less">
.content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .loginCard {
        width: 500px;
    }
}
</style>
