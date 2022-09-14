<template>
  <a-menu-item-group :key="menuInfo.key">
    <template #title>
      <span v-if="collapsed" class="sub-mene-group-title"><EllipsisOutlined /></span>
      <span v-else>{{ menuInfo.title }}</span>
    </template>
    <template v-for="item in menuInfo.children" :key="item.key">
      <template v-if="!item.children">
        <a-menu-item :key="item.key">
          <template #icon>
            <ChromeOutlined />
          </template>
          {{ item.title }}
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :key="item.key" :menu-info="item" />
      </template>
    </template>
  </a-menu-item-group>
</template>
<script setup lang="ts">
  import { ChromeOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
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
