import type { BaseResponse } from '@/utils/request';
import { request } from '@/utils/request';

/**
 * @description 登录
 * @param {LoginParams} data
 * @returns
 */
export function login(data: API.LoginParams) {
  return request<API.LoginResult>(
    {
      url: 'api/token/',
      method: 'post',
      data,
    },
    {
      isGetDataDirectly: false,
    },
  );
}
/**
 * @description 获取权限菜单树
 * @returns
 */
export function getPermissionMenu() {
  return request<API.PermissionMenuResult>({
    url: 'permission/menu/tree/',
    method: 'get',
  });
}
