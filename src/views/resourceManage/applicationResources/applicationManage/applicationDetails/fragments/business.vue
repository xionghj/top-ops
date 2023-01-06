<!-- 应用管理-列表详情-所属业务-->
<template>
  <div v-if="!businessInfo.id" class="flex">
    <div class="w-full h-32 bg-gray-50 flex items-center">
      <div class="ml-4 text-[#FFA235] text-base"
        >请 <span class="text-blue-500" @click="onBusiness">设置</span> 所在机柜</div
      >
    </div>
  </div>
  <template v-else>
    <div>
      <a-descriptions :column="2">
        <a-descriptions-item label="名称"> {{ businessInfo.name }}</a-descriptions-item>
        <a-descriptions-item label="类型">{{
          businessInfo.kind && businessInfo.kind.name
        }}</a-descriptions-item>
        <a-descriptions-item label="备注说明">{{ businessInfo.description }}</a-descriptions-item>
        <a-descriptions-item label="测试负责人">
          <span
            v-for="(item, index) in businessInfo.tester"
            :key="index"
            class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
          >
            {{ item.username }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="产品经理">
          <span
            v-for="(item, index) in businessInfo.pm"
            :key="index"
            class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
          >
            {{ item.username }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="研发负责人">
          <span
            v-for="(item, index) in businessInfo.developer"
            :key="index"
            class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
          >
            {{ item.username }}
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
              :data-source="appsList"
              row-key="id"
              :pagination="false"
              :loading="appsLoading"
              class="w-full"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'agent_status'">
                  <a-tag :color="'green'">
                    {{ record.agent_status }}
                  </a-tag>
                </template>
              </template>
            </a-table>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </template>
</template>
<script lang="ts" setup>
  import { ref, reactive, watch, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
    Tag as ATag,
  } from 'ant-design-vue';

  import { useBusinessDialog } from '../hooks/useBusinessDialog';

  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  import {
    getAppsBusinessDetails,
    getCMDBAppsList,
  } from '@/api/resourceManage/applicationResources/applicationManage';

  const route = useRoute();
  const { currentBusinessId, isRefresh, showAddBusinessDialogChange } = useBusinessDialog();

  watch(
    () => isRefresh.value,
    () => {
      getAppsBusinessDetailsRequest();
    },
  );

  const businessLodding = ref(false);
  // 获取所属业务
  const businessInfo = ref({
    id: null,
    children: [],
    creator: {},
    kind: {
      id: '',
      name: '',
    },
    name: '',
    parent: null,
    pm: [] as any,
    tester: [] as any,
    developer: [] as any,
    description: '',
  });
  async function getAppsBusinessDetailsRequest() {
    try {
      if (businessLodding.value) {
        return;
      }
      businessLodding.value = true;
      const id: any = route.query && route.query.id;
      const data = await getAppsBusinessDetails(id);
      currentBusinessId.value = data.id;
      businessInfo.value = data;
      businessLodding.value = false;
    } catch (error) {
      businessLodding.value = false;
      console.error(error);
    }
  }
  // 关联应用
  const applicationColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '应用层级',
      dataIndex: 'hierarchy',
      key: 'hierarchy',
    },
    {
      title: '应用别名',
      dataIndex: 'alias_name',
      key: 'alias_name',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    },
  ];
  const appsLoading = ref(false);
  const appsList = ref([]);
  // 获取应用列表
  async function getCMDBAppsListRequest() {
    try {
      if (appsLoading.value) {
        return;
      }
      appsLoading.value = true;
      const params = {
        search: '',
        page: 1,
        page_size: 100,
        business: currentBusinessId.value,
      };
      const data = await getCMDBAppsList(params);
      appsLoading.value = false;
      appsList.value = data.results;
    } catch (error) {
      appsLoading.value = false;
      console.error(error);
    }
  }
  // 设置所属业务
  function onBusiness() {
    showAddBusinessDialogChange();
  }
  onMounted(async () => {
    await getAppsBusinessDetailsRequest();
    getCMDBAppsListRequest();
  });
</script>
<style lang="less" scoped>
  :deep(.ant-descriptions-item-label) {
    width: 120px;
    display: flex;
    justify-content: flex-end;
    padding-right: 2px;
  }
</style>
