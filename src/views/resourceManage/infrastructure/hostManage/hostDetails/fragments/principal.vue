<!-- 主机管理-列表详情-负责人-->
<template>
  <div>
    <div class="px-6 bg-white">
      <div class="flex mb-4">
        <div class="w-56 mr-3">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getHostMangeListRequest()"
          />
        </div>
        <a-select v-model:value="listQuery.person" class="w-56">
          <a-select-option v-for="(item, index) in personOption" :key="index" :value="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>
      <a-table
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="list"
        row-key="id"
        :pagination="pagination"
        :loading="lodding"
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
  import {
    Table as ATable,
    Input as AInput,
    Tag as ATag,
    Select as ASelect,
    SelectOption as ASelectOption,
  } from 'ant-design-vue';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  type Key = string | number;
  const router = useRouter();
  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
    person: '',
  });
  const personOption = ref([
    {
      name: '第一负责人',
      id: '1',
    },
    {
      name: '第二负责人',
      id: '2',
    },
  ]);
  const total = ref(0);
  const columns = [
    {
      title: '用户名',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '花名',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '邮箱',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '状态',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: '联系电话',
      dataIndex: 'os_release',
      key: 'os_release',
    },
    {
      title: '最近修改',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
  ];
  const lodding = ref(false);
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
      if (lodding.value) {
        return;
      }
      lodding.value = true;
      const data = await getHostMangeList(listQuery);
      lodding.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      lodding.value = false;
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
