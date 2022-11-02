<template>
  <div>
    <Breadcrumb />
    <SvgIcon name="logo" size="50" />
    <icon-font type="shoucang" size="18" color="red" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Alert, Descriptions, Image, Input as AInput } from 'ant-design-vue';
  import { IconFont } from '@/components/basic/iconfont';
  import { SvgIcon } from '@/components/basic/svg-icon';

  /**
   * @description ant-design-vue配置阿里巴巴矢量图标库使用
   */
  const state = reactive({
    scriptUrl: '',
    iconName: '',
    visible: false,
    imageUrl: '',
  });

  const showPreview = (e) => {
    state.imageUrl = e.target.currentSrc;
    state.visible = true;
  };
</script>
