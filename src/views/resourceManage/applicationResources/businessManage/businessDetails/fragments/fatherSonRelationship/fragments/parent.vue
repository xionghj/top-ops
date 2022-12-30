<template>
  <div class="w-full flex flex-col">
    <div v-if="!parentInfo.id" class="w-full h-32 flex items-center px-4">
      <div
        class="w-full text-[#FFA235] h-[100px] bg-[#fcf8f2] flex items-center px-4 border-l-[3px] border-[#ffa235]"
        >请
        <span
          class="cursor-pointer text-blue-500 px-1"
          @click="showAddBusinessDialogChange('parent')"
          >设置</span
        >
        父业务</div
      >
    </div>
    <div v-else class="px-6 py-4">
      <a-spin :spinning="loading">
        <div>
          <a-descriptions :column="2">
            <a-descriptions-item label="名称"> {{ parentInfo.name }}</a-descriptions-item>
            <a-descriptions-item label="类型">{{ parentInfo.kind }}</a-descriptions-item>
            <a-descriptions-item label="备注说明">{{ parentInfo.description }}</a-descriptions-item>
            <a-descriptions-item label="运维负责人">
              <span v-for="(item, index) in parentInfo.tester" :key="index">
                {{ item.username }}{{ parentInfo.tester.length - 1 != index ? '，' : '' }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="产品经理">
              <span v-for="(item, index) in parentInfo.pm" :key="index">
                {{ item.username }}{{ parentInfo.pm.length - 1 != index ? '，' : '' }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="研发负责人">
              <span v-for="(item, index) in parentInfo.developer" :key="index">
                {{ item.username }}{{ parentInfo.developer.length - 1 != index ? '，' : '' }}
              </span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <div class="mt-4">
            <a-descriptions>
              <a-descriptions-item label="关联应用" :span="3">
                <a-table
                  :columns="applicationColumns"
                  :data-source="applicationList"
                  row-key="id"
                  :pagination="false"
                  :loading="applicationLodding"
                  class="w-full"
                >
                </a-table>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
    Spin as ASpin,
  } from 'ant-design-vue';
  import { useBusinessDialog } from '../../../hooks/useBusinessDialog';
  import { useBusinessRelation } from '../../../hooks/useBusinessRelation';
  import { getParentBusinessDetails } from '@/api/resourceManage/applicationResources/businessManage';

  const { showAddBusinessDialogChange, showAddBusinessDialog } = useBusinessDialog();
  const { parentInfoId, isRefresh } = useBusinessRelation();
  const route = useRoute();

  watch(
    () => showAddBusinessDialog.value,
    (bol) => {
      if (!bol) {
        getParentBusinessDetailsRequest();
      }
    },
  );
  watch(
    () => isRefresh.value,
    () => {
      getParentBusinessDetailsRequest();
    },
  );
  // 获取所属机柜
  const applicationColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '应用层级',
      dataIndex: 'free_unum',
      key: 'free_unum',
    },
    {
      title: '中文别名',
      dataIndex: 'unum',
      key: 'unum',
    },
    {
      title: '备注',
      dataIndex: 'code',
      key: 'cpu_count',
    },
  ];
  const applicationList = ref([]);
  const applicationLodding = ref(false);

  const parentInfo = ref({
    id: '',
    name: '',
    kind: '',
    description: '',
    developer: {} as any,
    pm: {} as any,
    tester: {} as any,
  });
  const loading = ref(false);
  async function getParentBusinessDetailsRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getParentBusinessDetails(id);
      parentInfo.value = data;
      parentInfoId.value = data.id;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  getParentBusinessDetailsRequest();
</script>
<style lang="less" scoped>
  :deep(.ant-descriptions-item-label) {
    width: 90px;
    display: flex;
    justify-content: flex-end;
    padding-right: 2px;
  }
</style>
