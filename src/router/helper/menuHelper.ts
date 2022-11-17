import { cloneDeep } from 'lodash-es';
import type { MenuModule, Menu, AppRouteRecordRaw } from '@/router/types';
import { AppRouteModule } from '@/router/types';
import { treeMap } from '@/utils/helper/treeHelper';
import { isUrl } from '@/utils/is';

function joinParentPath(menus: Menu[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // https://next.router.vuejs.org/guide/essentials/nested-routes.html
    // Note that nested paths that start with / will be treated as a root path.
    // This allows you to leverage the component nesting without having to use a nested URL.
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      // path doesn't start with /, nor is it a url, join parent path
      menu.path = `${parentPath}/${menu.path}`;
    }
    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path);
    }
  }
}

// Parsing the menu module
export function transformMenuModule(menuModule: MenuModule): Menu {
  const { menu } = menuModule;

  const menuList = [menu];

  joinParentPath(menuList);
  return menuList[0];
}

export function transformRouteToMenu(routeModList: AppRouteModule[], routerMapping = false) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: AppRouteRecordRaw[] = [];

  cloneRouteModList.forEach((item) => {
    if (routerMapping && item.meta?.hideChildrenInMenu && typeof item.redirect === 'string') {
      item.path = item.redirect;
    }
    if (item.meta?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  const list = treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { name, title, display, kind, id } = node;
      return {
        ...(node.meta || {}),
        meta: {
          title,
          display,
          kind,
        },
        id,
        name,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });
  joinParentPath(list);
  return cloneDeep(list);
}
