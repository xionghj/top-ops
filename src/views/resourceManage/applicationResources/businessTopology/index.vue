<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <div class="flex">
      <div class="w-[300px] bg-white p-4 rounded-sm">
        <a-input-search
          v-model:value="searchValue"
          style="margin-bottom: 8px"
          placeholder="Search"
        />
        <a-tree
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          :load-data="onLoadData"
          :tree-data="treeData"
        >
          <template #title="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
      <div class="flex flex-col flex-1 ml-4">
        <div class="bg-white rounded-sm p-4">
          <a-descriptions :column="2">
            <a-descriptions-item label="名称"> {{ basicInfo.name }}</a-descriptions-item>
            <a-descriptions-item label="类型">{{ basicInfo.short_name }}</a-descriptions-item>
            <a-descriptions-item label="备注说明">{{ basicInfo.description }}</a-descriptions-item>
            <a-descriptions-item label="运维负责人">{{ basicInfo.telephone }}</a-descriptions-item>
            <a-descriptions-item label="产品经理">{{ basicInfo.address }}</a-descriptions-item>
            <a-descriptions-item label="研发负责人">{{ basicInfo.address }}</a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="bg-white rounded-sm mt-4 px-4 pb-4">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="应用列表"
              ><ApplicationList v-if="activeKey === '1'"
            /></a-tab-pane>
            <a-tab-pane key="2" tab="主机列表"><HostList v-if="activeKey === '2'" /></a-tab-pane>
            <a-tab-pane key="3" tab="子业务列表"
              ><subBusinessList v-if="activeKey === '3'"
            /></a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import {
    Tree as ATree,
    InputSearch as AInputSearch,
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Tabs as ATabs,
    TabPane as ATabPane,
  } from 'ant-design-vue';
  import ApplicationList from './fragments/application-list.vue';
  import HostList from './fragments/host-list.vue';
  import subBusinessList from './fragments/sub-business-list.vue';
  import type { TreeProps } from 'ant-design-vue';
  const searchValue = ref<string>('');
  const expandedKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);
  const treeData = ref<TreeProps['treeData']>([
    { title: '业务一', key: '0', sub_business: [] },
    { title: '业务二', key: '1' },
    { title: '业务三', key: '2', isLeaf: true },
  ]);
  const dataList: TreeProps['treeData'] = [];
  const generateList = (data: TreeProps['treeData']) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      dataList.push({ key, title: key });
      if (node.sub_business) {
        generateList(node.sub_business);
      }
    }
  };
  generateList(treeData.value);
  watch(searchValue, (value) => {
    const expanded = dataList
      .map((item: TreeProps['treeData'][number]) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData.value);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    expandedKeys.value = expanded;
    searchValue.value = value;
    // autoExpandParent.value = true;
  });
  const getParentKey = (
    key: string | number,
    tree: TreeProps['treeData'],
  ): string | number | undefined => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const fieldNames: TreeProps['fieldNames'] = {
    children: 'sub_business',
    title: 'name',
    key: 'id',
  };
  // const treeData = ref<TreeProps['treeData']>([
  //   {
  //     id: '374fa330-1657-4491-ba8a-f6b82c2b2c30',
  //     bid: '7556b49601401291',
  //     name: '商管中心',
  //     sub_business: [],
  //   },
  //   {
  //     id: 'f8990e6f-253d-4cc0-bc22-d3c9f4d72896',
  //     bid: '139512cd0ce9776e',
  //     name: '云帆',
  //     sub_business: [
  //       { id: 'f3aad1a9-bd51-4826-b248-436f5b0e9b0c', name: '云帆-前端' },
  //       { id: '4dfd3d4d-6b3d-464c-9524-057cd610f340', name: '云帆-后端服务' },
  //       { id: '7388b1c5-4205-470d-b486-bb0b07d946cb', name: '分布式任务调度平台' },
  //     ],
  //   },
  //   {
  //     id: 'e1093f8d-0c45-4f81-95e2-0d516d141437',
  //     bid: 'cbb458deb45e800a',
  //     name: '大数据',
  //     sub_business: [
  //       { id: '82eab5d7-eaa8-48a5-be40-4d9ec256c0ad', name: '科脉盖亚' },
  //       { id: '7e6ddbc5-6a2b-41bf-9f18-ef03de88981b', name: '数据资产' },
  //     ],
  //   },
  //   {
  //     id: '8270321d-27b9-4147-bcaf-9b40e48311a3',
  //     bid: 'c16d187b3086925e',
  //     name: '架构基础组件',
  //     sub_business: [
  //       { id: '867b3d8a-2be1-4765-8104-b7f4a7956143', name: '业务组件' },
  //       { id: '8c1c770d-e511-4ab2-83f1-b8d394cd45cd', name: '工具组件' },
  //     ],
  //   },
  //   {
  //     id: 'cd368839-1bca-416e-b7b1-4d32f4e0c4a4',
  //     bid: '260c85f9df7241b4',
  //     name: '运维平台测试',
  //     sub_business: [],
  //   },
  //   {
  //     id: '33538681-7523-4ec2-a9b1-114bb5f0d35d',
  //     bid: '25ae4adfcad9c2f0',
  //     name: '科脉有数',
  //     sub_business: [
  //       { id: 'd6f35d44-532e-4619-b8ed-47ef00efbafa', name: '门店' },
  //       { id: '660c6554-448e-44e9-a047-63c257ca37ac', name: '商户中心' },
  //       { id: 'f0f7a552-912b-4f7c-a1ef-a567d2194321', name: '微信' },
  //       { id: '0f2be951-8923-48ae-bd77-310e21598c7e', name: '电子发票' },
  //       { id: '9e159d03-9ecc-47b5-b135-8fb37cf6e027', name: '数据平台' },
  //       { id: '962df39e-fe85-4f91-89cf-4f9232fdb944', name: '科脉有数前端' },
  //       { id: '237135ae-4519-4d62-a682-beaed2629222', name: '微商城' },
  //       { id: '49bed31f-d77d-4e50-a9d8-fe5a21c10e69', name: '外卖' },
  //       { id: 'cf71043e-3eb6-46d7-a409-c13a890a5b39', name: '销售员' },
  //       { id: 'ef46969e-ea7c-4e4e-9917-ae8cfc3a3779', name: '有数资源管理' },
  //       { id: 'f15bf769-b450-4bc2-8dd5-1b078f4f20e0', name: '运营平台' },
  //       { id: 'e987ce86-78ff-401c-855f-0fdb128565c7', name: '网关服务' },
  //       { id: '495cdda8-d424-482c-ab2f-40dd3f0f2cd6', name: '营销' },
  //       { id: 'f2cd929d-1cff-4383-b241-57f6a2257c45', name: '订单' },
  //       { id: '1ca6d016-f2e1-4a0e-94b4-ec68ccacb1cf', name: '报表中心' },
  //       { id: 'f8e30cd4-606c-4553-9e94-13441f0addc2', name: '会员' },
  //       { id: '9d59878d-387a-4d3b-9d7e-eb55378fca98', name: '享钱通控件' },
  //       { id: '5c5ba4f7-1253-4acb-89c3-3de7163fe291', name: '商品' },
  //       { id: 'dc80fdd2-3ce9-408b-b139-62bce02e6a4b', name: '回调' },
  //       { id: '74f47d75-5d6e-4e55-99a7-d35842f0844d', name: '批量任务处理服务' },
  //       { id: '885366c9-94c6-430f-a321-f130ef52acc1', name: '采集' },
  //       { id: '39cfb8c1-3bd7-4eb9-9867-d62521ed079d', name: '有数开放接口' },
  //       { id: '8dfd46aa-e65a-48dd-8d85-a1f3f6ad1a1b', name: '履约' },
  //       { id: '62e026e9-f5d8-48be-a36a-4a5302d2dfc3', name: '社群营销' },
  //       { id: 'f1ab7507-9417-4ff7-bcf0-11f710009268', name: '帮助中心' },
  //       { id: '4619176b-60c3-40dd-9dd1-80b40c467326', name: '日志助手' },
  //       { id: '5ff0047f-9969-404c-bf0a-f032e7149a5b', name: '短信' },
  //       { id: '707a2cd0-1f48-4c51-be3e-40b47c438135', name: '消息推送' },
  //     ],
  //   },
  //   {
  //     id: 'e8874ef4-907a-461e-ba8b-3e07df4cd62a',
  //     bid: 'fc774c245da5abc3',
  //     name: '企微管家',
  //     sub_business: [{ id: '8089bd93-8c3d-45fb-9ac7-6264dafd17cf', name: '企微管家-消息存档' }],
  //   },
  //   {
  //     id: '1adf3ece-c389-4c9d-b338-1df3c789b8a6',
  //     bid: '320c1ec3bfe04d5d',
  //     name: '享钱',
  //     sub_business: [
  //       { id: '7e82cabc-5d97-4fd2-9b0b-d78b0853dac4', name: '对账' },
  //       { id: 'b8ccd2b1-99d3-44d3-9e3b-e53d9b0a94de', name: '钱包' },
  //       { id: 'e15b1d1c-b1e3-4c5c-8ec3-4a37f8e24280', name: '结算' },
  //       { id: '0f61416e-d9dd-439c-8d0b-3e03461d09ef', name: '商户收银' },
  //       { id: '0f1481de-26ea-462d-b7b8-4e452b7d956f', name: '支付' },
  //       { id: 'a1cd65ce-7221-43cb-a516-7e8b022f8fad', name: '口碑' },
  //     ],
  //   },
  //   {
  //     id: 'f0fdce89-e773-4d7a-ba75-01c7f7491364',
  //     bid: 'dfc54b28657f309d',
  //     name: '赢钱云POS',
  //     sub_business: [],
  //   },
  //   {
  //     id: 'd1216970-f238-4627-b48f-90ef01ddefc5',
  //     bid: 'a6b5ab5064643ac4',
  //     name: '数字化',
  //     sub_business: [
  //       { id: '2874b5a4-8d60-4ff5-998a-151bfbd883b5', name: 'LDAP服务' },
  //       { id: 'f39b6c92-bd33-4b45-a754-5783e7edd827', name: '金融' },
  //       { id: 'df3e059e-e298-4a15-b95a-41ecf33bb208', name: '商户' },
  //       { id: '19d75646-acab-46ff-b645-33447376a17d', name: '账号中心' },
  //       { id: '5c187375-fe0e-4b86-bea7-7a6a1a447bce', name: '数据中心' },
  //       { id: 'e5416688-c6a2-47d5-8d67-328016e633ec', name: '科脉授权中心' },
  //       { id: '55968c5b-b609-486e-be26-2bf7ff046e53', name: '广告' },
  //       { id: '02c5156d-55f5-47cc-bba9-2fbbeb02edce', name: 'BOSS平台' },
  //       { id: '96108753-8d3d-48c4-b50f-80dfe5d569b0', name: '设备管理IOT' },
  //       { id: '04a94187-279e-48c2-8a5b-efaf4f625cf8', name: '渠道管理平台' },
  //     ],
  //   },
  // ]);
  const onLoadData: TreeProps['loadData'] = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.dataRef.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.dataRef.children = [
          { title: '企微管家-消息存档1', key: `${treeNode.eventKey}-0` },
          { title: '企微管家-消息存档2', key: `${treeNode.eventKey}-1` },
        ];
        treeData.value = [...treeData.value];
        resolve();
      }, 1000);
    });
  };

  const basicInfo = ref({});
  const activeKey = ref('1');
</script>
