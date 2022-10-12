import { defineStore } from 'pinia';
import jwtDecode from 'jwt-decode';
import { login, permmenu } from '@/api/login';
import { generatorDynamicRouter } from '@/router/generator-router';
import { usePermissionStore } from '@/store/modules/permission';

interface UserState {
  token: string;
  refreshToken: string;
  name: string;
  avatar: string;
  menus: [];
  oriMenus: [];
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
    oriMenus: [],
    userInfo: {},
  }),
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
      this.avatar = this.token = this.name = '';
      this.menus = [];
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
        this.afterLogin();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {
      try {
        const result = await permmenu();
        // 生成路由
        const generatorResult = await generatorDynamicRouter(result);
        this.menus = generatorResult.menus.filter((item: any) => !item.meta?.hideInMenu);
        this.oriMenus = result;
        const permissionStore = usePermissionStore();
        const routes = await permissionStore.buildRoutesAction();
        console.log('获取得菜单数据', this.menus, result, routes);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
