<template>
    <div class="loading">
        <div class="loading-skeleton" v-for="(item, index) in needNum">
            <n-skeleton height="400px" width="400px" />
            <n-skeleton text style="margin-top: 5px;"/>
            <n-skeleton text style="width: 50%; margin-top: 5px;"/>
        </div>
    </div>
</template>

<script setup lang="ts">
type Props = {
    needNum: number
}
const props = defineProps<Props>()
</script>

<style scoped lang="less">
.loading {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-skeleton {
        margin: 40px 0; 
    }
}
</style>
