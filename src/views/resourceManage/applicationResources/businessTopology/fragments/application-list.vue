<!-- 业务拓扑-应用列表 -->
<template>
  <div>
    <div class="flex justify-between mb-4">
      <div class="w-56">
        <a-input
          v-model:value="listQuery.search"
          placeholder="根据关键词搜索"
          @change="getApplicationListRequest()"
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
        <template v-if="column.key === 'name'">
          <span
            class="text-blue-500 cursor-pointer hover:text-blue-700"
            @click="onJumeTo(record.id)"
          >
            {{ record.name }}
          </span>
        </template>
        <template v-if="column.key === 'business'">
          <span v-for="(item, index) in record.business" :key="index">
            {{ item.name }}{{ record.business.length - 1 != index ? '，' : '' }}
          </span>
        </template>
        <template v-if="column.key === 'developer'">
          <span v-for="(item, index) in record.developer" :key="index">
            {{ item.username }}{{ record.developer.length - 1 != index ? '，' : '' }}
          </span>
        </template>
        <template v-if="column.key === 'tester'">
          <span v-for="(item, index) in record.tester" :key="index">
            {{ item.username }}{{ record.tester.length - 1 != index ? '，' : '' }}
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { Table as ATable, Input as AInput } from 'ant-design-vue';
  import { getCMDBAppsList } from '@/api/resourceManage/applicationResources/applicationManage';
  type Key = string | number;
  const router = useRouter();
  const list = ref<API.RackManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 5,
    business: '',
  });
  const total = ref(0);
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属业务',
      dataIndex: 'business',
      key: 'business',
    },
    {
      title: '开发负责人',
      dataIndex: 'developer',
      key: 'developer',
    },
    {
      title: '运维负责人',
      dataIndex: 'pm',
      key: 'pm',
    },
    {
      title: '测试负责人',
      dataIndex: 'tester',
      key: 'tester',
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

  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getApplicationListRequest();
  };
  // 获取应用列表
  async function getApplicationListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const data = await getCMDBAppsList(listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  // 刷新列表
  function refresh(businessId: string) {
    listQuery.business = businessId;
    getApplicationListRequest();
  }
  const state = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
  }>({
    selectedRowKeys: [],
    loading: false,
  });
  const onJumeTo = function (id: number) {
    router.push({ name: 'applicationDetails', query: { id } });
  };
  defineExpose({ refresh });
</script>
