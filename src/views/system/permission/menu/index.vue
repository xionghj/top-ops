<template>
  <div>
    <Breadcrumb />
    <div class="p-2 bg-white">
      <div class="flex justify-between mb-2 mx-2">
        <div class="text-base">菜单列表</div>
        <div class="flex">
          <a-button type="primary" @click="showDrawer('add')">新增菜单</a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="menusList" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            {{ record.name }}
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a @click="showDrawer('edit', record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确认删除?"
                ok-text="是"
                cancel-text="否"
                @confirm="deleteMenu(record.id)"
              >
                <span class="text-red-500 cursor-pointer" href="#">删除</span>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
      <a-drawer
        :title="form.id ? '编辑菜单' : '新增菜单'"
        :width="720"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }"
        @close="onClose"
      >
        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="菜单名称" name="title">
                <a-input v-model:value="form.title" placeholder="请输入菜单名称" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="组件名称" name="name">
                <a-input v-model:value="form.name" placeholder="请输入菜单名称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="菜单类型" name="kind">
                <a-select v-model:value="form.kind" placeholder="请选择菜单类型">
                  <a-select-option value="menu">页面</a-select-option>
                  <a-select-option value="directory">目录</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="显示顺序" name="priority">
                <a-input v-model:value="form.priority" placeholder="请输入显示顺序" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="组件路径" name="component">
                <a-input
                  v-model:value="form.component"
                  style="width: 100%"
                  placeholder="请输入组件路径"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="访问路径" name="path">
                <a-input
                  v-model:value="form.path"
                  style="width: 100%"
                  placeholder="请输入访问路径"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="父级菜单" name="parent">
                <a-cascader
                  v-model:value="form.parent"
                  :options="options"
                  placeholder="请选择父级菜单"
                  :field-names="{ label: 'name', value: 'id', children: 'children' }"
                  change-on-select
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="前端是否可见" name="display">
                <div class="ml-4">
                  <a-radio-group v-model:value="form.display">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <template #footer>
          <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
          <a-button type="primary" @click="onSubmit">确认</a-button>
        </template>
      </a-drawer>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import {
    Table as ATable,
    Form as AForm,
    FormItem as AFormItem,
    Select as ASelect,
    SelectOption as ASelectOption,
    Cascader as ACascader,
    Drawer as ADrawer,
    Input as AInput,
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    Button as AButton,
    Divider as ADivider,
    Popconfirm as APopconfirm,
    Row as ARow,
    Col as ACol,
  } from 'ant-design-vue';
  import type { Rule, FormInstance } from 'ant-design-vue/es/form';
  import Breadcrumb from '@/components/basic/Breadcrumb/index.vue';
  // import { getPermissionMenuList } from '@/api/system/menu';
  import { getPermissionMenu } from '@/api/login';
  import { updateMenu, createMenu, deleteMenu } from '@/api/system/menu';
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '顺序',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: '权限标识',
      dataIndex: 'kind',
      key: 'kind',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  interface DataItem {
    key: number;
    name: string;
    age: number;
    address: string;
    children?: DataItem[];
  }
  const menusList = ref([]);
  // 获取菜单
  async function getMenus() {
    try {
      const data = await getPermissionMenu();
      menusList.value = data;
      options.value = data;
      console.log('获取的数据', menusList.value);
    } catch (error) {
      console.error(error);
    }
  }
  getMenus();
  const formRef = ref<FormInstance>();
  const form = reactive({
    id: '',
    name: '',
    title: '',
    kind: '',
    path: '',
    component: '',
    priority: '',
    parent: [],
    display: true,
  });

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入组件名称' }],
    title: [{ required: true, message: '菜单名称' }],
    kind: [{ required: true, message: 'Please choose the type' }],
    path: [{ required: true, message: 'please enter url' }],
    component: [{ required: true, message: 'please enter component' }],
    priority: [{ required: true, message: 'Please choose the priority' }],
    parent: [{ required: true, message: 'Please choose the parent' }],
    display: [{ required: true, message: 'Please choose the parent' }],
  };
  const options = ref([]);
  const visible = ref<boolean>(false);
  const showDrawer = (type: string, item?: any) => {
    formRef.value && formRef.value.resetFields();
    visible.value = true;
    if (!item) {
      form.id = '';
      form.name = '';
      form.title = '';
      form.parent = [];
      form.kind = '';
      form.path = '';
      form.component = '';
      form.priority = '';
      form.display = true;
    } else {
      form.id = item.id;
      form.name = item.name;
      form.title = item.title;
      form.parent = item.parent;
      form.kind = item.kind;
      form.path = item.path;
      form.component = item.component;
      form.priority = item.priority;
      form.display = item.display;
    }
  };
  const onClose = () => {
    visible.value = false;
  };
  function onSubmit() {
    formRef.value &&
      formRef.value.validateFields().then(() => {
        submitReuest();
      });
  }
  async function submitReuest() {
    const params = form;
    params.parent = form.parent[0];
    if (form.id) {
      await updateMenu(form.id, params);
    } else {
      await createMenu(params);
    }
  }
  // 删除菜单
  async function deleteMenuConfirm(id: string) {
    await deleteMenu(id);
  }
</script>
