<template>
  <div class="app-main">
    <div style="height: auto">
      <Breadcrumb />
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <transition
            :name="Object.is(route.meta?.transitionName, false) ? '' : 'fade-transform'"
            mode="out-in"
            appear
          >
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </template>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import Breadcrumb from '@/components/basic/Breadcrumb/index.vue';
  const route = useRoute();
</script>
<style scoped>
  .app-main {
    /* min-height: calc(100% - 50px); */
    background-color: #f0f2f5;
    flex-grow: 1;
    overflow: auto;
    padding: 12px;
  }
</style>
