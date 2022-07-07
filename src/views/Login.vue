<template>
    <n-config-provider :theme-overrides='themeOverrides'>
        <div class='content'>
            <div class='content-form'>
                <div class='content-form-title'>
                    <n-h1>Sign in to your account</n-h1>
                    <n-h3>Don’t have an account?
                        <router-link to='/register' style='color: #4338ca; font-weight: bold;'>Sign up</router-link>
                        for a free trial
                    </n-h3>
                </div>
                <n-form
                    ref='loginFormRef' :label-width='600' :model='loginForm' :rules='rules' class='loginForm'
                    size='large'
                >
                    <n-form-item label='Username' path='uname'>
                        <n-input v-model:value='loginForm.uname' placeholder='' size='large' clearable />
                    </n-form-item>
                    <n-form-item label='Password' path='passwd'>
                        <n-input
                            v-model:value='loginForm.passwd'
                            type='password'
                            placeholder=''
                            size='large'
                        />
                    </n-form-item>
                    <n-form-item>
                        <n-button
                            attr-type='button'
                            @click='handleValidateClick'
                            text-color='#fff'
                            color='#4f46e5'
                            bordered
                            strong
                            round
                            size='large'
                        >Sign in
                            <n-icon :component='ArrowForward'/>
                        </n-button
                        >
                    </n-form-item>
                </n-form>
            </div>
            <LinearGradient />
        </div>
    </n-config-provider>
</template>

<script setup lang='ts'>
import LinearGradient from '@/components/common/LinearGradient.vue'
import type { FormInst, GlobalThemeOverrides } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useLoginStore } from '@/stores/login'
import { useRouter } from 'vue-router'
import type { ILoginForm } from '@/types'
import { ArrowForward } from '@vicons/ionicons5'

const themeOverrides: GlobalThemeOverrides = {
    Input: {
        border: '1px solid #ccc',
        borderHover: '1px solid #4f46e5',
        borderFocus: '1px solid #4f46e5',
        borderRadius: '6px',
        color: '#f9fafb',
        heightLarge: '45px'
    },
    Radio: {
        dotColorActive: '#4f46e5'
    },
    Button: {
        heightLarge: '50px'
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
    uname: [{ required: true, message: 'Please input username', trigger: 'blur' }],
    passwd: [{ required: true, message: 'Please input password', trigger: 'blur' }]
}

// 点击登录
const handleValidateClick = (e: MouseEvent) => {
    loginFormRef.value?.validate(async (errors) => {
        if (!errors) {
            const flag = await store.login(loginForm)
            if (flag) {
                router.push({ name: 'home' })
                message.success('Login successfully')
            } else {
                message.warning('Login failed，Please check your username or password')
            }
        } else {
            message.warning('check failed')
        }
    })
}
</script>

<style scoped lang='less'>
.n-config-provider {
    .content {
        display: flex;
        height: 100vh;
        overflow: hidden;

        &-form {
            width: 800px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            &-title {
                width: 500px;
            }

            .loginForm {
                display: flex;
                flex-direction: column;
                width: 500px;
                padding: 20px 40px 10px 40px;

                .n-form-item {
                    :deep(.n-form-item-label) {
                        font-size: 18px;
                    }

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
}

@media screen and (max-width: 640px) {
    .n-config-provider {
        .content {
            &-form {
                &-title {
                    width: 80%;
                }
                .loginForm {
                    width: 80%;
                }
            }

        }
    }
}
</style>
