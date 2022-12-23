<!-- 集群管理-详情 -->
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
      </template>
    </Breadcrumb>
    <div class="px-4 pb-4 bg-white">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="基本信息"><BasicInfo v-if="activeKey === '1'" /></a-tab-pane>
        <a-tab-pane key="2" tab="应用列表"></a-tab-pane>
        <a-tab-pane key="3" tab="主机列表"></a-tab-pane>
      </a-tabs>
    </div>
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

  const router = useRouter();
  const route = useRoute();

  function onBack() {
    router.go(-1);
  }
  const activeKey = ref('1');
  function onEditApps() {
    const id: any = route.query && route.query.id;
    router.push({ name: 'addCluster', query: { id, type: 'edit' } });
  }
</script>
