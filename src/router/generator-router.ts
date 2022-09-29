// 获取后台返回的菜单列表，和本地异步路由进行匹配
export const generatorDynamicRouter = (menu: any, asyncRouterMap: any) => {
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
              tmp.children = generatorDynamicRouter(item.children, tmp.children);
            }
            accessedRouters.push(tmp);
          }
        });
    });
    // console.log('递归过滤异步路由表，返回符合用户角色权限的路由表', accessedRouters)
    return accessedRouters;
  }
};
