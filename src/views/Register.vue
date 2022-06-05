<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="content">
            <n-form
                :model="registerForm"
                label-position="top"
                ref="registerFormRef"
                label-width="100px"
                class="registerForm"
                :rules="rules"
            >
                <n-form-item label="用户名" path="uname">
                    <n-input v-model:value="registerForm.uname"></n-input>
                </n-form-item>
                <n-form-item label="密码" path="passwd">
                    <n-input v-model:value="registerForm.passwd" type="password"></n-input>
                </n-form-item>
                <n-form-item path="nickname" label="昵称">
                    <n-input v-model:value="registerForm.nickname" />
                </n-form-item>
                <n-form-item path="portrait" label="头像">
                    <n-upload action="http://192.168.199.138/upload" @finish="uploadFinish">
                        <n-button>上传文件</n-button>
                    </n-upload>
                </n-form-item>
                <n-form-item label="联系电话" path="phone">
                    <n-input v-model:value="registerForm.phone"></n-input>
                </n-form-item>
                <n-form-item label="性别" path="sex">
                    <n-radio-group v-model:value="registerForm.sex" name="radiogroup">
                        <n-space>
                            <n-radio value="male">男</n-radio>
                            <n-radio value="female">女</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="收件人" path="cargoName">
                    <n-input v-model:value="registerForm.cargoName" />
                </n-form-item>
                <n-form-item label="收件号码" path="cargoPhone">
                    <n-input v-model:value="registerForm.cargoPhone" />
                </n-form-item>
                <n-form-item label="收件地址" path="cargoAddress">
                    <n-input v-model:value="registerForm.cargoAddress" />
                </n-form-item>
                <n-form-item>
                    <n-button
                        @click="handleValidateClick"
                        text-color="#fff"
                        color="#4f46e5"
                        round
                        style="width: 100%"
                        >注册</n-button
                    >
                </n-form-item>
            </n-form>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { FormInst, FormRules, GlobalThemeOverrides, UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { checkCode } from '@/utils'
import { userRegister } from '@/api/user'
import type { IRegisteForm } from '@/types'

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
}
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .registerForm {
        width: 480px;
        padding: 10px 40px;
        background: #fff;
        margin: 40px 0;
        border-radius: 10px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
}
</style>
