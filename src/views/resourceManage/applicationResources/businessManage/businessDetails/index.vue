<!-- 业务管理-详情 -->
<template>
  <div>
    <Breadcrumb :show-back="true">
      <template #right>
        <div v-if="activeKey == '1'" class="flex">
          <div class="mr-5 cursor-pointer hover:text-blue-500" @click="onEditbusiness()">编辑</div>
          <a-dropdown placement="bottom">
            <div class="cursor-pointer hover:text-blue-500" @click.prevent> 更多操作 </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">导入</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-if="activeKey == '2'" class="flex">
          <template v-if="selctParentChidrenMeus == 'parent'">
            <div
              class="mr-5 cursor-pointer hover:text-blue-500"
              @click="showAddBusinessDialogChange('parent')"
              >设置父业务</div
            >
            <div class="cursor-pointer text-red-500" @click="deleteParentBusiness">移除父业务</div>
          </template>
          <template v-else>
            <div
              class="mr-5 cursor-pointer hover:text-blue-500"
              @click="showAddBusinessDialogChange('children')"
              >添加子业务</div
            >
            <a-dropdown placement="bottom">
              <div class="cursor-pointer hover:text-blue-500" @click.prevent> 更多操作 </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;">导入</a>
                  </a-menu-item>
                  <a-menu-item>
                    <div class="cursor-pointer text-red-500" @click="deleteParentBusiness"
                      >移除子业务</div
                    >
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </div>
        <div v-if="activeKey == '3'" class="flex">
          <div class="mr-5 cursor-pointer hover:text-blue-500" @click="openAddApplicationShowDialog"
            >添加应用</div
          >
          <a-dropdown placement="bottomRight">
            <div class="cursor-pointer hover:text-blue-500" @click.prevent> 更多操作 </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">导出</a>
                </a-menu-item>
                <a-menu-item>
                  <div class="cursor-pointer text-red-500" @click="deleteApplication">移除应用</div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </Breadcrumb>
    <div class="px-4 pb-4 bg-white">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="基本信息"><BasicInfo v-if="activeKey === '1'" /></a-tab-pane>
        <a-tab-pane key="2" tab="父子业务"
          ><FatherSonRelationship v-if="activeKey === '2'"
        /></a-tab-pane>
        <a-tab-pane key="3" tab="应用列表"
          ><ApplicationList v-if="activeKey === '3'" ref="applicationListRef"
        /></a-tab-pane>
      </a-tabs>
    </div>
    <AddBusinessDialog />
    <AddApplicationDialog
      ref="addApplicationDialogRef"
      @on-add-application-confirm="addApplicationConfirm"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  import {
    Tabs as ATabs,
    TabPane as ATabPane,
    Spin as ASpin,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
    message,
    Modal,
  } from 'ant-design-vue';
  import BasicInfo from './fragments/basic-info.vue';
  import FatherSonRelationship from './fragments/fatherSonRelationship/index.vue';
  import ApplicationList from './fragments/application-list.vue';
  import AddBusinessDialog from './dialog/add-business-dialog.vue';
  import AddApplicationDialog from './dialog/add-application-dialog.vue';

  import { useBusinessDialog } from './hooks/useBusinessDialog';
  import { useBusinessRelation } from './hooks/useBusinessRelation';

  import {
    setBusinessRelation,
    setBusinessAppsRelation,
  } from '@/api/resourceManage/applicationResources/businessManage';

  const { showAddBusinessDialogChange } = useBusinessDialog();
  const { selctParentChidrenMeus, parentInfoId, selectChildren, isRefresh } = useBusinessRelation();
  const router = useRouter();
  const route = useRoute();
  const activeKey = ref('1');
  const onEditbusiness = function () {
    const id: any = route.query && route.query.id;
    router.push({ name: 'addBusiness', query: { id, type: 'edit' } });
  };
  type Key = string | number;
  const deleteLoading = ref(false);
  // 删除父业务
  function deleteParentBusiness() {
    let titleInfo = '确定要移除父业务吗？';
    let relatedInstanceIds: Key[] = [];
    if (selctParentChidrenMeus.value === 'parent') {
      relatedInstanceIds.push(parentInfoId.value);
    }
    if (selctParentChidrenMeus.value === 'children') {
      titleInfo = '确定要移除选中的子业务吗？';
      relatedInstanceIds = selectChildren.value;
      if (relatedInstanceIds.length === 0) {
        message.error('请至少勾选一个子业务');
        return;
      }
    }
    Modal.confirm({
      title: titleInfo,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (deleteLoading.value) {
            return;
          }
          deleteLoading.value = true;
          const id: any = route.query && route.query.id;
          const params = {
            action: selctParentChidrenMeus.value === 'parent' ? 'delete' : 'remove',
            related_instance_ids: relatedInstanceIds,
          };
          const data = await setBusinessRelation(id, params);
          message.success(data.detail);
          deleteLoading.value = false;
          isRefresh.value = !isRefresh.value;
        } catch (error) {
          deleteLoading.value = false;
          console.error(error);
        }
      },
    });
  }

  const applicationListRef = ref();
  const deleteAppsLoading = ref(false);
  //删除应用
  function deleteApplication() {
    if (applicationListRef.value.selectApplicationIds.length === 0) {
      message.warning('请至少选择一个应用');
      return;
    }
    const relatedIds = applicationListRef.value.selectApplicationIds;
    Modal.confirm({
      title: '确定要移除选中的应用吗？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (deleteAppsLoading.value) {
            return;
          }
          deleteAppsLoading.value = true;
          const id: any = route.query && route.query.id;
          const params = {
            action: 'remove',
            related_ids: relatedIds,
          };
          const data = await setBusinessAppsRelation(id, params);
          message.success(data.detail);
          applicationListRef.value.getCMDBAppsListRequest();
          deleteAppsLoading.value = false;
        } catch (error) {
          deleteAppsLoading.value = false;
          console.error(error);
        }
      },
    });
  }
  // 添加应用弹出框
  const addApplicationDialogRef = ref();
  function openAddApplicationShowDialog() {
    addApplicationDialogRef.value && addApplicationDialogRef.value.openDialog();
  }
  function addApplicationConfirm() {
    applicationListRef.value.getCMDBAppsListRequest();
  }
  onMounted(() => {
    selctParentChidrenMeus.value = 'parent';
    selectChildren.value = [];
    parentInfoId.value = '';
  });
</script>
