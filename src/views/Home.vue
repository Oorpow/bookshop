<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="homeContainer">
            <div class="homeTopContainer">
                <Suspense>
                    <Carousel :carouselList="carouselList"></Carousel>
                    <template #fallback>
                        <LoadingCom :need-num="6" />
                    </template>
                </Suspense>

                <n-tabs type="line" size="large" class="userTabs">
                    <n-tab-pane name="announcement" tab="公告">
                        <KeepAlive>
                            <Suspense>
                                <AnnouncementItem :announcementList="announcementList" />
                                <template #fallback>
                                    <LoadingCom :need-num="6" />
                                </template>
                            </Suspense>
                        </KeepAlive>
                    </n-tab-pane>
                    <n-tab-pane name="community" tab="社区">
                        <n-skeleton text :repeat="18" style="width: 100%" />
                    </n-tab-pane>
                </n-tabs>
            </div>

            <div class="bookListContainer">
                <div class="title">
                    <h3>热销书籍</h3>
                </div>
                <div class="booksListContent">
                    <Suspense>
                        <BookItem :booksList="hotList" />
                        <template #fallback>
                            <LoadingCom :needNum="6" />
                        </template>
                    </Suspense>
                </div>
            </div>

            <!-- 商品列表 -->
            <div class="bookListContainer">
                <div class="title">
                    <h3>猜你喜欢</h3>
                </div>
                <div class="booksListContent">
                    <Suspense>
                        <BookItem :booksList="booksList" />
                        <template #fallback>
                            <LoadingCom :needNum="6" />
                        </template>
                    </Suspense>
                </div>
            </div>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import 'animate.css'
import LoadingCom from '@/components/content/LoadingComp/index.vue'
import { NConfigProvider } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { bookGetList } from '@/api/book'
import type { IBookItem, CarouselList, Announcement } from '@/types'
import { getCarouselList } from '@/api/carousel'
import { getCollectionId } from '@/api/collect'
import { getAnnouncement } from '@/api/announcement'
import { checkCode } from '@/utils'

const themeOverrides: GlobalThemeOverrides = {
    Tabs: {
        tabTextColorActiveLine: '#4338ca',
        barColor: '#4338ca',
        tabTextColorHoverLine: '#4338ca',
        tabFontWeightActive: '600'
    }
}

const AnnouncementItem = defineAsyncComponent(
    () => import('@/components/content/AnnouncementItem/index.vue')
)

const BookItem = defineAsyncComponent(() => import('@/components/content/BookItem/index.vue'))
const Carousel = defineAsyncComponent(() => import('@/components/content/Carousel/index.vue'))

const carouselList = ref<CarouselList[]>([])

// const loading = ref(true)

// 热销榜单
const hotList = reactive<IBookItem[]>([])
// 书籍列表
const booksList = reactive<IBookItem[]>([])
// 收藏列表
const collectionList = ref<number[]>([])
// 公告列表
const announcementList = reactive<Announcement[]>([])

const getAllThings = () => {
    const res = Promise.all([
        bookGetList(),
        getCarouselList(),
        getCollectionId(),
        getAnnouncement()
    ])
    res.then((data) => {
        booksList.length = 0
        booksList.push(...data[0].data)
        carouselList.value.length = 0
        carouselList.value.push(...data[1].data)
        collectionList.value.length = 0
        collectionList.value.push(...data[2].data)
        announcementList.length = 0
        announcementList.push(...data[3].data)

        // 添加控制收藏的字段
        booksList.forEach((book: IBookItem) => {
            if (collectionList.value.includes(book.id)) {
                ;(book as any)['isCollect'] = true
            } else {
                ;(book as any)['isCollect'] = false
            }
        })
        const afterSort = booksList
            .sort((a: IBookItem, b: IBookItem) => {
                return b.bookSales - a.bookSales
            })
            .slice(0, 3)
        hotList.length = 0
        hotList.push(...afterSort)
        // console.log(data)
    })
}
getAllThings()

// 获取全部书籍
// const getAllProduct = async () => {
//     const res = await bookGetList()
//     const carousel = await getCarouselList()
//     const idCollection = await getCollectionId()

//     booksList.length = 0
//     booksList.push(...res.data)
//     carouselList.value.length = 0
//     carouselList.value.push(...carousel.data)
//     collectionList.value.length = 0
//     collectionList.value.push(...idCollection.data)

//     // 添加控制收藏的字段
//     booksList.forEach((book: IBookItem) => {
//         if (collectionList.value.includes(book.id)) {
//             ;(book as any)['isCollect'] = true
//         } else {
//             ;(book as any)['isCollect'] = false
//         }
//     })
//     const afterSort = booksList
//         .sort((a: IBookItem, b: IBookItem) => {
//             return b.bookSales - a.bookSales
//         })
//         .slice(0, 3)
//     hotList.length = 0
//     hotList.push(...afterSort)
// }
// getAllProduct()
</script>

<style scoped lang="less">
.homeContainer {
    width: 100%;
    margin-top: 200px;

    .homeTopContainer {
        width: 90%;
        height: 450px;
        display: flex;
        margin: auto;
        justify-content: space-between;
        align-items: center;

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
                width: 49%;
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
</style>
