import type { BaseResponse } from '@/utils/request';
import { request } from '@/utils/request';

/**
 * @description 登录
 * @param {LoginParams} data
 * @returns
 */
export function login(data: API.LoginParams) {
  return request<BaseResponse<API.LoginResult>>(
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
export function permmenu() {
  return request<API.PermMenu>({
    url: 'permission/menu/tree/',
    method: 'get',
  });
}
