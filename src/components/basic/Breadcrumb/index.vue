<template>
  <div class="page-title-box">
    <!-- <div class="breadcrumb">
      <div v-for="(item, index) in arr" :key="index" class="breadcrumb-item">
        <a href="#">{{ item.name }}</a>
      </div>
    </div> -->
    <a-breadcrumb>
      <template #separator><span>></span></template>
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
      <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue';

  const arr = [
    {
      name: '阶段一',
    },
    {
      name: '阶段二',
    },
  ];
  const route = useRoute();
  // const menus = computed(() => {
  //   if (route.meta?.namePath) {
  //     let children = userStore.menus;
  //     const paths = route.meta?.namePath?.map((item) => {
  //       const a = children.find((n) => n.name === item);
  //       children = a?.children || [];
  //       return a;
  //     });
  //     return [
  //       {
  //         name: '__index',
  //         meta: {
  //           title: '首页',
  //         },
  //         children: userStore.menus,
  //       },
  //       ...paths,
  //     ];
  //   }
  //   return route.matched;
  // });
</script>
<style lang="less" scoped>
  .page-title-box {
    padding: 10px 1.5rem;
    background-color: #fff;
    box-shadow: 0 1px 2px rgb(56 65 74 / 15%);
    border-bottom: 1px none;
    border-top: 1px none;
    margin: -17px -18px 18px -18px;
    display: flex;
    align-items: center;
  }
  .breadcrumb {
    display: flex;
    .breadcrumb-item:before {
      border: solid transparent;
      content: ' ';
      height: 0;
      left: 100%; //根据三角形的位置，可以随意更改。
      position: absolute;
      width: 0;
    }
    .breadcrumb-item {
      &::before {
        font-family: Material Design Icons;
        font-size: 15px;
        line-height: 20px;
        color: red;
      }
      > a {
        color: #495057;
      }
    }
  }
</style>
