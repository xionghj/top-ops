<!-- 业务管理-父子关系-->
<template>
  <div class="w-full bg-white flex">
    <div class="px-3 pt-3 w-[200px] bg-gray-50">
      <div
        v-for="(item, index) in menus"
        :key="index"
        class="flex items-center py-1 px-2 mb-1 rounded-sm cursor-pointer hover:bg-gray-200 hover:text-blue-500"
        :class="[selectMenus === item.id ? 'bg-gray-200 text-blue-500' : '']"
        @click="onSelectMenus(item.id)"
        >{{ item.name }}</div
      >
    </div>
    <div class="flex-1">
      <Parent></Parent>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import Parent from './fragments/parent.vue';
  const menus = [
    { name: '父业务', id: 1 },
    { name: '子业务', id: 2 },
  ];
  const selectMenus = ref(1);
  function onSelectMenus(id: number) {
    selectMenus.value = id;
  }
</script>
