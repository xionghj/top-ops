<!-- 主机管理-详情 -->
<template>
  <div>
    <Breadcrumb>
      <template #right> </template>
    </Breadcrumb>
    <div class="p-4 bg-white">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="基本信息"
          ><BasicInfo :basic-info-expand="basicInfoExpand" :basic-info="basicInfo"
        /></a-tab-pane>
        <a-tab-pane key="2" tab="负责人" force-render><Principal /></a-tab-pane>
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
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import { Tabs as ATabs, TabPane as ATabPane } from 'ant-design-vue';
  import BasicInfo from './fragments/basic-info.vue';
  import Principal from './fragments/principal.vue';
  import Applications from './fragments/applications.vue';
  import ServiceList from './fragments/service-list.vue';
  import { getHostMangeDetails } from '@/api/resourceManage/infrastructure/hostManage';
  const route = useRoute();
  const basicInfoExpand = ref(false);
  const activeKey = ref('1');
  let basicInfo = ref({});
  const basicInfoLodding = ref(false);
  async function getHostMangeDetailsRequest() {
    try {
      if (basicInfoLodding.value) {
        return;
      }
      basicInfoLodding.value = true;
      const id = route.query?.id;
      const data = await getHostMangeDetails(id);
      basicInfoLodding.value = false;
      basicInfo.value = data;
    } catch (error) {
      basicInfoLodding.value = false;
      console.error(error);
    }
  }
  getHostMangeDetailsRequest();
</script>
