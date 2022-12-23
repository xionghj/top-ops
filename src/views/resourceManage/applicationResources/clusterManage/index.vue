<!-- 集群管理-列表 -->
<template>
  <div>
    <Breadcrumb>
      <template #right>
        <div class="flex">
          <div class="mr-2 cursor-pointer hover:text-blue-500" @click="onAddCluster('add')"
            >新建集群</div
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
            @change="getClusterListRequest()"
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
          <template v-if="column.key === 'hosts'">
            <span v-for="(item, index) in record.hosts" :key="index">
              {{ item.ip }}{{ record.hosts.length - 1 != index ? '，' : '' }}
            </span>
          </template>
          <template v-if="column.key === 'app'">
            <span>
              {{ record.app && record.app.name }}
            </span>
          </template>
          <template v-if="column.key === 'creator'">
            <span>
              {{ record.creator && record.creator.username }}
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
  import { getClusterList } from '@/api/resourceManage/applicationResources/clusterManage';

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
      title: '集群环境',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '所属应用',
      dataIndex: 'app',
      key: 'app',
    },
    {
      title: '关联主机',
      dataIndex: 'hosts',
      key: 'hosts',
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '更新时间',
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
    getClusterListRequest();
  };
  // 获取集群列表
  async function getClusterListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const data = await getClusterList(listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  getClusterListRequest();
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
    router.push({ name: 'clusterDetails', query: { id } });
  };
  const onAddCluster = function (type: string) {
    router.push({ name: 'addCluster', query: { type } });
  };
</script>
