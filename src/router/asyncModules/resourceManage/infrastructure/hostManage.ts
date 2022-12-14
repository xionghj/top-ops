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
  activeMenu: 'hostManage',
  kind: 'menu',
  display: false,
  priority: '1.2.1',
  icon: '',
  code: 'd2eb72dddea853a5',
  path: 'hostDetails',
  component: '/resourceManage/infrastructure/hostManage/hostDetails/index',
};
export const userDetails = {
  title: '用户详情',
  name: 'userDetails',
  activeMenu: 'UserManage',
  kind: 'menu',
  display: false,
  priority: '1.2.1',
  icon: '',
  code: '66e0135555995909',
  path: 'userDetails',
  component: '/resourceManage/infrastructure/hostManage/hostDetails/index',
};

export default [hostDetails, userDetails];
