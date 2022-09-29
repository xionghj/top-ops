import Layout from '@/layout/index.vue';

const home = {
  path: '/',
  component: Layout,
  meta: {
    title: '首页',
  },
  code: 'ca6f0d4316645473',
  children: [
    {
      path: '/home',
      name: 'home',
      code: 'c24fc7a5d5d91db9',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
      },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页1',
      },
    },
  ],
};

const login = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
];

const Common = [home, ...login];

export default Common;
