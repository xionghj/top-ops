// export const developEfficiency = {
//   path: '/welcome',
//   component: () => import('@/layout/index.vue'),
//   meta: {
//     title: '欢迎',
//   },
//   code: 'ca6f0d4316645473',
//   children: [
//     {
//       path: 'index',
//       name: 'welcome',
//       code: 'c24fc7a5d5d91db9',
//       component: () => import('@/views/welcome/index.vue'),
//       meta: {
//         title: '欢迎',
//       },
//     },
//     {
//       path: 'home',
//       name: 'home',
//       code: 'c24fc7a5d5d91db9',
//       component: () => import('@/views/home/index.vue'),
//       meta: {
//         title: '首页',
//       },
//     },
//   ],
// };
export const developEfficiency = {
  path: '/developEfficiency',
  name: 'developEfficiency',
  meta: {
    title: '研发效能',
  },
  code: 'ca6f0d4316645473',
  children: [
    {
      path: 'continuousIntegration',
      name: 'continuousIntegration',
      code: 'c24fc7a5d5d91db9',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '持续集成',
      },
    },
  ],
};
export default [developEfficiency];
