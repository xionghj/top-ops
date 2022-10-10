<template>
  <div class="navbar">
    <div class="navbar-left">
      <div class="navbar-logo">
        <div class="navbar-logo__img" />
        <div class="navbar-logo__title">Ops</div>
      </div>
      <navMenu />
      <navQuickEnter />
    </div>
    <div class="navbar-right">
      <navActive />
    </div>
  </div>
</template>
<script setup lang="ts">
  import navMenu from './nav-menu.vue';
  import navQuickEnter from './nav-quick-enter.vue';
  import navActive from './nav-active.vue';
</script>
<style lang="less" scoped>
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // overflow: hidden;
    height: 100%;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    flex: 0 0 50px;
    .navbar-left {
      display: flex;
      align-items: center;
      height: 100%;
      .navbar-logo {
        width: 200px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        .navbar-logo__img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          border-radius: 50%;
          background-color: rgb(243, 243, 243);
        }
      }
    }
    .navbar-right {
      display: flex;
      align-items: center;
      height: 100%;
      margin-right: 20px;
    }
  }
</style>
