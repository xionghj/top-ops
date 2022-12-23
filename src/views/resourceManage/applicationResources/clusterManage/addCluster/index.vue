<!-- 集群管理-新增集群 -->
<template>
  <div>
    <Breadcrumb :show-back="true"></Breadcrumb>
    <div class="p-6 bg-white">
      <a-spin :spinning="clusterLoading">
        <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="名称" name="name">
                <a-input v-model:value="form.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="env" name="env">
                <a-input v-model:value="form.env" placeholder="请输入env" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="关联应用" name="app">
                <a-select v-model:value="form.app" placeholder="请选择所属应用">
                  <a-select-option
                    v-for="(item, index) in appsList"
                    :key="index"
                    :value="item.id"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="关联主机" name="business">
                <a-select v-model:value="form.hosts" mode="multiple" placeholder="请选择所属主机">
                  <a-select-option
                    v-for="(item, index) in hostList"
                    :key="index"
                    :value="item.id"
                    >{{ item.ip }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="备注" name="description">
                <a-input v-model:value="form.description" placeholder="请输入备注" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-divider />
        <a-button type="primary" :loading="loading" @click="onSubmit">保存</a-button>
      </a-spin>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { cloneDeep } from 'lodash-es';
  import {
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
    Button as AButton,
    Divider as ADivider,
    Row as ARow,
    Col as ACol,
    Select as ASelect,
    SelectOption as ASelectOption,
    Spin as ASpin,
    message,
  } from 'ant-design-vue';
  import type { Rule, FormInstance } from 'ant-design-vue/es/form';

  import { getCMDBAppsList } from '@/api/resourceManage/applicationResources/applicationManage';
  import { getHostMangeList } from '@/api/resourceManage/infrastructure/hostManage';
  import {
    addCluster,
    editCluster,
    getClusterDetails,
  } from '@/api/resourceManage/applicationResources/clusterManage';

  const labelCol = { style: { width: '100px' } };
  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const type = ref('add');

  const appsList = ref<any>([]);
  // 获取应用列表
  async function getCMDBAppsListRequest() {
    try {
      const params = {
        search: '',
        page: 1,
        pageSize: 10,
      };
      const data = await getCMDBAppsList(params);
      data.results.forEach((item: any) => {
        item.id = String(item.id);
      });
      appsList.value = data.results;
    } catch (error) {
      console.error(error);
    }
  }

  const hostList = ref<any>([]);
  // 获取主机列表
  async function getHostMangeListRequest() {
    try {
      const params = {
        search: '',
        page: 1,
        pageSize: 10,
      };
      const data = await getHostMangeList(params);
      data.results.forEach((item: any) => {
        item.id = String(item.id);
      });
      hostList.value = data.results;
    } catch (error) {
      console.error(error);
    }
  }

  const form = ref({
    name: '',
    env: '',
    app: '',
    hosts: [],
    description: '',
  });
  const loading = ref(false);
  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入' }],
    kind: [{ required: true, message: '请输入' }],
    description: [{ required: true, message: '请输入备注' }],
    parent: [{ required: true, message: '请输入' }],
    tester: [{ required: true, message: '请选择测试人员' }],
    pm: [{ required: true, message: '请选择产品经理' }],
    developer: [{ required: true, message: '请选择研发人员' }],
  };
  function onSubmit() {
    formRef.value &&
      formRef.value.validateFields().then(() => {
        submitRequest();
      });
  }
  // 保存
  async function submitRequest() {
    if (loading.value) {
      return;
    }
    loading.value = true;
    try {
      const params: any = cloneDeep(form.value);
      if (type.value == 'add') {
        await addCluster(params);
        message.success('添加成功');
      } else {
        delete params.creator;
        const id: any = route.query && route.query.id;
        await editCluster(id, params);
        message.success('编辑成功');
      }
      router.go(-1);
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  }
  // 获取详情信息
  const clusterLoading = ref(false);
  async function getClusterInfo() {
    try {
      if (clusterLoading.value) {
        return;
      }
      clusterLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getClusterDetails(id);
      data.app = data.app === null ? '' : String(data.app.id);
      const hosts: any = [];
      data.hosts.forEach((item: any) => {
        hosts.push(String(item.id));
      });
      data.hosts = hosts;
      form.value = data;
      clusterLoading.value = false;
    } catch (error) {
      clusterLoading.value = false;
      console.error(error);
    }
  }
  onMounted(async () => {
    const types: any = route.query && route.query.type;
    type.value = types;
    await getCMDBAppsListRequest();
    await getHostMangeListRequest();
    if (types === 'edit') {
      getClusterInfo();
    }
  });
</script>
