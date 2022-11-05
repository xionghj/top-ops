<template>
  <div class="sidebar-container">
    <div class="sidebar-container-fixed-stuff" :style="{ width: collapsed ? '70px' : '200px' }" />
    <a-layout-sider
      v-model:collapsed="collapsed"
      class="sidebar-mune"
      :trigger="null"
      collapsible
      theme="light"
      collapsed-width="70"
    >
      <div style="flex: 1 1 0%; overflow: hidden auto">
        <template v-for="subMenusGroud in subMenus" :key="subMenusGroud.name">
          <div v-if="!collapsed" class="sidebar-mune__title">{{
            subMenusGroud.meta && subMenusGroud.meta.title
          }}</div>
          <a-menu
            v-model:openKeys="state.openKeys"
            v-model:selectedKeys="state.selectedKeys"
            mode="inline"
            @click="handleClick"
          >
            <template v-for="item in subMenusGroud.children" :key="item.name">
              <template v-if="!item.children">
                <a-menu-item :key="item.name">
                  <template #icon>
                    <ChromeOutlined />
                  </template>
                  {{ item.meta && item.meta.title }}
                </a-menu-item>
              </template>
              <template v-else>
                <sub-menu-group :key="item.name" :menu-info="item" :collapsed="collapsed" />
              </template>
            </template>
          </a-menu>
        </template>
      </div>
      <div class="menu-fold" @click="collapsed = !collapsed">
        <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
      </div>
    </a-layout-sider>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, reactive, computed } from 'vue';
  import { ChromeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import {
    LayoutSider as ALayoutSider,
    Menu as AMenu,
    MenuItem as AMenuItem,
  } from 'ant-design-vue';
  import subMenuGroup from './sub-menu-group.vue';
  import type { MenuProps } from 'ant-design-vue';
  import { usePermissionStore } from '@/store/modules/permission';
  // 当前路由
  const currentRoute = useRoute();
  const router = useRouter();
  const permissionStore = usePermissionStore();
  const { subMenus } = storeToRefs(permissionStore);
  const state = reactive({
    openKeys: [] as string[],
    selectedKeys: [currentRoute.name] as string[],
  });
  const handleClick: MenuProps['onClick'] = (e) => {
    console.log('click', e, state.selectedKeys, state.openKeys);
    // router.push({ name: e.key });
    router.push({ name: e.key });
  };
  // 根据activeMenu获取指定的menu
  const getTargetMenuByActiveMenuName = (activeMenu: string) => {
    return router.getRoutes().find((n) => [n.name, n.path].includes(activeMenu));
  };

  // 获取当前打开的子菜单
  const getOpenKeys = () => {
    const meta = currentRoute.meta;
    if (meta?.activeMenu) {
      const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu);
      return targetMenu?.meta?.namePath ?? [meta?.activeMenu];
    }

    return (
      meta?.hideInMenu
        ? state?.openKeys || []
        : currentRoute.meta?.namePath ?? currentRoute.matched.slice(1).map((n) => n.name)
    ) as string[];
  };
  const collapsed = ref<boolean>(false);
  watch(
    () => state.openKeys,
    (val) => {
      console.log('openKeys', val);
    },
  );
  // 监听菜单收缩状态
  watch(
    () => collapsed.value,
    (newVal) => {
      state.openKeys = newVal ? [] : getOpenKeys();
      state.selectedKeys = [currentRoute.name] as string[];
    },
  );
  // 跟随页面路由变化，切换菜单选中状态
  watch(
    () => currentRoute.fullPath,
    () => {
      // state.openKeys = getOpenKeys();
      const meta = currentRoute.meta;
      if (currentRoute.name != 'Layout' && currentRoute.name != 'PageNotFound') {
        getSubMenus();
      }
      state.selectedKeys = [currentRoute.meta?.activeMenu ?? currentRoute.name] as string[];
      console.log('路由切换', currentRoute.name);
    },
    {
      immediate: true,
    },
  );
  // 获取当前路由的二级菜单
  function getSubMenus() {
    const menus = permissionStore.backMenuList;
    const subMenus = getsubMenusParents(menus, currentRoute.name);
    permissionStore.subMenus = [subMenus[subMenus.length - 1]];
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
</script>
<style lang="less" scoped>
  .sidebar-container {
    display: flex;
    flex-direction: column;
    z-index: 1;
    overflow: auto;
    overflow-x: hidden;
    box-shadow: 0 2px 4px rgb(15 34 58 / 12%);
    // :deep(.ant-menu-submenu-selected) {
    //   color: #1890ff;
    // }
    // :deep(.ant-menu-title-content) {
    //   // color: #212529;
    //   color: red;
    // }
    .sidebar-container-fixed-stuff {
      flex-shrink: 0;
      transition: width 0.2s;
    }
    .sidebar-mune {
      position: fixed;
      top: 50px;
      left: 0;
      z-index: 10;
      height: calc(100% - 50px);
      .sidebar-mune__title {
        padding: 10px 16px;
        color: #262626;
        font-weight: 500;
        font-size: 15px;
        line-height: 21px;
        margin-top: 3px;
        word-wrap: break-word;
        word-break: break-word;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      :deep(.ant-menu-item:after) {
        border-right: none;
      }
    }
    :deep(.ant-layout-sider-children) {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .menu-fold {
      margin-top: 4px;
      margin-bottom: 4px;
      padding: 0 16px;
      overflow: hidden;
      height: 40px;
      line-height: 40px;
      border-top: 1px solid #f0f0f0;
      cursor: pointer;
    }
  }
</style>
