<template>
  <div class="w-full flex flex-col px-4">
    <!-- <div class="flex justify-end">
      <span class="mr-2">设置父业务</span>
      <span>移除父业务</span>
    </div>
    <a-divider style="margin: 8px 0" /> -->
    <div class="w-full h-32 flex items-center">
      <div class="text-[#FFA235] text-base"
        >请 <span class="text-blue-500" @click="showAddParentDialogChange">设置</span> 父业务</div
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Divider as ADivider } from 'ant-design-vue';
  import { useParentDialog } from '../../../hooks/useParentDialog';
  const { showAddParentDialogChange } = useParentDialog();
</script>
