<!-- 主机管理-列表详情-服务列表-->
<template>
  <div>
    <div class="px-6 bg-white">
      <div class="flex justify-between mb-4">
        <div class="w-56">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getHostMangeListRequest()"
          />
        </div>
      </div>
      <a-table
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="list"
        row-key="id"
        :pagination="pagination"
        :loading="loading "
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'agent_status'">
            <a-tag :color="'green'">
              {{ record.agent_status }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { Table as ATable, Input as AInput, Tag as ATag } from 'ant-design-vue';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  type Key = string | number;
  const router = useRouter();
  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
  });
  const total = ref(0);
  const columns = [
    {
      title: '名称',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '工作目录',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '绑定信息',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '启动用户',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: '服务状态',
      dataIndex: 'os_release',
      key: 'os_release',
    },
    {
      title: '最近修改',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
  ];
  const loading = ref(false);
  const pagination = computed(() => ({
    total: total.value,
    current: listQuery.page,
    pageSize: listQuery.pageSize,
    showTotal: (total: number) => `总共 ${total} 项`,
    defaultPageSize: 10,
    showSizeChanger: true, // 是否显示pagesize选择
    showQuickJumper: true, // 是否显示跳转窗
  }));

  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.pageSize = pag.pageSize;
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
  getHostMangeListRequest();
  const state = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
  }>({
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  });
  const onSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    state.selectedRowKeys = selectedRowKeys;
  };
  const onJumeTo = function () {
    router.push({ name: 'hostDetails' });
  };
</script>
