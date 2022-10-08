import asyncRouterMap from './asyncModules/index';
import Common from './staticModules/index';
import router, { routes } from '@/router';
// 获取后台返回的菜单列表，和本地异步路由进行匹配
export const filterAsyncRoute = (menu: any, asyncRouterMap: any) => {
  if (menu) {
    console.log('执行了', menu, asyncRouterMap);
    const accessedRouters: any = [];
    Array.from(menu).forEach((item: any) => {
      asyncRouterMap &&
        Array.from(asyncRouterMap).forEach((asyncRouterItem: any) => {
          const tmp = { ...asyncRouterItem };
          const tempArr = accessedRouters;
          // 判断是不是没有code值和children项，没有的话就添加
          if (!tmp.code && !tmp.children) {
            const isRepeat = tempArr.filter((i: any) => {
              return i.name === tmp.name && i.path === tmp.path;
            });
            // 过滤重复的添加的路由
            if (!isRepeat.length) {
              accessedRouters.push(tmp);
            }
          }
          // 如果code和前端路由的code一致，那么添加的异步路由中
          if (tmp.code === item.code) {
            if (item.children && item.children.length) {
              tmp.children = filterAsyncRoute(item.children, tmp.children);
            }
            accessedRouters.push(tmp);
          }
        });
    });
    // console.log('递归过滤异步路由表，返回符合用户角色权限的路由表', accessedRouters)
    return accessedRouters;
  }
};
/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (asyncMenus: API.Menu[]) => {
  try {
    // console.log('asyncMenus', asyncMenus);
    const routeList = filterAsyncRoute(asyncMenus, asyncRouterMap);
    const layout = routes.find((item: any) => item.name == 'Layout')!;
    console.log(routeList, '根据后端返回的权限路由生成', layout);
    // 给公共路由添加namePath
    const menus = [...Common, ...routeList];
    // layout.children = menus;
    // const removeRoute = router.addRoute(layout);
    // // 获取所有没有包含children的路由，上面addRoute的时候，vue-router已经帮我们拍平了所有路由
    // const filterRoutes = router.getRoutes().filter((item: any) => (!item.children.length || Object.is(item.meta?.hideChildrenInMenu, true)));
    // // 清空所有路由
    // removeRoute();
    // layout.children = [...filterRoutes];
    // // 重新添加拍平后的路由
    // router.addRoute(layout);
    // console.log('所有路由', router.getRoutes());

    return Promise.resolve({
      menus,
    });
  } catch (error) {
    console.error('生成路由时出错', error);
    return Promise.reject(`生成路由时出错: ${error}`);
  }
};
