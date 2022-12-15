<!-- 数据中心-列表详情-基本信息-->
<template>
  <div>
    <a-descriptions :column="2">
      <a-descriptions-item label="名称"> {{ basicInfo.name }}</a-descriptions-item>
      <a-descriptions-item label="简写">{{ basicInfo.short_name }}</a-descriptions-item>
      <a-descriptions-item label="联系人">{{ basicInfo.contact }}</a-descriptions-item>
      <a-descriptions-item label="联系电话">{{ basicInfo.telephone }}</a-descriptions-item>
      <a-descriptions-item label="机房地址">{{ basicInfo.address }}</a-descriptions-item>
      <a-descriptions-item label="机房状态">{{
        basicInfo.status == 1 ? '启用' : '停用'
      }}</a-descriptions-item>
    </a-descriptions>
  </div>
  <div>
    <div class="mt-4">
      <a-descriptions>
        <a-descriptions-item label="机柜信息" :span="3">
          <a-table
            :columns="rackColumns"
            :data-source="rackList"
            row-key="id"
            :pagination="false"
            :loading="diskLoading"
            class="w-full"
          >
          </a-table>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="mt-4">
      <a-descriptions>
        <a-descriptions-item label="主机列表" :span="3">
          <a-table
            :columns="networkCardColumns"
            :data-source="hostList"
            row-key="id"
            :pagination="false"
            :loading="diskLoading"
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
<script lang="ts" setup>
  import { ref, reactive, toRefs } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
    Tag as ATag,
  } from 'ant-design-vue';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  import { getIdcDetails, getIdcRacks } from '@/api/resourceManage/infrastructure/idcManage';
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
  async function getIdcInfo() {
    try {
      if (idcInfoLoading.value) {
        return;
      }
      idcInfoLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getIdcDetails(id);
      basicInfo.value = data;
      idcInfoLoading.value = false;
    } catch (error) {
      idcInfoLoading.value = false;
      console.error(error);
    }
  }
  getIdcInfo();
  const hostRackLodding = ref(false);
  // 获取所属机柜
  const rackColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '可用U数',
      dataIndex: 'free_unum',
      key: 'free_unum',
    },
    {
      title: '机柜U数',
      dataIndex: 'unum',
      key: 'unum',
    },
    {
      title: '机柜编号',
      dataIndex: 'code',
      key: 'cpu_count',
    },
  ];
  const rackList = ref([]);
  async function getIdcRacksRequest() {
    try {
      if (hostRackLodding.value) {
        return;
      }
      hostRackLodding.value = true;
      const id: any = route.query && route.query.id;
      const data = await getIdcRacks(id);
      rackList.value = data.results;
      hostRackLodding.value = false;
    } catch (error) {
      hostRackLodding.value = false;
      console.error(error);
    }
  }
  getIdcRacksRequest();
  const hostList = ref<API.HostManageListItem[]>([]);
  const diskListQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
  });
  const diskLoading = ref(false);
  // 获取主机列表
  async function getHostMangeListRequest() {
    try {
      if (diskLoading.value) {
        return;
      }
      diskLoading.value = true;
      const data = await getHostMangeList(diskListQuery);
      diskLoading.value = false;
      hostList.value = data.results;
    } catch (error) {
      diskLoading.value = false;
      console.error(error);
    }
  }
  // getHostMangeListRequest();
  // 主机信息
  const networkCardColumns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '主机环境',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: 'CPU 核数',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: '内存大小 (G)',
      dataIndex: 'os_release',
      key: 'os_release',
    },
    {
      title: '运维负责人',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
    {
      title: 'Agnet 状态',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
  ];
</script>
<style lang="less" scoped>
  :deep(.ant-descriptions-item-label) {
    width: 120px;
    display: flex;
    justify-content: flex-end;
    padding-right: 2px;
  }
</style>
