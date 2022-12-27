<template>
  <div class="page-title-box">
    <div class="flex items-center">
      <ArrowLeftOutlined
        v-if="showBack"
        class="mr-2"
        :style="{ fontSize: '14px', color: '#1e8eff' }"
        @click="onBack"
      />
      <slot name="left"></slot>
      <a-breadcrumb>
        <template #separator><span>></span></template>
        <a-breadcrumb-item v-for="(item, index) in menus" :key="index">{{
          item.meta && item.meta.title
        }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref, toRefs } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import { Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue';
  import { usePermissionStore } from '@/store/modules/permission';
  const route = useRoute();
  const router = useRouter();
  const permissionStore = usePermissionStore();
  const props = defineProps({
    showBack: {
      type: Boolean,
      default: false,
    },
    breadcrumbInfo: {
      type: Array,
    },
  });
  const { showBack } = toRefs(props);
  function onBack() {
    router.go(-1);
  }
  const menus = ref<any>([]);
  // 获取当前路由的二级菜单
  function getSubMenus() {
    const menusList = permissionStore.backMenuList;
    const subMenus = getsubMenusParents(menusList, route.name);
    console.log('获取二级菜单', subMenus, route.name);
    if (!subMenus) return;
    menus.value = subMenus.reverse();
  }
  function getsubMenusParents(list: any, name: any): any {
    for (const i in list) {
      if (list[i].name === name) {
        //查询到就返回该数组对象
        return [list[i]];
      }
      if (list[i].children) {
        const node = getsubMenusParents(list[i].children, name);
        if (node !== undefined) {
          //查询到把父节点连起来
          return node.concat(list[i]);
        }
      }
    }
  }
  onMounted(() => {
    if (props.breadcrumbInfo && props.breadcrumbInfo.length > 0) {
      menus.value = props.breadcrumbInfo;
    } else {
      getSubMenus();
    }
  });
</script>
<style lang="less" scoped>
  .page-title-box {
    padding: 10px 1.5rem;
    height: 42px;
    background-color: #fff;
    box-shadow: 0 1px 2px rgb(56 65 74 / 15%);
    border-bottom: 1px none;
    border-top: 1px none;
    margin: -17px -18px 18px -18px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    :deep(.ant-breadcrumb) {
      font-size: 12px;
    }
  }
</style>
