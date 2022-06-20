<template>
    <div>
        <n-card v-for="collection in collectionList" :key="collection.id">
            <n-thing>
                <template #header>
                    <p>
                        {{ collection.bookName }}
                    </p>
                    价格: {{ collection.bookPrice }}
                </template>
                <template #header-extra>
                    <n-image
                        width="100"
                        :src="collection.bookImg"
                        fallback-src="/images/naive1.jpeg"
                    />
                </template>
                <template #description> 描述 </template>
                {{ collection.bookDescription }}
            </n-thing>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { getUserCollection } from '@/api/collect'
import type { BookType } from '@/types'
import { checkCode } from '@/utils'

const collectionList = ref<BookType[]>([])
const getCollectionList = async () => {
    const res = await getUserCollection()
    const code = checkCode((res as any).code)
    if (code === 200 && res.data != null) {
        collectionList.value.length = 0
        collectionList.value.push(...res.data)
        console.log(collectionList.value)
    }
}
getCollectionList()
</script>

<style scoped lang="less">
:deep(.n-thing-header) {
    align-items: flex-start!important;
}
</style>
