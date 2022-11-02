<template>
  <div class="page-title-box">
    <!-- <div class="breadcrumb">
      <div v-for="(item, index) in arr" :key="index" class="breadcrumb-item">
        <a href="#">{{ item.name }}</a>
      </div>
    </div> -->
    <a-breadcrumb>
      <template #separator><span>></span></template>
      <a-breadcrumb-item v-for="(item, index) in menus" :key="index">{{
        item.meta && item.meta.title
      }}</a-breadcrumb-item>
    </a-breadcrumb>
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
  const menus = ref([]);
  // 获取当前路由的二级菜单
  function getSubMenus() {
    const menusList = permissionStore.backMenuList;
    const subMenus = getsubMenusParents(menusList, route.name);
    console.log('获取二级菜单', subMenus);
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
  .breadcrumb {
    display: flex;
    .breadcrumb-item:before {
      border: solid transparent;
      content: ' ';
      height: 0;
      left: 100%; //根据三角形的位置，可以随意更改。
      position: absolute;
      width: 0;
    }
    .breadcrumb-item {
      &::before {
        font-family: Material Design Icons;
        font-size: 15px;
        line-height: 20px;
        color: red;
      }
      > a {
        color: #495057;
      }
    }
  }
</style>
