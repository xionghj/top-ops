<!-- 应用管理-列表 -->
<template>
  <div>
    <Breadcrumb>
      <template #right>
        <div class="flex">
          <div class="mr-2 cursor-pointer hover:text-blue-500" @click="onAddBusiness('add')"
            >新建业务</div
          >
          <a-dropdown placement="bottom">
            <div class="cursor-pointer hover:text-blue-500" @click.prevent> 更多操作 </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">导入</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">手工导入</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </Breadcrumb>
    <div class="p-6 bg-white">
      <div class="flex justify-between mb-4">
        <div class="w-56">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getCMDBAppsListRequest()"
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
              {{ item.name }}{{ record.business.length - 1 != index ? '/' : '' }}
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
  import { useRouter } from 'vue-router';
  import {
    Table as ATable,
    Input as AInput,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
  } from 'ant-design-vue';
  import { getCMDBAppsList } from '@/api/resourceManage/applicationResources/applicationManage';
  type Key = string | number;
  const router = useRouter();
  const list = ref<API.RackManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    pageSize: 5,
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
      dataIndex: 'owner',
      key: 'owner',
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
    pageSize: listQuery.pageSize,
    showTotal: (total: number) => `总共 ${total} 项`,
    defaultPageSize: 5,
    showSizeChanger: true, // 是否显示pagesize选择
    showQuickJumper: true, // 是否显示跳转窗
  }));

  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.pageSize = pag.pageSize;
    getCMDBAppsListRequest();
  };
  // 获取应用列表
  async function getCMDBAppsListRequest() {
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
  getCMDBAppsListRequest();
  const state = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
  }>({
    selectedRowKeys: [],
    loading: false,
  });
  const onSelectChange = (selectedRowKeys: Key[]) => {
    state.selectedRowKeys = selectedRowKeys;
  };
  const onJumeTo = function (id: number) {
    router.push({ name: 'applicationDetails', query: { id } });
  };
  const onAddBusiness = function (type: string) {
    router.push({ name: 'addApplication', query: { type } });
  };
</script>
