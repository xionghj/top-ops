import { defineStore } from 'pinia';
import jwtDecode from 'jwt-decode';
import { login } from '@/api/login';

interface UserState {
  token: string;
  refreshToken: string;
  name: string;
  avatar: string;
  menus: [];
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
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
