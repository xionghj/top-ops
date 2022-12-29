<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <div class="flex">
      <div class="w-[260px] bg-white p-4 rounded-sm">
        <a-input v-model:value="searchValue" placeholder="请输入关键字进行过滤" />
        <div class="my-3">所有业务系统</div>
        <a-tree
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          show-line
          :show-icon="true"
          :auto-expand-parent="autoExpandParent"
          :load-data="onLoadData"
          :tree-data="treeData"
          :field-names="fieldNames"
          @expand="onExpand"
          @select="onSelect"
        >
          <template #icon="{ expanded, dataRef }">
            <template v-if="dataRef.isLeaf">
              <file-filled style="color: #878a99" />
            </template>
            <template v-else>
              <folder-open-filled v-if="expanded" style="color: #878a99" />
              <folder-filled v-else style="color: #878a99" />
            </template>
          </template>
          <template #title="{ name }">
            <span v-if="name.indexOf(searchValue) > -1">
              {{ name.substr(0, name.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ name }}</span>
          </template>
        </a-tree>
      </div>
      <div class="flex flex-col flex-1 ml-4">
        <div class="bg-white rounded-sm p-4">
          <a-descriptions :column="2">
            <a-descriptions-item label="名称"> {{ basicInfo.name }}</a-descriptions-item>
            <a-descriptions-item label="类型">{{ basicInfo.kind }}</a-descriptions-item>
            <a-descriptions-item label="备注说明">{{ basicInfo.description }}</a-descriptions-item>
            <a-descriptions-item label="运维负责人"
              ><span v-for="(item, index) in basicInfo.owner" :key="index">
                {{ item.username }}{{ basicInfo.owner.length - 1 != index ? '，' : '' }}
              </span></a-descriptions-item
            >
            <a-descriptions-item label="产品经理"
              ><span v-for="(item, index) in basicInfo.pm" :key="index">
                {{ item.username }}{{ basicInfo.pm.length - 1 != index ? '，' : '' }}
              </span></a-descriptions-item
            >
            <a-descriptions-item label="研发负责人"
              ><span
                v-for="(item, index) in basicInfo.developer"
                :key="index"
                class="rounded-full py-0.5 px-4 bg-blue-500 text-white mr-1 flex items-center justify-center"
              >
                {{ item.username }}
              </span></a-descriptions-item
            >
          </a-descriptions>
        </div>
        <div class="bg-white rounded-sm mt-4 px-4 pb-4">
          <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
            <a-tab-pane key="applicationList" tab="应用列表"
              ><ApplicationList v-if="activeKey === 'applicationList'" ref="applicationListRef"
            /></a-tab-pane>
            <a-tab-pane key="hostList" tab="主机列表"
              ><HostList v-if="activeKey === 'hostList'" ref="hostListRef"
            /></a-tab-pane>
            <a-tab-pane key="subBusinessList" tab="子业务列表"
              ><SubBusinessList v-if="activeKey === 'subBusinessList'" ref="subBusinessListRef"
            /></a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    CarryOutOutlined,
    SmileTwoTone,
    FolderFilled,
    DownOutlined,
    FolderOpenFilled,
    FileFilled,
  } from '@ant-design/icons-vue';
  import {
    Tree as ATree,
    DirectoryTree as ADirectoryTree,
    Input as AInput,
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Tabs as ATabs,
    TabPane as ATabPane,
  } from 'ant-design-vue';
  import ApplicationList from './fragments/application-list.vue';
  import HostList from './fragments/host-list.vue';
  import SubBusinessList from './fragments/sub-business-list.vue';
  import type { TreeProps } from 'ant-design-vue';

  import {
    getCMDBBusinessTree,
    getCMDBBusinessTreeChildren,
  } from '@/api/resourceManage/applicationResources/businessTopology';
  import { getCMDBBusinessDetails } from '@/api/resourceManage/applicationResources/businessManage';

  const route = useRoute();

  const searchValue = ref<string>('');
  const expandedKeys = ref<TreeProps['expandedKeys']>([]);
  const selectedKeys = ref<TreeProps['selectedKeys']>([]);
  const autoExpandParent = ref<boolean>(true);
  const treeData = ref<TreeProps['treeData']>([]);
  const dataList: TreeProps['treeData'] = [];
  // 获取业务树
  async function getCMDBBusinessTreeRequest() {
    try {
      const data = await getCMDBBusinessTree({});
      treeData.value = data.results;
      generateList(treeData.value);
    } catch (error) {
      console.error(error);
    }
  }
  getCMDBBusinessTreeRequest();
  const generateList = (data: TreeProps['treeData']) => {
    if (data?.length) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.id.toString();
        data[i].id = data[i].id.toString();
        if (data[i].children && data[i].children.length > 0) {
          data[i].isLeaf = false;
        } else {
          data[i].isLeaf = true;
        }
        // data[i].children = [];
        dataList.push({ key, name: node.name });
        if (node.children) {
          generateList(node.children);
        }
      }
    }
  };
  const onExpand = (keys: TreeProps['expandedKeys']) => {
    expandedKeys.value = keys;
    autoExpandParent.value = false;
  };

  const applicationListRef = ref(null);
  const onSelect = (keys: TreeProps['selectedKeys']) => {
    if (keys && keys.length > 0) {
      getBusinessDetails(keys[0]);
    }
    if (activeKey.value === 'applicationList') {
      applicationListRef.value && applicationListRef.value.refresh(keys[0]);
    }
  };
  watch(searchValue, (value) => {
    const expanded = dataList
      .map((item: TreeProps['treeData'][number]) => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.name, treeData.value);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    expandedKeys.value = expanded;
    searchValue.value = value;
    autoExpandParent.value = true;
  });
  const getParentKey = (
    key: string | number,
    tree: TreeProps['treeData'],
  ): string | number | undefined => {
    let parentKey;
    if (tree?.length) {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some((item) => item.name === key)) {
            parentKey = node.id;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
    }
    return parentKey;
  };

  const fieldNames: TreeProps['fieldNames'] = {
    children: 'children',
    title: 'name',
    key: 'id',
  };
  const onLoadData: TreeProps['loadData'] = (treeNode) => {
    if (treeNode.dataRef) {
      return getCMDBBusinessTreeChildren(treeNode.dataRef.id).then((data) => {
        treeNode.dataRef.children = data.results;
        treeData.value = [...treeData.value];
        generateTree(treeData.value);
      });
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }

    // return new Promise((resolve) => {
    //   console.log('展开了', treeNode);
    //   // if (treeNode.dataRef.children) {
    //   //   resolve();
    //   //   return;
    //   // }
    //   setTimeout(() => {
    //     treeNode.dataRef.children = [
    //       { name: '企微管家-消息存档1', id: `${treeNode.eventKey}-0` },
    //       { name: '企微管家-消息存档2', id: `${treeNode.eventKey}-1` },
    //     ];
    //     treeData.value = [...treeData.value];
    //     console.log('获取数据', treeData.value);
    //     // generateList(treeData.value);
    //     resolve();
    //   }, 1000);
    // });
  };
  const generateTree = (data: TreeProps['treeData']) => {
    if (data?.length) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.id.toString();
        data[i].id = data[i].id.toString();
        if (data[i].children && data[i].children.length > 0) {
          data[i].isLeaf = false;
        } else {
          data[i].isLeaf = true;
        }
        dataList.push({ key, name: node.name });
        if (node.children) {
          generateTree(node.children);
        }
      }
    }
  };
  // 基本信息
  const basicInfo = ref({
    name: '',
    kind: '',
    pm: [] as any,
    owner: [] as any,
    developer: [] as any,
    description: '',
  });
  // 获取业务基本信息
  async function getBusinessDetails(id: any) {
    try {
      const data = await getCMDBBusinessDetails(id);
      basicInfo.value = data;
    } catch (error) {
      console.error(error);
    }
  }
  //
  const activeKey = ref('applicationList');
  //
  function tabsChange() {
    if (activeKey.value === 'applicationList' && selectedKeys.value.length > 0) {
      nextTick(() => {
        applicationListRef.value && applicationListRef.value.refresh(selectedKeys.value[0]);
      });
    }
  }
</script>
<style lang="less" scoped>
  :deep(.ant-tree-switcher-noop) {
    // display: none;
    color: transparent;
  }
  :deep(.ant-tree .ant-tree-node-content-wrapper) {
    padding: 0 3px;
  }
  :deep(.ant-tree-title) {
    padding-right: 4px;
  }
</style>
