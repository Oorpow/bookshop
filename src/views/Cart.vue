<template>
    <div class="cartContainer">
        <div class="shoppingCart">
            <h1 class="cartTitle">购物车</h1>

            <div class="cartContent">
                <template v-if="cartList.length > 0">
                    <!-- 收货信息 -->
                    <div class="cargoInfo">
                        <n-card title="收货信息" hoverable>
                            <n-form :model="cargoForm" ref="cargoFormRef" :rules="cargoFormRules">
                                <n-form-item label="收件人" path="cargoName">
                                    <n-input
                                        v-model:value="cargoForm.cargoName"
                                        placeholder="姓名"
                                    />
                                </n-form-item>
                                <n-form-item label="联系电话" path="cargoPhone">
                                    <n-input
                                        v-model:value="cargoForm.cargoPhone"
                                        placeholder="联系电话"
                                    />
                                </n-form-item>
                                <n-form-item label="收货地址" path="cargoAddress">
                                    <n-input
                                        v-model:value="cargoForm.cargoAddress"
                                        placeholder="地址"
                                    />
                                </n-form-item>
                            </n-form>
                            <template #footer>
                                <a href="#" class="checkout" @click.prevent="submitCargoInfo"
                                    >确认</a
                                >
                            </template>
                        </n-card>
                    </div>
                    <!-- 购物车列表 -->
                    <div class="cartList">
                        <!-- 存在商品 -->
                        <div
                            class="productItem"
                            v-if="cartList.length > 0"
                            v-for="(cart, index) in cartList"
                            :key="cart.id"
                        >
                            <div class="productItemImg">
                                <img :src="cart.bookImg" />
                            </div>
                            <div class="productItemContent">
                                <!-- 商品详情信息 -->
                                <div class="productItemInfo">
                                    <div class="info">
                                        <span class="productName">{{ cart.bookName }}</span>
                                        <span class="price">$ {{ cart.bookPrice }}</span>
                                    </div>
                                    <div class="tag">
                                        <n-icon size="30" color="#0e7a0d">
                                            <ArrowBackCircleSharp />
                                        </n-icon>
                                        <span>In stock</span>
                                    </div>
                                </div>
                                <!-- 加减商品数量 -->
                                <n-select
                                    style="width: 25%"
                                    :placeholder="String(cart.bookNumber)"
                                    :options="options"
                                    @update:value="updateBookNum"
                                    @focus="handleFocus(String(cart.id))"
                                />
                            </div>
                            <div class="close">
                                <n-popconfirm
                                    @positive-click="handleDelete(cart.id)"
                                    @negative-click="handleNegativeClick"
                                >
                                    <template #trigger>
                                        <n-icon size="30" color="#4338ca">
                                            <DeleteOff20Filled />
                                        </n-icon>
                                    </template>
                                    确定要删除这件商品吗?
                                </n-popconfirm>
                            </div>
                        </div>
                        <!-- 结算 -->
                        <div class="settle">
                            <div class="amount">
                                <div class="amountItem">
                                    <span>小计</span>
                                    <span id="subTotal">${{ total.toFixed(2) }}</span>
                                </div>
                                <div class="amountItem">
                                    <span>运费</span>
                                    <span>$00.00</span>
                                </div>
                                <div class="amountItem">
                                    <span>税收</span>
                                    <span>$00.00</span>
                                </div>
                                <div class="totalPrice">
                                    <span>合计</span>
                                    $
                                    <n-number-animation
                                        ref="numberAnimationInstRef"
                                        :from="0"
                                        :to="total"
                                        :precision="2"
                                    />
                                </div>
                                <a href="#" class="checkout" @click.prevent="handlePlaceAnOrder"
                                    >结算</a
                                >
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 无商品的情况下 -->
                <template v-else>
                    <div class="emptyBlock">
                        <n-empty size="large" description="购物车是空的，请添加商品"> </n-empty>
                    </div>
                </template>
            </div>

            <!-- 其它商品 -->
            <div class="others">
                <div class="title">
                    <h3>猜你喜欢</h3>
                </div>
                <div class="booksListContent">
                    <n-card
                        :title="product.bookName"
                        v-for="product in otherProducts"
                        :key="product.id"
                    >
                        <template #cover>
                            <img :src="product.bookImg" />
                        </template>
                        $ {{ product.bookPrice }}
                    </n-card>
                </div>
            </div>
        </div>
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
            <span>总金额: {{ total.toFixed(2) }}</span>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type FormInst, useMessage, type FormRules } from 'naive-ui'
import type { NumberAnimationInst } from 'naive-ui'
import { ArrowBackCircleSharp } from '@vicons/ionicons5'
import { DeleteOff20Filled } from '@vicons/fluent'
import { deleteProductById, getUserCart, updateProductNum } from '@/api/cart'
import type { BookType, IBookItem, ICargo, ICreateOrder } from '@/types'
import { checkCode } from '@/utils'
import { bookGetList } from '@/api/book'
import { createOrder, payOrderByOrderId } from '@/api/order'
import { addCargo } from '@/api/user'
import { useLoginStore } from '@/stores/login'

const message = useMessage()
const router = useRouter()
const store = useLoginStore()

let cartList = reactive<BookType[]>([])
let otherProducts = reactive<IBookItem[]>([])

// 获取购物车列表
const getCartList = async () => {
    const res = await getUserCart()
    const code = checkCode((res as any).code)
    cartList.length = 0
    if (code === 200 && res.data != null) {
        cartList.push(...res.data)
    }
}
getCartList()
// 获取其它商品信息
const getOtherProduct = async () => {
    const res = await bookGetList()
    otherProducts.length = 0
    otherProducts.push(...res.data.slice(0, 4))
}
getOtherProduct()

// 收货信息表单
const cargoForm = reactive<ICargo>({
    cargoName: '',
    cargoPhone: '',
    cargoAddress: ''
})
const cargoFormRef = ref<FormInst | null>(null)
const cargoFormRules: FormRules = {
    cargoName: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
    cargoPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
    cargoAddress: [{ required: true, message: '请输入收件地址', trigger: 'blur' }]
}
// 初始化收货信息
const initCargoInfo = () => {
    cargoForm.cargoName = store.getUserInfo.cargoName as string
    cargoForm.cargoPhone = store.getUserInfo.cargoPhone as string
    cargoForm.cargoAddress = store.getUserInfo.cargoAddress as string
}
initCargoInfo()
// 提交收货信息
const submitCargoInfo = () => {
    cargoFormRef.value?.validate(async (errors) => {
        if (!errors) {
            const res = await addCargo(cargoForm)
            const code = checkCode((res as any).code)
            if (code === 200) {
                message.success('成功提交收货信息')
                getCartList()
            } else {
                message.success('提交收货信息失败')
            }
        } else {
            message.error('未通过校验')
        }
    })
}

// 总价
let total = ref(0)
// 总价动画展示
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)
// 计算总价
total = computed<number>(() =>
    cartList.reduce((prev, next) => prev + next.bookPrice * next.bookNumber, 0)
)

// 选中的商品ID
const cartItemId = ref('')
// 下拉选择数量
const options = reactive([
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' }
])
// 聚焦时获取选中的商品ID
const handleFocus = (id: string) => {
    cartItemId.value = id
}
// 改变商品数量
const updateBookNum = async (value: string) => {
    await updateProductNum(cartItemId.value, value)
    numberAnimationInstRef.value?.play()
    getCartList()
}

// 删除商品
const handleDelete = async (id: number) => {
    const res = await deleteProductById(id)
    const code = checkCode((res as any).code)
    if (code === 200) {
        getCartList()
        message.success('删除成功')
    } else {
        message.warning('删除失败')
    }
}
// 取消删除
const handleNegativeClick = () => {
    message.info('已取消删除')
}

// 购物车中的商品清单
const settleList = reactive<ICreateOrder>({
    bookList: [],
    bookNumber: []
})
// 订单ID
const orderSerial = ref('')
// 提交并创建订单
const handlePlaceAnOrder = async () => {
    settleList.bookList.length = 0
    settleList.bookNumber.length = 0
    cartList.forEach((cart: BookType) => {
        settleList.bookList.push({ id: cart.id })
        settleList.bookNumber.push(cart.bookNumber)
    })
    const res = await createOrder(settleList)
    const code = checkCode((res as any).code)
    if (code === 200) {
        orderSerial.value = res.data.orderSerial
        message.success('订单生成成功')
        payModalVisible.value = true
    } else {
        message.warning('请先填写收货地址')
    }
}
// 支付模态框可见性
const payModalVisible = ref(false)
// 取消支付
const cancelPay = () => {}
// 确认支付
const confirmPay = async () => {
    const res = await payOrderByOrderId(orderSerial.value)
    const code = checkCode((res as any).code)
    if (code === 200) {
        message.success('支付成功')
        getCartList()
    } else {
        message.warning('支付失败')
    }
}
</script>

<style scoped lang="less">
.cartContainer {
    margin: 130px 0 0 0;

    .shoppingCart {
        width: 90%;
        margin: 50px auto;

        .cartTitle {
            display: flex;
            font-size: 30px;
            margin-top: 20px;
        }

        .cartContent {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;

            .emptyBlock {
                margin: auto;
            }
            .cargoInfo {
                width: 40%;
                .checkout {
                    background: #4338ca;
                    text-align: center;
                    padding: 10px 20px;
                    border-radius: 6px;
                    color: #fff;
                }
            }

            .cartList {
                width: 50%;
                // margin-top: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 0 15px;

                .productItem {
                    display: flex;
                    justify-content: space-between;
                    padding: 30px 5px;
                    border-top: 1px solid #ccc;
                    &:first-child {
                        border-top: 0;
                    }

                    .productItemImg {
                        width: 200px;
                        height: 200px;
                        // background: rgb(247, 247, 247);
                        cursor: pointer;

                        img {
                            width: 100%;
                            height: 100%;
                            // position: relative;
                            // top: 50%;
                            // left: 50%;
                            // transform: translate(-50%, -50%);
                        }
                    }

                    .productItemContent {
                        display: flex;
                        flex: 1;
                        justify-content: space-around;

                        .productItemInfo {
                            // width: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;

                            .info {
                                display: flex;
                                flex-direction: column;

                                .productName {
                                    width: 70px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    color: #6b7280;
                                    font-weight: bold;
                                }

                                .price {
                                    font-size: 18px;
                                    font-weight: bold;
                                    margin-top: 5px;
                                }
                            }

                            .tag {
                                display: flex;
                                align-items: center;
                            }
                        }

                        .productItemNum {
                            button {
                                width: 30px;
                                height: 30px;
                                border: 1px solid #4338ca;
                                background: none;
                                border-radius: 50%;
                                cursor: pointer;
                            }

                            #increase {
                                background: #4338ca;
                                color: #fff;
                            }

                            #num {
                                width: 30px;
                                height: 30px;
                                border: none;
                                text-align: center;
                                background: none;
                            }
                        }
                    }

                    .close {
                        // width: 160px;
                        text-align: center;

                        .n-icon {
                            cursor: pointer;
                        }
                    }
                }
                .settle {
                    padding: 40px 10px;
                    border-top: 1px solid #ccc;

                    .amount {
                        display: flex;
                        flex-direction: column;

                        .amountItem,
                        .totalPrice {
                            display: flex;
                            justify-content: space-between;
                            margin: 20px 0 0 0;
                            font-weight: bold;
                            padding: 0 0 20px 0;
                            font-size: 17px;
                        }

                        .totalPrice {
                            border: none;
                            font-size: 27px;
                        }

                        .amountItem {
                            span {
                                &:nth-child(1) {
                                    color: #6b7280;
                                }
                            }
                        }

                        .checkout {
                            background: #4338ca;
                            text-align: center;
                            padding: 15px 0;
                            border-radius: 8px;
                            color: #fff;
                        }
                    }
                }
            }
        }

        .others {
            margin: 50px 0;

            .title {
                display: flex;

                h3 {
                    font-size: 28px;
                    padding-bottom: 5px;
                    border-bottom: 3px solid #4338ca;
                }
            }

            .booksListContent {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                margin-top: 10px;
            }
        }
    }
}
.n-card {
    max-width: 300px;
    margin-top: 20px;
}
</style>
