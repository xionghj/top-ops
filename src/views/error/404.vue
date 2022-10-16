<template>
  <div class="page-container">
    <div>
      <h1>404</h1>
      <h1>OOPS！你好像走丢了...</h1>
      <RouterLink :to="{ path: '/', replace: true }" class="ant-btn ant-btn-primary"
        >回到首页</RouterLink
      >
    </div>
    <img src="~@/assets/404.gif" alt="" />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .page-container {
    display: flex;
    width: 100%;
    height: calc(100vh - 50px);
    background-color: white;
    justify-content: center;
    align-items: center;
  }
</style>
