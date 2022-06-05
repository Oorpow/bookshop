<template>
    <n-input
        placeholder="搜索"
        autosize
        style="min-width: 50%"
        v-model:value="searchOrderSerial"
        @change="searchOrder"
    >
        <template #prefix>
            <n-icon :component="IosSearch" />
        </template>
    </n-input>
    <n-data-table
        :columns="columns"
        :data="orderList"
        :pagination="pagination"
        style="margin-top: 20px"
    />
</template>

<script setup lang="ts">
import { NText, type DataTableColumns } from 'naive-ui'
import { NButton, useMessage, useDialog, NTag } from 'naive-ui'
import { IosSearch } from '@vicons/ionicons4'
import type { IBookItem, IOrderItem } from '@/types'
import { checkCode } from '@/utils'
import { deleteOrderByOrderId, getOrderByOrderId, getOrderListByPage } from '@/api/order'

const message = useMessage()
const dialog = useDialog()

const pagination = {
    pageSize: 5
}

const orderList = reactive<IOrderItem[]>([])
const getOrderList = async () => {
    const res = await getOrderListByPage(1, 10)
    if (checkCode((res as any).code) === 200) {
        orderList.length = 0
        orderList.push(...res.data.records)
    }
}
getOrderList()

const searchOrderSerial = ref('')
const searchOrder = async () => {
    if (searchOrderSerial.value.trim() === '') {
        getOrderList()
    } else {
        const res = await getOrderByOrderId(searchOrderSerial.value)
        if (checkCode((res as any).code) === 200 && res.data != null) {
            orderList.length = 0
            orderList.push(res.data)
        } else {
            orderList.length = 0
            message.warning('未找到相关信息')
        }
    }
}

const createColumns = ({
    handleDelete
}: {
    handleDelete: (row: IOrderItem) => void
}): DataTableColumns<IOrderItem> => {
    return [
        {
            title: '订单编号',
            key: 'orderSerial'
        },
        {
            title: '订单详情',
            key: '',
            render({ bookList, bookNumber }) {
                const info = bookList.map((book: IBookItem, index: number) => {
                    return h(
                        NText,
                        {},
                        {
                            default: () => `${book.bookName} * ${bookNumber[index]}  `
                        }
                    )
                })
                return info
            }
        },
        {
            title: '总价',
            key: '',
            render({ bookList, bookNumber }) {
                bookList.forEach((book: any, index) => {
                    book['bookNum'] = bookNumber[index]
                })
                return h(
                    NText,
                    {},
                    {
                        default: () =>
                            bookList
                                .reduce(
                                    (prev, next: any) => prev + next.bookNum * next.bookPrice,
                                    0
                                )
                                .toFixed(2)
                    }
                )
            }
        },
        {
            title: '支付状态',
            key: 'isPay',
            render(row) {
                return h(
                    NTag,
                    {
                        type: row.isPay === 0 ? 'warning' : 'success'
                    },
                    {
                        default: () => (row.isPay === 0 ? '未支付' : '已支付')
                    }
                )
            }
        },
        {
            title: '操作',
            key: 'orderSerial',
            render(row) {
                return h(
                    NButton,
                    {
                        size: 'small',
                        type: 'error',
                        onClick: () => handleDelete(row)
                    },
                    { default: () => '删除' }
                )
            }
        }
    ]
}
const columns = createColumns({
    // 删除订单
    async handleDelete(row: IOrderItem) {
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
                const res = await deleteOrderByOrderId(row.orderSerial)
                const code = checkCode((res as any).code)
                if (code === 200) {
                    getOrderList()
                    message.success('删除订单成功')
                } else {
                    message.warning('删除订单失败')
                }
            }
        })
    }
})
</script>

<style scoped lang="less"></style>
