export const hostManage = {
  path: '/error',
  name: 'error',
  redirect: '/error/404',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '错误页',
    hideInMenu: true,
  },
  children: [
    {
      path: '/hostDetails',
      name: 'hostDetails',
      component: () =>
        import('@/views/resourceManage/infrastructure/hostManage/hostDetails/index.vue'),
      meta: {
        title: '主机详情',
      },
    },
  ],
};
export default [hostManage];
