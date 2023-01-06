<!-- 应用管理-列表详情-负责人-->
<template>
  <div class="w-full bg-white flex">
    <div class="p-[15px] w-[220px] bg-gray-50">
      <div
        v-for="(item, index) in menus"
        :key="index"
        class="flex items-center py-1 px-2 mb-1 rounded-sm cursor-pointer hover:bg-gray-200 hover:text-blue-500"
        :class="[currentPrincipal === item.key ? 'bg-gray-200 text-blue-500' : '']"
        @click="onSelectMenus(item.key)"
        >{{ item.name }}</div
      >
    </div>
    <div class="px-4 bg-white flex-1">
      <div class="flex mb-4">
        <div class="w-56 mr-3">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getAppsOwnerListRequest()"
          />
        </div>
      </div>
      <a-table
        :row-selection="{
          selectedRowKeys: selectPrincipal,
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
          <template v-if="column.key === 'is_active'">
            <a-tag :color="'green'">
              {{ record.is_active ? '激活' : '未激活' }}
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
  import { Table as ATable, Input as AInput, Tag as ATag } from 'ant-design-vue';
  import { getAppsOwnerList } from '@/api/resourceManage/applicationResources/applicationManage';

  type Key = string | number;
  const router = useRouter();
  const route = useRoute();
  const currentPrincipal = ref('developer');
  const menus = [
    { name: '开发负责人', key: 'developer' },
    { name: '运维负责人', key: 'owner' },
    { name: '测试负责人', key: 'tester' },
  ];
  function onSelectMenus(key: string) {
    currentPrincipal.value = key;
    getAppsOwnerListRequest();
  }

  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 5,
    role: '',
  });
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
      dataIndex: 'is_active',
      key: 'is_active',
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
    getAppsOwnerListRequest();
  };
  // 获取负责人列表
  async function getAppsOwnerListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      listQuery.role = currentPrincipal.value;
      const data = await getAppsOwnerList(id, listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  getAppsOwnerListRequest();
  const selectPrincipal = ref<Key[]>([]);
  const onSelectChange = (selectedRowKeys: Key[]) => {
    selectPrincipal.value = selectedRowKeys;
  };
  defineExpose({ selectPrincipal, getAppsOwnerListRequest });
</script>
