<template>
  <div class="quick-enter">
    <div v-for="(item, index) in favoriteList" :key="index" class="quick-list__item">
      <span>{{ item.title }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useMenuFavoriteStore } from '@/store/modules/menuFavorite';
  const menuFavoriteStore = useMenuFavoriteStore();
  const favoriteList = computed(() => {
    return menuFavoriteStore.menuFavoriteList;
  });
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
