<template>
    <n-data-table
        :columns="columns"
        :data="userList"
        :pagination="pagination"
        style="margin-top: 20px"
    />
</template>

<script setup lang="ts">
import { NAvatar, type DataTableColumns } from 'naive-ui'
import { NButton, useMessage, useDialog } from 'naive-ui'
import { AppsAddIn24Filled } from '@vicons/fluent'
import { IosSearch } from '@vicons/ionicons4'
import type { IUserInfo } from '@/types'
import { checkCode } from '@/utils'
import { deleteUserById, getAllUser } from '@/api/user'

const message = useMessage()
const dialog = useDialog()
const pagination = {
    pageSize: 5
}

const userList = reactive<IUserInfo[]>([])
const getUserList = async () => {
    const res = await getAllUser()
    userList.length = 0
    userList.push(...res.data)
}
getUserList()

const createColumns = ({
    handleDelete
}: {
    handleDelete: (row: IUserInfo) => void
}): DataTableColumns<IUserInfo> => {
    return [
        {
            title: '序号',
            key: 'id'
        },
        {
            title: '用户名',
            key: 'uname'
        },
        {
            title: '用户昵称',
            key: 'nickname'
        },
        {
            title: '用户头像',
            key: 'portrait',
            render(row: IUserInfo) {
                return h(NAvatar, {
                    src: row.portrait,
                    round: true,
                    size: 60
                })
            }
        },
        {
            title: '操作',
            key: 'id',
            render(row: IUserInfo) {
                return h(
                    NButton,
                    {
                        size: 'small',
                        onClick: () => handleDelete(row)
                    },
                    { default: () => '删除' }
                )
            }
        }
    ]
}
const columns = createColumns({
    // 删除用户
    async handleDelete(row: IUserInfo) {
        dialog.warning({
            title: '删除',
            content: '你确定？',
            positiveText: '确定',
            negativeText: '不确定',
            maskClosable: false,
            onMaskClick: () => {
                message.success('不能关闭')
            },
            onPositiveClick: async () => {
                const res = await deleteUserById(row.id)
                const code = checkCode((res as any).code)
                if (code === 200) {
                    getUserList()
                    message.success('删除用户成功')
                } else {
                    message.warning('删除用户失败')
                }
            }
        })
    }
})
</script>

<style scoped lang="less">
.n-data-table {
    :deep(.n-data-table-td) {
        vertical-align: middle;
    }
}
</style>
