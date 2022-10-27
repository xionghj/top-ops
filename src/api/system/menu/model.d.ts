declare namespace API {
  type MenuListResultItem = {
    createTime: string;
    updatedAt: string;
    id: number;
    parentId: number;
    name: string;
    router: string;
    perms: string;
    /** 0: '目录', 1: '菜单', 2: '权限'  */
    type: number;
    icon: string;
    orderNum: number;
    viewPath: string;
    keepalive: boolean;
    isShow: boolean;
    keyPath?: number[];
  };

  /** 获取菜单列表参数 */
  type MenuListResult = MenuListResultItem[];

  /** 新增编辑菜单参数 */
  type MenuAddParams = {
    id: string,
    name: string,
    title: string,
    kind: string,
    path: string,
    component: string,
    priority: string,
    parent: string,
    display: boolean,
  };

  /** 更新某项菜单参数 */
  type MenuUpdateParams = MenuAddParams & {
    menuId: number;
  };

  /** 获取菜单详情结果 */
  type MenuInfoResult = {
    menu: {
      createTime: string;
      updateTime: string;
      id: number;
      parentId: number;
      name: string;
      router: string;
      perms: string;
      type: number;
      icon: string;
      orderNum: number;
      viewPath: string;
      keepalive: boolean;
      isShow: boolean;
    };
    parentMenu: {
      createTime: string;
      updateTime: string;
      id: number;
      parentId: number;
      name: string;
      router: string;
      perms: string;
      type: number;
      icon: string;
      orderNum: number;
      viewPath: string;
      keepalive: boolean;
      isShow: boolean;
    };
  };

  /** 获取菜单详情结果 */
  type MenuFavorite = {
    id: string;
  }
  type MenuFavoriteListItem = {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    name: string;
    kind: string;
    display: string;
    priority: string;
    icon: string;
    code: string;
    path: string;
    component: string;
    parent: number;
  };
  /** 获取菜单收藏列表参数 */
  type MenuFavoriteListResult = MenuFavoriteListItem[];
  /** 获取菜单收藏Id列表参数 */
  type MenuFavoriteIdListResult = string [];
  /** 更新某项菜单参数 */
  type MenuFavoriteIdParams = {
    id: boolean;
  };
  /** 菜单收藏顺序 */
  type MenuFavoriteOrderParams = {
    related_ids: string [];
  };
}
