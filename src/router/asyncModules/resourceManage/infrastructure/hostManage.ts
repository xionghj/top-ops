// export const hostManage = {
//   path: '/hostDetails',
//   name: 'hostDetails',
//   component: () => import('@/layout/index.vue'),
//   redirect: '/hostDetails',
//   children: [
//     {
//       path: '/hostDetails',
//       name: 'hostDetails',
//       component: () =>
//         import('@/views/resourceManage/infrastructure/hostManage/hostDetails/index.vue'),
//       meta: {
//         title: '主机详情',
//         hideInMenu: true,
//         code: 'd2eb72dddea853a5',
//       },
//     },
//   ],
// };
export const hostDetails = {
  title: '主机详情',
  name: 'hostDetails',
  activeMenu: 'p',
  kind: 'menu',
  display: false,
  priority: '1.2.1',
  icon: '',
  code: 'd2eb72dddea853a5',
  path: 'hostDetails',
  component: '/resourceManage/infrastructure/hostManage/hostDetails/index',
};
// export const hostDetails1 = {
//   path: '/hostDetails1',
//   name: 'hostDetails1',
//   code: '8ed49b05a641999a',
//   component: () => import('@/views/resourceManage/infrastructure/hostManage/hostDetails/index.vue'),
//   meta: {
//     title: '主机详情1',
//   },
// };
export default [hostDetails];
