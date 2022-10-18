<template>
  <div class="quick-enter">
    <div v-for="(item, index) in quickList" :key="index" class="quick-list__item">
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  const quickList = [
    {
      name: '资源管理',
    },
    {
      name: '研发效能',
    },
  ];
</script>
<style lang="less" scoped>
  .quick-enter {
    margin-left: 10px;
    display: flex;
    height: 100%;
    .quick-list__item {
      display: flex;
      align-items: center;
      padding: 0 8px;
      > span {
        cursor: pointer;
      }
    }
  }
</style>
