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
        <a-descriptions-item label="类型">{{ businessInfo.kind }}</a-descriptions-item>
        <a-descriptions-item label="备注说明">{{ businessInfo.description }}</a-descriptions-item>
        <a-descriptions-item label="运维负责人">
          <span v-for="(item, index) in businessInfo.tester" :key="index">
            {{ item.username }}{{ businessInfo.tester.length - 1 != index ? '，' : '' }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="产品经理">
          <span v-for="(item, index) in businessInfo.pm" :key="index">
            {{ item.username }}{{ businessInfo.pm.length - 1 != index ? '，' : '' }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="研发负责人">
          <span v-for="(item, index) in businessInfo.developer" :key="index">
            {{ item.username }}{{ businessInfo.developer.length - 1 != index ? '，' : '' }}
          </span>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div>
      <div class="mt-4">
        <a-descriptions>
          <a-descriptions-item label="关联应用" :span="3">
            <a-table
              :columns="associateAppsColumns"
              :data-source="associateAppsList"
              row-key="id"
              :pagination="false"
              :loading="associateAppsLoading"
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
  import { ref, reactive, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
    Tag as ATag,
  } from 'ant-design-vue';

  import { useBusinessDialog } from '../hooks/useBusinessDialog';

  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  import { getAppsBusinessDetails } from '@/api/resourceManage/applicationResources/applicationManage';

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
    kind: '',
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
  getAppsBusinessDetailsRequest();
  const associateAppsList = ref<API.HostManageListItem[]>([]);
  const diskListQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
  });
  // 所属机房
  const associateAppsColumns = [
    {
      title: '名称',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '应用层级',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '中文别名',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '备注',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
  ];
  const associateAppsLoading = ref(false);
  // 获取主机列表
  async function getHostMangeListRequest() {
    try {
      if (associateAppsLoading.value) {
        return;
      }
      associateAppsLoading.value = true;
      const data = await getHostMangeList(diskListQuery);
      associateAppsLoading.value = false;
      associateAppsList.value = data.results;
    } catch (error) {
      associateAppsLoading.value = false;
      console.error(error);
    }
  }
  // getHostMangeListRequest();
  // 设置所属业务
  function onBusiness() {
    showAddBusinessDialogChange();
  }
</script>
<style lang="less" scoped>
  :deep(.ant-descriptions-item-label) {
    width: 120px;
    display: flex;
    justify-content: flex-end;
    padding-right: 2px;
  }
</style>
