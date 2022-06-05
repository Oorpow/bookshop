<template>
    <div class="notFound">
        <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬"></n-result>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.notFound {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
