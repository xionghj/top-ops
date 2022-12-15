<!-- 数据中心 -- 新增机房 -->
<template>
  <div>
    <Breadcrumb :show-back="true"></Breadcrumb>
    <div class="p-6 bg-white">
      <a-spin :spinning="idcInfoLoading">
        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机房名称" name="name">
                <a-input v-model:value="form.name" placeholder="请输入机房名称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机房简写" name="short_name">
                <a-input v-model:value="form.short_name" placeholder="请输入机房简写" />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机房类型" name="free_unum">
                <a-input v-model:value="form.free_unum" placeholder="请输入机房类型" />
              </a-form-item>
            </a-col>
          </a-row> -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="联系人" name="contact">
                <a-input v-model:value="form.contact" placeholder="请输入联系人" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="联系电话" name="telephone">
                <a-input v-model:value="form.telephone" placeholder="请输入联系电话" />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机房编号" name="code">
                <a-input v-model:value="form.code" placeholder="请输入机房编号" />
              </a-form-item>
            </a-col>
          </a-row> -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机房地址" name="address">
                <a-input v-model:value="form.address" placeholder="请输入机房地址" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="机房状态" name="status">
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
  import { addIdc, editIdc, getIdcDetails } from '@/api/resourceManage/infrastructure/idcManage';
  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const type = ref('add');
  const form = ref({
    name: '',
    short_name: '',
    contact: '',
    telephone: '',
    address: '',
    status: 1,
    description: '',
  });
  const loading = ref(false);
  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入' }],
    short_name: [{ required: true, message: '请输入' }],
    contact: [{ required: true, message: '请输入' }],
    telephone: [{ required: true, message: '请输入' }],
    address: [{ required: true, message: '请输入' }],
    status: [{ required: true, message: '请输入' }],
    description: [{ required: true, message: '请输入备注说明' }],
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
        await addIdc(params);
        message.success('添加成功');
      } else {
        delete params.creator;
        const id: any = route.query && route.query.id;
        await editIdc(id, params);
        message.success('编辑成功');
      }
      router.go(-1);
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  }
  // 获取机柜信息
  const idcInfoLoading = ref(false);
  async function getIdcInfo() {
    try {
      if (idcInfoLoading.value) {
        return;
      }
      idcInfoLoading.value = true;
      const id: any = route.query && route.query.id;
      const data = await getIdcDetails(id);
      form.value = data;
      idcInfoLoading.value = false;
    } catch (error) {
      idcInfoLoading.value = false;
      console.error(error);
    }
  }
  onMounted(async () => {
    const types: any = route.query && route.query.type;
    type.value = types;
    if (types === 'edit') {
      getIdcInfo();
    }
  });
</script>
