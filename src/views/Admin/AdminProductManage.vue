<template>
    <n-button @click="openAddModal">
        <template #icon>
            <n-icon><AppsAddIn24Filled /></n-icon>
        </template>
    </n-button>
    <n-button @click="downloadRankExcel">
        <template #icon>
            <n-icon><ArrowDownload16Filled /></n-icon>
        </template>
    </n-button>
    <n-input
        placeholder="搜索"
        autosize
        style="min-width: 50%"
        v-model:value="searchKeywords"
        @change="searchBook"
    >
        <template #prefix>
            <n-icon :component="IosSearch" />
        </template>
    </n-input>
    <n-data-table
        :columns="columns"
        :data="bookList"
        :pagination="pagination"
        style="margin-top: 20px"
    />
    <!-- 编辑 -->
    <n-modal
        v-model:show="showModal"
        :mask-closable="false"
        preset="dialog"
        title="编辑"
        positive-text="确认"
        negative-text="算了"
        @positive-click="handleConfirm"
        @negative-click="showModal = false"
    >
        <n-form ref="bookFormRef" :model="bookForm" :rules="bookFormRules">
            <n-form-item label="商品名称" path="bookName">
                <n-input v-model:value="bookForm.bookName" />
            </n-form-item>
            <n-form-item label="商品价格" path="bookPrice">
                <n-input v-model:value="bookForm.bookPrice" />
            </n-form-item>
            <n-form-item label="商品库存" path="bookStock">
                <n-input v-model:value="bookForm.bookStock" />
            </n-form-item>
            <n-form-item label="商品实物图">
                <n-upload action="" @finish="editUploadFinish">
                    <n-button>更换图片</n-button>
                </n-upload>
            </n-form-item>
            <n-form-item label="商品描述">
                <n-input
                    type="textarea"
                    placeholder="自动调整尺寸"
                    :autosize="{
                        minRows: 2
                    }"
                    v-model:value="bookForm.bookDescription"
                />
            </n-form-item>
        </n-form>
    </n-modal>
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
        <n-form ref="bookFormRef" :model="addBookForm" :rules="bookFormRules">
            <n-form-item label="商品名称" path="bookName">
                <n-input v-model:value="addBookForm.bookName" />
            </n-form-item>
            <n-form-item label="商品价格" path="bookPrice">
                <n-input v-model:value="addBookForm.bookPrice" />
            </n-form-item>
            <n-form-item label="商品库存" path="bookStock">
                <n-input v-model:value="addBookForm.bookStock" />
            </n-form-item>
            <n-form-item label="商品实物图">
                <n-upload action="" @finish="uploadFinish">
                    <n-button>更换图片</n-button>
                </n-upload>
            </n-form-item>
            <n-form-item label="商品描述">
                <n-input
                    type="textarea"
                    placeholder="自动调整尺寸"
                    :autosize="{
                        minRows: 2
                    }"
                    v-model:value="addBookForm.bookDescription"
                />
            </n-form-item>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import type { DataTableColumns, FormRules, UploadFileInfo } from 'naive-ui'
import { NButton, useMessage, NImage, useDialog } from 'naive-ui'
import { AppsAddIn24Filled, ArrowDownload16Filled } from '@vicons/fluent'
import { IosSearch } from '@vicons/ionicons4'
import {
    bookAdd,
    bookGetList,
    deleteBookById,
    getBookById,
    getBookByKeywords,
    outputRankSales,
    updateBookById
} from '@/api/book'
import type { IAddBook, IBookItem, NewBookFormType } from '@/types'
import { checkCode } from '@/utils'

const message = useMessage()
const dialog = useDialog()

const pagination = {
    pageSize: 5
}

const bookList = reactive<IBookItem[]>([])
const getBookList = async () => {
    const res = await bookGetList()
    const code = checkCode((res as any).code)
    if (code === 200) {
        bookList.length = 0
        bookList.push(...res.data)
    }
}
getBookList()

// 下载
const downloadRankExcel = () => {
    outputRankSales().then((res: any) => {
        let blob = new Blob([res], {
            type: 'application/vnd.ms-excel'
        })
        let filename = 'rank.xlsx'
        // 将blob对象转为一个URL
        var blobURL = window.URL.createObjectURL(blob)
        // 创建一个a标签
        var tempLink = document.createElement('a')
        // 隐藏a标签
        tempLink.style.display = 'none'
        // 设置a标签的href属性为blob对象转化的URL
        tempLink.href = blobURL
        // 给a标签添加下载属性
        tempLink.setAttribute('download', filename)
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank')
        }
        // 将a标签添加到body当中
        document.body.appendChild(tempLink)
        // 启动下载
        tempLink.click()
        // 下载完毕删除a标签
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
    })
}

// 搜索的关键字
const searchKeywords = ref('')
// 查询书籍
const searchBook = async () => {
    if (searchKeywords.value.trim() === '') {
        getBookList()
    } else {
        const res = await getBookByKeywords(searchKeywords.value)
        if (checkCode((res as any).code) === 200) {
            bookList.length = 0
            bookList.push(...res.data)
        }
    }
}

// 显示模态框
const showModal = ref(false)
const bookFormRules: FormRules = {
    bookName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    bookPrice: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
    bookStock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }]
}
const bookForm = ref<NewBookFormType>({
    bookDescription: '',
    bookImg: '',
    bookName: '',
    bookPrice: '',
    bookSales: '',
    bookStock: '',
    id: ''
})
// 打开编辑模态框
const openEditDialog = async (rowData: IBookItem) => {
    showModal.value = true
    const res = await getBookById(rowData.id)
    const code = checkCode((res as any).code)
    if (code === 200) {
        bookForm.value.id = String(res.data.id)
        bookForm.value.bookDescription = res.data.bookDescription
        bookForm.value.bookImg = res.data.bookImg
        bookForm.value.bookPrice = String(res.data.bookPrice)
        bookForm.value.bookStock = String(res.data.bookStock)
        bookForm.value.bookSales = String(res.data.bookSales)
        bookForm.value.bookName = res.data.bookName
    }
}
// 文件上传成功
const uploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    if (res.code === 100) {
        addBookForm.value.bookImg = res.data
    }
}
const editUploadFinish =  ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    if (res.code === 100) {
        bookForm.value.bookImg = res.data
    }
}

// 打开删除提示框
const openDeleteDialog = (rowData: IBookItem) => {
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
            const res = await deleteBookById(rowData.id)
            if (checkCode((res as any).code) === 200) {
                getBookList()
                message.success('成功删除一件商品')
            } else {
                message.warning('删除商品失败')
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
const createColumns = (): DataTableColumns<IBookItem> => {
    return [
        {
            title: '序号',
            key: 'id'
        },
        {
            title: '商品名称',
            key: 'bookName',
            align: 'center'
        },
        {
            title: '商品单价',
            key: 'bookPrice'
        },
        {
            title: '商品销量',
            key: 'bookSales'
        },
        {
            title: '商品库存',
            key: 'bookStock'
        },
        {
            title: '商品描述图',
            key: 'bookImg',
            render(row) {
                return h(NImage, {
                    src: row.bookImg
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

// 确认编辑操作
const handleConfirm = async () => {
    const res = await updateBookById(bookForm.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        message.success('成功修改商品信息')
        getBookList()
    } else {
        message.warning('修改商品信息失败')
    }
}

// 添加商品模态框
const showAddModal = ref(false)
// 添加商品的表单
const addBookForm = ref<IAddBook>({
    bookImg: '',
    bookName: '',
    bookPrice: 0,
    bookStock: 0,
    bookDescription: ''
})
// 打开添加的模态框
const openAddModal = () => {
    showAddModal.value = true
    addBookForm.value.bookImg = ''
    addBookForm.value.bookName = ''
    addBookForm.value.bookPrice = '0' as any
    addBookForm.value.bookStock = '0' as any
    addBookForm.value.bookDescription = ''
    console.log(addBookForm.value)
}
// 添加商品
const handleAdd = async () => {
    const res = await bookAdd(addBookForm.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        getBookList()
        message.success('商品添加成功')
    } else {
        message.warning('商品添加失败')
    }
}
</script>

<style scoped lang="less">
.n-data-table {
    :deep(.n-data-table-td) {
        vertical-align: middle;
        .n-image {
            img {
                width: 80px;
                height: 90px;
            }
        }
    }
}
</style>
