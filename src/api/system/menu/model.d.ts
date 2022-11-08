declare namespace API {
  /** 获取菜单列表参数 */
  type MenuListResult = MenuListResultItem[];
  type MenuListResultItem = {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    name: string;
    kind: string;
    display: boolean;
    icon: string;
    code: string;
    path: string;
    component: string;
    parent: string;
  };

  /** 新增编辑菜单参数 */
  type MenuAddParams = {
    id: string;
    name: string;
    title: string;
    kind: string;
    path: string;
    component: string;
    priority: string;
    parent: string;
    display: boolean;
  };

  /** 获取菜单收藏列表数据 */
  type MenuFavoriteListResult = MenuFavoriteListItem[];
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
  /** 获取菜单收藏Id列表数据 */
  type MenuFavoriteIdListResult = string[];
  /** 更新某项菜单参数 */
  type MenuFavoriteIdParams = {
    id: boolean;
  };
  /** 设置菜单收藏成功返回的数据 */
  type SetMenuFavoriteIdResult = {
    detail: string;
  };
  /** 菜单收藏顺序 */
  type MenuFavoriteOrderParams = {
    related_ids: string[];
  };
}
