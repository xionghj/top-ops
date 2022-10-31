<template>
  <div class="quick-enter">
    <div
      v-for="(item, index) in favoriteList"
      :key="index"
      class="quick-list__item"
      @click="onQuickAccess(item)"
    >
      <span>{{ item.title }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePermissionStore } from '@/store/modules/permission';
  import { useMenuFavoriteStore } from '@/store/modules/menuFavorite';

  const router = useRouter();
  const permissionStore = usePermissionStore();
  const menuFavoriteStore = useMenuFavoriteStore();
  const favoriteList = computed(() => {
    return menuFavoriteStore.menuFavoriteList;
  });
  // 快捷访问跳转
  function onQuickAccess(item: any) {
    const menus = permissionStore.backMenuList;
    const subMenus = getsubMenusParents(menus, item.name);
    const routerPath = childrenRecursion(subMenus);
    router.push({ name: routerPath.name });
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
  function childrenRecursion(arr: any): any {
    if (arr[0].children && arr[0].children.length > 0) {
      return childrenRecursion(arr[0].children);
    } else {
      return arr[0];
    }
  }
</script>
<style lang="less" scoped>
  .quick-enter {
    margin-left: 10px;
    display: flex;
    height: 100%;
    .quick-list__item {
      display: flex;
      align-items: center;
      padding: 0 12px;
      > span {
        cursor: pointer;
      }
    }
  }
</style>
