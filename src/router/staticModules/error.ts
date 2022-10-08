export const notFound = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '错误页',
  },
  redirect: '/error/404',
  children: [
    {
      path: '404',
      name: '404',
      component: () => import('@/views/error/404.vue'),
      meta: {
        title: '错误页',
      },
    },
  ],
};
export default [notFound];
