export const resourceManage = {
  path: '/resourceManage',
  name: 'resourceManage',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '资源管理',
  },
  code: 'ca6f0d4316645473',
  children: [
    {
      path: 'applicationResources',
      name: 'applicationResources',
      code: 'c24fc7a5d5d91db9',
      component: () => import('@/views/welcome/index.vue'),
      meta: {
        title: '应用资源',
      },
      children: [
        {
          path: 'businessTree',
          name: 'businessTree',
          code: 'c24fc7a5d5d91db9',
          component: () => import('@/views/welcome/index.vue'),
          meta: {
            title: '业务树',
          },
        },
        {
          path: 'applicationManagement',
          name: 'applicationManagement',
          code: 'c24fc7a5d5d91db9',
          component: () => import('@/views/welcome/index.vue'),
          meta: {
            title: '应用管理',
          },
        },
      ],
    },
    {
      path: 'basicResources',
      name: 'basicResources',
      code: 'c24fc7a5d5d91db9',
      component: () => import('@/views/welcome/index.vue'),
      meta: {
        title: '基础资源',
      },
    },
    {
      path: 'platformResources',
      name: 'platformResources',
      code: 'c24fc7a5d5d91db9',
      component: () => import('@/views/welcome/index.vue'),
      meta: {
        title: '平台资源',
      },
    },
  ],
};
export default [resourceManage];
