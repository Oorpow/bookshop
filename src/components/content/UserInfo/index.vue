<template>
    <div class="userInfo">
        <n-card
            title="基本信息"
            size="huge"
            :segmented="{
                content: true,
                footer: 'soft'
            }"
        >
            <template #header-extra>
                <div class="userInfo-avatar">
                    <n-avatar round :size="60" :src="userForm.portrait" />
                    <div class="userInfo-time">
                        <span class="uname">{{ userForm.uname }}</span>
                        <span class="creatTime">{{
                            dayjs(userForm.createTime).format('DD/MM/YYYY')
                        }}</span>
                    </div>
                </div>
            </template>

            <n-form ref="userFormRef" :model="userForm" :rules="userFormRules">
                <n-form-item path="uname" label="用户名">
                    <n-input v-model:value="userForm.uname" :disabled="isEdit" />
                </n-form-item>
                <n-form-item path="nickname" label="昵称">
                    <n-input v-model:value="userForm.nickname" :disabled="isEdit" />
                </n-form-item>
                <n-form-item path="passwd" label="密码">
                    <n-input
                        type="password"
                        v-model:value="userForm.passwd"
                        show-password-on="click"
                        :disabled="isEdit"
                    />
                </n-form-item>
                <n-form-item path="portrait" label="头像">
                    <n-upload action="http://192.168.199.138/upload" @finish="uploadFinish">
                        <n-button :disabled="isEdit">上传新头像</n-button>
                    </n-upload>
                </n-form-item>
            </n-form>

            <template #footer>
                <n-button type="primary" @click="isEdit = false">编辑</n-button>
                <n-button type="info" style="margin-left: 10px" @click="editUserInfo"
                    >更新</n-button
                >
            </template>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { getUserInfo, updateUserInfo } from '@/api/user'
import { useMessage } from 'naive-ui'
import type { FormRules, UploadFileInfo } from 'naive-ui'
import type { IUserInfo } from '@/types'
import dayjs from 'dayjs'
import { checkCode } from '@/utils'

const message = useMessage()

const getCurrentUserInfo = async () => {
    const res = await getUserInfo()
    userForm.value = { ...res.data }
}
getCurrentUserInfo()

// 用户信息表单
let userForm = ref<IUserInfo>({
    id: 0,
    uname: '',
    passwd: '',
    nickname: ''
})
const userFormRules: FormRules = {
    uname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    passwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
}

// 是否处于编辑状态
const isEdit = ref(true)
// 文件上传成功
const uploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    if (res.code === 100) {
        userForm.value.portrait = res.data
    }
}
// 更新用户信息
const editUserInfo = async () => {
    const res = await updateUserInfo(userForm.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        getCurrentUserInfo()
        message.success('更新成功')
    } else {
        message.warning('更新失败')
    }
}
</script>

<style scoped lang="less">
.userInfo {
    &-avatar {
        display: flex;
        align-items: center;
    }
    &-time {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .uname {
            font-weight: bold;
            font-size: 22px;
        }
        .createTime {
        }
    }
}
</style>
