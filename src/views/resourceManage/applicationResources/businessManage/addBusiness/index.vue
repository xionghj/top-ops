<!-- 业务管理-新增业务 -->
<template>
  <div>
    <Breadcrumb :show-back="true"></Breadcrumb>
    <div class="p-6 bg-white">
      <a-spin :spinning="businessLoading">
        <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol">
          <a-row :gutter="16">
            <a-col :xs="18" :sm="18" :md="18" :lg="18" :xl="14">
              <a-form-item label="名称" name="name">
                <a-input v-model:value="form.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs="18" :sm="18" :md="18" :lg="18" :xl="14">
              <a-form-item label="业务类型" name="kind">
                <a-radio-group v-model:value="form.kind" name="radioGroup">
                  <a-radio :value="0">产品线</a-radio>
                  <a-radio :value="1">子业务</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs="18" :sm="18" :md="18" :lg="18" :xl="14">
              <a-form-item label="备注" name="description">
                <a-input v-model:value="form.description" placeholder="请输入备注" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs="18" :sm="18" :md="18" :lg="18" :xl="14">
              <a-form-item label="应用" name="code">
                <div class="flex flex-col">
                  <span
                    class="block mt-[5px] cursor-pointer text-blue-500 hover:text-blue-700"
                    @click="openAddApplicationShowDialog"
                    >添加</span
                  >
                  <div class="mt-1">
                    <a-table
                      :columns="applicationColumns"
                      :data-source="applicationList"
                      row-key="id"
                      :pagination="false"
                      class="w-full"
                    >
                      <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'hierarchy'">
                          <span>
                            {{ record.hierarchy && record.hierarchy.name }}
                          </span>
                        </template>
                        <template v-if="column.key === 'action'">
                          <a-popconfirm title="确定删除该应用吗?" @confirm="onDelete(record.id)">
                            <span class="text-[#3D78E3] cursor-pointer"> 删除 </span>
                          </a-popconfirm>
                        </template>
                      </template>
                    </a-table>
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs="18" :sm="18" :md="18" :lg="18" :xl="14">
              <a-form-item label="产品经理" name="pm">
                <a-select v-model:value="form.pm" mode="multiple" placeholder="请选择">
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
            <a-col :xs="18" :sm="18" :md="18" :lg="18" :xl="14">
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
            <a-col :xs="18" :sm="18" :md="18" :lg="18" :xl="14">
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
        </a-form>
        <a-divider />
        <a-button type="primary" :loading="loading" @click="onSubmit">保存</a-button>
      </a-spin>
    </div>
    <AddApplicationDialog
      ref="addApplicationDialogRef"
      @on-add-application-confirm="addApplicationConfirm"
    />
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
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    Table as ATable,
    Popconfirm as APopconfirm,
  } from 'ant-design-vue';
  import AddApplicationDialog from './dialog/add-application-dialog.vue';
  import type { Rule, FormInstance } from 'ant-design-vue/es/form';
  import {
    addCMDBBusiness,
    editCMDBBusiness,
    getCMDBBusinessDetails,
  } from '@/api/resourceManage/applicationResources/businessManage';
  import { getCMDBAppsList } from '@/api/resourceManage/applicationResources/applicationManage';
  const labelCol = { style: { width: '100px' } };
  const applicationColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '应用层级',
      dataIndex: 'hierarchy',
      key: 'hierarchy',
    },
    {
      title: '应用别名',
      dataIndex: 'alias_name',
      key: 'alias_name',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    },
  ];
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
  const form = ref({
    name: '',
    kind: 0,
    description: '',
    parent: null,
    apps: [],
    tester: [],
    pm: [],
    developer: [],
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
      const apps: number[] = [];
      applicationList.value.forEach((item) => {
        apps.push(item.id);
      });
      params.apps = apps;
      if (type.value == 'add') {
        await addCMDBBusiness(params);
        message.success('添加成功');
      } else {
        delete params.creator;
        const id: any = route.query && route.query.id;
        await editCMDBBusiness(id, params);
        message.success('编辑成功');
      }
      router.go(-1);
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  }
  // 获取详情信息
  const businessLoading = ref(false);
  async function getBusinessInfo() {
    try {
      if (businessLoading.value) {
        return;
      }
      businessLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getCMDBBusinessDetails(id);
      const tester: any = [];
      data.tester.forEach((item: any) => {
        tester.push(item.id);
      });
      data.tester = tester;
      const pm: any = [];
      data.pm.forEach((item: any) => {
        pm.push(item.id);
      });
      data.pm = pm;
      const developer: any = [];
      data.developer.forEach((item: any) => {
        developer.push(item.id);
      });
      data.developer = developer;
      data.parent = data.parent && data.parent.id;
      data.kind = data.kind && data.kind.id;
      form.value = data;
      businessLoading.value = false;
    } catch (error) {
      businessLoading.value = false;
      console.error(error);
    }
  }
  // 应用弹出框
  const addApplicationDialogRef = ref();
  function openAddApplicationShowDialog() {
    const apps: string[] = [];
    applicationList.value.forEach((item) => {
      apps.push(item.id.toString());
    });
    addApplicationDialogRef.value && addApplicationDialogRef.value.openDialog(apps);
  }
  type Creator = {
    id: number;
    username: string;
    name: string;
  };
  interface ApplicationList {
    alias_name: string;
    business: [];
    creator: Creator;
    description: string;
    developer: [];
    hierarchy: string;
    id: number;
    name: string;
    owner: [];
    tester: [];
    updated_at: string;
  }
  const applicationList = ref<ApplicationList[]>([]);
  // 选择应用确认
  function addApplicationConfirm(selectedList: ApplicationList[]) {
    applicationList.value = selectedList;
  }
  // 应用删除
  const onDelete = (id: number) => {
    applicationList.value = applicationList.value.filter((item) => item.id !== id);
  };
  // 获取应用列表
  async function getApplicationListRequest() {
    const id: any = route.query && route.query.id;
    try {
      const params = {
        search: '',
        page: 1,
        page_size: 100,
        business: id,
      };
      const data = await getCMDBAppsList(params);
      applicationList.value = data.results;
    } catch (error) {
      console.error(error);
    }
  }
  onMounted(async () => {
    const types: any = route.query && route.query.type;
    type.value = types;
    if (types === 'edit') {
      getBusinessInfo();
      getApplicationListRequest();
    }
  });
</script>
