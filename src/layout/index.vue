<template>
  <div class="app-wrapper">
    <!-- 头部部分 -->
    <navbar />
    <!-- 左侧内容 -->
    <div class="main-container">
      <!-- 侧边栏 -->
      <sidebar />
      <!-- 内容部分 -->
      <app-main />
    </div>
  </div>
</template>
<script setup lang="ts">
  import Sidebar from './components/Sidebar/index.vue';
  import Navbar from './components/Navbar/index.vue';
  import AppMain from './components/AppMain.vue';
</script>
<style lang="less" scoped>
  .app-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-width: 900px;
  }
  .main-container {
    width: 100%;
    height: 100%;
    display: flex;
    // overflow: auto;
  }
</style>
