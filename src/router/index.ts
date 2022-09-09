import { createRouter, createWebHistory } from 'vue-router';
import Common from './modules/common';

const routes = [...Common];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 全局前置路由守卫，每一次路由跳转前都进入这个 beforeEach 函数
 */
router.beforeEach((to, from, next) => {
  if (to.path == '/home') {
    // 登录或者注册才可以往下进行
    next();
  } else {
    // 获取 token
    const token = localStorage.getItem('token');
    // token 不存在
    if (token === null || token === '') {
      next();
    } else {
      next();
    }
  }
});

export default router;
