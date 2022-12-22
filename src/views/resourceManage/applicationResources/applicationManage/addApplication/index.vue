<!-- 应用管理-新增应用 -->
<template>
  <div>
    <Breadcrumb :show-back="true"></Breadcrumb>
    <div class="p-6 bg-white">
      <a-spin :spinning="appsLoading">
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
              <a-form-item label="中文别名" name="alias_name">
                <a-input v-model:value="form.alias_name" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="hierarchy" name="hierarchy">
                <a-input v-model:value="form.hierarchy" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="vcs" name="vcs">
                <a-input v-model:value="form.vcs" placeholder="请输入址" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Git 地址" name="repository">
                <a-input v-model:value="form.repository" placeholder="请输入Git 地址" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="framework" name="framework">
                <a-input v-model:value="form.framework" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="开发语言" name="language">
                <a-input v-model:value="form.language" placeholder="请输入开发语言" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="所属业务" name="business">
                <a-select v-model:value="form.business" placeholder="请选择所属业务">
                  <a-select-option
                    v-for="(item, index) in businessOption"
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
              <a-form-item label="owner" name="owner">
                <a-select v-model:value="form.owner" mode="multiple" placeholder="请选择">
                  <a-select-option
                    v-for="(item, index) in personOption"
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
              <a-form-item label="研发负责人" name="developer">
                <a-select v-model:value="form.developer" mode="multiple" placeholder="请选择">
                  <a-select-option
                    v-for="(item, index) in personOption"
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
              <a-form-item label="测试负责人" name="tester">
                <a-select v-model:value="form.tester" mode="multiple" placeholder="请选择">
                  <a-select-option
                    v-for="(item, index) in personOption"
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
  import { getCMDBBusinessList } from '@/api/resourceManage/applicationResources/businessManage';
  import {
    addCMDBApps,
    editCMDBApps,
    getCMDBAppsDetails,
  } from '@/api/resourceManage/applicationResources/applicationManage';
  const labelCol = { style: { width: '100px' } };
  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const type = ref('add');
  const personOption = [
    {
      name: 'corey',
      id: 2,
    },
    {
      name: 'xumiao',
      id: 4,
    },
  ];
  const businessOption = ref<any>([]);
  // 获取业务列表
  async function getCMDBBusinessListRequest() {
    try {
      const params = {
        search: '',
        page: 1,
        pageSize: 10,
      };
      const data = await getCMDBBusinessList(params);
      data.results.forEach((item: any) => {
        item.id = String(item.id);
      });
      businessOption.value = data.results;
    } catch (error) {
      console.error(error);
    }
  }
  const form = ref({
    name: '',
    alias_name: '',
    hierarchy: '',
    vcs: '',
    repository: '',
    framework: '',
    language: '',
    owner: [],
    tester: [],
    developer: [],
    description: '',
    business: [],
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
        await addCMDBApps(params);
        message.success('添加成功');
      } else {
        delete params.creator;
        params.business = params.business[0];
        const id: any = route.query && route.query.id;
        await editCMDBApps(id, params);
        message.success('编辑成功');
      }
      router.go(-1);
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  }
  // 获取详情信息
  const appsLoading = ref(false);
  async function getAppsInfo() {
    try {
      if (appsLoading.value) {
        return;
      }
      appsLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getCMDBAppsDetails(id);
      const tester: any = [];
      data.tester.forEach((item: any) => {
        tester.push(item.id);
      });
      data.tester = tester;
      const owner: any = [];
      data.owner.forEach((item: any) => {
        owner.push(item.id);
      });
      data.owner = owner;
      const developer: any = [];
      data.developer.forEach((item: any) => {
        developer.push(item.id);
      });
      data.developer = developer;
      const business: any = [];
      data.business.forEach((item: any) => {
        business.push(String(item.id));
      });
      data.business = business;
      form.value = data;
      appsLoading.value = false;
    } catch (error) {
      appsLoading.value = false;
      console.error(error);
    }
  }
  onMounted(async () => {
    const types: any = route.query && route.query.type;
    type.value = types;
    await getCMDBBusinessListRequest();
    if (types === 'edit') {
      getAppsInfo();
    }
  });
</script>
