<!-- 业务管理-添加应用 -->
<template>
  <div>
    <a-modal
      v-model:visible="addApplicationShowDialog"
      title="从 CMDB 中筛选应用"
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
              @change="getIdcRacksListRequest()"
            />
          </div>
          <a-checkbox v-model:checked="relatedToMeChecked">与我有关</a-checkbox>
        </div>
        <a-table
          :row-selection="{
            selectedRowKeys: state.selectedRowKeys,
            onChange: onSelectChange,
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
  import { getIdcRacksList, idcRacksSettings } from '@/api/resourceManage/infrastructure/idcManage';
  type Key = string | number;
  const props = defineProps({
    addApplicationShowDialog: Boolean,
  });
  const { addApplicationShowDialog } = toRefs(props);
  watch(addApplicationShowDialog, (bol) => {
    if (bol) {
      state.selectedRowKeys = [];
      getIdcRacksListRequest();
    }
  });
  const emit = defineEmits(['onCloseAddApplicationShowDialog']);
  const handleOk = () => {
    addIdcRacksRequest();
  };
  const handleCancel = () => {
    emit('onCloseAddApplicationShowDialog');
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
      title: '应用名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属业务',
      dataIndex: 'unum',
      key: 'unum',
    },
    {
      title: '开发负责人',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '运维负责人',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '测试负责人',
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
    getIdcRacksListRequest();
  };
  // 获取允许添加机柜列表
  async function getIdcRacksListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getIdcRacksList(id, listQuery);
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
  async function addIdcRacksRequest() {
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
        action: 'add',
        instance_ids: state.selectedRowKeys,
      };
      const data = await idcRacksSettings(id, params);
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
