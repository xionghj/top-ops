<!-- 应用管理-列表详情-负责人-添加负责人弹出框-->
<template>
  <div>
    <a-modal
      v-model:visible="addOwnerShowDialog"
      title="选择负责人"
      width="800px"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="bg-white">
        <div class="flex justify-between mb-4">
          <div class="w-56">
            <a-input
              v-model:value="listQuery.search"
              placeholder="根据关键词搜索"
              @change="onQuery()"
            />
          </div>
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
          @change="handleTableChange"
        >
        </a-table>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <div>已选择 {{ state.selectedRowKeys.length }} 项</div>
          <div>
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" :loading="state.addLoading" @click="handleOk"
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
  import { useRoute } from 'vue-router';
  import { debounce } from 'lodash-es';
  import {
    Modal as AModal,
    Table as ATable,
    Input as AInput,
    Button as AButton,
    message,
  } from 'ant-design-vue';
  import {
    setAppsOwner,
    getUsersUsersList,
  } from '@/api/resourceManage/applicationResources/applicationManage';
  type Key = string | number;
  const addOwnerShowDialog = ref(false);
  watch(addOwnerShowDialog, (bol) => {
    if (bol) {
      state.selectedRowKeys = [];
      getHostOwnerRequest();
    }
  });
  const emit = defineEmits(['onAddOwnerConfirm']);
  function openDialog(role: string) {
    addOwnerRole.value = role;
    addOwnerShowDialog.value = true;
  }
  const handleOk = () => {
    addAppsOwnerRequest();
  };
  const handleCancel = () => {
    addOwnerShowDialog.value = false;
  };
  const route = useRoute();
  const list = ref([]);
  const addOwnerRole = ref('');
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 10,
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
    defaultPageSize: 10,
    showSizeChanger: true, // 是否显示pagesize选择
    showQuickJumper: true, // 是否显示跳转窗
  }));

  const onQuery = debounce(getHostOwnerRequest, 500);
  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getHostOwnerRequest();
  };
  // 获取负责人列表
  async function getHostOwnerRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const data = await getUsersUsersList(listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  // 添加负责人
  const state = reactive<{
    selectedRowKeys: Key[];
    addLoading: boolean;
  }>({
    selectedRowKeys: [],
    addLoading: false,
  });
  async function addAppsOwnerRequest() {
    if (state.selectedRowKeys.length == 0) {
      message.warning('请至少勾选一个负责人');
      return;
    }
    try {
      if (state.addLoading) {
        return;
      }
      state.addLoading = true;
      const id: any = route.query && route.query.id;
      const params = {
        action: 'add',
        role: addOwnerRole.value,
        related_ids: state.selectedRowKeys,
      };
      const data = await setAppsOwner(id, params);
      message.success(data.detail);
      addOwnerShowDialog.value = false;
      emit('onAddOwnerConfirm');
      state.addLoading = false;
    } catch (error) {
      state.addLoading = false;
      console.error(error);
    }
  }
  const onSelectChange = (selectedRowKeys: Key[]) => {
    state.selectedRowKeys = selectedRowKeys;
  };
  defineExpose({ openDialog });
</script>
