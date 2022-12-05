<template>
  <div>
    <a-descriptions :column="2">
      <a-descriptions-item label="IP地址">Zhou Maomao</a-descriptions-item>
      <a-descriptions-item label="主机名">1810000000</a-descriptions-item>
      <a-descriptions-item label="主机环境">Hangzhou, Zhejiang</a-descriptions-item>
      <a-descriptions-item label="Agent状态">empty</a-descriptions-item>
      <a-descriptions-item label="物理地址"> </a-descriptions-item>
      <a-descriptions-item label="第一负责人"> </a-descriptions-item>
      <a-descriptions-item label="运营状态"> </a-descriptions-item>
      <a-descriptions-item label="第二负责人"> </a-descriptions-item>
      <a-descriptions-item label="Salt-key"> </a-descriptions-item>
      <a-descriptions-item label="Salt-master"> </a-descriptions-item>
    </a-descriptions>
  </div>
  <div class="mt-4">
    <a-descriptions :column="2">
      <a-descriptions-item label="操作系统"></a-descriptions-item>
      <a-descriptions-item label="内核发行版本"></a-descriptions-item>
      <a-descriptions-item label="系统架构"></a-descriptions-item>
      <a-descriptions-item label="操作系统发行版"></a-descriptions-item>
      <a-descriptions-item label="操作系统类型"> </a-descriptions-item>
    </a-descriptions>
  </div>
  <div class="mt-4">
    <a-descriptions :column="2">
      <a-descriptions-item label="CPU核数"></a-descriptions-item>
      <a-descriptions-item label="CPU型号"></a-descriptions-item>
      <a-descriptions-item label="CPU频率"></a-descriptions-item>
      <a-descriptions-item label="内存大小"></a-descriptions-item>
      <a-descriptions-item label="机器型号"> </a-descriptions-item>
    </a-descriptions>
  </div>
  <div class="mt-4">
    <a-descriptions :column="2">
      <a-descriptions-item label="资产编号"></a-descriptions-item>
      <a-descriptions-item label="Agent 版本"></a-descriptions-item>
      <a-descriptions-item label="数据中心"></a-descriptions-item>
      <a-descriptions-item label="备注"></a-descriptions-item>
      <a-descriptions-item label="供应商"> </a-descriptions-item>
      <a-descriptions-item label="DNS地址"> </a-descriptions-item>
      <a-descriptions-item label="录入时间"> </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script lang="ts" setup>
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
  } from 'ant-design-vue';
</script>
<style lang="less" scoped>
  :deep(.ant-descriptions-item-label) {
    width: 120px;
    display: flex;
    justify-content: flex-end;
    padding-right: 2px;
  }
</style>
