<template>
    <n-button @click="openAddModal">
        <template #icon>
            <n-icon><AppsAddIn24Filled /></n-icon>
        </template>
    </n-button>
    <n-data-table
        :columns="columns"
        :data="notifyList"
        :pagination="pagination"
        style="margin-top: 20px"
    />
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
        <n-form :model="editNotifyForm">
            <n-form-item label="公告标题">
                <n-input v-model:value="editNotifyForm.title" />
            </n-form-item>
            <n-form-item label="公告内容">
                <n-input
                    type="textarea"
                    v-model:value="editNotifyForm.details"
                    :autosize="{
                        minRows: 2
                    }"
                />
            </n-form-item>
        </n-form>
    </n-modal>
    <!-- 添加 -->
    <n-modal
        v-model:show="showAddModal"
        :mask-closable="false"
        preset="dialog"
        title="编辑"
        positive-text="确认"
        negative-text="算了"
        @positive-click="handleConfirmAdd"
        @negative-click="showAddModal = false"
    >
        <n-form ref="addNotifyFormRef" :model="addNotifyForm" :rules="addNotifyFormRules">
            <n-form-item label="公告标题" path="title">
                <n-input v-model:value="addNotifyForm.title" />
            </n-form-item>
            <n-form-item label="公告内容" path="details">
                <n-input
                    type="textarea"
                    v-model:value="addNotifyForm.details"
                    :autosize="{
                        minRows: 2
                    }"
                />
            </n-form-item>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import { NButton, useMessage, useDialog } from 'naive-ui'
import { AppsAddIn24Filled } from '@vicons/fluent'
import { IosSearch } from '@vicons/ionicons4'
import { checkCode } from '@/utils'
import {
    createAnnouncement,
    deleteAnnouncementById,
    getAnnouncement,
    getAnnouncementById,
    updateAnnouncementById
} from '@/api/announcement'
import type { Announcement, AnnouncementItem } from '@/types'

const message = useMessage()
const dialog = useDialog()

const pagination = {
    pageSize: 5
}
// 公告列表
const notifyList = reactive<Announcement[]>([])
const getNotifyList = async () => {
    const res = await getAnnouncement()
    notifyList.length = 0
    notifyList.push(...res.data)
    notifyList.forEach((notify: Announcement) => {
        notify.updateTime = dayjs(notify.updateTime).format('MM/DD') as any
    })
}
getNotifyList()

const showEditModal = ref(false)
// 编辑公告的表单
const editNotifyForm = reactive<AnnouncementItem>({
    title: '',
    details: ''
})
// 打开编辑对话框
const openEditDialog = async (rowData: Announcement) => {
    showEditModal.value = true
    const res = await getAnnouncementById(rowData.id)
    editNotifyForm.id = rowData.id
    editNotifyForm.title = res.data.title
    editNotifyForm.details = res.data.details
}
// 确认编辑
const handleConfirmEdit = async () => {
    const res = await updateAnnouncementById(editNotifyForm)
    const code = checkCode((res as any).code)
    if (code === 200) {
        getNotifyList()
        message.success('编辑成功')
    } else {
        message.warning('编辑失败')
    }
}

const showAddModal = ref(false)
const addNotifyFormRef = ref<FormInst | null>(null)
const addNotifyForm = reactive<AnnouncementItem>({
    title: '',
    details: ''
})
const addNotifyFormRules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    details: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}
const openAddModal = () => {
    showAddModal.value = true
    addNotifyForm.title = ''
    addNotifyForm.details = ''
}
// 添加
const handleConfirmAdd = () => {
    addNotifyFormRef.value?.validate(async (errors) => {
        if (!errors) {
            const res = await createAnnouncement(addNotifyForm)
            const code = checkCode((res as any).code)
            if (code === 200) {
                getNotifyList()
                message.success('成功添加公告')
            } else {
                message.error('添加公告失败')
            }
        } else {
            message.error('验证失败')
        }
    })
}

// 删除
const openDeleteDialog = (rowData: Announcement) => {
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
            const res = await deleteAnnouncementById(rowData.id)
            if (checkCode((res as any).code) === 200) {
                getNotifyList()
                message.success('成功删除一条公告')
            } else {
                message.warning('删除公告失败')
            }
        }
    })
}

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
const createColumns = (): DataTableColumns<Announcement> => {
    return [
        {
            title: '序号',
            key: 'index'
        },
        {
            title: '公告标题',
            key: 'title'
        },
        {
            title: '公告内容',
            key: 'details'
        },
        {
            title: '发布者',
            key: 'admin.name'
        },
        {
            title: '发布时间',
            key: `updateTime`
        },
        {
            title: '操作',
            key: 'id',
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
