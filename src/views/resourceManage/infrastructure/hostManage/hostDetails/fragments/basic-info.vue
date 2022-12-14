<template>
  <div>
    <a-descriptions :column="2">
      <a-descriptions-item label="IP地址"> {{ basicInfo.ip }}</a-descriptions-item>
      <a-descriptions-item label="主机名"></a-descriptions-item>
      <a-descriptions-item label="主机环境"></a-descriptions-item>
      <a-descriptions-item label="Agent状态">{{ basicInfo.agent_status }}</a-descriptions-item>
      <a-descriptions-item label="物理地址"> </a-descriptions-item>
      <a-descriptions-item label="第一负责人">
        <span v-for="(item, index) in basicInfo.first_owner" :key="index"
          >{{ item.username }}{{ index != basicInfo.first_owner.length - 1 ? ',' : '' }}</span
        >
      </a-descriptions-item>
      <a-descriptions-item label="运营状态"> </a-descriptions-item>
      <a-descriptions-item label="第二负责人">
        <span v-for="(item, index) in basicInfo.second_owner" :key="index"
          >{{ item.username }}{{ index != basicInfo.second_owner.length - 1 ? ',' : '' }}</span
        >
      </a-descriptions-item>
      <a-descriptions-item label="Salt-key"> </a-descriptions-item>
      <a-descriptions-item label="Salt-master"> </a-descriptions-item>
    </a-descriptions>
  </div>
  <div class="mt-4">
    <a-descriptions :column="2">
      <a-descriptions-item label="操作系统"></a-descriptions-item>
      <a-descriptions-item label="内核发行版本"></a-descriptions-item>
      <a-descriptions-item label="系统架构"></a-descriptions-item>
      <a-descriptions-item label="操作系统发行版"></a-descriptions-item>
      <a-descriptions-item label="操作系统类型"> </a-descriptions-item>
    </a-descriptions>
  </div>
  <div class="mt-4">
    <a-descriptions :column="2">
      <a-descriptions-item label="CPU核数"></a-descriptions-item>
      <a-descriptions-item label="CPU型号"></a-descriptions-item>
      <a-descriptions-item label="CPU频率"></a-descriptions-item>
      <a-descriptions-item label="内存大小"></a-descriptions-item>
      <a-descriptions-item label="机器型号"> </a-descriptions-item>
    </a-descriptions>
  </div>
  <div class="mt-4">
    <a-descriptions :column="2">
      <a-descriptions-item label="资产编号"></a-descriptions-item>
      <a-descriptions-item label="Agent 版本"></a-descriptions-item>
      <a-descriptions-item label="数据中心"></a-descriptions-item>
      <a-descriptions-item label="备注">{{ basicInfo.description }}</a-descriptions-item>
      <a-descriptions-item label="供应商"> </a-descriptions-item>
      <a-descriptions-item label="DNS地址"> </a-descriptions-item>
      <a-descriptions-item label="录入时间"> </a-descriptions-item>
    </a-descriptions>
  </div>
  <div v-if="basicInfoExpand">
    <div class="mt-4">
      <a-descriptions>
        <a-descriptions-item label="磁盘信息" :span="3">
          <a-table
            :columns="diskColumns"
            :data-source="diskList"
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
    <div class="mt-4">
      <a-descriptions>
        <a-descriptions-item label="网卡信息" :span="3">
          <a-table
            :columns="networkCardColumns"
            :data-source="diskList"
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
    <div class="mt-4">
      <a-descriptions>
        <a-descriptions-item label="服务信息" :span="3">
          <a-table
            :columns="serveColumns"
            :data-source="diskList"
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
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
    Tag as ATag,
  } from 'ant-design-vue';
  import {
    getHostMangeList,
    getHostMangeDetails,
  } from '@/api/resourceManage/infrastructure/hostManage';
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
  const diskColumns = [
    {
      title: '磁盘',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '文件类型',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '挂载点',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '容量',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: '可用容量',
      dataIndex: 'os_release',
      key: 'os_release',
    },
    {
      title: '使用率',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
  ];
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
      diskList.value = data.results;
    } catch (error) {
      diskLoading.value = false;
      console.error(error);
    }
  }
  // getHostMangeListRequest();
  // 网卡信息
  const networkCardColumns = [
    {
      title: '网卡',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '状态',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '关联 IP',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '子网掩码',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: '速度',
      dataIndex: 'os_release',
      key: 'os_release',
    },
    {
      title: 'Mac 地址',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
  ];
  // 服务信息
  const serveColumns = [
    {
      title: '服务名称',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '工作目录',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '执行路径',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '监听地址',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: '监听端口',
      dataIndex: 'os_release',
      key: 'os_release',
    },
    {
      title: '执行用户',
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
