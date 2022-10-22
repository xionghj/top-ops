import { defineStore } from 'pinia';
import jwtDecode from 'jwt-decode';
import { RouteRecordRaw } from 'vue-router';
import { login, getPermissionMenu } from '@/api/login';
import { generatorDynamicRouter } from '@/router/generator-router';
import { usePermissionStore } from '@/store/modules/permission';
import { useMenuFavoriteStore } from '@/store/modules/menuFavorite';
import router from '@/router';

type UserInfo = {
  exp: number;
  iat: number;
  jti: string;
  name: string;
  token_type: string;
  user_id: string;
};
interface Meta {
  title: string;
  display: boolean;
}
type Menu = {
  id: number;
  meta: Meta;
  name: string;
  path: string;
};

interface UserState {
  token: string;
  refreshToken: string;
  userInfo: Partial<UserInfo>;
  recentlyVisited: Menu[];
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: '',
    refreshToken: '',
    userInfo: {},
    recentlyVisited: [], // 最近访问
  }),
  // 开启持久化
  persist: {
    key: 'user',
    paths: ['userInfo', 'recentlyVisited'], // 指定数据持久化
  },
  getters: {
    getToken(): string {
      return this.token;
    },
  },
  actions: {
    /** 清空token及用户信息 */
    resetToken() {
      this.userInfo = {};
      this.recentlyVisited = [];
      const permissionStore = usePermissionStore();
      permissionStore.resetMenus();
    },
    /** 登录成功保存token */
    setToken(access: string, refresh: string) {
      this.token = access ?? '';
      this.refreshToken = refresh ?? '';
      const decodeToken: UserInfo = jwtDecode(access);
      this.userInfo = decodeToken;
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
        // const result = await getPermissionMenu();
        // 生成路由
        const permissionStore = usePermissionStore();
        const routes = await permissionStore.buildRoutesAction();
        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        // router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
        const menuFavoriteStore = useMenuFavoriteStore();
        await menuFavoriteStore.getMenuFavoriteList();
        console.log('获取得菜单数据', routes, router.getRoutes());
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 设置最近访问 */
    setRecentlyVisited(item: Menu) {
      for (let i = 0; i < this.recentlyVisited.length; i++) {
        if (this.recentlyVisited[i].id == item.id) {
          this.recentlyVisited.splice(0, 0, this.recentlyVisited.splice(i, 1)[0]);
          return;
        }
      }
      if (this.recentlyVisited.length > 6) {
        this.recentlyVisited.unshift(item);
        this.recentlyVisited.pop();
      } else {
        this.recentlyVisited.unshift(item);
      }
    },
    /** 登出 */
    async logout() {
      this.resetToken();
    },
  },
});
