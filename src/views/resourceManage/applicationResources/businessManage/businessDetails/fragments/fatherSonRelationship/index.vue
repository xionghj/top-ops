<!-- 业务管理-父子关系-->
<template>
  <div class="w-full bg-white flex">
    <div class="p-[15px] w-[220px] bg-gray-50">
      <div
        v-for="(item, index) in menus"
        :key="index"
        class="flex items-center py-1 px-2 mb-1 rounded-sm cursor-pointer hover:bg-gray-200 hover:text-blue-500"
        :class="[selctParentChidrenMeus === item.key ? 'bg-gray-200 text-blue-500' : '']"
        @click="onSelectMenus(item.key)"
        >{{ item.name }}</div
      >
    </div>
    <div class="flex-1">
      <Parent v-if="selctParentChidrenMeus === 'parent'"></Parent>
      <children v-if="selctParentChidrenMeus === 'children'"></children>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useBusinessRelation } from '../../hooks/useBusinessRelation';

  import Parent from './fragments/parent.vue';
  import children from './fragments/children.vue';

  const { selctParentChidrenMeus } = useBusinessRelation();
  const menus = [
    { name: '父业务', key: 'parent' },
    { name: '子业务', key: 'children' },
  ];
  function onSelectMenus(key: string) {
    selctParentChidrenMeus.value = key;
  }
</script>
