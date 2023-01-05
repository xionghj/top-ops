<!-- 应用-应用集群-列表 -->
<template>
  <div>
    <div class="px-6 bg-white">
      <div class="flex">
        <div class="w-56 mr-3">
          <a-input
            v-model:value="listQuery.search"
            placeholder="根据关键词搜索"
            @change="getAppsOwnerListRequest()"
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
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'is_active'">
            <a-tag :color="'green'">
              {{ record.is_active ? '激活' : '未激活' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <template v-if="record.children && record.children.length > 0">
              <a-button size="small" class="mr-2">添加主机</a-button>
              <a-dropdown placement="bottomRight">
                <a-button size="small">更多操作</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <div class="cursor-pointer" @click="deleteHost(record.children)"
                        >移除主机</div
                      >
                    </a-menu-item>
                    <a-menu-item>
                      <div class="cursor-pointer">编辑集群</div>
                    </a-menu-item>
                    <a-menu-item>
                      <div class="cursor-pointer">删除集群</div>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {
    Table as ATable,
    Input as AInput,
    Tag as ATag,
    Button as AButton,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
    message,
  } from 'ant-design-vue';
  import { getAppsOwnerList } from '@/api/resourceManage/applicationResources/applicationManage';
  type Key = string | number;
  const router = useRouter();
  const route = useRoute();

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

  const data = [
    {
      key: 1,
      name: 'John Brown sr.',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [
        {
          key: 11,
          name: 'John Brown',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
      ],
    },
    {
      key: 2,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  const list = ref<API.HostManageListItem[]>([]);
  const listQuery = reactive({
    search: '',
    page: 1,
    pageSize: 10,
    role: 'developer',
  });
  const total = ref(0);
  const columns = [
    {
      title: 'IP',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '主机名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'CPU 核数（个）',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '内存(G)',
      dataIndex: 'memory',
      key: 'memory',
    },
    {
      title: 'Agent 状态',
      dataIndex: 'is_active',
      key: 'is_active',
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
    getAppsOwnerListRequest();
  };
  // 获取负责人列表
  async function getAppsOwnerListRequest() {
    try {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getAppsOwnerList(id, listQuery);
      loading.value = false;
      list.value = data.results;
      total.value = data.count;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  getAppsOwnerListRequest();
  const selectedRowKeysArr = ref<Key[]>([]);
  const onSelectChange = (selectedRowKeys: Key[]) => {
    selectedRowKeysArr.value = selectedRowKeys;
  };

  // 移除主机
  function deleteHost(children: any) {
    if (children.length == 0) {
      message.error('暂无可删除的主机');
      return;
    }
    const deleteHostIds: string[] = [];
    selectedRowKeysArr.value.forEach((item: any) => {
      children.forEach((childrenItem: any) => {
        if (item == childrenItem.key) {
          deleteHostIds.push(item);
        }
      });
    });
    if (deleteHostIds.length == 0) {
      message.error('请先勾选删除的主机');
      return;
    }
    console.log('移除主机', deleteHostIds);
  }
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
