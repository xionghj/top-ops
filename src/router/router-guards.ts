import NProgress from 'nprogress'; // progress bar
import { message as $message } from 'ant-design-vue';
import type { Router } from 'vue-router';
import { to as _to } from '@/utils/awaitTo';
import { useUserStore } from '@/store/modules/user';
import 'nprogress/nprogress.css'; // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration

export function createRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (to.path == '/login') {
      // 登录或者注册才可以往下进行
      next();
    } else {
      // 获取 token
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      if (token) {
        if (to.name === 'login') {
          $message.error('您还没有登录，请先登录');
          next({ path: '/login' });
        } else {
          const hasRoute = router.hasRoute(to.name!);
          console.log('获取菜单', userStore.menus);
          if (userStore.menus.length === 0) {
            // 从后台获取菜单
            const [err] = await _to(userStore.afterLogin());
            if (err) {
              userStore.resetToken();
              console.log('获取token', token, err);
              return next({ name: 'login' });
            }
            if (!hasRoute) {
              // 如果该路由不存在，可能是动态注册的路由，它还没准备好，需要再重定向一次到该路由
              next({ ...to, replace: true });
            } else {
              next();
            }
          } else {
            next();
          }
        }
      } else {
        // not login
        next({ name: 'login' });
      }
    }
  });
  router.afterEach(() => {
    NProgress.done();
  });
  router.onError((error) => {
    console.log(error, '路由错误');
  });
}
