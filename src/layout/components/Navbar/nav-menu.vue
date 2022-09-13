<template>
  <a-popover overlay-class-name="nav-popover-menu" placement="bottomLeft" trigger="click">
    <template #content>
      <menus-overlay />
    </template>
    <div class="all-menu">全部功能<downOutlined class="all-menu__icon" /></div>
  </a-popover>
</template>
<script setup lang="ts">
  import { DownOutlined } from '@ant-design/icons-vue';
  import menusOverlay from './menus-overlay.vue';
</script>
<style lang="less">
  .nav-popover-menu {
    padding-top: 0 !important;
    top: 50px !important;
    left: 195px !important;
  }
</style>
<style lang="less" scoped>
  .all-menu {
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-left: 10px;
    height: 100%;
    &:hover {
      cursor: pointer;
    }
    .all-menu__icon {
      font-size: 10px;
      margin-left: 2px;
    }
  }
</style>
