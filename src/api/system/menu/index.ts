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
 * @description 编辑菜单
 * @param {PermMenu} data
 * @returns
 */
export function deleteMenu(id: string) {
  return request<API.MenuListResultItem>({
    url: `permission/menu/${id}`,
    method: 'delete',
  });
}
