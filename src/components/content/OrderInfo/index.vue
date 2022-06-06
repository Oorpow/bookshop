<template>
    <div class="orderInfo">
        <n-scrollbar style="max-height: 600px">
            <n-skeleton v-if="loading" text :repeat="orderList.length" />
            <n-card v-for="order in orderList" :key="order.orderSerial">
                <n-thing>
                    <template #header>订单编号: {{ order.orderSerial }}</template>
                    <template #header-extra>
                        <n-tag :type="order.isPay ? 'success' : 'error'">{{
                            order.isPay ? '已支付' : '未支付'
                        }}</n-tag>
                    </template>
                    <template #description> 商品列表 </template>
                    <div class="bookList">
                        <div class="bookName">
                            <p v-for="(book, index) in order.bookList" :key="book.id">
                                {{ book.bookName }} * {{ order.bookNumber[index] }}
                            </p>
                        </div>
                        <div class="orderPrice">
                            <span
                                >$
                                {{
                            order.bookList.reduce(
                                (prev, next: any) => prev + next.bookPrice * next.bookNum,
                                0
                            ).toFixed(2)
                                }}</span
                            >
                        </div>
                    </div>
                    <template #action>
                        <n-space>
                            <n-button
                                size="small"
                                v-if="!order.isPay"
                                @click="openPayModal(order.orderSerial, order.bookList)"
                            >
                                去支付
                            </n-button>
                        </n-space>
                    </template>
                </n-thing>
            </n-card>
        </n-scrollbar>
    </div>
    <!-- 支付模态框 -->
    <n-modal
        v-model:show="payModalVisible"
        :mask-closable="false"
        preset="dialog"
        title="支付"
        positive-text="支付"
        negative-text="取消"
        @positive-click="confirmPay"
        @negative-click="cancelPay"
    >
        <n-card :bordered="false">
            <div class="orderInfo">
                <span>订单编号：{{ orderSerial }}</span>
            </div>
            <span>总金额: {{ total }}</span>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import { getAllOrder, payOrderByOrderId } from '@/api/order'
import type { ICartItem, IOrderItem } from '@/types'
import { checkCode } from '@/utils'
import { useMessage } from 'naive-ui'

const message = useMessage()
let loading = ref(true)
const orderList = reactive<IOrderItem[]>([])
const getOrderList = async () => {
    const res = await getAllOrder()
    orderList.length = 0
    orderList.push(...res.data)
    orderList.forEach((order: IOrderItem) => {
        order.bookList.forEach((book: any, index: number) => {
            book['bookNum'] = order.bookNumber[index]
        })
    })
    loading.value = false
}
getOrderList()

// 订单编号
const orderSerial = ref('')
const payModalVisible = ref(false)
const total = ref(0)
// 打开支付模态框
const openPayModal = (id: string, list: any[]) => {
    orderSerial.value = id
    payModalVisible.value = true
    total.value = Number(
        list.reduce((prev, next: any) => prev + next.bookPrice * next.bookNum, 0).toFixed(2)
    )
}
// 确认支付
const confirmPay = async () => {
    const res = await payOrderByOrderId(orderSerial.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        getOrderList()
        message.success('支付成功')
    } else {
        message.error('支付失败')
    }
    payModalVisible.value = false
}
// 取消支付
const cancelPay = () => {
    message.info('已取消支付')
}
</script>

<style scoped lang="less">
.orderInfo {
    .bookList {
        display: flex;
        justify-content: space-between;
        .orderPrice {
            span {
                color: #d03050;
            }
        }
    }
}
</style>
