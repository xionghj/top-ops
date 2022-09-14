<template>
  <a-sub-menu :key="menuInfo.key">
    <template #icon><ChromeOutlined /></template>
    <template #title>{{ menuInfo.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.key">
      <template v-if="!item.children">
        <a-menu-item :key="item.key">
          <template #icon>
            <ChromeOutlined />
          </template>
          {{ item.title }}
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :key="item.key" :menu-info="item" />
      </template>
    </template>
  </a-sub-menu>
</template>
<script setup lang="ts">
  import { ChromeOutlined } from '@ant-design/icons-vue';
  defineProps({
    menuInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
</script>
