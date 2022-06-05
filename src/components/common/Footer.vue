<template>
    <footer>
        <div class="brandItem" v-for="(brand, index) in brandList" :key="index">
            <span>{{ brand.title }}</span>
            <span v-for="(item, index) in brand.list" :key="index">{{ item }}</span>
        </div>
    </footer>
</template>

<script setup lang="ts">
let brandList = [
    {
        title: 'Featured',
        list: ['sleep', 'Swimwear', 'Underwear']
    },
    {
        title: 'Categories',
        list: ['Basic Tees', 'Artwork Tees', 'Bottoms', 'Underwear']
    },
    {
        title: 'Collection',
        list: ['Everything', 'Core', 'Sale']
    },
    {
        title: 'Brands',
        list: ['Full Nelson', 'My Way', 'Counterfeit']
    }
];
</script>

<style scoped>
footer {
    width: 95%;
    margin: auto;
    display: flex;
    justify-content: space-between;
}
footer .brandItem {
    display: flex;
    flex-direction: column;
}
footer .brandItem span {
    margin: 10px 0;
    color: #7a7a7a;
    font-size: 23px;
}
footer .brandItem span:nth-child(1) {
    font-weight: bold;
}
</style>