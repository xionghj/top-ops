<!-- 业务管理-选择业务弹出框 -->
<template>
  <div>
    <a-modal
      v-model:visible="showAddBusinessDialog"
      title="选择业务"
      width="800px"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="bg-white">
        <div class="flex justify-between items-center mb-4">
          <div class="w-56">
            <a-input
              v-model:value="listQuery.search"
              placeholder="根据关键词搜索"
              @change="getCMDBBusinessListRequest()"
            />
          </div>
          <a-checkbox v-model:checked="relatedToMeChecked">与我有关</a-checkbox>
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
          :loading="loading"
          children-column-name="noChildren"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'agent_status'">
              <a-tag :color="'green'">
                {{ record.agent_status }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <div>已选择 {{ state.selectedRowKeys.length }} 项</div>
          <div class="flex items-center">
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed, watch } from 'vue';
  import { useRoute } from 'vue-router';

  import {
    Modal as AModal,
    Table as ATable,
    Input as AInput,
    Tag as ATag,
    Button as AButton,
    Checkbox as ACheckbox,
    message,
  } from 'ant-design-vue';
  import { useBusinessDialog } from '../hooks/useBusinessDialog';
  import {
    getCMDBBusinessList,
    getChildrenBusinessList,
    setBusinessRelation,
  } from '@/api/resourceManage/applicationResources/businessManage';
  const { showAddBusinessDialog, operationType, closeAddBusinessDialogChange } =
    useBusinessDialog();

  type Key = string | number;
  watch(
    () => showAddBusinessDialog.value,
    (bol) => {
      if (bol) {
        state.selectedRowKeys = [];
        getCMDBBusinessListRequest();
      }
    },
  );
  const handleOk = () => {
    addBusinessRequest();
  };
  const handleCancel = () => {
    closeAddBusinessDialogChange();
  };
  const route = useRoute();
  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 5,
    person: '',
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
      title: '备注',
      dataIndex: 'description',
      key: 'description',
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

  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getCMDBBusinessListRequest();
  };
  // 获取业务列表
  async function getCMDBBusinessListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getChildrenBusinessList(id, listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  // 添加业务
  const state = reactive<{
    selectedRowKeys: Key[];
    addLoading: boolean;
  }>({
    selectedRowKeys: [],
    addLoading: false,
  });
  async function addBusinessRequest() {
    if (state.selectedRowKeys.length == 0) {
      message.warning('请至少选择一个业务');
      return;
    }
    try {
      if (state.addLoading) {
        return;
      }
      state.addLoading = true;
      const id: any = route.query && route.query.id;
      const params = {
        action: operationType.value == 'parent' ? 'set' : 'add',
        related_instance_ids: state.selectedRowKeys,
      };
      const data = await setBusinessRelation(id, params);
      message.success(data.detail);
      handleCancel();
      state.addLoading = false;
    } catch (error) {
      state.addLoading = false;
      console.error(error);
    }
  }
  const onSelectChange = (selectedRowKeys: Key[]) => {
    state.selectedRowKeys = selectedRowKeys;
  };
  const relatedToMeChecked = ref();
</script>
