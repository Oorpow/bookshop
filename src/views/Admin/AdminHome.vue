<template>
    <div class="home">
        <div class="admin-welcome">
            <div class="info">
                <div class="info-avatar">
                    <n-avatar round :size="60">{{ store.getAdminInfo.name.slice(0, 1) }}</n-avatar>
                </div>
                <div class="info-name">
                    <span class="adminName">Welcome, {{ store.getAdminInfo.name }}</span>
                    <div class="auth">
                        <n-icon-wrapper :size="18" :border-radius="20">
                            <n-icon :size="13" :component="Checkmark16Filled" />
                        </n-icon-wrapper>
                        <span>已验证</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="overview">
            <h1>概述</h1>
            <div class="overview-main">
                <n-card hoverable style="border-radius: 5px">
                    <div class="plate">
                        <n-icon :size="50" :component="Accessibility28Regular" color="#666" />
                        <div class="plate-info">
                            <p class="title">用户数量</p>
                            <span class="num">{{ userListLength }}</span>
                        </div>
                    </div>
                    <template #action>
                        <n-button> 详情 </n-button>
                    </template>
                </n-card>
                <n-card hoverable style="border-radius: 5px">
                    <div class="plate">
                        <n-icon :size="50" :component="Briefcase24Regular" color="#666" />
                        <div class="plate-info">
                            <p class="title">订单数量</p>
                            <span class="num">{{ orderListLength }}</span>
                        </div>
                    </div>
                    <template #action>
                        <n-button> 详情 </n-button>
                    </template>
                </n-card>
                <n-card hoverable style="border-radius: 5px">
                    <div class="plate">
                        <n-icon :size="50" :component="Backpack48Regular" color="#666" />
                        <div class="plate-info">
                            <p class="title">已上线商品</p>
                            <span class="num">{{ productListLength }}</span>
                        </div>
                    </div>
                    <template #action>
                        <n-button> 详情 </n-button>
                    </template>
                </n-card>
            </div>
        </div>
        <!-- 公告 -->
        <div class="announcement">
            <h1>公告</h1>
            <n-data-table
                :columns="columns"
                :data="notifyList"
                :bordered="false"
                :max-height="250"
                style="margin-top: 20px"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { DataTableColumns } from 'naive-ui'
import {
    Accessibility28Regular,
    Checkmark16Filled,
    Backpack48Regular,
    Briefcase24Regular
} from '@vicons/fluent'
import { getAnnouncement } from '@/api/announcement'
import type { Announcement } from '@/types'
import { getAllUser } from '@/api/user'
import { getOrderListByPage } from '@/api/order'
import { bookGetList } from '@/api/book'
import { useAdminLoginStore } from '@/stores/admin'

const store = useAdminLoginStore()

const userListLength = ref(0)
const orderListLength = ref(0)
const productListLength = ref(0)

const notifyList = reactive<Announcement[]>([])
const getNotifyList = async () => {
    const res = await getAnnouncement()
    const user = await getAllUser()
    const order = await getOrderListByPage(1, 10)
    const book = await bookGetList()
    userListLength.value = user.data.length
    orderListLength.value = order.data.total
    productListLength.value = book.data.length
    notifyList.length = 0
    notifyList.push(...res.data)
    notifyList.forEach((notify: Announcement) => {
        notify.updateTime = dayjs(notify.updateTime).format('MM/DD') as any
    })
}
getNotifyList()

const createColumns = (): DataTableColumns<Announcement> => {
    return [
        {
            title: '主题',
            key: 'title'
        },
        {
            title: '内容',
            key: 'details'
        },
        {
            title: '发布者',
            key: 'admin.name'
        },
        {
            title: '发布时间',
            key: `updateTime`
        }
    ]
}
const columns = createColumns()
</script>

<style scoped lang="less">
.home {
    .admin-welcome {
        .info {
            display: flex;
            align-items: center;
            &-avatar {
            }
            &-name {
                margin-left: 10px;
                .adminName {
                    color: '#000';
                    font-size: 25px;
                    font-weight: bolder;
                }

                .auth {
                    display: flex;
                    align-items: center;
                    margin-top: 8px;
                    span {
                        font-size: 14px;
                        margin: 2px 0 0 5px;
                    }
                }
            }
        }
    }
    .overview {
        margin-top: 40px;
        h1 {
            font-weight: bold;
        }
        &-main {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            .n-card {
                max-width: 32%;
                .plate {
                    display: flex;
                    align-items: center;
                    &-info {
                        margin-left: 10px;
                        .title {
                            font-size: 16px;
                            color: #666;
                        }
                        .num {
                            font-weight: bolder;
                            font-size: 20px;
                        }
                    }
                }
            }
        }
    }
    .announcement {
        margin-top: 50px;
        h1 {
            font-weight: bold;
        }
    }
}
</style>
