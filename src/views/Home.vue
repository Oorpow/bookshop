<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="homeContainer">
            <div class="homeTopContainer">
                <!-- 轮播 -->
                <n-carousel show-arrow autoplay style="width: 50%">
                    <img
                        class="carousel-img"
                        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
                    />
                    <img
                        class="carousel-img"
                        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
                    />
                    <img
                        class="carousel-img"
                        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
                    />
                    <img
                        class="carousel-img"
                        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
                    />
                    <template #arrow="{ prev, next }">
                        <div class="custom-arrow">
                            <button type="button" class="curtom-arrow--left" @click="prev">
                                <n-icon>
                                    <ArrowBack />
                                </n-icon>
                            </button>
                            <button type="button" class="curtom-arrow--right" @click="next">
                                <n-icon>
                                    <ArrowForward />
                                </n-icon>
                            </button>
                        </div>
                    </template>
                    <template #dots="{ total, currentIndex, to }">
                        <ul class="custom-dots">
                            <li
                                v-for="index of total"
                                :key="index"
                                :class="{ ['is-active']: currentIndex === index - 1 }"
                                @click="to(index - 1)"
                            />
                        </ul>
                    </template>
                </n-carousel>
                <n-tabs type="line" size="large" class="userTabs">
                    <n-tab-pane name="oasis" tab="公告">
                        <AnnouncementItem />
                    </n-tab-pane>
                    <n-tab-pane name="the beatles" tab="社区">
                        <n-skeleton text :repeat="15" style="width: 60%" />
                    </n-tab-pane>
                </n-tabs>
            </div>

            <!-- 商品列表 -->
            <div class="bookListContainer">
                <div class="title">
                    <h3>猜你喜欢</h3>
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
import AnnouncementItem from '@/components/content/AnnouncementItem/index.vue'
import { NConfigProvider } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { ArrowBack, ArrowForward } from '@vicons/ionicons5'
import { bookGetList } from '@/api/book'
import type { IBookItem } from '@/types'

const themeOverrides: GlobalThemeOverrides = {
    Tabs: {
        tabTextColorActiveLine: '#4338ca',
        barColor: '#4338ca',
        tabTextColorHoverLine: '#4338ca',
        tabFontWeightActive: '600'
    }
}

// 书籍列表
const booksList = reactive<IBookItem[]>([])

// 获取全部书籍
const getAllProduct = async () => {
    const res = await bookGetList()
    booksList.length = 0
    booksList.push(...res.data)
}
getAllProduct()
</script>

<style scoped lang="less">
.homeContainer {
    width: 100%;
    margin-top: 200px;

    .homeTopContainer {
        width: 90%;
        height: 450px;
        display: flex;
        align-items: self-end;
        margin: auto;
        justify-content: space-between;

        .homeLeftContent {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .title {
                width: 75%;

                h1 {
                    font-size: 80px;
                    font-weight: 900;

                    span {
                        position: relative;
                        top: -25px;
                        font-size: 80px;
                        font-weight: 900;
                        color: #4338ca;
                    }
                }

                .desc {
                    word-break: break-all;
                    color: #6b7280;
                    font-size: 23px;
                }

                .startBtn {
                    display: flex;
                    margin: 30px 0;

                    a {
                        color: #fff;
                        background: #4338ca;
                        padding: 20px 30px;
                        border-radius: 8px;
                    }
                }
            }
        }

        .userTabs {
            width: 40%;
        }
    }

    .bookListContainer {
        width: 90%;
        margin: 150px auto;

        .title {
            display: flex;

            h3 {
                padding: 0 0 10px 0;
                display: flex;
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

            .bookItem {
                margin: 40px 0;

                .itemImg {
                    width: 400px;
                    height: 400px;
                    border-radius: 8px;
                    background: rgb(247, 247, 247);
                    cursor: pointer;

                    img {
                        position: relative;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                }

                .itemDesc {
                    display: flex;
                    flex-direction: column;

                    .bookName {
                        color: #6b7280;
                        margin: 5px 0 0 0;
                    }

                    .price {
                        font-weight: bold;
                        font-size: 20px;
                    }
                }
            }
        }
    }
}

.carousel-img {
    width: 100%;
    height: 600px;
    object-fit: cover;
}

.custom-arrow {
    display: flex;
    position: absolute;
    bottom: 25px;
    right: 10px;
}

.custom-arrow button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 12px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
    border-width: 0;
    border-radius: 8px;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.custom-arrow button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.custom-arrow button:active {
    transform: scale(0.95);
    transform-origin: center;
}

.custom-dots {
    display: flex;
    margin: 0;
    padding: 0;
    position: absolute;
    bottom: 20px;
    left: 20px;
}

.custom-dots li {
    display: inline-block;
    width: 12px;
    height: 4px;
    margin: 0 3px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.4);
    transition: width 0.3s, background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.custom-dots li.is-active {
    width: 40px;
    background: #fff;
}
</style>
