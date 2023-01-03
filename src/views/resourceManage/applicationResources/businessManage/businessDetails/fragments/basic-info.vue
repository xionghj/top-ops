<!-- 业务管理-列表详情-基本信息-->
<template>
  <div>
    <a-descriptions :column="2" :label-style="{ width: '100px' }">
      <a-descriptions-item label="名称"> {{ basicInfo.name }}</a-descriptions-item>
      <a-descriptions-item label="类型">{{ basicInfo.kind }}</a-descriptions-item>
      <a-descriptions-item label="备注说明">{{ basicInfo.description }}</a-descriptions-item>
      <a-descriptions-item label="研发负责人"
        ><span
          v-for="(item, index) in basicInfo.developer"
          :key="index"
          class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
        >
          {{ item.username }}
        </span></a-descriptions-item
      >
      <a-descriptions-item label="产品经理"
        ><span
          v-for="(item, index) in basicInfo.pm"
          :key="index"
          class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
        >
          {{ item.username }}
        </span></a-descriptions-item
      >
      <a-descriptions-item label="测试负责人"
        ><span
          v-for="(item, index) in basicInfo.tester"
          :key="index"
          class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
        >
          {{ item.username }}
        </span></a-descriptions-item
      >
    </a-descriptions>
  </div>
  <div>
    <div class="mt-4">
      <a-descriptions :label-style="{ width: '100px' }">
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
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
  } from 'ant-design-vue';
  import { getCMDBBusinessDetails } from '@/api/resourceManage/applicationResources/businessManage';
  import { getCMDBAppsList } from '@/api/resourceManage/applicationResources/applicationManage';
  const route = useRoute();

  type Creator = {
    id: number | string;
    username: string;
    name: string;
  };
  type Person = {
    email: string;
    id: number;
    is_active: boolean;
    name: string | null;
    telephone: string | null;
    updated_at: string;
    username: string;
  };
  interface BasicInfo {
    creator: Creator;
    description: string;
    id: string;
    kind: string;
    name: string;
    parent: string;
    apps: string[];
    pm: Person[];
    children: [];
    developer: Person[];
    tester: Person[];
  }
  // 获取基本信息
  const basicInfo = ref<BasicInfo>({
    creator: {
      id: '',
      username: '',
      name: '',
    },
    description: '',
    id: '',
    kind: '',
    name: '',
    parent: '',
    apps: [],
    pm: [],
    children: [],
    developer: [],
    tester: [],
  });
  const detailsLoading = ref(false);
  async function getBusinessDetails() {
    try {
      if (detailsLoading.value) {
        return;
      }
      detailsLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getCMDBBusinessDetails(id);
      basicInfo.value = data;
      detailsLoading.value = false;
    } catch (error) {
      detailsLoading.value = false;
      console.error(error);
    }
  }
  getBusinessDetails();
  // 关联
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
      const id: any = route.query && route.query.id;
      const params = {
        business: id,
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
  getApplicationListRequest();
</script>
