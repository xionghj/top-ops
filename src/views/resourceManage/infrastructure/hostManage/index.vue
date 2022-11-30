<!-- 主机管理-列表 -->
<template>
  <div>
    <Breadcrumb>
      <template #right>
        <div>
          <a-dropdown placement="bottom">
            <div class="cursor-pointer hover:text-blue-500" @click.prevent> 更多操作 </div>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="onJumeTo">
                  <a href="javascript:;">导入</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">手工导入</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">自动采集</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">批量删除</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">查看归档</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </Breadcrumb>
    <div class="p-4 bg-white">
      <div class="flex justify-between mb-4">
        <div class="w-80">
          <a-input v-model:value="search" placeholder="根据关键词搜索" />
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
              <a>
                {{ record.name }}
              </a>
            </template>
            <template v-if="column.key === 'agent_status'">
              <a-tag :color="'green'">
                {{ record.agent_status }}
              </a-tag>
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
    Tag as ATag,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
  } from 'ant-design-vue';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  type Key = string | number;
  const router = useRouter();
  const list = ref<API.HostManageListItem[]>([]);
  const search = ref('');
  const columns = [
    {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: 'CPU 核数',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '内存大小',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: 'OS 发行版本',
      dataIndex: 'os_release',
      key: 'os_release',
    },
    {
      title: '运维负责人',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
    {
      title: 'Agent 状态',
      dataIndex: 'agent_status',
      key: 'agent_status',
    },
    {
      title: '最近访问',
      dataIndex: 'second_owner',
      key: 'second_owner',
    },
  ];
  const spinning = ref(false);
  const total = ref(0);
  const current = ref(1);
  const pageSize = ref(10);
  const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value,
    showTotal: (total: number) => `总共 ${total} 项`,
    defaultPageSize: 10,
    showSizeChanger: true, // 是否显示pagesize选择
    showQuickJumper: true, // 是否显示跳转窗
  }));

  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    current.value = pag.current;
    pageSize.value = pag.pageSize;
    getHostMangeListRequest();
  };
  // 获取主机列表
  async function getHostMangeListRequest() {
    try {
      if (spinning.value) {
        return;
      }
      spinning.value = true;
      const data = await getHostMangeList();
      spinning.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      spinning.value = false;
      console.error(error);
    }
  }
  getHostMangeListRequest();
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
  const onJumeTo = function () {
    router.push({ name: 'hostDetails' });
  };
</script>
