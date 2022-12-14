<template>
  <div>
    <a-modal
      v-model:visible="addRackShowDialog"
      title="选择机柜"
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
              @change="getHostRackListRequest()"
            />
          </div>
          <a-checkbox v-model:checked="relatedToMeChecked">与我有关</a-checkbox>
        </div>
        <a-table
          :row-selection="{
            selectedRowKeys: state.selectedRowKeys,
            onChange: onSelectChange,
            type: 'radio',
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
            <div class="text-red-500 mr-4">该关系只允许添加一个实例</div>
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, toRefs, reactive, computed, onMounted, watch } from 'vue';
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
  import {
    getHostRackList,
    hostRackSettings,
  } from '@/api/resourceManage/infrastructure/hostManage';
  type Key = string | number;
  const props = defineProps({
    addRackShowDialog: Boolean,
  });
  const { addRackShowDialog } = toRefs(props);
  watch(addRackShowDialog, (bol) => {
    if (bol) {
      state.selectedRowKeys = [];
    }
  });
  const emit = defineEmits(['onCloseAddRackShowDialog']);
  const handleOk = () => {
    addHostRackRequest();
  };
  const handleCancel = () => {
    emit('onCloseAddRackShowDialog');
  };
  const route = useRoute();
  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
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
      title: '可用U数',
      dataIndex: 'unum',
      key: 'unum',
    },
    {
      title: '机柜编号',
      dataIndex: 'code',
      key: 'code',
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
    getHostRackListRequest();
  };
  // 获取允许添加机柜列表
  async function getHostRackListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getHostRackList(id, listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  // 添加机柜
  const state = reactive<{
    selectedRowKeys: Key[];
    addLoading: boolean;
  }>({
    selectedRowKeys: [],
    addLoading: false,
  });
  async function addHostRackRequest() {
    if (state.selectedRowKeys.length == 0) {
      message.warning('请勾选一个机柜');
      return;
    }
    try {
      if (state.addLoading) {
        return;
      }
      state.addLoading = true;
      const id: any = route.query && route.query.id;
      const params = {
        action: 'set',
        related_id: state.selectedRowKeys[0],
      };
      const data = await hostRackSettings(id, params);
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
  onMounted(() => {
    getHostRackListRequest();
  });
</script>
