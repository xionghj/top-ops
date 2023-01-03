<!-- 业务管理-列表详情-应用列表-->
<template>
  <div>
    <div class="px-6 bg-white">
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
        :row-selection="{
          selectedRowKeys: state.selectedRowKeys,
          onChange: onSelectChange,
          columnWidth: 40,
        }"
        :columns="columns"
        :data-source="list"
        row-key="id"
        :pagination="pagination"
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
              {{ item.name }}{{ record.business.length - 1 != index ? '; ' : '' }}
            </span>
          </template>
          <template v-if="column.key === 'developer'">
            <span v-for="(item, index) in record.developer" :key="index">
              {{ item.username }}{{ record.developer.length - 1 != index ? '; ' : '' }}
            </span>
          </template>
          <template v-if="column.key === 'owner'">
            <span v-for="(item, index) in record.owner" :key="index">
              {{ item.username }}{{ record.owner.length - 1 != index ? '; ' : '' }}
            </span>
          </template>
          <template v-if="column.key === 'tester'">
            <span v-for="(item, index) in record.tester" :key="index">
              {{ item.username }}{{ record.tester.length - 1 != index ? '; ' : '' }}
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { debounce } from 'lodash-es';
  import { Table as ATable, Input as AInput } from 'ant-design-vue';
  import { getCMDBAppsList } from '@/api/resourceManage/applicationResources/applicationManage';
  type Key = string | number;
  const router = useRouter();
  const route = useRoute();

  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 5,
    business: '',
  });
  const total = ref(0);
  const columns = [
    {
      title: '应用名',
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
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '测试负责人',
      dataIndex: 'tester',
      key: 'tester',
      width: 100,
    },
    {
      title: '最近更新',
      dataIndex: 'updated_at',
      key: 'updated_at',
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

  const onQuery = debounce(getCMDBAppsListRequest, 500);
  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getCMDBAppsListRequest();
  };
  // 获取应用列表
  async function getCMDBAppsListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      listQuery.business = id;
      const data = await getCMDBAppsList(listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  getCMDBAppsListRequest();
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
  const onJumeTo = function (id: number) {
    router.push({ name: 'applicationDetails', query: { id } });
  };
</script>
