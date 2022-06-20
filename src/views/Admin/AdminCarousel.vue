<template>
    <n-button @click="openAddModal">
        <template #icon>
            <n-icon><AppsAddIn24Filled /></n-icon>
        </template>
    </n-button>
    <n-data-table
        :columns="columns"
        :data="carouselList"
        :pagination="pagination"
        style="margin-top: 20px"
    />
    <!-- 添加 -->
    <n-modal
        v-model:show="showAddModal"
        :mask-closable="false"
        preset="dialog"
        title="添加"
        positive-text="确认"
        negative-text="算了"
        @positive-click="handleAdd"
        @negative-click="showAddModal = false"
    >
        <n-form ref="bookFormRef" :model="addCarouselForm" :rules="addCarouselFormRules">
            <n-form-item label="标题">
                <n-input v-model:value="addCarouselForm.title" placeholder="请输入标题" />
            </n-form-item>
            <n-form-item label="简图" path="image">
                <n-upload action="" @finish="uploadFinish">
                    <n-button>添加图片</n-button>
                </n-upload>
            </n-form-item>
            <n-form-item label="描述">
                <n-input
                    type="textarea"
                    placeholder="请输入描述信息"
                    :autosize="{
                        minRows: 2
                    }"
                    v-model:value="addCarouselForm.description"
                />
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
        @positive-click="handleEdit"
        @negative-click="showEditModal = false"
    >
        <n-form ref="bookFormRef" :model="editCarouselForm" :rules="addCarouselFormRules">
            <n-form-item label="标题">
                <n-input v-model:value="editCarouselForm.title" placeholder="请输入标题" />
            </n-form-item>
            <n-form-item label="简图" path="image">
                <n-upload action="" @finish="editUploadFinish">
                    <n-button>更换图片</n-button>
                </n-upload>
            </n-form-item>
            <n-form-item label="描述">
                <n-input
                    type="textarea"
                    placeholder="请输入描述信息"
                    :autosize="{
                        minRows: 2
                    }"
                    v-model:value="editCarouselForm.description"
                />
            </n-form-item>
        </n-form>
    </n-modal>

</template>

<script setup lang="ts">
import { NText, type DataTableColumns, type FormRules, type UploadFileInfo } from 'naive-ui'
import { NButton, useMessage, NImage, useDialog } from 'naive-ui'
import { AppsAddIn24Filled, ArrowDownload16Filled } from '@vicons/fluent'
import { IosSearch } from '@vicons/ionicons4'
import type { CarouselList, CarouselForm } from '@/types'
import { checkCode, formatUploadUrl } from '@/utils'
import { getCarouselList, addCarousel, getCarouselById, editCarousel, deleteCarouselById } from '@/api/carousel'

const message = useMessage()
const dialog = useDialog()

const pagination = {
    pageSize: 5
}

const carouselList = ref<CarouselList[]>([])
const getAllCarousel = async () => {
    const res = await getCarouselList()
    const code = checkCode((res as any).code)
    if (code === 200) {
        carouselList.value.length = 0
        carouselList.value.push(...res.data)
    }
}
getAllCarousel()

const showEditModal = ref(false)
const currentEditCarouselId = ref(0)
// 编辑轮播图表单
const editCarouselForm = ref<CarouselForm>({
    image: ''
})
const openEditDialog = async (Carousel: CarouselList) => {
    showEditModal.value = true
    const res = await getCarouselById(Carousel.id)
    const code = checkCode((res as any).code)
    if (code === 200) {
        editCarouselForm.value = res.data
        currentEditCarouselId.value = res.data.id
    }
}
// 编辑轮播图
const handleEdit = async () => {
    // 格式化图片防止将完整路径上传至服务器
    editCarouselForm.value.image = formatUploadUrl(editCarouselForm.value.image)
    const res = await editCarousel(editCarouselForm.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        message.success('编辑成功')
        getAllCarousel()
    } else {
        message.success('编辑失败')
    }
}

// 打开删除提示框
const openDeleteDialog = (rowData: CarouselList) => {
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
            const res = await deleteCarouselById(rowData.id)
            if (checkCode((res as any).code) === 200) {
                getAllCarousel()
                message.success('删除成功')
            } else {
                message.warning('删除失败')
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
const createColumns = (): DataTableColumns<CarouselList> => {
    return [
        {
            title: '序号',
            key: 'id'
        },
        {
            title: '标题',
            key: 'title',
            render(row) {
                return h(
                    NText,
                    {},
                    {
                        default: () => (row.title === null ? '暂无标题' : row.title)
                    }
                )
            }
        },
        {
            title: '描述',
            key: 'description',
            render(row) {
                return h(
                    NText,
                    {},
                    {
                        default: () => (row.description === null ? '暂无内容' : row.description)
                    }
                )
            }
        },
        {
            title: '简图',
            key: 'image',
            render(row) {
                return h(NImage, {
                    src: row.image
                })
            }
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

// 添加商品模态框
const showAddModal = ref(false)
// 添加商品的表单
const addCarouselForm = ref<CarouselForm>({
    image: ''
})
const addCarouselFormRules: FormRules = {
    image: [{ required: true, message: '请选择图片', trigger: 'blur' }]
}

// 文件上传成功
const uploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    if (res.code === 100) {
        addCarouselForm.value.image = res.data
    }
}
// 编辑框的文件上传
const editUploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    if (res.code === 100) {
        editCarouselForm.value.image = res.data
    }
}

// 打开添加的模态框
const openAddModal = () => {
    showAddModal.value = true
    addCarouselForm.value = {
        title: '',
        description: '',
        image: ''
    }
}
// 添加轮播图
const handleAdd = async () => {
    const res = await addCarousel(addCarouselForm.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        message.success('添加成功')
        getAllCarousel()
    } else {
        message.warning('添加失败')
    }
}
</script>

<style scoped lang="less">
.n-data-table {
    :deep(.n-data-table-td) {
        vertical-align: middle;
        .n-image {
            img {
                width: 120px;
                height: 80px;
            }
        }
    }
}
</style>
