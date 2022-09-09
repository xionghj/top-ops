<template>
  <div class="app-wrapper">
    <!-- 头部部分 -->
    <navbar />
    <!-- 左侧内容 -->
    <div class="main-container">
      <!-- 侧边栏 -->
      <Sidebar />
      <!-- 内容部分 -->
      <app-main />
    </div>
  </div>
</template>
<script setup lang="ts">
  import Sidebar from './components/Sidebar/index.vue';
  import Navbar from './components/Navbar.vue';
  import AppMain from './components/AppMain.vue';
</script>
<style lang="less" scoped>
  .app-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .main-container {
    width: 100%;
    display: flex;
    overflow: auto;
  }
  .sidebar-container {
    width: 201px !important;
    z-index: 1;
    /* background-color: #304156; */
  }
</style>
