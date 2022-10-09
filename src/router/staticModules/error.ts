export const notFound = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  meta: {
    title: 'NotFound',
    hideInMenu: true,
  },
  redirect: '/error/404',
  component: () => import('@/layout/index.vue'),
  children: [],
};
export const errorRoute = {
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
      path: '404',
      name: 'PageNotFound',
      meta: {
        title: '404',
      },
      component: () => import('@/views/error/404.vue'),
    },
  ],
};
export default [notFound, errorRoute];
