<template>
  <div class="relative flex items-center ml-2 h-full" @mouseenter="onFocus" @mouseleave="onBlur">
    <div class="cursor-pointer hover:text-blue-400">全部功能<downOutlined class="ml-1 text-xs" /></div>
    <div v-if="focusing" class="menus-overlay">
      <div class="nav-dropdown-box">
        <div class="product-panel">
          <div class="product-left">
            <div class="dropdown-box__group">
              <h3 class="dropdown-box__label">快捷访问</h3>
              <div class="menus-list">
                <div v-for="(item, index) in quickAccess" :key="index" class="menus-block">
                  <div class="flex items-center">
                    <holderOutlined class="menus-icon-drop" />
                    <span class="mx-1">{{ item.name }}</span>
                  </div>
                  <closeCircleOutlined class="menus-icon-dismiss" />
                </div>
              </div>
            </div>
          </div>
          <div class="product-right">
            <div class="product-panel-header">
              <div class="product-panel-header__label">最近访问</div>
              <div class="product-panel-header__item">主机管理</div>
            </div>
            <div class="product-panel-body">
              <div class="menus-grid">
                <div class="menus-grid-item">
                  <div class="menus-grid-item__label">标题</div>
                  <div class="menus-list">
                    <div class="menus-list-item">123456</div>
                    <div class="menus-list-item">123456</div>
                    <div class="menus-list-item">123456</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { DownOutlined, HolderOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
  const focusing = ref(false);
  function onFocus() {
    console.log('移入');
    focusing.value = true;
  }
  function onBlur() {
    console.log('移出');
    focusing.value = false;
  }
  const quickAccess = [
    {
      name: '云服务器',
      id: '1',
    },
    {
      name: '对象存储',
      id: '2',
    },
    {
      name: '容器服务',
      id: '3',
    },
  ];
</script>
<style lang="less" scoped>
  .menus-overlay {
    position: fixed;
    top: 50px;
    left: 190px;
    z-index: 1001;
    .nav-dropdown-box {
      background-color: #fff;
      max-height: calc(100vh - 68px);
      overflow-y: auto;
      overflow-x: hidden;
      min-width: 140px;
      font-size: 12px;
      box-shadow: 0 0 16px 0 rgb(54 58 80 / 16%);
      .product-panel {
        height: inherit;
        min-height: 600px;
        max-height: calc(100vh - 68px);
        overflow: hidden;
        max-width: calc(100vw - 142px);
        position: relative;
        padding-left: 180px;
        box-sizing: border-box;
        min-width: 1100px;
        .product-left {
          box-sizing: border-box;
          background-color: #f3f4f7;
          padding: 35px 20px;
          height: 100%;
          overflow: auto;
          width: 180px;
          position: absolute;
          top: 0;
          left: 0;
          .dropdown-box__group {
            margin-bottom: 30px;
            .dropdown-box__label {
              font-size: 14px;
              color: #888;
              font-weight: 400;
              margin-bottom: 12px;
              display: inline-flex;
              align-items: center;
            }
            .menus-list {
              .menus-block {
                background-color: #fff;
                border: 1px solid #cfd5de;
                display: flex;
                padding: 4px 8px;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
                &:hover {
                  .menus-icon-drop {
                    opacity: 1;
                  }
                  .menus-icon-dismiss {
                    opacity: 1;
                  }
                }
                .menus-icon-drop {
                  opacity: 0;
                  cursor: move;
                }
                .menus-icon-dismiss {
                  opacity: 0;
                  cursor: pointer;
                }
              }
            }
          }
        }
        .product-right {
          height: inherit;
          max-height: calc(100vh - 68px);
          padding: 30px 20px;
          overflow: auto;
          box-sizing: border-box;
          .product-panel-header {
            display: flex;
            align-items: center;
            margin-bottom: 28px;
            .product-panel-header__label {
              font-size: 14px;
              color: #888;
              font-weight: 400;
              display: inline-flex;
              align-items: center;
            }
            .product-panel-header__item {
              margin-left: 10px;
            }
          }
          .product-panel-body {
            .menus-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              .menus-grid-item {
                .menus-grid-item__label {
                  font-size: 14px;
                  color: #888;
                  font-weight: 400;
                  display: inline-flex;
                  align-items: center;
                }
                .menus-list {
                  .menus-list-item {
                    display: flex;
                    align-items: center;
                    position: relative;
                    padding-left: 24px;
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.9);
                    line-height: 1.5;
                    margin-bottom: 8px;
                    box-sizing: border-box;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
