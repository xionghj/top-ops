<template>
  <div class="sidebar-container">
    <a-layout-sider v-model:collapsed="collapsed" collapsible theme="light">
      <a-menu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="sidebar-menu"
        @click="handleClick">
        <template v-for="item in list" :key="item.key">
          <template v-if="!item.children">
            <a-menu-item :key="item.key">
              <template #icon>
                <ChromeOutlined />
              </template>
              {{ item.title }}
            </a-menu-item>
          </template>
          <template v-else>
            <sub-menu-group :key="item.key" :menu-info="item" :collapsed="collapsed" />
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { ChromeOutlined } from '@ant-design/icons-vue';
  import subMenuGroup from './sub-menu-group.vue';
  import type { MenuProps } from 'ant-design-vue';
  const selectedKeys = ref<string[]>(['1']);
  const openKeys = ref<string[]>(['sub1']);
  const handleClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
  };
  const collapsed = ref<boolean>(false);
  watch(
    () => openKeys,
    (val) => {
      console.log('openKeys', val);
    },
  );
  const list = [
    {
      key: '1',
      title: '系统管理',
      children: [
        { key: '1.1.1', title: '用户管理' },
        { key: '1.1.2', title: '权限管理' },
      ],
    },
    {
      key: '2',
      title: '资源管理',
      children: [
        {
          key: '2.1',
          title: '资源管理1',
          children: [
            {
              key: '2.1.1',
              title: '基础资源',
              children: [
                { key: '2.2.1', title: '主机管理' },
                { key: '2.2.2', title: '数据中心' },
              ],
            },
            { key: '2.1.2', title: '应用资源' },
          ],
        },
      ],
    },
  ];
</script>
<style lang="less" scoped>
  .sidebar-container {
    z-index: 1;
    overflow: auto;
    overflow-x: hidden;
  }
</style>
