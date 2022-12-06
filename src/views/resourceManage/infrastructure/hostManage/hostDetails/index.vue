<!-- 主机管理-详情 -->
<template>
  <div>
    <Breadcrumb>
      <template #right> </template>
    </Breadcrumb>
    <div class="p-4 bg-white">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="基本信息"><BasicInfo /></a-tab-pane>
        <a-tab-pane key="2" tab="负责人" force-render><Principal /></a-tab-pane>
        <a-tab-pane key="3" tab="应用实例"><Applications /></a-tab-pane>
        <a-tab-pane key="4" tab="服务列表"><ServiceList /></a-tab-pane>
        <template v-if="activeKey === '1'" #rightExtra>
          <span>展开</span>
        </template>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs as ATabs, TabPane as ATabPane } from 'ant-design-vue';
  import BasicInfo from './fragments/basic-info.vue';
  import Principal from './fragments/principal.vue';
  import Applications from './fragments/applications.vue';
  import ServiceList from './fragments/service-list.vue';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  const list = ref<API.HostManageListItem[]>([]);
  const spinning = ref(false);
  const total = ref(0);
  const activeKey = ref('1');
  // 获取主机列表
  // async function getHostMangeListRequest() {
  //   try {
  //     if (spinning.value) {
  //       return;
  //     }
  //     spinning.value = true;
  //     const data = await getHostMangeList();
  //     spinning.value = false;
  //     list.value = data.results;
  //     total.value = data.count;
  //   } catch (error) {
  //     spinning.value = false;
  //     console.error(error);
  //   }
  // }
  // getHostMangeListRequest();
</script>
