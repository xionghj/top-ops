<template>
  <a-sub-menu :key="menuInfo.name">
    <template #icon><ChromeOutlined /></template>
    <template #title>{{ menuInfo.meta && menuInfo.meta.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.name">
      <template v-if="!item.children || (item.meta && item.meta.kind == 'menu_directory')">
        <a-menu-item :key="item.name">
          <template #icon>
            <!-- <ChromeOutlined /> -->
            <!-- <icon-font type="dian" size="16" /> -->
          </template>
          <span class="menu-item">{{ item.meta && item.meta.title }}</span>
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
  import { IconFont } from '@/components/basic/iconfont';
  defineProps({
    menuInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
</script>
