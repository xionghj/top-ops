<!-- 业务拓扑-主机列表 -->
<template>
  <div>
    <div class="flex justify-between mb-4">
      <div class="w-56">
        <a-input
          v-model:value="listQuery.search"
          placeholder="根据关键词搜索"
          @change="onQuery()"
        />
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="list"
      row-key="id"
      :pagination="pagination"
      children-column-name="noChildren"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'ip'">
          <span
            class="text-blue-500 cursor-pointer hover:text-blue-700"
            @click="onJumeTo(record.id)"
          >
            {{ record.ip }}
          </span>
        </template>
        <template v-if="column.key === 'first_owner'">
          <span v-for="(item, index) in record.first_owner" :key="index">
            {{ item.username }}{{ record.first_owner.length - 1 != index ? '，' : '' }}
          </span>
        </template>
        <template v-if="column.key === 'agent_status'">
          <div class="flex items-center">
            <ExclamationCircleFilled
              v-if="record.agent_status == 'not_install'"
              :style="{ fontSize: '14px', color: '#e38306' }"
            />
            <CheckCircleFilled v-else :style="{ fontSize: '14px', color: '#52c41a' }" />
            <span
              class="ml-[7px]"
              :class="[record.agent_status == 'not_install' ? 'text-[#e38306]' : 'text-[#52c41a]']"
              >{{ agentStatusMap[record.agent_status] }}</span
            >
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { debounce } from 'lodash-es';
  import { Table as ATable, Input as AInput } from 'ant-design-vue';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  const router = useRouter();
  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 5,
    business: '',
  });
  const total = ref(0);
  const agentStatusMap: any = {
    normal: '正常',
    abnormal: '异常',
    not_install: '未安装',
  };
  const columns = [
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: 'CPU 核数',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '内存大小',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: '运维负责人',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
    {
      title: 'Agent 状态',
      dataIndex: 'agent_status',
      key: 'agent_status',
    },
  ];
  const loading = ref(false);
  const pagination = computed(() => ({
    total: total.value,
    current: listQuery.page,
    pageSize: listQuery.page_size,
    showTotal: (total: number) => `总共 ${total} 项`,
    defaultPageSize: 5,
    showSizeChanger: true, // 是否显示pagesize选择
    showQuickJumper: true, // 是否显示跳转窗
  }));

  // 防抖查询
  const onQuery = debounce(getHostMangeListRequest, 500);
  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getHostMangeListRequest();
  };
  // 获取主机列表
  async function getHostMangeListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const data = await getHostMangeList(listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  const onJumeTo = function (ids: number) {
    router.push({ name: 'hostDetails', query: { id: ids } });
  };
  // 刷新列表
  function refresh(businessId: string) {
    listQuery.business = businessId;
    getHostMangeListRequest();
  }
  defineExpose({ refresh });
</script>
