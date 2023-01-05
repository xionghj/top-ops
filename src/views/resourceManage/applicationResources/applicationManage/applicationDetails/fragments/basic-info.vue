<!-- 应用管理-列表详情-基本信息-->
<template>
  <div class="px-4">
    <div>
      <div class="my-4">应用基本信息</div>
      <div class="bg-[#f7f8fa] p-4 rounded-sm">
        <a-descriptions :column="2">
          <a-descriptions-item label="名  称"> {{ basicInfo.name }}</a-descriptions-item>
          <a-descriptions-item label="简  写">{{ basicInfo.alias_name }}</a-descriptions-item>
          <a-descriptions-item label="应用层级">{{
            basicInfo.hierarchy && basicInfo.hierarchy.name
          }}</a-descriptions-item>
          <a-descriptions-item label="备  注">{{ basicInfo.description }}</a-descriptions-item>
          <a-descriptions-item label="所属业务">
            <span v-for="(item, index) in basicInfo.business" :key="index">
              {{ item.name }}{{ basicInfo.business.length - 1 != index ? '/' : '' }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="运维负责人">
            <span
              v-for="(item, index) in basicInfo.owner"
              :key="index"
              class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
            >
              {{ item.username }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="Git 地址">{{ basicInfo.repository }}</a-descriptions-item>
          <a-descriptions-item label="开发负责人">
            <span
              v-for="(item, index) in basicInfo.developer"
              :key="index"
              class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
            >
              {{ item.username }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="开发语言">{{ basicInfo.language }}</a-descriptions-item>
          <a-descriptions-item label="测试负责人">
            <span
              v-for="(item, index) in basicInfo.tester"
              :key="index"
              class="rounded-[50rem] px-[6px] pb-[3px] h-[19px] bg-[#3D78E3] text-white mr-1 flex items-center justify-center"
            >
              {{ item.username }}
            </span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
    <div class="mt-4">
      <div>实例分布</div>
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
      <div class="mt-4">
        <a-table
          :columns="rackColumns"
          :data-source="rackList"
          row-key="id"
          :pagination="false"
          :loading="hostRackLodding"
          class="w-full"
        >
        </a-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Table as ATable,
    Tag as ATag,
  } from 'ant-design-vue';
  import { getIdcRacks } from '@/api/resourceManage/infrastructure/idcManage';
  import { getCMDBAppsDetails } from '@/api/resourceManage/applicationResources/applicationManage';
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
  // 获取基本信息
  const basicInfo = ref({
    name: '',
    alias_name: '',
    hierarchy: {
      id: '',
      name: '',
    },
    description: '',
    business: [] as any,
    owner: [] as any,
    developer: [] as any,
    tester: [] as any,
    repository: '',
    language: '',
  });
  const basicInfoLoading = ref(false);
  async function getAppsInfo() {
    try {
      if (basicInfoLoading.value) {
        return;
      }
      basicInfoLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getCMDBAppsDetails(id);
      basicInfo.value = data;
      basicInfoLoading.value = false;
    } catch (error) {
      basicInfoLoading.value = false;
      console.error(error);
    }
  }
  getAppsInfo();
  // 获取所属机柜
  const rackColumns = [
    {
      title: '实例 IP',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '部署路径',
      dataIndex: 'free_unum',
      key: 'free_unum',
    },
    {
      title: '当前版本',
      dataIndex: 'unum',
      key: 'unum',
    },
    {
      title: '监听端口',
      dataIndex: 'code',
      key: 'cpu_count',
    },
    {
      title: '实例状态',
      dataIndex: 'code',
      key: 'cpu_count',
    },
    {
      title: 'JDK 版本',
      dataIndex: 'code',
      key: 'cpu_count',
    },
  ];
  const rackList = ref([]);
  const hostRackLodding = ref(false);
  async function getIdcRacksRequest() {
    try {
      if (hostRackLodding.value) {
        return;
      }
      hostRackLodding.value = true;
      const id: any = route.query && route.query.id;
      const data = await getIdcRacks(id);
      rackList.value = data.results;
      hostRackLodding.value = false;
    } catch (error) {
      hostRackLodding.value = false;
      console.error(error);
    }
  }
</script>
<style lang="less" scoped>
  :deep(.ant-descriptions-item-label) {
    // width: 120px;
    // display: flex;
    // justify-content: flex-end;
    padding-right: 2px;
    color: #86909c;
  }
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
