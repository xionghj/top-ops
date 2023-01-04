<template>
  <div class="w-full flex flex-col">
    <div v-if="!parentInfo.id" class="w-full min-h-[271px] flex mt-6 px-4">
      <div
        class="w-full text-[#FFA235] h-[80px] bg-[#fcf8f2] flex items-center px-4 border-l-[3px] border-[#ffa235]"
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
          <a-descriptions :column="2" :label-style="{ width: '90px' }">
            <a-descriptions-item label="名称"> {{ parentInfo.name }}</a-descriptions-item>
            <a-descriptions-item label="类型">{{
              parentInfo.kind && parentInfo.kind.name
            }}</a-descriptions-item>
            <a-descriptions-item label="备注说明">{{ parentInfo.description }}</a-descriptions-item>
            <a-descriptions-item label="测试负责人">
              <span
                v-for="(item, index) in parentInfo.tester"
                :key="index"
                class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
              >
                {{ item.username }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="产品经理">
              <span
                v-for="(item, index) in parentInfo.pm"
                :key="index"
                class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
              >
                {{ item.username }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="研发负责人">
              <span
                v-for="(item, index) in parentInfo.developer"
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
            <a-descriptions :label-style="{ width: '90px' }">
              <a-descriptions-item label="关联应用" :span="3">
                <a-table
                  :columns="applicationColumns"
                  :data-source="applicationList"
                  row-key="id"
                  :pagination="false"
                  :loading="applicationLodding"
                  class="w-full"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'hierarchy'">
                      <span>
                        {{ record.hierarchy && record.hierarchy.name }}
                      </span>
                    </template>
                  </template>
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
  import { ref, watch, onMounted } from 'vue';
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
  import { getCMDBAppsList } from '@/api/resourceManage/applicationResources/applicationManage';

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
  const applicationList = ref([]);
  const applicationLodding = ref(false);
  // 获取应用列表
  async function getApplicationListRequest() {
    try {
      if (applicationLodding.value) {
        return;
      }
      applicationLodding.value = true;
      const params = {
        business: parentInfo.value.id.toString(),
        search: '',
        page: 1,
        page_size: 100,
      };
      const data = await getCMDBAppsList(params);
      applicationList.value = data.results;
      applicationLodding.value = false;
    } catch (error) {
      applicationLodding.value = false;
      console.error(error);
    }
  }

  const parentInfo = ref({
    id: '',
    name: '',
    kind: {
      id: '',
      name: '',
    },
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
  onMounted(async () => {
    await getParentBusinessDetailsRequest();
    getApplicationListRequest();
  });
</script>
