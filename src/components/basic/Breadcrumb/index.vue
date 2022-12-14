<template>
  <div class="page-title-box">
    <div class="flex items-center">
      <slot name="left"></slot>
      <a-breadcrumb>
        <template #separator><span>></span></template>
        <a-breadcrumb-item v-for="(item, index) in menus" :key="index">{{
          item.meta && item.meta.title
        }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue';
  import { usePermissionStore } from '@/store/modules/permission';

  const route = useRoute();
  const permissionStore = usePermissionStore();
  const menus = ref<any>([]);
  // 获取当前路由的二级菜单
  function getSubMenus() {
    const menusList = permissionStore.backMenuList;
    const subMenus = getsubMenusParents(menusList, route.name);
    console.log('获取二级菜单', subMenus);
    if (!subMenus) return;
    menus.value = subMenus.reverse();
  }
  function getsubMenusParents(list: any, name: any): any {
    for (const i in list) {
      if (list[i].name === name) {
        //查询到就返回该数组对象
        return [list[i]];
      }
      if (list[i].children) {
        const node = getsubMenusParents(list[i].children, name);
        if (node !== undefined) {
          //查询到把父节点连起来
          return node.concat(list[i]);
        }
      }
    }
  }
  getSubMenus();
</script>
<style lang="less" scoped>
  .page-title-box {
    padding: 10px 1.5rem;
    height: 42px;
    background-color: #fff;
    box-shadow: 0 1px 2px rgb(56 65 74 / 15%);
    border-bottom: 1px none;
    border-top: 1px none;
    margin: -17px -18px 18px -18px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    :deep(.ant-breadcrumb) {
      font-size: 12px;
    }
  }
</style>
