import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { transformObjToRoute } from '@/router/helper/routeHelper';

import { defineStore } from 'pinia';
import { permmenu } from '@/api/login';
interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  frontMenuList: Menu[];
}
const menusList = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'LAYOUT',
    redirect: '/dashboard/analysis',
    meta: {
      title: 'routes.dashboard.dashboard',
      hideChildrenInMenu: true,
      icon: 'bx:bx-home',
    },
    children: [
      {
        path: 'analysis',
        name: 'Analysis',
        component: '/dashboard/analysis/index',
        meta: {
          hideMenu: true,
          hideBreadcrumb: true,
          title: 'routes.dashboard.analysis',
          currentActiveMenu: '/dashboard',
          icon: 'bx:bx-home',
        },
      },
      {
        path: 'workbench',
        name: 'Workbench',
        component: '/dashboard/workbench/index',
        meta: {
          hideMenu: true,
          hideBreadcrumb: true,
          title: 'routes.dashboard.workbench',
          currentActiveMenu: '/dashboard',
          icon: 'bx:bx-home',
        },
      },
    ],
  },
  {
    path: '/permission',
    name: 'Permission',
    component: 'LAYOUT',
    redirect: '/permission/front/page',
    meta: {
      icon: 'carbon:user-role',
      title: 'routes.demo.permission.permission',
    },
    children: [
      {
        path: 'back',
        name: 'PermissionBackDemo',
        meta: {
          title: 'routes.demo.permission.back',
        },
        children: [
          {
            path: 'page',
            name: 'BackAuthPage',
            component: '/demo/permission/back/index',
            meta: {
              title: 'routes.demo.permission.backPage',
            },
          },
          {
            path: 'btn',
            name: 'BackAuthBtn',
            component: '/demo/permission/back/Btn',
            meta: {
              title: 'routes.demo.permission.backBtn',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/level',
    name: 'Level',
    component: 'LAYOUT',
    redirect: '/level/menu1/menu1-1',
    meta: {
      icon: 'carbon:user-role',
      title: 'routes.demo.level.level',
    },
    children: [
      {
        path: 'menu1',
        name: 'Menu1Demo',
        meta: {
          title: 'Menu1',
        },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu11Demo',
            meta: {
              title: 'Menu1-1',
            },
            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu111Demo',
                component: '/demo/level/Menu111',
                meta: {
                  title: 'Menu111',
                },
              },
            ],
          },
          {
            path: 'menu1-2',
            name: 'Menu12Demo',
            component: '/demo/level/Menu12',
            meta: {
              title: 'Menu1-2',
            },
          },
        ],
      },
      {
        path: 'menu2',
        name: 'Menu2Demo',
        component: '/demo/level/Menu2',
        meta: {
          title: 'Menu2',
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    component: 'LAYOUT',
    redirect: '/system/account',
    meta: {
      icon: 'ion:settings-outline',
      title: 'routes.demo.system.moduleName',
    },
    children: [
      {
        path: 'account',
        name: 'AccountManagement',
        meta: {
          title: 'routes.demo.system.account',
          ignoreKeepAlive: true,
        },
        component: '/demo/system/account/index',
      },
      {
        path: 'account_detail/:id',
        name: 'AccountDetail',
        meta: {
          hideMenu: true,
          title: 'routes.demo.system.account_detail',
          ignoreKeepAlive: true,
          showMenu: false,
          currentActiveMenu: '/system/account',
        },
        component: '/demo/system/account/AccountDetail',
      },
      {
        path: 'role',
        name: 'RoleManagement',
        meta: {
          title: 'routes.demo.system.role',
          ignoreKeepAlive: true,
        },
        component: '/demo/system/role/index',
      },
      {
        path: 'menu',
        name: 'MenuManagement',
        meta: {
          title: 'routes.demo.system.menu',
          ignoreKeepAlive: true,
        },
        component: '/demo/system/menu/index',
      },
      {
        path: 'dept',
        name: 'DeptManagement',
        meta: {
          title: 'routes.demo.system.dept',
          ignoreKeepAlive: true,
        },
        component: '/demo/system/dept/index',
      },
      {
        path: 'changePassword',
        name: 'ChangePassword',
        meta: {
          title: 'routes.demo.system.password',
          ignoreKeepAlive: true,
        },
        component: '/demo/system/password/index',
      },
    ],
  },
  {
    path: '/link',
    name: 'Link',
    component: 'LAYOUT',
    meta: {
      icon: 'ion:tv-outline',
      title: 'routes.demo.iframe.frame',
    },
    children: [
      {
        path: 'doc',
        name: 'Doc',
        meta: {
          title: 'routes.demo.iframe.doc',
          frameSrc: 'https://vvbin.cn/doc-next/',
        },
      },
      {
        path: 'https://vvbin.cn/doc-next/',
        name: 'DocExternal',
        component: 'LAYOUT',
        meta: {
          title: 'routes.demo.iframe.docExternal',
        },
      },
    ],
  },
];
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const routes: AppRouteRecordRaw[] = [];

      // !Simulate to obtain permission codes from the background,
      // this function may only need to be executed once, and the actual project can be put at the right time by itself
      let routeList: AppRouteRecordRaw[] = [];
      try {
        routeList = (await permmenu()) as AppRouteRecordRaw[];
        console.log('获取菜单', routeList, menusList);
      } catch (error) {
        console.error(error);
      }

      // // Dynamically introduce components
      routeList = transformObjToRoute(menusList);
      console.log('获取菜单路由', routeList);
      // //  Background routing to menu structure
      // const backMenuList = transformRouteToMenu(routeList);
      // this.setBackMenuList(backMenuList);
      // console.log('获取菜单1', routeList, backMenuList);
      // // remove meta.ignoreRoute item
      // routeList = filter(routeList, routeRemoveIgnoreFilter);
      // routeList = routeList.filter(routeRemoveIgnoreFilter);
      // console.log('获取菜单2', routeList);
      // routeList = flatMultiLevelRoutes(routeList);
      // routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];

      return routes;
    },
  },
});
