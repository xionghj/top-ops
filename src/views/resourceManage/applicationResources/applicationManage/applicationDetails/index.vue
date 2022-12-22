<!-- 应用管理-详情 -->
<template>
  <div>
    <Breadcrumb :show-back="true">
      <template #right>
        <div v-if="activeKey == '1'" class="flex">
          <div class="mr-2 cursor-pointer hover:text-blue-500" @click="onEditApps()">编辑</div>
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
          <div class="mr-2 cursor-pointer hover:text-blue-500" @click="addOwnerShowDialog = true"
            >添加负责人</div
          >
          <a-dropdown placement="bottom">
            <div class="cursor-pointer hover:text-blue-500" @click.prevent> 更多操作 </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">导入</a>
                </a-menu-item>
                <a-menu-item>
                  <div class="cursor-pointer hover:text-blue-500" @click="deletHostOwnerRequest()"
                    >移除负责人</div
                  >
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-if="activeKey == '3'" class="flex">
          <div class="mr-2 cursor-pointer hover:text-blue-500">设置业务</div>
          <div class="cursor-pointer hover:text-blue-500">移除业务</div>
        </div>
      </template>
    </Breadcrumb>
    <div class="px-4 pb-4 bg-white">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="基本信息"><BasicInfo v-if="activeKey === '1'" /></a-tab-pane>
        <a-tab-pane key="2" tab="负责人"
          ><Principal v-if="activeKey === '2'" ref="principalRef"
        /></a-tab-pane>
        <a-tab-pane key="3" tab="业务资源"><Business v-if="activeKey === '3'" /></a-tab-pane>
      </a-tabs>
    </div>
    <addOwnerDialog
      :add-owner-show-dialog="addOwnerShowDialog"
      @on-close-add-owner-show-dialog="closeAddOwnerShowDialog"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
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
  import Principal from './fragments/principal.vue';
  import Business from './fragments/business.vue';
  import addOwnerDialog from './dialog/add-owner-dialog.vue';
  import { idcRacksSettings } from '@/api/resourceManage/infrastructure/idcManage';
  import { setAppsOwner } from '@/api/resourceManage/applicationResources/applicationManage';
  const router = useRouter();
  const route = useRoute();
  function onBack() {
    router.go(-1);
  }
  const activeKey = ref('1');
  function onEditApps() {
    const id: any = route.query && route.query.id;
    router.push({ name: 'addApplication', query: { id, type: 'edit' } });
  }
  // 添加机柜弹出框
  const rackListRef: any = ref(null);
  const addRackShowDialog = ref(false);
  function closeAddRackShowDialog() {
    addRackShowDialog.value = false;
    rackListRef.value && rackListRef.value.getIdcRacksRequest();
  }
  // 删除机柜
  const deleteRackLoading = ref(false);
  async function deletIdcRackRequest() {
    const selectRacksArr = rackListRef.value && rackListRef.value.selectRacks;
    if (selectRacksArr.length == 0) {
      message.warning('请先选择移除的机柜!');
      return;
    }
    Modal.confirm({
      title: '您确定要移除机柜吗？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (deleteRackLoading.value) {
            return;
          }
          deleteRackLoading.value = true;
          const id: any = route.query && route.query.id;
          const params = {
            action: 'remove',
            instance_ids: selectRacksArr,
          };
          const data = await idcRacksSettings(id, params);
          message.success(data.detail);
          rackListRef.value && rackListRef.value.getIdcRacksRequest();
          deleteRackLoading.value = false;
        } catch (error) {
          deleteRackLoading.value = false;
          console.error(error);
        }
      },
    });
  }

  // 打开添加负责人弹出框
  const addOwnerShowDialog = ref(false);
  function closeAddOwnerShowDialog() {
    addOwnerShowDialog.value = false;
    principalRef.value && principalRef.value.getAppsOwnerListRequest();
  }
  const deletePrincipalLoading = ref(false);
  const principalRef: any = ref(null);
  // 删除负责人
  async function deletHostOwnerRequest() {
    const selectPrincipal = principalRef.value && principalRef.value.selectPrincipal;
    if (selectPrincipal.length == 0) {
      message.warning('请至少勾选一个负责人!');
      return;
    }
    Modal.confirm({
      title: '您确定要删除选中的负责人吗？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (deletePrincipalLoading.value) {
            return;
          }
          deletePrincipalLoading.value = true;
          const id: any = route.query && route.query.id;
          const params = {
            action: 'remove',
            role: 'developer',
            related_ids: selectPrincipal,
          };
          const data = await setAppsOwner(id, params);
          message.success(data.detail);
          principalRef.value && principalRef.value.getHostOwnerRequest();
          deletePrincipalLoading.value = false;
        } catch (error) {
          deletePrincipalLoading.value = false;
          console.error(error);
        }
      },
    });
  }
</script>
