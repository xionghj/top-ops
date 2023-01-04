<!-- 业务管理-业务详情-应用列表-添加应用 -->
<template>
  <div>
    <a-modal
      v-model:visible="addApplicationShowDialog"
      title="从 CMDB 中筛选应用"
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
          <a-checkbox v-model:checked="relatedToMeChecked" @change="getCMDBAppsListRequest()"
            >与我有关</a-checkbox
          >
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
            <template v-if="column.key === 'business'">
              <span v-for="(item, index) in record.business" :key="index">
                {{ item.name }}{{ record.business.length - 1 != index ? '/' : '' }}
              </span>
            </template>
            <template v-if="column.key === 'developer'">
              <span v-for="(item, index) in record.developer" :key="index">
                {{ item.username }}{{ record.developer.length - 1 != index ? '; ' : '' }}
              </span>
            </template>
            <template v-if="column.key === 'owner'">
              <span v-for="(item, index) in record.owner" :key="index">
                {{ item.username }}{{ record.owner.length - 1 != index ? '; ' : '' }}
              </span>
            </template>
            <template v-if="column.key === 'tester'">
              <span v-for="(item, index) in record.tester" :key="index">
                {{ item.username }}{{ record.tester.length - 1 != index ? '; ' : '' }}
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
  import { useRoute } from 'vue-router';
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
  import { getCMDBAppsList } from '@/api/resourceManage/applicationResources/applicationManage';
  import { setBusinessAppsRelation } from '@/api/resourceManage/applicationResources/businessManage';

  import { useUserStore } from '@/store/modules/user';

  type Key = string | number;

  const route = useRoute();
  const userStore = useUserStore();
  const { userInfo } = storeToRefs(userStore);

  const addApplicationShowDialog = ref(false);
  // 选择应用的key
  const selectedRowKeysArr = ref<Key[]>([]);

  // 与我有关
  const relatedToMeChecked = ref();

  watch(addApplicationShowDialog, (bol) => {
    if (bol) {
      getCMDBAppsListRequest();
    }
  });
  const emit = defineEmits(['onAddApplicationConfirm']);
  async function openDialog() {
    selectedRowKeysArr.value = [];
    addApplicationShowDialog.value = true;
  }
  type Creator = {
    id: number;
    username: string;
    name: string;
  };
  interface ApplicationList {
    alias_name: string;
    business: [];
    creator: Creator;
    description: string;
    developer: [];
    hierarchy: string;
    id: number;
    name: string;
    owner: [];
    tester: [];
    updated_at: string;
  }
  const addLoading = ref(false);
  // 确认
  const handleOk = async () => {
    if (selectedRowKeysArr.value.length == 0) {
      message.warning('请勾选一个应用');
      return;
    }
    try {
      if (addLoading.value) {
        return;
      }
      addLoading.value = true;
      const id: any = route.query && route.query.id;
      const params = {
        action: 'add',
        related_ids: selectedRowKeysArr.value,
      };
      const data = await setBusinessAppsRelation(id, params);
      message.success(data.detail);
      addLoading.value = false;
      emit('onAddApplicationConfirm');
      addApplicationShowDialog.value = false;
    } catch (error) {
      addLoading.value = false;
      console.error(error);
    }
  };
  // 取消
  const handleCancel = () => {
    addApplicationShowDialog.value = false;
  };

  const list = ref<ApplicationList[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    page_size: 5,
    owner: '',
    exclude: '',
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
      dataIndex: 'business',
      key: 'business',
    },
    {
      title: '开发负责人',
      dataIndex: 'developer',
      key: 'developer',
    },
    {
      title: '运维负责人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '测试负责人',
      dataIndex: 'tester',
      key: 'tester',
      width: 100,
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

  const onQuery = debounce(getCMDBAppsListRequest, 500);
  // 列表当前页更改
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    listQuery.page = pag.current;
    listQuery.page_size = pag.pageSize;
    getCMDBAppsListRequest();
  };
  // 获取应用列表
  async function getCMDBAppsListRequest() {
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
      const id: any = route.query && route.query.id;
      listQuery.exclude = id;
      const data = await getCMDBAppsList(listQuery);
      loading.value = false;
      data.results.forEach((item: any) => {
        item.id = item.id.toString();
      });
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
