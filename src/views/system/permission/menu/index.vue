<!-- 菜单管理 -->
<template>
  <div>
    <Breadcrumb>
      <template #right>
        <a-button type="primary" @click="showDrawer('add')">新增菜单</a-button>
      </template>
    </Breadcrumb>
    <div class="p-4 bg-white">
      <div class="flex justify-between mb-2 mx-2">
        <div class="text-base">菜单列表</div>
        <!-- <div class="flex">
          <a-button type="primary" @click="showDrawer('add')">新增菜单</a-button>
        </div> -->
      </div>
      <a-spin :spinning="spinning">
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
                  @confirm="deleteMenuConfirm(record.id)"
                >
                  <span class="text-red-500 cursor-pointer" href="#">删除</span>
                </a-popconfirm>
              </span>
            </template>
          </template>
        </a-table>
      </a-spin>
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
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="父级菜单" name="parent">
                <a-cascader
                  v-model:value="form.parent"
                  :options="options"
                  placeholder="请选择父级菜单"
                  :field-names="{ label: 'title', value: 'id', children: 'children' }"
                  change-on-select
                />
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
  import { cloneDeep } from 'lodash-es';
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
    Spin as ASpin,
  } from 'ant-design-vue';
  import type { Rule, FormInstance } from 'ant-design-vue/es/form';
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

  const menusList = ref<any>([]);
  const spinning = ref(false);
  // 获取菜单
  async function getMenus() {
    try {
      if (spinning.value) {
        return;
      }
      spinning.value = true;
      const data = await getPermissionMenu();
      spinning.value = false;
      menusList.value = data;
    } catch (error) {
      spinning.value = false;
      console.error(error);
    }
  }
  function getTreeData(data: any, id: any) {
    for (let i = 0; i < data.length; i++) {
      data[i]['id'] = data[i].id.toString();
      if (id && data[i].id == id) {
        data[i].disabled = true;
      }
      if (data[i].children && data[i].children.length > 1) {
        // children若为空数组，则不作操作
        getTreeData(data[i].children, id);
      }
    }
    return data;
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
    parent: [] as any,
    display: true,
  });

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入组件名称' }],
    title: [{ required: true, message: '菜单名称' }],
    kind: [{ required: true, message: 'Please choose the type' }],
    path: [{ required: true, message: 'please enter url' }],
    component: [{ required: true, message: 'please enter component' }],
    priority: [{ required: true, message: 'Please choose the priority' }],
    display: [{ required: true, message: 'Please choose the parent' }],
  };
  const options = ref([]);
  const visible = ref<boolean>(false);
  const showDrawer = (type: string, item?: API.MenuAddParams) => {
    formRef.value && formRef.value.resetFields();
    options.value = [];
    visible.value = true;
    options.value = getTreeData(cloneDeep(menusList.value), item && item.id ? item.id : '');
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
      let parentIdArr = [];
      if (item.parent) {
        const big = item.parent.toString();
        const parentArr = getParentId(options.value, big);
        parentIdArr = parentArr.reverse();
      }
      form.parent = parentIdArr;
      form.kind = item.kind;
      form.path = item.path;
      form.component = item.component;
      form.priority = item.priority;
      form.display = item.display;
    }
  };
  // 根据id查询本节点和所有父级节点
  const getParentId: any = (list: any, id: string) => {
    for (const i in list) {
      if (list[i].id == id) {
        return [list[i].id];
      }
      if (list[i].children) {
        const node = getParentId(list[i].children, id);
        if (node !== undefined) {
          return node.concat(list[i].id);
        }
      }
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
    const params = cloneDeep(form);
    params.parent =
      form.parent && form.parent.length > 0 ? form.parent[form.parent.length - 1] : null;
    if (form.id) {
      await updateMenu(form.id, params);
    } else {
      await createMenu(params);
    }
    getMenus();
    visible.value = false;
  }
  // 删除菜单
  async function deleteMenuConfirm(id: string) {
    try {
      await deleteMenu(id);
      getMenus();
    } catch (error) {
      console.error(error);
    }
  }
</script>
