<template>
  <div class="page-title-box">
    <div class="breadcrumb">
      <div v-for="(item, index) in arr" :key="index" class="breadcrumb-item">
        <a href="#">{{ item.name }}</a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  const arr = [
    {
      name: '阶段一',
    },
    {
      name: '阶段二',
    },
  ];
</script>
<style lang="less" scoped>
  .page-title-box {
    padding: 10px 1.5rem;
    background-color: #fff;
    box-shadow: 0 1px 2px rgb(56 65 74 / 15%);
    border-bottom: 1px none;
    border-top: 1px none;
    margin: -12px -12px 12px -12px;
    display: flex;
    align-items: center;
  }
  .breadcrumb {
    display: flex;
  }
</style>
