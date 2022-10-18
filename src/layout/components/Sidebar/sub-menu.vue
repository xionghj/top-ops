<template>
  <a-sub-menu :key="menuInfo.name">
    <template #icon><ChromeOutlined /></template>
    <template #title>{{ menuInfo.meta && menuInfo.meta.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.name">
      <template v-if="!item.children">
        <a-menu-item :key="item.name">
          <template #icon>
            <ChromeOutlined />
          </template>
          {{ item.meta && item.meta.title }}
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :key="item.name" :menu-info="item" />
      </template>
    </template>
  </a-sub-menu>
</template>
<script setup lang="ts">
  import { ChromeOutlined } from '@ant-design/icons-vue';
  import { MenuItem as AMenuItem, SubMenu as ASubMenu } from 'ant-design-vue';
  defineProps({
    menuInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
</script>
