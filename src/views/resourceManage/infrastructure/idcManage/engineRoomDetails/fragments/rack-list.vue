<!-- 数据中心-机柜列表-->
<template>
  <div class="w-full">
    <div class="px-6 bg-white">
      <div class="flex justify-between mb-4">
        <div class="w-56">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getIdcRacksRequest()"
          />
        </div>
      </div>
      <a-table
        :row-selection="{ selectedRowKeys: selectRacks, onChange: onSelectChange, columnWidth: 40 }"
        :columns="columns"
        :data-source="list"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
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
  import { useRoute } from 'vue-router';
  import { Table as ATable, Input as AInput, Tag as ATag } from 'ant-design-vue';
  import { getIdcRacks } from '@/api/resourceManage/infrastructure/idcManage';
  type Key = string | number;
  const route = useRoute();
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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'hostname',
    },
    {
      title: '机柜U数',
      dataIndex: 'unum',
      key: 'unum',
    },
    {
      title: '可用U数',
      dataIndex: 'free_unum',
      key: 'free_unum',
    },
    {
      title: '最近访问',
      dataIndex: 'updated_at',
      key: 'updated_at',
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
    getIdcRacksRequest();
  };
  // 获取机柜列表
  async function getIdcRacksRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getIdcRacks(id);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  getIdcRacksRequest();
  const selectRacks = ref<Key[]>([]);
  const onSelectChange = (selectedRowKeys: Key[]) => {
    selectRacks.value = selectedRowKeys;
  };
  defineExpose({ getIdcRacksRequest, selectRacks });
</script>
