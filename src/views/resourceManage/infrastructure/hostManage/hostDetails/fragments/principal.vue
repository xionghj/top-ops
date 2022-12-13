<!-- 主机管理-列表详情-负责人-->
<template>
  <div>
    <div class="px-6 bg-white">
      <div class="flex mb-4">
        <div class="w-56 mr-3">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getHostOwnerRequest()"
          />
        </div>
        <a-select v-model:value="listQuery.role" class="w-56" @change="getHostOwnerRequest()">
          <a-select-option v-for="(item, index) in roleOption" :key="index" :value="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>
      <a-table
        :row-selection="{ selectedRowKeys: state.selectPrincipal, onChange: onSelectChange }"
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
  import { useRouter, useRoute } from 'vue-router';
  import {
    Table as ATable,
    Input as AInput,
    Tag as ATag,
    Select as ASelect,
    SelectOption as ASelectOption,
  } from 'ant-design-vue';
  import { getHostOwner } from '@/api/resourceManage/infrastructure/hostManage';
  type Key = string | number;
  const router = useRouter();
  const route = useRoute();
  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
    role: 'first_owner',
  });
  const roleOption = ref([
    {
      name: '第一负责人',
      id: 'first_owner',
    },
    {
      name: '第二负责人',
      id: 'second_owner',
    },
  ]);
  const total = ref(0);
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '花名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: '联系电话',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '最近修改',
      dataIndex: 'updated_at',
      key: 'updated_at',
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
    getHostOwnerRequest();
  };
  // 获取负责人列表
  async function getHostOwnerRequest() {
    try {
      if (lodding.value) {
        return;
      }
      lodding.value = true;
      const id: any = route.query && route.query.id;
      const data = await getHostOwner(id, listQuery);
      lodding.value = false;
      list.value = data;
      total.value = data.count;
    } catch (error) {
      lodding.value = false;
      console.error(error);
    }
  }
  getHostOwnerRequest();
  const state = reactive<{
    selectPrincipal: Key[];
  }>({
    selectPrincipal: [],
  });
  const selectPrincipal = ref<any>([]);
  const onSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    state.selectPrincipal = selectedRowKeys;
    selectPrincipal.value = selectedRowKeys;
  };
  defineExpose({ selectPrincipal, getHostOwnerRequest });
</script>
