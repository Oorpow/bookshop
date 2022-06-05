<template>
    <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
    >
        <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            v-model:value="selectedKey"
        />
    </n-layout-sider>
</template>

<script setup lang="ts">
import { h, ref, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import { useAdminLoginStore } from '@/stores/admin'

const store = useAdminLoginStore()


// 权限列表
const permissionList = []
permissionList.push(...store.getAdminInfo.permissionList)
permissionList.unshift('BackstageHome')

// 是否展开
const collapsed = ref(false)
// 选中的项
let selectedKey = ref('BackstageHome')

const permissionObj: any = {
    BackstageHome: '首页',
    BackstageOrder: '订单管理',
    BackstageProduct: '商品管理',
    BackstageAnnouncement: '公告管理',
    BackstageUserFront: '用户列表',
    BackstageUserBackstage: '管理员列表'
}
// 将权限列表转为中文
const parsePermissionToCn = (permission: string) => permissionObj[permission]
// 将权限列表转为vue-router可识别的对象数组
const parsePermission = (list: string[]): MenuOption[] => {
    let newPermissionList = reactive<any[]>([])
    list.forEach((item: string, index) => {
        const newObj = ref<any>({})

        newObj.value['label'] = () =>
            h(
                RouterLink,
                {
                    to: {
                        name: item
                    }
                },
                { default: () => parsePermissionToCn(item) }
            )
        newObj.value['key'] = item
        newPermissionList.push(newObj.value)
    })
    return newPermissionList
}
const newPermissionList = parsePermission(permissionList)
const menuOptions: MenuOption[] = []
menuOptions.push(...newPermissionList)
</script>

<style scoped lang="less"></style>
