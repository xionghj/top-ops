import { createRouter, createWebHistory } from 'vue-router';
import { message as $message } from 'ant-design-vue';
import Common from './modules/common';
import Error from './modules/error';
import { useUserStore } from '@/store/modules/user';
import { to as _to } from '@/utils/awaitTo';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration
export const routes = [Error, ...Common];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 全局前置路由守卫，每一次路由跳转前都进入这个 beforeEach 函数
 */
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const userStore = useUserStore();
  if (to.path == '/login') {
    // 登录或者注册才可以往下进行
    next();
  } else {
    // 获取 token
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    // token 不存在
    if (token === null || token === '') {
      $message.error('您还没有登录，请先登录');
      next('/login');
    } else {
      await _to(userStore.afterLogin());
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
