<!-- 业务管理-业务详情-应用列表-添加主机 -->
<template>
  <div>
    <a-modal
      v-model:visible="addHostShowDialog"
      title="从 CMDB 中筛选主机"
      width="900px"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="bg-white">
        <div class="flex justify-between items-center mb-4">
          <div class="w-56">
            <a-input
              v-model:value="listQuery.search"
              placeholder="根据关键词搜索"
              @change="onQuery()"
            />
          </div>
          <div class="flex">
            <a-checkbox v-model:checked="relatedToMeChecked" @change="getHostMangeListRequest()"
              >与我有关</a-checkbox
            >
            <a-checkbox v-model:checked="agentStatusChecked" @change="getHostMangeListRequest()"
              >正常主机</a-checkbox
            >
          </div>
        </div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeysArr,
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
            <template v-if="column.key === 'agent_status'">
              <div class="flex items-center">
                <span
                  class="rounded text-white px-2 flex items-center"
                  :class="agentStatusColorMap[record.agent_status]"
                  ><span class="w-[4px] h-[4px] rounded-full bg-white block mr-1.5"></span
                  >{{ agentStatusMap[record.agent_status] }}</span
                >
              </div>
            </template>
            <template v-if="column.key === 'first_owner'">
              <span v-for="(item, index) in record.first_owner" :key="index">
                {{ item.username }}{{ record.first_owner.length - 1 != index ? '; ' : '' }}
              </span>
            </template>
          </template>
        </a-table>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <div>已选择 {{ selectedRowKeysArr.length }} 项</div>
          <div class="flex items-center">
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" :loading="addLoading" @click="handleOk"
              >确定</a-button
            >
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed, watch } from 'vue';
  import { debounce } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import {
    Modal as AModal,
    Table as ATable,
    Input as AInput,
    Button as AButton,
    Checkbox as ACheckbox,
    message,
  } from 'ant-design-vue';
  import {
    getClusterHostsList,
    setClusterHost,
  } from '@/api/resourceManage/applicationResources/clusterManage';

  import { useUserStore } from '@/store/modules/user';

  type Key = string | number;

  const userStore = useUserStore();
  const { userInfo } = storeToRefs(userStore);

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
  const addHostShowDialog = ref(false);
  // 选择应用的key
  const selectedRowKeysArr = ref<Key[]>([]);
  // 与我有关
  const relatedToMeChecked = ref();
  // 正常数据
  const agentStatusChecked = ref();
  watch(addHostShowDialog, (bol) => {
    if (bol) {
      getHostMangeListRequest();
    }
  });
  const emit = defineEmits(['onAddHostConfirm']);
  const clusterId = ref('');
  async function openDialog(id: string) {
    selectedRowKeysArr.value = [];
    clusterId.value = id;
    addHostShowDialog.value = true;
  }
  const addLoading = ref(false);
  // 确认
  const handleOk = async () => {
    if (selectedRowKeysArr.value.length == 0) {
      message.warning('请勾选一个主机');
      return;
    }
    try {
      if (addLoading.value) {
        return;
      }
      addLoading.value = true;
      const params = {
        action: 'add',
        related_ids: selectedRowKeysArr.value,
      };
      const data = await setClusterHost(clusterId.value, params);
      message.success(data.detail);
      addLoading.value = false;
      emit('onAddHostConfirm');
      addHostShowDialog.value = false;
    } catch (error) {
      addLoading.value = false;
      console.error(error);
    }
  };
  // 取消
  const handleCancel = () => {
    addHostShowDialog.value = false;
  };

  const list = ref([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 5,
    owner: '',
    agent_status: '',
  });
  const total = ref(0);
  const columns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: 'Agent 状态',
      dataIndex: 'agent_status',
      key: 'agent_status',
    },
    {
      title: '运维负责人',
      dataIndex: 'first_owner',
      key: 'first_owner',
    },
    {
      title: '最近更新',
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

  const onQuery = debounce(getHostMangeListRequest, 500);
  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getHostMangeListRequest();
  };
  // 获取主机列表
  async function getHostMangeListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      if (relatedToMeChecked.value) {
        listQuery.owner = userInfo.value.user_id || '';
      } else {
        listQuery.owner = '';
      }
      if (agentStatusChecked.value) {
        listQuery.agent_status = 'normal';
      } else {
        listQuery.agent_status = '';
      }
      const data = await getClusterHostsList(clusterId.value, listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  // 勾选
  const onSelectChange = (selectedRowKeys: Key[]) => {
    selectedRowKeysArr.value = selectedRowKeys;
  };
  defineExpose({ openDialog });
</script>
