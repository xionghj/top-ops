<!-- 主机管理-列表详情-所属机柜-->
<template>
  <div v-if="!rackInfo" class="flex">
    <div>请<span>设置</span>所在机柜</div>
  </div>
  <template v-else>
    <div>
      <a-descriptions :column="2">
        <a-descriptions-item label="名称"> {{ basicInfo.ip }}</a-descriptions-item>
        <a-descriptions-item label="机柜编号"></a-descriptions-item>
        <a-descriptions-item label="机柜U数"></a-descriptions-item>
        <a-descriptions-item label="可用U数">{{ basicInfo.agent_status }}</a-descriptions-item>
        <a-descriptions-item label="备注说明"> </a-descriptions-item>
      </a-descriptions>
    </div>
    <div>
      <div class="mt-4">
        <a-descriptions>
          <a-descriptions-item label="所属机房" :span="3">
            <a-table
              :columns="diskColumns"
              :data-source="diskList"
              row-key="id"
              :pagination="false"
              :loading="diskLodding"
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
      <div class="mt-4">
        <a-descriptions>
          <a-descriptions-item label="主机列表" :span="3">
            <a-table
              :columns="networkCardColumns"
              :data-source="diskList"
              row-key="id"
              :pagination="false"
              :loading="diskLodding"
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
  import { ref, reactive, toRefs } from 'vue';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
    Tag as ATag,
  } from 'ant-design-vue';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  const props = defineProps({
    basicInfoExpand: Boolean,
    basicInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  const { basicInfoExpand, basicInfo } = toRefs(props);
  const diskList = ref<API.HostManageListItem[]>([]);
  const diskListQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
  });
  const rackInfo = ref(true);
  // 所属机房
  const diskColumns = [
    {
      title: '名称',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '机房地址',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '联系人',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
  ];
  const diskLodding = ref(false);
  // 获取主机列表
  async function getHostMangeListRequest() {
    try {
      if (diskLodding.value) {
        return;
      }
      diskLodding.value = true;
      const data = await getHostMangeList(diskListQuery);
      diskLodding.value = false;
      diskList.value = data.results;
    } catch (error) {
      diskLodding.value = false;
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
