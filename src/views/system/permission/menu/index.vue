<template>
  <div class="p-6 bg-white">
    <a-table :columns="columns" :data-source="menusList" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          {{ record.name }}
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a @click="showDrawer">编辑</a>
            <a-divider type="vertical" />
            <span class="text-red-500 cursor-pointer">删除</span>
          </span>
        </template>
      </template>
    </a-table>
    <a-drawer
      title="编辑菜单"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
    >
      <a-form :model="form" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="菜单名称" name="name">
              <a-input v-model:value="form.name" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="菜单类型" name="type">
              <a-select v-model:value="form.type" placeholder="Please choose the type">
                <a-select-option value="private">Private</a-select-option>
                <a-select-option value="public">Public</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="访问路径" name="url">
              <a-input
                v-model:value="form.url"
                style="width: 100%"
                addon-before="http://"
                addon-after=".com"
                placeholder="please enter url"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="显示顺序" name="name">
              <a-input v-model:value="form.name" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item label="Owner" name="owner">
              <a-select v-model:value="form.owner" placeholder="Please a-s an owner">
                <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
                <a-select-option value="mao">Maomao Zhou</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <!-- <a-col :span="12">
            <a-form-item label="Type" name="type">
              <a-select v-model:value="form.type" placeholder="Please choose the type">
                <a-select-option value="private">Private</a-select-option>
                <a-select-option value="public">Public</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="父级菜单" name="approver">
              <a-select v-model:value="form.approver" placeholder="Please choose the approver">
                <a-select-option value="jack">Jack Ma</a-select-option>
                <a-select-option value="tom">Tom Liu</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item label="DateTime" name="dateTime">
              <a-date-picker
                v-model:value="form.dateTime"
                style="width: 100%"
                :get-popup-container="(trigger) => trigger.parentElement"
              />
            </a-form-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="前端是否可见" name="description">
              <div class="ml-4">
                <a-checkbox v-model:checked="form.description"></a-checkbox>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button @click="onClose">Cancel</a-button>
          <a-button type="primary" @click="onClose">Submit</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { permmenu } from '@/api/login';
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'name',
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
  async function getMenus() {
    try {
      const menusLists = await permmenu();
      menusList.value = menusLists;
      console.log('获取的数据', menusList.value);
    } catch (error) {
      console.error(error);
    }
  }
  getMenus();
  const form = reactive({
    name: '',
    url: '',
    owner: '',
    type: '',
    approver: '',
    dateTime: null,
    description: '',
  });

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: 'Please enter user name' }],
    url: [{ required: true, message: 'please enter url' }],
    owner: [{ required: true, message: 'Please select an owner' }],
    type: [{ required: true, message: 'Please choose the type' }],
    approver: [{ required: true, message: 'Please choose the approver' }],
    dateTime: [{ required: true, message: 'Please choose the dateTime', type: 'object' }],
    description: [{ required: true, message: 'Please enter url description' }],
  };

  const visible = ref<boolean>(false);

  const showDrawer = () => {
    visible.value = true;
  };

  const onClose = () => {
    visible.value = false;
  };
</script>
