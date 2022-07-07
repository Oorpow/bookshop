<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="content">
            <div class='content-form'>
                <div class='content-form-title'>
                    <n-h1>Get started for free</n-h1>
                    <n-h3>Already registered?
                        <router-link to='/' style='color: #4338ca; font-weight: bold;'>Sign in</router-link>
                        to your account.
                    </n-h3>
                </div>
                <n-form
                    :model="registerForm"
                    label-position="top"
                    ref="registerFormRef"
                    label-width="100px"
                    class="registerForm"
                    :rules="rules"
                >
                    <n-form-item label="Username" path="uname">
                        <n-input v-model:value="registerForm.uname"></n-input>
                    </n-form-item>
                    <n-form-item label="Password" path="passwd">
                        <n-input v-model:value="registerForm.passwd" type="password"></n-input>
                    </n-form-item>
                    <n-form-item path="nickname" label="Nickname">
                        <n-input v-model:value="registerForm.nickname" />
                    </n-form-item>
                    <n-form-item path="portrait" label="Portrait">
                        <!-- 服务器地址 -->
                        <n-upload action="" @finish="uploadFinish">
                            <n-button style='font-size: 16px;'>upload</n-button>
                        </n-upload>
                    </n-form-item>
                    <n-form-item label="Telephone" path="phone">
                        <n-input v-model:value="registerForm.phone"></n-input>
                    </n-form-item>
                    <n-form-item label="Sex" path="sex">
                        <n-radio-group v-model:value="registerForm.sex" name="radiogroup">
                            <n-space>
                                <n-radio value="male">male</n-radio>
                                <n-radio value="female">female</n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item label="Recipient" path="cargoName">
                        <n-input v-model:value="registerForm.cargoName" />
                    </n-form-item>
                    <n-form-item label="Phone" path="cargoPhone">
                        <n-input v-model:value="registerForm.cargoPhone" />
                    </n-form-item>
                    <n-form-item label="Shipping Address" path="cargoAddress">
                        <n-input v-model:value="registerForm.cargoAddress" />
                    </n-form-item>
                    <n-form-item>
                        <n-button
                            @click="handleValidateClick"
                            text-color="#fff"
                            color="#4f46e5"
                            round
                            size='large'
                            style="width: 100%"
                        >Sign up
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

<script setup lang="ts">
import LinearGradient from '@/components/common/LinearGradient.vue'
import { useRouter } from 'vue-router'
import type { FormInst, FormRules, GlobalThemeOverrides, UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { checkCode } from '@/utils'
import { userRegister } from '@/api/user'
import type { IRegisteForm } from '@/types'
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

const message = useMessage()
const router = useRouter()

const registerFormRef = ref<FormInst | null>(null)
// 注册表单
const registerForm = ref<IRegisteForm>({
    uname: '',
    passwd: '',
    phone: '',
    nickname: '',
    sex: 'male',
    portrait: '',
    cargoName: '',
    cargoPhone: '',
    cargoAddress: ''
})
// 校验规则
const rules: FormRules = {
    uname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    passwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: 'min 6, max 16' }
    ],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
}

// 文件上传成功
const uploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    if (res.code === 100) {
        registerForm.value.portrait = res.data
    }
}

// 注册
const handleValidateClick = (e: MouseEvent) => {
    registerFormRef.value?.validate(async (errors) => {
        if (!errors) {
            let res = await userRegister(registerForm.value)
            const code = checkCode((res as any).code)
            if (code === 200) {
                message.success('注册成功')
                setTimeout(() => {
                    router.push({
                        name: 'login'
                    })
                }, 500)
            } else {
                message.success('注册失败')
            }
        } else {
            message.error('校验失败')
        }
    })
}
</script>

<style scoped lang="less">
.n-config-provider {
    height: 100%;
    .content {
        display: flex;
        overflow: hidden;
        &-form {
            width: 800px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &-title {
                width: 500px;
                margin: 20px 0;
            }
            .registerForm {
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
//@media screen and (max-width: 1280px){
//    .n-config-provider {
//        height: 100%;
//        .content {
//            height: 100%;
//        }
//    }
//}
@media screen and (max-width: 640px) {
    .n-config-provider {
        .content {
            &-form {
                &-title {
                    width: 80%;
                }
                .registerForm {
                    width: 80%;
                }
            }

        }
    }
}
</style>
