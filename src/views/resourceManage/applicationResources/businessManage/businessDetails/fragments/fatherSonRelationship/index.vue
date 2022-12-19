<!-- 业务管理-父子关系-->
<template>
  <div class="w-full bg-white flex">
    <div class="px-3 pt-3 w-[200px] bg-gray-50">
      <div v-for="(item, index) in menus" :key="index" class="pb-3">{{ item.name }}</div>
    </div>
    <div>内容</div>
  </div>
</template>
<script lang="ts" setup>
  const menus = [
    { name: '父业务', id: 1 },
    { name: '子业务', id: 2 },
  ];
</script>
