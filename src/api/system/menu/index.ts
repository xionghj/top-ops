import { request } from '@/utils/request';

/**
 * @description 获取菜单列表
 * @param {PermMenu} data
 * @returns
 */
export function getPermissionMenuList() {
  return request<API.MenuListResultItem>({
    url: 'permission/menu/',
    method: 'get',
  });
}
/**
 * @description 创建菜单
 * @param {PermMenu} data
 * @returns
 */
export function createMenu(data: API.MenuAddParams) {
  return request<API.MenuListResultItem>({
    url: 'permission/menu/',
    method: 'post',
    data,
  });
}
/**
 * @description 编辑菜单
 * @param {PermMenu} data
 * @returns
 */
export function updateMenu(id: number, data: API.MenuAddParams) {
  return request<API.MenuListResultItem>({
    url: `permission/menu/${id}`,
    method: 'put',
    data,
  });
}
/**
 * @description 删除菜单
 * @param {PermMenu} data
 * @returns
 */
export function deleteMenu(id: string) {
  return request<API.MenuListResultItem>({
    url: `permission/menu/${id}`,
    method: 'delete',
  });
}

/**
 * @description 获取收藏菜单列表
 * @param {PermMenu} data
 * @returns
 */
export function getMenuFavoriteList() {
  return request<API.MenuFavoriteListResult>({
    url: `/permission/menu/favorite/`,
    method: 'get',
  });
}
/**
 * @description 获取收藏菜单Id列表
 * @param {PermMenu} data
 * @returns
 */
export function getMenuFavoriteIdList() {
  return request<API.MenuFavoriteIdListResult>({
    url: `/permission/menu/favorite/?id=true`,
    method: 'get',
  });
}
/**
 * @description 设置收藏菜单
 * @param {PermMenu} data
 * @returns
 */
export function setMenuFavorite(id: string) {
  return request<API.MenuFavoriteListResult>({
    url: `/permission/menu/${id}/favorite/`,
    method: 'post',
  });
}
/**
 * @description 设置收藏菜单列表顺序
 * @param {MenuFavoriteOrder} data
 * @returns
 */
export function setMenuFavoriteOrder(data: API.MenuFavoriteOrderParams) {
  return request({
    url: `/permission/menu/favorite/`,
    method: 'post',
    data,
  });
}
