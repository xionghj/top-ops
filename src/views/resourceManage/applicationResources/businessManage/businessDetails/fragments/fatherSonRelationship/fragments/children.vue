<!-- 业务管理-业务详情-父子关系 -->
<template>
  <div class="px-6 py-4 bg-white">
    <div class="flex justify-between mb-4">
      <div class="w-56">
        <a-input
          v-model:value="listQuery.search"
          placeholder="根据关键词搜索"
          @change="getChildrenBusinessListRequest()"
        />
      </div>
    </div>
    <a-table
      :row-selection="{
        selectedRowKeys: selectChildren,
        onChange: onSelectChange,
        columnWidth: 40,
      }"
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
          <span class="text-blue-500">
            {{ record.name }}
          </span>
        </template>
        <template v-if="column.key === 'pm'">
          <span v-for="(item, index) in record.pm" :key="index">
            {{ item.username }}{{ record.pm.length - 1 != index ? '，' : '' }}
          </span>
        </template>
        <template v-if="column.key === 'children'">
          <span v-for="(item, index) in record.children" :key="index">
            {{ item.name }}{{ record.children.length - 1 != index ? '，' : '' }}
          </span>
        </template>
        <template v-if="column.key === 'parent'">
          <span>
            {{ record.parent && record.parent.name }}
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed, watch } from 'vue';
  import { useRoute } from 'vue-router';

  import { Table as ATable, Input as AInput } from 'ant-design-vue';
  import { useBusinessRelation } from '../../../hooks/useBusinessRelation';
  import { useBusinessDialog } from '../../../hooks/useBusinessDialog';

  import { getBusinessChildrenList } from '@/api/resourceManage/applicationResources/businessManage';

  const { showAddBusinessDialog } = useBusinessDialog();
  const { selectChildren, isRefresh } = useBusinessRelation();

  const route = useRoute();

  type Key = string | number;
  watch(
    () => showAddBusinessDialog.value,
    (bol) => {
      if (!bol) {
        getChildrenBusinessListRequest();
      }
    },
  );
  watch(
    () => isRefresh.value,
    () => {
      getChildrenBusinessListRequest();
    },
  );
  const list = ref<API.RackManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 10,
  });
  const total = ref(0);
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '业务类型',
      dataIndex: 'kind',
      key: 'kind',
    },
    {
      title: '关联应用',
      dataIndex: 'pm',
      key: 'pm',
    },
    {
      title: '子业务',
      dataIndex: 'children',
      key: 'children',
    },
    {
      title: '父业务',
      dataIndex: 'parent',
      key: 'parent',
    },
    {
      title: '产品经理',
      dataIndex: 'pm',
      key: 'pm',
    },
    {
      title: '最近更新',
      dataIndex: 'pm',
      key: 'pm',
    },
  ];
  const loading = ref(false);
  const pagination = computed(() => ({
    total: total.value,
    current: listQuery.page,
    pageSize: listQuery.page_size,
    showTotal: (total: number) => `总共 ${total} 项`,
    defaultPageSize: 10,
    showSizeChanger: true, // 是否显示pagesize选择
    showQuickJumper: true, // 是否显示跳转窗
  }));

  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getChildrenBusinessListRequest();
  };
  // 获取列表
  async function getChildrenBusinessListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getBusinessChildrenList(id, listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  getChildrenBusinessListRequest();
  const onSelectChange = (selectedRowKeys: Key[]) => {
    selectChildren.value = selectedRowKeys;
  };
</script>
