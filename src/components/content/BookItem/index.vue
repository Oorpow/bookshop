<template>
    <div class="bookItem" v-for="book in booksList" :key="book.id">
        <div class="itemImg">
            <img :src="book.bookImg" />
        </div>
        <div class="itemDesc">
            <div class="itemDesc-book">
                <span class="bookName">{{ book.bookName }}</span>
                <n-icon size="30" @click="changeCollectStatus(book)" style="cursor: pointer">
                    <StarEmphasis24Filled color="#FCD34D" v-if="(book as any).isCollect" />
                    <StarEmphasis24Regular v-else />
                </n-icon>
            </div>
            <span class="price">$ {{ book.bookPrice }}</span>
            <a class="addToCart" @click.prevent="addToCart(book.id)">加入购物车</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { addProductToCart } from '@/api/cart'
import type { IBookItem, BookType } from '@/types'
import { checkCode } from '@/utils'
import { useMessage } from 'naive-ui'
import { StarEmphasis24Regular, StarEmphasis24Filled } from '@vicons/fluent'
import { getUserCollection, userCancelCollect, userCollect } from '@/api/collect'

type Props = {
    booksList: IBookItem[]
}
defineProps<Props>()

const message = useMessage()

const changeCollectStatus = async (book: IBookItem) => {
    if ((book as any).isCollect) {
        // 取消收藏
        const res = await userCancelCollect(book.id)
        ;(book as any)['isCollect'] = false
        const code = checkCode((res as any).code)
        if (code === 200) {
            message.success('取消收藏成功')
        } else {
            message.warning('取消收藏失败')
        }
    } else {
        // 收藏
        const res = await userCollect(book.id)
        const code = checkCode((res as any).code)
        ;(book as any)['isCollect'] = true
        if (code === 200) {
            message.success('收藏成功')
        } else {
            message.warning('收藏失败')
        }
    }
}

// 添加商品到购物车中
const addToCart = async (id: number) => {
    const res = await addProductToCart(id)
    const code = checkCode((res as any).code)
    code === 200 ? message.success('加入购物车成功') : message.error('加入购物车失败')
}
</script>

<style scoped lang="less">
.bookItem {
    margin: 40px 0;

    .itemImg {
        width: 400px;
        height: 400px;
        border-radius: 8px;
        background: rgb(247, 247, 247);
        cursor: pointer;

        img {
            width: 150px;
            height: 200px;
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .itemDesc {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        overflow: hidden;
        &-book {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .price {
            margin-top: 3px;
            color: #6b7280;
            font-size: 18px;
        }

        .bookName {
            width: 50%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #6b7280;
            font-size: 18px;
        }

        .addToCart {
            margin: 10px 0;
            text-align: center;
            padding: 10px 0;
            border-radius: 8px;
            background: rgb(243, 244, 246);
            color: #111828;
            font-weight: bold;
            transition: all 0.3s;
            font-size: 16px;
            cursor: pointer;

            &:hover {
                background: #4338ca;
                color: #fff;
            }
        }
    }
}
</style>
