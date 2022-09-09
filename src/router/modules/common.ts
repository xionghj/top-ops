import Layout from '@/layout/index.vue';

const home = {
  path: '/',
  component: Layout,
  meta: {
    title: '首页',
  },
  redirect: {
    name: 'home',
  },
  children: [
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
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
