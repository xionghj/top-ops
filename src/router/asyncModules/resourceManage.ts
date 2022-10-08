export const resourceManage = {
  path: '/welcome',
  meta: {
    title: '欢迎',
  },
  code: 'ca6f0d4316645473',
  children: [
    {
      path: '/welcome',
      name: '/welcome',
      code: 'c24fc7a5d5d91db9',
      component: () => import('@/views/welcome/index.vue'),
      meta: {
        title: '首页',
      },
    },
  ],
};
export default [resourceManage];
