export const hostManage = {
  path: '/hostDetails',
  name: 'hostDetails',
  component: () => import('@/views/resourceManage/infrastructure/hostManage/hostDetails/index.vue'),
  meta: {
    title: '主机详情',
  },
};
export default [hostManage];