<template>
  <div class="sidebar-container">
    <div class="sidebar-container-fixed-stuff" :style="{ width: collapsed ? '70px' : '200px' }" />
    <a-layout-sider
      v-model:collapsed="collapsed"
      class="sidebar-mune"
      :trigger="null"
      collapsible
      theme="light"
      collapsed-width="70">
      <div style="flex: 1 1 0%; overflow: hidden auto">
        <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" @click="handleClick">
          <template v-for="item in menus" :key="item.name">
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
      </div>
      <div class="menu-fold" @click="collapsed = !collapsed">
        <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
      </div>
    </a-layout-sider>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import { ChromeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
  import subMenuGroup from './sub-menu-group.vue';
  import { useRouter } from 'vue-router';
  import type { MenuProps } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  const router = useRouter();
  const userStore = useUserStore();
  const selectedKeys = ref<string[]>([]);
  const openKeys = ref<string[]>([]);
  const handleClick: MenuProps['onClick'] = (e) => {
    console.log('click', e, selectedKeys.value, openKeys.value);
    // router.push({ name: e.key });
    router.push({ name: e.key });
  };
  const collapsed = ref<boolean>(false);
  watch(
    () => openKeys,
    (val) => {
      console.log('openKeys', val);
    },
  );
  const menus = computed(() => {
    return [...userStore.menus].filter((n) => !n.meta?.hideInMenu);
  });
  // const oriMenus = computed(() => {
  //   return userStore.oriMenus;
  // });
  // console.log('menus??????', menus, menusFilter.value);
  const list = [
    {
      key: '1',
      title: '????????????',
      children: [
        { key: 'home', title: '????????????' },
        { key: '404', title: '????????????' },
      ],
    },
    {
      key: '2',
      title: '????????????',
      children: [
        {
          key: '2.1',
          title: '????????????',
          children: [
            {
              key: '2.1.1',
              title: '????????????',
              children: [
                { key: '2.2.1', title: '????????????' },
                { key: '2.2.2', title: '????????????' },
              ],
            },
            { key: 'welcome', title: '????????????' },
          ],
        },
      ],
    },
  ];
</script>
<style lang="less" scoped>
  .sidebar-container {
    display: flex;
    flex-direction: column;
    z-index: 1;
    overflow: auto;
    overflow-x: hidden;
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
