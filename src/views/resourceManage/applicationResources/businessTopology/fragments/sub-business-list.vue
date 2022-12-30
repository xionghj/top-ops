<!-- 业务拓扑-子业务列表 -->
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
        <template v-if="column.key === 'name'">
          <span
            class="text-blue-500 cursor-pointer hover:text-blue-700"
            @click="onJumeTo(record.id)"
          >
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
            {{ item.username }}{{ record.children.length - 1 != index ? '，' : '' }}
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
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { debounce } from 'lodash-es';
  import { Table as ATable, Input as AInput } from 'ant-design-vue';
  import { getBusinessChildrenList } from '@/api/resourceManage/applicationResources/businessManage';

  const router = useRouter();
  const list = ref<API.RackManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 5,
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
      title: '产品经理',
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
  const onQuery = debounce(getBusinessChildrenListRequest, 500);
  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getBusinessChildrenListRequest();
  };
  // 获取子业务列表
  async function getBusinessChildrenListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const data = await getBusinessChildrenList(businessId.value, listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  // 业务id
  const businessId = ref();
  // 刷新列表
  function refresh(id: number) {
    businessId.value = id;
    getBusinessChildrenListRequest();
  }
  const onJumeTo = function (id: number) {
    router.push({ name: 'applicationDetails', query: { id } });
  };
  defineExpose({ refresh });
</script>
