<template>
    <n-button @click="openAddDialog">
        <template #icon>
            <n-icon><AppsAddIn24Filled /></n-icon>
        </template>
    </n-button>
    <n-input
        placeholder="搜索"
        autosize
        style="min-width: 50%"
        v-model:value="searchAdminId"
        @change="searchAdmin"
    >
        <template #prefix>
            <n-icon :component="IosSearch" />
        </template>
    </n-input>

    <n-data-table
        :columns="columns"
        :data="adminList"
        :pagination="pagination"
        style="margin-top: 20px"
    />
    <!-- 编辑 -->
    <n-modal
        v-model:show="showAddModal"
        :mask-closable="false"
        preset="dialog"
        title="添加"
        positive-text="确认"
        negative-text="算了"
        @positive-click="handleConfirmAdd"
        @negative-click="showAddModal = false"
    >
        <n-form :model="addAdminForm">
            <n-form-item label="管理员">
                <n-input v-model:value="addAdminForm.name" />
            </n-form-item>
            <n-form-item label="密码">
                <n-input
                    type="password"
                    show-password-on="click"
                    v-model:value="addAdminForm.passwd"
                />
            </n-form-item>
            <n-form-item label="权限列表">
                <n-checkbox-group
                    :value="addAdminForm.permissionList"
                    @update:value="handleAddPermission"
                >
                    <n-space item-style="display: flex;" align="center">
                        <template v-for="(auth, index) in authList" :key="index">
                            <n-checkbox :value="auth" :label="parsePermissionToCn(auth)" />
                        </template>
                    </n-space>
                </n-checkbox-group>
            </n-form-item>
        </n-form>
    </n-modal>
    <!-- 编辑 -->
    <n-modal
        v-model:show="showEditModal"
        :mask-closable="false"
        preset="dialog"
        title="编辑"
        positive-text="确认"
        negative-text="算了"
        @positive-click="handleConfirmEdit"
        @negative-click="showEditModal = false"
    >
        <n-form :model="editAdminForm">
            <n-form-item label="管理员">
                <n-input v-model:value="editAdminForm.name" />
            </n-form-item>
            <n-form-item label="密码">
                <n-input
                    type="password"
                    show-password-on="click"
                    v-model:value="editAdminForm.passwd"
                />
            </n-form-item>
            <n-form-item label="权限列表">
                <n-checkbox-group
                    :value="editAdminForm.permissionList"
                    @update:value="handleUpdatePermission"
                >
                    <n-space item-style="display: flex;" align="center">
                        <template v-for="(auth, index) in authList" :key="index">
                            <n-checkbox :value="auth" :label="parsePermissionToCn(auth)" />
                        </template>
                    </n-space>
                </n-checkbox-group>
            </n-form-item>
        </n-form>
    </n-modal>
    <!-- 删除 -->
</template>

<script setup lang="ts">
import { NText, type DataTableColumns } from 'naive-ui'
import { NButton, useMessage, useDialog, NCheckboxGroup } from 'naive-ui'
import { AppsAddIn24Filled } from '@vicons/fluent'
import { IosSearch } from '@vicons/ionicons4'
import type { AdminFormType, AdminItem } from '@/types'
import { checkCode } from '@/utils'
import { addAdmin, deleteAdmin, queryAdminById, queryAllAdmin, updateAdmin } from '@/api/admin'

const message = useMessage()
const dialog = useDialog()
const pagination = {
    pageSize: 5
}

const adminList = reactive<AdminItem[]>([])
const getAdminList = async () => {
    const res = await queryAllAdmin()
    if (checkCode((res as any).code) === 200) {
        adminList.length = 0
        adminList.push(...res.data)
        // console.log(adminList)
    }
}
getAdminList()

// 权限列表
const authList = ref<string[]>([
    'BackstageOrder',
    'BackstageProduct',
    'BackstageAnnouncement',
    'BackstageUserFront',
    'BackstageUserBackstage'
])
const permissionObj: any = {
    BackstageHome: '首页',
    BackstageOrder: '订单管理',
    BackstageProduct: '商品管理',
    BackstageAnnouncement: '公告管理',
    BackstageUserFront: '用户列表',
    BackstageUserBackstage: '管理员列表'
}
// 将权限列表转为中文
const parsePermissionToCn = (permission: string) => permissionObj[permission]

const searchAdminId = ref('')
const searchAdmin = async () => {
    if (searchAdminId.value.trim() === '') {
        getAdminList()
    } else {
        try {
            const res = await queryAdminById(Number(searchAdminId.value))
            const code = checkCode((res as any).code)
            if (code === 200 && res.data != null) {
                adminList.length = 0
                adminList.push(res.data)
            } else {
                adminList.length = 0
                message.warning('未查找到相关信息')
            }
        } catch (e) {
            message.warning('未查找到相关信息')
            return e
        }
    }
}

// 添加
const showAddModal = ref(false)
const addAdminForm = ref<AdminFormType>({
    name: '',
    passwd: '',
    permissionList: []
})
const openAddDialog = () => {
    showAddModal.value = true
    addAdminForm.value.name = ''
    addAdminForm.value.passwd = ''
    addAdminForm.value.permissionList.length = 0
}
const handleAddPermission = (value: (string | number)[]) => {
    addAdminForm.value.permissionList = value as string[]
}
// 确认添加
const handleConfirmAdd = async () => {
    const res = await addAdmin(addAdminForm.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        getAdminList()
        message.success('管理员添加成功')
    } else {
        message.warning('管理员添加失败')
    }
}

// 编辑
const showEditModal = ref(false)
const editAdminForm = ref<AdminFormType>({
    name: '',
    passwd: '',
    permissionList: []
})
const openEditDialog = async (row: AdminItem) => {
    showEditModal.value = true
    const res = await queryAdminById(row.id)
    const code = checkCode((res as any).code)
    if (code === 200) {
        editAdminForm.value = { ...res.data }
        // console.log(editAdminForm.value)
    }
}
// 切换权限列表选中项
const handleUpdatePermission = (value: (string | number)[]) => {
    editAdminForm.value.permissionList = value as string[]
}
// 确认编辑
const handleConfirmEdit = async () => {
    const res = await updateAdmin(editAdminForm.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        getAdminList()
        message.success('管理员信息修改成功')
    } else {
        message.warning('管理员信息修改失败')
    }
}

// 删除
const openDeleteDialog = async (row: AdminItem) => {
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
            const res = await deleteAdmin(row.id)
            const code = checkCode((res as any).code)
            if (code === 200) {
                getAdminList()
                message.success('删除管理员成功')
            } else {
                message.warning('删除管理员失败')
            }
        }
    })
}

// 表格初始化
const actionList = [
    {
        label: '编辑',
        eventName: openEditDialog
    },
    {
        label: '删除',
        eventName: openDeleteDialog
    }
]
const createColumns = (): DataTableColumns<AdminItem> => {
    return [
        {
            title: '序号',
            key: 'id'
        },
        {
            title: '管理员',
            key: 'name'
        },
        {
            title: '权限列表',
            key: '',
            render({ permissionList }) {
                const permission = permissionList.map((auth: string) => {
                    return h(
                        NText,
                        {},
                        {
                            default: () => ` ${parsePermissionToCn(auth)} `
                        }
                    )
                })
                return permission
            }
        },
        {
            title: '操作',
            key: '',
            render(row) {
                const btns = actionList.map((btn) => {
                    return h(
                        NButton,
                        {
                            size: 'small',
                            onClick: () => btn.eventName(row)
                        },
                        { default: () => btn.label }
                    )
                })
                return btns
            }
        }
    ]
}
const columns = createColumns()
</script>

<style scoped></style>
