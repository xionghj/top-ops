import { defineStore } from 'pinia';
import { cloneDeep } from 'lodash-es';
import type { AppRouteRecordRaw, Menu } from '@/router/types';
import router from '@/router';
import Common from '@/router/staticModules/index';

import { transformObjToRoute, flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { transformRouteToMenu } from '@/router/helper/menuHelper';

import { filter } from '@/utils/helper/treeHelper';

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
  subMenus: Menu[];
}
const menusList1 = [
  {
    id: 428473020705734100,
    created_at: '2022-10-05T05:37:02.041893+08:00',
    updated_at: '2022-10-05T05:37:02.051269+08:00',
    title: '资源管理',
    name: 'test1',
    kind: 'directory',
    display: true,
    priority: '1',
    icon: '',
    code: '53f7b830cdee4568',
    path: '/home/index',
    component: 'LAYOUT',
    parent: null,
    children: [
      {
        id: 428474974546755000,
        created_at: '2022-10-05T05:56:26.630799+08:00',
        updated_at: '2022-10-05T05:59:05.665520+08:00',
        title: '应用资源',
        name: 'test2',
        kind: 'directory',
        display: true,
        priority: '1.1',
        icon: '',
        code: 'c35928fa6dcf26b9',
        path: '/hoem/index12451',
        component: 'LAYOUT',
        parent: 428473020705734100,
        children: [
          {
            id: 428475468585434560,
            created_at: '2022-10-05T06:01:21.090827+08:00',
            updated_at: '2022-10-05T06:01:21.099168+08:00',
            title: '业务树',
            name: 'home3',
            kind: 'menu',
            display: true,
            priority: '1.1.1',
            icon: '',
            code: '1cd98a1443958a40',
            path: '/home/index',
            component: '/home/index',
            parent: 428474974546755000,
            children: [
              {
                id: 428475468585434560,
                created_at: '2022-10-05T06:01:21.090827+08:00',
                updated_at: '2022-10-05T06:01:21.099168+08:00',
                title: '业务树',
                name: 'home3',
                kind: 'menu',
                display: true,
                priority: '1.1.1',
                icon: '',
                code: '1cd98a1443958a40',
                path: '/home/index',
                component: '/home/index',
                parent: 428474974546755000,
              },
            ],
          },
          {
            id: 428475468585434560,
            created_at: '2022-10-05T06:01:21.090827+08:00',
            updated_at: '2022-10-05T06:01:21.099168+08:00',
            title: '菜单管理',
            name: 'menu',
            kind: 'menu',
            display: true,
            priority: '1.1.1',
            icon: '',
            code: '1cd98a1443958a40',
            path: '/system/permission/menu/index',
            component: '/system/permission/menu/index',
            parent: 428474974546755000,
          },
          {
            id: 428475468585434560,
            created_at: '2022-10-05T06:01:21.090827+08:00',
            updated_at: '2022-10-05T06:01:21.099168+08:00',
            title: '图标',
            name: 'CustomIcon',
            kind: 'CustomIcon',
            display: true,
            priority: '1.1.1',
            icon: '',
            code: '1cd98a1443958a40',
            path: '/icons/Iconfont',
            component: '/icons/Iconfont',
            parent: 428474974546755000,
          },
          // {
          //   id: 428475501955317200,
          //   created_at: '2022-10-05T06:01:40.980920+08:00',
          //   updated_at: '2022-10-05T06:01:40.988211+08:00',
          //   title: '业务管理',
          //   name: 'welcome4',
          //   kind: 'menu',
          //   display: true,
          //   priority: '1.1.2',
          //   icon: '',
          //   code: 'b91834be7861e93c',
          //   path: '/welcome/index',
          //   component: '/welcome/index',
          //   parent: 428474974546755000,
          // },
        ],
      },
      // {
      //   id: 428474162395282900,
      //   created_at: '2022-10-05T05:48:22.540784+08:00',
      //   updated_at: '2022-10-05T05:48:22.548156+08:00',
      //   title: '基础设施',
      //   name: 'test',
      //   kind: 'directory',
      //   display: true,
      //   priority: '1.2',
      //   icon: '',
      //   code: 'd2eb72dddea853a5',
      //   path: '',
      //   component: '',
      //   parent: 428473020705734100,
      //   children: [
      //     {
      //       id: 428475721485188540,
      //       created_at: '2022-10-05T06:03:51.830833+08:00',
      //       updated_at: '2022-10-05T06:03:51.837466+08:00',
      //       title: '主机管理',
      //       name: 'test',
      //       kind: 'menu',
      //       display: true,
      //       priority: '1.2.1',
      //       icon: '',
      //       code: '8ed49b05a641999a',
      //       path: '',
      //       component: '',
      //       parent: 428474162395282900,
      //     },
      //     {
      //       id: 428475736651791800,
      //       created_at: '2022-10-05T06:04:00.871921+08:00',
      //       updated_at: '2022-10-05T06:04:00.879749+08:00',
      //       title: '机柜管理',
      //       name: 'test',
      //       kind: 'menu',
      //       display: true,
      //       priority: '1.2.2',
      //       icon: '',
      //       code: 'd930f928d40440f1',
      //       path: '',
      //       component: '',
      //       parent: 428474162395282900,
      //     },
      //     {
      //       id: 428475749452807600,
      //       created_at: '2022-10-05T06:04:08.500691+08:00',
      //       updated_at: '2022-10-05T06:04:08.507351+08:00',
      //       title: '数据中心',
      //       name: 'test',
      //       kind: 'menu',
      //       display: true,
      //       priority: '1.2.3',
      //       icon: '',
      //       code: 'd568d2aae7ca9429',
      //       path: '',
      //       component: '',
      //       parent: 428474162395282900,
      //     },
      //   ],
      // },
    ],
  },
  {
    id: 428473393327701440,
    created_at: '2022-10-05T05:40:44.140822+08:00',
    updated_at: '2022-10-05T05:40:44.147747+08:00',
    title: '云管平台',
    name: 'test6',
    kind: 'directory',
    display: true,
    priority: '6',
    icon: '',
    code: '8c4bcd59c6f8b92c',
    path: '/home/test6',
    component: 'LAYOUT',
    parent: null,
    children: [
      {
        id: 428485398566600100,
        created_at: '2022-10-05T07:39:59.821401+08:00',
        updated_at: '2022-10-05T07:39:59.832527+08:00',
        title: '平台资源',
        name: 'welcome',
        kind: 'directory',
        display: true,
        priority: '1.3',
        icon: '',
        code: '99503728eb500dec',
        path: '/welcome/index',
        component: '/welcome/index',
        parent: 428473020705734100,
      },
      {
        id: 428485417239641540,
        created_at: '2022-10-05T07:40:10.950764+08:00',
        updated_at: '2022-10-05T07:40:10.957664+08:00',
        title: '安全资源1',
        name: 'welcome1',
        kind: 'directory',
        display: true,
        priority: '1.4',
        icon: '',
        code: '0a329648b22f75c6',
        path: '/welcome/index1',
        component: '/welcome/index1',
        parent: 428473020705734100,
      },
      {
        id: 428485484130401700,
        created_at: '2022-10-05T07:40:50.820775+08:00',
        updated_at: '2022-10-05T07:40:50.827572+08:00',
        title: '阿里云资源',
        name: 'test9',
        kind: 'directory',
        display: true,
        priority: '1.5',
        icon: '',
        code: 'fccf6b58f2415697',
        path: '/home/test9',
        component: '',
        parent: 428473020705734100,
      },
    ],
  },
];
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
    subMenus: [],
  }),
  // 开启持久化
  persist: {
    key: 'app-permission',
    paths: ['subMenus'], // 指定数据持久化
  },
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    /** 清空菜单 */
    resetMenus() {
      this.backMenuList = [];
      this.subMenus = [];
    },
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
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
      let routes: AppRouteRecordRaw[] = [];
      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };
      let routeList: AppRouteRecordRaw[] = [];
      try {
        routeList = (await permmenu()) as AppRouteRecordRaw[];
      } catch (error) {
        console.error(error);
      }
      // Dynamically introduce components
      routeList = transformObjToRoute(cloneDeep(menusList1));
      // Background routing to menu structure
      const backMenuList = transformRouteToMenu(routeList);
      this.setBackMenuList(backMenuList);
      this.setCurrentRoute();
      // remove meta.ignoreRoute item
      routeList = filter(routeList, routeRemoveIgnoreFilter);
      routeList = routeList.filter(routeRemoveIgnoreFilter);
      routeList = flatMultiLevelRoutes(routeList);
      routes = [...Common, ...routeList];
      console.log('获取', routeList, routes);

      return routes;
    },
    // 设置当前选中二级路由
    async setCurrentRoute() {
      if (this.subMenus.length === 0) {
        this.subMenus = this.backMenuList[0].children;
        const routerPath = this.childrenRecursion(this.subMenus);
        router.replace(routerPath);
      }
    },
    childrenRecursion(arr: any): any {
      if (arr[0].children && arr[0].children.length > 0) {
        return this.childrenRecursion(arr[0].children);
      } else {
        return arr[0];
      }
    },
  },
});
