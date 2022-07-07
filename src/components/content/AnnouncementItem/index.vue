<template>
    <n-card :bordered="false">
        <div class="announcementItem" v-for="ad in announcementList" :key="ad.id">
            <div class="announcementItemTitle">
                <n-tag type="warning">公告</n-tag>
                <a>{{ ad.title }}</a>
            </div>
            <span class="announcementItemTime">{{ dayjs(ad.updateTime).format('MM/DD') }}</span>
        </div>
        <n-button style="width: 100%; margin-top: 15px" ghost> 阅读更多资讯 </n-button>
    </n-card>
</template>

<script setup lang="ts">
import type { Announcement } from '@/types'
import dayjs from 'dayjs'

type Props = {
    announcementList: Announcement[]
}
defineProps<Props>()
</script>

<style scoped lang="less">
.announcementItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0;
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
