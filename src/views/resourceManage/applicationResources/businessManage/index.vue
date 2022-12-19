<!-- 业务管理-列表 -->
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
            @change="getCMDBBusinessListRequest()"
          />
        </div>
      </div>
      <a-table
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
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
  import { getCMDBBusinessList } from '@/api/resourceManage/applicationResources/businessManage';
  type Key = string | number;
  const router = useRouter();
  const list = ref<API.RackManageListItem[]>([]);
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
    getCMDBBusinessListRequest();
  };
  // 获取业务列表
  async function getCMDBBusinessListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const data = await getCMDBBusinessList(listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  getCMDBBusinessListRequest();
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
    router.push({ name: 'businessDetails', query: { id } });
  };
  const onAddBusiness = function (type: string) {
    router.push({ name: 'addBusiness', query: { type } });
  };
</script>
