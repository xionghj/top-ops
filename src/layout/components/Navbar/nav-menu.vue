<template>
  <div class="relative flex items-center ml-2 h-full" @mouseenter="onFocus" @mouseleave="onBlur">
    <div class="cursor-pointer text-xs hover:text-blue-400">
      全部<icon-font class="ml-2" type="jiantouxia" size="12" />
    </div>
    <div v-if="focusing" class="menus-overlay">
      <div :class="[focusing ? 'show' : 'hidden']" class="nav-dropdown-box">
        <div class="product-panel">
          <div class="product-left">
            <div class="dropdown-box__group">
              <h3 class="dropdown-box__label">快捷访问</h3>
              <div class="menus-list">
                <div v-for="(item, index) in quickAccess" :key="index" class="menus-block">
                  <div class="flex items-center">
                    <holder-outlined class="menus-icon-drop" />
                    <span class="mx-1">{{ item.name }}</span>
                  </div>
                  <close-circle-outlined class="menus-icon-dismiss" />
                </div>
              </div>
            </div>
          </div>
          <div class="product-right">
            <div class="product-panel-header">
              <div class="product-panel-header__label">最近访问</div>
              <div class="recently-visited">
                <div class="recently-visited__item">主机管理</div>
                <div class="recently-visited__item">系统管理</div>
              </div>
            </div>
            <div class="product-panel-body">
              <div class="menus-grid">
                <div
                  v-for="(menusList, indexMenus) in menus"
                  :key="indexMenus"
                  class="menus-grid-box"
                >
                  <div v-for="item in menusList" :key="item.code" class="menus-grid-item">
                    <div class="menus-grid-item__label">
                      <span>{{ item.meta && item.meta.title }}</span>
                    </div>
                    <div
                      v-for="(subItem, index) in item.children"
                      :key="index"
                      class="menus-list"
                      @click="clickMenus(item.children, subItem)"
                    >
                      <div class="menus-list-item">
                        <span class="cursor-pointer menus-list-item__text">
                          {{ subItem.meta && subItem.meta.title }}
                        </span>
                        <heart-outlined class="collect-icon" @click.stop="clickCollection" />
                      </div>
                    </div>
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
  import { ref, computed } from 'vue';
  import {
    DownOutlined,
    HolderOutlined,
    CloseCircleOutlined,
    HeartOutlined,
  } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { usePermissionStore } from '@/store/modules/permission';
  import { IconFont } from '@/components/iconfont';
  const userPermissionStore = usePermissionStore();
  const router = useRouter();
  const menus = computed(() => {
    // return [...userPermissionStore.backMenuList].filter((n) => !n.hideInMenu);
    return handleMenus();
  });
  function handleMenus() {
    const data = [...userPermissionStore.backMenuList];
    const result = [];
    for (let i = 0; i < data.length; i += 4) {
      result.push(data.slice(i, i + 4));
    }
    const arrs: any = [[], [], [], [], []];
    for (let j = 0; j < result.length; j++) {
      for (let k = 0; k < result[j].length; k++) {
        arrs[k].push(result[j][k]);
      }
    }
    console.log('获取处理的菜单数据', arrs);
    return arrs;
  }
  handleMenus();
  function clickMenus(item: any, subItem: any) {
    userPermissionStore.subMenus = [...item];
    const routerPath = childrenRecursion([subItem]);
    router.push({ name: routerPath.name });
    focusing.value = false;
  }
  function childrenRecursion(arr: any): any {
    if (arr[0].children && arr[0].children.length > 0) {
      return childrenRecursion(arr[0].children);
    } else {
      return arr[0];
    }
  }
  const focusing = ref(false);
  function onFocus() {
    focusing.value = true;
  }
  function onBlur() {
    focusing.value = false;
  }
  function clickCollection() {
    console.log('收藏');
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
      opacity: 0;
      transition: opacity 0.5s ease;
      &.show {
        opacity: 1;
      }
      .product-panel {
        height: inherit;
        min-height: 600px;
        max-height: calc(100vh - 68px);
        overflow: hidden;
        max-width: calc(100vw - 142px);
        position: relative;
        padding-left: 180px;
        box-sizing: border-box;
        min-width: 1000px;
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
          padding: 30px 10px;
          overflow: auto;
          box-sizing: border-box;
          .product-panel-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 0 10px;
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
            .recently-visited {
              display: flex;
              padding: 0 10px;
              .recently-visited__item {
                margin-left: 10px;
                cursor: pointer;
                &:hover {
                  color: #006eff;
                }
              }
            }
          }
          .product-panel-body {
            .menus-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              .menus-grid-box {
                .menus-grid-item {
                  margin: 10px 0;
                  .menus-grid-item__label {
                    font-size: 14px;
                    color: #888;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    margin-bottom: 12px;
                    padding: 0 10px;
                  }
                  .menus-list {
                    .menus-list-item {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      position: relative;
                      padding-left: 2px;
                      font-size: 14px;
                      color: rgba(0, 0, 0, 0.9);
                      line-height: 1.5;
                      margin-bottom: 8px;
                      padding: 5px 10px;
                      border-radius: 6px;
                      cursor: pointer;
                      box-sizing: border-box;
                      transition-duration: 0.2s;
                      transition-property: background;
                      &:hover {
                        .collect-icon {
                          opacity: 1;
                          transition-duration: 0.2s;
                        }
                        .menus-list-item__text {
                          color: #006eff;
                        }
                        background: rgba(33, 150, 243, 0.1);
                      }
                      .collect-icon {
                        opacity: 0;
                      }
                    }
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
