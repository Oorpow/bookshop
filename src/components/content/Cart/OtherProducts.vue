<template>
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
                hoverable
            >
                <template #cover>
                    <img :src="product.bookImg" />
                </template>
                $ {{ product.bookPrice }}
            </n-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IBookItem } from '@/types'
type Props = {
    otherProducts: IBookItem[]
}
defineProps<Props>()
</script>

<style scoped lang="less">
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
        .n-card {
            max-width: 300px;
            margin-top: 20px;
            :deep(.n-card-cover) {
                display: flex;
                justify-content: center;
                padding: 25px 0;
            }
        }
        img {
            width: 150px;
            height: 150px;
        }
    }
}
</style>
