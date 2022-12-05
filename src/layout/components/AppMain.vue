<template>
  <div class="app-main">
    <div style="height: auto">
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <transition mode="out-in" appear>
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </template>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useRoute } from 'vue-router';
  const route = useRoute();
</script>
<style scoped>
  .app-main {
    /* min-height: calc(100% - 50px); */
    background-color: #f0f2f5;
    /* flex-grow: 1; */
    flex: 1;
    overflow: auto;
    padding: 18px;
  }
</style>
