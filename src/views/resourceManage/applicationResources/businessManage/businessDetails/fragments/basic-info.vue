<!-- 业务管理-列表详情-基本信息-->
<template>
  <div>
    <a-descriptions :column="2">
      <a-descriptions-item label="名称"> {{ basicInfo.name }}</a-descriptions-item>
      <a-descriptions-item label="类型">{{ basicInfo.short_name }}</a-descriptions-item>
      <a-descriptions-item label="备注说明">{{ basicInfo.description }}</a-descriptions-item>
      <a-descriptions-item label="运维负责人">{{ basicInfo.telephone }}</a-descriptions-item>
      <a-descriptions-item label="产品经理">{{ basicInfo.address }}</a-descriptions-item>
      <a-descriptions-item label="研发负责人">{{ basicInfo.address }}</a-descriptions-item>
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
</template>
<script lang="ts" setup>
  import { ref, reactive, toRefs } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
    Tag as ATag,
  } from 'ant-design-vue';
  import { getIdcDetails, getIdcRacks } from '@/api/resourceManage/infrastructure/idcManage';
  import { getCMDBBusinessDetails } from '@/api/resourceManage/applicationResources/businessManage';
  const route = useRoute();
  // 获取基本信息
  const basicInfo = ref({
    name: '',
    short_name: '',
    contact: '',
    telephone: '',
    address: '',
    status: 1,
    description: '',
  });
  const idcInfoLoading = ref(false);
  async function getBusinessDetails() {
    try {
      if (idcInfoLoading.value) {
        return;
      }
      idcInfoLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getCMDBBusinessDetails(id);
      basicInfo.value = data;
      idcInfoLoading.value = false;
    } catch (error) {
      idcInfoLoading.value = false;
      console.error(error);
    }
  }
  getBusinessDetails();
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
  async function getIdcRacksRequest() {
    try {
      if (applicationLodding.value) {
        return;
      }
      applicationLodding.value = true;
      const id: any = route.query && route.query.id;
      const data = await getIdcRacks(id);
      applicationList.value = data.results;
      applicationLodding.value = false;
    } catch (error) {
      applicationLodding.value = false;
      console.error(error);
    }
  }
  // getIdcRacksRequest();
</script>
<style lang="less" scoped>
  :deep(.ant-descriptions-item-label) {
    width: 120px;
    display: flex;
    justify-content: flex-end;
    padding-right: 2px;
  }
</style>
