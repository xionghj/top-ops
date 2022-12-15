<!-- 机柜管理-列表 -->
<template>
  <div>
    <Breadcrumb>
      <template #right>
        <div class="flex">
          <div class="mr-2 cursor-pointer hover:text-blue-500" @click="onAddRack('add')"
            >新建机柜</div
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
            @change="getRackMangeListRequest()"
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
                @click="onJumeTo(record.id, 'view')"
              >
                {{ record.name }}
              </span>
            </template>
            <template v-if="column.key === 'idc'">
              <span>
                {{ record.idc && record.idc.name }}
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
  import { getRackMangeList } from '@/api/resourceManage/infrastructure/rackManage';
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
      title: '编号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '机柜U数',
      dataIndex: 'unum',
      key: 'unum',
    },
    {
      title: '可用U数',
      dataIndex: 'free_unum',
      key: 'free_unum',
    },
    {
      title: '所属机房',
      dataIndex: 'idc',
      key: 'idc',
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
    getRackMangeListRequest();
  };
  // 获取机柜列表
  async function getRackMangeListRequest() {
    try {
      if (spinning.value) {
        return;
      }
      spinning.value = true;
      const data = await getRackMangeList(listQuery);
      spinning.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      spinning.value = false;
      console.error(error);
    }
  }
  getRackMangeListRequest();
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
  const onJumeTo = function (id: number, type: string) {
    router.push({ name: 'addRack', query: { id, type } });
  };
  const onAddRack = function (type: string) {
    router.push({ name: 'addRack', query: { type } });
  };
</script>
