<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="productContainer">
            <div class="descTitle">
                <h1>关于 Google 图书</h1>
                <span>找到并发现您感兴趣的新书</span>
                <a href="#">联系我们</a>
            </div>
            <div class="bookListContainer">
                <div class="title">
                    <h3>其他人也在看</h3>
                    <n-input
                        v-model:value="productKeywords"
                        type="text"
                        size="large"
                        placeholder="请输入关键字"
                        @input="handleSearchProduct"
                    />
                </div>
                <div class="booksListContent">
                    <book-item :booksList="booksList"></book-item>
                </div>
            </div>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import BookItem from '@/components/content/BookItem/index.vue'
import _ from 'lodash'
import type { GlobalThemeOverrides } from 'naive-ui'
import type { IBookItem } from '@/types'
import { bookGetList, getBookByBookName } from '@/api/book'

const themeOverrides: GlobalThemeOverrides = {
    Input: {
        borderFocus: '1px solid #4338ca',
        borderHover: '1px solid #4338ca'
    }
}

// 书籍列表
const booksList = reactive<IBookItem[]>([])

// 输入框的值
let productKeywords = ref('')

// 获取商品列表
const getBooksList = async () => {
    const res = await bookGetList()
    booksList.length = 0
    booksList.push(...res.data)
}
getBooksList()

// 搜索
const handleSearchProduct = _.debounce(async () => {
    if (productKeywords.value === '') {
        getBooksList()
    } else {
        const res = await getBookByBookName(productKeywords.value)
        booksList.length = 0
        booksList.push(...res.data)
    }
}, 500)
</script>

<style scoped lang="less">
.productContainer {
    position: relative;
    top: 150px;

    .descTitle {
        display: flex;
        flex-direction: column;
        align-items: center;

        h1 {
            font-size: 50px;
            margin: 0 0 10px 0;
        }

        span {
            color: #6b7280;
            font-size: 25px;
        }

        a {
            display: block;
            margin: 20px 0;
            color: #fff;
            background: #4338ca;
            padding: 15px 30px;
            border-radius: 8px;
        }
    }

    .bookListContainer {
        width: 90%;
        margin: 150px auto;

        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .n-input {
                width: 20%;
            }

            h3 {
                padding: 0 0 10px 0;
                border-bottom: 3px solid #4338ca;
                font-size: 28px;
            }
        }

        .booksListContent {
            display: flex;
            margin: 20px 0;
            justify-content: space-between;
            flex-wrap: wrap;
            &::after {
                content: '';
                width: 48%;
            }
        }
    }
}
</style>
