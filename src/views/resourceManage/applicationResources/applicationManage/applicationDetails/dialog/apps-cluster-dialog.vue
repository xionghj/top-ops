<!-- 应用管理-应用集群-弹出框 -->
<template>
  <div>
    <a-modal
      v-model:visible="isShowAppsClusterDialog"
      :title="title"
      width="560px"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="bg-white">
        <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="名称" name="name">
                <a-input v-model:value="form.name" placeholder="请输入集群名称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="类型" name="env">
                <a-radio-group v-model:value="form.env">
                  <a-radio v-for="(item, index) in envOption" :key="index" :value="item.id">{{
                    item.name
                  }}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <template #footer>
        <div class="flex justify-end items-center">
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { cloneDeep } from 'lodash-es';

  import {
    Modal as AModal,
    Input as AInput,
    Button as AButton,
    Form as AForm,
    FormItem as AFormItem,
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    Row as ARow,
    Col as ACol,
    message,
  } from 'ant-design-vue';

  import type { Rule, FormInstance } from 'ant-design-vue/es/form';

  import { addCluster, editCluster } from '@/api/resourceManage/applicationResources/clusterManage';

  const route = useRoute();
  const emit = defineEmits(['onAppsClusterConfirm']);
  const labelCol = { style: { width: '50px' } };
  const formRef = ref<FormInstance>();
  const clusterId = ref('');
  const form = ref({
    name: '',
    env: 'dev',
    id: '',
  });
  const envOption = [
    {
      name: '开发',
      id: 'dev',
    },
    {
      name: '测试',
      id: 'fat',
    },
    {
      name: '预发布',
      id: 'uat',
    },
    {
      name: '生产',
      id: 'pro',
    },
  ];
  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入集群名称' }],
    env: [{ required: true, message: '请选择', trigger: 'change' }],
  };
  const isShowAppsClusterDialog = ref(false);
  const title = ref('');
  function init() {
    isShowAppsClusterDialog.value = true;
    clusterId.value = '';
    title.value = '新建集群';
  }
  function openClusterEditDialog(item: any) {
    form.value.name = item.name;
    form.value.env = item.env;
    clusterId.value = item.id;
    title.value = '编辑集群';
    isShowAppsClusterDialog.value = true;
  }
  const handleOk = () => {
    formRef.value &&
      formRef.value.validateFields().then(() => {
        submitRequest();
      });
  };
  const loading = ref(false);
  async function submitRequest() {
    if (loading.value) {
      return;
    }
    loading.value = true;
    try {
      const params: any = cloneDeep(form.value);
      const id: any = route.query && route.query.id;
      params.app = id;
      if (clusterId.value == '') {
        await addCluster(params);
        message.success('添加成功');
      } else {
        await editCluster(clusterId.value, params);
        message.success('编辑成功');
      }
      loading.value = false;
      emit('onAppsClusterConfirm');
      isShowAppsClusterDialog.value = false;
    } catch (error) {
      loading.value = false;
    }
  }
  const handleCancel = () => {
    isShowAppsClusterDialog.value = false;
  };
  defineExpose({ init, openClusterEditDialog });
</script>
