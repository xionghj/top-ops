<template>
  <div>
    <Breadcrumb>
      <template #right>
        <span class="cursor-pointer hover:text-blue-500">更多操作</span>
      </template>
    </Breadcrumb>
    <div class="p-4 bg-white">
      <div class="flex justify-between mb-4">
        <div class="w-80">
          <a-input v-model:value="search" placeholder="根据关键词搜索" />
        </div>
      </div>
      <a-spin :spinning="spinning">
        <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="data"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <a>
                {{ record.name }}
              </a>
            </template>
          </template>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, reactive } from 'vue';
  import { Table as ATable, Spin as ASpin, Input as AInput } from 'ant-design-vue';

  type Key = string | number;

  interface DataType {
    key: Key;
    name: string;
    age: number;
    address: string;
  }

  const data: DataType[] = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }
  const search = ref('');
  const columns = [
    {
      title: '主机名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'IP 地址',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'CPU 核数',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '内存大小',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'OS 发行版本',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '运维负责人',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Agent 状态',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '最近访问',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const spinning = ref(false);
  const state = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
  }>({
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  });
  const hasSelected = computed(() => state.selectedRowKeys.length > 0);

  const start = () => {
    state.loading = true;
    // ajax request after empty completing
    setTimeout(() => {
      state.loading = false;
      state.selectedRowKeys = [];
    }, 1000);
  };
  const onSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    state.selectedRowKeys = selectedRowKeys;
  };
</script>
