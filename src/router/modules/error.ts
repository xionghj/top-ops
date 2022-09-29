import Layout from '@/layout/index.vue';

export default {
  path: '/error',
  name: 'error/404',
  component: Layout,
  meta: {
    title: '错误页',
  },
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
