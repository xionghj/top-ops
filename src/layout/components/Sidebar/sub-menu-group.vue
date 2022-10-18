<template>
  <a-menu-item-group :key="menuInfo.name">
    <template #title>
      <span v-if="collapsed" class="sub-mene-group-title"><EllipsisOutlined /></span>
      <span v-else>{{ menuInfo.meta && menuInfo.meta.title }}</span>
    </template>
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
  </a-menu-item-group>
</template>
<script setup lang="ts">
  import { ChromeOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
  import { MenuItemGroup as AMenuItemGroup, MenuItem as AMenuItem } from 'ant-design-vue';
  import subMenu from './sub-menu.vue';
  defineProps({
    menuInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    collapsed: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  });
</script>
<style lang="less" scoped>
  .sub-mene-group-title {
    display: block;
    text-align: center;
  }
</style>
