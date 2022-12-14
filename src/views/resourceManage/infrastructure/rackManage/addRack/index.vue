<!-- 机柜管理 -- 新增机柜 -->
<template>
  <div>
    <Breadcrumb>
      <template #left>
        <ArrowLeftOutlined
          class="mr-2"
          :style="{ fontSize: '14px', color: '#1e8eff' }"
          @click="onBack"
        /> </template
    ></Breadcrumb>
    <div class="p-6 bg-white">
      <a-spin :spinning="rackInfoLoading">
        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机柜名称" name="name">
                <a-input v-model:value="form.name" placeholder="请输入机柜名称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机柜U数" name="unum">
                <a-input v-model:value="form.unum" placeholder="请输入机柜U数" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="可用U数" name="free_unum">
                <a-input v-model:value="form.free_unum" placeholder="请输入可用U数" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机柜编号" name="code">
                <a-input v-model:value="form.code" placeholder="请输入机柜编号" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="所属机房" name="idc">
                <a-select v-model:value="form.idc" placeholder="请选择所属机房">
                  <a-select-option
                    v-for="(item, index) in ibcList"
                    :key="index"
                    :value="item.bigId"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机柜状态" name="status">
                <a-select v-model:value="form.status" placeholder="请选择机柜状态">
                  <a-select-option :value="1">启用</a-select-option>
                  <a-select-option :value="2">停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="备注说明" name="description">
                <a-input v-model:value="form.description" placeholder="请输入备注说明" />
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
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
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
  import {
    addRack,
    editRack,
    getRackDetails,
  } from '@/api/resourceManage/infrastructure/rackManage';
  import { getIbcMangeList } from '@/api/resourceManage/infrastructure/ibcManage';
  const router = useRouter();
  const route = useRoute();
  function onBack() {
    router.go(-1);
  }
  const formRef = ref<FormInstance>();
  const type = ref('add');
  const form = ref({
    name: '',
    code: '',
    unum: '',
    free_unum: '',
    status: null,
    description: '',
    priority: '',
    idc: '',
  });
  const loading = ref(false);
  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入机柜名称' }],
    code: [{ required: true, message: '请输入机柜编号' }],
    unum: [{ required: true, message: '请输入机柜U数' }],
    free_unum: [{ required: true, message: '请输入可用U数' }],
    status: [{ required: true, message: '请输入机柜名称' }],
    description: [{ required: true, message: '请输入备注说明' }],
    idc: [{ required: true, message: '请输入机柜名称' }],
  };
  function onSubmit() {
    formRef.value &&
      formRef.value.validateFields().then(() => {
        submitReuest();
      });
  }
  // 保存
  async function submitReuest() {
    if (loading.value) {
      return;
    }
    loading.value = true;
    try {
      const params: any = cloneDeep(form.value);
      if (type.value == 'add') {
        await addRack(params);
        message.success('添加成功');
      } else {
        delete params.creator;
        const id: any = route.query && route.query.id;
        await editRack(id, params);
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
      const data = await getIbcMangeList(params);
      ibcList.value = data.results;
      ibcList.value.forEach((item) => {
        item.bigId = item.id.toString();
      });
    } catch (error) {
      console.error(error);
    }
  }
  // 获取机柜信息
  const rackInfoLoading = ref(false);
  async function getRackInfo() {
    try {
      if (rackInfoLoading.value) {
        return;
      }
      rackInfoLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getRackDetails(id);
      data.idc = data.idc.id.toString();
      form.value = data;
      rackInfoLoading.value = false;
    } catch (error) {
      rackInfoLoading.value = false;
      console.error(error);
    }
  }
  onMounted(async () => {
    const types: any = route.query && route.query.type;
    type.value = types;
    await getIbcMangeListRequest();
    if (types === 'view') {
      getRackInfo();
    }
  });
</script>
