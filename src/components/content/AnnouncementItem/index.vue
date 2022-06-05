<template>
    <n-card :bordered="false">
        <n-scrollbar style="max-height: 300px">
            <div class="announcementItem" v-for="ad in announcementList" :key="ad.id">
                <div class="announcementItemTitle">
                    <n-tag type="warning">公告</n-tag>
                    <a>{{ ad.title }}</a>
                </div>
                <span class="announcementItemTime">{{ dayjs(ad.updateTime).format('MM/DD') }}</span>
            </div>
        </n-scrollbar>
        <n-button style="width: 100%; margin-top: 15px" ghost> 阅读更多资讯 </n-button>
    </n-card>
</template>

<script setup lang="ts">
import { getAnnouncement } from '@/api/announcement'
import type { Announcement } from '@/types'
import { checkCode } from '@/utils'
import dayjs from 'dayjs'

const announcementList = reactive<Announcement[]>([])
const getAllAnnouncement = async () => {
    const res = await getAnnouncement()
    const code = checkCode((res as any).code)
    if (code === 200) {
        announcementList.length = 0
        announcementList.push(...res.data)
        console.log(announcementList)
    }
}
getAllAnnouncement()
</script>

<style scoped lang="less">
.announcementItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #efeff5;
    .announcementItemTitle {
        a {
            margin-left: 10px;
            &:hover {
                color: #f0a020bf;
                cursor: pointer;
            }
        }
    }
    .announcementItemTime {
    }
}
</style>
