<template>
  <a-dropdown :trigger="['hover']">
    <div class="ant-dropdown-link nav-active" @click.prevent>
      <span class="nav-active__header" />
      <span>{{ name }}</span>
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
  import { useUserStore } from '@/store/modules/user';
  import { storeToRefs } from 'pinia';
  import { message, Modal } from 'ant-design-vue';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  const router = useRouter();
  const userStore = useUserStore();
  const { name } = storeToRefs(userStore);
  function signOut() {
    localStorage.clear();
    router.replace({ name: 'login' });
  }
  // 退出登录
  const doLogout = () => {
    Modal.confirm({
      title: '您确定要退出登录吗？',
      centered: true,
      onOk: async () => {
        await userStore.logout();
        localStorage.clear();
        message.success('成功退出登录');
        router.replace({ name: 'login' });
      },
    });
  };
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
