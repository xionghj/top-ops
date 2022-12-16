<template>
  <ConfigProvider :locale="zhCN">
    <router-view />
  </ConfigProvider>
</template>
<script setup lang="ts">
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import { ConfigProvider } from 'ant-design-vue';
</script>
<style scoped></style>
