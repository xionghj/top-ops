import { notFound } from './error';
/**
 * layout布局之外的路由
 */
export const LoginRoute = {
  path: '/login',
  name: 'login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
  },
};
const Common = [LoginRoute, notFound];

export default Common;
