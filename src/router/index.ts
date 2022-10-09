import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue';
import outsideLayout from './outsideLayout';
import { createRouterGuards } from './router-guards';
import type { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    meta: {
      title: '',
    },
    children: [],
  },
  // Layout之外的路由
  ...outsideLayout,
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export async function setupRouter(app: any) {
  // 创建路由守卫
  createRouterGuards(router);

  app.use(router);

  // 路由准备就绪后挂载APP实例
  await router.isReady();
}

export default router;
