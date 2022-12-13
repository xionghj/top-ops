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
                <a-menu-item>
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
    <div class="p-6 bg-white">
      <div class="flex justify-between mb-4">
        <div class="w-56">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getHostMangeListRequest()"
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
            <template v-if="column.key === 'ip'">
              <span
                class="text-blue-500 cursor-pointer hover:text-blue-700"
                @click="onJumeTo(record.id)"
              >
                {{ record.ip }}
              </span>
            </template>
            <template v-if="column.key === 'agent_status'">
              <div class="flex items-center">
                <ExclamationCircleFilled
                  v-if="record.agent_status == 'not_install'"
                  :style="{ fontSize: '16px', color: '#e38306' }"
                />
                <CheckCircleFilled v-else :style="{ fontSize: '16px', color: '#52c41a' }" />
                <span
                  class="ml-1"
                  :class="[
                    record.agent_status == 'not_install' ? 'text-[#e38306]' : 'text-[#52c41a]',
                  ]"
                  >{{ record.agent_status }}</span
                >
              </div>
            </template>
          </template>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import {
    Table as ATable,
    Spin as ASpin,
    Input as AInput,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
  } from 'ant-design-vue';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  type Key = string | number;
  const router = useRouter();
  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
  });
  const total = ref(0);
  const columns = [
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
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
    getHostMangeListRequest();
  };
  // 获取主机列表
  async function getHostMangeListRequest() {
    try {
      if (spinning.value) {
        return;
      }
      spinning.value = true;
      const data = await getHostMangeList(listQuery);
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
    selectedRowKeys: [],
    loading: false,
  });
  const onSelectChange = (selectedRowKeys: Key[]) => {
    state.selectedRowKeys = selectedRowKeys;
  };
  const onJumeTo = function (ids: number) {
    console.log('获取数据', ids);
    router.push({ name: 'hostDetails', query: { id: ids } });
  };
</script>
