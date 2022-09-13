<template>
  <div class="menus-overlay">
    <div class="nav-dropdown-box">
      <div class="nav-dropdown-head">
        <div class="nav-dropdown-head_label">最近访问</div>
        <div class="nav-dropdown-head_item">主机管理</div>
      </div>
      <div class="nav-dropdown-content">
        <div class="menus-grid">
          <div class="menus-grid-item">123</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="less" scoped>
  .menus-overlay {
    .nav-dropdown-box {
      background-color: #fff;
      max-height: calc(100vh - 68px);
      max-height: 901px;
      min-height: 600px;
      overflow-y: auto;
      overflow-x: hidden;
      min-width: 140px;
      min-width: 400px;
      font-size: 12px;
      // box-shadow: 0 0 16px 0 rgb(54 58 80 / 16%);
      padding: 20px;
      box-sizing: border-box;
      .nav-dropdown-head {
        display: flex;
        align-items: center;
        .nav-dropdown-head_label {
          font-size: 14px;
          color: #888;
          font-weight: 400;
          display: inline-flex;
          align-items: center;
        }
        .nav-dropdown-head_item {
          margin-left: 10px;
        }
      }
    }
  }
</style>
