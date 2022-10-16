import { defineStore } from 'pinia';
import jwtDecode from 'jwt-decode';
import { RouteRecordRaw } from 'vue-router';
import { login, permmenu } from '@/api/login';
import { generatorDynamicRouter } from '@/router/generator-router';
import { usePermissionStore } from '@/store/modules/permission';
import router from '@/router';

interface UserState {
  token: string;
  refreshToken: string;
  name: string;
  avatar: string;
  menus: [];
  subMenus: [];
  userInfo: object;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: '',
    refreshToken: '',
    name: 'amdin',
    avatar: '',
    menus: [],
    subMenus: [], // 子菜单
    userInfo: {},
  }),
  // 开启持久化
  persist: {
    key: 'user',
    paths: ['subMenus'], // 指定数据持久化
  },
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getName(): string {
      return this.name;
    },
  },
  actions: {
    /** 清空token及用户信息 */
    resetToken() {
      this.menus = [];
      this.subMenus = [];
      this.userInfo = {};
    },
    /** 登录成功保存token */
    setToken(access: string, refresh: string) {
      this.token = access ?? '';
      this.refreshToken = refresh ?? '';
      const decodeToken = jwtDecode(access);
      this.name = decodeToken.name;
      localStorage.setItem('ACCESS_TOKEN_KEY', access);
    },
    /** 登录 */
    async login(params: API.LoginParams) {
      try {
        const result = await login(params);
        this.setToken(result.access, result.refresh);
        // this.afterLogin();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {
      try {
        // const result = await permmenu();
        // 生成路由
        // const generatorResult = await generatorDynamicRouter(result);
        // this.menus = generatorResult.menus.filter((item: any) => !item.meta?.hideInMenu);
        const permissionStore = usePermissionStore();
        const routes = await permissionStore.buildRoutesAction();
        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        this.menus = routes;
        this.setCurrentRoute();
        // router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
        console.log('获取得菜单数据', routes, router.getRoutes());
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 登出 */
    async logout() {
      this.resetToken();
    },
    // 设置当前流水线
    async setCurrentRoute() {
      const userPermissionStore = usePermissionStore();
      if (this.subMenus.length === 0) {
        this.subMenus = userPermissionStore.backMenuList[0].children;
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
