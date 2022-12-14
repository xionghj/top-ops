<!-- 数据中心-列表 -->
<template>
  <div>
    <Breadcrumb>
      <template #right>
        <div class="flex">
          <div class="mr-2 cursor-pointer hover:text-blue-500" @click="onAddEngineRoom()"
            >新建机房</div
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
            @change="getIdcMangeListRequest()"
          />
        </div>
      </div>
      <a-spin :spinning="spinning">
        <a-table
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="list"
          row-key="id"
          :pagination="pagination"
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
          </template>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    Table as ATable,
    Spin as ASpin,
    Input as AInput,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
  } from 'ant-design-vue';
  import { getIdcMangeList } from '@/api/resourceManage/infrastructure/idcManage';
  type Key = string | number;
  const router = useRouter();
  const list = ref<API.IbcManageListItem[]>([]);
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
      title: '简称',
      dataIndex: 'short_name',
      key: 'short_name',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '联系电话',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '机房地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '最近访问',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
  ];
  const spinning = ref(false);
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
    getIdcMangeListRequest();
  };
  // 获取机房列表
  async function getIdcMangeListRequest() {
    try {
      if (spinning.value) {
        return;
      }
      spinning.value = true;
      const data = await getIdcMangeList(listQuery);
      spinning.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      spinning.value = false;
      console.error(error);
    }
  }
  getIdcMangeListRequest();
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
    router.push({ name: 'addEngineRoom', query: { id, type: 'view' } });
  };
  const onAddEngineRoom = function () {
    router.push({ name: 'addEngineRoom', query: { type: 'add' } });
  };
</script>
