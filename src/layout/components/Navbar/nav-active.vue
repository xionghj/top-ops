<template>
  <a-dropdown :trigger="['hover']">
    <div class="ant-dropdown-link nav-active" @click.prevent>
      <span class="nav-active__header" />
      <span>个人中心</span>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="signOut">退出登录</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router';
  const router = useRouter();
  function signOut() {
    localStorage.clear();
    router.push({ name: 'login' });
  }
</script>
<style lang="less" scoped>
  .nav-active {
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer;
    padding: 0 10px;
    &:hover {
      background-color: #f6f6f6;
    }
    .nav-active__header {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: #d3d3d3;
      margin-right: 12px;
    }
  }
</style>
