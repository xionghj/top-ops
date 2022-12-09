<!-- 主机管理-详情 -->
<template>
  <div>
    <Breadcrumb>
      <template #right>
        <div v-if="activeKey == '1'" class="flex">
          <div class="mr-2 cursor-pointer hover:text-blue-500">编辑</div>
          <a-dropdown placement="bottom">
            <div class="cursor-pointer hover:text-blue-500" @click.prevent> 更多操作 </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">导入</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">手工导入</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">自动采集</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">批量删除</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">查看归档</a>
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
                  <!-- <a href="javascript:;" @click="deletHostOwnerRequest">移除负责人</a> -->
                  <div class="cursor-pointer hover:text-blue-500" @click="deletHostOwnerRequest()"
                    >移除负责人</div
                  >
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </Breadcrumb>
    <div class="p-4 bg-white">
      <a-spin :spinning="basicInfoLodding">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="基本信息"
            ><BasicInfo :basic-info-expand="basicInfoExpand" :basic-info="basicInfo"
          /></a-tab-pane>
          <a-tab-pane key="2" tab="负责人" force-render
            ><Principal ref="principalRef"
          /></a-tab-pane>
          <a-tab-pane key="3" tab="应用实例"><Applications /></a-tab-pane>
          <a-tab-pane key="4" tab="服务列表"><ServiceList /></a-tab-pane>
          <template v-if="activeKey === '1'" #rightExtra>
            <span
              class="cursor-pointer hover:text-blue-500"
              @click="basicInfoExpand = !basicInfoExpand"
              >{{ basicInfoExpand ? '收起' : '展开' }}</span
            >
          </template>
        </a-tabs>
      </a-spin>
    </div>
    <AddOwnerDialog
      :add-owner-show-dialog="addOwnerShowDialog"
      @on-close-add-owner-show-dialog="closeAddOwnerShowDialog"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    Tabs as ATabs,
    TabPane as ATabPane,
    Spin as ASpin,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
  } from 'ant-design-vue';
  import BasicInfo from './fragments/basic-info.vue';
  import Principal from './fragments/principal.vue';
  import Applications from './fragments/applications.vue';
  import ServiceList from './fragments/service-list.vue';
  import AddOwnerDialog from './dialog/add-owner-dialog.vue';
  import { getHostMangeDetails } from '@/api/resourceManage/infrastructure/hostManage';
  const route = useRoute();
  const basicInfoExpand = ref(false);
  const activeKey = ref('1');
  const basicInfo = ref({});
  const basicInfoLodding = ref(false);
  async function getHostMangeDetailsRequest() {
    try {
      if (basicInfoLodding.value) {
        return;
      }
      basicInfoLodding.value = true;
      const { id } = route.query;
      const data = await getHostMangeDetails(id);
      basicInfoLodding.value = false;
      basicInfo.value = data;
    } catch (error) {
      basicInfoLodding.value = false;
      console.error(error);
    }
  }
  getHostMangeDetailsRequest();
  // 打开添加负责人弹出框
  const addOwnerShowDialog = ref(false);
  function closeAddOwnerShowDialog() {
    addOwnerShowDialog.value = false;
  }
  const principalRef = ref(null);
  async function deletHostOwnerRequest() {
    console.log('获取', principalRef.value.list);
    // if (state.selectedRowKeys.length == 0) {
    //   message.warning('请至少勾选一个负责');
    //   return;
    // }
    // try {
    //   if (state.addLodding) {
    //     return;
    //   }
    //   state.addLodding = true;
    //   const { id } = route.query;
    //   const params = {
    //     action: 'add',
    //     role: 'first_owner',
    //     related_ids: state.selectedRowKeys,
    //   };
    //   const data = await hostOwner(id, params);
    //   message.success(data.detail);
    //   handleCancel();
    //   state.addLodding = false;
    // } catch (error) {
    //   state.addLodding = false;
    //   console.error(error);
    // }
  }
</script>
