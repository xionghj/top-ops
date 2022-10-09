import type { RouteRecordRaw } from 'vue-router';

/**
 * layout布局之外的路由
 */
export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
  },
};

export default [LoginRoute];
