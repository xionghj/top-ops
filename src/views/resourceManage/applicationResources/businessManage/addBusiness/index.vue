<!-- 业务管理-新增业务 -->
<template>
  <div>
    <Breadcrumb :show-back="true"></Breadcrumb>
    <div class="p-6 bg-white">
      <a-spin :spinning="businessLoading">
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
              <a-form-item label="业务类型" name="kind">
                <a-radio-group v-model:value="form.kind" name="radioGroup">
                  <a-radio value="0">产品线</a-radio>
                  <a-radio value="1">子业务</a-radio>
                </a-radio-group>
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
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="应用" name="code">
                <div class="flex flex-col">
                  <span
                    class="mt-[5px] cursor-pointer text-blue-500 hover:text-blue-700"
                    @click="addApplicationShowDialog = true"
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
                    </a-table>
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
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
        </a-form>
        <a-divider />
        <a-button type="primary" :loading="loading" @click="onSubmit">保存</a-button>
      </a-spin>
    </div>
    <AddApplicationDialog
      :add-application-show-dialog="addApplicationShowDialog"
      @on-close-add-application-show-dialog="closeAddApplicationShowDialog"
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
  } from 'ant-design-vue';
  import AddApplicationDialog from './dialog/add-application-dialog.vue';
  import type { Rule, FormInstance } from 'ant-design-vue/es/form';
  import { getIdcMangeList } from '@/api/resourceManage/infrastructure/idcManage';
  import {
    addCMDBBusiness,
    editCMDBBusiness,
    getCMDBBusinessDetails,
  } from '@/api/resourceManage/applicationResources/businessManage';
  const labelCol = { style: { width: '100px' } };
  const applicationColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '应用层级',
      dataIndex: 'free_unum',
      key: 'free_unum',
    },
    {
      title: '应用别名',
      dataIndex: 'unum',
      key: 'unum',
    },
    {
      title: '操作',
      dataIndex: 'code',
      key: 'cpu_count',
    },
  ];
  const applicationList = ref([]);
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
    kind: '0',
    description: '',
    parent: '428350384709369295',
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
  // 获取数据中心列表
  const ibcList = ref<API.IbcManageListItem[]>([]);
  async function getIbcMangeListRequest() {
    try {
      const params = {
        search: '',
        page: 1,
        pageSize: 100,
      };
      const data = await getIdcMangeList(params);
      ibcList.value = data.results;
      ibcList.value.forEach((item) => {
        item.bigId = item.id.toString();
      });
    } catch (error) {
      console.error(error);
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
      form.value = data;
      businessLoading.value = false;
    } catch (error) {
      businessLoading.value = false;
      console.error(error);
    }
  }
  // 是否显示应用弹出框
  const addApplicationShowDialog = ref(false);
  function closeAddApplicationShowDialog() {
    addApplicationShowDialog.value = false;
  }
  onMounted(async () => {
    const types: any = route.query && route.query.type;
    type.value = types;
    // await getIbcMangeListRequest();
    if (types === 'edit') {
      getBusinessInfo();
    }
  });
</script>
