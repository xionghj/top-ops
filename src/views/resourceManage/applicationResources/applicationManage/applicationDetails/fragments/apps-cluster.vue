<!-- 应用-应用集群-列表 -->
<template>
  <div>
    <div class="px-6 bg-white">
      <div class="flex">
        <div class="w-56 mr-3">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getClusterListRequest()"
          />
        </div>
      </div>
      <div class="environment-box mt-4">
        <div class="environment">
          <span
            v-for="(item, index) in environmentArr"
            :key="index"
            class="environment__label"
            @click="clickEnvironment(item.id)"
            ><span :class="[selectEnvironment == item.id ? 'select' : '']">{{
              item.name
            }}</span></span
          >
        </div>
      </div>
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeysArr,
          onChange: onSelectChange,
          columnWidth: 40,
          checkStrictly: false,
        }"
        row-key="id"
        :columns="columns"
        :data-source="list"
        :pagination="pagination"
        :loading="loading"
        children-column-name="hosts"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'ip'">
            <template v-if="record.is_auto === false || record.is_auto === true">
              {{ record.name }} - {{ envMap[record.env] }}
            </template>
            <template v-else>
              {{ record.ip }}
            </template>
          </template>
          <template v-if="column.key === 'agent_status'">
            <template v-if="record.is_auto === false || record.is_auto === true"></template>
            <template v-else>
              <div class="flex items-center">
                <span
                  class="rounded text-white px-2 flex items-center"
                  :class="agentStatusColorMap[record.agent_status]"
                  ><span class="w-[4px] h-[4px] rounded-full bg-white block mr-1.5"></span
                  >{{ agentStatusMap[record.agent_status] }}</span
                >
              </div>
            </template>
          </template>
          <template v-if="column.key === 'action'">
            <template v-if="record.is_auto === false || record.is_auto === true">
              <span
                class="text-[#3D78E3] mr-2 cursor-pointer"
                @click="openAddClusterHostDialog(record.id)"
                >添加主机</span
              >
              <a-dropdown placement="bottomRight">
                <span class="text-[#3D78E3] cursor-pointer">更多操作</span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <div class="cursor-pointer" @click="onEditCluster(record)">编辑集群</div>
                    </a-menu-item>
                    <a-menu-item>
                      <div class="text-[#FFA235] cursor-pointer" @click="onDeleteHost(record)"
                        >移除主机</div
                      >
                    </a-menu-item>
                    <a-menu-item>
                      <div class="text-red-500 cursor-pointer" @click="onDeleteCluster(record)"
                        >删除集群</div
                      >
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </template>
        </template>
      </a-table>
      <AppsClusterDialog
        ref="appsClusterDialogRef"
        @on-apps-cluster-confirm="getClusterListRequest"
      />
      <AddClusterHostDialog
        ref="addClusterHostDialogRef"
        @on-add-host-confirm="getClusterListRequest"
      />
      <a-modal v-model:visible="deleteHostDialogVisible" title="删除主机" @ok="deleteHostRequest">
        <p
          >确定要移除所选的
          <span class="text-red-500">{{ deleteHostIdArr.length }}</span> 台主机吗？</p
        >
      </a-modal>
      <a-modal
        v-model:visible="deleteClusterDialogVisible"
        title="删除集群"
        @ok="deleteClusterRequest"
      >
        <p
          >确定要删除 <span class="text-red-500">{{ deleteClusterInfo.name }}</span> 集群吗？</p
        >
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    Table as ATable,
    Input as AInput,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
    Modal as AModal,
    message,
  } from 'ant-design-vue';

  import AppsClusterDialog from '../dialog/apps-cluster-dialog.vue';
  import AddClusterHostDialog from '../dialog/add-cluster-host-dialog.vue';

  import {
    getClusterList,
    setClusterHost,
    deleteCluster,
  } from '@/api/resourceManage/applicationResources/clusterManage';
  type Key = string | number;
  const route = useRoute();

  const agentStatusMap: any = {
    normal: '正常',
    abnormal: '异常',
    not_install: '未安装',
  };
  const agentStatusColorMap: any = {
    normal: 'bg-[#52c41a]',
    abnormal: 'bg-[#e38306]',
    not_install: 'bg-[#73818f]',
  };
  const envMap: any = {
    dev: '开发',
    fat: '测试',
    uat: '预发布',
    pro: '生产',
  };
  const environmentArr = [
    {
      name: '生产环境',
      id: 1,
    },
    {
      name: '预发环境',
      id: 2,
    },
    {
      name: '测试环境',
      id: 3,
    },
    {
      name: '开发环境',
      id: 4,
    },
  ];
  const selectEnvironment = ref();
  function clickEnvironment(id: number) {
    if (selectEnvironment.value == id) {
      selectEnvironment.value = '';
    } else {
      selectEnvironment.value = id;
    }
  }

  const list = ref([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
    app: '',
  });
  const total = ref(0);
  const columns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: 'CPU 核数（个）',
      dataIndex: 'cpu_count',
      key: 'cpu_count',
    },
    {
      title: '内存(G)',
      dataIndex: 'mem_size',
      key: 'mem_size',
    },
    {
      title: 'Agent 状态',
      dataIndex: 'agent_status',
      key: 'agent_status',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 200,
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
      const id: any = route.query && route.query.id;
      listQuery.app = id;
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
  const selectedRowKeysArr = ref<Key[]>([]);
  const onSelectChange = (selectedRowKeys: Key[]) => {
    selectedRowKeysArr.value = selectedRowKeys;
  };

  // 添加主机
  const addClusterHostDialogRef = ref();
  function openAddClusterHostDialog(id: string) {
    addClusterHostDialogRef.value && addClusterHostDialogRef.value.openDialog(id);
  }
  const deleteHostDialogVisible = ref(false);
  // 选择删除的主机
  const deleteHostIdArr = ref<string[]>([]);
  const clusterId = ref();
  // 移除主机
  function onDeleteHost(row: any) {
    if ((row.hosts && row.hosts.length == 0) || row.hosts === null) {
      message.error('暂无可删除的主机');
      return;
    }
    const deleteHostIds: string[] = [];
    selectedRowKeysArr.value.forEach((item: any) => {
      row.hosts.forEach((childrenItem: any) => {
        if (item == childrenItem.id) {
          deleteHostIds.push(item);
        }
      });
    });
    if (deleteHostIds.length == 0) {
      message.error('请先勾选删除的主机');
      return;
    }
    clusterId.value = row.id;
    deleteHostIdArr.value = deleteHostIds;
    deleteHostDialogVisible.value = true;
  }
  const deleteHostLoading = ref(false);
  // 移除主机请求
  async function deleteHostRequest() {
    try {
      if (deleteHostLoading.value) {
        return;
      }
      deleteHostLoading.value = true;
      const params = {
        action: 'remove',
        related_ids: deleteHostIdArr.value,
      };
      const data = await setClusterHost(clusterId.value, params);
      message.success(data.detail);
      deleteHostLoading.value = false;
      deleteHostDialogVisible.value = false;
      getClusterListRequest();
    } catch (error) {
      deleteHostLoading.value = false;
      console.error(error);
    }
  }

  // 添加集群
  const appsClusterDialogRef = ref();
  function onEditCluster(row: any) {
    appsClusterDialogRef.value && appsClusterDialogRef.value.openClusterEditDialog(row);
  }
  // 删除集群
  const deleteClusterDialogVisible = ref(false);
  const deleteClusterInfo = reactive({
    name: '',
    id: '',
  });
  const deleteClusterLoading = ref(false);
  function onDeleteCluster(row: any) {
    deleteClusterInfo.id = row.id;
    deleteClusterInfo.name = row.name;
    deleteClusterDialogVisible.value = true;
  }
  async function deleteClusterRequest() {
    try {
      if (deleteClusterLoading.value) {
        return;
      }
      deleteClusterLoading.value = true;
      await deleteCluster(deleteClusterInfo.id);
      message.success('移除成功');
      deleteClusterLoading.value = false;
      deleteClusterDialogVisible.value = false;
      getClusterListRequest();
    } catch (error) {
      deleteClusterLoading.value = false;
      console.error(error);
    }
  }

  defineExpose({ getClusterListRequest });
</script>
<style lang="less" scoped>
  .environment-box {
    margin-bottom: 12px;
    .environment {
      background-color: rgba(240, 243, 250, 1);
      display: inline-block;
      align-items: center;
      padding: 4px 0;
      border-radius: 4px;

      .environment__label {
        padding: 4px 6px;
        position: relative;
        cursor: pointer;
        > span {
          border-radius: 2px;
          padding: 4px 6px;
          color: #262626;
        }
        .select {
          background-color: #fff;
          color: #027aff;
        }
        &::after {
          content: '';
          position: absolute;
          bottom: 6px;
          height: 11px;
          width: 0.5px;
          background-color: #cdc7c7;
          right: 0%;
          z-index: 1;
        }
        &:last-child {
          &::after {
            content: '';
            position: absolute;
            background-color: transparent;
          }
        }
      }
    }
  }
</style>
